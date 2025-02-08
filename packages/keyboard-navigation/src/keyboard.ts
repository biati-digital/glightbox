import type { PluginType } from '@glightbox/plugin-core';
import { GLightboxPlugin } from '@glightbox/plugin-core';

export default class KeyboardNavigation extends GLightboxPlugin {
    name = 'keyboard';
    type: PluginType = 'other';
    largest = -1;
    keyBoardEvent: ((e: KeyboardEvent) => void) | null = null;

    init(): void {
        const focusableElements = this.instance.modal?.querySelectorAll('*[tabindex]');
        if (focusableElements) {
            const focusablIndexes = [...focusableElements].map(el => parseInt(el.getAttribute('tabindex') ?? '0'));
            this.largest = Math.max.apply(0, [...focusablIndexes]);
        }

        this.keyBoardEvent = this.onKeyDown.bind(this);
        window.addEventListener('keydown', this.keyBoardEvent);
    }

    destroy(): void {
        if (this.keyBoardEvent) {
            window.removeEventListener('keydown', this.keyBoardEvent);
            this.keyBoardEvent = null;
        }
    }

    onKeyDown(event: KeyboardEvent) {
        const shiftKey = event.shiftKey;
        const key = event.key;
        const instance = this.instance;

        switch (key) {
            case 'Tab':
                if (this.largest > 0 && instance.modal?.contains(document.activeElement)) {
                    const activeFocusIndex = document.activeElement?.getAttribute('tabindex') ?? '0';
                    let nextFocusIndex = shiftKey ? parseInt(activeFocusIndex) - 1 : parseInt(activeFocusIndex) + 1;
                    if (!shiftKey && nextFocusIndex > this.largest) {
                        nextFocusIndex = 1;
                    }
                    if (shiftKey && nextFocusIndex < 1) {
                        nextFocusIndex = this.largest;
                    }
                    const toFocus = instance.modal?.querySelector(`*[tabindex="${nextFocusIndex}"]`) as HTMLElement;
                    if (toFocus) {
                        toFocus.focus();
                    }
                    event.preventDefault();
                }
                break;
            case 'ArrowRight':
                instance.nextSlide();
                break;
            case 'ArrowLeft':
                instance.prevSlide();
                break;
            case 'Escape':
                instance.close();
                break;
            default:
                break;
        }
    }
}
