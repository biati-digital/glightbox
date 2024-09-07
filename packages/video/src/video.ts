import type { BuildParams, PluginAssets, PluginOptions, PluginType } from '@glightbox/plugin-core';
import { GLightboxPlugin } from '@glightbox/plugin-core';
import { createIframe, mergeObjects } from '@glightbox/utils';

declare const Vimeo;
declare const YT;

export type VideoTypes = 'youtube' | 'vimeo' | 'local';

export interface VideoOptions extends PluginOptions {
    maxWidth?: string;
    aspectRatio?: string;
    verticalAspectRatio?: string;
    autoPlay?: boolean;
    injectAssets?: boolean;
    vimeo?: {
        api: string;
        params?: { [key: string]: string | number | boolean }
    };
    youtube?: {
        api: string;
        params?: { [key: string]: string | number | boolean }
    };
}

export interface VideoPlayer {
    paused: boolean;
    duration: number;
    play(): void;
    playVideo(): void;
    pause(): void;
    pauseVideo(): void;
    stop(): void;
    addEventListener(event: string, cb: () => void): void;
}

export default class VideoSlide extends GLightboxPlugin {
    name = 'video';
    type: PluginType = 'slide';
    options: VideoOptions = {};
    players = new Map<string, unknown>();
    vimeoPlayers = new Map<string, unknown>();
    youtubePlayers = new Map<string, unknown>();
    defaults: VideoOptions = {
        maxWidth: '840px',
        aspectRatio: '16/9',
        verticalAspectRatio: '9/16',
        autoPlay: true,
        injectAssets: true,
        vimeo: {
            api: 'https://player.vimeo.com/api/player.js',
            params: {
                api: 1,
                byline: false,
                portrait: false,
                title: true,
                transparent: false
            }
        },
        youtube: {
            api: 'https://www.youtube.com/iframe_api',
            params: {
                enablejsapi: 1,
                rel: 0,
                showinfo: 0,
                noCookie: true,
                iv_load_policy: 3
            }
        },
    };
    private iframeAttrs: { [key: string]: string } = {
        'allow': `autoplay; fullscreen; picture-in-picture`,
        'class': 'gl-video',
        'frameborder': '0',
        'data-type': '',
    };

    constructor(options: Partial<VideoOptions> = {}) {
        super();
        this.options = mergeObjects(this.defaults, options);
    }

    init(): void {
        this.instance.on('slide_before_change', () => {
            const currentSlide = this.instance.getActiveSlide();
            this.playerDoAction(currentSlide, 'pause');
        });

        if (this.options.autoPlay) {
            this.instance.on('slide_changed', () => {
                const currentSlide = this.instance.getActiveSlide();
                this.playerDoAction(currentSlide, 'play');
            });
        }
    }

    public match(url: string): boolean {
        let matches = false;
        if (this.isVimeo(url) || this.isYoutube(url) || this.isRegularVideo(url)) {
            matches = true;
        }
        return matches;
    }

    public async build({ index, slide, config }: BuildParams): Promise<boolean> {
        const randID = Math.floor(Math.random() * Date.now()) + index;
        const id = `gl-player-${randID}`;
        const videoWidth = config?.width || this.options.maxWidth;
        const aspectRatio = config?.aspectRatio || this.options.aspectRatio;

        slide?.style.setProperty('--gl-video-max-width', videoWidth);
        slide?.style.setProperty('--gl-video-aspect-ratio', aspectRatio as string);

        if (this.isRegularVideo(config.url)) {
            await this.buildVideo(slide, { ...config, id });
        } else if (this.isVimeo(config.url)) {
            await this.buildVimeo(slide, { ...config, id });
        } else if (this.isYoutube(config.url)) {
            await this.buildYoutube(slide, { ...config, id });
        }

        return true;
    }

