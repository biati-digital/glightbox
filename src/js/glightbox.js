/**
 * GLightbox
 * Awesome pure javascript lightbox
 * made by https://www.biati.digital
 * Github: https://github.com/biati-digital/glightbox
 */

import keyboardNavigation from './core/keyboard-navigation.js';
import Slide from './core/slide.js';
import touchNavigation from './core/touch-navigation.js';
import * as _ from './utils/helpers.js';

const version = '3.3.1';
const isMobile = _.isMobile();
const isTouch = _.isTouch();
const html = document.getElementsByTagName('html')[0];

const defaults = {
    selector: '.glightbox',
    elements: null,
    skin: 'clean',
    theme: 'clean',
    closeButton: true,
    startAt: null,
    autoplayVideos: true,
    autofocusVideos: true,
    descPosition: 'bottom',
    width: '900px',
    height: '506px',
    videosWidth: '960px',
    beforeSlideChange: null,
    afterSlideChange: null,
    beforeSlideLoad: null,
    afterSlideLoad: null,
    slideInserted: null,
    slideRemoved: null,
    slideExtraAttributes: null,
    onOpen: null,
    onClose: null,
    loop: false,
    zoomable: true,
    draggable: true,
    dragAutoSnap: false,
    dragToleranceX: 40,
    dragToleranceY: 65,
    preload: true,
    oneSlidePerOpen: false,
    touchNavigation: true,
    touchFollowAxis: true,
    keyboardNavigation: true,
    closeOnOutsideClick: true,
    plugins: false,
    plyr: {
        css: 'https://cdn.plyr.io/3.6.12/plyr.css',
        js: 'https://cdn.plyr.io/3.6.12/plyr.js',
        config: {
            ratio: '16:9', // or '4:3'
            fullscreen: { enabled: true, iosNative: true },
            youtube: {
                noCookie: true,
                rel: 0,
                showinfo: 0,
                iv_load_policy: 3 // eslint-disable-line camelcase
            },
            vimeo: {
                byline: false,
                portrait: false,
                title: false,
                transparent: false
            }
        }
    },
    openEffect: 'zoom', // fade, zoom, none
    closeEffect: 'zoom', // fade, zoom, none
    slideEffect: 'slide', // fade, slide, zoom, none
    moreText: 'See more',
    moreLength: 60,
    cssEfects: {
        fade: { in: 'fadeIn', out: 'fadeOut' },
        zoom: { in: 'zoomIn', out: 'zoomOut' },
        slide: { in: 'slideInRight', out: 'slideOutLeft' },
        slideBack: { in: 'slideInLeft', out: 'slideOutRight' },
        none: { in: 'none', out: 'none' }
    },
    svg: {
        close: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve"><g><g><path d="M505.943,6.058c-8.077-8.077-21.172-8.077-29.249,0L6.058,476.693c-8.077,8.077-8.077,21.172,0,29.249C10.096,509.982,15.39,512,20.683,512c5.293,0,10.586-2.019,14.625-6.059L505.943,35.306C514.019,27.23,514.019,14.135,505.943,6.058z"/></g></g><g><g><path d="M505.942,476.694L35.306,6.059c-8.076-8.077-21.172-8.077-29.248,0c-8.077,8.076-8.077,21.171,0,29.248l470.636,470.636c4.038,4.039,9.332,6.058,14.625,6.058c5.293,0,10.587-2.019,14.624-6.057C514.018,497.866,514.018,484.771,505.942,476.694z"/></g></g></svg>',
        next: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"> <g><path d="M360.731,229.075l-225.1-225.1c-5.3-5.3-13.8-5.3-19.1,0s-5.3,13.8,0,19.1l215.5,215.5l-215.5,215.5c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-4l225.1-225.1C365.931,242.875,365.931,234.275,360.731,229.075z"/></g></svg>',
        prev: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"><g><path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"/></g></svg>'
    }
};

// You can pass your own slide structure
// just make sure that add the same classes so they are populated
// title class = gslide-title
// desc class = gslide-desc
// prev arrow class = gnext
// next arrow id = gprev
// close id = gclose
defaults.slideHTML = `<div class="gslide">
    <div class="gslide-inner-content">
        <div class="ginner-container">
            <div class="gslide-media">
            </div>
            <div class="gslide-description">
                <div class="gdesc-inner">
                    <h4 class="gslide-title"></h4>
                    <div class="gslide-desc"></div>
                </div>
            </div>
        </div>
    </div>
</div>`;

defaults.lightboxHTML = `<div id="glightbox-body" class="glightbox-container" tabindex="-1" role="dialog" aria-hidden="false">
    <div class="gloader visible"></div>
    <div class="goverlay"></div>
    <div class="gcontainer">
    <div id="glightbox-slider" class="gslider"></div>
    <button class="gclose gbtn" aria-label="Close" data-taborder="3">{closeSVG}</button>
    <button class="gprev gbtn" aria-label="Previous" data-taborder="2">{prevSVG}</button>
    <button class="gnext gbtn" aria-label="Next" data-taborder="1">{nextSVG}</button>
</div>
</div>`;

