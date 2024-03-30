import type { PluginOptions, PluginType } from '@glightbox/plugin-core';
import { GLightboxPlugin } from '@glightbox/plugin-core';

export interface DragOptions extends PluginOptions {
    dragToleranceX?: number;
}

export default class DragNavigation extends GLightboxPlugin {
    name = 'drag';
    type: PluginType = 'other';
    options: DragOptions = {};
    isDown: boolean = false;
    slider: HTMLElement | null = null;
    actveSlide: HTMLElement | null = null;
    startX = 0;
    scrollLeft: number = 0;
    activeSlideIndex: number = 0;
    movedAmount: number = 0;
    movedDirection: string = '';
    defaults: DragOptions = {
        dragToleranceX: 10
    };
    mouseDownEvent: ((e: MouseEvent) => void) | null = null;
    mouseLeaveEvent: ((e: MouseEvent) => void) | null = null;
    mouseUpEvent: ((e: MouseEvent) => void) | null = null;
    mouseMoveEvent: ((e: MouseEvent) => void) | null = null;

    constructor(options: Partial<DragOptions> = {}) {
        super();
        this.options = { ...this.defaults, ...options };
    }

    init(): void {
        const slider = document.querySelector<HTMLElement>('.gl-slider');
        if (!slider) {
            return;
        }

        this.mouseDownEvent = this.onMouseDown.bind(this);
        this.mouseLeaveEvent = this.onMouseLeave.bind(this);
        this.mouseUpEvent = this.onMouseUp.bind(this);
        this.mouseMoveEvent = this.onMouseMove.bind(this);

        slider.addEventListener('mousedown', this.mouseDownEvent);
        slider.addEventListener('mouseleave', this.mouseLeaveEvent);
        slider.addEventListener('mouseup', this.mouseUpEvent);
        slider.addEventListener('mousemove', this.mouseMoveEvent);
        this.slider = slider;
    }

    destroy(): void {
        this.mouseDownEvent && this.slider?.removeEventListener('mousedown', this.mouseDownEvent);
        this.mouseLeaveEvent && this.slider?.removeEventListener('mouseleave', this.mouseLeaveEvent);
        this.mouseUpEvent && this.slider?.removeEventListener('mouseup', this.mouseUpEvent);
        this.mouseMoveEvent && this.slider?.removeEventListener('mousemove', this.mouseMoveEvent);
    }

    onMouseDown(e: MouseEvent) {
        if (!this.slider) {
            return;
        }
        this.isDown = true;
        this.slider?.classList.add('doing-drag');
        this.startX = e.pageX - this.slider.offsetLeft;
        this.scrollLeft = this.slider.scrollLeft;
        this.actveSlide = this.slider.querySelector('.visible');
        this.activeSlideIndex = parseInt(this.actveSlide?.getAttribute('data-index') || '0');
    }

    onMouseUp() {
        this.isDown = false;
        let scrollTo = this.actveSlide;
        if (this.movedAmount > 10) {
            const nextIndex = this.movedDirection === 'right' ? this.activeSlideIndex + 1 : this.activeSlideIndex - 1;
            const next = this.slider?.querySelector<HTMLElement>(`div[data-index="${nextIndex}"]`);
            if (next) {
                scrollTo = next;
            }
        }
        this.slider?.addEventListener('scrollend', this.removeDragClass);
        scrollTo?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
    }

    onMouseMove(e: MouseEvent) {
        if (!this.isDown || !this.slider) {
            return;
        }
        e.preventDefault();

        const x = e.pageX - this.slider.offsetLeft;
        const SCROLL_SPEED = 1;
        const walk = (x - this.startX) * SCROLL_SPEED;

        const sliderWidth = this.slider.clientWidth;
        let moved = this.scrollLeft - walk;
        if (this.activeSlideIndex > 0) {
            moved = moved - (sliderWidth * this.activeSlideIndex + 1);
        }
        const percentage = (moved / sliderWidth) * 100;
        this.movedDirection = percentage > 0 ? 'right' : 'left';
        this.slider.scrollLeft = this.scrollLeft - walk;
        this.movedAmount = Math.abs(percentage);
    }

    onMouseLeave() {
        this.isDown = false;
        this.slider?.classList.remove('doing-drag');
    }

    removeDragClass() {
        this.slider?.classList.remove('doing-drag');
        this.slider?.removeEventListener('scrollend', this.removeDragClass);
    }
}
