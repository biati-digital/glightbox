(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define('GLightbox', ['module'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod);
        global.GLightbox = mod.exports;
    }
})(this, function (module) {
    'use strict';

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    var isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i);
    var isTouch = isMobile !== null || document.createTouch !== undefined || 'ontouchstart' in window || 'onmsgesturechange' in window || navigator.msMaxTouchPoints;
    var html = document.getElementsByTagName('html')[0];
    var body = document.body;
    var transitionEnd = whichTransitionEvent();
    var animationEnd = whichAnimationEvent();
    var YTTemp = [];
    var videoPlayers = {};

    // Default settings
    var defaults = {
        selector: 'glightbox',
        skin: 'clean',
        closeButton: true,
        startAt: 0,
        autoplayVideos: true,
        descPosition: 'bottom',
        width: 900,
        height: 506,
        videosWidth: 900,
        videosHeight: 506,
        beforeSlideChange: null,
        afterSlideChange: null,
        beforeSlideLoad: null,
        afterSlideLoad: null,
        onOpen: null,
        onClose: null,
        loopAtEnd: false,
        jwplayer: {
            api: null,
            licenseKey: null,
            params: {
                width: '100%',
                aspectratio: '16:9',
                stretching: 'uniform'
            }
        },
        vimeo: {
            api: 'https://player.vimeo.com/api/player.js',
            params: {
                api: 1,
                title: 0,
                byline: 0,
                portrait: 0
            }
        },
        youtube: {
            api: 'https://www.youtube.com/iframe_api',
            params: {
                enablejsapi: 1,
                showinfo: 0
            }
        },
        openEffect: 'zoomIn', // fade, zoom
        closeEffect: 'zoomOut', // fade, zoom
        slideEffect: 'slide', // fade, slide, zoom,
        moreText: 'See more',
        slideHtml: '',
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
    var lightboxSlideHtml = '<div class="gslide">\
         <div class="gslide-inner-content">\
            <div class="ginner-container">\
               <div class="gslide-media">\
               </div>\
               <div class="gslide-description">\
                  <h4 class="gslide-title"></h4>\
                  <div class="gslide-desc"></div>\
               </div>\
            </div>\
         </div>\
       </div>';
    defaults.slideHtml = lightboxSlideHtml;

    var lightboxHtml = '<div id="glightbox-body" class="glightbox-container">\
            <div class="gloader visible"></div>\
            <div class="goverlay"></div>\
            <div class="gcontainer">\
               <div id="glightbox-slider" class="gslider"></div>\
               <a class="gnext"></a>\
               <a class="gprev"></a>\
               <a class="gclose"></a>\
            </div>\
   </div>';
    defaults.lightboxHtml = lightboxHtml;

    /**
     * Merge two or more objects
     */
    function extend() {
        var extended = {};
        var deep = false;
        var i = 0;
        var length = arguments.length;
        if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
            deep = arguments[0];
            i++;
        }
        var merge = function merge(obj) {
            for (var prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                        extended[prop] = extend(true, extended[prop], obj[prop]);
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };
        for (; i < length; i++) {
            var obj = arguments[i];
            merge(obj);
        }
        return extended;
    }

    var utils = {
        isFunction: function isFunction(f) {
            return typeof f === 'function';
        },
        isString: function isString(s) {
            return typeof s === 'string';
        },
        isNode: function isNode(el) {
            return !!(el && el.nodeType && el.nodeType == 1);
        },
        isArray: function isArray(ar) {
            return Array.isArray(ar);
        },
        isArrayLike: function isArrayLike(ar) {
            return ar && ar.length && isFinite(ar.length);
        },
        isObject: function isObject(o) {
            var type = typeof o === 'undefined' ? 'undefined' : _typeof(o);
            return type === 'object' && o != null && !utils.isFunction(o) && !utils.isArray(o);
        },
        isNil: function isNil(o) {
            return o == null;
        },
        has: function has(obj, key) {
            return obj !== null && hasOwnProperty.call(obj, key);
        },
        size: function size(o) {
            if (utils.isObject(o)) {
                if (o.keys) {
                    return o.keys().length;
                }
                var l = 0;
                for (var k in o) {
                    if (utils.has(o, k)) {
                        l++;
                    }
                }
                return l;
            } else {
                return o.length;
            }
        },
        isNumber: function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
    };

    /**
     * Each
     *
     * @param {mixed} node lisy, array, object
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
            var l = collection.length,
                i = 0;
            for (; i < l; i++) {
                if (callback.call(collection[i], collection[i], i, collection) === false) {
                    break;
                }
            }
        } else if (utils.isObject(collection)) {
            for (var key in collection) {
                if (utils.has(collection, key)) {
                    if (callback.call(collection[key], collection[key], key, collection) === false) {
                        break;
                    }
                }
            }
        }
    }

    /**
     * Add Event
     * Add an event listener
     *
     * @param {string} eventName
     * @param {object} detials
     */
    function addEvent(eventName) {
        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            onElement = _ref.onElement,
            withCallback = _ref.withCallback,
            _ref$once = _ref.once,
            once = _ref$once === undefined ? false : _ref$once,
            _ref$useCapture = _ref.useCapture,
            useCapture = _ref$useCapture === undefined ? false : _ref$useCapture;

        var thisArg = arguments[2];

        var tstst = onElement;
        var element = onElement || [];
        if (utils.isString(element)) {
            element = document.querySelectorAll(element);
        }
        function handler(event) {
            if (utils.isFunction(withCallback)) {
                withCallback.call(thisArg, event, this);
            }
            if (once) {
                handler.destroy();
            }
        }
        handler.destroy = function () {
            each(element, function (el) {
                el.removeEventListener(eventName, handler, useCapture);
            });
        };
        each(element, function (el) {
            el.addEventListener(eventName, handler, useCapture);
        });
        return handler;
    }

    /**
     * Add element class
     *
     * @param {node} element
     * @param {string} class name
     */
    function addClass(node, name) {
        if (hasClass(node, name)) {
            return;
        }
        if (node.classList) {
            node.classList.add(name);
        } else {
            node.className += " " + name;
        }
    }

    /**
     * Remove element class
     *
     * @param {node} element
     * @param {string} class name
     */
    function removeClass(node, name) {
        var c = name.split(' ');
        if (c.length > 1) {
            each(c, function (cl) {
                removeClass(node, cl);
            });
            return;
        }
        if (node.classList) {
            node.classList.remove(name);
        } else {
            node.className = node.className.replace(name, "");
        }
    }

    /**
     * Has class
     *
     * @param {node} element
     * @param {string} class name
     */
    function hasClass(node, name) {
        return node.classList ? node.classList.contains(name) : new RegExp("(^| )" + name + "( |$)", "gi").test(node.className);
    }

    /**
     * Determine animation events
     */
    function whichAnimationEvent() {
        var t = void 0,
            el = document.createElement("fakeelement");
        var animations = {
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
        var t = void 0,
            el = document.createElement("fakeelement");

        var transitions = {
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
    function animateElement(element) {
        var animation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        if (animation === '') {
            return false;
        }
        var animationNames = animation.split(' ');
        each(animationNames, function (name) {
            addClass(element, 'g' + name);
        });
        var animationEvent = addEvent(animationEnd, {
            onElement: element,
            once: true,
            withCallback: function withCallback(event, target) {
                each(animationNames, function (name) {
                    removeClass(target, 'g' + name);
                });
                // animation.destroy()
                if (utils.isFunction(callback)) callback();
            }
        });
    }

    /**
     * Create a document fragment
     *
     * @param {string} html code
     */
    function createHTML(htmlStr) {
        var frag = document.createDocumentFragment(),
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
            if (elem.matches(selector)) return elem;
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
    var getSlideData = function getSlideData() {
        var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        if (element === null) return false;

        var url = '';
        var config = element.getAttribute('data-glightbox');
        var type = element.nodeName.toLowerCase();
        if (type === 'a') url = element.href;
        if (type === 'img') url = element.src;

        var data = {
            href: url,
            title: '',
            description: '',
            descPosition: 'bottom',
            effect: ''
        };

        var sourceType = getSourceType(url);
        data = extend(data, sourceType);

        if (!utils.isNil(config)) {
            config = config.replace(/'/g, '\\"');
            if (config.trim() !== '') {
                config = config.split(';');
                config = config.filter(Boolean);
            }
            each(config, function (set) {
                set = set.trim().split(':');
                if (utils.size(set) == 2) {
                    var ckey = set[0].trim();
                    var cvalue = set[1].trim();

                    if (cvalue !== '') {
                        cvalue = cvalue.replace(/\\/g, '');
                    }
                    data[ckey] = cvalue;
                }
            });
        } else {
            if (type == 'a') {
                var title = element.title;
                if (!utils.isNil(title) && title !== '') data.title = title;
            }
            if (type == 'img') {
                var alt = element.alt;
                if (!utils.isNil(alt) && alt !== '') data.title = alt;
            }
            var desc = element.getAttribute('data-description');
            if (!utils.isNil(desc) && desc !== '') data.description = desc;
        }
        var nodeDesc = element.querySelector('.glightbox-desc');
        if (nodeDesc) {
            data.description = nodeDesc.innerHTML;
        }
        return data;
    };

    /**
     * Set slide content
     *
     * @param {node} slide
     * @param {object} data
     * @param {function} callback
     */
    var setSlideContent = function setSlideContent() {
        var slide = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        var _this = this;

        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        if (hasClass(slide, 'loaded')) {
            return false;
        }

        if (utils.isFunction(this.settings.beforeSlideLoad)) {
            this.settings.beforeSlideLoad(slide, data);
        }

        var type = data.sourcetype;
        var position = data.descPosition;
        var slideMedia = slide.querySelector('.gslide-media');
        var slideTitle = slide.querySelector('.gslide-title');
        var slideText = slide.querySelector('.gslide-desc');
        var slideDesc = slide.querySelector('.gslide-description');
        var finalCallback = callback;

        if (callback && utils.isFunction(this.settings.afterSlideLoad)) {
            finalCallback = function finalCallback() {
                callback();
                _this.settings.afterSlideLoad(slide, data);
            };
        }

        if (data.title == '' && data.description == '') {
            if (slideDesc) {
                slideDesc.parentNode.removeChild(slideDesc);
            }
        } else {
            if (slideTitle && data.title !== '') {
                slideTitle.innerHTML = data.title;
            } else {
                slideTitle.parentNode.removeChild(slideTitle);
            }
            if (slideText && data.description !== '') {
                if (isMobile) {
                    data.smallDescription = slideShortDesc(data.description, 60, this.settings.moreText);
                    slideText.innerHTML = data.smallDescription;
                    slideDescriptionEvents.apply(this, [slideText, data]);
                } else {
                    slideText.innerHTML = data.description;
                }
            } else {
                slideText.parentNode.removeChild(slideText);
            }
            addClass(slideMedia.parentNode, 'desc-' + position);
            addClass(slideDesc, 'description-' + position);
        }

        addClass(slideMedia, 'gslide-' + type);
        addClass(slide, 'loaded');

        if (type === 'video') {
            setSlideVideo.apply(this, [slide, data, finalCallback]);
            return;
        }

        if (type === 'external') {
            var iframe = createIframe(data.href, this.settings.width, this.settings.height, finalCallback);
            slideMedia.appendChild(iframe);
            return;
        }

        if (type === 'inline') {
            setInlineContent.apply(this, [slide, data, finalCallback]);
            return;
        }

        if (type === 'image') {
            var img = new Image();
            img.addEventListener('load', function () {
                if (utils.isFunction(finalCallback)) {
                    finalCallback();
                }
            }, false);
            img.src = data.href;
            slideMedia.appendChild(img);
            return;
        }

        if (utils.isFunction(finalCallback)) finalCallback();
    };

    /**
     * Set slide video
     *
     * @param {node} slide
     * @param {object} data
     * @param {function} callback
     */
    function setSlideVideo(slide, data, callback) {
        var _this2 = this;

        var source = data.source;
        var video_id = 'gvideo' + data.index;
        var slideMedia = slide.querySelector('.gslide-media');
        var url = data.href;
        var protocol = location.protocol.replace(':', '');

        if (protocol == 'file') {
            protocol = 'http';
        }

        // Set vimeo videos
        if (source == 'vimeo') {
            var vimeo_id = /vimeo.*\/(\d+)/i.exec(url);
            var params = parseUrlParams(this.settings.vimeo.params);
            var video_url = protocol + '://player.vimeo.com/video/' + vimeo_id[1] + '?' + params;
            var iframe = createIframe(video_url, this.settings.videosWidth, this.settings.videosHeight, callback);
            iframe.id = video_id;
            iframe.className = 'vimeo-video gvideo';

            if (this.settings.autoplayVideos) {
                iframe.className += ' wait-autoplay';
            }

            injectVideoApi(this.settings.vimeo.api, function () {
                var player = new Vimeo.Player(iframe);
                videoPlayers[video_id] = player;
                slideMedia.appendChild(iframe);
            });
        }

        // Set youtube videos
        if (source == 'youtube') {
            var youtube_params = extend(this.settings.youtube.params, {
                playerapiid: video_id
            });
            var yparams = parseUrlParams(youtube_params);
            var youtube_id = getYoutubeID(url);
            var _video_url = protocol + '://www.youtube.com/embed/' + youtube_id + '?' + yparams;
            var _iframe = createIframe(_video_url, this.settings.videosWidth, this.settings.videosHeight, callback);
            _iframe.id = video_id;
            _iframe.className = 'youtube-video gvideo';

            if (this.settings.autoplayVideos) {
                _iframe.className += ' wait-autoplay';
            }

            injectVideoApi(this.settings.youtube.api, function () {
                if (!utils.isNil(YT) && YT.loaded) {
                    var player = new YT.Player(_iframe);
                    videoPlayers[video_id] = player;
                } else {
                    YTTemp.push(_iframe);
                }
                slideMedia.appendChild(_iframe);
            });
        }

        if (source == 'local') {
            var _html = '<video id="' + video_id + '" ';
            _html += 'style="background:#000; width: ' + this.settings.width + 'px; height: ' + this.settings.height + 'px;" ';
            _html += 'preload="metadata" ';
            _html += 'x-webkit-airplay="allow" ';
            _html += 'webkit-playsinline="" ';
            _html += 'controls ';
            _html += 'class="gvideo">';

            var format = url.toLowerCase().split('.').pop();
            var sources = { 'mp4': '', 'ogg': '', 'webm': '' };
            sources[format] = url;

            for (var key in sources) {
                if (sources.hasOwnProperty(key)) {
                    var videoFile = sources[key];
                    if (data.hasOwnProperty(key)) {
                        videoFile = data[key];
                    }
                    if (videoFile !== '') {
                        _html += '<source src="' + videoFile + '" type="video/' + key + '">';
                    }
                }
            }

            _html += '</video>';

            var video = createHTML(_html);
            slideMedia.appendChild(video);

            var vnode = document.getElementById(video_id);
            if (this.settings.jwplayer !== null && this.settings.jwplayer.api !== null) {
                var jwplayerConfig = this.settings.jwplayer;
                var jwplayerApi = this.settings.jwplayer.api;

                if (!jwplayerApi) {
                    console.warn('Missing jwplayer api file');
                    if (utils.isFunction(callback)) callback();
                    return false;
                }

                injectVideoApi(jwplayerApi, function () {
                    var jwconfig = extend(_this2.settings.jwplayer.params, {
                        width: _this2.settings.width + 'px',
                        height: _this2.settings.height + 'px',
                        file: url
                    });

                    jwplayer.key = _this2.settings.jwplayer.licenseKey;

                    var player = jwplayer(video_id);

                    player.setup(jwconfig);

                    videoPlayers[video_id] = player;
                    player.on('ready', function () {
                        vnode = slideMedia.querySelector('.jw-video');
                        addClass(vnode, 'gvideo');
                        vnode.id = video_id;
                        if (utils.isFunction(callback)) callback();
                    });
                });
            } else {
                addClass(vnode, 'html5-video');
                videoPlayers[video_id] = vnode;
                if (utils.isFunction(callback)) callback();
            }
        }
    }

    /**
     * Create an iframe element
     *
     * @param {string} url
     * @param {numeric} width
     * @param {numeric} height
     * @param {function} callback
     */
    function createIframe(url, width, height, callback) {
        var iframe = document.createElement('iframe');
        var winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        iframe.className = 'vimeo-video gvideo';
        iframe.src = url;
        if (isMobile && winWidth < 767) {
            iframe.style.height = '';
        } else {
            iframe.style.height = height + 'px';
        }
        iframe.style.width = width + 'px';
        iframe.setAttribute('allowFullScreen', '');
        iframe.onload = function () {
            addClass(iframe, 'iframe-ready');
            if (utils.isFunction(callback)) {
                callback();
            }
        };
        return iframe;
    }

    /**
     * Get youtube ID
     *
     * @param {string} url
     * @returns {string} video id
     */
    function getYoutubeID(url) {
        var videoID = '';
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
     * used for youtube, vimeo and jwplayer
     *
     * @param {string} url
     * @param {function} callback
     */
    function injectVideoApi(url, callback) {
        if (utils.isNil(url)) {
            console.error('Inject videos api error');
            return;
        }
        var found = document.querySelectorAll('script[src="' + url + '"]');
        if (utils.isNil(found) || found.length == 0) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            script.onload = function () {
                callback();
            };
            document.body.appendChild(script);
            return false;
        }
        callback();
    }

    /**
     * Handle youtube Api
     * This is a simple fix, when the video
     * is ready sometimes the youtube api is still
     * loading so we can not autoplay or pause
     * we need to listen onYouTubeIframeAPIReady and
     * register the videos if required
     */
    function youtubeApiHandle() {
        for (var i = 0; i < YTTemp.length; i++) {
            var iframe = YTTemp[i];
            var player = new YT.Player(iframe);
            videoPlayers[iframe.id] = player;
        }
    }
    if (typeof window.onYouTubeIframeAPIReady !== 'undefined') {
        window.onYouTubeIframeAPIReady = function () {
            window.onYouTubeIframeAPIReady();
            youtubeApiHandle();
        };
    } else {
        window.onYouTubeIframeAPIReady = youtubeApiHandle;
    }

    /**
     * Parse url params
     * convert an object in to a
     * url query string parameters
     *
     * @param {object} params
     */
    function parseUrlParams(params) {
        var qs = '';
        var i = 0;
        each(params, function (val, key) {
            if (i > 0) {
                qs += '&amp;';
            }
            qs += key + '=' + val;
            i += 1;
        });
        return qs;
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
        var slideMedia = slide.querySelector('.gslide-media');
        var div = document.getElementById(data.inlined.replace('#', ''));
        if (div) {
            var cloned = div.cloneNode(true);
            cloned.style.height = this.settings.height + 'px';
            cloned.style.maxWidth = this.settings.width + 'px';
            addClass(cloned, 'ginlined-content');
            slideMedia.appendChild(cloned);

            if (utils.isFunction(callback)) {
                callback();
            }
            return;
        }
    }

    /**
     * Get source type
     * gte the source type of a url
     *
     * @param {string} url
     */
    var getSourceType = function getSourceType(url) {
        var origin = url;
        url = url.toLowerCase();
        var data = {};
        if (url.match(/\.(jpeg|jpg|gif|png)$/) !== null) {
            data.sourcetype = 'image';
            return data;
        }
        if (url.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/)) {
            data.sourcetype = 'video';
            data.source = 'youtube';
            return data;
        }
        if (url.match(/vimeo\.com\/([0-9]*)/)) {
            data.sourcetype = 'video';
            data.source = 'vimeo';
            return data;
        }
        if (url.match(/\.(mp4|ogg|webm)$/) !== null) {
            data.sourcetype = 'video';
            data.source = 'local';
            return data;
        }

        // Check if inline content
        if (url.indexOf("#") > -1) {
            var hash = origin.split('#').pop();
            if (hash.trim() !== '') {
                data.sourcetype = 'inline';
                data.source = url;
                data.inlined = '#' + hash;
                return data;
            }
        }
        // Ajax
        if (url.includes("gajax=true")) {
            data.sourcetype = 'ajax';
            data.source = url;
        }

        // Any other url
        data.sourcetype = 'external';
        data.source = url;
        return data;
    };

    /**
     * Desktop keyboard navigation
     */
    function keyboardNavigation() {
        var _this3 = this;

        this.events['keyboard'] = addEvent('keydown', {
            onElement: window,
            withCallback: function withCallback(event, target) {
                event = event || window.event;
                var key = event.keyCode;
                if (key == 39) _this3.nextSlide();
                if (key == 37) _this3.prevSlide();
                if (key == 27) _this3.close();
            }
        });
    }

    /**
     * Touch navigation
     */
    function touchNavigation() {
        var _this4 = this;

        var index = void 0,
            hDistance = void 0,
            vDistance = void 0,
            hDistanceLast = void 0,
            vDistanceLast = void 0,
            hDistancePercent = void 0,
            vSwipe = false,
            hSwipe = false,
            hSwipMinDistance = 0,
            vSwipMinDistance = 0,
            doingPinch = false,
            pinchBigger = false,
            startCoords = {},
            endCoords = {},
            slider = this.slidesContainer,
            activeSlide = null,
            xDown = 0,
            yDown = 0,
            activeSlideImage = null,
            activeSlideMedia = null,
            activeSlideDesc = null;

        var winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        this.events['doctouchmove'] = addEvent('touchmove', {
            onElement: document,
            withCallback: function withCallback(e, target) {
                if (hasClass(body, 'gdesc-open')) {
                    e.preventDefault();
                    return false;
                }
            }
        });

        this.events['touchStart'] = addEvent('touchstart', {
            onElement: body,
            withCallback: function withCallback(e, target) {
                if (hasClass(body, 'gdesc-open')) {
                    return;
                }
                addClass(body, 'touching');
                activeSlide = _this4.getActiveSlide();
                activeSlideImage = activeSlide.querySelector('.gslide-image');
                activeSlideMedia = activeSlide.querySelector('.gslide-media');
                activeSlideDesc = activeSlide.querySelector('.gslide-description');

                /*if (e.targetTouches[0].target.className.indexOf('gslide-video') !== -1) {
                    playVideo(e.targetTouches[0])
                }*/

                index = _this4.index;
                endCoords = e.targetTouches[0];
                startCoords.pageX = e.targetTouches[0].pageX;
                startCoords.pageY = e.targetTouches[0].pageY;
                xDown = e.targetTouches[0].clientX;
                yDown = e.targetTouches[0].clientY;
            }
        });

        /*function playVideo(e) {
            addClass(e.target, 'playing')
            let element = e.target
            let iframe = element.querySelector('.gvideo')
            var e = document.createEvent('TouchEvent');
            e.initEvent('touchstart', true, true);
            iframe.dispatchEvent(e);
        }*/

        this.events['gestureStart'] = addEvent('gesturestart', {
            onElement: body,
            withCallback: function withCallback(e, target) {
                if (activeSlideImage) {
                    e.preventDefault();
                    doingPinch = true;
                }
            }
        });

        this.events['gestureChange'] = addEvent('gesturechange', {
            onElement: body,
            withCallback: function withCallback(e, target) {
                e.preventDefault();
                slideCSSTransform(activeSlideImage, 'scale(' + e.scale + ')');
            }
        });

        this.events['gesturEend'] = addEvent('gestureend', {
            onElement: body,
            withCallback: function withCallback(e, target) {
                doingPinch = false;
                if (e.scale < 1) {
                    pinchBigger = false;
                    slideCSSTransform(activeSlideImage, 'scale(1)');
                } else {
                    pinchBigger = true;
                }
            }
        });

        this.events['touchMove'] = addEvent('touchmove', {
            onElement: body,
            withCallback: function withCallback(e, target) {
                if (!hasClass(body, 'touching')) {
                    return;
                }
                if (hasClass(body, 'gdesc-open') || doingPinch || pinchBigger) {
                    return;
                }
                e.preventDefault();
                endCoords = e.targetTouches[0];
                var slideHeight = activeSlide.querySelector('.gslide-inner-content').offsetHeight;
                var slideWidth = activeSlide.querySelector('.gslide-inner-content').offsetWidth;

                var xUp = e.targetTouches[0].clientX;
                var yUp = e.targetTouches[0].clientY;
                var xDiff = xDown - xUp;
                var yDiff = yDown - yUp;

                if (Math.abs(xDiff) > Math.abs(yDiff)) {
                    /*most significant*/
                    vSwipe = false;
                    hSwipe = true;
                } else {
                    hSwipe = false;
                    vSwipe = true;
                }

                if (vSwipe) {
                    vDistanceLast = vDistance;
                    vDistance = endCoords.pageY - startCoords.pageY;
                    if (Math.abs(vDistance) >= vSwipMinDistance || vSwipe) {
                        var opacity = 0.75 - Math.abs(vDistance) / slideHeight;
                        activeSlideMedia.style.opacity = opacity;
                        if (activeSlideDesc) {
                            activeSlideDesc.style.opacity = opacity;
                        }
                        slideCSSTransform(activeSlideMedia, 'translate3d(0, ' + vDistance + 'px, 0)');
                    }
                    return;
                }

                hDistanceLast = hDistance;
                hDistance = endCoords.pageX - startCoords.pageX;
                hDistancePercent = hDistance * 100 / winWidth;

                if (hSwipe) {
                    if (_this4.index + 1 == _this4.elements.length && hDistance < -60) {
                        resetSlideMove(activeSlide);
                        return false;
                    }
                    if (_this4.index - 1 < 0 && hDistance > 60) {
                        resetSlideMove(activeSlide);
                        return false;
                    }

                    var _opacity = 0.75 - Math.abs(hDistance) / slideWidth;
                    activeSlideMedia.style.opacity = _opacity;
                    if (activeSlideDesc) {
                        activeSlideDesc.style.opacity = _opacity;
                    }
                    slideCSSTransform(activeSlideMedia, 'translate3d(' + hDistancePercent + '%, 0, 0)');
                }
            }
        });

        this.events['touchEnd'] = addEvent('touchend', {
            onElement: body,
            withCallback: function withCallback(e, target) {
                vDistance = endCoords.pageY - startCoords.pageY;
                hDistance = endCoords.pageX - startCoords.pageX;
                hDistancePercent = hDistance * 100 / winWidth;

                removeClass(body, 'touching');

                var slideHeight = activeSlide.querySelector('.gslide-inner-content').offsetHeight;
                var slideWidth = activeSlide.querySelector('.gslide-inner-content').offsetWidth;

                // Swipe to top/bottom to close
                if (vSwipe) {
                    var onEnd = slideHeight / 2;
                    vSwipe = false;
                    if (Math.abs(vDistance) >= onEnd) {
                        _this4.close();
                        return;
                    }
                    resetSlideMove(activeSlide);
                    return;
                }

                if (hSwipe) {
                    hSwipe = false;
                    var where = 'prev';
                    var asideExist = true;
                    if (hDistance < 0) {
                        where = 'next';
                        hDistance = Math.abs(hDistance);
                    }
                    if (where == 'prev' && _this4.index - 1 < 0) {
                        asideExist = false;
                    }
                    if (where == 'next' && _this4.index + 1 >= _this4.elements.length) {
                        asideExist = false;
                    }
                    if (asideExist && hDistance >= slideWidth / 2 - 90) {
                        if (where == 'next') {
                            _this4.nextSlide();
                        } else {
                            _this4.prevSlide();
                        }
                        return;
                    }
                    resetSlideMove(activeSlide);
                }
            }
        });
    }

    function slideCSSTransform(slide) {
        var translate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

        if (translate == '') {
            slide.style.webkitTransform = '';
            slide.style.MozTransform = '';
            slide.style.msTransform = '';
            slide.style.OTransform = '';
            slide.style.transform = '';
            return false;
        }
        slide.style.webkitTransform = translate;
        slide.style.MozTransform = translate;
        slide.style.msTransform = translate;
        slide.style.OTransform = translate;
        slide.style.transform = translate;
    }

    function resetSlideMove(slide) {
        var media = slide.querySelector('.gslide-media');
        var desc = slide.querySelector('.gslide-description');

        addClass(media, 'greset');
        slideCSSTransform(media, 'translate3d(0, 0, 0)');
        var animation = addEvent(transitionEnd, {
            onElement: media,
            once: true,
            withCallback: function withCallback(event, target) {
                removeClass(media, 'greset');
            }
        });

        media.style.opacity = '';
        if (desc) {
            desc.style.opacity = '';
        }
    }

    function slideShortDesc(string) {
        var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
        var wordBoundary = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var useWordBoundary = wordBoundary;
        string = string.trim();
        if (string.length <= n) {
            return string;
        }
        var subString = string.substr(0, n - 1);
        if (!useWordBoundary) {
            return subString;
        }
        return subString + '... <a href="#" class="desc-more">' + wordBoundary + '</a>';
    }

    function slideDescriptionEvents(desc, data) {
        var moreLink = desc.querySelector('.desc-more');
        if (!moreLink) {
            return false;
        }

        addEvent('click', {
            onElement: moreLink,
            withCallback: function withCallback(event, target) {
                event.preventDefault();
                var desc = getClosest(target, '.gslide-desc');
                if (!desc) {
                    return false;
                }

                desc.innerHTML = data.description;
                addClass(body, 'gdesc-open');

                var shortEvent = addEvent('click', {
                    onElement: [body, getClosest(desc, '.gslide-description')],
                    withCallback: function withCallback(event, target) {
                        if (event.target.nodeName.toLowerCase() !== 'a') {
                            removeClass(body, 'gdesc-open');
                            addClass(body, 'gdesc-closed');
                            desc.innerHTML = data.smallDescription;
                            slideDescriptionEvents(desc, data);

                            setTimeout(function () {
                                removeClass(body, 'gdesc-closed');
                            }, 400);
                            shortEvent.destroy();
                        }
                    }
                });
            }
        });
    }

    /**
     * GLightbox Class
     * Class and public methods
     */

    var GlightboxInit = function () {
        function GlightboxInit(options) {
            _classCallCheck(this, GlightboxInit);

            this.settings = extend(defaults, options || {});
            this.effectsClasses = this.getAnimationClasses();
        }

        _createClass(GlightboxInit, [{
            key: 'init',
            value: function init() {
                var _this5 = this;

                this.baseEvents = addEvent('click', {
                    onElement: '.' + this.settings.selector,
                    withCallback: function withCallback(e, target) {
                        e.preventDefault();
                        _this5.open(target);
                    }
                });
            }
        }, {
            key: 'open',
            value: function open() {
                var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

                this.elements = this.getElements(element);
                if (this.elements.length == 0) return false;

                this.activeSlide = null;
                this.prevActiveSlideIndex = null;
                this.prevActiveSlide = null;
                var index = this.settings.startAt;
                if (element) {
                    // if element passed, get the index
                    index = this.elements.indexOf(element);
                    if (index < 0) {
                        index = 0;
                    }
                }

                this.build();
                animateElement(this.overlay, this.settings.cssEfects.fade.in);

                var bodyWidth = body.offsetWidth;
                body.style.width = bodyWidth + 'px';

                addClass(body, 'glightbox-open');
                addClass(html, 'glightbox-open');
                if (isMobile) {
                    addClass(html, 'glightbox-mobile');
                    this.settings.slideEffect = 'slide';
                }

                this.showSlide(index, true);

                if (this.elements.length == 1) {
                    hide(this.prevButton);
                    hide(this.nextButton);
                } else {
                    show(this.prevButton);
                    show(this.nextButton);
                }
                this.lightboxOpen = true;

                if (utils.isFunction(this.settings.onOpen)) {
                    this.settings.onOpen();
                }

                if (isMobile && isTouch) {
                    touchNavigation.apply(this);
                    return false;
                }
                keyboardNavigation.apply(this);
            }
        }, {
            key: 'showSlide',
            value: function showSlide() {
                var _this6 = this;

                var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                var first = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

                show(this.loader);
                this.index = index;

                var current = this.slidesContainer.querySelector('.current');
                if (current) {
                    removeClass(current, 'current');
                }

                // hide prev slide
                this.slideAnimateOut();

                var slide = this.slidesContainer.querySelectorAll('.gslide')[index];
                show(this.slidesContainer);

                // Check if slide's content is alreay loaded
                if (hasClass(slide, 'loaded')) {
                    this.slideAnimateIn(slide, first);
                    hide(this.loader);
                } else {
                    // If not loaded add the slide content
                    show(this.loader);
                    var slide_data = getSlideData(this.elements[index]);
                    slide_data.index = index;
                    setSlideContent.apply(this, [slide, slide_data, function () {
                        hide(_this6.loader);
                        _this6.slideAnimateIn(slide, first);
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
        }, {
            key: 'preloadSlide',
            value: function preloadSlide(index) {
                var _this7 = this;

                // Verify slide index, it can not be lower than 0
                // and it can not be greater than the total elements
                if (index < 0 || index > this.elements.length) return false;

                if (utils.isNil(this.elements[index])) return false;

                var slide = this.slidesContainer.querySelectorAll('.gslide')[index];
                if (hasClass(slide, 'loaded')) {
                    return false;
                }

                var slide_data = getSlideData(this.elements[index]);
                slide_data.index = index;
                var type = slide_data.sourcetype;
                if (type == 'video' || type == 'external') {
                    setTimeout(function () {
                        setSlideContent.apply(_this7, [slide, slide_data]);
                    }, 200);
                } else {
                    setSlideContent.apply(this, [slide, slide_data]);
                }
            }
        }, {
            key: 'prevSlide',
            value: function prevSlide() {
                var prev = this.index - 1;
                if (prev < 0) {
                    return false;
                }
                this.goToSlide(prev);
            }
        }, {
            key: 'nextSlide',
            value: function nextSlide() {
                var next = this.index + 1;
                if (next > this.elements.length) return false;

                this.goToSlide(next);
            }
        }, {
            key: 'goToSlide',
            value: function goToSlide() {
                var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

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
        }, {
            key: 'slideAnimateIn',
            value: function slideAnimateIn(slide, first) {
                var _this8 = this;

                var slideMedia = slide.querySelector('.gslide-media');
                var slideDesc = slide.querySelector('.gslide-description');
                var prevData = {
                    index: this.prevActiveSlideIndex,
                    slide: this.prevActiveSlide
                };
                var nextData = {
                    index: this.index,
                    slide: this.activeSlide
                };
                if (slideMedia.offsetWidth > 0 && slideDesc) {
                    hide(slideDesc);
                    slide.querySelector('.ginner-container').style.maxWidth = slideMedia.offsetWidth + 'px';
                    slideDesc.style.display = '';
                }
                removeClass(slide, this.effectsClasses);
                if (first) {
                    animateElement(slide, this.settings.openEffect, function () {
                        if (!isMobile && _this8.settings.autoplayVideos) {
                            _this8.playSlideVideo(slide);
                        }
                        if (utils.isFunction(_this8.settings.afterSlideChange)) {
                            _this8.settings.afterSlideChange.apply(_this8, [prevData, nextData]);
                        }
                    });
                } else {
                    var effect_name = this.settings.slideEffect;
                    var animIn = this.settings.cssEfects[effect_name].in;
                    if (this.prevActiveSlideIndex > this.index) {
                        if (this.settings.slideEffect == 'slide') {
                            animIn = this.settings.cssEfects.slide_back.in;
                        }
                    }
                    animateElement(slide, animIn, function () {
                        if (!isMobile && _this8.settings.autoplayVideos) {
                            _this8.playSlideVideo(slide);
                        }
                        if (utils.isFunction(_this8.settings.afterSlideChange)) {
                            _this8.settings.afterSlideChange.apply(_this8, [prevData, nextData]);
                        }
                    });
                }
                addClass(slide, 'current');
            }
        }, {
            key: 'slideAnimateOut',
            value: function slideAnimateOut() {
                if (!this.prevActiveSlide) {
                    return false;
                }

                var prevSlide = this.prevActiveSlide;
                removeClass(prevSlide, this.effectsClasses);
                addClass(prevSlide, 'prev');

                var animation = this.settings.slideEffect;
                var animOut = this.settings.cssEfects[animation].out;

                this.stopSlideVideo(prevSlide);
                if (utils.isFunction(this.settings.beforeSlideChange)) {
                    this.settings.beforeSlideChange.apply(this, [{
                        index: this.prevActiveSlideIndex,
                        slide: this.prevActiveSlide
                    }, {
                        index: this.index,
                        slide: this.activeSlide
                    }]);
                }
                if (this.prevActiveSlideIndex > this.index && this.settings.slideEffect == 'slide') {
                    // going back
                    animOut = this.settings.cssEfects.slide_back.out;
                }
                animateElement(prevSlide, animOut, function () {
                    var media = prevSlide.querySelector('.gslide-media');
                    var desc = prevSlide.querySelector('.gslide-description');

                    media.style.transform = '';
                    removeClass(media, 'greset');
                    media.style.opacity = '';
                    if (desc) {
                        desc.style.opacity = '';
                    }
                    removeClass(prevSlide, 'prev');
                });
            }
        }, {
            key: 'stopSlideVideo',
            value: function stopSlideVideo(slide) {
                if (utils.isNumber(slide)) {
                    slide = this.slidesContainer.querySelectorAll('.gslide')[slide];
                }

                var slideVideo = slide.querySelector('.gvideo');
                if (!slideVideo) {
                    return false;
                }

                var videoID = slideVideo.id;
                if (videoPlayers && videoPlayers.hasOwnProperty(videoID)) {
                    var player = videoPlayers[videoID];
                    if (hasClass(slideVideo, 'vimeo-video')) {
                        player.pause();
                    }
                    if (hasClass(slideVideo, 'youtube-video')) {
                        player.pauseVideo();
                    }
                    if (hasClass(slideVideo, 'jw-video')) {
                        player.pause(true);
                    }
                    if (hasClass(slideVideo, 'html5-video')) {
                        player.pause();
                    }
                }
            }
        }, {
            key: 'playSlideVideo',
            value: function playSlideVideo(slide) {
                if (utils.isNumber(slide)) {
                    slide = this.slidesContainer.querySelectorAll('.gslide')[slide];
                }
                var slideVideo = slide.querySelector('.gvideo');
                if (!slideVideo) {
                    return false;
                }
                var videoID = slideVideo.id;
                if (videoPlayers && videoPlayers.hasOwnProperty(videoID)) {
                    var player = videoPlayers[videoID];
                    if (hasClass(slideVideo, 'vimeo-video')) {
                        player.play();
                    }
                    if (hasClass(slideVideo, 'youtube-video')) {
                        player.playVideo();
                    }
                    if (hasClass(slideVideo, 'jw-video')) {
                        player.play();
                    }
                    if (hasClass(slideVideo, 'html5-video')) {
                        player.play();
                    }
                    setTimeout(function () {
                        removeClass(slideVideo, 'wait-autoplay');
                    }, 300);
                    return false;
                }
            }
        }, {
            key: 'getElements',
            value: function getElements() {
                var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

                this.elements = [];

                if (!utils.isNil(this.settings.elements) && utils.isArray(this.settings.elements)) {
                    return this.settings.elements;
                }

                var nodes = false;
                if (element !== null) {
                    var relVal = void 0,
                        _nodes = void 0;
                    var gallery = element.getAttribute('data-gallery');
                    if (gallery && gallery !== '') {
                        _nodes = document.querySelectorAll('[data-gallery="' + relVal + '"]');
                    }
                }
                if (nodes == false) {
                    nodes = document.querySelectorAll('.' + this.settings.selector);
                }
                nodes = Array.prototype.slice.call(nodes);
                return nodes;
            }
        }, {
            key: 'getActiveSlide',
            value: function getActiveSlide() {
                return this.slidesContainer.querySelectorAll('.gslide')[this.index];
            }
        }, {
            key: 'getActiveSlideIndex',
            value: function getActiveSlideIndex() {
                return this.index;
            }
        }, {
            key: 'getAnimationClasses',
            value: function getAnimationClasses() {
                var effects = [];
                for (var key in this.settings.cssEfects) {
                    if (this.settings.cssEfects.hasOwnProperty(key)) {
                        var effect = this.settings.cssEfects[key];
                        effects.push('g' + effect.in);
                        effects.push('g' + effect.out);
                    }
                }
                return effects.join(' ');
            }
        }, {
            key: 'build',
            value: function build() {
                var _this9 = this;

                var content, contentHolder, docFrag;
                var lightbox_html = createHTML(this.settings.lightboxHtml);
                document.body.appendChild(lightbox_html);

                var modal = document.getElementById('glightbox-body');
                this.modal = modal;
                var closeButton = modal.querySelector('.gclose');
                this.prevButton = modal.querySelector('.gprev');
                this.nextButton = modal.querySelector('.gnext');
                this.overlay = modal.querySelector('.goverlay');
                this.loader = modal.querySelector('.gloader');
                this.slidesContainer = document.getElementById('glightbox-slider');
                this.events = {};

                addClass(this.modal, 'glightbox-' + this.settings.skin);

                if (this.settings.closeButton && closeButton) {
                    this.events['close'] = addEvent('click', {
                        onElement: closeButton,
                        withCallback: function withCallback(e, target) {
                            e.preventDefault();
                            _this9.close();
                        }
                    });
                }

                if (this.nextButton) {
                    this.events['next'] = addEvent('click', {
                        onElement: this.nextButton,
                        withCallback: function withCallback(e, target) {
                            e.preventDefault();
                            _this9.nextSlide();
                        }
                    });
                }

                if (this.prevButton) {
                    this.events['prev'] = addEvent('click', {
                        onElement: this.prevButton,
                        withCallback: function withCallback(e, target) {
                            e.preventDefault();
                            _this9.prevSlide();
                        }
                    });
                }
                each(this.elements, function () {
                    var slide = createHTML(_this9.settings.slideHtml);
                    _this9.slidesContainer.appendChild(slide);
                });
                if (isTouch) {
                    addClass(html, 'glightbox-touch');
                }
            }
        }, {
            key: 'close',
            value: function close() {
                var _this10 = this;

                this.stopSlideVideo(this.activeSlide);
                addClass(this.modal, 'glightbox-closing');
                animateElement(this.overlay, this.settings.cssEfects.fade.out);
                animateElement(this.activeSlide, this.settings.cssEfects.zoom.out, function () {
                    _this10.activeSlide = null;
                    _this10.prevActiveSlideIndex = null;
                    _this10.prevActiveSlide = null;

                    if (_this10.events) {
                        for (var key in _this10.events) {
                            if (_this10.events.hasOwnProperty(key)) {
                                _this10.events[key].destroy();
                            }
                        }
                    }

                    removeClass(body, 'glightbox-open');
                    removeClass(html, 'glightbox-open');
                    removeClass(body, 'touching');
                    removeClass(body, 'gdesc-open');
                    body.style.width = '';
                    _this10.modal.parentNode.removeChild(_this10.modal);
                    if (utils.isFunction(_this10.settings.onClose)) {
                        _this10.settings.onClose();
                    }
                });
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.close();
                this.baseEvents.destroy();
            }
        }]);

        return GlightboxInit;
    }();

    module.exports = function () {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var instance = new GlightboxInit(options);
        return instance.init();
    };
});