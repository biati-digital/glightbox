const uid = Date.now();

/**
 * Merge two or more objects
 */
export function extend() {
    let extended = {};
    let deep = true;
    let i = 0;
    let length = arguments.length;
    if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
        deep = arguments[0];
        i++;
    }
    let merge = (obj) => {
        for (let prop in obj) {
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
        let obj = arguments[i];
        merge(obj);
    }
    return extended;
}

/**
 * Each
 *
 * @param {mixed} node list, array, object
 * @param {function} callback
 */
export function each(collection, callback) {
    if (isNode(collection) || collection === window || collection === document) {
        collection = [collection];
    }
    if (!isArrayLike(collection) && !isObject(collection)) {
        collection = [collection];
    }
    if (size(collection) == 0) {
        return;
    }

    if (isArrayLike(collection) && !isObject(collection)) {
        let l = collection.length,
            i = 0;
        for (; i < l; i++) {
            if (callback.call(collection[i], collection[i], i, collection) === false) {
                break;
            }
        }
    } else if (isObject(collection)) {
        for (let key in collection) {
            if (has(collection, key)) {
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
export function getNodeEvents(node, name = null, fn = null) {
    const cache = (node[uid] = node[uid] || []);
    const data = { all: cache, evt: null, found: null };
    if (name && fn && size(cache) > 0) {
        each(cache, (cl, i) => {
            if (cl.eventName == name && cl.fn.toString() == fn.toString()) {
                data.found = true;
                data.evt = i;
                return false;
            }
        });
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
export function addEvent(eventName, { onElement, withCallback, avoidDuplicate = true, once = false, useCapture = false } = {}, thisArg) {
    let element = onElement || [];
    if (isString(element)) {
        element = document.querySelectorAll(element);
    }

    function handler(event) {
        if (isFunction(withCallback)) {
            withCallback.call(thisArg, event, this);
        }
        if (once) {
            handler.destroy();
        }
    }
    handler.destroy = function () {
        each(element, (el) => {
            const events = getNodeEvents(el, eventName, handler);
            if (events.found) {
                events.all.splice(events.evt, 1);
            }
            if (el.removeEventListener) {
                el.removeEventListener(eventName, handler, useCapture);
            }
        });
    };
    each(element, (el) => {
        const events = getNodeEvents(el, eventName, handler);
        if ((el.addEventListener && avoidDuplicate && !events.found) || !avoidDuplicate) {
            el.addEventListener(eventName, handler, useCapture);
            events.all.push({ eventName: eventName, fn: handler });
        }
    });
    return handler;
}

/**
 * Add element class
 *
 * @param {node} element
 * @param {string} class name
 */
export function addClass(node, name) {
    each(name.split(' '), (cl) => node.classList.add(cl));
}

/**
 * Remove element class
 *
 * @param {node} element
 * @param {string} class name
 */
export function removeClass(node, name) {
    each(name.split(' '), (cl) => node.classList.remove(cl));
}

/**
 * Has class
 *
 * @param {node} element
 * @param {string} class name
 */
export function hasClass(node, name) {
    return node.classList.contains(name);
}

/**
 * Get the closestElement
 *
 * @param {node} element
 * @param {string} class name
 */
export function closest(elem, selector) {
    while (elem !== document.body) {
        elem = elem.parentElement;
        if (!elem) {
            return false;
        }
        const matches = typeof elem.matches == 'function' ? elem.matches(selector) : elem.msMatchesSelector(selector);

        if (matches) {
            return elem;
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
export function animateElement(element, animation = '', callback = false) {
    if (!element || animation === '') {
        return false;
    }
    if (animation === 'none') {
        if (isFunction(callback)) {
            callback();
        }
        return false;
    }
    const animationEnd = whichAnimationEvent();
    const animationNames = animation.split(' ');
    each(animationNames, (name) => {
        addClass(element, 'g' + name);
    });
    addEvent(animationEnd, {
        onElement: element,
        avoidDuplicate: false,
        once: true,
        withCallback: (event, target) => {
            each(animationNames, (name) => {
                removeClass(target, 'g' + name);
            });
            if (isFunction(callback)) {
                callback();
            }
        }
    });
}

export function cssTransform(node, translate = '') {
    if (translate === '') {
        node.style.webkitTransform = '';
        node.style.MozTransform = '';
        node.style.msTransform = '';
        node.style.OTransform = '';
        node.style.transform = '';
        return false;
    }
    node.style.webkitTransform = translate;
    node.style.MozTransform = translate;
    node.style.msTransform = translate;
    node.style.OTransform = translate;
    node.style.transform = translate;
}

/**
 * Show element
 *
 * @param {node} element
 */
export function show(element) {
    element.style.display = 'block';
}

/**
 * Hide element
 */
export function hide(element) {
    element.style.display = 'none';
}

/**
 * Create a document fragment
 *
 * @param {string} html code
 */
export function createHTML(htmlStr) {
    let frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}

/**
 * Return screen size
 * return the current screen dimensions
 *
 * @returns {object}
 */
export function windowSize() {
    return {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    };
}

/**
 * Determine animation events
 */
export function whichAnimationEvent() {
    let t,
        el = document.createElement('fakeelement');
    let animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'animationend',
        WebkitAnimation: 'webkitAnimationEnd'
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
export function whichTransitionEvent() {
    let t,
        el = document.createElement('fakeelement');

    const transitions = {
        transition: 'transitionend',
        OTransition: 'oTransitionEnd',
        MozTransition: 'transitionend',
        WebkitTransition: 'webkitTransitionEnd'
    };

    for (t in transitions) {
        if (el.style[t] !== undefined) {
            return transitions[t];
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
export function createIframe(config) {
    let { url, allow, callback, appendTo } = config;
    let iframe = document.createElement('iframe');
    iframe.className = 'vimeo-video gvideo';
    iframe.src = url;
    iframe.style.width = '100%';
    iframe.style.height = '100%';

    if (allow) {
        iframe.setAttribute('allow', allow);
    }
    iframe.onload = function () {
        iframe.onload = null;
        addClass(iframe, 'node-ready');
        if (isFunction(callback)) {
            callback();
        }
    };

    if (appendTo) {
        appendTo.appendChild(iframe);
    }
    return iframe;
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
export function waitUntil(check, onComplete, delay, timeout) {
    if (check()) {
        onComplete();
        return;
    }

    if (!delay) {
        delay = 100;
    }
    let timeoutPointer;
    let intervalPointer = setInterval(() => {
        if (!check()) {
            return;
        }
        clearInterval(intervalPointer);
        if (timeoutPointer) {
            clearTimeout(timeoutPointer);
        }
        onComplete();
    }, delay);
    if (timeout) {
        timeoutPointer = setTimeout(() => {
            clearInterval(intervalPointer);
        }, timeout);
    }
}

/**
 * Inject videos api
 * used for video player
 *
 * @param {string} url
 * @param {function} callback
 */
export function injectAssets(url, waitFor, callback) {
    if (isNil(url)) {
        console.error('Inject assets error');
        return;
    }
    if (isFunction(waitFor)) {
        callback = waitFor;
        waitFor = false;
    }

    if (isString(waitFor) && waitFor in window) {
        if (isFunction(callback)) {
            callback();
        }
        return;
    }

    let found;

    if (url.indexOf('.css') !== -1) {
        found = document.querySelectorAll('link[href="' + url + '"]');
        if (found && found.length > 0) {
            if (isFunction(callback)) {
                callback();
            }
            return;
        }

        const head = document.getElementsByTagName('head')[0];
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
        if (isFunction(callback)) {
            callback();
        }
        return;
    }

    found = document.querySelectorAll('script[src="' + url + '"]');
    if (found && found.length > 0) {
        if (isFunction(callback)) {
            if (isString(waitFor)) {
                waitUntil(
                    () => {
                        return typeof window[waitFor] !== 'undefined';
                    },
                    () => {
                        callback();
                    }
                );
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
        if (isFunction(callback)) {
            if (isString(waitFor)) {
                waitUntil(
                    () => {
                        return typeof window[waitFor] !== 'undefined';
                    },
                    () => {
                        callback();
                    }
                );
                return false;
            }
            callback();
        }
    };
    document.body.appendChild(script);
}

export function isMobile() {
    return 'navigator' in window && window.navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i);
}

export function isTouch() {
    return isMobile() !== null || document.createTouch !== undefined || 'ontouchstart' in window || 'onmsgesturechange' in window || navigator.msMaxTouchPoints;
}

export function isFunction(f) {
    return typeof f === 'function';
}
export function isString(s) {
    return typeof s === 'string';
}
export function isNode(el) {
    return !!(el && el.nodeType && el.nodeType == 1);
}
export function isArray(ar) {
    return Array.isArray(ar);
}
export function isArrayLike(ar) {
    return ar && ar.length && isFinite(ar.length);
}
export function isObject(o) {
    let type = typeof o;
    return type === 'object' && o != null && !isFunction(o) && !isArray(o);
}
export function isNil(o) {
    return o == null;
}
export function has(obj, key) {
    return obj !== null && hasOwnProperty.call(obj, key);
}
export function size(o) {
    if (isObject(o)) {
        if (o.keys) {
            return o.keys().length;
        }
        let l = 0;
        for (let k in o) {
            if (has(o, k)) {
                l++;
            }
        }
        return l;
    } else {
        return o.length;
    }
}
export function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
