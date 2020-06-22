/**
 * GLightbox v3.0.0
 * Awesome pure javascript lightbox
 * made by https://www.biati.digital
 */

import TouchEvents from './touch-events.js';
import ZoomImages from './zoom.js';

const isMobile = ('navigator' in window && window.navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i));
const isTouch = isMobile !== null || document.createTouch !== undefined || ('ontouchstart' in window) || ('onmsgesturechange' in window) || navigator.msMaxTouchPoints;
const html = document.getElementsByTagName('html')[0];
const transitionEnd = whichTransitionEvent();
const animationEnd = whichAnimationEvent();
const uid = Date.now();

let videoPlayers = {}

// Default settings
const defaults = {
    selector: '.glightbox',
    elements: null,
    skin: 'clean',
    closeButton: true,
    startAt: null,
    autoplayVideos: true,
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
    onOpen: null,
    onClose: null,
    loop: false,
    touchNavigation: true,
    touchFollowAxis: true,
    keyboardNavigation: true,
    closeOnOutsideClick: true,
    plyr: {
        css: 'https://cdn.plyr.io/3.5.6/plyr.css',
        js: 'https://cdn.plyr.io/3.5.6/plyr.js',
        config: {
            ratio: '16:9', // or '4:3'
            youtube: {
                noCookie: true,
                rel: 0,
                showinfo: 0,
                iv_load_policy: 3
            },
            vimeo: {
                byline: false,
                portrait: false,
                title: false,
                transparent: false
            }
        }
    },
    openEffect: 'zoomIn', // fade, zoom, none
    closeEffect: 'zoomOut', // fade, zoom, none
    slideEffect: 'slide', // fade, slide, zoom, none
    moreText: 'See more',
    moreLength: 60,
    lightboxHtml: '',
    cssEfects: {
        fade: { in: 'fadeIn', out: 'fadeOut' },
        zoom: { in: 'zoomIn', out: 'zoomOut' },
        slide: { in: 'slideInRight', out: 'slideOutLeft' },
        slide_back: { in: 'slideInLeft', out: 'slideOutRight' }
    },
    svg: {
        close: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve"><g><g><path d="M505.943,6.058c-8.077-8.077-21.172-8.077-29.249,0L6.058,476.693c-8.077,8.077-8.077,21.172,0,29.249C10.096,509.982,15.39,512,20.683,512c5.293,0,10.586-2.019,14.625-6.059L505.943,35.306C514.019,27.23,514.019,14.135,505.943,6.058z"/></g></g><g><g><path d="M505.942,476.694L35.306,6.059c-8.076-8.077-21.172-8.077-29.248,0c-8.077,8.076-8.077,21.171,0,29.248l470.636,470.636c4.038,4.039,9.332,6.058,14.625,6.058c5.293,0,10.587-2.019,14.624-6.057C514.018,497.866,514.018,484.771,505.942,476.694z"/></g></g></svg>',
        next: '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"> <g><path d="M360.731,229.075l-225.1-225.1c-5.3-5.3-13.8-5.3-19.1,0s-5.3,13.8,0,19.1l215.5,215.5l-215.5,215.5c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-4l225.1-225.1C365.931,242.875,365.931,234.275,360.731,229.075z"/></g></svg>',
        prev: '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"><g><path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"/></g></svg>'
    }
};


/* jshint multistr: true */
// You can pass your own slide structure
// just make sure that add the same classes so they are populated
// title class = gslide-title
// desc class = gslide-desc
// prev arrow class = gnext
// next arrow id = gprev
// close id = gclose
let lightboxSlideHtml = `<div class="gslide">
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

defaults.slideHtml = lightboxSlideHtml;

const lightboxHtml = `<div id="glightbox-body" class="glightbox-container">
    <div class="gloader visible"></div>
    <div class="goverlay"></div>
    <div class="gcontainer">
    <div id="glightbox-slider" class="gslider"></div>
    <button class="gnext gbtn" tabindex="0">{nextSVG}</button>
    <button class="gprev gbtn" tabindex="1">{prevSVG}</button>
    <button class="gclose gbtn" tabindex="2">{closeSVG}</button>
