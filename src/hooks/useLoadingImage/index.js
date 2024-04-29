import { useState, useEffect } from 'react'
import loadFailImg from './img-error.png'
import loadingSVG from './loading.svg'

// export interface UseLoadingImageOption {
//   imgUrl: string | Promise<string>;
//   loadingImg?: string;
//   failedImg?: string;
// }

export default function useLoadingImage(options) {
  const { imgUrl, loadingImg = loadingSVG, failedImg = loadFailImg } = options
  const [src, setSrc] = useState < string > loadingImg

  useEffect(() => {
    let isMount = true
    const setImgSrc = (url) => {
      if (!isMount) {
        return
      }
      const image = new Image()
      image.onload = () => {
        if (isMount) {
          setSrc(url)
        }
      }
      image.onerror = () => {
        if (isMount) {
          setSrc(failedImg)
        }
      }
      image.src = url
    }

    if (imgUrl instanceof Promise) {
      imgUrl.then(setImgSrc)
    } else {
      setImgSrc(imgUrl)
    }

    return () => {
      isMount = false
    }
  }, [])

  const loading = src === loadingImg
  const failed = src === failedImg
  const success = !loading && !failed

  return { src, success, loading, failed }
}
