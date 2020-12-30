/**
 * Keyboard Navigation
 * Allow navigation using the keyboard
 *
 * @param {object} instance
 */

import { addEvent, addClass, removeClass, hasClass } from '../utils/helpers.js';

export default function keyboardNavigation(instance) {
    if (instance.events.hasOwnProperty('keyboard')) {
        return false;
    }

    instance.events['keyboard'] = addEvent('keydown', {
        onElement: window,
        withCallback: (event, target) => {
            event = event || window.event;
            const key = event.keyCode;
            if (key == 9) {
                //prettier-ignore
                const activeElement = document.activeElement && document.activeElement.nodeName ? document.activeElement.nodeName.toLocaleLowerCase() : false;

                if (activeElement == 'input' || activeElement == 'textarea' || activeElement == 'button') {
                    return;
                }

                event.preventDefault();
                const btns = document.querySelectorAll('.gbtn');
                if (!btns || btns.length <= 0) {
                    return;
                }

                const focused = [...btns].filter((item) => hasClass(item, 'focused'));
                if (!focused.length) {
                    const first = document.querySelector('.gbtn[tabindex="0"]');
                    if (first) {
                        first.focus();
                        addClass(first, 'focused');
                    }
                    return;
                }

                btns.forEach((element) => removeClass(element, 'focused'));

                let tabindex = focused[0].getAttribute('tabindex');
                tabindex = tabindex ? tabindex : '0';
                let newIndex = parseInt(tabindex) + 1;
                if (newIndex > btns.length - 1) {
                    newIndex = '0';
                }
                let next = document.querySelector(`.gbtn[tabindex="${newIndex}"]`);
                if (next) {
                    next.focus();
                    addClass(next, 'focused');
                }
            }
            if (key == 39) {
                instance.nextSlide();
            }
            if (key == 37) {
                instance.prevSlide();
            }
            if (key == 27) {
                instance.close();
            }
        }
    });
}
