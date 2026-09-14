import { useEffect, useState } from 'react'
import * as recipeApi from '../api/recipe'
import Modal from './Modal'
import '../styles/forms.css'
import './YoutubeSearchModal.css'

export default function YoutubeSearchModal({ fridgeId, onClose, onImported }) {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')
  const [importingId, setImportingId] = useState(null)

  function runSearch(kw) {
    setLoading(true)
    setError('')
    recipeApi
      .searchYoutubeRecipes(fridgeId, kw || undefined)
      .then((data) => {
        setResults(data)
        setSearched(true)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    // 처음 열리면 키워드 없이 검색 -> 백엔드가 냉장고 재료 이름으로 자동 검색한다.
    runSearch('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSearchSubmit(event) {
    event.preventDefault()
    runSearch(keyword.trim())
  }

  async function handleImport(video) {
    setImportingId(video.videoId)
    setError('')
    try {
      const recipe = await recipeApi.importYoutubeVideo(video.videoId)
      onImported(recipe)
    } catch (err) {
      setError(err.message)
    } finally {
      setImportingId(null)
    }
  }

  return (
    <Modal title="유튜브 레시피 찾기" onClose={onClose} width={600}>
      <form onSubmit={handleSearchSubmit} className="youtube-search-form">
        <input
          className="input"
          placeholder="검색어 (비워두면 냉장고 재료로 자동 검색)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          검색
        </button>
      </form>

      {error && <div className="form-error">{error}</div>}

      {loading ? (
        <p className="form-hint">검색 중...</p>
      ) : results.length === 0 ? (
        <p className="form-hint">
          {searched ? '검색 결과가 없어요.' : '검색어를 입력하거나 그대로 검색해보세요.'}
        </p>
      ) : (
        <ul className="youtube-search-results">
          {results.map((video) => (
            <li key={video.videoId} className="youtube-search-item">
              <img src={video.thumbnailUrl} alt="" className="youtube-search-thumb" />
              <div className="youtube-search-info">
                <p className="youtube-search-title">{video.title}</p>
                <p className="youtube-search-channel">{video.channelTitle}</p>
              </div>
              <button
                type="button"
                className="btn btn-primary youtube-search-import-btn"
                onClick={() => handleImport(video)}
                disabled={importingId !== null}
              >
                {importingId === video.videoId ? '가져오는 중...' : '레시피로 가져오기'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}