/**
 * GLightbox Class
 * Class and public methods
 */
class GlightboxInit {
    constructor(options = {}) {
        this.customOptions = options;
        this.settings = _.extend(defaults, options);
        this.effectsClasses = this.getAnimationClasses();
        this.videoPlayers = {};
        this.apiEvents = [];
        this.fullElementsList = false;
    }

    init() {
        const selector = this.getSelector();

        if (selector) {
            this.baseEvents = _.addEvent('click', {
                onElement: selector,
                withCallback: (e, target) => {
                    e.preventDefault();
                    this.open(target);
                }
            });
        }

        this.elements = this.getElements();
    }

    open(element = null, startAt = null) {
        if (this.elements.length === 0) {
            return false;
        }

        this.activeSlide = null;
        this.prevActiveSlideIndex = null;
        this.prevActiveSlide = null;
        let index = _.isNumber(startAt) ? startAt : this.settings.startAt;

        if (_.isNode(element)) {
            const gallery = element.getAttribute('data-gallery');
            if (gallery) {
                this.fullElementsList = this.elements;
                this.elements = this.getGalleryElements(this.elements, gallery);
            }
            if (_.isNil(index)) {
                // get the index of the element
                index = this.getElementIndex(element);
                if (index < 0) {
                    index = 0;
                }
            }
        }

        if (!_.isNumber(index)) {
            index = 0;
        }

        this.build();

        _.animateElement(this.overlay, this.settings.openEffect === 'none' ? 'none' : this.settings.cssEfects.fade.in);

        const body = document.body;

        const scrollBar = window.innerWidth - document.documentElement.clientWidth;
        if (scrollBar > 0) {
            var styleSheet = document.createElement('style');
            styleSheet.type = 'text/css';
            styleSheet.className = 'gcss-styles';
            styleSheet.innerText = `.gscrollbar-fixer {margin-right: ${scrollBar}px}`;
            document.head.appendChild(styleSheet);
            _.addClass(body, 'gscrollbar-fixer');
        }

        _.addClass(body, 'glightbox-open');
        _.addClass(html, 'glightbox-open');
        if (isMobile) {
            _.addClass(document.body, 'glightbox-mobile');
            this.settings.slideEffect = 'slide';
        }

        this.showSlide(index, true);

        if (this.elements.length === 1) {
            _.addClass(this.prevButton, 'glightbox-button-hidden');
            _.addClass(this.nextButton, 'glightbox-button-hidden');
        } else {
            _.removeClass(this.prevButton, 'glightbox-button-hidden');
            _.removeClass(this.nextButton, 'glightbox-button-hidden');
        }
        this.lightboxOpen = true;

        this.trigger('open');

        // settings.onOpen is deprecated and will be removed in a future update
        if (_.isFunction(this.settings.onOpen)) {
            this.settings.onOpen();
        }
        if (isTouch && this.settings.touchNavigation) {
            touchNavigation(this);
        }
        if (this.settings.keyboardNavigation) {
            keyboardNavigation(this);
        }
    }

    /**
     * Open at specific index
     * @param {int} index
     */
    openAt(index = 0) {
        this.open(null, index);
    }

    /**
     * Set Slide
     */
    showSlide(index = 0, first = false) {
        _.show(this.loader);
        this.index = parseInt(index);

        let current = this.slidesContainer.querySelector('.current');
        if (current) {
            _.removeClass(current, 'current');
        }

        // hide prev slide
        this.slideAnimateOut();

        let slideNode = this.slidesContainer.querySelectorAll('.gslide')[index];

        // Check if slide's content is alreay loaded
        if (_.hasClass(slideNode, 'loaded')) {
            this.slideAnimateIn(slideNode, first);
            _.hide(this.loader);
        } else {
            // If not loaded add the slide content
            _.show(this.loader);

            const slide = this.elements[index];
            const slideData = {
                index: this.index,
                slide: slideNode, //this will be removed in the future
                slideNode: slideNode,
                slideConfig: slide.slideConfig,
                slideIndex: this.index,
                trigger: slide.node,
                player: null
            };

            this.trigger('slide_before_load', slideData);

            slide.instance.setContent(slideNode, () => {
                _.hide(this.loader);
                this.resize();
                this.slideAnimateIn(slideNode, first);
                this.trigger('slide_after_load', slideData);
            });
        }

        this.slideDescription = slideNode.querySelector('.gslide-description');
        this.slideDescriptionContained = this.slideDescription && _.hasClass(this.slideDescription.parentNode, 'gslide-media');

        // Preload subsequent slides
        if (this.settings.preload) {
            this.preloadSlide(index + 1);
            this.preloadSlide(index - 1);
        }

        // Handle navigation arrows
        this.updateNavigationClasses();

        this.activeSlide = slideNode;
    }

