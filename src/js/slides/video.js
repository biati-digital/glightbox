/**
 * Set slide video
 *
 * @param {node} slide
 * @param {object} data
 * @param {int} index
 * @param {function} callback
 */
import {
    has,
    closest,
    injectAssets,
    addClass,
    removeClass,
    createHTML,
    isFunction,
    waitUntil
} from '../utils/helpers.js';

export default function slideVideo(slide, data, index, callback) {
    const slideContainer = slide.querySelector('.ginner-container');
    const videoID = 'gvideo' + index;
    const slideMedia = slide.querySelector('.gslide-media');
    const videoPlayers = this.getAllPlayers();

    addClass(slideContainer, 'gvideo-container');

    slideMedia.insertBefore(createHTML('<div class="gvideo-wrapper"></div>'), slideMedia.firstChild);

    const videoWrapper = slide.querySelector('.gvideo-wrapper');

    injectAssets(this.settings.plyr.css, 'Plyr', null);

    let url = data.href;
    let provider = data?.videoProvider;
    let customPlaceholder = false;

    slideMedia.style.maxWidth = data.width;

    injectAssets(this.settings.plyr.js, 'Plyr', () => {
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
            let html = '<video id="' + videoID + '" ';
            html += `style="background:#000; max-width: ${data.width};" `;
            html += 'preload="metadata" ';
            html += 'x-webkit-airplay="allow" ';
            html += 'playsinline ';
            html += 'controls ';
            html += 'class="gvideo-local">';
            html += `<source src="${url}">`;
            html += '</video>';
            customPlaceholder = createHTML(html);
        }

        // prettier-ignore
        const placeholder = customPlaceholder ? customPlaceholder : createHTML(`<div id="${videoID}" data-plyr-provider="${provider}" data-plyr-embed-id="${url}"></div>`);

        addClass(videoWrapper, `${provider}-video gvideo`);
        videoWrapper.appendChild(placeholder);
        videoWrapper.setAttribute('data-id', videoID);
        videoWrapper.setAttribute('data-index', index);

        const playerConfig = has(this.settings.plyr, 'config') ? this.settings.plyr.config : {};
        const video = document.getElementById(videoID);
        if (isDashVideo(url)) {
            injectAssets(this.settings.plyr.dash, 'dashjs', () =>
                initDashVideo(url, video, playerConfig, videoPlayers, callback, slide, videoID)
            );
        } else {
            initPlyr(video, playerConfig, videoPlayers, callback, slide, videoID);
        }
    });
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

function isDashVideo(url) {
    return url && url.match(/mpegdash/g);
}

function initDashVideo(url, video, defaultOptions, videoPlayers, callback, slide, videoID) {
    // eslint-disable-next-line new-cap
    const yotpoDashPlayer = dashjs.MediaPlayer().create();
    yotpoDashPlayer.initialize(video, url, true);
    yotpoDashPlayer.on('streamInitialized', function () {
        defaultOptions = configureQualityOptions(yotpoDashPlayer, defaultOptions, videoID);
        initPlyr(video, defaultOptions, videoPlayers, callback, slide, videoID);
        let settings = yotpoDashPlayer.getSettings();
        settings.streaming.abr.autoSwitchBitrate.video = true;
    });
}

function configureQualityOptions(yotpoDashPlayer, defaultOptions) {
    const bitratesInfo = yotpoDashPlayer.getBitrateInfoListFor('video');
    const bitrate = [];
    bitrate.unshift(0);
    for (let i = 0; i < bitratesInfo.length; i++) {
        bitrate.push(bitratesInfo[i]['height']);
    }

    defaultOptions.quality = {
        default: bitrate[0],
        options: bitrate,
        forced: true,
        onChange: (newQuality) => {
            let settings = yotpoDashPlayer.getSettings();
            const bitratesInfo = yotpoDashPlayer.getBitrateInfoListFor('video');
            if (newQuality === 0) {
                settings.streaming.abr.autoSwitchBitrate.video = true;
                yotpoDashPlayer.updateSettings(settings);
            } else {
                settings.streaming.abr.autoSwitchBitrate.video = false;
                yotpoDashPlayer.updateSettings(settings);
                let qualityIndex = bitratesInfo.findIndex(b => b.height === newQuality);
                if (qualityIndex !== -1) {
                    yotpoDashPlayer.setQualityFor('video', qualityIndex, true);
                }
            }
        }
    };

    defaultOptions.i18n = {
        qualityLabel: {
            0: 'Auto'
        }
    };

    return defaultOptions;
}

function initPlyr(video, defaultOptions, videoPlayers, callback, slide, videoID) {
    const player = new Plyr(video, defaultOptions);
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
        },
        null,
        null
    );
    player.on('enterfullscreen', handleMediaFullScreen);
    player.on('exitfullscreen', handleMediaFullScreen);
    return player;
}
