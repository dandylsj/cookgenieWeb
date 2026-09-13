import { formatDday, getExpiryUrgency } from '../utils/expiry'
import './ExpiryBadge.css'

export default function ExpiryBadge({ expiryDate }) {
  const urgency = getExpiryUrgency(expiryDate)
  return <span className={`expiry-badge expiry-badge--${urgency}`}>{formatDday(expiryDate)}</span>
}
