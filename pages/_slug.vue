<template>
  <div class="post-page">
    <b-modal
      id="fiche-modal"
      size="xl"
      header-bg-variant="white"
      header-text-variant="black"
      body-bg-variant="white"
      body-text-variant="black"
      body-class="modal-body-class"
      title-class="w-100 text-center"
      hide-footer
      centered
      @shown="initModal"
      @hide="closeModal"
    >
      <template v-slot:modal-title>{{ fiche.title.rendered | heDecode }}</template>
      <template v-slot:default>
        <div
          v-if="!hasSingleFiche"
          class="swiper-button-prev d-none d-md-block"
          role="button"
          aria-label="Prochaine fiche"
          @click.prevent="previousFiche(fiche)"
        ></div>
        <Fiche ref="fiche" :fiche="fiche" />
        <div
          v-if="!hasSingleFiche"
          class="swiper-button-next d-none d-md-block"
          role="button"
          aria-label="Prochaine fiche"
          @click.prevent="nextFiche(fiche)"
        ></div>
      </template>
    </b-modal>
    <nav v-if="fiches" class="post-sidebar bg-white pb-5 pb-md-1" :class="{ 'hide-sidebar': hideSidebar }">
      <div class="post-sidebar-header d-none d-md-block text-center my-4">
        <h2 class="post-sidebar-title h5 m-0">{{ hasSingleFiche ? 'La fiche' : "Cités dans l'article" }} :</h2>
      </div>
      <div v-if="fiches">
        <Fiche v-if="hasSingleFiche" :fiche="fiches[0]" class="mx-2" :responsive="false" />
        <FicheThumbnail
          v-for="fiche in fiches"
          v-else
          :key="fiche.id"
          :fiche="fiche"
          class="my-2 mx-3 mx-md-2 position-relative"
          @click.native="viewFiche(fiche)"
        />
      </div>
    </nav>
    <div class="post-sidebar-toggle-buttons d-md-none btn-group btn-group-toggle" data-toggle="buttons">
      <label
        class="btn btn-sm btn-primary border-grey border-right-0"
        :class="{ active: hideSidebar }"
        @click="hideSidebar = true"
      >
        <input id="option1" type="radio" name="options" checked />Article
      </label>
      <label
        class="btn btn-sm btn-primary border-grey border-left-0"
        :class="{ active: !hideSidebar }"
        @click="hideSidebar = false"
      >
        <input id="option2" type="radio" name="options" />{{ hasSingleFiche ? 'Fiche' : 'Fiches' }}
      </label>
    </div>
    <b-overlay :show="!post" spinner-variant="yellow">
      <main role="main" class="post layout-content" :class="{ 'with-sidebar': fiches }">
        <article v-if="post" :id="post.id">
          <header class="post-header container-fluid px-0 mb-6">
            <WPMedia v-if="featuredMedia" :media="featuredMedia" class="post-header-img" />
            <WpAvatar
              :size="150"
              :avatar-urls="author.avatar_urls"
              :alt="author.name"
              class="post-header-author-img rounded-circle"
            />
            <div class="post-header-meta">
              <span>par {{ author.name }}</span>
              <span v-if="postModifiedDate">
                mise à jour le <time :datetime="post.modified">{{ postModifiedDate }}</time>
              </span>
              <span v-else>
                publié le <time :datetime="post.date">{{ postCreatedDate }}</time>
              </span>
            </div>
            <PostShare :post="post" class="post-header-sn-share" />
          </header>

          <section class="gutenberg-content container pt-4 mb-5">
            <h1 class="pt-2 mb-4 text-center">{{ post.title.rendered | heDecode }}</h1>
            <main v-html="post.content.rendered" />
          </section>

          <section class="post-author container mb-5">
            <div class="border shadow-sm text-center position-relative">
              <WpAvatar
                :size="150"
                :avatar-urls="author.avatar_urls"
                :alt="author.name"
                class="post-header-author-img rounded-circle"
              />
              <h5 class="mt-3 mb-4">{{ author.name }}</h5>
              <p class="px-2 pb-1">{{ author.description }}</p>
            </div>
          </section>

          <section class="home-newsletter container-fluid bg-yellow py-4">
            <h3 class="text-center mb-0">Rejoins notre newsletter</h3>
            <p class="text-center text-muted">Pour recevoir tous nos bons plans et ne plus rien rater</p>
            <VueMailchimpSubscribe
              url="https://unechouquettealausanne.us8.list-manage.com/subscribe/post-json"
              :user-id="mailChimpUserId"
              :list-id="mailChimpListId"
              @error="onMailchimpSubscriptionError"
              @success="onMailchimpSubscriptionSuccess"
            >
              <template v-slot="{ subscribe, setEmail, loading }">
                <form class="form-inline mx-auto justify-content-center" @submit.prevent="subscribe">
                  <input
                    ref="mailRegistration"
                    type="email"
                    name="email"
                    placeholder="Ton email"
                    class="required email form-control w-auto mr-2"
                    @input="setEmail($event.target.value)"
                  />
                  <button type="submit" class="btn btn-dark-grey" :disabled="loading">
                    <span
                      v-show="loading"
                      class="spinner-border spinner-border-sm mt-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Je m'inscris
                  </button>
                </form>
              </template>
            </VueMailchimpSubscribe>
          </section>

          <section v-if="similarPosts" class="post-similar container my-5 p-0">
            <h3 class="mb-3 text-center">Tu vas aussi aimer...</h3>
            <swiper class="swiper py-3" :options="swiperOption">
              <swiper-slide v-for="post in similarPosts" :key="post.id">
                <PostCard :post="post" />
              </swiper-slide>
              <div slot="button-prev" class="swiper-button-prev"></div>
              <div slot="button-next" class="swiper-button-next"></div>
            </swiper>
          </section>

          <section class="post-comments container my-5">
            <h3 v-if="comments.length" class="mb-3 text-center">{{ comments.length }} commentaire(s)</h3>
            <h3 v-else class="mb-3 text-center">Sois le premier à nous laisser un commentaire</h3>
            <ol class="comment-list p-0">
              <li v-for="comment in rootLevelComments" :key="comment.id" class="comment">
                <PostComment :post="post.id" :comment="comment" :comments="comments" />
              </li>
            </ol>
            <PostCommentReply :post="post.id" />
          </section>
        </article>
      </main>
    </b-overlay>
  </div>
