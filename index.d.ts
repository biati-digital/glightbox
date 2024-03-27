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
         * @default '.glightbox'
         */
        selector?: string;
        /**
         * Instead of passing a selector you can pass all the items
         * that you want in the gallery.
         * 
         * @default null
         */
        elements?: [] | null;
        /**
         * Name of the skin, it will add a class to the lightbox
         * so you can style it with css.
         * 
         * @default 'clean'
         */
        skin?: string;
        /**
         * Name of the effect on lightbox open. (zoom, fade, none)
         * 
         * @default 'zoom'
         */
        openEffect?: string;
        /**
         * Name of the effect on lightbox close. (zoom, fade, none)
         * 
         * @default 'zoom'
         */
        closeEffect?: string;
        /**
         * Name of the effect on slide change. (slide, fade, zoom, none)
         * 
         * @default 'slide'
         */
        slideEffect?: string;
        /**
         * More text for descriptions on mobile devices.
         * 
         * @default 'See more'
         */
        moreText?: string;
        /**
         * Number of characters to display on the description before adding
         * the moreText link (only for mobiles),
         * if 0 it will display the entire description.
         * 
         * @default 60
         */
        moreLength?: number;
        /**
         * Show or hide the close button.
         * 
         * @default true
         */
        closeButton?: boolean;
        /**
         * Enable or disable the touch navigation (swipe).
         * 
         * @default true
         */
        touchNavigation?: boolean;
        /**
         * Image follow axis when dragging on mobile.
         * 
         * @default true
         */
        touchFollowAxis?: boolean;
        /**
         * Enable or disable the keyboard navigation.
         * 
         * @default true
         */
        keyboardNavigation?: boolean;
        /**
         * Close the lightbox when clicking outside the active slide.
         * 
         * @default true
         */
        closeOnOutsideClick?: boolean;
        /**
         * Start lightbox at defined index.
         * 
         * @default 0
         */
        startAt?: number;
        /**
         * Default width for inline elements and iframes
         * 
         * @default '900px'
         */
        width?: string;
        /**
         * Default height for inline elements and iframes
         * 
         * @default '506px'
         */
        height?: string;
        /**
         * Default width for videos.
         * 
         * @default '560px'
         */
        videosWidth?: string;
        /**
         * Global position for slides description
         * 
         * @default 'bottom'
         */
        descPosition?: string;
        /**
         * Loop slides on end.
         * 
         * @default false
         */
        loop?: Exclude<boolean, undefined>;
        /**
         * Enable or disable zoomable images
         * 
         * @default true
         */
        zoomable?: boolean;
        /**
         * Enable or disable mouse drag to go prev and next slide
         * 
         * @default true
         */
        draggable?: boolean;
        /**
         * Used with draggable. Number of pixels the user
         * has to drag to go to prev or next slide.
         * 
         * @default 40
         */
        dragToleranceX?: number;
        /**
         * Used with draggable. Number of pixels the user has to drag
         * up or down to close the lightbox
         * 
         * @default 65
         */
        dragToleranceY?: number;
        /**
         * If true the slide will automatically change to prev/next or close
         * if dragToleranceX or dragToleranceY is reached,
         * otherwise it will wait till the mouse is released.
         * 
         * @default false
         */
        dragAutoSnap?: boolean;
        /**
         * Enable or disable preloading.
         * 
         * @default true
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
         * @default true
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

    type EventTypes =
        | "open"
        | "close"
        | "slide_before_change"
        | "slide_changed"
        | "slide_before_load"
        | "slide_after_load"
        | "slide_inserted"
        | "slide_removed"

    interface SlideConfig {
        href?: string;
        sizes?: string;
        srcset?: string;
        title?: string;
        type?: "image" | "video" | "inline";
        videoProvider?: string;
        description?: string;
        alt?: string;
        descPosition?: 'bottom' | 'top' | 'left' | 'right';
        effect?: string;
        width?: string;
        height?: string;
        content?: boolean;
        zoomable?: boolean;
        draggable?: boolean;
    }

    interface BaseData {
        index?: number;
        slide?: Element;
        slideNode?: Element;
        slideConfig?: SlideConfig;
        slideIndex?: number;
        trigger?: Element;
        player?: null | Record<any, any>;
    }

    type Payload<T extends EventTypes> = {
        slide_before_change: {
            prev: BaseData;
            current: BaseData;
        };
        slide_changed: {
            prev: BaseData;
            current: BaseData;
        };
        slide_before_load: BaseData;
        slide_after_load: BaseData;
        slide_inserted: BaseData;
        slide_removed: number;
    }[T]
}

declare class GlightboxInit {
    constructor(options: Glightbox.Options);

    /**
     * Initialize lightbox
     */
    init(): void;

     /**
     * Open lightbox
     */
    open(element: Element, startAt: number): void

    /**
     * Open at specific index
     */
    openAt(index?: number): void;

    /**
     * Set Slide
     */
    private showSlide(index: number, first: boolean): void;

    /**
     * Preload slides
     */
    private preloadSlide(index: number): null;

    /**
     * Load previous slide
     * calls goToslide
     */
    prevSlide(): void;

    /**
     * Load next slide
     * calls goToslide
     */
    nextSlide(): void;

    /**
     * Go to slide
     * calls set slide
     */
    goToSlide(index?: number): void;

    /**
     * Insert slide
     */
    insertSlide(config: Record<any, any>, index: number): void;

    /**
     * Remove slide
     */
    removeSlide(index: number): boolean | undefined;

    /**
     * Slide In
     */
    private slideAnimateIn(slide: Element, first: boolean): null;

    /**
     * Slide out
     */
    private slideAnimateOut(): void;

    /**
     * Get all defined players
     */
    getAllPlayers(): Record<string, any>;

    /**
     * Get player at index
     */
    getSlidePlayerInstance(index: number): boolean | Record<any, any>;

    /**
     * Stop video at specified
     * node or index
     */
    stopSlideVideo(slide: Element | number): void;

    /**
     * Stop player at specified index
     */
    slidePlayerPause(slide: Element | number): void;

    /**
     * Stop video at specified
     * node or index
     * 
     * @deprecated use slidePlayerPause instead
     */
    stopSlide(slide: Element | number): void;

    /**
     * Play video at specified
     * node or index
     */
    playSlideVideo(slide: Element): void;

    /**
     * Play media player at specified
     * node or index
     */
    slidePlayerPlay(slide: Element | number): void;

    /**
     * Set the entire elements
     * in the gallery, it replaces all
     * the existing elements
     * with the specified list
     */
    setElements(elements: any[]): void;

    /**
     * Return the index
     * of the specified node,
     * this node is for example an image, link, etc.
     * that when clicked it opens the lightbox
     * its position in the elements array can change
     * when using insertSlide or removeSlide so we
     * need to find it in the elements list
     */
    private getElementIndex(node: Node): boolean | number;

    /**
     * Get elements
     * returns an array containing all
     * the elements that must be displayed in the
     * lightbox
     */
    private getElements(): any[];

    /**
     * Return only the elements
     * from a specific gallery
     */
    private getGalleryElements(list: any[], gallery: any[]): any[];

    /**
     * Get selector
     */
    private getSelector(): boolean | string;

    /**
     * Get the active slide
     */
    getActiveSlide(): Element;

    /**
     * Get the active index
     */
    getActiveSlideIndex(): number | undefined;

    /**
     * Get the defined
     * effects as string
     */
    private getAnimationClasses(): string;

    /**
     * Build the structure
     */
    private build(): null;

    /**
     * Handle resize
     * Create only to handle
     * when the height of the screen
     * is lower than the slide content
     * this helps to resize videos vertically
     * and images with description
     */
    private resize(slide?: null): void;

    /**
     * Reload Lightbox
     * reload and apply events to nodes
     */
    reload(): void;

    /**
     * Update navigation classes on slide change
     */
    private updateNavigationClasses(): void;

    /**
     * Handle loop config
     */
    private loop(): void;

    /**
     * Close Lightbox
     * closes the lightbox and removes the slides
     * and some classes
     */
    close(): boolean | undefined;

    /**
     * Destroy lightbox
     * and all events
     */
    destroy(): void;

    /**
     * Set event
     */
    on(eventName: Glightbox.EventTypes, callback: () => void, once?: boolean): void;

    /**
     * Set event once
     */
    once(eventName: Glightbox.EventTypes, callback: () => void): void;

    /**
     * Triggers an specific event
     * with data
     */
    trigger<T extends Glightbox.EventTypes>(eventName: T, data?: Glightbox.Payload<T>): void;

    /**
     * Removes all events
     * set using the API
     */
    private clearAllEvents(): void;

    /**
     * Get Version
     */
    version(): string;
}

declare function GLightbox(options: Glightbox.Options): InstanceType<typeof GlightboxInit>

export = GLightbox;
export as namespace GLightbox;
