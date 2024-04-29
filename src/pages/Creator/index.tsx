import { useGalleryQuery } from '@/services/getWorks'
import { useParams } from 'react-router-dom'
import styles from './index.module.css'

const Creator: React.FC = () => {
  const { workId } = useParams()

  const galleryData = useGalleryQuery()

  const work = galleryData?.workDic?.get(Number(workId))

  if (!work) {
    return null
  }

  const { creator } = work

  return (
    <div className={styles.container}>
      <div className={styles.infomation}>
        <div className={styles.name}>{creator.name}</div>
        <div className={styles.org}>{creator.collegeName}</div>
        <div className={styles.degree}>{creator.degree}</div>
        <div className={styles.info}>{creator.awards}</div>
      </div>
      <div
        className={styles.avatar}
        style={{
          backgroundImage: `url(${creator.headImageUrl})`,
        }}
      />
    </div>
  )
}

export default Creator