</template>

<script>
import moment from 'moment'

import VueMailchimpSubscribe from 'vue-mailchimp-subscribe/dist/vue-mailchimp-subscribe'

import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import WPMedia from '../components/WpMedia'
import PostShare from '../components/PostShare'
import PostComment from '../components/PostComment'
import PostCard from '../components/PostCard'
import WpAvatar from '../components/WpAvatar'
import PostCommentReply from '../components/PostCommentReply'
import FicheThumbnail from '../components/FicheThumbnail'
import Fiche from '../components/Fiche'
import newsletter from '~/mixins/newsletter'
import yoast from '~/mixins/yoast'
import gutenberg from '~/mixins/gutenberg'

import { AUTO_PLAY_REPONSIVE } from '~/constants/swiper'

export default {
  components: {
    Fiche,
    FicheThumbnail,
    PostCommentReply,
    WpAvatar,
    PostComment,
    WPMedia,
    PostCard,
    PostShare,
    VueMailchimpSubscribe,
    Swiper,
    SwiperSlide
  },
  mixins: [gutenberg, newsletter, yoast],
  async asyncData({ app, store, params }) {
    const post = await app.$wpAPI.wp.posts.getBySlug(params.slug, { _embed: true })

    // helper fields
    const featuredMedia = post._embedded['wp:featuredmedia'] ? post._embedded['wp:featuredmedia'][0] : null
    const author = post._embedded.author[0]
    const tags = post._embedded['wp:term'][1]

    const [comments, similarPosts, fiches] = await Promise.all([
      app.$wpAPI.wp.comments.getByPost(post.id),
      store.dispatch('posts/fetchSimilar', post),
      store.dispatch('fiches/fetchByIds', post.meta.link_fiche)
    ])
    const rootLevelComments = comments.filter(({ parent }) => parent === 0)

    return {
      post,
      featuredMedia,
      author,
      tags,
      comments,
      rootLevelComments,
      similarPosts,
      fiches
    }
  },
  data() {
    return {
      hideSidebar: true,
      fiche: null,

      swiperOption: AUTO_PLAY_REPONSIVE
    }
  },
  computed: {
    postCreatedDate() {
      return moment(this.post.date).format('DD/MM/YY')
    },
    postModifiedDate() {
      return moment(this.post.modified).format('DD/MM/YY')
    },
    hasSingleFiche() {
      return this.fiches && this.fiches.length === 1
    }
  },
  mounted() {
    // show fiche if previously selected
    const ficheId = parseInt(location.hash.substring(1))
    if (ficheId) {
      const ficheToShow = this.fiches.find(({ id }) => id === ficheId)
      if (ficheToShow) {
        this.hideSidebar = false
        this.viewFiche(ficheToShow)
      }
    }
  },
  methods: {
    viewFiche(fiche) {
      this.fiche = fiche
      this.$bvModal.show('fiche-modal')
    },
    previousFiche(fiche) {
      let ficheIndex = this.fiches.findIndex(({ id }) => fiche.id === id)
      const previousFicheIndex = --ficheIndex < 0 ? this.fiches.length - 1 : ficheIndex
      this.fiche = this.fiches[previousFicheIndex]
      // retain fiche
      history.replaceState(null, null, `#${this.fiche.id}`)
    },
    nextFiche(fiche) {
      let ficheIndex = this.fiches.findIndex(({ id }) => fiche.id === id)
      const nextFicheIndex = ++ficheIndex >= this.fiches.length ? 0 : ficheIndex
      this.fiche = this.fiches[nextFicheIndex]
      // retain fiche
      history.replaceState(null, null, `#${this.fiche.id}`)
    },
    initModal() {
      const Hammer = require('hammerjs')
      delete Hammer.defaults.cssProps.userSelect
      const mc = new Hammer(this.$refs.fiche.$el)
      mc.on('swipeleft', () => {
        this.nextFiche(this.fiche)
      })
      mc.on('swiperight', () => {
        this.previousFiche(this.fiche)
      })

      this.$refs.fiche.resizeFiche()
      // retain fiche
      history.replaceState(null, null, `#${this.fiche.id}`)
    },
    closeModal() {
      // forget fiche
      history.replaceState(null, null, '#')
    }
  },
  head() {
    return {
      title: this.post ? this.$options.filters.heDecode(this.post.title.rendered) : '',
      link: this.gutenbergLinks(),
      meta: this.post ? this.yoastMetaConfig(this.post.yoast_meta) : [],
      script: this.post ? this.yoastJsonLDConfig(this.post.yoast_json_ld) : []
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .modal-body-class {
  min-height: 50vh;
  @include media-breakpoint-down(sm) {
    padding: 0;
  }
}

.post-sidebar {
  position: fixed;
  top: $header-height + $covid-banner-height;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: $zindex-sticky;
  overflow-y: auto;

  @include media-breakpoint-up(md) {
    width: 320px;

    -webkit-overflow-scrolling: touch;

    // style scrollbar
    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba($chouquette-grey, 0.3);
      background-color: $chouquette-light-grey;
    }

    &::-webkit-scrollbar {
      width: 12px;
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar-thumb {
      box-shadow: inset 0 0 6px rgba($chouquette-grey, 0.3);
      background-color: $chouquette-grey;
    }
  }
}

.hide-sidebar {
  @include media-breakpoint-down(sm) {
    visibility: hidden;
  }
}

.post-sidebar-toggle-buttons {
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: $zindex-sticky + 1;
}

.post.with-sidebar {
  @include media-breakpoint-up(md) {
    margin-left: 320px;
  }
}

.post-header {
  position: relative;

  margin-bottom: 50px; // for author img
}

.post-header-img {
  width: 100%;
  height: auto;
}

.post-header-author-img {
  height: 110px;
  width: 110px;

  position: absolute;
  bottom: -55px;
  left: 20px;
  border: 5px solid $white;
  z-index: 100;
}

.post-header-meta {
  position: absolute;
  width: 100%;
  bottom: 0;
  padding-left: 30+110+15px; // computed based on author img
  padding-right: 15px; // responsive right spacing

  padding-top: 2rem;
  padding-bottom: 5px;
  @include gradient-y(rgba($black, 0), rgba($black, 0.8));

  color: $white;
}

.post-header-sn-share {
  position: absolute;
  bottom: calc(-2rem - 15px);
  right: 10px;
}

.post-author {
  margin-top: 100px; // (half) author icon is 50px height

  > div {
    padding-top: 50px;
  }

  h5 {
    font-family: $font-family-heading;
    font-size: $h3-font-size;
  }

  div.col {
    padding-top: 35px; // corresp. to author image
  }

  img {
    width: 100px;
    height: 100px;

    position: absolute;
    top: -50px;
    left: 50%;
    margin-left: -50px;
  }
}

.post-similar {
  h3 {
    font-family: $font-family-heading;
    font-size: $h1-font-size;
  }
}

.post-comments {
  h3 {
    font-family: $font-family-heading;
    font-size: $h1-font-size;
  }

  ol {
    padding-left: 20px;
  }

  // no list bullets
  ol,
  ul {
    list-style-type: none;
  }
}
</style>
