/**
 * Slide
 * class to hablde slide creation
 * and config parser
 */

import ZoomImages from './zoom.js';
import DragSlides from './drag.js';
import slideImage from '../slides/image.js';
import slideVideo from '../slides/video.js';
import slideInline from '../slides/inline.js';
import slideIframe from '../slides/iframe.js';
import SlideConfigParser from './slide-parser.js';
import { addEvent, addClass, removeClass, hasClass, closest, isMobile, isFunction, createHTML } from '../utils/helpers.js';

export default class Slide {
    constructor(el, instance) {
        this.element = el;
        this.instance = instance;
    }

    /**
     * Set slide content
     *
     * @param {node} slide
     * @param {object} data
     * @param {function} callback
     */
    setContent(slide = null, callback = false) {
        if (hasClass(slide, 'loaded')) {
            return false
        }

        const settings = this.instance.settings;
        const slideConfig = this.slideConfig;
        const isMobileDevice = isMobile();

        if (isFunction(settings.beforeSlideLoad)) {
            settings.beforeSlideLoad({
                index: slideConfig.index,
                slide: slide,
                player: false
            });
        }

        let type = slideConfig.type;
        let position = slideConfig.descPosition;
        let slideMedia = slide.querySelector('.gslide-media');
        let slideTitle = slide.querySelector('.gslide-title');
        let slideText = slide.querySelector('.gslide-desc');
        let slideDesc = slide.querySelector('.gdesc-inner');
        let finalCallback = callback;

        // used for image accessiblity
        let titleID = 'gSlideTitle_' + slideConfig.index;
        let textID = 'gSlideDesc_' + slideConfig.index;

        if (isFunction(settings.afterSlideLoad)) {
            finalCallback = () => {
                if (isFunction(callback)) { callback() }
                settings.afterSlideLoad({
                    index: slideConfig.index,
                    slide: slide,
                    player: this.instance.getSlidePlayerInstance(slideConfig.index)
                });
            }
        }

        if (slideConfig.title == '' && slideConfig.description == '') {
            if (slideDesc) {
                slideDesc.parentNode.parentNode.removeChild(slideDesc.parentNode);
            }
        } else {
            if (slideTitle && slideConfig.title !== '') {
                slideTitle.id = titleID;
                slideTitle.innerHTML = slideConfig.title;
            } else {
                slideTitle.parentNode.removeChild(slideTitle);
            }
            if (slideText && slideConfig.description !== '') {
                slideText.id = textID;
                if (isMobileDevice && settings.moreLength > 0) {
                    slideConfig.smallDescription = this.slideShortDesc(slideConfig.description, settings.moreLength, settings.moreText)
                    slideText.innerHTML = slideConfig.smallDescription;
                    this.descriptionEvents(slideText, slideConfig);
                } else {
                    slideText.innerHTML = slideConfig.description;
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
            slideVideo.apply(this.instance, [slide, slideConfig, finalCallback])
            return
        }

        if (type === 'external') {
            slideIframe.apply(this, [slide, slideConfig, finalCallback])
            return
        }

        if (type === 'inline') {
            slideInline.apply(this.instance, [slide, slideConfig, finalCallback])
            if (slideConfig.draggable) {
                new DragSlides({
                    dragEl: slide.querySelector('.gslide-inline'),
                    toleranceX: settings.dragToleranceX,
                    toleranceY: settings.dragToleranceY,
                    slide: slide,
                    instance: this.instance,
                });
            }
            return
        }

        if (type === 'image') {
            slideImage(slide, slideConfig, () => {
                const img = slide.querySelector('img');

                if (slideConfig.draggable) {
                    new DragSlides({
                        dragEl: img,
                        toleranceX: settings.dragToleranceX,
                        toleranceY: settings.dragToleranceY,
                        slide: slide,
                        instance: this.instance,
                    });
                }
                if (slideConfig.zoomable && img.naturalWidth > img.offsetWidth) {
                    addClass(img, 'zoomable')
                    new ZoomImages(img, slide, () => {
                        this.instance.resize();
                    });
                }

                if (isFunction(finalCallback)) {
                    finalCallback()
                }
            })
            return;
        }

        if (isFunction(finalCallback)) {
            finalCallback()
        }
    }



    slideShortDesc(string, n = 50, wordBoundary = false) {
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



    descriptionEvents(desc, data) {
        let moreLink = desc.querySelector('.desc-more')
        if (!moreLink) {
            return false
        }

        addEvent('click', {
            onElement: moreLink,
            withCallback: (event, target) => {
                event.preventDefault();
                const body = document.body

                let desc = closest(target, '.gslide-desc')
                if (!desc) {
                    return false
                }

                desc.innerHTML = data.description
                addClass(body, 'gdesc-open')

                let shortEvent = addEvent('click', {
                    onElement: [body, closest(desc, '.gslide-description')],
                    withCallback: (event, target) => {
                        if (event.target.nodeName.toLowerCase() !== 'a') {
                            removeClass(body, 'gdesc-open')
                            addClass(body, 'gdesc-closed')
                            desc.innerHTML = data.smallDescription
                            this.descriptionEvents(desc, data)

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
     * Create Slide Node
     *
     * @return { node }
     */
    create() {
        return createHTML(this.instance.settings.slideHTML);
    }


    /**
     * Get slide config
     * returns each individual slide config
     * it uses SlideConfigParser
     * each slide can overwrite a global setting
     * read more in the SlideConfigParser class
     *
     * @return { object }
     */
    getConfig() {
        const parser = new SlideConfigParser();
        this.slideConfig = parser.parseConfig(this.element, this.instance.settings);

        return this.slideConfig;
    }
}