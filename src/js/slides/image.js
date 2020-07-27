
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


import { addClass, isFunction } from '../utils/helpers.js';;

export default function slideImage(slide, data, callback) {
    const slideMedia = slide.querySelector('.gslide-media');

    let img = new Image();
    let titleID = 'gSlideTitle_' + data.index;
    let textID = 'gSlideDesc_' + data.index;

    img.addEventListener('load', () => {
        if (isFunction(callback)) {
            callback()
        }
    }, false);
    img.src = data.href;
    img.alt = ''; // https://davidwalsh.name/accessibility-tip-empty-alt-attributes

    if (data.title !== '') {
        img.setAttribute('aria-labelledby', titleID);
    }
    if (data.description !== '') { // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-describedby_attribute#Example_2_A_Close_Button
        img.setAttribute('aria-describedby', textID);
    }

    slideMedia.insertBefore(img, slideMedia.firstChild);
    return;
}