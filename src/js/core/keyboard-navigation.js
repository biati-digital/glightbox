/**
 * Keyboard Navigation
 * Allow navigation using the keyboard
 *
 * @param {object} instance
 */

import { addEvent, addClass, removeClass, each } from '../utils/helpers.js';

function getNextFocusElement(current = -1) {
    const btns = document.querySelectorAll('.gbtn[data-taborder]:not(.disabled)');
    if (!btns.length) {
        return false;
    }

    if (btns.length == 1) {
        return btns[0];
    }

    if (typeof current == 'string') {
        current = parseInt(current);
    }

    let newIndex = current < 0 ? 1 : current + 1;
    if (newIndex > btns.length) {
        newIndex = '1';
    }

    const orders = [];
    each(btns, (btn) => {
        orders.push(btn.getAttribute('data-taborder'));
    });
    const nextOrders = orders.filter((el) => el >= parseInt(newIndex));
    const nextFocus = nextOrders.sort()[0];

    return document.querySelector(`.gbtn[data-taborder="${nextFocus}"]`);
}

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
                const focusedButton = document.querySelector('.gbtn.focused');

                if (!focusedButton) {
                    const activeElement = document.activeElement && document.activeElement.nodeName ? document.activeElement.nodeName.toLocaleLowerCase() : false;
                    if (activeElement == 'input' || activeElement == 'textarea' || activeElement == 'button') {
                        return;
                    }
                }

                event.preventDefault();
                const btns = document.querySelectorAll('.gbtn[data-taborder]');
                if (!btns || btns.length <= 0) {
                    return;
                }

                if (!focusedButton) {
                    const first = getNextFocusElement();
                    if (first) {
                        first.focus();
                        addClass(first, 'focused');
                    }
                    return;
                }

                let currentFocusOrder = focusedButton.getAttribute('data-taborder');
                let nextFocus = getNextFocusElement(currentFocusOrder);

                removeClass(focusedButton, 'focused');

                if (nextFocus) {
                    nextFocus.focus();
                    addClass(nextFocus, 'focused');
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
