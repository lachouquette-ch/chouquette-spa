export const DEFAULT = {
  grabCursor: true,
  centeredSlides: true,
  loop: true,
  slidesPerView: 1,
  spaceBetween: 10,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  },
  pagination: {
    el: '.swiper-pagination',
    dynamicBullets: true,
    clickable: true
  }
}

export const AUTO_PLAY = {
  autoplay: {
    delay: 3000,
    disableOnInteraction: false
  }
}

export const RESPONSIVE = {
  // Responsive breakpoints (based on bootstrap breakpoints)
  breakpointsInverse: true,
  breakpoints: {
    576: {
      slidesPerView: 2,
      spaceBetween: 10
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 20
    },
    992: {
      slidesPerView: 3,
      spaceBetween: 30
    },
    1200: {
      slidesPerView: 4,
      spaceBetween: 30
    }
  }
}
