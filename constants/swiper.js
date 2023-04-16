/*
 * Copyright (c) 2023 by Fabrice Douchant <fabrice.douchant@gmail.com>.
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

export const DEFAULT = {
  grabCursor: true,
  slidesPerView: 1,
  spaceBetween: 30,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    type: 'progressbar',
  },
}

export const HASH = {
  hashNavigation: {
    replaceState: true,
  },
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
    },
  },
}

export const AUTO_PLAY = {
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
}

export const RESPONSIVE = {
  // Responsive breakpoints (based on bootstrap breakpoints)
  breakpointsInverse: true,
  breakpoints: {
    576: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    992: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    1200: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
  },
}