    /**
     * Preload slides
     * @param  {Int}  index slide index
     * @return {null}
     */
    preloadSlide(index) {
        // Verify slide index, it can not be lower than 0
        // and it can not be greater than the total elements
        if (index < 0 || index > this.elements.length - 1) {
            return false;
        }

        if (_.isNil(this.elements[index])) {
            return false;
        }

        let slideNode = this.slidesContainer.querySelectorAll('.gslide')[index];
        if (_.hasClass(slideNode, 'loaded')) {
            return false;
        }

        const slide = this.elements[index];
        const type = slide.type;
        const slideData = {
            index: index,
            slide: slideNode, //this will be removed in the future
            slideNode: slideNode,
            slideConfig: slide.slideConfig,
            slideIndex: index,
            trigger: slide.node,
            player: null
        };

        this.trigger('slide_before_load', slideData);

        if (type === 'video' || type === 'external') {
            setTimeout(() => {
                slide.instance.setContent(slideNode, () => {
                    this.trigger('slide_after_load', slideData);
                });
            }, 200);
        } else {
            slide.instance.setContent(slideNode, () => {
                this.trigger('slide_after_load', slideData);
            });
        }
    }

    /**
     * Load previous slide
     * calls goToslide
     */
    prevSlide() {
        this.goToSlide(this.index - 1);
    }

    /**
     * Load next slide
     * calls goToslide
     */
    nextSlide() {
        this.goToSlide(this.index + 1);
    }

    /**
     * Go to sldei
     * calls set slide
     * @param {Int} - index
     */
    goToSlide(index = false) {
        this.prevActiveSlide = this.activeSlide;
        this.prevActiveSlideIndex = this.index;

        if (!this.loop() && (index < 0 || index > this.elements.length - 1)) {
            return false;
        }
        if (index < 0) {
            index = this.elements.length - 1;
        } else if (index >= this.elements.length) {
            index = 0;
        }
        this.showSlide(index);
    }

    /**
     * Insert slide
     *
     * @param { object } data
     * @param { numeric } position
     */
    insertSlide(config = {}, index = -1) {
        // Append at the end
        if (index < 0) {
            index = this.elements.length;
        }

        const slide = new Slide(config, this, index);
        const data = slide.getConfig();
        const slideInfo = _.extend({}, data);
        const newSlide = slide.create();
        const totalSlides = this.elements.length - 1;

        slideInfo.index = index;
        slideInfo.node = false;
        slideInfo.instance = slide;
        slideInfo.slideConfig = data;
        this.elements.splice(index, 0, slideInfo);

        let addedSlideNode = null;
        let addedSlidePlayer = null;

        if (this.slidesContainer) {
            // Append at the end
            if (index > totalSlides) {
                this.slidesContainer.appendChild(newSlide);
            } else {
                // A current slide must exist in the position specified
                // we need tp get that slide and insder the new slide before
                let existingSlide = this.slidesContainer.querySelectorAll('.gslide')[index];
                this.slidesContainer.insertBefore(newSlide, existingSlide);
            }

            if ((this.settings.preload && this.index == 0 && index == 0) || this.index - 1 == index || this.index + 1 == index) {
                this.preloadSlide(index);
            }

            if (this.index === 0 && index === 0) {
                this.index = 1;
            }

            this.updateNavigationClasses();

            addedSlideNode = this.slidesContainer.querySelectorAll('.gslide')[index];
            addedSlidePlayer = this.getSlidePlayerInstance(index);
            slideInfo.slideNode = addedSlideNode;
        }

        this.trigger('slide_inserted', {
            index: index,
            slide: addedSlideNode,
            slideNode: addedSlideNode,
            slideConfig: data,
            slideIndex: index,
            trigger: null,
            player: addedSlidePlayer
        });

        // Deprecated and will be removed in a future update
        if (_.isFunction(this.settings.slideInserted)) {
            this.settings.slideInserted({
                index: index,
                slide: addedSlideNode,
                player: addedSlidePlayer
            });
        }
    }

    /**
     * Remove slide
     *
     * @param { numeric } position
     */
    removeSlide(index = -1) {
        if (index < 0 || index > this.elements.length - 1) {
            return false;
        }

        const slide = this.slidesContainer && this.slidesContainer.querySelectorAll('.gslide')[index];

        if (slide) {
            if (this.getActiveSlideIndex() == index) {
                if (index == this.elements.length - 1) {
                    this.prevSlide();
                } else {
                    this.nextSlide();
                }
            }
            slide.parentNode.removeChild(slide);
        }
        this.elements.splice(index, 1);

        this.trigger('slide_removed', index);

        // Deprecated and will be removed in a future update
        if (_.isFunction(this.settings.slideRemoved)) {
            this.settings.slideRemoved(index);
        }
    }

