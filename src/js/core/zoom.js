/**
 * ZoomImages
 * Allow imaes to zoom and drag
 * for desktops
 *
 * @param {node} img node
 * @param {node} slide container
 * @param {function} function to trigger on close
 */
export default class ZoomImages {
    constructor(el, slide, onclose = null) {
        this.img = el;
        this.slide = slide;
        this.onclose = onclose;

        if (this.img.setZoomEvents) {
            return false;
        }

        this.active = false;
        this.zoomedIn = false;
        this.dragging = false;
        this.currentX = null;
        this.currentY = null;
        this.initialX = null;
        this.initialY = null;
        this.xOffset = 0;
        this.yOffset = 0;

        this.img.addEventListener('mousedown', (e) => this.dragStart(e), false);
        this.img.addEventListener('mouseup', (e) => this.dragEnd(e), false);
        this.img.addEventListener('mousemove', (e) => this.drag(e), false);

        this.img.addEventListener(
            'click',
            (e) => {
                if (this.slide.classList.contains('dragging-nav')) {
                    this.zoomOut();
                    return false;
                }

                if (!this.zoomedIn) {
                    return this.zoomIn();
                }
                if (this.zoomedIn && !this.dragging) {
                    this.zoomOut();
                }
            },
            false
        );

        this.img.setZoomEvents = true;
    }
    zoomIn() {
        let winWidth = this.widowWidth();

        if (this.zoomedIn || winWidth <= 768) {
            return;
        }

        const img = this.img;
        img.setAttribute('data-style', img.getAttribute('style'));
        img.style.maxWidth = img.naturalWidth + 'px';
        img.style.maxHeight = img.naturalHeight + 'px';

        if (img.naturalWidth > winWidth) {
            let centerX = winWidth / 2 - img.naturalWidth / 2;
            this.setTranslate(this.img.parentNode, centerX, 0);
        }
        this.slide.classList.add('zoomed');
        this.zoomedIn = true;
    }
    zoomOut() {
        this.img.parentNode.setAttribute('style', '');
        this.img.setAttribute('style', this.img.getAttribute('data-style'));
        this.slide.classList.remove('zoomed');
        this.zoomedIn = false;
        this.currentX = null;
        this.currentY = null;
        this.initialX = null;
        this.initialY = null;
        this.xOffset = 0;
        this.yOffset = 0;

        if (this.onclose && typeof this.onclose == 'function') {
            this.onclose();
        }
    }
    dragStart(e) {
        e.preventDefault();
        if (!this.zoomedIn) {
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

        if (e.target === this.img) {
            this.active = true;
            this.img.classList.add('dragging');
        }
    }
    dragEnd(e) {
        e.preventDefault();
        this.initialX = this.currentX;
        this.initialY = this.currentY;
        this.active = false;

        setTimeout(() => {
            this.dragging = false;
            this.img.isDragging = false;
            this.img.classList.remove('dragging');
        }, 100);
    }
    drag(e) {
        if (this.active) {
            e.preventDefault();

            if (e.type === 'touchmove') {
                this.currentX = e.touches[0].clientX - this.initialX;
                this.currentY = e.touches[0].clientY - this.initialY;
            } else {
                this.currentX = e.clientX - this.initialX;
                this.currentY = e.clientY - this.initialY;
            }

            this.xOffset = this.currentX;
            this.yOffset = this.currentY;

            this.img.isDragging = true;
            this.dragging = true;

            this.setTranslate(this.img, this.currentX, this.currentY);
        }
    }
    onMove(e) {
        if (!this.zoomedIn) {
            return;
        }
        let xOffset = e.clientX - this.img.naturalWidth / 2;
        let yOffset = e.clientY - this.img.naturalHeight / 2;

        this.setTranslate(this.img, xOffset, yOffset);
    }
    setTranslate(node, xPos, yPos) {
        node.style.transform = 'translate3d(' + xPos + 'px, ' + yPos + 'px, 0)';
    }
    widowWidth() {
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }
}
