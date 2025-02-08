import type { BuildParams, PluginOptions, PluginType } from '@glightbox/plugin-core';
import { GLightboxPlugin } from '@glightbox/plugin-core';

export interface ImageOptions extends PluginOptions {
    maxWidth?: string;
}

export default class ImageSlide extends GLightboxPlugin {
    name = 'image';
    type: PluginType = 'slide';
    options: ImageOptions = {};
    defaults: ImageOptions = {
        maxWidth: '100vw'
    };

    constructor(options: Partial<ImageOptions> = {}) {
        super();
        this.options = { ...this.defaults, ...options };
    }

    public match(url: string): boolean {
        let matches = false;
        if (url.match(/\.(jpeg|jpg|jpe|gif|png|apn|webp|avif|svg)/) !== null) {
            matches = true;
        }
        return matches;
    }

    build({ index, slide, config }: BuildParams): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const titleID = `gl-slide-title-${index}`;
            const imgWidth = config?.width || this.options.maxWidth;

            img.addEventListener('load', () => resolve(true), false);
            img.addEventListener('error', () => reject('There was an error loading the image'), false);
            img.src = config.url;

            img.alt = '';
            if (config?.alt) {
                img.alt = config.alt;
            }
            if (config?.title) {
                img.setAttribute('aria-labelledby', titleID);
            }

            const html = `<figure class="gl-figure"></figure>`;
            if (imgWidth) {
                slide?.style.setProperty('--gl-image-max-width', imgWidth);
            }
            slide?.insertAdjacentHTML('beforeend', html);
            slide?.querySelector('.gl-figure')?.insertAdjacentElement('afterbegin', img);
        });
    }

    cssStyle(): string {
        return `
            .gl-figure {
                margin: 0;
                padding: 0;
            }

            .gl-figure > img {
                display: block;
                height: auto;
            }

            .gl-figure img {
                max-width: var(--gl-image-max-width);
                pointer-events: none;
                user-select: none;
            }
        `;
    }
}