    /**
     * Slide In
     * @return {null}
     */
    slideAnimateIn(slide, first) {
        let slideMedia = slide.querySelector('.gslide-media');
        let slideDesc = slide.querySelector('.gslide-description');
        let prevData = {
            index: this.prevActiveSlideIndex,
            slide: this.prevActiveSlide, //this will be removed in the future
            slideNode: this.prevActiveSlide,
            slideIndex: this.prevActiveSlide,
            slideConfig: _.isNil(this.prevActiveSlideIndex) ? null : this.elements[this.prevActiveSlideIndex].slideConfig,
            trigger: _.isNil(this.prevActiveSlideIndex) ? null : this.elements[this.prevActiveSlideIndex].node,
            player: this.getSlidePlayerInstance(this.prevActiveSlideIndex)
        };

        let nextData = {
            index: this.index,
            slide: this.activeSlide, //this will be removed in the future
            slideNode: this.activeSlide,
            slideConfig: this.elements[this.index].slideConfig,
            slideIndex: this.index,
            trigger: this.elements[this.index].node,
            player: this.getSlidePlayerInstance(this.index)
        };
        if (slideMedia.offsetWidth > 0 && slideDesc) {
            _.hide(slideDesc);
            slideDesc.style.display = '';
        }

        _.removeClass(slide, this.effectsClasses);

        if (first) {
            _.animateElement(slide, this.settings.cssEfects[this.settings.openEffect].in, () => {
                if (this.settings.autoplayVideos) {
                    this.slidePlayerPlay(slide);
                }

                this.trigger('slide_changed', {
                    prev: prevData,
                    current: nextData
                });

                // settings.afterSlideChange is deprecated and will be removed in a future update
                if (_.isFunction(this.settings.afterSlideChange)) {
                    this.settings.afterSlideChange.apply(this, [prevData, nextData]);
                }
            });
        } else {
            let effectName = this.settings.slideEffect;
            let animIn = effectName !== 'none' ? this.settings.cssEfects[effectName].in : effectName;
            if (this.prevActiveSlideIndex > this.index) {
                if (this.settings.slideEffect == 'slide') {
                    animIn = this.settings.cssEfects.slideBack.in;
                }
            }
            _.animateElement(slide, animIn, () => {
                if (this.settings.autoplayVideos) {
                    this.slidePlayerPlay(slide);
                }

                this.trigger('slide_changed', {
                    prev: prevData,
                    current: nextData
                });

                // settings.afterSlideChange is deprecated and will be removed in a future update
                if (_.isFunction(this.settings.afterSlideChange)) {
                    this.settings.afterSlideChange.apply(this, [prevData, nextData]);
                }
            });
        }

        setTimeout(() => {
            this.resize(slide);
        }, 100);
        _.addClass(slide, 'current');
    }

    /**
     * Slide out
     */
    slideAnimateOut() {
        if (!this.prevActiveSlide) {
            return false;
        }

        let prevSlide = this.prevActiveSlide;
        _.removeClass(prevSlide, this.effectsClasses);
        _.addClass(prevSlide, 'prev');

        let animation = this.settings.slideEffect;
        let animOut = animation !== 'none' ? this.settings.cssEfects[animation].out : animation;

        this.slidePlayerPause(prevSlide);

        this.trigger('slide_before_change', {
            prev: {
                index: this.prevActiveSlideIndex, //this will be removed in the future
                slide: this.prevActiveSlide, //this will be removed in the future
                slideNode: this.prevActiveSlide,
                slideIndex: this.prevActiveSlideIndex,
                slideConfig: _.isNil(this.prevActiveSlideIndex) ? null : this.elements[this.prevActiveSlideIndex].slideConfig,
                trigger: _.isNil(this.prevActiveSlideIndex) ? null : this.elements[this.prevActiveSlideIndex].node,
                player: this.getSlidePlayerInstance(this.prevActiveSlideIndex)
            },
            current: {
                index: this.index, //this will be removed in the future
                slide: this.activeSlide, //this will be removed in the future
                slideNode: this.activeSlide,
                slideIndex: this.index,
                slideConfig: this.elements[this.index].slideConfig,
                trigger: this.elements[this.index].node,
                player: this.getSlidePlayerInstance(this.index)
            }
        });

        // settings.beforeSlideChange is deprecated and will be removed in a future update
        if (_.isFunction(this.settings.beforeSlideChange)) {
            this.settings.beforeSlideChange.apply(this, [
                {
                    index: this.prevActiveSlideIndex,
                    slide: this.prevActiveSlide,
                    player: this.getSlidePlayerInstance(this.prevActiveSlideIndex)
                },
                {
                    index: this.index,
                    slide: this.activeSlide,
                    player: this.getSlidePlayerInstance(this.index)
                }
            ]);
        }
        if (this.prevActiveSlideIndex > this.index && this.settings.slideEffect == 'slide') {
            // going back
            animOut = this.settings.cssEfects.slideBack.out;
        }
        _.animateElement(prevSlide, animOut, () => {
            let container = prevSlide.querySelector('.ginner-container');
            let media = prevSlide.querySelector('.gslide-media');
            let desc = prevSlide.querySelector('.gslide-description');

            container.style.transform = '';
            media.style.transform = '';
            _.removeClass(media, 'greset');
            media.style.opacity = '';
            if (desc) {
                desc.style.opacity = '';
            }
            _.removeClass(prevSlide, 'prev');
        });
    }

