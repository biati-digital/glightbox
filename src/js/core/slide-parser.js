import { extend, has, each, isNil, isNode, isObject, isNumber } from '../utils/helpers.js';

export default class SlideConfigParser {
    constructor(slideParamas = {}) {
        this.defaults = {
            href: '',
            sizes: '',
            srcset: '',
            title: '',
            type: '',
            videoProvider: '',
            description: '',
            alt: '',
            descPosition: 'bottom',
            effect: '',
            width: '',
            height: '',
            content: false,
            zoomable: true,
            draggable: true
        };

        if (isObject(slideParamas)) {
            this.defaults = extend(this.defaults, slideParamas);
        }
    }

    /**
     * Get source type
     * gte the source type of a url
     *
     * @param {string} url
     */
    sourceType(url) {
        let origin = url;
        url = url.toLowerCase();

        if (url.match(/\.(jpeg|jpg|jpe|gif|png|apn|webp|avif|svg)/) !== null) {
            return 'image';
        }
        if (url.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/) || url.match(/(youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9\-_]+)/)) {
            return 'video';
        }
        if (url.match(/vimeo\.com\/([0-9]*)/)) {
            return 'video';
        }
        if (url.match(/\.(mp4|ogg|webm|mov)/) !== null) {
            return 'video';
        }
        if (url.match(/\.(mp3|wav|wma|aac|ogg)/) !== null) {
            return 'audio';
        }

        // Check if inline content
        if (url.indexOf('#') > -1) {
            let hash = origin.split('#').pop();
            if (hash.trim() !== '') {
                return 'inline';
            }
        }
        // Ajax
        if (url.indexOf('goajax=true') > -1) {
            return 'ajax';
        }

        return 'external';
    }

    parseConfig(element, settings) {
        let data = extend({ descPosition: settings.descPosition }, this.defaults);

        if (isObject(element) && !isNode(element)) {
            if (!has(element, 'type')) {
                if (has(element, 'content') && element.content) {
                    element.type = 'inline';
                } else if (has(element, 'href')) {
                    element.type = this.sourceType(element.href);
                }
            }
            let objectData = extend(data, element);
            this.setSize(objectData, settings);

            return objectData;
        }

        let url = '';
        let config = element.getAttribute('data-glightbox');
        let nodeType = element.nodeName.toLowerCase();

        if (nodeType === 'a') {
            url = element.href;
        }
        if (nodeType === 'img') {
            url = element.src;
            //alt attribute propagation
            data.alt = element.alt;
        }

        data.href = url;

        each(data, (val, key) => {
            if (has(settings, key) && key !== 'width') {
                data[key] = settings[key];
            }
            const nodeData = element.dataset[key];
            if (!isNil(nodeData)) {
                data[key] = this.sanitizeValue(nodeData);
            }
        });

        if (data.content) {
            data.type = 'inline';
        }

        if (!data.type && url) {
            data.type = this.sourceType(url);
        }

        if (!isNil(config)) {
            let cleanKeys = [];
            each(data, (v, k) => {
                cleanKeys.push(';\\s?' + k);
            });
            cleanKeys = cleanKeys.join('\\s?:|');
            if (config.trim() !== '') {
                each(data, (val, key) => {
                    const str = config;
                    const match = 's?' + key + 's?:s?(.*?)(' + cleanKeys + 's?:|$)';
                    const regex = new RegExp(match);
                    const matches = str.match(regex);

                    if (matches && matches.length && matches[1]) {
                        const value = matches[1].trim().replace(/;\s*$/, '');
                        data[key] = this.sanitizeValue(value);
                    }
                });
            }
        } else {
            if (!data.title && nodeType == 'a') {
                let title = element.title;
                if (!isNil(title) && title !== '') {
                    data.title = title;
                }
            }
            if (!data.title && nodeType == 'img') {
                let alt = element.alt;
                if (!isNil(alt) && alt !== '') {
                    data.title = alt;
                }
            }
        }

        // Try to get the description from a referenced element
        if (data.description && data.description.substring(0, 1) === '.') {
            let description;

            try {
                description = document.querySelector(data.description).innerHTML;
            } catch (error) {
                if (!(error instanceof DOMException)) {
                    throw error;
                }
            }

            if (description) {
                data.description = description;
            }
        }

        // Try to get the description from a .glightbox-desc element
        if (!data.description) {
            let nodeDesc = element.querySelector('.glightbox-desc');
            if (nodeDesc) {
                data.description = nodeDesc.innerHTML;
            }
        }

        this.setSize(data, settings, element);
        this.slideConfig = data;

        return data;
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
    setSize(data, settings, element = null) {
        const defaultWith = data.type == 'video' ? this.checkSize(settings.videosWidth) : this.checkSize(settings.width);
        const defaultHeight = this.checkSize(settings.height);

        data.width = has(data, 'width') && data.width !== '' ? this.checkSize(data.width) : defaultWith;
        data.height = has(data, 'height') && data.height !== '' ? this.checkSize(data.height) : defaultHeight;

        if (element && data.type == 'image') {
            data._hasCustomWidth = element.dataset.width ? true : false;
            data._hasCustomHeight = element.dataset.height ? true : false;
        }

        return data;
    }

    /**
     * [checkSize size
     * check if the passed size has a correct unit
     *
     * @param {string} size
     * @return {string}
     */
    checkSize(size) {
        return isNumber(size) ? `${size}px` : size;
    }

    /**
     * Sanitize data attributes value
     *
     * @param string val
     * @return mixed
     */
    sanitizeValue(val) {
        if (val !== 'true' && val !== 'false') {
            return val;
        }
        return val === 'true';
    }
}
