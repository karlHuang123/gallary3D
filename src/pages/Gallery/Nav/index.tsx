import { useEffect, useState, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperClass } from 'swiper/types'
import { isMobile } from '@/utils/device'
import { useGalleryQuery } from '@/services/getWorks'
import 'swiper/css'
import './index.css'

const breakpoints = {
  // when window width is >= 320px
  320: {
    slidesPerView: 3,
    spaceBetween: 10,
  },
  // when window width is >= 480px
  800: {
    slidesPerView: 5,
    spaceBetween: 10,
  },
}

const SWIPER_HEIGHT = 80

export interface NavProps {
  onActiveIndexChange: (i: number) => void
  onGyroscopeEnabled: (e: boolean) => void
  activeIndex: number
}

const Nav: React.FC<NavProps> = (props) => {
  const { onActiveIndexChange, onGyroscopeEnabled, activeIndex } = props
  const swiperRef = useRef<SwiperClass>()

  const [gyroEnabled, setGyroEnabled] = useState(true)
  const [height, setHeight] = useState(SWIPER_HEIGHT)
  const [visible, setVisible] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  const galleryData = useGalleryQuery()

  function goIndex(i: number) {
    if (!swiperRef.current) {
      return false
    }
    if (i < 0 || i > swiperRef.current.slides.length - 1) {
      return false
    }
    if (i === currentIndex) {
      return false
    }
    setCurrentIndex(i)
    swiperRef.current.slideTo(i)
    return true
  }

  useEffect(() => {
    onGyroscopeEnabled?.(gyroEnabled)
  }, [gyroEnabled])

  useEffect(() => {
    if (activeIndex !== swiperRef?.current?.activeIndex) {
      goIndex(activeIndex)
    }
  }, [activeIndex])

  function toggleList() {
    setHeight((h) => (h === 0 ? SWIPER_HEIGHT : 0))
  }

  function toggleShow() {
    setVisible((v) => !v)
  }

  function handleSlideClick(swiper: SwiperClass) {
    onActiveIndexChange?.(swiper.clickedIndex)
    setCurrentIndex(swiper.clickedIndex)
  }

  function handleLeftClick() {
    if (goIndex(currentIndex - 1)) {
      onActiveIndexChange?.(currentIndex - 1)
    }
  }

  function handleOriginClick() {
    if (goIndex(0)) {
      onActiveIndexChange?.(0)
    }
  }

  function handleRightClick() {
    if (goIndex(currentIndex + 1)) {
      onActiveIndexChange?.(currentIndex + 1)
    }
  }

  return (
    <>
      <div
        id="bottom-show"
        style={{ visibility: visible ? 'hidden' : 'visible' }}
        onClick={toggleShow}
      ></div>
      <div
        id="bottom-info"
        style={{
          transform: visible ? 'translate(-50%, 0)' : 'translate(-50%, 100%)',
        }}
      >
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          className="swiper"
          style={{ height }}
          autoplay={false}
          onClick={handleSlideClick}
          init={true}
          breakpoints={breakpoints}
        >
          {galleryData?.works?.map((w, i) => {
            return (
              <SwiperSlide
                key={w.id}
                style={{
                  backgroundImage: `url(${w.livePicUrl})`,
                  border: currentIndex === i ? '3px solid #fff' : 'none',
                }}
              >
                {/*i*/}
              </SwiperSlide>
            )
          })}
        </Swiper>
        <div className="swiper-bottom-bar">
          <div className="swiper-btn-container">
            <div
              className="swiper-btn swiper-btn-left"
              onClick={handleLeftClick}
            ></div>
            <div
              className="swiper-btn swiper-btn-list"
              onClick={toggleList}
            ></div>
            <div
              className="swiper-btn swiper-btn-origin"
              onClick={handleOriginClick}
            ></div>
            <div
              className="swiper-btn swiper-btn-hide"
              onClick={toggleShow}
            ></div>
            {/* 陀螺仪 */}
            {/* {isMobile && (
              <div
                className="swiper-btn swiper-btn-gyroscope"
                data-enabled={gyroEnabled}
                onClick={() => setGyroEnabled((v) => !v)}
              ></div>
            )} */}
            <div
              className="swiper-btn swiper-btn-right"
              onClick={handleRightClick}
            ></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Nav