    /**
     * Get all defined players
     */
    getAllPlayers() {
        return this.videoPlayers;
    }

    /**
     * Get player at index
     *
     * @param index
     * @return bool|object
     */
    getSlidePlayerInstance(index) {
        const id = 'gvideo' + index;
        const videoPlayers = this.getAllPlayers();

        if (_.has(videoPlayers, id) && videoPlayers[id]) {
            return videoPlayers[id];
        }

        return false;
    }

    /**
     * Stop video at specified
     * node or index
     *
     * @param slide node or index
     * @return void
     */
    stopSlideVideo(slide) {
        if (_.isNode(slide)) {
            let node = slide.querySelector('.gvideo-wrapper');
            if (node) {
                slide = node.getAttribute('data-index');
            }
        }
        console.log('stopSlideVideo is deprecated, use slidePlayerPause');
        const player = this.getSlidePlayerInstance(slide);
        if (player && player.playing) {
            player.pause();
        }
    }

    /**
     * Stop player at specified index
     *
     * @param slide node or index
     * @return void
     */
    slidePlayerPause(slide) {
        if (_.isNode(slide)) {
            let node = slide.querySelector('.gvideo-wrapper');
            if (node) {
                slide = node.getAttribute('data-index');
            }
        }
        const player = this.getSlidePlayerInstance(slide);
        if (player && player.playing) {
            player.pause();
        }
    }

    /**
     * Play video at specified
     * node or index
     *
     * @param slide node or index
     * @return void
     */
    playSlideVideo(slide) {
        if (_.isNode(slide)) {
            let node = slide.querySelector('.gvideo-wrapper');
            if (node) {
                slide = node.getAttribute('data-index');
            }
        }
        console.log('playSlideVideo is deprecated, use slidePlayerPlay');
        const player = this.getSlidePlayerInstance(slide);
        if (player && !player.playing) {
            player.play();
        }
    }

    /**
     * Play media player at specified
     * node or index
     *
     * @param slide node or index
     * @return void
     */
    slidePlayerPlay(slide) {
        // Do not autoplay on mobile
        // plyr does not handle well the errors
        // and the player becomes unplayable
        if (isMobile && !this.settings.plyr.config?.muted) {
            return;
        }

        if (_.isNode(slide)) {
            let node = slide.querySelector('.gvideo-wrapper');
            if (node) {
                slide = node.getAttribute('data-index');
            }
        }

        const player = this.getSlidePlayerInstance(slide);

        if (player && !player.playing) {
            player.play();
            if (this.settings.autofocusVideos) {
                player.elements.container.focus();
            }
        }
    }

    /**
     * Set the entire elements
     * in the gallery, it replaces all
     * the existing elements
     * with the specified list
     *
     * @param {array}  elements
     */
    setElements(elements) {
        this.settings.elements = false;

        const newElements = [];

        if (elements && elements.length) {
            _.each(elements, (el, i) => {
                const slide = new Slide(el, this, i);
                const data = slide.getConfig();
                const slideInfo = _.extend({}, data);

                slideInfo.slideConfig = data;
                slideInfo.instance = slide;
                slideInfo.index = i;
                newElements.push(slideInfo);
            });
        }

        this.elements = newElements;

        if (this.lightboxOpen) {
            this.slidesContainer.innerHTML = '';

            if (this.elements.length) {
                _.each(this.elements, () => {
                    let slide = _.createHTML(this.settings.slideHTML);
                    this.slidesContainer.appendChild(slide);
                });
                this.showSlide(0, true);
            }
        }
    }

    /**
     * Return the index
     * of the specified node,
     * this node is for example an image, link, etc.
     * that when clicked it opens the lightbox
     * its position in the elements array can change
     * when using insertSlide or removeSlide so we
     * need to find it in the elements list
     *
     * @param {node} node
     * @return bool|int
     */
    getElementIndex(node) {
        let index = false;
        _.each(this.elements, (el, i) => {
            if (_.has(el, 'node') && el.node == node) {
                index = i;
                return true; // exit loop
            }
        });

        return index;
    }

