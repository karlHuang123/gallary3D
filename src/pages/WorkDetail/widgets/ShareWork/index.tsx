import React, { useState, useRef, useCallback, useEffect } from 'react'
import after from 'lodash/after'
import { useQrcode } from '@/hooks/useQrcode'
import { toBlob, toPng } from 'html-to-image'
import { WorkWithCreatorInfo } from '@/services/getWorks'
import { BANNER } from '@/utils/constants'
import styles from './index.module.css'
import CloseIcon from '@/components/icons/Close'

export interface ShareWorkProps {
  visible: boolean
  work: WorkWithCreatorInfo
  onClose: () => void
}

interface BlobUrlManager {
  blobUrls: string[]
  createUrl: (blob: Blob) => string
  revokeAll: () => void
}

const blobUrlManager: BlobUrlManager = {
  blobUrls: [],
  createUrl(blob: Blob) {
    const url = URL.createObjectURL(blob)
    this.blobUrls.push(url)
    return url
  },
  revokeAll() {
    this.blobUrls.forEach((url) => {
      URL.revokeObjectURL(url)
    })
    this.blobUrls = []
  },
}

const ShareWork: React.FC<ShareWorkProps> = (props) => {
  const { visible, work, onClose } = props
  const containerRef = useRef<HTMLDivElement>(null)
  const { dataUrl } = useQrcode(window.location.href)
  const [shareImg, setShareImg] = useState<string>()

  const captureImg = useCallback(() => {
    if (containerRef.current) {
      // toBlob(containerRef.current!, { cacheBust: true })
      toPng(containerRef.current)
        .then((dataUrl1) => {
          // if (blob) {
          // const blobUrl = blobUrlManager.createUrl(blob)
          setShareImg(dataUrl1)
          console.log(dataUrl1)
          // }
        })
        .catch(console.error)
    }
  }, [])

  const loadImgs = useCallback((urlList: string[], allLoaded: () => void) => {
    const total = urlList.length
    let loaded = 0
    const onloadImg = () => {
      loaded++
      if (loaded === total) {
        allLoaded()
      }
    }
    urlList.forEach((url) => {
      const img = new Image()
      img.onload = onloadImg
      img.onerror = onloadImg
      img.src = url
    })
  }, [])

  useEffect(() => {
    if (visible && dataUrl) {
      const imgSrcList = [
        BANNER,
        work.livePicUrl,
        work.creator.headImageUrl,
        dataUrl,
      ]
      loadImgs(imgSrcList, captureImg)
    }
  }, [visible, dataUrl])

  useEffect(() => {
    if (!visible) {
      setShareImg(undefined)
      blobUrlManager.revokeAll()
    }
  }, [visible])

  if (!visible) {
    return null
  }

  return (
    <>
      <div className={styles.imgBg}>
        <CloseIcon className={styles.close} onClick={onClose} />
        <div className={styles.remind}>保存图片转发朋友圈，为作品集赞</div>
      </div>
      <img className={styles.shareImg} src={shareImg} />
      <div className={styles.container} ref={containerRef}>
        <img className={styles.banner} src={BANNER} />
        <div className={styles.body}>
          <img src={work.livePicUrl} />
        </div>
        <div className={styles.footer}>
          <div>
            {/* add margin top 10 to fill the bottom blank */}
            <div className={styles.creator} style={{ marginTop: 10 }}>
              <img className={styles.avatar} src={work.creator.headImageUrl} />
              <div className={styles.nameInfo}>
                <div className={styles.workName}>{work.name}</div>
                <div className={styles.creatorName}>{work.creator.name}</div>
              </div>
            </div>
            {/* <div className={styles.title}>这是一段占位文字</div> */}
          </div>
          <div className={styles.qr}>
            <img className={styles.qrImg} src={dataUrl} />
            <div className={styles.qrTxt}>请扫码观展</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ShareWork
