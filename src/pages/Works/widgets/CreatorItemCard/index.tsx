import { CreatorWithWorkInfo } from '@/services/getWorks'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.css'

export interface CreatorItemCardProps {
  creator: CreatorWithWorkInfo
}

const CreatorItemCard: React.FC<CreatorItemCardProps> = ({ creator }) => {
  const avatar = {
    backgroundImage: `url(${creator.headImageUrl})`,
  }

  const navigate = useNavigate()

  return (
    <div
      className={styles.container}
      style={avatar}
      onClick={() => navigate(`/work-info/creator/${creator.works[0]}`)}
    >
      <div className={styles.name}>{creator.name}</div>
    </div>
  )
}

export default CreatorItemCard
