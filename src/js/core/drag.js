/**
 * DragSlides
 * Allow imaes to be dragged for prev and next
 * in desktops
 *
 * @param { object } config
 */

import { closest } from '../utils/helpers.js';

export default class DragSlides {
    constructor(config = {}) {
        let { dragEl, toleranceX = 40, toleranceY = 65, slide = null, instance = null } = config;

        this.el = dragEl;
        this.active = false;
        this.dragging = false;
        this.currentX = null;
        this.currentY = null;
        this.initialX = null;
        this.initialY = null;
        this.xOffset = 0;
        this.yOffset = 0;
        this.direction = null;
        this.lastDirection = null;
        this.toleranceX = toleranceX;
        this.toleranceY = toleranceY;
        this.toleranceReached = false;
        this.dragContainer = this.el;
        this.slide = slide;
        this.instance = instance;

        this.el.addEventListener('mousedown', (e) => this.dragStart(e), false);
        this.el.addEventListener('mouseup', (e) => this.dragEnd(e), false);
        this.el.addEventListener('mousemove', (e) => this.drag(e), false);
    }
    dragStart(e) {
        if (this.slide.classList.contains('zoomed')) {
            this.active = false;
            return;
        }

        if (e.type === 'touchstart') {
            this.initialX = e.touches[0].clientX - this.xOffset;
            this.initialY = e.touches[0].clientY - this.yOffset;
        } else {
            this.initialX = e.clientX - this.xOffset;
            this.initialY = e.clientY - this.yOffset;
        }

        let clicked = e.target.nodeName.toLowerCase();
        let exludeClicks = ['input', 'select', 'textarea', 'button', 'a'];
        if (
            e.target.classList.contains('nodrag') ||
            closest(e.target, '.nodrag') ||
            exludeClicks.indexOf(clicked) !== -1
        ) {
            this.active = false;
            return;
        }

        e.preventDefault();

        if (e.target === this.el || (clicked !== 'img' && closest(e.target, '.gslide-inline'))) {
            this.active = true;
            this.el.classList.add('dragging');
            this.dragContainer = closest(e.target, '.ginner-container');
        }
    }
    dragEnd(e) {
        e && e.preventDefault();
        this.initialX = 0;
        this.initialY = 0;
        this.currentX = null;
        this.currentY = null;
        this.initialX = null;
        this.initialY = null;
        this.xOffset = 0;
        this.yOffset = 0;
        this.active = false;

        if (this.doSlideChange) {
            this.instance.preventOutsideClick = true;
            this.doSlideChange == 'right' && this.instance.prevSlide();
            this.doSlideChange == 'left' && this.instance.nextSlide();
        }

        if (this.doSlideClose) {
            this.instance.close();
        }

        if (!this.toleranceReached) {
            this.setTranslate(this.dragContainer, 0, 0, true);
        }

        setTimeout(() => {
            this.instance.preventOutsideClick = false;
            this.toleranceReached = false;
            this.lastDirection = null;
            this.dragging = false;
            this.el.isDragging = false;
            this.el.classList.remove('dragging');
            this.slide.classList.remove('dragging-nav');
            this.dragContainer.style.transform = '';
            this.dragContainer.style.transition = '';
        }, 100);
    }
    drag(e) {
        if (this.active) {
            e.preventDefault();

            this.slide.classList.add('dragging-nav');

            if (e.type === 'touchmove') {
                this.currentX = e.touches[0].clientX - this.initialX;
                this.currentY = e.touches[0].clientY - this.initialY;
            } else {
                this.currentX = e.clientX - this.initialX;
                this.currentY = e.clientY - this.initialY;
            }

            this.xOffset = this.currentX;
            this.yOffset = this.currentY;

            this.el.isDragging = true;
            this.dragging = true;
            this.doSlideChange = false;
            this.doSlideClose = false;

            let currentXInt = Math.abs(this.currentX);
            let currentYInt = Math.abs(this.currentY);

            // Horizontal drag
            if (
                currentXInt > 0 &&
                currentXInt >= Math.abs(this.currentY) &&
                (!this.lastDirection || this.lastDirection == 'x')
            ) {
                this.yOffset = 0;
                this.lastDirection = 'x';
                this.setTranslate(this.dragContainer, this.currentX, 0);

                let doChange = this.shouldChange();
                if (!this.instance.settings.dragAutoSnap && doChange) {
                    this.doSlideChange = doChange;
                }

                if (this.instance.settings.dragAutoSnap && doChange) {
                    this.instance.preventOutsideClick = true;
                    this.toleranceReached = true;
                    this.active = false;
                    this.instance.preventOutsideClick = true;
                    this.dragEnd(null);
                    doChange == 'right' && this.instance.prevSlide();
                    doChange == 'left' && this.instance.nextSlide();
                    return;
                }
            }

            // Vertical drag
            if (
                this.toleranceY > 0 &&
                currentYInt > 0 &&
                currentYInt >= currentXInt &&
                (!this.lastDirection || this.lastDirection == 'y')
            ) {
                this.xOffset = 0;
                this.lastDirection = 'y';
                this.setTranslate(this.dragContainer, 0, this.currentY);

                let doClose = this.shouldClose();

                if (!this.instance.settings.dragAutoSnap && doClose) {
                    this.doSlideClose = true;
                }
                if (this.instance.settings.dragAutoSnap && doClose) {
                    this.instance.close();
                }
                return;
            }
        }
    }

    shouldChange() {
        let doChange = false;
        let currentXInt = Math.abs(this.currentX);

        if (currentXInt >= this.toleranceX) {
            let dragDir = this.currentX > 0 ? 'right' : 'left';

            if (
                (dragDir == 'left' && this.slide !== this.slide.parentNode.lastChild) ||
                (dragDir == 'right' && this.slide !== this.slide.parentNode.firstChild)
            ) {
                doChange = dragDir;
            }
        }
        return doChange;
    }

    shouldClose() {
        let doClose = false;
        let currentYInt = Math.abs(this.currentY);

        if (currentYInt >= this.toleranceY) {
            doClose = true;
        }
        return doClose;
    }

    setTranslate(node, xPos, yPos, animated = false) {
        if (animated) {
            node.style.transition = 'all .2s ease';
        } else {
            node.style.transition = '';
        }
        node.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }
}
