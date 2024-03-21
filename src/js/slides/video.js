/**
 * Set slide video
 *
 * @param {node} slide
 * @param {object} data
 * @param {int} index
 * @param {function} callback
 */
import { has, closest, injectAssets, addClass, removeClass, createHTML, isFunction, waitUntil } from '../utils/helpers.js';

export default function slideVideo(slide, data, index, callback) {
    const slideContainer = slide.querySelector('.ginner-container');
    const videoID = 'gvideo' + index;
    const slideMedia = slide.querySelector('.gslide-media');
    const videoPlayers = this.getAllPlayers();

    addClass(slideContainer, 'gvideo-container');

    slideMedia.insertBefore(createHTML('<div class="gvideo-wrapper"></div>'), slideMedia.firstChild);

    const videoWrapper = slide.querySelector('.gvideo-wrapper');

    if (typeof this.settings.plyr.css === 'function') {
        this.settings.plyr.css();
    } else {
        injectAssets(this.settings.plyr.css, 'Plyr');
    }

    let url = data.href;
    let provider = data?.videoProvider;
    let customPlaceholder = false;

    slideMedia.style.maxWidth = data.width;

    const initPlyr = (Plyr, config) => {
        // Set vimeo videos
        if (!provider && url.match(/vimeo\.com\/([0-9]*)/)) {
            provider = 'vimeo';
        }

        // Set youtube videos
        if (
            !provider &&
            (url.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/) || url.match(/(youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9\-_]+)/))
        ) {
            provider = 'youtube';
        }

        // Set local videos
        // if no provider, default to local
        if (provider === 'local' || !provider) {
            provider = 'local';

            const video = document.createElement('video');
            video.id = videoID;
            video.className = 'gvideo-local';
            video.preload = 'metadata';
            video.playsInline = true;
            video.controls = true;
            video.style.background = '#000';
            video.style.maxWidth = data.width;
            video.setAttribute('x-webkit-airplay', 'allow');

            const source = document.createElement('source');
            source.src = url;
            video.appendChild(source);

            customPlaceholder = video;
        }

        if (!customPlaceholder) {
            customPlaceholder = document.createElement('div');
            customPlaceholder.id = videoID;
            customPlaceholder.dataset.plyrProvider = provider;
            customPlaceholder.dataset.plyrEmbedId = url;
        }

        addClass(videoWrapper, `${provider}-video gvideo`);
        videoWrapper.appendChild(customPlaceholder);
        videoWrapper.setAttribute('data-id', videoID);
        videoWrapper.setAttribute('data-index', index);

        const playerConfig = config || (has(this.settings.plyr, 'config') ? this.settings.plyr.config : {});
        const player = new Plyr('#' + videoID, playerConfig);

        player.on('ready', (event) => {
            videoPlayers[videoID] = event.detail.plyr;
            if (isFunction(callback)) {
                callback();
            }
        });
        waitUntil(
            () => {
                return slide.querySelector('iframe') && slide.querySelector('iframe').dataset.ready == 'true';
            },
            () => {
                this.resize(slide);
            }
        );
        player.on('enterfullscreen', handleMediaFullScreen);
        player.on('exitfullscreen', handleMediaFullScreen);
    }

    if (typeof this.settings.plyr.js === 'function') {
        this.settings.plyr.js().then(v => initPlyr(v.Plyr, v.config));
    } else {
        injectAssets(this.settings.plyr.js, 'Plyr', () => initPlyr(window.Plyr));
    }
}

/**
 * Handle fullscreen
 *
 * @param {object} event
 */
function handleMediaFullScreen(event) {
    const media = closest(event.target, '.gslide-media');

    if (event.type === 'enterfullscreen') {
        addClass(media, 'fullscreen');
    }
    if (event.type === 'exitfullscreen') {
        removeClass(media, 'fullscreen');
    }
}
