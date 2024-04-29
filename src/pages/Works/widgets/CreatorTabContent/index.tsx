import { useMemo } from 'react'
import { CreatorWithWorkInfo, useGalleryQuery } from '@/services/getWorks'
import CreatorItemCard from '../CreatorItemCard'
import styles from './index.module.css'

export interface CreatorTabContentProps {
  deptFilter?: ID
}

const CreatorTabContent: React.FC<CreatorTabContentProps> = ({
  deptFilter = 'none',
}) => {
  const galleryData = useGalleryQuery()

  const filtered: CreatorWithWorkInfo[] = useMemo(() => {
    const allCreators = galleryData?.creators ?? []
    if (deptFilter === 'none') {
      return allCreators
    }
    return allCreators.filter((c) => c.depts.includes(deptFilter))
  }, [galleryData, deptFilter])

  return (
    <div className={styles.container}>
      {filtered.map((creator) => {
        return <CreatorItemCard key={creator.id} creator={creator} />
      })}
    </div>
  )
}

export default CreatorTabContent