    private buildVideo(slide, config) {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            const playerAttr: { [key: string]: string | boolean | null } = {
                'id': config.id,
                'src': config.url,
                'class': 'gl-video-player',
                'controls': '',
                'playsinline': '',
                'data-type': 'local',
                'preload': 'auto'
            };
            for (const [key, value] of Object.entries(playerAttr)) {
                video.setAttribute(key, value as string);
            }

            video.addEventListener("canplay", (event) => {
                this.instance.trigger('video_api_ready', { id: config.id, api: video });
                resolve(true);
            });
            this.players.set(config.id, video);
            slide.appendChild(video);
        });
    }

    private buildVimeo(slide, config) {
        return new Promise((resolve) => {
            const vimeoID = /vimeo.*\/(\d+)/i.exec(config.url);
            const params = this.buildURLParams(this.options?.vimeo?.params ?? {});
            const videoUrl = `https://player.vimeo.com/video/${vimeoID[1]}?${params}`

            const iframe = createIframe({
                url: videoUrl,
                appendTo: slide,
                attrs: {
                    ...this.iframeAttrs,
                    'id': config.id,
                    'data-type': 'vimeo'
                }
            }) as HTMLIFrameElement;

            iframe.onload = () => {
                iframe.onload = null;

                const playerAPI = new Vimeo.Player(iframe);
                this.vimeoPlayers.set(config.id, playerAPI);
                playerAPI.ready().then(() => {
                    this.instance.trigger('video_api_ready', { id: config.id, api: playerAPI });
                    resolve(true);
                });
            };
        });
    }

    private buildYoutube(slide, config) {
        return new Promise((resolve) => {
            const [a, , b] = config.url.replace(/(>|<)/gi, '').split(/^.*(?:(?:youtu\.?be(\.com)?\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/)
            const youtubeID = b !== undefined ? b.split(/[^0-9a-z_-]/i)[0] : a
            if (!youtubeID) {
                throw new Error('Unable to get Youtube video ID');
            }

            const params = this.buildURLParams(this.options?.youtube?.params ?? {});
            const videoUrl = `https://www.youtube.com/embed/${youtubeID}?${params}`

            if (config.url.includes('shorts')) {
                slide?.style.setProperty('--gl-video-max-width', '460px');
                slide?.style.setProperty('--gl-video-aspect-ratio', this.options.verticalAspectRatio);
            }

            const iframe = createIframe({
                url: videoUrl,
                appendTo: slide,
                attrs: {
                    ...this.iframeAttrs,
                    'id': config.id,
                    'data-type': 'youtube'
                }
            }) as HTMLIFrameElement;

            iframe.onload = () => {
                iframe.onload = null;

                const playerAPI = new YT.Player(iframe, {
                    events: {
                        'onReady': (e) => {
                            this.instance.trigger('video_api_ready', { id: config.id, api: playerAPI });
                            resolve(true);
                        }
                    }
                });
                playerAPI.play = () => { playerAPI.playVideo() };
                playerAPI.pause = () => { playerAPI.pauseVideo() };
                this.youtubePlayers.set(config.id, playerAPI);
            };
        });
    }


    private getSlidePlayer(slideNode): false | { type: VideoTypes; node: HTMLIFrameElement; id: string; api: VideoPlayer } {
        const iframe = slideNode.querySelector('iframe.gl-video');
        const video = slideNode.querySelector('video.gl-video-player');
        if (!iframe && !video) {
            return false;
        }

        const node = iframe || video;
        const playerID = node.id;
        const type = node.dataset.type;
        const reponse = {
            type,
            node,
            id: playerID,
            api: undefined
        };

        if (type === 'local') {
            reponse.api = node as VideoPlayer;
            return reponse;
        }
        if (type === 'vimeo') {
            reponse.api = this.vimeoPlayers.get(playerID) as VideoPlayer;
            return reponse;
        }
        if (type === 'youtube') {
            reponse.api = this.youtubePlayers.get(playerID) as VideoPlayer;
            return reponse;
        }

        return false;
    }

    public playerDoAction(slide: HTMLElement, action: string): void {
        const player = this.getSlidePlayer(slide);
        if (!player) {
            return;
        }
        // API has not finished loading, listen for it
        if (!player?.api) {
            this.instance.once('video_api_ready', (data) => {
                if (data?.id === player?.id) {
                    this.playerDoAction(slide, action);
                }
            });
            return;
        }
        const actions = {
            'play': player.api.play,
            'pause': player.api.pause
        }
        if (action in actions) {
            actions[action].apply(player.api);
        }
    }

    private isVimeo(url: string): boolean {
        return url.includes('vimeo.com');
    }

    private isYoutube(url: string): boolean {
        if (url.includes('youtube.com') ||
            url.includes('youtu.be') ||
            url.includes('youtube-nocookie.com')
        ) {
            return true;
        }
        return false;
    }

    private isRegularVideo(url: string): boolean {
        if (url.match(/\.(mpg|avi|webm|mov|ogv|mp4)/)) {
            return true;
        }
        return false;
    }

    private buildURLParams(params: Record<string, string | number | boolean>): string {
        return Object.keys(params).map(key => {
            let val = params[key];
            if (val === false) { val = '0' }
            if (val === true) { val = '1' }
            return `${key}=${val}`;
        }).join('&');
    }

    destroy(): void {
        this.players = new Map();
        this.vimeoPlayers = new Map();
        this.youtubePlayers = new Map();
    }

    assets(): false | PluginAssets {
        if (!this.options?.injectAssets) {
            return false;
        }

        const apiAssets = [];
        if (this.options?.vimeo?.api) {
            apiAssets.push({ src: this.options.vimeo.api });
        }
        if (this.options?.youtube?.api) {
            apiAssets.push({ src: this.options.youtube.api });
        }

        return {
            js: apiAssets
        };
    }

    cssStyle(): string {
        return `
            .gl-type-video {
                width: var(--gl-video-max-width, 768px);
                max-width: calc(85vmin + (var(--gl-video-max-width) / 2));
                max-height: 100vmin;
                aspect-ratio: var(--gl-video-aspect-ratio, 16/9);
                background-color: var(--gl-video-background-color, #000000);
            }

            .gl-video-player {
                width: 100%;
                height: 100%;
            }
        `;
    }
}
