import styles from './index.module.css'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import loadingGif from '@/assets/default.gif'
import { WorkWithCreatorInfo } from '@/services/getWorks'
import { useNavigate } from 'react-router-dom'

export interface WorkItemProps {
  work: WorkWithCreatorInfo
}

const WorkItemCard: React.FC<WorkItemProps> = (props) => {
  const { work } = props
  const { creator } = work

  const navigate = useNavigate()

  return (
    <div
      className={styles.container}
      onClick={() => navigate(`/work-info/detail/${work.id}`)}
    >
      <LazyLoadImage
        wrapperClassName={styles.imgWrapper}
        className={styles.img}
        alt={work.name}
        src={work.livePicUrl}
        placeholderSrc={loadingGif}
      />
      <div className={styles.footer}>
        <div
          className={styles.avatar}
          style={{
            backgroundImage: `url(${creator?.headImageUrl})`,
          }}
        ></div>
        <div className={styles.info}>
          <div className={styles.name}>{work.name}</div>
          <div className={styles.org}>
            <div className={styles.orgName}>作者：{creator?.name}</div>
            <div className={styles.operation}>
              <div className={styles.view}>{work.readNum}</div>
              <div className={styles.like}>{work.goodNum}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkItemCard
