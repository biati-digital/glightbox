/**
 * Touch Navigation
 * Allow navigation using touch events
 *
 * @param {object} instance
 */

import TouchEvents from './touch-events.js';
import { addEvent, addClass, removeClass, hasClass, closest, whichTransitionEvent, cssTransform, windowSize } from '../utils/helpers.js';

function resetSlideMove(slide) {
    const transitionEnd = whichTransitionEvent();
    const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    let media = hasClass(slide, 'gslide-media') ? slide : slide.querySelector('.gslide-media');
    let container = closest(media, '.ginner-container');
    let desc = slide.querySelector('.gslide-description');

    if (windowWidth > 769) {
        media = container;
    }

    addClass(media, 'greset');
    cssTransform(media, 'translate3d(0, 0, 0)');
    addEvent(transitionEnd, {
        onElement: media,
        once: true,
        withCallback: (event, target) => {
            removeClass(media, 'greset');
        }
    });

    media.style.opacity = '';
    if (desc) {
        desc.style.opacity = '';
    }
}

export default function touchNavigation(instance) {
    if (instance.events.hasOwnProperty('touch')) {
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

    const sliderWrapper = document.getElementById('glightbox-slider');
    const overlay = document.querySelector('.goverlay');

    const touchInstance = new TouchEvents(sliderWrapper, {
        touchStart: (e) => {
            process = true;

            // TODO: More tests for inline content slides
            if (hasClass(e.targetTouches[0].target, 'ginner-container') || closest(e.targetTouches[0].target, '.gslide-desc') || e.targetTouches[0].target.nodeName.toLowerCase() == 'a') {
                process = false;
            }

            if (closest(e.targetTouches[0].target, '.gslide-inline') && !hasClass(e.targetTouches[0].target.parentNode, 'gslide-inline')) {
                process = false;
            }

            if (process) {
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

                const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

                if (windowWidth > 769) {
                    media = currentSlide.querySelector('.ginner-container');
                }

                removeClass(overlay, 'greset');

                if (e.pageX > 20 && e.pageX < window.innerWidth - 20) {
                    return;
                }
                e.preventDefault();
            }
        },
        touchMove: (e) => {
            if (!process) {
                return;
            }
            endCoords = e.targetTouches[0];

            if (doingZoom || imageZoomed) {
                return;
            }
            if (isInlined && isInlined.offsetHeight > winHeight) {
                // Allow scroll without moving the slide
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
                vSwipe = false;
                hSwipe = true;
            } else {
                hSwipe = false;
                vSwipe = true;
            }

            hDistance = endCoords.pageX - startCoords.pageX;
            hDistancePercent = (hDistance * 100) / winWidth;

            vDistance = endCoords.pageY - startCoords.pageY;
            vDistancePercent = (vDistance * 100) / winHeight;

            let opacity;
            if (vSwipe && mediaImage) {
                opacity = 1 - Math.abs(vDistance) / winHeight;
                overlay.style.opacity = opacity;

                if (instance.settings.touchFollowAxis) {
                    hDistancePercent = 0;
                }
            }
            if (hSwipe) {
                opacity = 1 - Math.abs(hDistance) / winWidth;
                media.style.opacity = opacity;

                if (instance.settings.touchFollowAxis) {
                    vDistancePercent = 0;
                }
            }

            if (!mediaImage) {
                return cssTransform(media, `translate3d(${hDistancePercent}%, 0, 0)`);
            }

            cssTransform(media, `translate3d(${hDistancePercent}%, ${vDistancePercent}%, 0)`);
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
                instance.close();
                return;
            }
            if (v < 29 && h < 25) {
                addClass(overlay, 'greset');
                overlay.style.opacity = 1;
                return resetSlideMove(media);
            }
        },
        multipointEnd: () => {
            setTimeout(() => {
                doingZoom = false;
            }, 50);
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
                mediaImage.setAttribute('style', '');
                return;
            }
            if (scale > maxScale) {
                // max scale zoom
                scale = maxScale;
            }

            mediaImage.style.transform = `scale3d(${scale}, ${scale}, 1)`;
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
                    style += ` scale3d(${currentScale}, ${currentScale}, 1)`;
                }
                cssTransform(mediaImage, style);
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
                if (instance.index == instance.elements.length - 1) {
                    return resetSlideMove(media);
                }
                instance.nextSlide();
            }
            if (evt.direction == 'Right') {
                if (instance.index == 0) {
                    return resetSlideMove(media);
                }
                instance.prevSlide();
            }
        }
    });

    instance.events['touch'] = touchInstance;
}
