import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as fridgeApi from '../api/fridge'
import { useAuth } from './AuthContext'

const FridgeContext = createContext(null)

export function FridgeProvider({ children }) {
  const { status } = useAuth()
  const [fridges, setFridges] = useState([])
  const [selectedFridgeId, setSelectedFridgeId] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshFridges = useCallback(async () => {
    setLoading(true)
    try {
      const list = await fridgeApi.getMyFridges()
      setFridges(list)
      setSelectedFridgeId((current) => {
        if (current && list.some((f) => f.id === current)) return current
        return list[0]?.id ?? null
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'authenticated') {
      refreshFridges()
    } else if (status === 'guest') {
      setFridges([])
      setSelectedFridgeId(null)
      setLoading(false)
    }
  }, [status, refreshFridges])

  const createFridge = useCallback(
    async (name) => {
      const fridge = await fridgeApi.createFridge(name)
      await refreshFridges()
      setSelectedFridgeId(fridge.id)
      return fridge
    },
    [refreshFridges]
  )

  const selectedFridge = useMemo(
    () => fridges.find((f) => f.id === selectedFridgeId) ?? null,
    [fridges, selectedFridgeId]
  )

  const value = useMemo(
    () => ({
      fridges,
      loading,
      selectedFridgeId,
      selectedFridge,
      setSelectedFridgeId,
      refreshFridges,
      createFridge,
    }),
    [fridges, loading, selectedFridgeId, selectedFridge, refreshFridges, createFridge]
  )

  return <FridgeContext.Provider value={value}>{children}</FridgeContext.Provider>
}

export function useFridge() {
  const ctx = useContext(FridgeContext)
  if (!ctx) throw new Error('useFridge must be used within FridgeProvider')
  return ctx
}
