import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import Experience from './Experience/Experience.js'
import DotLoading from '../../components/icons/DotLoading'
import Nav from './Nav'
import Depts from './Depts'
import { useGalleryQuery, WorkItem } from '@/services/getWorks'
import styles from './index.module.css'
import { useQuery } from '@tanstack/react-query'
import { listAllShowNum } from '@/services/nums.js'
import nums from '@/utils/nums.js'

const Gallery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  // const experienceRef = useRef<Experience>()
  const experienceRef = useRef<any>()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [coverVisible, setCoverVisible] = useState(true)
  const [deptsVisible, setDeptsVisible] = useState<boolean>(false)

  const navigate = useNavigate()

  const { data } = useQuery(['shownums'], listAllShowNum)
  const galleryData = useGalleryQuery()

  useEffect(() => {
    nums.view()
  }, [])

  useEffect(() => {
    ;(async () => {
      const Experience = (await import('./Experience/Experience.js')).default
      const exp = experienceRef.current ?? new Experience()
      experienceRef.current = exp
      if (exp.loaded) {
        setLoaded(true)
        setCoverVisible(false)
      } else {
        exp.on('loaded', () => {
          setLoaded(true)
        })
      }
      exp.on('wallclick', (i: number) => {
        setCurrentIndex(i)
      })
      exp.on('workclick', (work: WorkItem) => {
        navigate(`/work-info/detail/${work.id}`)
      })
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
      exp.mount(containerRef.current)
    })()
    return () => {
      if (experienceRef.current) {
        experienceRef.current.off('loaded wallclick workclick')
        experienceRef.current.unmount()
      }
    }
  }, [])

  function handleActiveIndexChange(i: number) {
    experienceRef.current?.onActiveIndexChange(i)
  }

  function onGyroscopeEnabled(enabled: boolean) {
    experienceRef.current?.setGyroscopeEnabled(enabled)
  }

  function onEnterClick() {
    // 陀螺仪
    // experienceRef.current?.setDOC()
    setCoverVisible(false)
  }

  function closeDepts() {
    setDeptsVisible(false)
  }

  function handleDeptClick(id: ID) {
    if (!galleryData?.works?.length) {
      return
    }
    const index = galleryData.works.findIndex((w) => w.catalogId === id)
    if (index !== -1) {
      setCurrentIndex(index)
      handleActiveIndexChange(index)
      closeDepts()
    }
  }

  function handleBackClick() {
    navigate(-1)
  }

  return (
    <>
      <div ref={containerRef}></div>
      <Nav
        activeIndex={currentIndex}
        onActiveIndexChange={handleActiveIndexChange}
        onGyroscopeEnabled={onGyroscopeEnabled}
      />
      <div className={styles.pxTopLeft}>
        <div className={styles.pxLeftArrow} onClick={handleBackClick} />
        {data && (
          <div className={styles.pxViewNum}>观展人数: {data.viewerNum}</div>
        )}
      </div>
      <div
        className={styles.pxIconMenu}
        onClick={() => setDeptsVisible(true)}
      />
      <Depts
        visible={deptsVisible}
        onClose={closeDepts}
        onDeptClick={handleDeptClick}
      />
      {coverVisible && (
        <div className={styles.cover}>
          <DotLoading
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              visibility: loaded ? 'hidden' : 'visible',
            }}
          />
          <div
            onClick={onEnterClick}
            className={styles.pxEnterButton}
            style={{ visibility: loaded ? 'visible' : 'hidden' }}
          >
            进入
          </div>
          <div className={styles.backup}>京ICP备16007760号-2</div>
        </div>
      )}
    </>
  )
}

export default Gallery
