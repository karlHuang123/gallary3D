import { useMemo } from 'react'
import styles from './index.module.css'
import WorkItemCard from '../WorkItemCard'
import { useGalleryQuery } from '@/services/getWorks'
import { useControllableValue } from '@/hooks/useControllableValue'

export type SortType = 'default' | 'readNum' | 'likeNum'

export interface WorkTabContentProps {
  sortType: SortType
  onSortTypeChange: (sortType: SortType) => void
  deptFilter?: ID
}

const WorkTabContent: React.FC<WorkTabContentProps> = (props) => {
  const { sortType, onSortTypeChange, deptFilter } = props

  const galleryData = useGalleryQuery()
  const [controllableSortType, setControllableSortType] = useControllableValue<
    SortType,
    HTMLDivElement,
    any
  >(sortType, undefined, (_e, newValue) => {
    onSortTypeChange(newValue ? newValue : 'default')
  })

  const sortedWorks = useMemo(() => {
    let works = galleryData?.works ?? []
    if (deptFilter !== 'none') {
      works = works.filter((w) => w.catalogId === deptFilter)
    }
    if (controllableSortType === 'likeNum') {
      return works.sort((a, b) => b.goodNum - a.goodNum)
    }
    if (controllableSortType === 'readNum') {
      return works.sort((a, b) => b.readNum - a.readNum)
    }
    return works
  }, [galleryData, controllableSortType, deptFilter])

  return (
    <>
      <div className={styles.orderBtns}>
        <div
          className={styles.orderByView}
          data-active={controllableSortType === 'readNum'}
          onClick={() =>
            setControllableSortType((t) =>
              t === 'readNum' ? 'default' : 'readNum'
            )
          }
        ></div>
        <div
          className={styles.orderByLike}
          data-active={controllableSortType === 'likeNum'}
          onClick={() =>
            setControllableSortType((t) =>
              t === 'likeNum' ? 'default' : 'likeNum'
            )
          }
        ></div>
      </div>
      <div className={styles.listWrapper}>
        {sortedWorks.map((work) => {
          return <WorkItemCard key={work.id} work={work} />
        })}
      </div>
    </>
  )
}

export default WorkTabContent
