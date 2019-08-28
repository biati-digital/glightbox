/**
 * GLightbox v2.0.2
 * Awesome pure javascript lightbox
 * made by https://www.biati.digital
 */

import TouchEvents from './touch-events';

const isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i);
const isTouch = isMobile !== null || document.createTouch !== undefined || ('ontouchstart' in window) || ('onmsgesturechange' in window) || navigator.msMaxTouchPoints;
const html = document.getElementsByTagName('html')[0];
const transitionEnd = whichTransitionEvent();
const animationEnd = whichAnimationEvent();
const uid = Date.now();

let videoPlayers = { }

// Default settings
const defaults = {
    selector: 'glightbox',
    elements: null,
    skin: 'clean',
    closeButton: true,
    startAt: null,
    autoplayVideos: true,
    descPosition: 'bottom',
    width: 900,
    height: 506,
    videosWidth: 960,
    beforeSlideChange: null,
    afterSlideChange: null,
    beforeSlideLoad: null,
    afterSlideLoad: null,
    onOpen: null,
    onClose: null,
    loopAtEnd: false,
    touchNavigation: true,
    keyboardNavigation: true,
    closeOnOutsideClick: true,
    plyr: {
        css: 'https://cdn.plyr.io/3.5.6/plyr.css',
        js: 'https://cdn.plyr.io/3.5.6/plyr.js',
        config: {
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
let lightboxSlideHtml = '<div class="gslide">\
         <div class="gslide-inner-content">\
            <div class="ginner-container">\
               <div class="gslide-media">\
               </div>\
               <div class="gslide-description">\
                    <div class="gdesc-inner">\
                        <h4 class="gslide-title"></h4>\
                        <div class="gslide-desc"></div>\
                    </div>\
               </div>\
            </div>\
         </div>\
       </div>';
defaults.slideHtml = lightboxSlideHtml;

const lightboxHtml = '<div id="glightbox-body" class="glightbox-container">\
            <div class="gloader visible"></div>\
            <div class="goverlay"></div>\
            <div class="gcontainer">\
               <div id="glightbox-slider" class="gslider"></div>\
               <button class="gnext gbtn" tabindex="0"></button>\
               <button class="gprev gbtn" tabindex="1"></button>\
               <button class="gclose gbtn" tabindex="2"></button>\
            </div>\
   </div>';
defaults.lightboxHtml = lightboxHtml;



/**
 * Merge two or more objects
 */
function extend() {
    let extended = { }
    let deep = false
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
    isFunction: function(f) {
        return typeof f === 'function'
    },
    isString: function(s) {
        return typeof s === 'string'
    },
    isNode: function(el) {
        return !!(el && el.nodeType && el.nodeType == 1)
    },
    isArray: function(ar) {
        return Array.isArray(ar)
    },
    isArrayLike: function(ar) {
        return (ar && ar.length && isFinite(ar.length))
    },
    isObject: function(o) {
        let type = typeof o;
        return type === 'object' && (o != null && !utils.isFunction(o) && !utils.isArray(o))
    },
    isNil: function(o) {
        return o == null
    },
    has: function(obj, key) {
        return obj !== null && hasOwnProperty.call(obj, key);
    },
    size: function(o) {
        if (utils.isObject(o)) {
            if (o.keys) {
                return o.keys().length;
            }
            let l = 0;
            for (let k in o){
                if (utils.has(o, k)) {
                    l++
                }
            }
            return l
        }
        else{
            return o.length;
        }
    },
    isNumber: function(n) {
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
    const data = { all: cache, evt: null, found: null};
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
    useCapture = false} = { }, thisArg) {
    let element = onElement || []
    if (utils.isString(element)) {
        element =  document.querySelectorAll(element)
    }
    function handler(event) {
        if (utils.isFunction(withCallback)) {
            withCallback.call(thisArg, event, this)
        }
        if (once) {
            handler.destroy();
        }
    }
    handler.destroy = function() {
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
            events.all.push({ eventName: eventName, fn: handler});
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
    each(name.split(' '), cl => node.classList.remove(cl) )
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
        addClass(element, 'g'+name)
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
 * Get slide data
 *
 * @param {node} element
 */
const getSlideData = function getSlideData(element = null, settings) {
    let data = {
        href: '',
        title: '',
        type: '',
        description: '',
        descPosition: 'bottom',
        effect: '',
        width: '',
        height: '',
        node: element
    };

    if (utils.isObject(element) && !utils.isNode(element)){
        return extend(data, element);
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
        if (utils.has(settings, key)) {
            data[key] = settings[key];
        }
        const nodeData = element.dataset[key];
        if (!utils.isNil(nodeData)) {
            data[key] = nodeData;
        }
    });

    if (!data.type) {
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
    let nodeDesc = element.querySelector('.glightbox-desc')
    if (nodeDesc) {
        data.description = nodeDesc.innerHTML;
    }

    const defaultWith = (data.type == 'video' ? settings.videosWidth : settings.width);
    const defaultHeight = settings.height;

    data.width = (utils.has(data, 'width') ? data.width : defaultWith);
    data.height = (utils.has(data, 'height') ? data.height : defaultHeight);

    return data;
}

/**
 * Set slide content
 *
 * @param {node} slide
 * @param {object} data
 * @param {function} callback
 */
const setSlideContent = function setSlideContent(slide = null, data = { }, callback = false) {
    if (hasClass(slide, 'loaded')) {
        return false
    }

    if (utils.isFunction(this.settings.beforeSlideLoad)) {
        this.settings.beforeSlideLoad(slide, data);
    }

    let type = data.type;
    let position = data.descPosition;
    let slideMedia = slide.querySelector('.gslide-media');
    let slideTitle = slide.querySelector('.gslide-title');
    let slideText = slide.querySelector('.gslide-desc');
    let slideDesc = slide.querySelector('.gdesc-inner');
    let finalCallback = callback

    if (utils.isFunction(this.settings.afterSlideLoad)) {
        finalCallback = () => {
            if (utils.isFunction(callback)) { callback() }
            this.settings.afterSlideLoad(slide, data);
        }
    }

    if (data.title == '' && data.description == '') {
        if (slideDesc) {
            slideDesc.parentNode.parentNode.removeChild(slideDesc.parentNode);
        }
    } else{
        if (slideTitle && data.title !== '') {
            slideTitle.innerHTML = data.title;
        } else {
            slideTitle.parentNode.removeChild(slideTitle);
        }
        if (slideText && data.description !== '') {
            if (isMobile && this.settings.moreLength > 0) {
                data.smallDescription = slideShortDesc(data.description, this.settings.moreLength, this.settings.moreText)
                slideText.innerHTML = data.smallDescription;
                slideDescriptionEvents.apply(this, [slideText, data])
            }
            else{
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
        slideMedia.innerHTML = '<div class="gvideo-wrapper"></div>';
        setSlideVideo.apply(this, [slide, data, finalCallback])
        return
    }

    if (type === 'external') {
        let iframe = createIframe({
            url: data.href,
            width: data.width,
            height: data.height,
            callback: finalCallback,
        })
        slideMedia.parentNode.style.maxWidth = `${data.width}px`;
        slideMedia.appendChild(iframe);
        return
    }

    if (type === 'inline') {
        setInlineContent.apply(this, [slide, data, finalCallback])
        return
    }

    if (type === 'image') {
        let img = new Image();
        img.addEventListener('load', function() {
            if (utils.isFunction(finalCallback)){
                finalCallback()
            }
        }, false);
        img.src = data.href;
        slideMedia.appendChild(img);
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

    slideMedia.parentNode.style.maxWidth = `${data.width}px`;

    injectVideoApi(this.settings.plyr.js, 'Plyr', () => {

        // Set vimeo videos
        if (url.match(/vimeo\.com\/([0-9]*)/)) {
            const vimeoID = /vimeo.*\/(\d+)/i.exec(url);
            videoSource = 'vimeo';
            embedID = vimeoID[1];
        }

        // Set youtube videos
        if (url.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/)) {
            const youtubeID = getYoutubeID(url)
            videoSource = 'youtube';
            embedID = youtubeID;
        }

        // Set local videos
        if (url.match(/\.(mp4|ogg|webm)$/) !== null) {
            videoSource = 'local'
            let html = '<video id="' + videoID + '" ';
            html += `style="background:#000; max-width: ${data.width}px;" `;
            html += 'preload="metadata" ';
            html += 'x-webkit-airplay="allow" ';
            html += 'webkit-playsinline="" ';
            html += 'controls ';
            html += 'class="gvideo-local">';

            let format = url.toLowerCase().split('.').pop()
            let sources = {'mp4': '', 'ogg': '', 'webm': ''}
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

        const playerConfig = utils.has(this.settings.plyr, 'config') ? this.settings.plyr.config : {};
        const player = new Plyr('#' + videoID, playerConfig);

        player.on('ready', event => {
            const instance = event.detail.plyr;
            videoPlayers[videoID] = instance;
            if (utils.isFunction(callback)) {
                callback()
            }
        });
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
    let { url, width, height, allow, callback, appendTo } = config;
    let iframe = document.createElement('iframe');
    let winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    iframe.className = 'vimeo-video gvideo';
    iframe.src = url;

    if (height) {
        if (isMobile && winWidth < 767) {
            iframe.style.height = ''
        } else {
            iframe.style.height = `${height}px`
        }
    }
    if (width) {
        iframe.style.width = `${width}px`
    }
    if (allow) {
        iframe.setAttribute('allow', allow)
    }
    iframe.onload = function() {
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
    const hash = data.href.split('#').pop().trim();

    let div = document.getElementById(hash);
    if (!div) {
        return false;
    }
    const cloned = div.cloneNode(true)

    cloned.style.height = (utils.isNumber(data.height) ? `${data.height}px` : data.height);
    cloned.style.maxWidth = (utils.isNumber(data.width) ? `${data.width}px` : data.width);
    addClass(cloned, 'ginlined-content')
    slideMedia.appendChild(cloned)

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
const getSourceType = function(url) {
    let origin = url;
    url = url.toLowerCase();

    if (url.match(/\.(jpeg|jpg|gif|png|apn|webp|svg)$/) !== null) {
        return 'image';
    }
    if (url.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/)) {
        return 'video';
    }
    if (url.match(/vimeo\.com\/([0-9]*)/)) {
        return 'video';
    }
    if (url.match(/\.(mp4|ogg|webm)$/) !== null) {
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

    let winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
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

    const touchInstance = new TouchEvents(sliderWrapper, {
        touchStart: (e) => {
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
            }
            if (hSwipe) {
                opacity = 1 - Math.abs(hDistance) / winWidth;
                media.style.opacity = opacity;
            }

            if (!mediaImage) {
                return slideCSSTransform(media, `translate3d(${hDistancePercent}%, 0, 0)`)
            }

            slideCSSTransform(media, `translate3d(${hDistancePercent}%, ${vDistancePercent}%, 0)`)
        },
        touchEnd: () => {
            doingMove = false;
            if (imageZoomed || doingZoom) {
                lastZoomedPosX = zoomedPosX;
                lastZoomedPosY = zoomedPosY;
                return;
            }
            const v = Math.abs(parseInt(vDistancePercent));
            const h = Math.abs(parseInt(hDistancePercent));

            if (v > 35 && mediaImage) {
                this.close();
                return;
            }
            if (v < 35 && h < 25) {
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
    return subString + '... <a href="#" class="desc-more">'+wordBoundary+'</a>'
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

    constructor(options) {
        this.settings = extend(defaults, options || { })
        this.effectsClasses = this.getAnimationClasses()
    }

    init(){
        this.baseEvents = addEvent('click', {
            onElement: `.${this.settings.selector}`,
            withCallback: (e, target) => {
                e.preventDefault();
                this.open(target);
            }
        })
    }

    open(element = null){
        this.elements = this.getElements(element)
        if (this.elements.length == 0)
            return false;

        this.activeSlide = null
        this.prevActiveSlideIndex = null
        this.prevActiveSlide = null
        let index = this.settings.startAt

        if (element && utils.isNil(index)) { // if element passed and startAt is null, get the index
            index = this.elements.indexOf(element)
            if (index < 0) {
                index = 0
            }
        }

        if (utils.isNil(index)) {
            index = 0
        }

        this.build()
        animateElement(this.overlay, (this.settings.openEffect == 'none' ? 'none' : this.settings.cssEfects.fade.in))

        const body = document.body;
        body.style.width = `${body.offsetWidth}px`

        addClass(body, 'glightbox-open')
        addClass(html, 'glightbox-open')
        if (isMobile) {
            addClass(html, 'glightbox-mobile')
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

        if (isMobile && isTouch && this.settings.touchNavigation) {
            touchNavigation.apply(this)
            return false
        }
        if (this.settings.keyboardNavigation) {
            keyboardNavigation.apply(this)
        }
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
        show(this.slidesContainer);

        // Check if slide's content is alreay loaded
        if (hasClass(slide, 'loaded')) {
            this.slideAnimateIn(slide, first);
            hide(this.loader);
        } else {
            // If not loaded add the slide content
            show(this.loader);
            let slide_data = getSlideData(this.elements[index], this.settings);
            slide_data.index = index;
            setSlideContent.apply(this, [slide, slide_data, () => {
                hide(this.loader);
                this.slideAnimateIn(slide, first);
            }]);
        }

        // Preload subsequent slides
        this.preloadSlide(index + 1);
        this.preloadSlide(index - 1);

        // Handle navigation arrows
        removeClass(this.nextButton, 'disabled');
        removeClass(this.prevButton, 'disabled');
        if (index === 0) {
            addClass(this.prevButton, 'disabled');
        } else if (index === this.elements.length - 1 && this.settings.loopAtEnd !== true) {
            addClass(this.nextButton, 'disabled');
        }
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
        if (index < 0 || index > this.elements.length)
            return false

        if (utils.isNil(this.elements[index]))
            return false

        let slide = this.slidesContainer.querySelectorAll('.gslide')[index];
        if (hasClass(slide, 'loaded')) {
            return false;
        }

        let slide_data = getSlideData(this.elements[index], this.settings);
        slide_data.index = index;
        let type = slide_data.sourcetype;
        if (type == 'video' || type == 'external') {
            setTimeout(() => {
                setSlideContent.apply(this, [slide, slide_data]);
            }, 200);
        } else {
            setSlideContent.apply(this, [slide, slide_data]);
        }
    }




    /**
	 * Load previous slide
	 * calls goToslide
	 */
    prevSlide() {
        let prev = this.index - 1;
        if (prev < 0){
            return false;
        }
        this.goToSlide(prev);
    }



    /**
     * Load next slide
     * calls goToslide
     */
    nextSlide() {
        let next = this.index + 1;
        if (next > this.elements.length)
            return false;

        this.goToSlide(next);
    }


    /**
     * Go to sldei
     * calls set slide
     * @param [Int] - index
     */
    goToSlide(index = false) {
        if (index > -1) {
            this.prevActiveSlide = this.activeSlide;
            this.prevActiveSlideIndex = this.index;

            if (index < this.elements.length) {
                this.showSlide(index);
            } else {
                if (this.settings.loopAtEnd === true) {
                    index = 0;
                    this.showSlide(index);
                }
            }
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
            slide: this.prevActiveSlide
        };
        let nextData = {
            index: this.index,
            slide: this.activeSlide
        };
        if (slideMedia.offsetWidth > 0 && slideDesc) {
            hide(slideDesc)
            slide.querySelector('.ginner-container').style.maxWidth = `${slideMedia.offsetWidth}px`
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
                slide: this.prevActiveSlide
            }, {
                index: this.index,
                slide: this.activeSlide
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


    stopSlideVideo(slide) {
        if (utils.isNumber(slide)) {
            slide = this.slidesContainer.querySelectorAll('.gslide')[slide]
        }

        let slideVideo = (slide ? slide.querySelector('.gvideo') : null)
        if (!slideVideo) {
            return false
        }

        const videoID = slideVideo.getAttribute('data-id');
        if (videoPlayers && utils.has(videoPlayers, videoID)) {
            const api = videoPlayers[videoID]
            if (api && api.play) {
                api.pause();
            }
        }
    }



    playSlideVideo(slide){
        if (utils.isNumber(slide)) {
            slide = this.slidesContainer.querySelectorAll('.gslide')[slide];
        }
        const slideVideo = slide.querySelector('.gvideo');
        if (!slideVideo) {
            return false;
        }

        const videoID = slideVideo.getAttribute('data-id');
        if (videoPlayers && utils.has(videoPlayers, videoID)) {
            const api = videoPlayers[videoID]

            if (api && api.play) {
                api.play();
            }
        }
    }

    setElements(elements) {
        this.settings.elements = elements;
    }

    getElements(element = null) {
        this.elements = [];

        if (!utils.isNil(this.settings.elements) && utils.isArray(this.settings.elements)) {
            return this.settings.elements
        }

        let nodes = false;
        if (element !== null) {
            let gallery = element.getAttribute('data-gallery')
            if (gallery && gallery !== '') {
                nodes = document.querySelectorAll(`[data-gallery="${gallery}"]`);
            }
        }
        if (nodes == false) {
            nodes = document.querySelectorAll(`.${this.settings.selector}`);
        }
        nodes = Array.prototype.slice.call(nodes);
        return nodes;
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
        for (let key in this.settings.cssEfects ){
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

        const lightbox_html = createHTML(this.settings.lightboxHtml);
        document.body.appendChild(lightbox_html);

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

        if (this.settings.closeButton && closeButton){
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

        if (this.nextButton){
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
                    if (!getClosest(e.target, '.ginner-container')) {
                        if (!hasClass(e.target, 'gnext') && !hasClass(e.target, 'gprev')) {
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
            addClass(html, 'glightbox-touch');
        }

        this.built = true;
    }

    /**
     * Reload Lightbox
     * reload and apply events to nodes
     */
    reload() {
        this.init();
    }


    /**
     * Close Lightbox
     * closes the lightbox and removes the slides
     * and some classes
     */
    close() {
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
            removeClass(body, 'glightbox-open')
            removeClass(html, 'glightbox-open')
            removeClass(body, 'touching')
            removeClass(body, 'gdesc-open')
            body.style.width = '';
            this.modal.parentNode.removeChild(this.modal)
            if (utils.isFunction(this.settings.onClose)) {
                this.settings.onClose();
            }
            this.closing = null;
        });
    }

    destroy(){
        this.close();
        this.baseEvents.destroy();
    }
}

/* module.exports = (options = { }) => {
    const instance = new GlightboxInit(options);
    instance.init()

    return instance;
} */

export default function(options = {}) {
    const instance = new GlightboxInit(options);
    instance.init()

    return instance;
}
