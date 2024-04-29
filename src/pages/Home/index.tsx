import { useNavigate } from 'react-router-dom'
import styles from './index.module.css'

const Home: React.FC = () => {
  const navigate = useNavigate()

  function galleryClick() {
    navigate('/gallery')
  }

  function siteClick() {
    navigate('/works')
  }

  return (
    <div className={styles.bg}>
      <div className={styles.pxBtns}>
        <div className={styles.pxBtn} onClick={galleryClick}>
          全景观展
        </div>
        <div className={styles.pxBtn} onClick={siteClick}>
          微站观展
        </div>
      </div>
      <div className={styles.backup}>京ICP备16007760号-2</div>
    </div>
  )
}

export default Home
