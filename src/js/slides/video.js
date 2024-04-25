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
        if (isHlsVideo(url)) {
            injectAssets(this.settings.plyr.hls, 'Hls', () =>
                initHlsVideo(url, video, playerConfig, videoPlayers, callback, slide, videoID)
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

function isHlsVideo(url) {
    return url && url.match(/applehttp/g);
}

function isHlsSupported() {
    return Hls?.isSupported();
}

function initHlsVideo(url, video, defaultOptions, videoPlayers, callback, slide, videoID) {
    if (!isHlsSupported()) {
        console.error('HLS.js is not supported');
        return;
    }
    const hls = new Hls();
    hls.loadSource(url);

    hls.on(Hls.Events.MANIFEST_PARSED, function () {

        // Transform available levels into an array of integers (height values).
        const availableQualities = hls.levels.map((l) => l.height);
        availableQualities.unshift(0); //prepend 0 to quality array

        // Add new qualities to option
        defaultOptions.quality = {
            default: 0, //Default - AUTO
            options: availableQualities,
            forced: true,
            onChange: (e) => updateQuality(e)
        };

        defaultOptions.i18n = {
            qualityLabel: {
                0: 'Auto'
            }
        };

        hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
            const span = document.querySelector('.plyr__menu__container [data-plyr=\'quality\'][value=\'0\'] span');
            if (hls.autoLevelEnabled) {
                span.innerHTML = `AUTO (${hls.levels[data.level].height}p)`;
            } else {
                span.innerHTML = 'AUTO';
            }
        });
        initPlyr(video, defaultOptions, videoPlayers, callback, slide, videoID);
    });

    hls.attachMedia(video);
    window.yotpoHls = hls;
}

function updateQuality(newQuality) {
    if (newQuality === 0) {
        window.yotpoHls.currentLevel = -1; //Enable AUTO quality if option.value = 0
    } else {
        window.yotpoHls.levels.forEach((level, levelIndex) => {
            if (level.height === newQuality) {
                console.log('Found quality match with ' + newQuality);
                window.yotpoHls.currentLevel = levelIndex;
            }
        });
    }
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
