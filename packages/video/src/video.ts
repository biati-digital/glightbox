import type { BuildParams, PluginAssets, PluginOptions, PluginType } from '@glightbox/plugin-core';
import { GLightboxPlugin } from '@glightbox/plugin-core';
import { waitUntil } from '@glightbox/utils';

declare const VidstackPlayer;

export interface VideoOptions extends PluginOptions {
    maxWidth?: string;
    autoPlay?: boolean;
    injectAssets?: boolean;
    customAssets?: {
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
    options: VideoOptions = {};
    players = new Map<string, unknown>();
    playerAssets: PluginAssets;
    defaults: VideoOptions = {
        maxWidth: '840px',
        autoPlay: true,
        injectAssets: true,
        vistack: {}
    };

    constructor(options: Partial<VideoOptions> = {}) {
        super();
        this.options = { ...this.defaults, ...options };
        this.playerAssets = {
            'css': [
                'https://cdn.vidstack.io/player/theme.css',
                'https://cdn.vidstack.io/player/video.css'
            ],
            'js': [{
                'src': 'https://cdn.vidstack.io/player',
                'module': true
            }]
        };
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
        const id = `gl-player-${randID}`;
        const videoWidth = config?.width || this.options.maxWidth;
        const placeholder = document.createElement('div');

        placeholder.id = id;

        slide?.appendChild(placeholder);
        slide?.style.setProperty('--gl-video-max-width', videoWidth);

        await waitUntil(() => {
            return typeof VidstackPlayer === 'function';
        });

        const player = await VidstackPlayer.create({
            target: placeholder,
            src: config?.url,
            title: config?.title,
            layout: new VidstackPlayer.Layout.Default(),
        });

        this.players.set(`player-${index}`, player);

        return true;
    }

    private slideHasPlayer(slideIndex): false | VideoPlayer {
        if (this.players.has(`player-${slideIndex}`)) {
            return this.players.get(`player-${slideIndex}`) as VideoPlayer;
        }
        return false;
    }

    assets(): false | PluginAssets {
        if (!this.options.injectAssets) {
            return false;
        }
        if (this.options?.customAssets) {
            return this.options.customAssets;
        }
        return this.playerAssets;
    }

    cssStyle(): string {
        return `
            .gl-type-video {
                width: 100%;
                max-width: var(--gl-video-max-width, 768px);
                aspect-ratio: 16/9;
                background-color: var(--gl-video-background-color, #000000);
            }
            .gl-type-video :where(.vds-video-layout .vds-controls-group) {
                display: flex;
            }
        `;
    }
}
