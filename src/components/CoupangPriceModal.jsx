import { useEffect, useState } from 'react'
import * as shoppingApi from '../api/shopping'
import Modal from './Modal'
import './CoupangPriceModal.css'

export default function CoupangPriceModal({ keyword, onClose }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    shoppingApi
      .searchCoupangProducts(keyword)
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [keyword])

  return (
    <Modal title={`쿠팡 최저가 · ${keyword}`} onClose={onClose} width={480}>
      <p className="coupang-disclaimer">쿠팡 파트너스 활동의 일환으로 일정액의 수수료를 제공받을 수 있습니다.</p>

      {loading && <p className="coupang-hint">검색 중...</p>}
      {error && <div className="form-error">{error}</div>}
      {!loading && !error && products.length === 0 && (
        <p className="coupang-hint">검색 결과가 없어요.</p>
      )}

      <ul className="coupang-list">
        {products.map((product) => (
          <li key={product.productId} className="coupang-item">
            <img src={product.imageUrl} alt={product.name} className="coupang-item-image" />
            <div className="coupang-item-main">
              <span className="coupang-item-name">{product.name}</span>
              <span className="coupang-item-price">{product.price.toLocaleString('ko-KR')}원</span>
              <span className="coupang-item-badges">
                {product.isRocket && <span className="coupang-badge coupang-badge--rocket">🚀 로켓</span>}
                {product.isFreeShipping && <span className="coupang-badge">무료배송</span>}
              </span>
            </div>
            <a
              href={product.productUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost coupang-item-link"
            >
              보러가기 ↗
            </a>
          </li>
        ))}
      </ul>
    </Modal>
  )
}
