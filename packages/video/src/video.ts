import type { BuildParams, PluginOptions, PluginType } from '@glightbox/plugin-core';
import { GLightboxPlugin } from '@glightbox/plugin-core';

export interface VideoOptions extends PluginOptions {
    maxWidth?: string;
    autoPlay?: boolean;
    injectAssets?: boolean;
    assets?: {
        css?: string[];
        js?: ({ src: string; module?: boolean })[];
    };
    vistack?: { [key: string]: unknown };
}

export interface VideoPlayer {
    paused: boolean;
    duration: number;
    play(): void;
    pause(): void;
    stop(): void;
    addEventListener(event: string, cb: () => void): void;
}

export default class VideoSlide extends GLightboxPlugin {
    name = 'video';
    type: PluginType = 'slide';
    options?: VideoOptions;
    players = new Map<string, unknown>();
    defaults: VideoOptions = {
        maxWidth: '840px',
        autoPlay: true,
        injectAssets: true,
        assets: {
            'css': [
                'https://cdn.jsdelivr.net/npm/vidstack@^1.0.0/player/styles/default/theme.min.css',
                'https://cdn.jsdelivr.net/npm/vidstack@^1.0.0/player/styles/default/layouts/video.min.css'
            ],
            'js': [{
                'src': 'https://cdn.jsdelivr.net/npm/vidstack@^1.0.0/cdn/vidstack.js',
                'module': true
            }]
        },
        vistack: {}
    };

    constructor(options: Partial<VideoOptions> = {}) {
        super();
        this.options = { ...this.defaults, ...options };
    }

    init(): void {
        this.instance.on('slide_before_change', () => {
            const currentSlide = this.instance.getActiveSlideIndex();
            const player = this.slideHasPlayer(currentSlide);
            if (player) {
                player?.pause();
            }
        });

        if (this.options.autoPlay) {
            this.instance.on('slide_changed', () => {
                const currentSlide = this.instance.getActiveSlideIndex();
                const player = this.slideHasPlayer(currentSlide);
                if (player) {
                    if (player?.paused && player?.duration) {
                        return player?.play();
                    }
                    player.addEventListener('can-play', () => player?.play());
                }
            });
        }
    }

    public match(url: string): boolean {
        let matches = false;
        if (
            url.match(/vimeo\.com\/([0-9]*)/) ||
            url.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) ||
            url.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/) ||
            url.match(/(youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9\-_]+)/) ||
            url.match(/(youtube\.com|youtube-nocookie\.com)\/shorts\/([a-zA-Z0-9\-_]+)/) ||
            url.match(/\.(mpg|avi|webm|mov|ogv|mp4)/) !== null
        ) {
            matches = true;
        }
        return matches;
    }

    async build({ index, slide, config }: BuildParams): Promise<boolean> {
        const randID = Math.floor(Math.random() * Date.now()) + index;
        const playerAttr: { [key: string]: string | boolean | null } = {
            'id': `gl-player-${randID}`,
            'class': 'gl-video-player',
            'viewType': 'video',
            'controls': true,
            'aspectRatio': '16/9',
            'src': config.url,
            'crossorigin': ''
        };
        const attrs = Object.entries(playerAttr).reduce((attrs, [key, value]) => {
            const val = !value ? key : `${key}="${String(value)}"`;
            return `${attrs} ${val}`;
        }, '');

        const html = `
            <media-player ${attrs}>
                <media-provider></media-provider>
                <media-audio-layout></media-audio-layout>
                <media-video-layout></media-video-layout>
            </media-player>`;

        const videoWidth = config?.width || this.options.maxWidth;

        slide?.insertAdjacentHTML('beforeend', html);
        if (videoWidth) {
            slide?.style.setProperty('--gl-video-max-width', videoWidth);
        }

        if (this.options?.injectAssets && this.options?.assets) {
            const cssAssets = this.options.assets?.css || [];
            const jsAssets = this.options.assets?.js || [];
            await this.instance.injectAssets([...cssAssets, ...jsAssets]);
        }

        const player = document.getElementById(`gl-player-${randID}`);
        this.players.set(`player-${index}`, player);
        return true;
    }

    private slideHasPlayer(slideIndex): false | VideoPlayer {
        if (this.players.has(`player-${slideIndex}`)) {
            return this.players.get(`player-${slideIndex}`) as VideoPlayer;
        }
        return false;
    }

    cssStyle(): string {
        return `
            .gl-type-video iframe.vds-youtube[data-no-controls] {
                height: 100%;
            }
            .gl-type-video .vds-blocker {
                display: none;
            }
            .gl-type-video {
                width: 100%;
                max-width: var(--gl-video-max-width, 768px);
                aspect-ratio: 16/9;
                background-color: var(--gl-video-background-color, #000000);
            }
        `;
    }
}
