// Type definitions for Glightbox 3.2.0
// Project: https://github.com/biati-digital/glightbox/blob/master/README.md
// Definitions by: Ngoc Tu Nguyen <https://github.com/tomasvn>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare namespace Glightbox {
    /**
     * Youtube iframe api
     * @see https://developers.google.com/youtube/player_parameters
     */
    interface YoutubeOptions {
        /**
         * Whether to use an alternative version of Youtube without cookies
         */
        noCookie?: boolean;
        /**
         * Show related videos
         */
        rel?: number;
        /**
         * Show video title
         * @see https://google.com/youtube/player_parameters#release_notes_08_23_2018
         * 
         * @deprecated
         */
        showinfo?: number;
        /**
         * Show or hide annotations
         */
        iv_load_policy?: number;
    }
    
    /**
     * Vimeo embed video api
     * 
     * @see https://help.vimeo.com/hc/en-us/articles/360001494447-Using-Player-Parameters
     */
    interface VimeoOptions {
        /**
         * Show the byline on the video.
         */
        byline?: boolean;
        /**
         * Show the author’s profile image (portrait)
         */
        portrait?: boolean;
        /**
         * Show the video’s title.
         */
        title?: boolean;
        /**
         * Enable or disable the background of the player
         */
        transparent?: boolean;
    }

    interface Config {
        /**
         * Set aspect ratio
         */
        ratio?: string;
        /**
         *  Toggles whether fullscreen should be enabled or
         *  whether to use native iOS fullscreen when entering
         *  fullscreen
         */
        fullscreen?: Record<'enabled' | 'iosNative', boolean>;
        youtube?: YoutubeOptions;
        vimeo?: VimeoOptions
    }

    interface PlyrOptions {
        /**
         * Get Plyr.js css files from cdn
         */
        css?: string;
        /**
         * Get Plyr.js js files from cdn
         */
        js?: string;
        config?: Config;
    }

    interface Options {
        /**
         * Name of the selector for example '.glightbox' or 'data-glightbox'
         * or '*[data-glightbox]'
         * 
         * @defaultValue '.glightbox'
         */
        selector?: string;
        /**
         * Instead of passing a selector you can pass all the items
         * that you want in the gallery.
         * 
         * @defaultValue null
         */
        elements?: [] | null;
        /**
         * Name of the skin, it will add a class to the lightbox
         * so you can style it with css.
         * 
         * @defaultValue 'clean'
         */
        skin?: string;
        /**
         * Name of the effect on lightbox open. (zoom, fade, none)
         * 
         * @defaultValue 'zoom'
         */
        openEffect?: string;
        /**
         * Name of the effect on lightbox close. (zoom, fade, none)
         * 
         * @defaultValue 'zoom'
         */
        closeEffect?: string;
        /**
         * Name of the effect on slide change. (slide, fade, zoom, none)
         * 
         * @defaultValue 'slide'
         */
        slideEffect?: string;
        /**
         * More text for descriptions on mobile devices.
         * 
         * @defaultValue 'See more'
         */
        moreText?: string;
        /**
         * Number of characters to display on the description before adding
         * the moreText link (only for mobiles),
         * if 0 it will display the entire description.
         * 
         * @defaultValue 60
         */
        moreLength?: number;
        /**
         * Show or hide the close button.
         * 
         * @defaultValue true
         */
        closeButton?: boolean;
        /**
         * Enable or disable the touch navigation (swipe).
         * 
         * @defaultValue true
         */
        touchNavigation?: boolean;
        /**
         * Image follow axis when dragging on mobile.
         * 
         * @defaultValue true
         */
        touchFollowAxis?: boolean;
        /**
         * Enable or disable the keyboard navigation.
         * 
         * @defaultValue true
         */
        keyboardNavigation?: boolean;
        /**
         * Close the lightbox when clicking outside the active slide.
         * 
         * @defaultValue true
         */
        closeOnOutsideClick?: boolean;
        /**
         * Start lightbox at defined index.
         * 
         * @defaultValue 0
         */
        startAt?: number;
        /**
         * Default width for inline elements and iframes
         * 
         * @defaultValue '900px'
         */
        width?: string;
        /**
         * Default height for inline elements and iframes
         * 
         * @defaultValue '506px'
         */
        height?: string;
        /**
         * Default width for videos.
         * 
         * @defaultValue '560px'
         */
        videosWidth?: string;
        /**
         * Global position for slides description
         * 
         * @defaultValue 'bottom'
         */
        descPosition?: string;
        /**
         * Loop slides on end.
         * 
         * @defaultValue false
         */
        loop?: boolean;
        /**
         * Enable or disable zoomable images
         * 
         * @defaultValue true
         */
        zoomable?: boolean;
        /**
         * Enable or disable mouse drag to go prev and next slide
         * 
         * @defaultValue true
         */
        draggable?: boolean;
        /**
         * Used with draggable. Number of pixels the user
         * has to drag to go to prev or next slide.
         * 
         * @defaultValue 40
         */
        dragToleranceX?: number;
        /**
         * Used with draggable. Number of pixels the user has to drag
         * up or down to close the lightbox
         * 
         * @defaultValue 65
         */
        dragToleranceY?: number;
        /**
         * If true the slide will automatically change to prev/next or close
         * if dragToleranceX or dragToleranceY is reached,
         * otherwise it will wait till the mouse is released.
         * 
         * @defaultValue false
         */
        dragAutoSnap?: boolean;
        /**
         * Enable or disable preloading.
         * 
         * @defaultValue true
         */
        preload?: boolean;
        /**
         * Set your own svg icons.
         */
        svg?: Record<'close' | 'next' | 'prev', string>;
        /**
         * Define or adjust lightbox animations.
         * 
         * @see: 
         */
        cssEffects?: Record<string, Record<'in' | 'out', string>>;
        /**
         * You can completely change the html of GLightbox.
         */
        lightboxHTML?: string;
        /**
         * You can completely change the html of the individual slide.
         */
        slideHTML?: string;
        /**
         * Autoplay videos on open.
         * 
         * @defaultValue true
         */
        autoplayVideos?: boolean;
        /**
         * If true video will be focused on play to allow
         * keyboard sortcuts for the player, this will deactivate
         * prev and next arrows to change slide.
         * 
         */
        autofocusVideos?: boolean;
        plyr?: PlyrOptions;
    }
}
