import { useGalleryQuery } from '@/services/getWorks'
import { useMemo } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import ChevronLeft from '../../components/icons/ChevronLeft'
import MenuIcon from '../../components/icons/MenuIcon'
import styles from './index.module.css'

const WorkInfo: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const { workId } = useParams()

  const galleryData = useGalleryQuery()

  const isWorkPage = location.pathname.startsWith('/work-info/detail/')
  const isCreatorPage = location.pathname.startsWith('/work-info/creator/')

  const work = useMemo(() => {
    return galleryData?.works?.find((w) => String(w.id) === workId)
  }, [workId, galleryData])

  function backClick() {
    navigate(-1)
  }

  function menuClick() {
    navigate('/works')
  }

  function authorClick() {
    if (work) {
      navigate(`creator/${work.id}`, { replace: true })
    }
  }

  function workClick() {
    if (work) {
      navigate(`detail/${work.id}`, { replace: true })
    }
  }

  function homeClick() {
    navigate('/')
  }

  function galleryClick() {
    navigate('/gallery')
  }

  return (
    <div className={styles.container}>
      <div className={styles.mobileBar}>
        <div className={styles.topBar}>
          <div className={styles.back} onClick={backClick}>
            <ChevronLeft />
            返回
          </div>
          <div className={styles.menu} onClick={menuClick}>
            <MenuIcon />
          </div>
        </div>
        <div className={styles.navBar}>
          <div className={styles.navBtn} onClick={homeClick}>
            <div className={styles.icon} data-home={true}></div>
            <div className={styles.text}>主页</div>
          </div>
          <div
            className={styles.navBtn}
            data-active={isCreatorPage}
            onClick={authorClick}
          >
            <div className={styles.icon} data-author={true}></div>
            <div className={styles.text}>作者</div>
          </div>
          <div
            className={styles.navBtn}
            data-active={isWorkPage}
            onClick={workClick}
          >
            <div className={styles.icon} data-work={true}></div>
            <div className={styles.text}>作品</div>
          </div>
          <div className={styles.navBtn} onClick={galleryClick}>
            <div className={styles.icon} data-exh={true}></div>
            <div className={styles.text}>全景观展</div>
          </div>
        </div>
      </div>
      <div className={styles.desktopBar}>
        <div className={styles.dItem} onClick={menuClick}>
          <MenuIcon />
        </div>
        <div
          className={styles.dItem}
          data-active={isCreatorPage}
          onClick={authorClick}
        >
          <div>作者</div>
        </div>
        <div
          className={styles.dItem}
          data-active={isWorkPage}
          onClick={workClick}
        >
          <div>作品</div>
        </div>
        <div className={styles.dItem} onClick={galleryClick}>
          <div>全景观展</div>
        </div>
      </div>
      <div className={styles.outletWrapper}>
        <Outlet />
      </div>
    </div>
  )
}

export default WorkInfo
