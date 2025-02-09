import type { GLightbox } from "glightbox";

export type PluginType = "slide" | "theme" | "other";

export interface PluginAssets {
	css?: string[];
	js?: { src: string; module?: boolean }[];
}

export interface PluginOptions {
	matchFn?: (matched: boolean, url: string) => boolean;
}

export interface Plugin {
	name: string;
	type: PluginType;
	version?: string;
	instance: InstanceType<typeof GLightbox>;
	attributes?: string[] | undefined;
	options?: PluginOptions;
	init: () => void;
	destroy?: () => void;
	build?: (buildParams: BuildParams) => Promise<boolean>;
	match?: (url: string) => boolean;
	cssStyle?: () => string;
	assets?: () => PluginAssets | false;
}

export interface SlideParams {
	node?: Element | null;
	url: string;
	thumbnail?: string;
	title?: string;
	description?: string;
	alt?: string;
	width?: string;
	html?: boolean;
	type: string;
	[key: string]: unknown;
}

export interface BuildParams {
	index: number;
	slide: HTMLElement;
	config: SlideParams;
}

export abstract class GLightboxPlugin implements Plugin {
	/** Name of the plugin */
	abstract name: string;

	/** Plugin type */
	abstract type: PluginType;

	/** Version of this plugin. Currently not in use, defined here for backward compatibility. */
	version?: string;

	/** Custom Plugin options */
	options?: PluginOptions;

	/** GLightbox instance */
	// instance?: any;
	instance: InstanceType<typeof GLightbox>;

	/** Custom data attributes used by your plugin */
	attributes?: string[];

	/**
	 * This method is called when the lightbox is opened
	 * use this method to set event listeners or init custom code
	 */
	init(): void {}

	/**
	 * This method is called when the lightbox is closed
	 * use this method to remove event listeners and cleanup
	 */
	destroy(): void {}

	/**
	 * This method is used to check if the module should
	 * handle the given url
	 */
	match(url: string): boolean {
		return false;
	}

	/**
	 * This method is called by GLightbox
	 * to create the slide content
	 * only used if the plugin type is slide
	 */
	build({ index, slide, config }: BuildParams): Promise<boolean> {
		return Promise.resolve(false);
	}

	/**
	 * Use this method to define CSS
	 * it will be injected and removed automatically
	 * only when needed
	 */
	cssStyle(): string {
		return "";
	}

	/**
	 * Use this method to define assets useful in case
	 * your plugins needs to insert a Javascript library
	 * or a CSS file
	 * return false to stop the injection of assets
	 */
	assets(): PluginAssets | false {
		return {};
	}
}
