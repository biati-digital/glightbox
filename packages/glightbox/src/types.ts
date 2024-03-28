import type { Plugin } from '@glightbox/plugin-core';

export interface AppearaceOptions {
    /**
     * Define a custom theme it will
     * add a class to the lightbox so you can
     * change the appearance with CSS
     *
     * @default 'clean'
     */
    theme?: string;


    cssVariables?: CSSVariables;


    /**
     * Set the slide effect
     */
    slideEffect?: string | false;
    /**
     * Set your open effect
     */
    openEffect?: string | false;
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
     * Name of the effect on lightbox close. (zoom, fade, none)
     *
     * @default 'zoom'
     */
    closeEffect?: string;
    /**
     * You can completely change the html of GLightbox.
     */
    lightboxHTML?: string;
    /**
     * You can completely change the html of the individual slide.
     */
    slideHTML?: string;
    /**
     * Set your own svg icons.
     */
    svg?: Record<'close' | 'next' | 'prev' | 'loader', string>;
}

export interface GLightboxOptions {
    /**
     * Where to append the lightbox HTML
     *
     * @default 'document.body'
     */
    root?: null | HTMLElement | Element;

    /**
     * List of items in the gallery, each item must
     * contain at least a URL
     *
     * @default '[]'
     */
    items?: SlideConfig[];

    /**
     * Enable setting click event listener on items
     * with the data attribute 'data-glightbox'
     *
     * @default 'true'
     */
    setClickEvent?: boolean;

    /**
     * List of plugins to load
     *
     * @default '[]'
     */
    plugins?: Plugin[];
    /**
     * Automatically make all items with the same selector a gallery
     * if false each item will be displayed individually
     *
     * @default true
     */
    autoGallery?: boolean;
    /**
     * Name of the effect on lightbox open. (zoom, fade, none)
     *
     * @default 'zoom'
     */
    appearance?: AppearaceOptions;
    /**
     * Name of the effect on slide change. (slide, fade, zoom, none)
     *
     * @default 'slide'
     */
    slideEffect?: string;
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
     * Enable or disable preloading.
     * If enabled, adjacent slides to the currently displayed will be preloaded
     *
     * @default true
     */
    preload?: boolean;
    /**
     * Loop slides on end.
     *
     * @default false
     */
    loop?: boolean;
    /**
     * List of custom data attributes
     * you can define custom data attributes
     * so they get parsed and you can use them
     * in the slide
     *
     * @default []
     */
    customDataAttributes?: string[],
    /**
     * Custom prefix for data attributes
     * so instead of data-url you can define
     * data-prefix-url
     *
     * @default ''
     */
    dataAttributesPrefix?: string,
}


export interface CSSVariables {
    /**
     * The background color of the lightbox overlay
     * usually a black color with opacity
     *
     * @default '#111010f7'
     */
    "overlay"?: string;

    /**
     * The background color of the description
     *
     * @default '#fff'
     */
    "description-bg"?: string;


    /**
     * padding applied to the description, you can
     * set to 0 if you are using a transparent background
     *
     * @default '0.5em'
     */
    "description-padding"?: string;


    /**
     * The highlighted color of the rotating loader
     *
     * @default '#7d7d7d'
     */
    "loader-fill"?: string;

    /**
     * The color of the rotating loader
     *
     * @default '#00000082'
     */
    "loader-color"?: string;

    /**
     * The size of the rotating loader
     *
     * @default '38px'
     */
    "loader-size"?: string;

    /**
     * The background color of buttons.
     * next, prev, close, etc.
     *
     * @default '#000000b0'
     */
    "button-background"?: string;


    /**
     * The color of buttons.
     * next, prev, close, etc.
     *
     * @default '#fff'
     */
    "button-color"?: string;

    /**
     * The width of buttons.
     *
     * @default '45px'
     */
    "button-width"?: string;

    /**
     * The height of buttons.
     *
     * @default '45px'
     */
    "button-height"?: string;

    /**
     * The size of the svg icons inside buttons
     *
     * @default '19px'
     */
    "button-svg-size"?: string;

    /**
     * The border radius of buttons
     *
     * @default '5px'
     */
    "button-radius"?: string;

    /**
     * The border of buttons
     *
     * @default '1px solid transparent'
     */
    "button-border"?: string;

    /**
     * The opacity of buttons, this is when the
     * button is enabled but the mouse is not over it
     * when the button it's hovered, the opacity will be 1
     *
     * @default '0.5'
     */
    "button-opacity"?: string;

    /**
     * The opacity of disabled buttons, disabled buttons
     * can not be clicked by the user
     *
     * @default '0.2'
     */
    "button-opacity-disabled"?: string;

    /**
     * The border applied to buttons when focused. Focus is
     * applied when pressing the "TAB" key
     *
     * @default '2px solid #ffffff'
     */
    "button-border-focus"?: string;

    /**
     * Background color of the error message.
     * If a slide can not be loaded the user will see
     * the error displayed in a box.
     *
     * @default '#ffffff'
     */
    "error-bg"?: string;

    /**
     * Text color of the error message.
     * If a slide can not be loaded the user will see
     * the error displayed in a box.
     *
     * @default '#000'
     */
    "error-color"?: string;
    [key: string]: string;
}

export interface SlideConfig {
    node?: Element | null;
    url: string;
    thumbnail?: string;
    title?: string;
    description?: string;
    alt?: string;
    type: string;
    width?: string;
    html?: boolean;
    [key: string]: unknown;
}

export declare interface ApiEvent {
    evt: string;
    once: boolean;
    callback: (data: unknown) => void;
}
