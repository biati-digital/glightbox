/**
 * Set slide inline content
 * we'll extend this to make http
 * requests using the fetch api
 * but for now we keep it simple
 *
 * @param {node} slide
 * @param {object} data
 * @param {int} index
 * @param {function} callback
 */

import { has, addClass, addEvent, createHTML, isString, isNode, isFunction } from '../utils/helpers.js';

export default function slideInline(slide, data, index, callback) {
    const slideMedia = slide.querySelector('.gslide-media');
    const hash = has(data, 'href') && data.href ? data.href.split('#').pop().trim() : false;
    const content = has(data, 'content') && data.content ? data.content : false;
    let innerContent;

    if (content) {
        if (isString(content)) {
            innerContent = createHTML(`<div class="ginlined-content">${content}</div>`);
        }
        if (isNode(content)) {
            if (content.style.display == 'none') {
                content.style.display = 'block';
            }

            const container = document.createElement('div');
            container.className = 'ginlined-content';
            container.appendChild(content);
            innerContent = container;
        }
    }

    if (hash) {
        let div = document.getElementById(hash);
        if (!div) {
            return false;
        }
        const cloned = div.cloneNode(true);

        cloned.style.height = data.height;
        cloned.style.maxWidth = data.width;
        addClass(cloned, 'ginlined-content');
        innerContent = cloned;
    }

    if (!innerContent) {
        console.error('Unable to append inline slide content', data);
        return false;
    }

    slideMedia.style.height = data.height;
    slideMedia.style.width = data.width;
    slideMedia.appendChild(innerContent);

    this.events['inlineclose' + hash] = addEvent('click', {
        onElement: slideMedia.querySelectorAll('.gtrigger-close'),
        withCallback: (e) => {
            e.preventDefault();
            this.close();
        }
    });

    if (isFunction(callback)) {
        callback();
    }
    return;
}