</div>
</div>`;
defaults.lightboxHtml = lightboxHtml;

let singleSlideData = {
    href: '',
    title: '',
    type: '',
    description: '',
    descPosition: '',
    effect: '',
    width: '',
    height: '',
    node: false,
    content: false
};


/**
 * Merge two or more objects
 */
function extend() {
    let extended = {}
    let deep = true
    let i = 0
    let length = arguments.length
    if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
        deep = arguments[0]
        i++
    }
    let merge = (obj) => {
        for (let prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                    extended[prop] = extend(true, extended[prop], obj[prop])
                } else {
                    extended[prop] = obj[prop]
                }
            }
        }
    };
    for (; i < length; i++) {
        let obj = arguments[i]
        merge(obj)
    }
    return extended
}


const utils = {
    isFunction: function (f) {
        return typeof f === 'function'
    },
    isString: function (s) {
        return typeof s === 'string'
    },
    isNode: function (el) {
        return !!(el && el.nodeType && el.nodeType == 1)
    },
    isArray: function (ar) {
        return Array.isArray(ar)
    },
    isArrayLike: function (ar) {
        return (ar && ar.length && isFinite(ar.length))
    },
    isObject: function (o) {
        let type = typeof o;
        return type === 'object' && (o != null && !utils.isFunction(o) && !utils.isArray(o))
    },
    isNil: function (o) {
        return o == null
    },
    has: function (obj, key) {
        return obj !== null && hasOwnProperty.call(obj, key);
    },
    size: function (o) {
        if (utils.isObject(o)) {
            if (o.keys) {
                return o.keys().length;
            }
            let l = 0;
            for (let k in o) {
                if (utils.has(o, k)) {
                    l++
                }
            }
            return l
        } else {
            return o.length;
        }
    },
    isNumber: function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n)
    }
};

/**
 * Each
 *
 * @param {mixed} node list, array, object
 * @param {function} callback
 */
function each(collection, callback) {
    if (utils.isNode(collection) || collection === window || collection === document) {
        collection = [collection];
    }
    if (!utils.isArrayLike(collection) && !utils.isObject(collection)) {
        collection = [collection];
    }
    if (utils.size(collection) == 0) {
        return;
    }

    if (utils.isArrayLike(collection) && !utils.isObject(collection)) {
        let l = collection.length,
            i = 0;
        for (; i < l; i++) {
            if (callback.call(collection[i], collection[i], i, collection) === false) {
                break;
            }
        }
    } else if (utils.isObject(collection)) {
        for (let key in collection) {
            if (utils.has(collection, key)) {
                if (callback.call(collection[key], collection[key], key, collection) === false) {
                    break;
                }
            }
        }
    }
}

/**
 * Get nde events
 * return node events and optionally
 * check if the node has already a specific event
 * to avoid duplicated callbacks
 *
 * @param {node} node
 * @param {string} name event name
 * @param {object} fn callback
 * @returns {object}
 */
function getNodeEvents(node, name = null, fn = null) {
    const cache = (node[uid] = node[uid] || []);
    const data = { all: cache, evt: null, found: null };
    if (name && fn && utils.size(cache) > 0) {
        each(cache, (cl, i) => {
            if (cl.eventName == name && cl.fn.toString() == fn.toString()) {
                data.found = true;
                data.evt = i;
                return false;
            }
        })
    }
    return data;
}


/**
 * Add Event
 * Add an event listener
 *
 * @param {string} eventName
 * @param {object} detials
 */
function addEvent(eventName, {
    onElement,
    withCallback,
    avoidDuplicate = true,
    once = false,
    useCapture = false
} = {}, thisArg) {
    let element = onElement || []
    if (utils.isString(element)) {
        element = document.querySelectorAll(element)
    }

    function handler(event) {
        if (utils.isFunction(withCallback)) {
            withCallback.call(thisArg, event, this)
        }
        if (once) {
            handler.destroy();
        }
    }
    handler.destroy = function () {
        each(element, (el) => {
            const events = getNodeEvents(el, eventName, handler);
            if (events.found) { events.all.splice(events.evt, 1); }
            if (el.removeEventListener) el.removeEventListener(eventName, handler, useCapture)
        })
    }
    each(element, (el) => {
        const events = getNodeEvents(el, eventName, handler);
        if (el.addEventListener && (avoidDuplicate && !events.found) || !avoidDuplicate) {
            el.addEventListener(eventName, handler, useCapture)
            events.all.push({ eventName: eventName, fn: handler });
        }
    })
    return handler
}


/**
 * Add element class
 *
 * @param {node} element
 * @param {string} class name
 */
function addClass(node, name) {
    each(name.split(' '), cl => node.classList.add(cl))
}

/**
 * Remove element class
 *
 * @param {node} element
 * @param {string} class name
 */
function removeClass(node, name) {
    each(name.split(' '), cl => node.classList.remove(cl))
}

/**
 * Has class
 *
 * @param {node} element
 * @param {string} class name
 */
function hasClass(node, name) {
    return node.classList.contains(name);
}



/**
 * Determine animation events
 */
function whichAnimationEvent() {
    let t, el = document.createElement("fakeelement");
    let animations = {
        animation: "animationend",
        OAnimation: "oAnimationEnd",
        MozAnimation: "animationend",
        WebkitAnimation: "webkitAnimationEnd"
    };
    for (t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
}


/**
 * Determine transition events
 */
function whichTransitionEvent() {
    let t,
        el = document.createElement("fakeelement");

    const transitions = {
        transition: "transitionend",
        OTransition: "oTransitionEnd",
        MozTransition: "transitionend",
        WebkitTransition: "webkitTransitionEnd"
    };

    for (t in transitions) {
        if (el.style[t] !== undefined) {
            return transitions[t];
        }
    }
}


/**
 * CSS Animations
 *
 * @param {node} element
 * @param {string} animation name
 * @param {function} callback
 */
function animateElement(element, animation = '', callback = false) {
    if (!element || animation === '') {
        return false;
    }
    if (animation == 'none') {
        if (utils.isFunction(callback))
            callback()
        return false;
    }
    const animationNames = animation.split(' ')
    each(animationNames, (name) => {
        addClass(element, 'g' + name)
    })
    addEvent(animationEnd, {
        onElement: element,
        avoidDuplicate: false,
        once: true,
        withCallback: (event, target) => {
            each(animationNames, (name) => {
                removeClass(target, 'g' + name)
            })
            if (utils.isFunction(callback))
                callback()
        }
    })
}



/**
 * Create a document fragment
 *
 * @param {string} html code
 */
function createHTML(htmlStr) {
    let frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}

/**
 * Get the closestElement
 *
 * @param {node} element
 * @param {string} class name
 */
function getClosest(elem, selector) {
    while (elem !== document.body) {
        elem = elem.parentElement;
        const matches = typeof elem.matches == 'function' ? elem.matches(selector) : elem.msMatchesSelector(selector);

        if (matches) return elem;
    }
}


/**
 * Show element
 *
 * @param {node} element
 */
function show(element) {
    element.style.display = 'block';
}

/**
 * Hide element
 */
function hide(element) {
    element.style.display = 'none';
}

/**
 * Return screen size
 * return the current screen dimensions
 *
 * @returns {object}
 */
function windowSize() {
    return {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
    }
}

/**
 * Handle fullscreen
 *
 * @param {object} event
 */
function handleMediaFullScreen(event) {
    if (!hasClass(event.target, 'plyr--html5')) {
        return;
    }
    const media = getClosest(event.target, '.gslide-media');
    if (event.type == 'enterfullscreen') {
        addClass(media, 'fullscreen');
    }
    if (event.type == 'exitfullscreen') {
        removeClass(media, 'fullscreen');
    }
}

/**
 * [checkSize size
 * check if the passed size has a correct unit
 *
 * @param {string} size
 * @return {string}
 */
function checkSize(size) {
    return (utils.isNumber(size) ? `${size}px` : size);
}

/**
 * Set slide data size
 * set the correct size dependin
 * on the slide type
 *
 * @param { object } data
 * @param { object } settings
 * @return { object }
 */
function setSize(data, settings) {
    const defaultWith = (data.type == 'video' ? checkSize(settings.videosWidth) : checkSize(settings.width));
    const defaultHeight = checkSize(settings.height);

    data.width = (utils.has(data, 'width') && data.width !== '' ? checkSize(data.width) : defaultWith);
    data.height = (utils.has(data, 'height') && data.height !== '' ? checkSize(data.height) : defaultHeight);

    return data;
}


/**
 * Get slide data
 *
 * @param {node} element
 */
const getSlideData = function getSlideData(element = null, settings) {
    let data = extend({ descPosition: settings.descPosition }, singleSlideData);

    if (utils.isObject(element) && !utils.isNode(element)) {
        if (!utils.has(element, 'type')) {
            if (utils.has(element, 'content') && element.content) {
                element.type = 'inline';
            } else if (utils.has(element, 'href')) {
                element.type = getSourceType(element.href);
            }
        }
        let objectData = extend(data, element);
        setSize(objectData, settings);

        return objectData;
    }

    let url = '';
    let config = element.getAttribute('data-glightbox')
    let nodeType = element.nodeName.toLowerCase();
    if (nodeType === 'a')
        url = element.href;
    if (nodeType === 'img')
        url = element.src;

    data.href = url;

    each(data, (val, key) => {
        if (utils.has(settings, key) && key !== 'width') {
            data[key] = settings[key];
        }
        const nodeData = element.dataset[key];
        if (!utils.isNil(nodeData)) {
            data[key] = nodeData;
        }
    });

    if (data.content) {
        data.type = 'inline';
    }

    if (!data.type && url) {
        data.type = getSourceType(url);
    }

    if (!utils.isNil(config)) {
        let cleanKeys = [];
        each(data, (v, k) => {
            cleanKeys.push(';\\s?' + k);
        })
        cleanKeys = cleanKeys.join('\\s?:|');
        if (config.trim() !== '') {
            each(data, (val, key) => {
                const str = config;
                const match = '\s?' + key + '\s?:\s?(.*?)(' + cleanKeys + '\s?:|$)';
                const regex = new RegExp(match);
                const matches = str.match(regex);

                if (matches && matches.length && matches[1]) {
                    const value = matches[1].trim().replace(/;\s*$/, '');
                    data[key] = value;
                }
            });
        }
    } else {
        if (nodeType == 'a') {
            let title = element.title
            if (!utils.isNil(title) && title !== '') data.title = title;
        }
        if (nodeType == 'img') {
            let alt = element.alt
            if (!utils.isNil(alt) && alt !== '') data.title = alt;
        }
        let desc = element.getAttribute('data-description')
        if (!utils.isNil(desc) && desc !== '') data.description = desc;
    }

    if (data.description && data.description.substring(0, 1) == '.' && document.querySelector(data.description)) {
        data.description = document.querySelector(data.description).innerHTML;
    } else {
        let nodeDesc = element.querySelector('.glightbox-desc')
        if (nodeDesc) {
            data.description = nodeDesc.innerHTML;
        }
    }

    setSize(data, settings);

    return data;
}

/**
 * Set slide content
 *
 * @param {node} slide
 * @param {object} data
 * @param {function} callback
 */
const setSlideContent = function setSlideContent(slide = null, data = {}, callback = false) {
    if (hasClass(slide, 'loaded')) {
        return false
    }

    if (utils.isFunction(this.settings.beforeSlideLoad)) {
        this.settings.beforeSlideLoad({
            index: data.index,
            slide: slide,
            player: false
        });
    }

    let type = data.type;
    let position = data.descPosition;
    let slideMedia = slide.querySelector('.gslide-media');
    let slideTitle = slide.querySelector('.gslide-title');
    let slideText = slide.querySelector('.gslide-desc');
    let slideDesc = slide.querySelector('.gdesc-inner');
    let finalCallback = callback

    // used for image accessiblity
    let titleID = 'gSlideTitle_' + data.index;
    let textID = 'gSlideDesc_' + data.index;

    if (utils.isFunction(this.settings.afterSlideLoad)) {
        finalCallback = () => {
            if (utils.isFunction(callback)) { callback() }
            this.settings.afterSlideLoad({
                index: data.index,
                slide: slide,
                player: this.getSlidePlayerInstance(data.index)
            });
        }
    }

    if (data.title == '' && data.description == '') {
        if (slideDesc) {
            slideDesc.parentNode.parentNode.removeChild(slideDesc.parentNode);
        }
    } else {
        if (slideTitle && data.title !== '') {
            slideTitle.id = titleID;
            slideTitle.innerHTML = data.title;
        } else {
            slideTitle.parentNode.removeChild(slideTitle);
        }
        if (slideText && data.description !== '') {
            slideText.id = textID;
            if (isMobile && this.settings.moreLength > 0) {
                data.smallDescription = slideShortDesc(data.description, this.settings.moreLength, this.settings.moreText)
                slideText.innerHTML = data.smallDescription;
                slideDescriptionEvents.apply(this, [slideText, data])
            } else {
                slideText.innerHTML = data.description;
            }
        } else {
            slideText.parentNode.removeChild(slideText);
        }
        addClass(slideMedia.parentNode, `desc-${position}`);
        addClass(slideDesc.parentNode, `description-${position}`);
    }

    addClass(slideMedia, `gslide-${type}`)
    addClass(slide, 'loaded');

    if (type === 'video') {
        addClass(slideMedia.parentNode, `gvideo-container`);
        slideMedia.insertBefore(createHTML('<div class="gvideo-wrapper"></div>'), slideMedia.firstChild);
        setSlideVideo.apply(this, [slide, data, finalCallback])
        return
    }

    if (type === 'external') {
        let iframe = createIframe({
            url: data.href,
            callback: finalCallback,
        })
        slideMedia.parentNode.style.maxWidth = data.width;
        slideMedia.parentNode.style.height = data.height;
        slideMedia.appendChild(iframe);
        return
    }

    if (type === 'inline') {
        setInlineContent.apply(this, [slide, data, finalCallback])
        return
    }

    if (type === 'image') {
        let img = new Image();
        img.addEventListener('load', () => {
            if (img.naturalWidth > img.offsetWidth) {
                addClass(img, 'zoomable')
                new ZoomImages(img, slide, () => {
                    this.resize(slide);
                });
            }
            if (utils.isFunction(finalCallback)) {
                finalCallback()
            }
        }, false);
        img.src = data.href;
        img.alt = ''; // https://davidwalsh.name/accessibility-tip-empty-alt-attributes
        if (data.title !== '') {
            img.setAttribute('aria-labelledby', titleID);
        }
        if (data.description !== '') { // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-describedby_attribute#Example_2_A_Close_Button
            img.setAttribute('aria-describedby', textID);
        }

        slideMedia.insertBefore(img, slideMedia.firstChild);
        return
    }

    if (utils.isFunction(finalCallback))
        finalCallback()
}


/**
 * Set slide video
 *
 * @param {node} slide
 * @param {object} data
 * @param {function} callback
 */
function setSlideVideo(slide, data, callback) {
    const videoID = 'gvideo' + data.index;
    const slideMedia = slide.querySelector('.gvideo-wrapper');

    injectVideoApi(this.settings.plyr.css);

    let url = data.href;
    let protocol = location.protocol.replace(':', '');
    let videoSource = '';
    let embedID = '';
    let customPlaceholder = false;

    if (protocol == 'file') {
        protocol = 'http'
    }
    slideMedia.parentNode.style.maxWidth = data.width;

    injectVideoApi(this.settings.plyr.js, 'Plyr', () => {

        // Set vimeo videos
        if (url.match(/vimeo\.com\/([0-9]*)/)) {
            const vimeoID = /vimeo.*\/(\d+)/i.exec(url);
            videoSource = 'vimeo';
            embedID = vimeoID[1];
        }

        // Set youtube videos
        if (url.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/) || url.match(/(youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9\-_]+)/)) {
            const youtubeID = getYoutubeID(url)
            videoSource = 'youtube';
            embedID = youtubeID;
        }

        // Set local videos
        if (url.match(/\.(mp4|ogg|webm|mov)$/) !== null) {
            videoSource = 'local'
            let html = '<video id="' + videoID + '" ';
            html += `style="background:#000; max-width: ${data.width};" `;
            html += 'preload="metadata" ';
            html += 'x-webkit-airplay="allow" ';
            html += 'webkit-playsinline="" ';
            html += 'controls ';
            html += 'class="gvideo-local">';

            let format = url.toLowerCase().split('.').pop()
            let sources = { 'mp4': '', 'ogg': '', 'webm': '' }
            format = (format == 'mov' ? 'mp4' : format);
            sources[format] = url;

            for (let key in sources) {
                if (sources.hasOwnProperty(key)) {
                    let videoFile = sources[key]
                    if (data.hasOwnProperty(key)) {
                        videoFile = data[key]
                    }
                    if (videoFile !== '') {
                        html += `<source src="${videoFile}" type="video/${key}">`;
                    }
                }
            }
            html += '</video>';
            customPlaceholder = createHTML(html);
        }

        const placeholder = customPlaceholder ? customPlaceholder : createHTML(`<div id="${videoID}" data-plyr-provider="${videoSource}" data-plyr-embed-id="${embedID}"></div>`)

        addClass(slideMedia, `${videoSource}-video gvideo`)
        slideMedia.appendChild(placeholder)
        slideMedia.setAttribute('data-id', videoID)
        slideMedia.setAttribute('data-index', data.index)

        const playerConfig = utils.has(this.settings.plyr, 'config') ? this.settings.plyr.config : {};
        const player = new Plyr('#' + videoID, playerConfig);

        player.on('ready', event => {
            const instance = event.detail.plyr;
            videoPlayers[videoID] = instance;
            if (utils.isFunction(callback)) {
                callback()
            }
        });
        player.on('enterfullscreen', handleMediaFullScreen);
        player.on('exitfullscreen', handleMediaFullScreen);
    })
}


/**
 * Create an iframe element
 *
 * @param {string} url
 * @param {numeric} width
 * @param {numeric} height
 * @param {function} callback
 */
function createIframe(config) {
    let { url, allow, callback, appendTo } = config;
    let iframe = document.createElement('iframe');
    iframe.className = 'vimeo-video gvideo';
    iframe.src = url;
    iframe.style.width = '100%';
    iframe.style.height = '100%';

    if (allow) {
        iframe.setAttribute('allow', allow)
    }
    iframe.onload = function () {
        addClass(iframe, 'node-ready');
        if (utils.isFunction(callback)) {
            callback()
        }
    };

    if (appendTo) {
        appendTo.appendChild(iframe);
    }
    return iframe;
}


/**
 * Get youtube ID
 *
 * @param {string} url
 * @returns {string} video id
 */
function getYoutubeID(url) {
    let videoID = '';
    url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
        videoID = url[2].split(/[^0-9a-z_\-]/i);
        videoID = videoID[0];
    } else {
        videoID = url;
    }
    return videoID;
}


/**
 * Inject videos api
 * used for video player
 *
 * @param {string} url
 * @param {function} callback
 */
function injectVideoApi(url, waitFor, callback) {
    if (utils.isNil(url)) {
        console.error('Inject videos api error');
        return;
    }
    if (utils.isFunction(waitFor)) {
        callback = waitFor;
        waitFor = false;
    }

    let found;

    if (url.indexOf('.css') !== -1) {
        found = document.querySelectorAll('link[href="' + url + '"]')
        if (found && found.length > 0) {
            if (utils.isFunction(callback)) callback();
            return;
        }

        const head = document.getElementsByTagName("head")[0];
        const headStyles = head.querySelectorAll('link[rel="stylesheet"]');
        const link = document.createElement('link');

        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        link.media = 'all';

        if (headStyles) {
            head.insertBefore(link, headStyles[0]);
        } else {
            head.appendChild(link);
        }
        if (utils.isFunction(callback)) callback();
        return;
    }

    found = document.querySelectorAll('script[src="' + url + '"]')
    if (found && found.length > 0) {
        if (utils.isFunction(callback)) {
            if (utils.isString(waitFor)) {
                waitUntil(() => {
                    return typeof window[waitFor] !== 'undefined';
                }, () => {
                    callback();
                })
                return false;
            }
            callback();
        }
        return;
    }

    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = () => {
        if (utils.isFunction(callback)) {
            if (utils.isString(waitFor)) {
                waitUntil(() => {
                    return typeof window[waitFor] !== 'undefined';
                }, () => {
                    callback();
                })
                return false;
            }
            callback();
        }
    };
    document.body.appendChild(script);
    return;
}


/**
 * Wait until
 * wait until all the validations
 * are passed
 *
 * @param {function} check
 * @param {function} onComplete
 * @param {numeric} delay
 * @param {numeric} timeout
 */
function waitUntil(check, onComplete, delay, timeout) {
    if (check()) {
        onComplete();
        return;
    }

    if (!delay) delay = 100;
    let timeoutPointer;
    let intervalPointer = setInterval(() => {
        if (!check()) return;
        clearInterval(intervalPointer);
        if (timeoutPointer) clearTimeout(timeoutPointer);
        onComplete();
    }, delay);
    if (timeout) timeoutPointer = setTimeout(() => {
        clearInterval(intervalPointer);
    }, timeout);
}

/**
 * Set slide inline content
 * we'll extend this to make http
 * requests using the fetch api
 * but for now we keep it simple
 *
 * @param {node} slide
 * @param {object} data
 * @param {function} callback
 */
function setInlineContent(slide, data, callback) {
    const slideMedia = slide.querySelector('.gslide-media');
    const hash = (utils.has(data, 'href') && data.href ? data.href.split('#').pop().trim() : false);
    const content = (utils.has(data, 'content') && data.content ? data.content : false);
    let innerContent;

    if (content) {
        if (utils.isString(content)) {
            innerContent = createHTML(`<div class="ginlined-content">${content}</div>`);
        }
        if (utils.isNode(content)) {
            if (content.style.display == 'none') {
                content.style.display = 'block';
            }

            const container = document.createElement('div');
            container.className = 'ginlined-content';
            container.appendChild(content)
            innerContent = container;
        }
    }

    if (hash) {
        let div = document.getElementById(hash);
        if (!div) {
            return false;
        }
        const cloned = div.cloneNode(true)

        cloned.style.height = data.height;
        cloned.style.maxWidth = data.width;
        addClass(cloned, 'ginlined-content')
        innerContent = cloned;
    }

    if (!innerContent) {
        console.error('Unable to append inline slide content', data);
        return false;
    }

    slideMedia.style.height = data.height;
    slideMedia.style.width = data.width;
    slideMedia.appendChild(innerContent)

    this.events['inlineclose' + hash] = addEvent('click', {
        onElement: slideMedia.querySelectorAll('.gtrigger-close'),
        withCallback: e => {
            e.preventDefault();
            this.close();
        }
    });

    if (utils.isFunction(callback)) {
        callback()
    }
    return;
}


/**
 * Get source type
 * gte the source type of a url
 *
 * @param {string} url
 */
const getSourceType = function (url) {
    let origin = url;
    url = url.toLowerCase();

    if (url.match(/\.(jpeg|jpg|jpe|gif|png|apn|webp|svg)$/) !== null) {
        return 'image';
    }
    if (url.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/) || url.match(/(youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9\-_]+)/)) {
        return 'video';
    }
    if (url.match(/vimeo\.com\/([0-9]*)/)) {
        return 'video';
    }
    if (url.match(/\.(mp4|ogg|webm|mov)$/) !== null) {
        return 'video';
    }

    // Check if inline content
    if (url.indexOf("#") > -1) {
        let hash = origin.split('#').pop()
        if (hash.trim() !== '') {
            return 'inline'
        }
    }
    // Ajax
    if (url.includes("gajax=true")) {
        return 'ajax';
    }

    return 'external';
}



/**
 * Desktop keyboard navigation
 */
function keyboardNavigation() {
    if (this.events.hasOwnProperty('keyboard')) {
        return false;
    }
    this.events['keyboard'] = addEvent('keydown', {
        onElement: window,
        withCallback: (event, target) => {
            event = event || window.event;
            const key = event.keyCode;
            if (key == 9) {
                const activeElement = (document.activeElement && document.activeElement.nodeName ? document.activeElement.nodeName.toLocaleLowerCase() : false);
                if (activeElement == 'input' || activeElement == 'textarea' || activeElement == 'button') {
                    return;
                }

                event.preventDefault();
                const btns = document.querySelectorAll('.gbtn');
                if (!btns || btns.length <= 0) {
                    return;
                }

                const focused = [...btns].filter(item => hasClass(item, 'focused'))
                if (!focused.length) {
                    const first = document.querySelector('.gbtn[tabindex="0"]');
                    if (first) {
                        first.focus();
                        addClass(first, 'focused')
                    }
                    return;
                }

                btns.forEach(element => removeClass(element, 'focused'))

                let tabindex = focused[0].getAttribute('tabindex');
                tabindex = tabindex ? tabindex : '0';
                let newIndex = parseInt(tabindex) + 1;
                if (newIndex > (btns.length - 1)) {
                    newIndex = '0';
                }
                let next = document.querySelector(`.gbtn[tabindex="${newIndex}"]`);
                if (next) {
                    next.focus();
                    addClass(next, 'focused')
                }
            }
            if (key == 39) this.nextSlide();
            if (key == 37) this.prevSlide();
            if (key == 27) this.close();
        }
    })
}

/**
 * Touch navigation
 */
function touchNavigation() {
    if (this.events.hasOwnProperty('touch')) {
        return false;
    }

    let winSize = windowSize();
    let winWidth = winSize.width;
    let winHeight = winSize.height;
    let process = false;
    let currentSlide = null;
    let media = null;
    let mediaImage = null;
    let doingMove = false;
    let initScale = 1;
    let maxScale = 4.5;
    let currentScale = 1;
    let doingZoom = false;
    let imageZoomed = false;
    let zoomedPosX = null;
    let zoomedPosY = null;
    let lastZoomedPosX = null;
    let lastZoomedPosY = null;
    let hDistance;
    let vDistance;
    let hDistancePercent = 0;
    let vDistancePercent = 0;
    let vSwipe = false;
    let hSwipe = false;
    let startCoords = {};
    let endCoords = {};
    let xDown = 0;
    let yDown = 0;
    let isInlined;

    const instance = this;
    const sliderWrapper = document.getElementById('glightbox-slider');
    const overlay = document.querySelector('.goverlay')
    const loop = this.loop();

    const touchInstance = new TouchEvents(sliderWrapper, {
        touchStart: (e) => {
            if (
                hasClass(e.targetTouches[0].target, 'ginner-container') ||
                getClosest(e.targetTouches[0].target, '.gslide-desc')
            ) {
                process = false;
                return false;
            }

            process = true;
            endCoords = e.targetTouches[0];
            startCoords.pageX = e.targetTouches[0].pageX;
            startCoords.pageY = e.targetTouches[0].pageY;
            xDown = e.targetTouches[0].clientX;
            yDown = e.targetTouches[0].clientY;

            currentSlide = instance.activeSlide;
            media = currentSlide.querySelector('.gslide-media');
            isInlined = currentSlide.querySelector('.gslide-inline');

            mediaImage = null;
            if (hasClass(media, 'gslide-image')) {
                mediaImage = media.querySelector('img');
            }

            removeClass(overlay, 'greset')
        },
        touchMove: (e) => {
            if (!process) {
                return;
            }
            endCoords = e.targetTouches[0];

            if (doingZoom || imageZoomed) {
                return;
            }
            if (isInlined && isInlined.offsetHeight > winHeight) { // Allow scroll without moving the slide
                const moved = startCoords.pageX - endCoords.pageX;
                if (Math.abs(moved) <= 13) {
                    return false;
                }
            }

            doingMove = true;
            let xUp = e.targetTouches[0].clientX;
            let yUp = e.targetTouches[0].clientY;
            let xDiff = xDown - xUp;
            let yDiff = yDown - yUp;

            if (Math.abs(xDiff) > Math.abs(yDiff)) {
                vSwipe = false
                hSwipe = true
            } else {
                hSwipe = false
                vSwipe = true
            }

            hDistance = endCoords.pageX - startCoords.pageX;
            hDistancePercent = hDistance * 100 / winWidth;

            vDistance = endCoords.pageY - startCoords.pageY;
            vDistancePercent = vDistance * 100 / winHeight;

            let opacity;
            if (vSwipe && mediaImage) {
                opacity = 1 - Math.abs(vDistance) / winHeight;
                overlay.style.opacity = opacity;

                if (this.settings.touchFollowAxis) {
                    hDistancePercent = 0;
                }
            }
            if (hSwipe) {
                opacity = 1 - Math.abs(hDistance) / winWidth;
                media.style.opacity = opacity;

                if (this.settings.touchFollowAxis) {
                    vDistancePercent = 0;
                }
            }

            if (!mediaImage) {
                return slideCSSTransform(media, `translate3d(${hDistancePercent}%, 0, 0)`)
            }

            slideCSSTransform(media, `translate3d(${hDistancePercent}%, ${vDistancePercent}%, 0)`)
        },
        touchEnd: () => {
            if (!process) {
                return;
            }
            doingMove = false;
            if (imageZoomed || doingZoom) {
                lastZoomedPosX = zoomedPosX;
                lastZoomedPosY = zoomedPosY;
                return;
            }
            const v = Math.abs(parseInt(vDistancePercent));
            const h = Math.abs(parseInt(hDistancePercent));

            if (v > 29 && mediaImage) {
                this.close();
                return;
            }
            if (v < 29 && h < 25) {
                addClass(overlay, 'greset')
                overlay.style.opacity = 1;
                return resetSlideMove(media)
            }
        },
        multipointEnd: () => {
            setTimeout(() => { doingZoom = false }, 50);
        },
        multipointStart: () => {
            doingZoom = true;
            initScale = currentScale ? currentScale : 1;
        },
        pinch: (evt) => {
            if (!mediaImage || doingMove) {
                return false;
            }

            doingZoom = true;
            mediaImage.scaleX = mediaImage.scaleY = initScale * evt.zoom;

            let scale = initScale * evt.zoom;
            imageZoomed = true;

            if (scale <= 1) {
                imageZoomed = false;
                scale = 1;
                lastZoomedPosY = null;
                lastZoomedPosX = null;
                zoomedPosX = null;
                zoomedPosY = null;
                mediaImage.setAttribute('style', '')
                return;
            }
            if (scale > maxScale) { // max scale zoom
                scale = maxScale;
            }

            mediaImage.style.transform = `scale3d(${scale}, ${scale}, 1)`
            currentScale = scale;
        },
        pressMove: (e) => {
            if (imageZoomed && !doingZoom) {
                var mhDistance = endCoords.pageX - startCoords.pageX;
                var mvDistance = endCoords.pageY - startCoords.pageY;

                if (lastZoomedPosX) {
                    mhDistance = mhDistance + lastZoomedPosX;
                }
                if (lastZoomedPosY) {
                    mvDistance = mvDistance + lastZoomedPosY;
                }

                zoomedPosX = mhDistance;
                zoomedPosY = mvDistance;

                let style = `translate3d(${mhDistance}px, ${mvDistance}px, 0)`;
                if (currentScale) {
                    style += ` scale3d(${currentScale}, ${currentScale}, 1)`
                }

                slideCSSTransform(mediaImage, style)
            }
        },
        swipe: (evt) => {
            if (imageZoomed) {
                return;
            }
            if (doingZoom) {
                doingZoom = false;
                return;
            }
            if (evt.direction == 'Left') {
                if (this.index == this.elements.length - 1) {
                    return resetSlideMove(media)
                }
                this.nextSlide();
            }
            if (evt.direction == 'Right') {
                if (this.index == 0) {
                    return resetSlideMove(media)
                }
                this.prevSlide();
            }
        }
    });

    this.events['touch'] = touchInstance;
}

function slideCSSTransform(slide, translate = '') {
    if (translate == '') {
        slide.style.webkitTransform = ''
        slide.style.MozTransform = ''
        slide.style.msTransform = ''
        slide.style.OTransform = ''
        slide.style.transform = ''
        return false
    }
    slide.style.webkitTransform = translate
    slide.style.MozTransform = translate
    slide.style.msTransform = translate
    slide.style.OTransform = translate
    slide.style.transform = translate
}


function resetSlideMove(slide) {
    let media = (hasClass(slide, 'gslide-media') ? slide : slide.querySelector('.gslide-media'))
    let desc = slide.querySelector('.gslide-description')

    addClass(media, 'greset')
    slideCSSTransform(media, `translate3d(0, 0, 0)`)
    let animation = addEvent(transitionEnd, {
        onElement: media,
        once: true,
        withCallback: (event, target) => {
            removeClass(media, 'greset')
        }
    })

    media.style.opacity = ''
    if (desc) {
        desc.style.opacity = '';
    }
}

function slideShortDesc(string, n = 50, wordBoundary = false) {
    let useWordBoundary = wordBoundary
    string = string.trim()
    if (string.length <= n) {
        return string;
    }
    let subString = string.substr(0, n - 1);
    if (!useWordBoundary) {
        return subString
    }
    return subString + '... <a href="#" class="desc-more">' + wordBoundary + '</a>'
}

function slideDescriptionEvents(desc, data) {
    let moreLink = desc.querySelector('.desc-more')
    if (!moreLink) {
        return false
    }

    addEvent('click', {
        onElement: moreLink,
        withCallback: (event, target) => {
            event.preventDefault();
            const body = document.body

            let desc = getClosest(target, '.gslide-desc')
            if (!desc) {
                return false
            }

            desc.innerHTML = data.description
            addClass(body, 'gdesc-open')

            let shortEvent = addEvent('click', {
                onElement: [body, getClosest(desc, '.gslide-description')],
                withCallback: (event, target) => {
                    if (event.target.nodeName.toLowerCase() !== 'a') {
                        removeClass(body, 'gdesc-open')
                        addClass(body, 'gdesc-closed')
                        desc.innerHTML = data.smallDescription
                        slideDescriptionEvents(desc, data)

                        setTimeout(() => {
                            removeClass(body, 'gdesc-closed')
                        }, 400);
                        shortEvent.destroy()
                    }
                }
            })
        }
    })
}

/**
 * GLightbox Class
 * Class and public methods
 */
class GlightboxInit {

    constructor(options = {}) {
        this.settings = extend(defaults, options)
        this.effectsClasses = this.getAnimationClasses()
        this.slidesData = {};
    }

    init() {
        this.baseEvents = addEvent('click', {
            onElement: this.getSelector(),
            withCallback: (e, target) => {
                e.preventDefault();
                this.open(target);
            }
        })

        this.elements = this.getElements()
    }

    open(element = null, startAt = null) {
        if (this.elements.length == 0)
            return false;

        this.activeSlide = null
        this.prevActiveSlideIndex = null
        this.prevActiveSlide = null
        let index = (utils.isNumber(startAt) ? startAt : this.settings.startAt)

        if (utils.isNode(element) && utils.isNil(index)) { // if element passed and startAt is null, get the index
            index = this.getElementIndex(element)
            if (index < 0) {
                index = 0
            }
        }

        if (!utils.isNumber(index)) {
            index = 0
        }

        this.build()
        animateElement(this.overlay, (this.settings.openEffect == 'none' ? 'none' : this.settings.cssEfects.fade.in))

        const body = document.body;

        const scrollBar = window.innerWidth - document.documentElement.clientWidth;
        if (scrollBar > 0) {
            var styleSheet = document.createElement("style")
            styleSheet.type = 'text/css'
            styleSheet.className = 'gcss-styles'
            styleSheet.innerText = `.gscrollbar-fixer {margin-right: ${scrollBar}px}`
            document.head.appendChild(styleSheet)
            addClass(body, 'gscrollbar-fixer')
        }

        addClass(body, 'glightbox-open')
        addClass(html, 'glightbox-open')
        if (isMobile) {
            addClass(document.body, 'glightbox-mobile')
            this.settings.slideEffect = 'slide'
        }

        this.showSlide(index, true)

        if (this.elements.length == 1) {
            hide(this.prevButton)
            hide(this.nextButton)
        } else {
            show(this.prevButton)
            show(this.nextButton)
        }
        this.lightboxOpen = true

        if (utils.isFunction(this.settings.onOpen)) {
            this.settings.onOpen();
        }

        if (isTouch && this.settings.touchNavigation) {
            touchNavigation.apply(this)
            return false
        }
        if (this.settings.keyboardNavigation) {
            keyboardNavigation.apply(this)
        }
    }

    /**
     * Open at specific index
     * @param {int} index
     */
    openAt(index = 0) {
        this.open(null, index)
    }


    /**
     * Set Slide
     */
    showSlide(index = 0, first = false) {
        show(this.loader)
        this.index = parseInt(index)

        let current = this.slidesContainer.querySelector('.current')
        if (current) {
            removeClass(current, 'current')
        }

        // hide prev slide
        this.slideAnimateOut();

        let slide = this.slidesContainer.querySelectorAll('.gslide')[index];

        // Check if slide's content is alreay loaded
        if (hasClass(slide, 'loaded')) {
            this.slideAnimateIn(slide, first);
            hide(this.loader);
        } else {
            // If not loaded add the slide content
            show(this.loader);

            let slideData = this.elements[index];
            slideData.index = index;
            this.slidesData[index] = slideData;
            setSlideContent.apply(this, [slide, slideData, () => {
                hide(this.loader);
                this.resize();
                this.slideAnimateIn(slide, first);
            }]);
        }

        this.slideDescription = slide.querySelector('.gslide-description');
        this.slideDescriptionContained = this.slideDescription && hasClass(this.slideDescription.parentNode, 'gslide-media');

        // Preload subsequent slides
        this.preloadSlide(index + 1);
        this.preloadSlide(index - 1);

        // Handle navigation arrows
        this.updateNavigationClasses();

        /* const loop = this.loop();

        // Handle navigation arrows
        removeClass(this.nextButton, 'disabled');
        removeClass(this.prevButton, 'disabled');
        if (index === 0 && !loop) {
            addClass(this.prevButton, 'disabled');
        } else if (index === this.elements.length - 1 && !loop) {
            addClass(this.nextButton, 'disabled');
        } */
        this.activeSlide = slide;
    }


    /**
     * Preload slides
     * @param  {Int}  index slide index
     * @return {null}
     */
    preloadSlide(index) {
        // Verify slide index, it can not be lower than 0
        // and it can not be greater than the total elements
        if (index < 0 || index > this.elements.length - 1)
            return false

        if (utils.isNil(this.elements[index]))
            return false

        let slide = this.slidesContainer.querySelectorAll('.gslide')[index];
        if (hasClass(slide, 'loaded')) {
            return false;
        }

        let slideData = this.elements[index];
        slideData.index = index;
        this.slidesData[index] = slideData;
        let type = slideData.sourcetype;
        if (type == 'video' || type == 'external') {
            setTimeout(() => {
                setSlideContent.apply(this, [slide, slideData]);
            }, 200);
        } else {
            setSlideContent.apply(this, [slide, slideData]);
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

        const loop = this.loop();
        if (!loop && (index < 0 || index > this.elements.length - 1)) {
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
    insertSlide(data = {}, index = -1) {
        const defaults = extend({ descPosition: this.settings.descPosition }, singleSlideData);
        const newSlide = createHTML(this.settings.slideHtml);
        const totalSlides = this.elements.length - 1;

        // Append at the end
        if (index < 0) {
            index = this.elements.length;
        }

        data = extend(defaults, data);
        data.index = index;
        data.node = false;
        this.elements.splice(index, 0, data);

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

            if (this.index == 0 && index == 0 || this.index - 1 == index || this.index + 1 == index) {
                this.preloadSlide(index);
            }

            if (this.index == 0 && index == 0) {
                this.index = 1;
            }

            this.updateNavigationClasses();
        }

        if (utils.isFunction(this.settings.slideInserted)) {
            this.settings.slideInserted({
                index: index,
                slide: this.slidesContainer.querySelectorAll('.gslide')[index],
                player: this.getSlidePlayerInstance(index)
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

        if (utils.isFunction(this.settings.slideRemoved)) {
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
            slide: this.prevActiveSlide,
            player: this.getSlidePlayerInstance(this.prevActiveSlideIndex)
        };
        let nextData = {
            index: this.index,
            slide: this.activeSlide,
            player: this.getSlidePlayerInstance(this.index)
        };
        if (slideMedia.offsetWidth > 0 && slideDesc) {
            hide(slideDesc)
            slideDesc.style.display = ''
        }
        removeClass(slide, this.effectsClasses)
        if (first) {
            animateElement(slide, this.settings.openEffect, () => {
                if (!isMobile && this.settings.autoplayVideos) {
                    this.playSlideVideo(slide)
                }
                if (utils.isFunction(this.settings.afterSlideChange)) {
                    this.settings.afterSlideChange.apply(this, [prevData, nextData]);
                }
            });
        } else {
            let effect_name = this.settings.slideEffect;
            let animIn = (effect_name !== 'none' ? this.settings.cssEfects[effect_name].in : effect_name);
            if (this.prevActiveSlideIndex > this.index) {
                if (this.settings.slideEffect == 'slide') {
                    animIn = this.settings.cssEfects.slide_back.in;
                }
            }
            animateElement(slide, animIn, () => {
                if (!isMobile && this.settings.autoplayVideos) {
                    this.playSlideVideo(slide)
                }
                if (utils.isFunction(this.settings.afterSlideChange)) {
                    this.settings.afterSlideChange.apply(this, [prevData, nextData]);
                }
            });
        }

        setTimeout(() => { this.resize(slide) }, 100);
        addClass(slide, 'current');
    }



    /**
     * Slide out
     */
    slideAnimateOut() {
        if (!this.prevActiveSlide) {
            return false
        }


        let prevSlide = this.prevActiveSlide
        removeClass(prevSlide, this.effectsClasses)
        addClass(prevSlide, 'prev')

        let animation = this.settings.slideEffect;
        let animOut = (animation !== 'none' ? this.settings.cssEfects[animation].out : animation);

        this.stopSlideVideo(prevSlide)
        if (utils.isFunction(this.settings.beforeSlideChange)) {
            this.settings.beforeSlideChange.apply(this, [{
                index: this.prevActiveSlideIndex,
                slide: this.prevActiveSlide,
                player: this.getSlidePlayerInstance(this.prevActiveSlideIndex)
            }, {
                index: this.index,
                slide: this.activeSlide,
                player: this.getSlidePlayerInstance(this.index)
            }]);
        }
        if (this.prevActiveSlideIndex > this.index && this.settings.slideEffect == 'slide') { // going back
            animOut = this.settings.cssEfects.slide_back.out;
        }
        animateElement(prevSlide, animOut, () => {
            let media = prevSlide.querySelector('.gslide-media')
            let desc = prevSlide.querySelector('.gslide-description')

            media.style.transform = ''
            removeClass(media, 'greset')
            media.style.opacity = ''
            if (desc) {
                desc.style.opacity = ''
            }
            removeClass(prevSlide, 'prev');
        });
    }

    /**
     * Get all defined players
     */
    getAllPlayers() {
        return videoPlayers;
    }

    /**
     * Get player at index
     *
     * @param index
     * @return bool|object
     */
    getSlidePlayerInstance(index) {
        let id = 'gvideo' + index;
        if (utils.has(videoPlayers, id) && videoPlayers[id]) {
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
        if (utils.isNode(slide)) {
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
        if (utils.isNode(slide)) {
            let node = slide.querySelector('.gvideo-wrapper');
            if (node) {
                slide = node.getAttribute('data-index');
            }
        }

        const player = this.getSlidePlayerInstance(slide);
        if (player && !player.playing) {
            player.play();
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
        each(elements, (el) => {
            const data = getSlideData(el, this.settings);
            newElements.push(data);
        })

        this.elements = newElements;

        if (this.lightboxOpen) {
            this.slidesContainer.innerHTML = '';

            each(this.elements, () => {
                let slide = createHTML(this.settings.slideHtml);
                this.slidesContainer.appendChild(slide);
            })
            this.showSlide(0, true);
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
        each(this.elements, (el, i) => {
            if (utils.has(el, 'node') && el.node == node) {
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
     * @param { mixed } element
     * @return { array }
     */
    getElements(element = null) {
        let list = [];
        this.elements = (this.elements ? this.elements : []);

        if (!utils.isNil(this.settings.elements) && utils.isArray(this.settings.elements)) {
            list = this.settings.elements;
        }

        let nodes = false;
        let selector = this.getSelector();

        if (element !== null) {
            let gallery = element.getAttribute('data-gallery')
            if (gallery && gallery !== '') {
                nodes = document.querySelectorAll(`[data-gallery="${gallery}"]`);
            }
        }
        if (nodes == false && selector) {
            nodes = document.querySelectorAll(this.getSelector());
        }
        nodes = Array.prototype.slice.call(nodes);

        each(nodes, (el, i) => {
            const elData = getSlideData(el, this.settings);
            elData.node = el;
            elData.index = i;
            list.push(elData);
        })

        return list;
    }

    /**
     * Get selector
     */
    getSelector() {
        if (this.settings.selector.substring(0, 5) == 'data-') {
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
        let effects = []
        for (let key in this.settings.cssEfects) {
            if (this.settings.cssEfects.hasOwnProperty(key)) {
                let effect = this.settings.cssEfects[key]
                effects.push(`g${effect.in}`)
                effects.push(`g${effect.out}`)
            }
        }
        return effects.join(' ')
    }


    /**
     * Build the structure
     * @return {null}
     */
    build() {
        if (this.built) {
            return false;
        }

        const nextSVG = utils.has(this.settings.svg, 'next') ? this.settings.svg.next : '';
        const prevSVG = utils.has(this.settings.svg, 'prev') ? this.settings.svg.prev : '';
        const closeSVG = utils.has(this.settings.svg, 'close') ? this.settings.svg.close : '';

        let lightboxHTML = this.settings.lightboxHtml;
        lightboxHTML = lightboxHTML.replace(/{nextSVG}/g, nextSVG);
        lightboxHTML = lightboxHTML.replace(/{prevSVG}/g, prevSVG);
        lightboxHTML = lightboxHTML.replace(/{closeSVG}/g, closeSVG);

        lightboxHTML = createHTML(lightboxHTML);
        document.body.appendChild(lightboxHTML);

        const modal = document.getElementById('glightbox-body');
        this.modal = modal;
        let closeButton = modal.querySelector('.gclose');
        this.prevButton = modal.querySelector('.gprev');
        this.nextButton = modal.querySelector('.gnext');
        this.overlay = modal.querySelector('.goverlay');
        this.loader = modal.querySelector('.gloader');
        this.slidesContainer = document.getElementById('glightbox-slider');
        this.events = {}

        addClass(this.modal, 'glightbox-' + this.settings.skin);

        if (this.settings.closeButton && closeButton) {
            this.events['close'] = addEvent('click', {
                onElement: closeButton,
                withCallback: (e, target) => {
                    e.preventDefault()
                    this.close()
                }
            })
        }
        if (closeButton && !this.settings.closeButton) {
            closeButton.parentNode.removeChild(closeButton);
        }

        if (this.nextButton) {
            this.events['next'] = addEvent('click', {
                onElement: this.nextButton,
                withCallback: (e, target) => {
                    e.preventDefault()
                    this.nextSlide()
                }
            })
        }

        if (this.prevButton) {
            this.events['prev'] = addEvent('click', {
                onElement: this.prevButton,
                withCallback: (e, target) => {
                    e.preventDefault()
                    this.prevSlide()
                }
            })
        }
        if (this.settings.closeOnOutsideClick) {
            this.events['outClose'] = addEvent('click', {
                onElement: modal,
                withCallback: (e, target) => {
                    if (!hasClass(document.body, 'glightbox-mobile') && !getClosest(e.target, '.ginner-container')) {
                        if (!getClosest(e.target, '.gbtn') && !hasClass(e.target, 'gnext') && !hasClass(e.target, 'gprev')) {
                            this.close();
                        }
                    }
                }
            })
        }
        each(this.elements, () => {
            let slide = createHTML(this.settings.slideHtml);
            this.slidesContainer.appendChild(slide);
        })
        if (isTouch) {
            addClass(document.body, 'glightbox-touch');
        }

        this.events['resize'] = addEvent('resize', {
            onElement: window,
            withCallback: () => {
                this.resize();
            }
        })

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
        slide = (!slide ? this.activeSlide : slide);

        if (!slide || hasClass(slide, 'zoomed')) {
            return;
        }

        const winSize = windowSize();
        const video = slide.querySelector('.gvideo-wrapper');
        const image = slide.querySelector('.gslide-image');
        const description = this.slideDescription;

        let winWidth = winSize.width;
        let winHeight = winSize.height;

        if (winWidth <= 768) {
            addClass(document.body, 'glightbox-mobile');
        } else {
            removeClass(document.body, 'glightbox-mobile');
        }

        if (!video && !image) {
            return;
        }

        let descriptionResize = false;
        if (description && (hasClass(description, 'description-bottom') || hasClass(description, 'description-top')) && !hasClass(description, 'gabsolute')) {
            descriptionResize = true;
        }

        if (image) {
            if (winWidth <= 768) {
                let imgNode = image.querySelector('img');
                imgNode.setAttribute('style', '')
            } else if (descriptionResize) {
                let descHeight = description.offsetHeight;
                let maxWidth = this.slidesData[this.index].width;
                maxWidth = (maxWidth <= winWidth ? maxWidth + 'px' : '100%')

                let imgNode = image.querySelector('img');
                imgNode.setAttribute('style', `max-height: calc(100vh - ${descHeight}px)`)
                description.setAttribute('style', `max-width: ${imgNode.offsetWidth}px;`)
            }
        }

        if (video) {
            let ratio = (utils.has(this.settings.plyr.config, 'ratio') ? this.settings.plyr.config.ratio : '16:9');
            let videoRatio = ratio.split(':');
            let maxWidth = this.slidesData[this.index].width;
            let maxHeight = maxWidth / (parseInt(videoRatio[0]) / parseInt(videoRatio[1]));
            maxHeight = Math.floor(maxHeight);

            if (descriptionResize) {
                winHeight = winHeight - description.offsetHeight;
            }

            if (winHeight < maxHeight && winWidth > maxWidth) {
                let vwidth = video.offsetWidth;
                let vheight = video.offsetHeight;
                let ratio = winHeight / vheight;
                let vsize = { width: vwidth * ratio, height: vheight * ratio };
                video.parentNode.setAttribute('style', `max-width: ${vsize.width}px`)

                if (descriptionResize) {
                    description.setAttribute('style', `max-width: ${vsize.width}px;`)
                }
            } else {
                video.parentNode.style.maxWidth = `${maxWidth}px`;
                if (descriptionResize) {
                    description.setAttribute('style', `max-width: ${maxWidth}px;`)
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
        removeClass(this.nextButton, 'disabled');
        removeClass(this.prevButton, 'disabled');

        if (this.index == 0 && this.elements.length - 1 == 0) {
            addClass(this.prevButton, 'disabled');
            addClass(this.nextButton, 'disabled');
        } else if (this.index === 0 && !loop) {
            addClass(this.prevButton, 'disabled');
        } else if (this.index === this.elements.length - 1 && !loop) {
            addClass(this.nextButton, 'disabled');
        }
    }


    /**
     * Handle loop config
     */
    loop() {
        let loop = (utils.has(this.settings, 'loopAtEnd') ? this.settings.loopAtEnd : null);
        loop = (utils.has(this.settings, 'loop') ? this.settings.loop : loop);

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
                        this.events[key].destroy()
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
        this.stopSlideVideo(this.activeSlide)
        addClass(this.modal, 'glightbox-closing')
        animateElement(this.overlay, (this.settings.openEffect == 'none' ? 'none' : this.settings.cssEfects.fade.out))
        animateElement(this.activeSlide, this.settings.closeEffect, () => {
            this.activeSlide = null;
            this.prevActiveSlideIndex = null;
            this.prevActiveSlide = null;
            this.built = false;

            if (this.events) {
                for (let key in this.events) {
                    if (this.events.hasOwnProperty(key)) {
                        this.events[key].destroy()
                    }
                }
                this.events = null;
            }

            const body = document.body;
            removeClass(html, 'glightbox-open')
            removeClass(body, 'glightbox-open touching gdesc-open glightbox-touch glightbox-mobile gscrollbar-fixer')
            this.modal.parentNode.removeChild(this.modal)
            if (utils.isFunction(this.settings.onClose)) {
                this.settings.onClose();
            }

            const styles = document.querySelector('.gcss-styles');
            if (styles) {
                styles.parentNode.removeChild(styles)
            }
            this.lightboxOpen = false
            this.closing = null;
        });
    }

    destroy() {
        this.close();
        this.baseEvents.destroy();
    }
}

export default function (options = {}) {
    const instance = new GlightboxInit(options);
    instance.init()

    return instance;
}
