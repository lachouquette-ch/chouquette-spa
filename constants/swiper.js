export const DEFAULT = {
  grabCursor: true,
  slidesPerView: 1,
  spaceBetween: 30,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  },
  pagination: {
    el: '.swiper-pagination',
    type: 'progressbar'
  }
}

export const HASH = {
  hashNavigation: {
    replaceState: true
  }
}

export const LOOP = {
  loop: true,
  /* Need to hide (and skip) duplicates since it's only HTML copies and not Vue component (no JS) */
  slideDuplicateClass: 'invisible',
  on: {
    slideChange() {
      // skip duplicate
      if (this.isBeginning) {
        this.slideToLoop(this.slides.length - 3, null, false) // 2 duplicates
      }
      // skip duplicate
      if (this.isEnd) {
        this.slideToLoop(0, null, false)
      }
    }
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
      slidesPerView: 1,
      spaceBetween: 10
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 20
    },
    992: {
      slidesPerView: 2,
      spaceBetween: 30
    },
    1200: {
      slidesPerView: 3,
      spaceBetween: 30
    }
  }
}
