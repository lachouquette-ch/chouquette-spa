<template>
  <article :id="post.id" class="cq-single-post">
    <div class="cq-single-post-header container p-0">
      <WPMedia :media="featuredMedia"></WPMedia>
      <div class="cq-single-post-header-meta">
        <span>par {{ author.name }}</span>
        <div>
          publié le
          <MomentDateTime :datetime="new Date(post.date)"></MomentDateTime> (màj
          le
          <MomentDateTime :datetime="new Date(post.modified)"></MomentDateTime>)
        </div>
        <span
          >dans
          <a
            href="https://uat.lachouquette.ch/category/shopping/"
            title="Mode, déco, épicerie, web"
            >Shopping</a
          ></span
        >
      </div>
      <div id="share" class="cq-single-post-header-sn-share">
        Partage cet article
        <a title="Autres" class="text-primary"
          ><i class="fas fa-share-alt-square"></i
        ></a>
      </div>
    </div>

    <div class="cq-single-post-content container pt-4">
      <div class="cq-single-post-content-title">
        <h1 class="mr-2 mb-4">
          {{ post.title.rendered }}
        </h1>
      </div>
      <main
        class="cq-single-post-content-text"
        v-html="post.content.rendered"
      ></main>
    </div>

    <div class="cq-single-post-author container">
      <div class="border shadow-sm text-center position-relative">
        <img
          alt="Val"
          src="https://uat.lachouquette.ch/wp-content/wphb-cache/gravatar/c48/c481bcfd3703afe5904b58370a618101x150.jpg"
          srcset="
            https://uat.lachouquette.ch/wp-content/wphb-cache/gravatar/c48/c481bcfd3703afe5904b58370a618101x300.jpg 2x
          "
          class="avatar avatar-150 photo cq-single-post-header-author-img rounded-circle"
          height="150"
          width="150"
        />
        <h5 class="mt-3 mb-4">Val</h5>
        <p class="px-2 pb-1">
          Pipelette exploratrice et tatouée, je connais Lausanne comme ma poche
          puisque j’y suis née. Plus Italo - Suissesse que moi, tu meurs : je
          craque pour les pizzas et les fondues. Et en nostalgique des 80's, je
          me suis perdue dans le monde à l’envers de Stranger Things. N’hésite
          pas, suis-moi !
        </p>
      </div>
    </div>

    <div class="cq-single-post-similar container mt-5">
      <h3 class="mb-3 text-center">Tu vas aussi aimer...</h3>
      <div
        class="swiper-container swiper-container-initialized swiper-container-horizontal"
        style="cursor: grab;"
      >
        <div
          class="swiper-wrapper"
          style="transition-duration: 0ms; transform: translate3d(-1567.5px, 0px, 0px);"
        >
          <div
            class="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-prev"
            style="width: 255px; margin-right: 30px;"
            data-swiper-slide-index="2"
          >
            <article class="article-card article-card-chouquettise">
              <a
                href="https://uat.lachouquette.ch/dede-et-charlotte-concept-store-enfants-fribourg/"
                title="On te dorlote chez Dédé et Charlotte"
              >
                <div
                  class="article-card-picture"
                  style="background-image: url('https://uat.lachouquette.ch/wp-content/uploads/2019/03/Article-Chouquette-Image-3-768x596.jpg')"
                >
                  <div class="article-card-category">
                    <img
                      src="https://uat.lachouquette.ch/wp-content/uploads/2019/04/Shopping_noir-150x150.png"
                      alt="Mode, déco, épicerie, web"
                      title="Shopping"
                      class=""
                    />
                  </div>
                </div>
                <div
                  class="article-card-caption d-flex text-center justify-content-center align-items-center"
                >
                  On te dorlote chez Dédé et Charlotte
                </div>
              </a>
            </article>
          </div>
          <div
            class="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-active"
            style="width: 255px; margin-right: 30px;"
            data-swiper-slide-index="3"
          >
            <article class="article-card article-card-chouquettise">
              <a
                href="https://uat.lachouquette.ch/philippe-k-luxe-responsable-haute-parfumerie-lausanne-boutique/"
                title="Philippe K, l’ADN du luxe responsable"
              >
                <div
                  class="article-card-picture"
                  style="background-image: url('https://uat.lachouquette.ch/wp-content/uploads/2018/12/Philippe-k-haute-parfumerie-lausanne-768x432.png')"
                >
                  <div class="article-card-category">
                    <img
                      src="https://uat.lachouquette.ch/wp-content/uploads/2019/04/Shopping_noir-150x150.png"
                      alt="Mode, déco, épicerie, web"
                      title="Shopping"
                      class=""
                    />
                  </div>
                </div>
                <div
                  class="article-card-caption d-flex text-center justify-content-center align-items-center"
                >
                  Philippe K, l’ADN du luxe responsable
                </div>
              </a>
            </article>
          </div>
          <div
            class="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-next"
            style="width: 255px; margin-right: 30px;"
            data-swiper-slide-index="4"
          >
            <article class="article-card ">
              <a
                href="https://uat.lachouquette.ch/qwstion-concept-store-minimaliste-ethique-lausanne/"
                title="Qwstion, le concept-store minimaliste éthique"
              >
                <div
                  class="article-card-picture"
                  style="background-image: url('https://uat.lachouquette.ch/wp-content/uploads/2018/09/Q_STORE_LAUSANNE_PREVIEW_4_HR-768x512.jpeg')"
                >
                  <div class="article-card-category">
                    <img
                      src="https://uat.lachouquette.ch/wp-content/uploads/2019/04/Shopping_noir-150x150.png"
                      alt="Mode, déco, épicerie, web"
                      title="Shopping"
                      class=""
                    />
                  </div>
                </div>
                <div
                  class="article-card-caption d-flex text-center justify-content-center align-items-center"
                >
                  Qwstion, le concept-store minimaliste éthique
                </div>
              </a>
            </article>
          </div>
          <div
            class="swiper-slide swiper-slide-duplicate"
            style="width: 255px; margin-right: 30px;"
            data-swiper-slide-index="5"
          >
            <article class="article-card ">
              <a
                href="https://uat.lachouquette.ch/point-a-couture-mode-femme-lausanne-sur-mesure/"
                title="point A couture, ta mode sur-mesure made in Lausanne !"
              >
                <div
                  class="article-card-picture"
                  style="background-image: url('https://uat.lachouquette.ch/wp-content/uploads/2018/05/A11Fred-Kittel-2017-768x526.jpg')"
                >
                  <div class="article-card-category">
                    <img
                      src="https://uat.lachouquette.ch/wp-content/uploads/2019/04/Shopping_noir-150x150.png"
                      alt="Mode, déco, épicerie, web"
                      title="Shopping"
                      class=""
                    />
                  </div>
                </div>
                <div
                  class="article-card-caption d-flex text-center justify-content-center align-items-center"
                >
                  point A couture, ta mode sur-mesure made in Lausanne !
                </div>
              </a>
            </article>
          </div>
          <div
            class="swiper-slide"
            style="width: 255px; margin-right: 30px;"
            data-swiper-slide-index="0"
          >
            <article class="article-card article-card-chouquettise">
              <a
                href="https://uat.lachouquette.ch/bienvenue-au-temple-du-design-aka-le-mudac/"
                title="Bienvenue au temple du design aka le Mudac"
              >
                <div
                  class="article-card-picture"
                  style="background-image: url('https://uat.lachouquette.ch/wp-content/uploads/2020/02/mudac2014_35_web-1500x1263-1-768x647.jpg')"
                >
                  <div class="article-card-category">
                    <img
                      src="https://uat.lachouquette.ch/wp-content/uploads/2019/04/Culture_noir-150x150.png"
                      alt="Musique, Musées, Théâtre..."
                      title="Culture"
                      class=""
                    />
                  </div>
                </div>
                <div
                  class="article-card-caption d-flex text-center justify-content-center align-items-center"
                >
                  Bienvenue au temple du design aka le Mudac
                </div>
              </a>
            </article>
          </div>
          <div
            class="swiper-slide"
            style="width: 255px; margin-right: 30px;"
            data-swiper-slide-index="1"
          >
            <article class="article-card article-card-chouquettise">
              <a
                href="https://uat.lachouquette.ch/so-sweet-ml-biscuit-personnalise-commande-atelier/"
                title="So Sweet ML"
              >
                <div
                  class="article-card-picture"
                  style="background-image: url('https://uat.lachouquette.ch/wp-content/uploads/2019/11/sweet-M-L-cover.png')"
                >
                  <div class="article-card-category">
                    <img
                      src="https://uat.lachouquette.ch/wp-content/uploads/2019/04/Shopping_noir-150x150.png"
                      alt="Mode, déco, épicerie, web"
                      title="Shopping"
                      class=""
                    />
                  </div>
                </div>
                <div
                  class="article-card-caption d-flex text-center justify-content-center align-items-center"
                >
                  So Sweet ML
                </div>
              </a>
            </article>
          </div>
          <div
            class="swiper-slide swiper-slide-prev"
            style="width: 255px; margin-right: 30px;"
            data-swiper-slide-index="2"
          >
            <article class="article-card article-card-chouquettise">
              <a
                href="https://uat.lachouquette.ch/dede-et-charlotte-concept-store-enfants-fribourg/"
                title="On te dorlote chez Dédé et Charlotte"
              >
                <div
                  class="article-card-picture"
                  style="background-image: url('https://uat.lachouquette.ch/wp-content/uploads/2019/03/Article-Chouquette-Image-3-768x596.jpg')"
                >
                  <div class="article-card-category">
                    <img
                      src="https://uat.lachouquette.ch/wp-content/uploads/2019/04/Shopping_noir-150x150.png"
                      alt="Mode, déco, épicerie, web"
                      title="Shopping"
                      class=""
                    />
                  </div>
                </div>
                <div
                  class="article-card-caption d-flex text-center justify-content-center align-items-center"
                >
                  On te dorlote chez Dédé et Charlotte
                </div>
              </a>
            </article>
          </div>
          <div
            class="swiper-slide swiper-slide-active"
            style="width: 255px; margin-right: 30px;"
            data-swiper-slide-index="3"
          >
            <article class="article-card article-card-chouquettise">
              <a
                href="https://uat.lachouquette.ch/philippe-k-luxe-responsable-haute-parfumerie-lausanne-boutique/"
                title="Philippe K, l’ADN du luxe responsable"
              >
                <div
                  class="article-card-picture"
                  style="background-image: url('https://uat.lachouquette.ch/wp-content/uploads/2018/12/Philippe-k-haute-parfumerie-lausanne-768x432.png')"
                >
                  <div class="article-card-category">
                    <img
                      src="https://uat.lachouquette.ch/wp-content/uploads/2019/04/Shopping_noir-150x150.png"
                      alt="Mode, déco, épicerie, web"
                      title="Shopping"
                      class=""
                    />
                  </div>
                </div>
                <div
                  class="article-card-caption d-flex text-center justify-content-center align-items-center"
                >
                  Philippe K, l’ADN du luxe responsable
                </div>
              </a>
            </article>
          </div>
          <div
            class="swiper-slide swiper-slide-next"
            style="width: 255px; margin-right: 30px;"
            data-swiper-slide-index="4"
          >
            <article class="article-card ">
              <a
                href="https://uat.lachouquette.ch/qwstion-concept-store-minimaliste-ethique-lausanne/"
                title="Qwstion, le concept-store minimaliste éthique"
              >
                <div
                  class="article-card-picture"
                  style="background-image: url('https://uat.lachouquette.ch/wp-content/uploads/2018/09/Q_STORE_LAUSANNE_PREVIEW_4_HR-768x512.jpeg')"
                >
                  <div class="article-card-category">
                    <img
                      src="https://uat.lachouquette.ch/wp-content/uploads/2019/04/Shopping_noir-150x150.png"
                      alt="Mode, déco, épicerie, web"
                      title="Shopping"
                      class=""
                    />
                  </div>
                </div>
                <div
                  class="article-card-caption d-flex text-center justify-content-center align-items-center"
                >
                  Qwstion, le concept-store minimaliste éthique
                </div>
              </a>
            </article>
          </div>
          <div
            class="swiper-slide"
            style="width: 255px; margin-right: 30px;"
            data-swiper-slide-index="5"
          >
            <article class="article-card ">
              <a
                href="https://uat.lachouquette.ch/point-a-couture-mode-femme-lausanne-sur-mesure/"
                title="point A couture, ta mode sur-mesure made in Lausanne !"
              >
                <div
                  class="article-card-picture"
                  style="background-image: url('https://uat.lachouquette.ch/wp-content/uploads/2018/05/A11Fred-Kittel-2017-768x526.jpg')"
                >
                  <div class="article-card-category">
                    <img
                      src="https://uat.lachouquette.ch/wp-content/uploads/2019/04/Shopping_noir-150x150.png"
                      alt="Mode, déco, épicerie, web"
                      title="Shopping"
                      class=""
                    />
                  </div>
                </div>
                <div
                  class="article-card-caption d-flex text-center justify-content-center align-items-center"
                >
                  point A couture, ta mode sur-mesure made in Lausanne !
                </div>
              </a>
            </article>
          </div>
          <div
            class="swiper-slide swiper-slide-duplicate"
            style="width: 255px; margin-right: 30px;"
            data-swiper-slide-index="0"
          >
            <article class="article-card article-card-chouquettise">
              <a
                href="https://uat.lachouquette.ch/bienvenue-au-temple-du-design-aka-le-mudac/"
                title="Bienvenue au temple du design aka le Mudac"
              >
                <div
                  class="article-card-picture"
                  style="background-image: url('https://uat.lachouquette.ch/wp-content/uploads/2020/02/mudac2014_35_web-1500x1263-1-768x647.jpg')"
                >
                  <div class="article-card-category">
                    <img
                      src="https://uat.lachouquette.ch/wp-content/uploads/2019/04/Culture_noir-150x150.png"
                      alt="Musique, Musées, Théâtre..."
                      title="Culture"
                      class=""
                    />
                  </div>
                </div>
                <div
                  class="article-card-caption d-flex text-center justify-content-center align-items-center"
                >
                  Bienvenue au temple du design aka le Mudac
                </div>
              </a>
            </article>
          </div>
          <div
            class="swiper-slide swiper-slide-duplicate"
            style="width: 255px; margin-right: 30px;"
            data-swiper-slide-index="1"
          >
            <article class="article-card article-card-chouquettise">
              <a
                href="https://uat.lachouquette.ch/so-sweet-ml-biscuit-personnalise-commande-atelier/"
                title="So Sweet ML"
              >
                <div
                  class="article-card-picture"
                  style="background-image: url('https://uat.lachouquette.ch/wp-content/uploads/2019/11/sweet-M-L-cover.png')"
                >
                  <div class="article-card-category">
                    <img
                      src="https://uat.lachouquette.ch/wp-content/uploads/2019/04/Shopping_noir-150x150.png"
                      alt="Mode, déco, épicerie, web"
                      title="Shopping"
                      class=""
                    />
                  </div>
                </div>
                <div
                  class="article-card-caption d-flex text-center justify-content-center align-items-center"
                >
                  So Sweet ML
                </div>
              </a>
            </article>
          </div>
          <div
            class="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-prev"
            style="width: 255px; margin-right: 30px;"
            data-swiper-slide-index="2"
          >
            <article class="article-card article-card-chouquettise">
              <a
                href="https://uat.lachouquette.ch/dede-et-charlotte-concept-store-enfants-fribourg/"
                title="On te dorlote chez Dédé et Charlotte"
              >
                <div
                  class="article-card-picture"
                  style="background-image: url('https://uat.lachouquette.ch/wp-content/uploads/2019/03/Article-Chouquette-Image-3-768x596.jpg')"
                >
                  <div class="article-card-category">
                    <img
                      src="https://uat.lachouquette.ch/wp-content/uploads/2019/04/Shopping_noir-150x150.png"
                      alt="Mode, déco, épicerie, web"
                      title="Shopping"
                      class=""
                    />
                  </div>
                </div>
                <div
                  class="article-card-caption d-flex text-center justify-content-center align-items-center"
                >
                  On te dorlote chez Dédé et Charlotte
                </div>
              </a>
            </article>
          </div>
          <div
            class="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-active"
            style="width: 255px; margin-right: 30px;"
            data-swiper-slide-index="3"
          >
            <article class="article-card article-card-chouquettise">
              <a
                href="https://uat.lachouquette.ch/philippe-k-luxe-responsable-haute-parfumerie-lausanne-boutique/"
                title="Philippe K, l’ADN du luxe responsable"
              >
                <div
                  class="article-card-picture"
                  style="background-image: url('https://uat.lachouquette.ch/wp-content/uploads/2018/12/Philippe-k-haute-parfumerie-lausanne-768x432.png')"
                >
                  <div class="article-card-category">
                    <img
                      src="https://uat.lachouquette.ch/wp-content/uploads/2019/04/Shopping_noir-150x150.png"
                      alt="Mode, déco, épicerie, web"
                      title="Shopping"
                      class=""
                    />
                  </div>
                </div>
                <div
                  class="article-card-caption d-flex text-center justify-content-center align-items-center"
                >
                  Philippe K, l’ADN du luxe responsable
                </div>
              </a>
            </article>
          </div>
        </div>
        <div
          class="swiper-button-next swiper-button-black"
          tabindex="0"
          role="button"
          aria-label="Next slide"
        ></div>
        <div
          class="swiper-button-prev swiper-button-black"
          tabindex="0"
          role="button"
          aria-label="Previous slide"
        ></div>
        <span
          class="swiper-notification"
          aria-live="assertive"
          aria-atomic="true"
        ></span>
      </div>
    </div>

    <div id="app">
      <div class="cq-single-post-fiches">
        <button
          type="button"
          class="cq-single-post-fiches-btn btn btn-lg btn-primary cq-toggle reverse d-none d-md-inline-block"
        >
          <i class="fa"></i><span class="ml-2">Voir la fiche</span>
        </button>
        <button
          type="button"
          class="cq-single-post-fiches-btn-sm btn btn-sm btn-primary cq-toggle horizontal d-md-none"
          style="right: -150px;"
        >
          <i class="fa"></i><span class="ml-2">Voir la fiche</span>
        </button>
        <div class="cq-single-post-fiches-wrapper">
          <div id="fichesAccordion" class="collapse show" style="">
            <button
              type="button"
              data-toggle="collapse"
              data-target="#fiche22173"
              aria-expanded="false"
              aria-controls="collapseOne"
              class="w-100 btn btn-yellow d-block cq-toggle collapsed"
            >
              <i class="fa mr-2 float-left"></i>Finest Vintage
            </button>
            <div
              id="fiche22173"
              aria-labelledby="headingOne"
              data-parent="#fichesAccordion"
              class="p-2 collapse"
              style=""
            >
              <article
                data-fiche-id="22173"
                data-fiche-name="http://Finest%20Vintage"
                data-fiche-lat="46.5379432"
                data-fiche-lng="6.5832128"
                data-fiche-icon="https://uat.lachouquette.ch/wp-content/uploads/2019/06/shopping-mode_marker_yellow-e1561457382285.png"
                class="fiche fiche-flip fiche-chouquettise"
                style="height: 555px; touch-action: pan-y; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);"
              >
                <a id="target22173" class="fiche-target"></a>
                <div class="fiche-container">
                  <div class="fiche-front">
                    <div class="card">
                      <div
                        class="card-header fiche-header p-2"
                        style='background-image: url("https://uat.lachouquette.ch/wp-content/uploads/2020/01/IMG_8863-768x1024.jpeg");'
                      >
                        <div class="fiche-header-icon">
                          <img
                            src="https://uat.lachouquette.ch/wp-content/uploads/2019/06/shopping-mode_black-e1561471902814-150x150.png"
                            alt=""
                            title="Mode"
                          />
                        </div>
                      </div>
                      <div
                        class="card-body d-flex flex-column position-relative"
                      >
                        <h5 class="card-title text-center">Finest Vintage</h5>
                        <p class="fiche-content card-text">
                          Des accessoires et vêtements seconde-main pour femmes
                          ET hommes chinés avec amour par Alberto ! Voilà une
                          boutique chouette où acheter des pièces fabriquées
                          dans des matériaux de qualité à des prix abordables
                          :-).
                        </p>
                        <div
                          class="card-text d-flex justify-content-around mt-auto"
                        >
                          <a
                            href="tel:+41 79 508 07 52"
                            title="Téléphoner"
                            target="_blank"
                            class="fiche-social"
                            ><i class="fas fa-phone"></i
                          ></a>
                          <a
                            href="#"
                            title="Envoyer un message"
                            data-toggle="modal"
                            data-target="#ficheContactModal"
                            data-fiche-title="Les fripes de Finest Vintage, c’est chic&amp;nbsp;!"
                            data-fiche-id="22173"
                            class="fiche-social"
                            ><i class="far fa-envelope"></i
                          ></a>
                          <a
                            href="https://www.facebook.com/finestvintagerenens/"
                            title="Facebook"
                            target="_blank"
                            class="fiche-social"
                            ><i class="fab fa-facebook-f"></i
                          ></a>
                          <a
                            href="https://www.instagram.com/finestvintage_renens/"
                            title="Instagram"
                            target="_blank"
                            class="fiche-social"
                            ><i class="fab fa-instagram"></i
                          ></a>
                        </div>
                        <a
                          title="Reporter une précision ou erreur sur la fiche"
                          href="#"
                          data-toggle="modal"
                          data-target="#ficheReportModal"
                          data-fiche-title="Les fripes de Finest Vintage, c’est chic&amp;nbsp;!"
                          data-fiche-id="22173"
                          class="fiche-report"
                          ><i class="fas fa-exclamation-circle"></i
                        ></a>
                      </div>
                      <div class="card-footer">
                        <a
                          href="https://uat.lachouquette.ch/finest-vintage-fripes-seconde-main-renens/"
                          title="Dernier article sur le lieu"
                          class="btn btn-outline-secondary"
                          ><i class="far fa-newspaper"></i
                        ></a>
                        <a
                          href="#"
                          title="Plus de détails (retourner la fiche)"
                          class="btn btn-secondary float-right"
                          ><i class="fas fa-plus"></i
                        ></a>
                      </div>
                    </div>
                  </div>
                  <div class="fiche-back">
                    <div class="card" style="height: 557px;">
                      <div class="fiche-header fiche-map"></div>
                      <ul class="list-group list-group-flush">
                        <li class="list-group-item">
                          <a
                            href="tel:+41 79 508 07 52"
                            title="Téléphone"
                            target="_blank"
                            class="link-secondary link-no-decoration"
                            ><i class="fas fa-phone"></i> +41 79 508 07 52
                          </a>
                        </li>
                        <li class="list-group-item">
                          <a
                            href="mailto:info@finest-vintage.ch?body=%0A---%0AEnvoy%C3%A9%20depuis%20https://uat.lachouquette.ch"
                            title="Email"
                            target="_blank"
                            class="link-secondary link-no-decoration"
                            ><i class="fas fa-at"></i> info@finest-vintage.ch
                          </a>
                        </li>
                        <li class="list-group-item">
                          <label class="mb-0">Prix :</label>
                          <span class="fiche-price fiche-price-selected"
                            >$$$</span
                          ><span class="fiche-price">$$</span>
                        </li>
                        <li class="list-group-item">
                          <label class="mb-0">Horaires :</label>
                          <div class="dropup d-inline-block fiche-planning">
                            <a
                              id="planning22173"
                              role="button"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                              class="link-secondary link-no-decoration dropdown-toggle"
                              >13h - 19h</a
                            >
                            <div
                              aria-labelledby="planning22173"
                              class="dropdown-menu"
                            >
                              <ul>
                                <li><label class="mb-0">Lundi</label> Fermé</li>
                                <li>
                                  <label class="mb-0">Mardi</label> 13h - 19h
                                </li>
                                <li>
                                  <label class="mb-0">Mercredi</label> 13h - 19h
                                </li>
                                <li>
                                  <label class="mb-0">Jeudi</label> 13h - 19h
                                </li>
                                <li>
                                  <label class="mb-0">Vendredi</label> 13h - 19h
                                </li>
                                <li>
                                  <label class="mb-0">Samedi</label> 10h - 17h
                                </li>
                                <li>
                                  <label class="mb-0">Dimanche</label> Fermé
                                </li>
                              </ul>
                            </div>
                          </div>
                        </li>
                      </ul>
                      <div class="card-body position-relative">
                        <span>Accessoire, Femme, Homme, Seconde-main</span>
                        <a
                          href="#"
                          title="Reporter une précision ou erreur sur la fiche"
                          data-toggle="modal"
                          data-target="#ficheReportModal"
                          data-fiche-title="Les fripes de Finest Vintage, c’est chic&amp;nbsp;!"
                          data-fiche-id="22173"
                          class="fiche-report"
                          ><i class="fas fa-exclamation-circle"></i
                        ></a>
                      </div>
                      <div class="card-footer">
                        <a
                          href="https://uat.lachouquette.ch/finest-vintage-fripes-seconde-main-renens/"
                          title="Dernier article sur le lieu"
                          class="btn btn-outline-secondary"
                          ><i class="far fa-newspaper"></i
                        ></a>
                        <a
                          href="#"
                          title="Plus de détails (retourner la fiche)"
                          class="btn btn-secondary float-right"
                          ><i class="fas fa-plus"></i
                        ></a>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import WPMedia from '../components/WPMedia'
import MomentDateTime from '../components/MomentDateTime'

export default {
  components: { WPMedia, MomentDateTime },
  async fetch({ store, params }) {
    await store.dispatch('posts/fetchPost', params.slug)
  },
  computed: {
    ...mapState('posts', ['post']),
    ...mapGetters('posts', ['featuredMedia', 'author'])
  },
  head() {
    // Set Meta Tags for this Page
  }
  // and more functionality to discover
}
</script>

<style scoped></style>
