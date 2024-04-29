import styles from './index.module.css'
import { useState } from 'react'
import MenuIcon from '../../components/icons/MenuIcon'
import ChevronLeft from '../../components/icons/ChevronLeft'
import WorkTabContent, { SortType } from './widgets/WorkTabContent'
import CreatorTabContent from './widgets/CreatorTabContent'
import { useGalleryQuery } from '@/services/getWorks'

export enum Tab {
  WORK,
  CREATOR,
}

const Works: React.FC = () => {
  const [tab, setTab] = useState<Tab>(Tab.WORK)
  const [listVisible, setListVisible] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<SortType>('default')
  const [deptFilter, setDeptFilter] = useState<ID>('none')

  const galleryData = useGalleryQuery()

  function toggleList() {
    setListVisible((v) => !v)
  }

  return (
    <div className={styles.container}>
      <div className={styles.banner}></div>
      <div className={styles.title}>
        <div className={styles.all}>全部</div>
        <div className={styles.btnCatalog} onClick={toggleList}>
          <div style={{ marginRight: 2 }}>目录</div>
          <MenuIcon size={21} />
        </div>
      </div>
      <div className={styles.desktopBar}>
        <div className={styles.dItem}>
          <MenuIcon />
        </div>
        <div
          className={styles.dItem}
          data-active={tab === Tab.WORK}
          onClick={() => setTab(Tab.WORK)}
        >
          <div className={styles.dBtn}>作品</div>
        </div>
        <div
          className={styles.dItem}
          data-active={tab === Tab.CREATOR}
          onClick={() => setTab(Tab.CREATOR)}
        >
          <div className={styles.dBtn}>作者</div>
        </div>
        {tab === Tab.WORK && (
          <>
            <div
              className={styles.dItem}
              data-active={sortBy === 'readNum'}
              onClick={() =>
                setSortBy((t) => (t === 'readNum' ? 'default' : 'readNum'))
              }
            >
              <div className={styles.eye}></div>
            </div>
            <div
              className={styles.dItem}
              data-active={sortBy === 'likeNum'}
              onClick={() =>
                setSortBy((t) => (t === 'likeNum' ? 'default' : 'likeNum'))
              }
            >
              <div className={styles.heart}></div>
            </div>
          </>
        )}
      </div>
      <div className={styles.dCatalog}>
        <div className={styles.dBanner}></div>
        <div className={styles.dCatalogTitle}>作品分类</div>
        <div className={styles.dCatalogList}>
          <ul>
            <li
              className={styles.dCategory}
              data-active={deptFilter === 'none'}
              onClick={() => setDeptFilter('none')}
            >
              全部
            </li>
            {galleryData?.depts.map((dept) => {
              return (
                <li
                  className={styles.dCategory}
                  key={dept.id}
                  data-active={deptFilter === dept.id}
                  onClick={() => setDeptFilter(dept.id)}
                >
                  {dept.name}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.scrollWrapper}>
          <div className={styles.tabs}>
            <div
              className={styles.tab}
              data-active={tab === Tab.WORK}
              onClick={() => setTab(Tab.WORK)}
            >
              作品 {galleryData?.works?.length ?? ''}
            </div>
            <div
              className={styles.tab}
              data-active={tab === Tab.CREATOR}
              onClick={() => setTab(Tab.CREATOR)}
            >
              作者 {galleryData?.creators?.length ?? ''}
            </div>
          </div>
          {tab === Tab.WORK && (
            <WorkTabContent
              sortType={sortBy}
              onSortTypeChange={setSortBy}
              deptFilter={deptFilter}
            />
          )}
          {tab === Tab.CREATOR && <CreatorTabContent deptFilter={deptFilter} />}
          <div className={styles.nomore}>没有更多了</div>
        </div>
      </div>
      {listVisible && (
        <div className={styles.categoryWrapper}>
          <div className={styles.categoryHeader}>
            <div className={styles.select}>请选择分类</div>
            <div className={styles.back} onClick={toggleList}>
              返回
              <ChevronLeft size={20} style={{ transform: 'scaleX(-1)' }} />
            </div>
          </div>

          <div className={styles.categories}>
            <ul>
              <li
                className={styles.category}
                data-active={deptFilter === 'none'}
                onClick={() => setDeptFilter('none')}
              >
                <div className={styles.categoryName}>全部</div>
                <div className={styles.categoryWorkNum}>
                  {galleryData?.works?.length ?? ''}
                </div>
              </li>
              {galleryData?.depts.map((dept) => {
                return (
                  <li
                    className={styles.category}
                    key={dept.id}
                    data-active={deptFilter === dept.id}
                    onClick={() => setDeptFilter(dept.id)}
                  >
                    <div className={styles.categoryName}>{dept.name}</div>
                    <div className={styles.categoryWorkNum}>
                      {dept.productNum}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
      <div className={styles.backup}>京ICP备16007760号-2</div>
    </div>
  )
}

export default Works
