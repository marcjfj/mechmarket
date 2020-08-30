import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import 'swiper/swiper.scss';
import { Icon, InlineIcon } from '@iconify/react';
import bxsCaretRightCircle from '@iconify/icons-bx/bxs-caret-right-circle';
import bxsCaretLeftCircle from '@iconify/icons-bx/bxs-caret-left-circle';

SwiperCore.use([Navigation]);

const ImageSlider = ({post}) => {
  return (
  <div className="image-slider-wrapper">
    {post.imgur_images.length ? (
      <div className="images-wrapper">
        { post.imgur_images.length > 3 ? (
          <button className={`swiper-button prev-button prev-${post.data.id}`}>
            <Icon icon={bxsCaretLeftCircle} />
          </button>
        ) : null }
        <Swiper
        className="image-swiper"
        loop={(post.imgur_images.length > 3)}
        spaceBetween={0}
        slidesPerView={(post.imgur_images.length > 2) ? 3 : post.imgur_images.length}
        navigation={{nextEl: `.next-${post.data.id}`, prevEl: `.prev-${post.data.id}`}}
        // onSlideChange={() => console.log('slide change')}
        // onSwiper={(swiper) => console.log(swiper)}
        >
          {
            post.imgur_images.map((image, i) => (
              <SwiperSlide className="slide" key={i}>
                <img className="image" src={image ? image.gifv || image.link : null} alt="" loading="lazy" />
              </SwiperSlide>
            ))
          }
        </Swiper>
        { post.imgur_images.length > 3 ? (
          <button className={`swiper-button next-button next-${post.data.id}`}>
            <Icon icon={bxsCaretRightCircle} />
          </button>
        ) : null }
      </div>
    ) : null}
  </div>
  )
}

export default ImageSlider;