(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.GLightbox = factory());
}(this, function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function getLen(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  function dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  }

  function getAngle(v1, v2) {
    var mr = getLen(v1) * getLen(v2);
    if (mr === 0) return 0;
    var r = dot(v1, v2) / mr;
    if (r > 1) r = 1;
    return Math.acos(r);
  }

  function cross(v1, v2) {
    return v1.x * v2.y - v2.x * v1.y;
  }

  function getRotateAngle(v1, v2) {
    var angle = getAngle(v1, v2);

    if (cross(v1, v2) > 0) {
      angle *= -1;
    }

    return angle * 180 / Math.PI;
  }

  var EventsHandlerAdmin = function () {
    function EventsHandlerAdmin(el) {
      _classCallCheck(this, EventsHandlerAdmin);

      this.handlers = [];
      this.el = el;
    }

    _createClass(EventsHandlerAdmin, [{
      key: "add",
      value: function add(handler) {
        this.handlers.push(handler);
      }
    }, {
      key: "del",
      value: function del(handler) {
        if (!handler) this.handlers = [];

        for (var i = this.handlers.length; i >= 0; i--) {
          if (this.handlers[i] === handler) {
            this.handlers.splice(i, 1);
          }
        }
      }
    }, {
      key: "dispatch",
      value: function dispatch() {
        for (var i = 0, len = this.handlers.length; i < len; i++) {
          var handler = this.handlers[i];
          if (typeof handler === 'function') handler.apply(this.el, arguments);
        }
      }
    }]);

    return EventsHandlerAdmin;
  }();

  function wrapFunc(el, handler) {
    var EventshandlerAdmin = new EventsHandlerAdmin(el);
    EventshandlerAdmin.add(handler);
    return EventshandlerAdmin;
  }

  var TouchEvents = function () {
    function TouchEvents(el, option) {
      _classCallCheck(this, TouchEvents);

      this.element = typeof el == 'string' ? document.querySelector(el) : el;
      this.start = this.start.bind(this);
      this.move = this.move.bind(this);
      this.end = this.end.bind(this);
      this.cancel = this.cancel.bind(this);
      this.element.addEventListener("touchstart", this.start, false);
      this.element.addEventListener("touchmove", this.move, false);
      this.element.addEventListener("touchend", this.end, false);
      this.element.addEventListener("touchcancel", this.cancel, false);
      this.preV = {
        x: null,
        y: null
      };
      this.pinchStartLen = null;
      this.zoom = 1;
      this.isDoubleTap = false;

      var noop = function noop() {};

      this.rotate = wrapFunc(this.element, option.rotate || noop);
      this.touchStart = wrapFunc(this.element, option.touchStart || noop);
      this.multipointStart = wrapFunc(this.element, option.multipointStart || noop);
      this.multipointEnd = wrapFunc(this.element, option.multipointEnd || noop);
      this.pinch = wrapFunc(this.element, option.pinch || noop);
      this.swipe = wrapFunc(this.element, option.swipe || noop);
      this.tap = wrapFunc(this.element, option.tap || noop);
      this.doubleTap = wrapFunc(this.element, option.doubleTap || noop);
      this.longTap = wrapFunc(this.element, option.longTap || noop);
      this.singleTap = wrapFunc(this.element, option.singleTap || noop);
      this.pressMove = wrapFunc(this.element, option.pressMove || noop);
      this.twoFingerPressMove = wrapFunc(this.element, option.twoFingerPressMove || noop);
      this.touchMove = wrapFunc(this.element, option.touchMove || noop);
      this.touchEnd = wrapFunc(this.element, option.touchEnd || noop);
      this.touchCancel = wrapFunc(this.element, option.touchCancel || noop);
      this._cancelAllHandler = this.cancelAll.bind(this);
      window.addEventListener('scroll', this._cancelAllHandler);
      this.delta = null;
      this.last = null;
      this.now = null;
      this.tapTimeout = null;
      this.singleTapTimeout = null;
      this.longTapTimeout = null;
      this.swipeTimeout = null;
      this.x1 = this.x2 = this.y1 = this.y2 = null;
      this.preTapPosition = {
        x: null,
        y: null
      };
    }

    _createClass(TouchEvents, [{
      key: "start",
      value: function start(evt) {
        if (!evt.touches) return;
        this.now = Date.now();
        this.x1 = evt.touches[0].pageX;
        this.y1 = evt.touches[0].pageY;
        this.delta = this.now - (this.last || this.now);
        this.touchStart.dispatch(evt, this.element);

        if (this.preTapPosition.x !== null) {
          this.isDoubleTap = this.delta > 0 && this.delta <= 250 && Math.abs(this.preTapPosition.x - this.x1) < 30 && Math.abs(this.preTapPosition.y - this.y1) < 30;
          if (this.isDoubleTap) clearTimeout(this.singleTapTimeout);
        }

        this.preTapPosition.x = this.x1;
        this.preTapPosition.y = this.y1;
        this.last = this.now;
        var preV = this.preV,
            len = evt.touches.length;

        if (len > 1) {
          this._cancelLongTap();

          this._cancelSingleTap();

          var v = {
            x: evt.touches[1].pageX - this.x1,
            y: evt.touches[1].pageY - this.y1
          };
          preV.x = v.x;
          preV.y = v.y;
          this.pinchStartLen = getLen(preV);
          this.multipointStart.dispatch(evt, this.element);
        }

        this._preventTap = false;
        this.longTapTimeout = setTimeout(function () {
          this.longTap.dispatch(evt, this.element);
          this._preventTap = true;
        }.bind(this), 750);
      }
    }, {
      key: "move",
      value: function move(evt) {
        if (!evt.touches) return;
        var preV = this.preV,
            len = evt.touches.length,
            currentX = evt.touches[0].pageX,
            currentY = evt.touches[0].pageY;
        this.isDoubleTap = false;

        if (len > 1) {
          var sCurrentX = evt.touches[1].pageX,
              sCurrentY = evt.touches[1].pageY;
          var v = {
            x: evt.touches[1].pageX - currentX,
            y: evt.touches[1].pageY - currentY
          };

          if (preV.x !== null) {
            if (this.pinchStartLen > 0) {
              evt.zoom = getLen(v) / this.pinchStartLen;
              this.pinch.dispatch(evt, this.element);
            }

            evt.angle = getRotateAngle(v, preV);
            this.rotate.dispatch(evt, this.element);
          }

          preV.x = v.x;
          preV.y = v.y;

          if (this.x2 !== null && this.sx2 !== null) {
            evt.deltaX = (currentX - this.x2 + sCurrentX - this.sx2) / 2;
            evt.deltaY = (currentY - this.y2 + sCurrentY - this.sy2) / 2;
          } else {
            evt.deltaX = 0;
            evt.deltaY = 0;
          }

          this.twoFingerPressMove.dispatch(evt, this.element);
          this.sx2 = sCurrentX;
          this.sy2 = sCurrentY;
        } else {
          if (this.x2 !== null) {
            evt.deltaX = currentX - this.x2;
            evt.deltaY = currentY - this.y2;
            var movedX = Math.abs(this.x1 - this.x2),
                movedY = Math.abs(this.y1 - this.y2);

            if (movedX > 10 || movedY > 10) {
              this._preventTap = true;
            }
          } else {
            evt.deltaX = 0;
            evt.deltaY = 0;
          }

          this.pressMove.dispatch(evt, this.element);
        }

        this.touchMove.dispatch(evt, this.element);

        this._cancelLongTap();

        this.x2 = currentX;
        this.y2 = currentY;

        if (len > 1) {
          evt.preventDefault();
        }
      }
    }, {
      key: "end",
      value: function end(evt) {
        if (!evt.changedTouches) return;

        this._cancelLongTap();

        var self = this;

        if (evt.touches.length < 2) {
          this.multipointEnd.dispatch(evt, this.element);
          this.sx2 = this.sy2 = null;
        }

        if (this.x2 && Math.abs(this.x1 - this.x2) > 30 || this.y2 && Math.abs(this.y1 - this.y2) > 30) {
          evt.direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2);
          this.swipeTimeout = setTimeout(function () {
            self.swipe.dispatch(evt, self.element);
          }, 0);
        } else {
          this.tapTimeout = setTimeout(function () {
            if (!self._preventTap) {
              self.tap.dispatch(evt, self.element);
            }

            if (self.isDoubleTap) {
              self.doubleTap.dispatch(evt, self.element);
              self.isDoubleTap = false;
            }
          }, 0);

          if (!self.isDoubleTap) {
            self.singleTapTimeout = setTimeout(function () {
              self.singleTap.dispatch(evt, self.element);
            }, 250);
          }
        }

        this.touchEnd.dispatch(evt, this.element);
        this.preV.x = 0;
        this.preV.y = 0;
        this.zoom = 1;
        this.pinchStartLen = null;
        this.x1 = this.x2 = this.y1 = this.y2 = null;
      }
    }, {
      key: "cancelAll",
      value: function cancelAll() {
        this._preventTap = true;
        clearTimeout(this.singleTapTimeout);
        clearTimeout(this.tapTimeout);
        clearTimeout(this.longTapTimeout);
        clearTimeout(this.swipeTimeout);
      }
    }, {
      key: "cancel",
      value: function cancel(evt) {
        this.cancelAll();
        this.touchCancel.dispatch(evt, this.element);
      }
    }, {
      key: "_cancelLongTap",
      value: function _cancelLongTap() {
        clearTimeout(this.longTapTimeout);
      }
    }, {
      key: "_cancelSingleTap",
      value: function _cancelSingleTap() {
        clearTimeout(this.singleTapTimeout);
      }
    }, {
      key: "_swipeDirection",
      value: function _swipeDirection(x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? x1 - x2 > 0 ? 'Left' : 'Right' : y1 - y2 > 0 ? 'Up' : 'Down';
      }
    }, {
      key: "on",
      value: function on(evt, handler) {
        if (this[evt]) {
          this[evt].add(handler);
        }
      }
    }, {
      key: "off",
      value: function off(evt, handler) {
        if (this[evt]) {
          this[evt].del(handler);
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (this.singleTapTimeout) clearTimeout(this.singleTapTimeout);
        if (this.tapTimeout) clearTimeout(this.tapTimeout);
        if (this.longTapTimeout) clearTimeout(this.longTapTimeout);
        if (this.swipeTimeout) clearTimeout(this.swipeTimeout);
        this.element.removeEventListener("touchstart", this.start);
        this.element.removeEventListener("touchmove", this.move);
        this.element.removeEventListener("touchend", this.end);
        this.element.removeEventListener("touchcancel", this.cancel);
        this.rotate.del();
        this.touchStart.del();
        this.multipointStart.del();
        this.multipointEnd.del();
        this.pinch.del();
        this.swipe.del();
        this.tap.del();
        this.doubleTap.del();
        this.longTap.del();
        this.singleTap.del();
        this.pressMove.del();
        this.twoFingerPressMove.del();
        this.touchMove.del();
        this.touchEnd.del();
        this.touchCancel.del();
        this.preV = this.pinchStartLen = this.zoom = this.isDoubleTap = this.delta = this.last = this.now = this.tapTimeout = this.singleTapTimeout = this.longTapTimeout = this.swipeTimeout = this.x1 = this.x2 = this.y1 = this.y2 = this.preTapPosition = this.rotate = this.touchStart = this.multipointStart = this.multipointEnd = this.pinch = this.swipe = this.tap = this.doubleTap = this.longTap = this.singleTap = this.pressMove = this.touchMove = this.touchEnd = this.touchCancel = this.twoFingerPressMove = null;
        window.removeEventListener('scroll', this._cancelAllHandler);
        return null;
      }
    }]);

    return TouchEvents;
  }();

  var isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i);
  var isTouch = isMobile !== null || document.createTouch !== undefined || 'ontouchstart' in window || 'onmsgesturechange' in window || navigator.msMaxTouchPoints;
  var html = document.getElementsByTagName('html')[0];
  var transitionEnd = whichTransitionEvent();
  var animationEnd = whichAnimationEvent();
  var uid = Date.now();
  var videoPlayers = {};
  var defaults = {
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
    openEffect: 'zoomIn',
    closeEffect: 'zoomOut',
    slideEffect: 'slide',
    moreText: 'See more',
    moreLength: 60,
    lightboxHtml: '',
    cssEfects: {
      fade: {
        "in": 'fadeIn',
        out: 'fadeOut'
      },
      zoom: {
        "in": 'zoomIn',
        out: 'zoomOut'
      },
      slide: {
        "in": 'slideInRight',
        out: 'slideOutLeft'
      },
      slide_back: {
        "in": 'slideInLeft',
        out: 'slideOutRight'
      }
    }
  };
  var lightboxSlideHtml = '<div class="gslide">\
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
  var lightboxHtml = '<div id="glightbox-body" class="glightbox-container">\
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
      var type = _typeof(o);

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

  function getNodeEvents(node) {
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var fn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var cache = node[uid] = node[uid] || [];
    var data = {
      all: cache,
      evt: null,
      found: null
    };

    if (name && fn && utils.size(cache) > 0) {
      each(cache, function (cl, i) {
        if (cl.eventName == name && cl.fn.toString() == fn.toString()) {
          data.found = true;
          data.evt = i;
          return false;
        }
      });
    }

    return data;
  }

  function addEvent(eventName) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        onElement = _ref.onElement,
        withCallback = _ref.withCallback,
        _ref$avoidDuplicate = _ref.avoidDuplicate,
        avoidDuplicate = _ref$avoidDuplicate === void 0 ? true : _ref$avoidDuplicate,
        _ref$once = _ref.once,
        once = _ref$once === void 0 ? false : _ref$once,
        _ref$useCapture = _ref.useCapture,
        useCapture = _ref$useCapture === void 0 ? false : _ref$useCapture;

    var thisArg = arguments.length > 2 ? arguments[2] : undefined;
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
        var events = getNodeEvents(el, eventName, handler);

        if (events.found) {
          events.all.splice(events.evt, 1);
        }

        if (el.removeEventListener) el.removeEventListener(eventName, handler, useCapture);
      });
    };

    each(element, function (el) {
      var events = getNodeEvents(el, eventName, handler);

      if (el.addEventListener && avoidDuplicate && !events.found || !avoidDuplicate) {
        el.addEventListener(eventName, handler, useCapture);
        events.all.push({
          eventName: eventName,
          fn: handler
        });
      }
    });
    return handler;
  }

  function addClass(node, name) {
    each(name.split(' '), function (cl) {
      return node.classList.add(cl);
    });
  }

  function removeClass(node, name) {
    each(name.split(' '), function (cl) {
      return node.classList.remove(cl);
    });
  }

  function hasClass(node, name) {
    return node.classList.contains(name);
  }

  function whichAnimationEvent() {
    var t,
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

  function whichTransitionEvent() {
    var t,
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

  function animateElement(element) {
    var animation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (!element || animation === '') {
      return false;
    }

    if (animation == 'none') {
      if (utils.isFunction(callback)) callback();
      return false;
    }

    var animationNames = animation.split(' ');
    each(animationNames, function (name) {
      addClass(element, 'g' + name);
    });
    addEvent(animationEnd, {
      onElement: element,
      avoidDuplicate: false,
      once: true,
      withCallback: function withCallback(event, target) {
        each(animationNames, function (name) {
          removeClass(target, 'g' + name);
        });
        if (utils.isFunction(callback)) callback();
      }
    });
  }

  function createHTML(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;

    while (temp.firstChild) {
      frag.appendChild(temp.firstChild);
    }

    return frag;
  }

  function getClosest(elem, selector) {
    while (elem !== document.body) {
      elem = elem.parentElement;
      var matches = typeof elem.matches == 'function' ? elem.matches(selector) : elem.msMatchesSelector(selector);
      if (matches) return elem;
    }
  }

  function show(element) {
    element.style.display = 'block';
  }

  function hide(element) {
    element.style.display = 'none';
  }

  var getSlideData = function getSlideData() {
    var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var settings = arguments.length > 1 ? arguments[1] : undefined;
    var data = {
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

    if (utils.isObject(element) && !utils.isNode(element)) {
      return extend(data, element);
    }

    var url = '';
    var config = element.getAttribute('data-glightbox');
    var nodeType = element.nodeName.toLowerCase();
    if (nodeType === 'a') url = element.href;
    if (nodeType === 'img') url = element.src;
    data.href = url;
    each(data, function (val, key) {
      if (utils.has(settings, key)) {
        data[key] = settings[key];
      }

      var nodeData = element.dataset[key];

      if (!utils.isNil(nodeData)) {
        data[key] = nodeData;
      }
    });

    if (!data.type) {
      data.type = getSourceType(url);
    }

    if (!utils.isNil(config)) {
      var cleanKeys = [];
      each(data, function (v, k) {
        cleanKeys.push(';\\s?' + k);
      });
      cleanKeys = cleanKeys.join('\\s?:|');

      if (config.trim() !== '') {
        each(data, function (val, key) {
          var str = config;
          var match = '\s?' + key + '\s?:\s?(.*?)(' + cleanKeys + '\s?:|$)';
          var regex = new RegExp(match);
          var matches = str.match(regex);

          if (matches && matches.length && matches[1]) {
            var value = matches[1].trim().replace(/;\s*$/, '');
            data[key] = value;
          }
        });
      }
    } else {
      if (nodeType == 'a') {
        var title = element.title;
        if (!utils.isNil(title) && title !== '') data.title = title;
      }

      if (nodeType == 'img') {
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

    var defaultWith = data.type == 'video' ? settings.videosWidth : settings.width;
    var defaultHeight = settings.height;
    data.width = utils.has(data, 'width') ? data.width : defaultWith;
    data.height = utils.has(data, 'height') ? data.height : defaultHeight;
    return data;
  };

  var setSlideContent = function setSlideContent() {
    var _this = this;

    var slide = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (hasClass(slide, 'loaded')) {
      return false;
    }

    if (utils.isFunction(this.settings.beforeSlideLoad)) {
      this.settings.beforeSlideLoad(slide, data);
    }

    var type = data.type;
    var position = data.descPosition;
    var slideMedia = slide.querySelector('.gslide-media');
    var slideTitle = slide.querySelector('.gslide-title');
    var slideText = slide.querySelector('.gslide-desc');
    var slideDesc = slide.querySelector('.gdesc-inner');
    var finalCallback = callback;

    if (utils.isFunction(this.settings.afterSlideLoad)) {
      finalCallback = function finalCallback() {
        if (utils.isFunction(callback)) {
          callback();
        }

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
        if (isMobile && this.settings.moreLength > 0) {
          data.smallDescription = slideShortDesc(data.description, this.settings.moreLength, this.settings.moreText);
          slideText.innerHTML = data.smallDescription;
          slideDescriptionEvents.apply(this, [slideText, data]);
        } else {
          slideText.innerHTML = data.description;
        }
      } else {
        slideText.parentNode.removeChild(slideText);
      }

      addClass(slideMedia.parentNode, "desc-".concat(position));
      addClass(slideDesc.parentNode, "description-".concat(position));
    }

    addClass(slideMedia, "gslide-".concat(type));
    addClass(slide, 'loaded');

    if (type === 'video') {
      slideMedia.innerHTML = '<div class="gvideo-wrapper"></div>';
      setSlideVideo.apply(this, [slide, data, finalCallback]);
      return;
    }

    if (type === 'external') {
      var iframe = createIframe({
        url: data.href,
        width: data.width,
        height: data.height,
        callback: finalCallback
      });
      slideMedia.parentNode.style.maxWidth = "".concat(data.width, "px");
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

  function setSlideVideo(slide, data, callback) {
    var _this2 = this;

    var videoID = 'gvideo' + data.index;
    var slideMedia = slide.querySelector('.gvideo-wrapper');
    injectVideoApi(this.settings.plyr.css);
    var url = data.href;
    var protocol = location.protocol.replace(':', '');
    var videoSource = '';
    var embedID = '';
    var customPlaceholder = false;

    if (protocol == 'file') {
      protocol = 'http';
    }

    slideMedia.parentNode.style.maxWidth = "".concat(data.width, "px");
    injectVideoApi(this.settings.plyr.js, 'Plyr', function () {
      if (url.match(/vimeo\.com\/([0-9]*)/)) {
        var vimeoID = /vimeo.*\/(\d+)/i.exec(url);
        videoSource = 'vimeo';
        embedID = vimeoID[1];
      }

      if (url.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/)) {
        var youtubeID = getYoutubeID(url);
        videoSource = 'youtube';
        embedID = youtubeID;
      }

      if (url.match(/\.(mp4|ogg|webm)$/) !== null) {
        videoSource = 'local';

        var _html = '<video id="' + videoID + '" ';

        _html += "style=\"background:#000; max-width: ".concat(data.width, "px;\" ");
        _html += 'preload="metadata" ';
        _html += 'x-webkit-airplay="allow" ';
        _html += 'webkit-playsinline="" ';
        _html += 'controls ';
        _html += 'class="gvideo-local">';
        var format = url.toLowerCase().split('.').pop();
        var sources = {
          'mp4': '',
          'ogg': '',
          'webm': ''
        };
        sources[format] = url;

        for (var key in sources) {
          if (sources.hasOwnProperty(key)) {
            var videoFile = sources[key];

            if (data.hasOwnProperty(key)) {
              videoFile = data[key];
            }

            if (videoFile !== '') {
              _html += "<source src=\"".concat(videoFile, "\" type=\"video/").concat(key, "\">");
            }
          }
        }

        _html += '</video>';
        customPlaceholder = createHTML(_html);
      }

      var placeholder = customPlaceholder ? customPlaceholder : createHTML("<div id=\"".concat(videoID, "\" data-plyr-provider=\"").concat(videoSource, "\" data-plyr-embed-id=\"").concat(embedID, "\"></div>"));
      addClass(slideMedia, "".concat(videoSource, "-video gvideo"));
      slideMedia.appendChild(placeholder);
      slideMedia.setAttribute('data-id', videoID);
      var playerConfig = utils.has(_this2.settings.plyr, 'config') ? _this2.settings.plyr.config : {};
      var player = new Plyr('#' + videoID, playerConfig);
      player.on('ready', function (event) {
        var instance = event.detail.plyr;
        videoPlayers[videoID] = instance;

        if (utils.isFunction(callback)) {
          callback();
        }
      });
    });
  }

  function createIframe(config) {
    var url = config.url,
        width = config.width,
        height = config.height,
        allow = config.allow,
        callback = config.callback,
        appendTo = config.appendTo;
    var iframe = document.createElement('iframe');
    var winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    iframe.className = 'vimeo-video gvideo';
    iframe.src = url;

    if (height) {
      if (isMobile && winWidth < 767) {
        iframe.style.height = '';
      } else {
        iframe.style.height = "".concat(height, "px");
      }
    }

    if (width) {
      iframe.style.width = "".concat(width, "px");
    }

    if (allow) {
      iframe.setAttribute('allow', allow);
    }

    iframe.onload = function () {
      addClass(iframe, 'node-ready');

      if (utils.isFunction(callback)) {
        callback();
      }
    };

    if (appendTo) {
      appendTo.appendChild(iframe);
    }

    return iframe;
  }

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

  function injectVideoApi(url, waitFor, callback) {
    if (utils.isNil(url)) {
      console.error('Inject videos api error');
      return;
    }

    if (utils.isFunction(waitFor)) {
      callback = waitFor;
      waitFor = false;
    }

    var found;

    if (url.indexOf('.css') !== -1) {
      found = document.querySelectorAll('link[href="' + url + '"]');

      if (found && found.length > 0) {
        if (utils.isFunction(callback)) callback();
        return;
      }

      var head = document.getElementsByTagName("head")[0];
      var headStyles = head.querySelectorAll('link[rel="stylesheet"]');
      var link = document.createElement('link');
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

    found = document.querySelectorAll('script[src="' + url + '"]');

    if (found && found.length > 0) {
      if (utils.isFunction(callback)) {
        if (utils.isString(waitFor)) {
          waitUntil(function () {
            return typeof window[waitFor] !== 'undefined';
          }, function () {
            callback();
          });
          return false;
        }

        callback();
      }

      return;
    }

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    script.onload = function () {
      if (utils.isFunction(callback)) {
        if (utils.isString(waitFor)) {
          waitUntil(function () {
            return typeof window[waitFor] !== 'undefined';
          }, function () {
            callback();
          });
          return false;
        }

        callback();
      }
    };

    document.body.appendChild(script);
    return;
  }

  function waitUntil(check, onComplete, delay, timeout) {
    if (check()) {
      onComplete();
      return;
    }

    if (!delay) delay = 100;
    var timeoutPointer;
    var intervalPointer = setInterval(function () {
      if (!check()) return;
      clearInterval(intervalPointer);
      if (timeoutPointer) clearTimeout(timeoutPointer);
      onComplete();
    }, delay);
    if (timeout) timeoutPointer = setTimeout(function () {
      clearInterval(intervalPointer);
    }, timeout);
  }

  function setInlineContent(slide, data, callback) {
    var _this3 = this;

    var slideMedia = slide.querySelector('.gslide-media');
    var hash = data.href.split('#').pop().trim();
    var div = document.getElementById(hash);

    if (!div) {
      return false;
    }

    var cloned = div.cloneNode(true);
    cloned.style.height = utils.isNumber(data.height) ? "".concat(data.height, "px") : data.height;
    cloned.style.maxWidth = utils.isNumber(data.width) ? "".concat(data.width, "px") : data.width;
    addClass(cloned, 'ginlined-content');
    slideMedia.appendChild(cloned);
    this.events['inlineclose' + hash] = addEvent('click', {
      onElement: slideMedia.querySelectorAll('.gtrigger-close'),
      withCallback: function withCallback(e) {
        e.preventDefault();

        _this3.close();
      }
    });

    if (utils.isFunction(callback)) {
      callback();
    }

    return;
  }

  var getSourceType = function getSourceType(url) {
    var origin = url;
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

    if (url.indexOf("#") > -1) {
      var hash = origin.split('#').pop();

      if (hash.trim() !== '') {
        return 'inline';
      }
    }

    if (url.includes("gajax=true")) {
      return 'ajax';
    }

    return 'external';
  };

  function keyboardNavigation() {
    var _this4 = this;

    if (this.events.hasOwnProperty('keyboard')) {
      return false;
    }

    this.events['keyboard'] = addEvent('keydown', {
      onElement: window,
      withCallback: function withCallback(event, target) {
        event = event || window.event;
        var key = event.keyCode;

        if (key == 9) {
          event.preventDefault();
          var btns = document.querySelectorAll('.gbtn');

          if (!btns || btns.length <= 0) {
            return;
          }

          var focused = _toConsumableArray(btns).filter(function (item) {
            return hasClass(item, 'focused');
          });

          if (!focused.length) {
            var first = document.querySelector('.gbtn[tabindex="0"]');

            if (first) {
              first.focus();
              addClass(first, 'focused');
            }

            return;
          }

          btns.forEach(function (element) {
            return removeClass(element, 'focused');
          });
          var tabindex = focused[0].getAttribute('tabindex');
          tabindex = tabindex ? tabindex : '0';
          var newIndex = parseInt(tabindex) + 1;

          if (newIndex > btns.length - 1) {
            newIndex = '0';
          }

          var next = document.querySelector(".gbtn[tabindex=\"".concat(newIndex, "\"]"));

          if (next) {
            next.focus();
            addClass(next, 'focused');
          }
        }

        if (key == 39) _this4.nextSlide();
        if (key == 37) _this4.prevSlide();
        if (key == 27) _this4.close();
      }
    });
  }

  function touchNavigation() {
    var _this5 = this;

    if (this.events.hasOwnProperty('touch')) {
      return false;
    }

    var winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var currentSlide = null;
    var media = null;
    var mediaImage = null;
    var doingMove = false;
    var initScale = 1;
    var maxScale = 4.5;
    var currentScale = 1;
    var doingZoom = false;
    var imageZoomed = false;
    var zoomedPosX = null;
    var zoomedPosY = null;
    var lastZoomedPosX = null;
    var lastZoomedPosY = null;
    var hDistance;
    var vDistance;
    var hDistancePercent = 0;
    var vDistancePercent = 0;
    var vSwipe = false;
    var hSwipe = false;
    var startCoords = {};
    var endCoords = {};
    var xDown = 0;
    var yDown = 0;
    var instance = this;
    var sliderWrapper = document.getElementById('glightbox-slider');
    var overlay = document.querySelector('.goverlay');
    var touchInstance = new TouchEvents(sliderWrapper, {
      touchStart: function touchStart(e) {
        endCoords = e.targetTouches[0];
        startCoords.pageX = e.targetTouches[0].pageX;
        startCoords.pageY = e.targetTouches[0].pageY;
        xDown = e.targetTouches[0].clientX;
        yDown = e.targetTouches[0].clientY;
        currentSlide = instance.activeSlide;
        media = currentSlide.querySelector('.gslide-media');
        mediaImage = null;

        if (hasClass(media, 'gslide-image')) {
          mediaImage = media.querySelector('img');
        }

        removeClass(overlay, 'greset');
      },
      touchMove: function touchMove(e) {
        endCoords = e.targetTouches[0];

        if (doingZoom || imageZoomed) {
          return;
        }

        doingMove = true;
        var xUp = e.targetTouches[0].clientX;
        var yUp = e.targetTouches[0].clientY;
        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
          vSwipe = false;
          hSwipe = true;
        } else {
          hSwipe = false;
          vSwipe = true;
        }

        hDistance = endCoords.pageX - startCoords.pageX;
        hDistancePercent = hDistance * 100 / winWidth;
        vDistance = endCoords.pageY - startCoords.pageY;
        vDistancePercent = vDistance * 100 / winHeight;
        var opacity;

        if (vSwipe) {
          opacity = 1 - Math.abs(vDistance) / winHeight;
          overlay.style.opacity = opacity;
        }

        if (hSwipe) {
          opacity = 1 - Math.abs(hDistance) / winWidth;
          media.style.opacity = opacity;
        }

        slideCSSTransform(media, "translate3d(".concat(hDistancePercent, "%, ").concat(vDistancePercent, "%, 0)"));
      },
      touchEnd: function touchEnd() {
        doingMove = false;

        if (imageZoomed || doingZoom) {
          lastZoomedPosX = zoomedPosX;
          lastZoomedPosY = zoomedPosY;
          return;
        }

        var v = Math.abs(parseInt(vDistancePercent));
        var h = Math.abs(parseInt(hDistancePercent));

        if (v > 35) {
          _this5.close();

          return;
        }

        if (v < 35 && h < 25) {
          addClass(overlay, 'greset');
          overlay.style.opacity = 1;
          return resetSlideMove(media);
        }
      },
      multipointEnd: function multipointEnd() {
        setTimeout(function () {
          doingZoom = false;
        }, 50);
      },
      multipointStart: function multipointStart() {
        doingZoom = true;
        initScale = currentScale ? currentScale : 1;
      },
      pinch: function pinch(evt) {
        if (!mediaImage || doingMove) {
          return false;
        }

        doingZoom = true;
        mediaImage.scaleX = mediaImage.scaleY = initScale * evt.zoom;
        var scale = initScale * evt.zoom;
        imageZoomed = true;

        if (scale <= 1) {
          imageZoomed = false;
          scale = 1;
          lastZoomedPosY = null;
          lastZoomedPosX = null;
          zoomedPosX = null;
          zoomedPosY = null;
          mediaImage.setAttribute('style', '');
          return;
        }

        if (scale > maxScale) {
          scale = maxScale;
        }

        mediaImage.style.transform = "scale3d(".concat(scale, ", ").concat(scale, ", 1)");
        currentScale = scale;
      },
      pressMove: function pressMove(e) {
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
          var style = "translate3d(".concat(mhDistance, "px, ").concat(mvDistance, "px, 0)");

          if (currentScale) {
            style += " scale3d(".concat(currentScale, ", ").concat(currentScale, ", 1)");
          }

          slideCSSTransform(mediaImage, style);
        }
      },
      swipe: function swipe(evt) {
        if (imageZoomed) {
          return;
        }

        if (doingZoom) {
          doingZoom = false;
          return;
        }

        if (evt.direction == 'Left') {
          _this5.nextSlide();
        }

        if (evt.direction == 'Right') {
          if (_this5.index == 0) {
            return resetSlideMove(media);
          }

          _this5.prevSlide();
        }
      }
    });
    this.events['touch'] = touchInstance;
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
    var media = hasClass(slide, 'gslide-media') ? slide : slide.querySelector('.gslide-media');
    var desc = slide.querySelector('.gslide-description');
    addClass(media, 'greset');
    slideCSSTransform(media, "translate3d(0, 0, 0)");
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
        var body = document.body;
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

  var GlightboxInit = function () {
    function GlightboxInit(options) {
      _classCallCheck(this, GlightboxInit);

      this.settings = extend(defaults, options || {});
      this.effectsClasses = this.getAnimationClasses();
    }

    _createClass(GlightboxInit, [{
      key: "init",
      value: function init() {
        var _this6 = this;

        this.baseEvents = addEvent('click', {
          onElement: ".".concat(this.settings.selector),
          withCallback: function withCallback(e, target) {
            e.preventDefault();

            _this6.open(target);
          }
        });
      }
    }, {
      key: "open",
      value: function open() {
        var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        this.elements = this.getElements(element);
        if (this.elements.length == 0) return false;
        this.activeSlide = null;
        this.prevActiveSlideIndex = null;
        this.prevActiveSlide = null;
        var index = this.settings.startAt;

        if (element && utils.isNil(index)) {
          index = this.elements.indexOf(element);

          if (index < 0) {
            index = 0;
          }
        }

        if (utils.isNil(index)) {
          index = 0;
        }

        this.build();
        animateElement(this.overlay, this.settings.openEffect == 'none' ? 'none' : this.settings.cssEfects.fade["in"]);
        var body = document.body;
        body.style.width = "".concat(body.offsetWidth, "px");
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

        if (isMobile && isTouch && this.settings.touchNavigation) {
          touchNavigation.apply(this);
          return false;
        }

        if (this.settings.keyboardNavigation) {
          keyboardNavigation.apply(this);
        }
      }
    }, {
      key: "showSlide",
      value: function showSlide() {
        var _this7 = this;

        var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var first = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        show(this.loader);
        this.index = parseInt(index);
        var current = this.slidesContainer.querySelector('.current');

        if (current) {
          removeClass(current, 'current');
        }

        this.slideAnimateOut();
        var slide = this.slidesContainer.querySelectorAll('.gslide')[index];
        show(this.slidesContainer);

        if (hasClass(slide, 'loaded')) {
          this.slideAnimateIn(slide, first);
          hide(this.loader);
        } else {
          show(this.loader);
          var slide_data = getSlideData(this.elements[index], this.settings);
          slide_data.index = index;
          setSlideContent.apply(this, [slide, slide_data, function () {
            hide(_this7.loader);

            _this7.slideAnimateIn(slide, first);
          }]);
        }

        this.preloadSlide(index + 1);
        this.preloadSlide(index - 1);
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
      key: "preloadSlide",
      value: function preloadSlide(index) {
        var _this8 = this;

        if (index < 0 || index > this.elements.length) return false;
        if (utils.isNil(this.elements[index])) return false;
        var slide = this.slidesContainer.querySelectorAll('.gslide')[index];

        if (hasClass(slide, 'loaded')) {
          return false;
        }

        var slide_data = getSlideData(this.elements[index], this.settings);
        slide_data.index = index;
        var type = slide_data.sourcetype;

        if (type == 'video' || type == 'external') {
          setTimeout(function () {
            setSlideContent.apply(_this8, [slide, slide_data]);
          }, 200);
        } else {
          setSlideContent.apply(this, [slide, slide_data]);
        }
      }
    }, {
      key: "prevSlide",
      value: function prevSlide() {
        var prev = this.index - 1;

        if (prev < 0) {
          return false;
        }

        this.goToSlide(prev);
      }
    }, {
      key: "nextSlide",
      value: function nextSlide() {
        var next = this.index + 1;
        if (next > this.elements.length) return false;
        this.goToSlide(next);
      }
    }, {
      key: "goToSlide",
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
      key: "slideAnimateIn",
      value: function slideAnimateIn(slide, first) {
        var _this9 = this;

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
          slide.querySelector('.ginner-container').style.maxWidth = "".concat(slideMedia.offsetWidth, "px");
          slideDesc.style.display = '';
        }

        removeClass(slide, this.effectsClasses);

        if (first) {
          animateElement(slide, this.settings.openEffect, function () {
            if (!isMobile && _this9.settings.autoplayVideos) {
              _this9.playSlideVideo(slide);
            }

            if (utils.isFunction(_this9.settings.afterSlideChange)) {
              _this9.settings.afterSlideChange.apply(_this9, [prevData, nextData]);
            }
          });
        } else {
          var effect_name = this.settings.slideEffect;
          var animIn = effect_name !== 'none' ? this.settings.cssEfects[effect_name]["in"] : effect_name;

          if (this.prevActiveSlideIndex > this.index) {
            if (this.settings.slideEffect == 'slide') {
              animIn = this.settings.cssEfects.slide_back["in"];
            }
          }

          animateElement(slide, animIn, function () {
            if (!isMobile && _this9.settings.autoplayVideos) {
              _this9.playSlideVideo(slide);
            }

            if (utils.isFunction(_this9.settings.afterSlideChange)) {
              _this9.settings.afterSlideChange.apply(_this9, [prevData, nextData]);
            }
          });
        }

        addClass(slide, 'current');
      }
    }, {
      key: "slideAnimateOut",
      value: function slideAnimateOut() {
        if (!this.prevActiveSlide) {
          return false;
        }

        var prevSlide = this.prevActiveSlide;
        removeClass(prevSlide, this.effectsClasses);
        addClass(prevSlide, 'prev');
        var animation = this.settings.slideEffect;
        var animOut = animation !== 'none' ? this.settings.cssEfects[animation].out : animation;
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
      key: "stopSlideVideo",
      value: function stopSlideVideo(slide) {
        if (utils.isNumber(slide)) {
          slide = this.slidesContainer.querySelectorAll('.gslide')[slide];
        }

        var slideVideo = slide ? slide.querySelector('.gvideo') : null;

        if (!slideVideo) {
          return false;
        }

        var videoID = slideVideo.getAttribute('data-id');

        if (videoPlayers && utils.has(videoPlayers, videoID)) {
          var api = videoPlayers[videoID];

          if (api && api.play) {
            api.pause();
          }
        }
      }
    }, {
      key: "playSlideVideo",
      value: function playSlideVideo(slide) {
        if (utils.isNumber(slide)) {
          slide = this.slidesContainer.querySelectorAll('.gslide')[slide];
        }

        var slideVideo = slide.querySelector('.gvideo');

        if (!slideVideo) {
          return false;
        }

        var videoID = slideVideo.getAttribute('data-id');

        if (videoPlayers && utils.has(videoPlayers, videoID)) {
          var api = videoPlayers[videoID];

          if (api && api.play) {
            api.play();
          }
        }
      }
    }, {
      key: "setElements",
      value: function setElements(elements) {
        this.settings.elements = elements;
      }
    }, {
      key: "getElements",
      value: function getElements() {
        var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        this.elements = [];

        if (!utils.isNil(this.settings.elements) && utils.isArray(this.settings.elements)) {
          return this.settings.elements;
        }

        var nodes = false;

        if (element !== null) {
          var gallery = element.getAttribute('data-gallery');

          if (gallery && gallery !== '') {
            nodes = document.querySelectorAll("[data-gallery=\"".concat(gallery, "\"]"));
          }
        }

        if (nodes == false) {
          nodes = document.querySelectorAll(".".concat(this.settings.selector));
        }

        nodes = Array.prototype.slice.call(nodes);
        return nodes;
      }
    }, {
      key: "getActiveSlide",
      value: function getActiveSlide() {
        return this.slidesContainer.querySelectorAll('.gslide')[this.index];
      }
    }, {
      key: "getActiveSlideIndex",
      value: function getActiveSlideIndex() {
        return this.index;
      }
    }, {
      key: "getAnimationClasses",
      value: function getAnimationClasses() {
        var effects = [];

        for (var key in this.settings.cssEfects) {
          if (this.settings.cssEfects.hasOwnProperty(key)) {
            var effect = this.settings.cssEfects[key];
            effects.push("g".concat(effect["in"]));
            effects.push("g".concat(effect.out));
          }
        }

        return effects.join(' ');
      }
    }, {
      key: "build",
      value: function build() {
        var _this10 = this;

        if (this.built) {
          return false;
        }

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

              _this10.close();
            }
          });
        }

        if (closeButton && !this.settings.closeButton) {
          closeButton.parentNode.removeChild(closeButton);
        }

        if (this.nextButton) {
          this.events['next'] = addEvent('click', {
            onElement: this.nextButton,
            withCallback: function withCallback(e, target) {
              e.preventDefault();

              _this10.nextSlide();
            }
          });
        }

        if (this.prevButton) {
          this.events['prev'] = addEvent('click', {
            onElement: this.prevButton,
            withCallback: function withCallback(e, target) {
              e.preventDefault();

              _this10.prevSlide();
            }
          });
        }

        if (this.settings.closeOnOutsideClick) {
          this.events['outClose'] = addEvent('click', {
            onElement: modal,
            withCallback: function withCallback(e, target) {
              if (!getClosest(e.target, '.ginner-container')) {
                if (!hasClass(e.target, 'gnext') && !hasClass(e.target, 'gprev')) {
                  _this10.close();
                }
              }
            }
          });
        }

        each(this.elements, function () {
          var slide = createHTML(_this10.settings.slideHtml);

          _this10.slidesContainer.appendChild(slide);
        });

        if (isTouch) {
          addClass(html, 'glightbox-touch');
        }

        this.built = true;
      }
    }, {
      key: "reload",
      value: function reload() {
        this.init();
      }
    }, {
      key: "close",
      value: function close() {
        var _this11 = this;

        if (this.closing) {
          return false;
        }

        this.closing = true;
        this.stopSlideVideo(this.activeSlide);
        addClass(this.modal, 'glightbox-closing');
        animateElement(this.overlay, this.settings.openEffect == 'none' ? 'none' : this.settings.cssEfects.fade.out);
        animateElement(this.activeSlide, this.settings.closeEffect, function () {
          _this11.activeSlide = null;
          _this11.prevActiveSlideIndex = null;
          _this11.prevActiveSlide = null;
          _this11.built = false;

          if (_this11.events) {
            for (var key in _this11.events) {
              if (_this11.events.hasOwnProperty(key)) {
                _this11.events[key].destroy();
              }
            }

            _this11.events = null;
          }

          var body = document.body;
          removeClass(body, 'glightbox-open');
          removeClass(html, 'glightbox-open');
          removeClass(body, 'touching');
          removeClass(body, 'gdesc-open');
          body.style.width = '';

          _this11.modal.parentNode.removeChild(_this11.modal);

          if (utils.isFunction(_this11.settings.onClose)) {
            _this11.settings.onClose();
          }

          _this11.closing = null;
        });
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.close();
        this.baseEvents.destroy();
      }
    }]);

    return GlightboxInit;
  }();

  function glightbox () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var instance = new GlightboxInit(options);
    instance.init();
    return instance;
  }

  return glightbox;

}));
