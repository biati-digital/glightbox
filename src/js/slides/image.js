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

import { isNil, isFunction } from '../utils/helpers.js';

export default function slideImage(slide, data, index, callback) {
    const slideMedia = slide.querySelector('.gslide-media');

    let img = new Image();
    let titleID = 'gSlideTitle_' + index;
    let textID = 'gSlideDesc_' + index;

    // prettier-ignore
    img.addEventListener('load', () => {
        if (isFunction(callback)) {
            callback();
        }
    }, false);

    img.src = data.href;
    if (data.sizes != '' && data.srcset != '') {
        img.sizes = data.sizes;
        img.srcset = data.srcset;
    }
    img.alt = ''; // https://davidwalsh.name/accessibility-tip-empty-alt-attributes
    if (!isNil(data.alt) && data.alt !== '') {
        img.alt = data.alt;
    }

    if (data.title !== '') {
        img.setAttribute('aria-labelledby', titleID);
    }
    if (data.description !== '') {
        // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-describedby_attribute#Example_2_A_Close_Button
        img.setAttribute('aria-describedby', textID);
    }

    if (data.hasOwnProperty('_hasCustomWidth') && data._hasCustomWidth) {
        img.style.width = data.width;
    }
    if (data.hasOwnProperty('_hasCustomHeight') && data._hasCustomHeight) {
        img.style.height = data.height;
    }

    slideMedia.insertBefore(img, slideMedia.firstChild);
    return;
}
