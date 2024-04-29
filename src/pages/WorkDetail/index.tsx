import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGalleryQuery } from '@/services/getWorks'
import { ArrowLeft, ArrowRight } from '@/components/icons/Arrow'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import nums from '@/utils/nums'
import loadingGif from '@/assets/default.gif'
import styles from './index.module.css'
import ShareWork from './widgets/ShareWork'

export default function WorkDetail() {
  const [, update] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const [shareVisible, setShareVisible] = useState<boolean>(false)

  const navigate = useNavigate()
  const { workId } = useParams()

  const galleryData = useGalleryQuery()

  const go = useCallback(
    (step: number) => {
      const works = galleryData?.works
      if (!works) {
        return
      }
      const currentIndex = works.findIndex((w) => w.id == workId)
      const goIndex = (currentIndex + works.length + step) % works.length
      const targetWork = works[goIndex]
      navigate('/work-info/detail/' + targetWork.id)
      if (containerRef.current) {
        containerRef.current.scrollTop = 0
      }
      if (bodyRef.current) {
        bodyRef.current.scrollTop = 0
      }
    },
    [galleryData, workId]
  )

  const work = galleryData?.workDic?.get(Number(workId))

  const handleLike = useCallback(async () => {
    if (!work) return
    if (await nums.like(work.id)) {
      work.goodNum++
      update((v) => !v)
    }
  }, [work])

  const handleRead = useCallback(async () => {
    if (!work) return
    if (await nums.read(work.id)) {
      work.readNum++
      update((v) => !v)
    }
  }, [work])

  useEffect(() => {
    handleRead()
  }, [work])

  const handleShare = useCallback(async () => {
    if (!work) return
    setShareVisible(true)
    if (await nums.share(work.id)) {
      work.shareNum++
      update((v) => !v)
    }
  }, [work])

  if (!work) {
    return null
  }

  return (
    <>
      <div className={styles.container} ref={containerRef}>
        <div className={styles.header}>
          <div className={styles.name}>{work.name}</div>
          <div className={styles.other}>
            <div className={styles.nameInfo}>
              <div className={styles.category}>{work.catalogName}</div>
              <div className={styles.from}>{work.creator.degree}</div>
            </div>
            <div className={styles.operations}>
              <div
                className={styles.operation}
                data-done={nums.hasLiked(work.id)}
                data-like={true}
              >
                <div className={styles.operationIcon} onClick={handleLike} />
                <div className={styles.operationNum}>{work.goodNum}</div>
              </div>
              <div
                className={styles.operation}
                data-done={nums.hasRead(work.id)}
                data-view={true}
              >
                <div className={styles.operationIcon} />
                <div className={styles.operationNum}>{work.readNum}</div>
              </div>
              <div
                className={styles.operation}
                data-done={nums.hasShared(work.id)}
                data-share={true}
              >
                <div className={styles.operationIcon} onClick={handleShare} />
                <div className={styles.operationNum}>{work.shareNum}</div>
              </div>
            </div>
          </div>
          <div className={styles.creatorInfo}>
            <div
              className={styles.avatar}
              style={{
                backgroundImage: `url(${work.creator.headImageUrl})`,
              }}
            />
            <div className={styles.creatorName}>{work.studentName}</div>
          </div>
        </div>
        <div className={styles.body} ref={bodyRef}>
          <div className={styles.bodyName}>{work.name}</div>
          <div>
            {work.picsList?.map((item) => {
              return (
                <LazyLoadImage
                  key={item.id}
                  wrapperClassName={styles.imgWrapper}
                  className={styles.img}
                  alt=""
                  src={item.resImageUrl}
                  placeholderSrc={loadingGif}
                />
              )
            })}
          </div>
          <div className={styles.thanks}>谢谢观赏</div>
        </div>
        <div className={styles.footer}>
          <div className={styles.footerOper}>
            <div
              className={styles.footerBtn}
              data-liked={nums.hasLiked(work.id)}
              onClick={handleLike}
            >
              <div className={styles.footerBtnIconLike}></div>
              <div className={styles.footerBtnBody}>
                <div>点赞</div>
                <div>{work.goodNum}</div>
              </div>
            </div>
            <div className={styles.footerBtn} onClick={handleShare}>
              <div className={styles.footerBtnIconShare}></div>
              <div className={styles.footerBtnBody}>
                <div>分享</div>
                <div>{work.shareNum}</div>
              </div>
            </div>
          </div>
          <div className={styles.footerView}>
            <div>观看量</div>
            <div>{work.readNum}</div>
          </div>
          <div className={styles.footerPage}>
            <div
              className={styles.footerBtn}
              onClick={() => {
                go(-1)
              }}
            >
              <ArrowLeft size={18} />
              <div>上一篇</div>
            </div>
            <div
              className={styles.footerBtn}
              onClick={() => {
                go(1)
              }}
            >
              <div>下一篇</div>
              <ArrowRight size={18} />
            </div>
          </div>
        </div>
        <div className={styles.backup}>京ICP备16007760号-2</div>
      </div>
      <ShareWork
        work={work}
        visible={shareVisible}
        onClose={() => setShareVisible(false)}
      />
    </>
  )
}