    /**
     * Get elements
     * returns an array containing all
     * the elements that must be displayed in the
     * lightbox
     *
     * @return { array }
     */
    getElements() {
        let list = [];
        this.elements = this.elements ? this.elements : [];

        if (!_.isNil(this.settings.elements) && _.isArray(this.settings.elements) && this.settings.elements.length) {
            _.each(this.settings.elements, (el, i) => {
                const slide = new Slide(el, this, i);
                const elData = slide.getConfig();
                const slideInfo = _.extend({}, elData);

                slideInfo.node = false;
                slideInfo.index = i;
                slideInfo.instance = slide;
                slideInfo.slideConfig = elData;
                list.push(slideInfo);
            });
        }

        let nodes = false;
        let selector = this.getSelector();

        if (selector) {
            nodes = document.querySelectorAll(this.getSelector());
        }

        if (!nodes) {
            return list;
        }

        _.each(nodes, (el, i) => {
            const slide = new Slide(el, this, i);
            const elData = slide.getConfig();
            const slideInfo = _.extend({}, elData);

            slideInfo.node = el;
            slideInfo.index = i;
            slideInfo.instance = slide;
            slideInfo.slideConfig = elData;
            slideInfo.gallery = el.getAttribute('data-gallery');
            list.push(slideInfo);
        });

        return list;
    }

    /**
     * Return only the elements
     * from a specific gallery
     *
     * @return array
     */
    getGalleryElements(list, gallery) {
        return list.filter((el) => {
            return el.gallery == gallery;
        });
    }

    /**
     * Get selector
     */
    getSelector() {
        if (this.settings.elements) {
            return false;
        }
        if (this.settings.selector && this.settings.selector.substring(0, 5) == 'data-') {
            return `*[${this.settings.selector}]`;
        }
        return this.settings.selector;
    }

    /**
     * Get the active slide
     */
    getActiveSlide() {
        return this.slidesContainer.querySelectorAll('.gslide')[this.index];
    }

    /**
     * Get the active index
     */
    getActiveSlideIndex() {
        return this.index;
    }

    /**
     * Get the defined
     * effects as string
     */
    getAnimationClasses() {
        let effects = [];
        for (let key in this.settings.cssEfects) {
            if (this.settings.cssEfects.hasOwnProperty(key)) {
                let effect = this.settings.cssEfects[key];
                effects.push(`g${effect.in}`);
                effects.push(`g${effect.out}`);
            }
        }
        return effects.join(' ');
    }

    /**
     * Build the structure
     * @return {null}
     */
    build() {
        if (this.built) {
            return false;
        }

        // TODO: :scope is not supported on IE or first Edge. so we'll
        // update this when IE support is removed to use newer code
        //const children = document.body.querySelectorAll(':scope > *');
        const children = document.body.childNodes;
        const bodyChildElms = [];
        _.each(children, (el) => {
            if (el.parentNode == document.body && el.nodeName.charAt(0) !== '#' && el.hasAttribute && !el.hasAttribute('aria-hidden')) {
                bodyChildElms.push(el);
                el.setAttribute('aria-hidden', 'true');
            }
        });

        const nextSVG = _.has(this.settings.svg, 'next') ? this.settings.svg.next : '';
        const prevSVG = _.has(this.settings.svg, 'prev') ? this.settings.svg.prev : '';
        const closeSVG = _.has(this.settings.svg, 'close') ? this.settings.svg.close : '';

        let lightboxHTML = this.settings.lightboxHTML;
        lightboxHTML = lightboxHTML.replace(/{nextSVG}/g, nextSVG);
        lightboxHTML = lightboxHTML.replace(/{prevSVG}/g, prevSVG);
        lightboxHTML = lightboxHTML.replace(/{closeSVG}/g, closeSVG);

        lightboxHTML = _.createHTML(lightboxHTML);
        document.body.appendChild(lightboxHTML);

        const modal = document.getElementById('glightbox-body');
        this.modal = modal;
        let closeButton = modal.querySelector('.gclose');
        this.prevButton = modal.querySelector('.gprev');
        this.nextButton = modal.querySelector('.gnext');
        this.overlay = modal.querySelector('.goverlay');
        this.loader = modal.querySelector('.gloader');
        this.slidesContainer = document.getElementById('glightbox-slider');
        this.bodyHiddenChildElms = bodyChildElms;
        this.events = {};

        _.addClass(this.modal, 'glightbox-' + this.settings.skin);

        if (this.settings.closeButton && closeButton) {
            this.events['close'] = _.addEvent('click', {
                onElement: closeButton,
                withCallback: (e, target) => {
                    e.preventDefault();
                    this.close();
                }
            });
        }
        if (closeButton && !this.settings.closeButton) {
            closeButton.parentNode.removeChild(closeButton);
        }

        if (this.nextButton) {
            this.events['next'] = _.addEvent('click', {
                onElement: this.nextButton,
                withCallback: (e, target) => {
                    e.preventDefault();
                    this.nextSlide();
                }
            });
        }

        if (this.prevButton) {
            this.events['prev'] = _.addEvent('click', {
                onElement: this.prevButton,
                withCallback: (e, target) => {
                    e.preventDefault();
                    this.prevSlide();
                }
            });
        }
        if (this.settings.closeOnOutsideClick) {
            this.events['outClose'] = _.addEvent('click', {
                onElement: modal,
                withCallback: (e, target) => {
                    if (!this.preventOutsideClick && !_.hasClass(document.body, 'glightbox-mobile') && !_.closest(e.target, '.ginner-container')) {
                        if (!_.closest(e.target, '.gbtn') && !_.hasClass(e.target, 'gnext') && !_.hasClass(e.target, 'gprev')) {
                            this.close();
                        }
                    }
                }
            });
        }

        _.each(this.elements, (slide, i) => {
            this.slidesContainer.appendChild(slide.instance.create());
            slide.slideNode = this.slidesContainer.querySelectorAll('.gslide')[i];
        });
        if (isTouch) {
            _.addClass(document.body, 'glightbox-touch');
        }

        this.events['resize'] = _.addEvent('resize', {
            onElement: window,
            withCallback: () => {
                this.resize();
            }
        });

        this.built = true;
    }

