/**
 * Set slide iframe content
 *
 * @param {node} slide
 * @param {object} data
 * @param {int} index
 * @param {function} callback
 */

import { createIframe } from '../utils/helpers.js';

export default function slideIframe(slide, data, index, callback) {
    const slideMedia = slide.querySelector('.gslide-media');
    const iframe = createIframe({
        url: data.href,
        callback: callback
    });

    slideMedia.parentNode.style.maxWidth = data.width;
    slideMedia.parentNode.style.height = data.height;
    slideMedia.appendChild(iframe);

    return;
}
