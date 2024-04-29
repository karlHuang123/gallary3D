import CloseIcon from '@/components/icons/Close'
import { DeptItem } from '@/services/getDepts'
import { useGalleryQuery } from '@/services/getWorks'
import styles from './index.module.css'

export interface DeptsProps {
  visible: boolean
  onClose: () => void
  onDeptClick: (deptId: ID) => void
}

const Depts: React.FC<DeptsProps> = (props) => {
  const { visible, onClose, onDeptClick } = props
  const galleryData = useGalleryQuery()

  return (
    <div className={styles.bg} data-visible={visible}>
      <div className={styles.list}>
        {galleryData?.depts?.map((d: DeptItem) => {
          const { id, name, productNum } = d
          return (
            <div
              key={id}
              className={styles.item}
              onClick={() => onDeptClick(id)}
            >
              <div className={styles.name}>{name}</div>
              <div className={styles.num}>{productNum}</div>
            </div>
          )
        })}
      </div>
      <div className={styles.close} onClick={onClose}>
        <CloseIcon color="#ffffff" />
      </div>
    </div>
  )
}

export default Depts