    /**
     * Handle resize
     * Create only to handle
     * when the height of the screen
     * is lower than the slide content
     * this helps to resize videos vertically
     * and images with description
     */
    resize(slide = null) {
        slide = !slide ? this.activeSlide : slide;

        if (!slide || _.hasClass(slide, 'zoomed')) {
            return;
        }

        const winSize = _.windowSize();
        const video = slide.querySelector('.gvideo-wrapper');
        const image = slide.querySelector('.gslide-image');
        const description = this.slideDescription;

        let winWidth = winSize.width;
        let winHeight = winSize.height;

        if (winWidth <= 768) {
            _.addClass(document.body, 'glightbox-mobile');
        } else {
            _.removeClass(document.body, 'glightbox-mobile');
        }

        if (!video && !image) {
            return;
        }

        let descriptionResize = false;
        if (description && (_.hasClass(description, 'description-bottom') || _.hasClass(description, 'description-top')) && !_.hasClass(description, 'gabsolute')) {
            descriptionResize = true;
        }

        if (image) {
            if (winWidth <= 768) {
                let imgNode = image.querySelector('img');
                //imgNode.setAttribute('style', '');
            } else if (descriptionResize) {
                let descHeight = description.offsetHeight;
                let imgNode = image.querySelector('img');

                // if a slide height is set via data-height, we want to use that
                // if not, we fall back to 100vh
                const slideTriggerNode = this.elements[this.index]?.node;
                let maxHeightValue = '100vh';
                if (slideTriggerNode) {
                    maxHeightValue = slideTriggerNode.getAttribute('data-height') ?? maxHeightValue;
                }

                imgNode.setAttribute('style', `max-height: calc(${maxHeightValue} - ${descHeight}px)`);
                description.setAttribute('style', `max-width: ${imgNode.offsetWidth}px;`);
            }
        }

        if (video) {
            let ratio = _.has(this.settings.plyr.config, 'ratio') ? this.settings.plyr.config.ratio : '';

            if (!ratio) {
                // If no ratio passed, calculate it using the video width and height
                // generated by Plyr
                const containerWidth = video.clientWidth;
                const containerHeight = video.clientHeight;
                const divisor = containerWidth / containerHeight;
                ratio = `${containerWidth / divisor}:${containerHeight / divisor}`;
            }

            let videoRatio = ratio.split(':');
            let videoWidth = this.settings.videosWidth;
            let maxWidth = this.settings.videosWidth;

            if (_.isNumber(videoWidth) || videoWidth.indexOf('px') !== -1) {
                maxWidth = parseInt(videoWidth);
            } else {
                // If video size is vw, vh or % convert it to pixels,
                // fallback to the current video size
                if (videoWidth.indexOf('vw') !== -1) {
                    maxWidth = (winWidth * parseInt(videoWidth)) / 100;
                } else if (videoWidth.indexOf('vh') !== -1) {
                    maxWidth = (winHeight * parseInt(videoWidth)) / 100;
                } else if (videoWidth.indexOf('%') !== -1) {
                    maxWidth = (winWidth * parseInt(videoWidth)) / 100;
                } else {
                    maxWidth = parseInt(video.clientWidth);
                }
            }

            let maxHeight = maxWidth / (parseInt(videoRatio[0]) / parseInt(videoRatio[1]));
            maxHeight = Math.floor(maxHeight);

            if (descriptionResize) {
                winHeight = winHeight - description.offsetHeight;
            }

            if (maxWidth > winWidth || maxHeight > winHeight || (winHeight < maxHeight && winWidth > maxWidth)) {
                let vwidth = video.offsetWidth;
                let vheight = video.offsetHeight;
                let ratio = winHeight / vheight;
                let vsize = { width: vwidth * ratio, height: vheight * ratio };
                video.parentNode.setAttribute('style', `max-width: ${vsize.width}px`);

                if (descriptionResize) {
                    description.setAttribute('style', `max-width: ${vsize.width}px;`);
                }
            } else {
                video.parentNode.style.maxWidth = `${videoWidth}`;
                if (descriptionResize) {
                    description.setAttribute('style', `max-width: ${videoWidth};`);
                }
            }
        }
    }

    /**
     * Reload Lightbox
     * reload and apply events to nodes
     */
    reload() {
        this.init();
    }

    /**
     * Update navigation classes on slide change
     */
    updateNavigationClasses() {
        const loop = this.loop();
        // Handle navigation arrows
        _.removeClass(this.nextButton, 'disabled');
        _.removeClass(this.prevButton, 'disabled');

        if (this.index == 0 && this.elements.length - 1 == 0) {
            _.addClass(this.prevButton, 'disabled');
            _.addClass(this.nextButton, 'disabled');
        } else if (this.index === 0 && !loop) {
            _.addClass(this.prevButton, 'disabled');
        } else if (this.index === this.elements.length - 1 && !loop) {
            _.addClass(this.nextButton, 'disabled');
        }
    }

    /**
     * Handle loop config
     */
    loop() {
        let loop = _.has(this.settings, 'loopAtEnd') ? this.settings.loopAtEnd : null;
        loop = _.has(this.settings, 'loop') ? this.settings.loop : loop;

        return loop;
    }

    /**
     * Close Lightbox
     * closes the lightbox and removes the slides
     * and some classes
     */
    close() {
        if (!this.lightboxOpen) {
            if (this.events) {
                for (let key in this.events) {
                    if (this.events.hasOwnProperty(key)) {
                        this.events[key].destroy();
                    }
                }
                this.events = null;
            }
            return false;
        }

        if (this.closing) {
            return false;
        }
        this.closing = true;
        this.slidePlayerPause(this.activeSlide);

        if (this.fullElementsList) {
            this.elements = this.fullElementsList;
        }

        if (this.bodyHiddenChildElms.length) {
            _.each(this.bodyHiddenChildElms, (el) => {
                el.removeAttribute('aria-hidden');
            });
        }

        _.addClass(this.modal, 'glightbox-closing');
        _.animateElement(this.overlay, this.settings.openEffect == 'none' ? 'none' : this.settings.cssEfects.fade.out);
        _.animateElement(this.activeSlide, this.settings.cssEfects[this.settings.closeEffect].out, () => {
            this.activeSlide = null;
            this.prevActiveSlideIndex = null;
            this.prevActiveSlide = null;
            this.built = false;

            if (this.events) {
                for (let key in this.events) {
                    if (this.events.hasOwnProperty(key)) {
                        this.events[key].destroy();
                    }
                }
                this.events = null;
            }

            const body = document.body;
            _.removeClass(html, 'glightbox-open');
            _.removeClass(body, 'glightbox-open touching gdesc-open glightbox-touch glightbox-mobile gscrollbar-fixer');
            this.modal.parentNode.removeChild(this.modal);

            this.trigger('close');

            // settings.onClose is deprecated and will be removed in a future update
            if (_.isFunction(this.settings.onClose)) {
                this.settings.onClose();
            }

            const styles = document.querySelector('.gcss-styles');
            if (styles) {
                styles.parentNode.removeChild(styles);
            }
            this.lightboxOpen = false;
            this.closing = null;
        });
    }

    /**
     * Destroy lightbox
     * and all events
     */
    destroy() {
        this.close();
        this.clearAllEvents();

        if (this.baseEvents) {
            this.baseEvents.destroy();
        }
    }

    /**
     * Set event
     */
    on(evt, callback, once = false) {
        if (!evt || !_.isFunction(callback)) {
            throw new TypeError('Event name and callback must be defined');
        }
        this.apiEvents.push({ evt, once, callback });
    }

    /**
     * Set event
     */
    once(evt, callback) {
        this.on(evt, callback, true);
    }

    /**
     * Triggers an specific event
     * with data
     *
     * @param string eventName
     */
    trigger(eventName, data = null) {
        const onceTriggered = [];
        _.each(this.apiEvents, (event, i) => {
            const { evt, once, callback } = event;
            if (evt == eventName) {
                callback(data);
                if (once) {
                    onceTriggered.push(i);
                }
            }
        });
        if (onceTriggered.length) {
            _.each(onceTriggered, (i) => this.apiEvents.splice(i, 1));
        }
    }

    /**
     * Removes all events
     * set using the API
     */
    clearAllEvents() {
        this.apiEvents.splice(0, this.apiEvents.length);
    }

    /**
     * Get Version
     */
    version() {
        return version;
    }
}

export default function (options = {}) {
    const instance = new GlightboxInit(options);
    instance.init();

    return instance;
}
