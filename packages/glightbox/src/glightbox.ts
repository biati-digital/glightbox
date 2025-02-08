import type { Plugin } from '@glightbox/plugin-core';
import { EventType, addClass, addEvent, animate, hasClass, injectAssets, isNode, mergeObjects, removeClass } from '@glightbox/utils';
import '@style';
import { GLightboxDefaults } from './options';
import type { ApiEvent, GLightboxOptions, SlideConfig } from './types';

export default class GLightbox {
    options: GLightboxOptions;
    apiEvents: Set<ApiEvent> = new Set();
    events: Map<string, EventType> = new Map();
    state: Map<string, number | boolean | HTMLElement> = new Map();
    plugins: Map<string, Map<string, Plugin>> = new Map();
    items: Set<SlideConfig> = new Set();
    modal: HTMLElement | null = null;
    prevButton: HTMLButtonElement | null = null;
    nextButton: HTMLButtonElement | null = null;
    overlay: HTMLButtonElement | null = null;
    slidesContainer: HTMLElement | null = null;
    reduceMotion = false;
    private observer: IntersectionObserver;

    constructor(options: Partial<GLightboxOptions> = {}) {
        this.options = mergeObjects(GLightboxDefaults, options);

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if ((!reduceMotion || reduceMotion.matches) && this.options.appearance?.slideEffect) {
            this.reduceMotion = true;
        }

        this.init();
    }

    private init(initPlugins = true): void {
        if (initPlugins) {
            for (const plugin of this.options.plugins) {
                this.registerPlugin(plugin);
            }
        }

        if (this.options.setClickEvent) {
            this.events.set('gallery', addEvent('click', {
                element: '*[data-glightbox]',
                callback: (target: HTMLElement) => {
                    this.open(target);
                }
            }));
        }
    }

    public open(startAt: number | HTMLElement | undefined): void {
        if (this.state.get('open')) {
            return;
        }

        if (!this.plugins.has('slide')) {
            throw new Error('No slide types registered');
        }

        if (this.items.size === 0 && isNode(startAt)) {
            this.setItemsFromNode(startAt as HTMLElement);
        }

        let startingIndex = this.options.startAt;
        if (!this.options.autoGallery) {
            startingIndex = 0;
        } else if (typeof startAt === 'number') {
            startingIndex = startAt;
        } else if (isNode(startAt)) {
            startingIndex = this.getElementIndex(startAt as HTMLElement);
        }

        this.state.set('focused', document.activeElement as HTMLElement);
        this.build();
        this.trigger('before_open');
        this.initPlugins();
        this.showSlide(startingIndex as number, true);
        this.trigger('open');
        this.state.set('open', true);
        this.modal?.focus();
        addClass(document.getElementsByTagName('html')[0], 'gl-open');
    }

    public prevSlide(): void {
        this.goToSlide(this.getActiveSlideIndex() - 1);
    }

    public nextSlide(): void {
        this.goToSlide(this.getActiveSlideIndex() + 1);
    }

    public goToSlide(index = 0): void {
        const total = this.getTotalSlides() - 1;
        if (!this.options.loop && (index < 0 || index > this.getTotalSlides() - 1)) {
            return;
        }
        if (index < 0) {
            index = total;
        } else if (index > total) {
            index = 0;
        }
        this.showSlide(index);
    }

    private async showSlide(index = 0, first = false): Promise<void> {
        const current = this.slidesContainer?.querySelector<HTMLElement>('.current');
        if (current) {
            removeClass(current, 'current');
        }

        const slideNode = this.slidesContainer?.querySelectorAll('.gl-slide')[index] as HTMLElement;
        const media = slideNode.querySelector<HTMLElement>('.gl-media');
        if (!slideNode || !media) {
            return;
        }

        if (!first) {
            this.trigger('slide_before_change', { current: this.state.get('prevActiveSlideIndex'), next: index });
        }

        const effect = this.reduceMotion ? false : this.options.appearance?.slideEffect;
        const openEffect = this.reduceMotion ? false : this.options.appearance?.openEffect;
        const scrollAnim = effect !== 'slide' || first ? 'instant' : 'smooth';

        slideNode.scrollIntoView({ behavior: scrollAnim, block: 'start', inline: 'start' });

        await this.preloadSlide(index, !first);

        removeClass(media, 'gl-animation-ended');

        if (first && openEffect) {
            addClass(media, 'gl-invisible');
            if (openEffect) {
                await animate(media, `gl-${openEffect}-in`);
            }
            addClass(media, 'gl-animation-ended');
            removeClass(media, `gl-invisible gl-${openEffect}-in`);
        } else {
            removeClass(media, 'gl-invisible');
        }

        this.setActiveSlideState(slideNode, index);

        this.trigger('slide_changed', { prev: this.state.get('prevActiveSlideIndex'), current: index });

        if (this.options.preload) {
            this.preloadSlide(index + 1);
            this.preloadSlide(index - 1);
        }
    }

    private setActiveSlideState(activeNode: HTMLElement, index: number): void {
        this.state.set('prevActiveSlide', this.state.get('activeSlide') ?? false);
        this.state.set('prevActiveSlideIndex', this.getActiveSlideIndex());
        this.state.set('activeSlide', activeNode);
        this.state.set('activeSlideIndex', index);
        this.updateNavigationButtons();
    }

    private async preloadSlide(index: number, unhide = true): Promise<boolean | HTMLElement> {
        if (index < 0 || index > this.items.size - 1) {
            return false;
        }

        const slideNode = this.slidesContainer?.querySelectorAll('.gl-slide')[index] as HTMLElement;
        if (slideNode && (hasClass(slideNode, 'loaded') || hasClass(slideNode, 'preloading'))) {
            return true;
        }

        const slide = this.getSlideData(index);
        const type = slide?.type;
        const slideType = this.getRegisteredSlideType(type);

        let error = '';
        if (!type || !slideType) {
            error = `Unable to handle URL: ${slide?.url}`;
        }
        if (error) {
            this.setSlideError(slideNode, error as string);
            throw new Error(error);
        }

        if (slide?.url && slideType && slideNode && slideType?.build) {
            addClass(slideNode, 'preloading');
            try {
                if (slideType?.assets && typeof slideType?.assets === 'function') {
                    const slideAssets = slideType.assets();
                    if (slideAssets) {
                        const cssAssets = slideAssets?.css || [];
                        const jsAssets = slideAssets?.js || [];
                        await this.injectAssets([...cssAssets, ...jsAssets]);
                    }
                }

                this.trigger('slide_before_load', slide);

                await slideType.build({
                    index: index,
                    slide: slideNode.querySelector('.gl-media') as HTMLElement,
                    config: { ...slide, isPreload: unhide }
                });

                slideNode.querySelector('.gl-slide-loader')?.remove();
                this.afterSlideLoaded(slideNode);
                const media = slideNode.querySelector<HTMLElement>('.gl-media');
                if (media) {
                    addClass(media, `gl-type-${type}`);
                    unhide && removeClass(media, 'gl-invisible');
                }
                return slideNode;
            } catch (error) {
                this.afterSlideLoaded(slideNode);
                this.setSlideError(slideNode, error as string);
            }
        }

        return false;
    }

    private build(): void {
        if (this.state.get('build')) {
            return;
        }

        this.trigger('before_build');

        const children = document.body.querySelectorAll(':scope > *');
        if (children) {
            for (const el of children) {
                if (el.parentNode === document.body && el.nodeName.charAt(0) !== '#' && el.hasAttribute && !el.hasAttribute('aria-hidden')) {
                    (el as HTMLElement).ariaHidden = 'true';
                    (el as HTMLElement).dataset.glHidden = 'true';
                }
            }
        }

        const root = this.options?.root ?? document.body;
        const lightboxHTML = this.options?.appearance?.lightboxHTML ?? '';
        root.insertAdjacentHTML('beforeend', lightboxHTML);

        this.modal = document.getElementById('gl-body');
        if (!this.modal) {
            throw new Error('modal body not found');
        }

        const closeButton = this.modal.querySelector<HTMLElement>('.gl-close');
        this.prevButton = this.modal.querySelector<HTMLButtonElement>('.gl-prev');
        this.nextButton = this.modal.querySelector<HTMLButtonElement>('.gl-next');
        this.overlay = this.modal.querySelector<HTMLButtonElement>('.gl-overlay');
        this.slidesContainer = document.getElementById('gl-slider');

        addClass(this.modal, this.reduceMotion ? 'gl-reduce-motion' : 'gl-motion');
        addClass(this.modal, `gl-theme-${this.options?.appearance?.theme ?? 'base'}`);
        addClass(this.modal, `gl-slide-effect-${this.options?.appearance?.slideEffect || 'none'}`);

        if (this.options?.appearance?.cssVariables) {
            for (const [key, value] of Object.entries(this.options.appearance.cssVariables)) {
                this.modal.style.setProperty(`--gl-${key}`, value);
            }
        }

        if (closeButton) {
            this.events.set('close', addEvent('click', {
                element: closeButton,
                callback: () => this.close()
            }));
        }
        if (this.nextButton) {
            this.events.set('next', addEvent('click', {
                element: this.nextButton,
                callback: () => this.nextSlide()
            }));
        }

        if (this.prevButton) {
            this.events.set('prev', addEvent('click', {
                element: this.prevButton,
                callback: () => this.prevSlide()
            }));
        }
        if (this.options.closeOnOutsideClick) {
            this.events.set('outClose', addEvent('click', {
                element: this.modal,
                callback: (target: HTMLElement, e: Event) => {
                    if (target && e?.target && !(e?.target as HTMLElement)?.closest('.gl-media')) {
                        if (!(e.target as HTMLElement).closest('.gl-btn')) {
                            this.close();
                        }
                    }
                }
            }));
        }

        this.processVariables(this.modal);

        this.observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                removeClass(entry.target, 'visible');
                if (entry.isIntersecting && this.state.get('open')) {
                    const enteredIndex = Number.parseInt(entry.target?.getAttribute('data-index') ?? '0');
                    addClass(entry.target, 'visible');

                    // on scroll make sure to recheck active indexes
                    if (enteredIndex !== this.state.get('activeSlideIndex')) {
                        this.setActiveSlideState(entry.target as HTMLElement, enteredIndex);
                    }

                    if (!hasClass(entry.target, 'loaded') && !hasClass(entry.target, 'preloading')) {
                        this.preloadSlide(enteredIndex);
                        this.preloadSlide(enteredIndex + 1);
                        this.preloadSlide(enteredIndex - 1);
                    }
                }
            }
        }, {
            root: this.modal,
            rootMargin: '0px',
            threshold: 0.2
        });

        let index = 0;
        for (const item of this.items) {
            const slideType = this.getRegisteredSlideType(item?.type);
            if (item?.url && slideType) {
                let slideHTML = this.options?.appearance?.slideHTML;
                const loader = this.options?.appearance?.svg?.loader;
                if (!slideHTML) {
                    slideHTML = `<div class="gl-slide" data-index="${index}" style="--gl-index: ${index}">
                        <div class="gl-slide-loader" role="status">
                            ${loader}
                            <span class="gl-sr-only">Loading...</span>
                        </div>
                        <div class="gl-media gl-invisible">
                        </div>
                    </div>`;
                }

                this.slidesContainer?.insertAdjacentHTML('beforeend', slideHTML);
                const created = this.slidesContainer?.querySelectorAll('.gl-slide')[index];
                if (created) {
                    this.observer.observe(created);
                }
                index++;
            }
        }

        if (this.overlay) {
            addClass(this.overlay, 'gl-overlay-in');
        }
        this.state.set('build', true);
        this.trigger('build');
    }

    public async close(): Promise<void> {
        if (!this.state.get('open') || !this.modal) {
            return;
        }

        this.runPluginsMethod('destroy');

        removeClass(document.getElementsByTagName('html')[0], 'gl-open');

        const hiddenElements = document.querySelectorAll('*[data-gl-hidden="true"]');
        if (hiddenElements) {
            for (const el of hiddenElements) {
                (el as HTMLElement).ariaHidden = 'false';
                delete (el as HTMLElement).dataset.glHidden;
            }
        }

        if (this.reduceMotion || this.options.appearance?.slideEffect === 'none') {
            this.modal.parentNode?.removeChild(this.modal);
        } else {
            const currentSlide = this.state.get('activeSlide');
            const media = (currentSlide as HTMLElement).querySelector<HTMLElement>('.gl-media');
            const openEffect = this.options.appearance?.openEffect;
            if (media) {
                addClass(this.modal, 'gl-closing');
                if (openEffect) {
                    removeClass(media, 'gl-animation-ended');
                    await animate(media, `gl-${openEffect}-out`);
                }
            }
            this.modal.parentNode?.removeChild(this.modal);
        }

        this.state.clear();
        this.modal = null;
        this.prevButton = null;
        this.nextButton = null;
        this.clearAllEvents();
        this.setItems([]);

        const styles = document.querySelectorAll('.gl-css');
        if (styles) {
            for (const style of styles) {
                style?.parentNode?.removeChild(style);
            }
        }

        this.trigger('close');
        const restoreFocus = this.state.get('focused') as HTMLElement;
        restoreFocus?.focus();
    }

    public destroy(): void {
        this.close();
        this.clearAllEvents(true);
        this.observer.disconnect();
    }

    public reload(): void {
        this.init(false);
    }

    public setItems(items: SlideConfig[]): void {
        if (!items) {
            return;
        }

        this.items = new Set();
        if (!items.length) {
            return;
        }

        const slideModules = this.plugins.get('slide');
        if (!slideModules) {
            throw new Error('No slide types registered');
        }
        for (const item of items) {
            if (item?.type) {
                if (!slideModules.has(item.type)) {
                    throw new Error(`Unknown slide type: ${item.type}`);
                }
                continue;
            }

            let generalSlideTye: false | Plugin = false;
            for (const [key, slideType] of slideModules) {
                if (slideType.name === 'iframe') {
                    generalSlideTye = slideType;
                    continue;
                }

                let matched = false;
                if (slideType?.match?.(item.url.toLowerCase())) {
                    item.type = key;
                    matched = true;
                }

                if (slideType?.options && typeof slideType.options?.matchFn === 'function') {
                    if (slideType.options?.matchFn(matched, item.url.toLowerCase())) {
                        item.type = key;
                        matched = true;
                    }
                }

                if (matched) {
                    break;
                }
            }
            if (!item?.type) {
                if (generalSlideTye) {
                    item.type = generalSlideTye.name;
                }
            }
            this.getItems().add(item);
        }
    }

    private setItemsFromNode(node: HTMLElement): void {
        if (!this.options.autoGallery) {
            this.setItems([this.parseConfigFromNode(node)]);
            return;
        }
        let selector = '*[data-glightbox]';
        const gallery = node.getAttribute('data-glightbox');
        if (gallery) {
            selector = `*[data-glightbox="${gallery}"]`;
        }

        const items = document.querySelectorAll(selector);
        if (!items) {
            return;
        }
        const parsedItemsData: SlideConfig[] = [];
        for (const item of items) {
            const itemData: SlideConfig = this.parseConfigFromNode(item as HTMLElement);
            parsedItemsData.push(itemData);
        }
        this.setItems(parsedItemsData);
    }

    public getSettings(): GLightboxOptions {
        return this.options;
    }

    private getElementIndex(node: HTMLElement): number {
        let index = 0;
        let count = 0;
        for (const item of this.items) {
            if (item?.node === node) {
                index = count;
                break;
            }
            count++;
        }
        return index;
    }

    public getActiveSlide(): HTMLElement | undefined {
        if (this.state.has('activeSlide')) {
            return this.state.get('activeSlide') as HTMLElement;
        }
        return;
    }

    public getActiveSlideIndex(): number {
        if (this.state.has('activeSlideIndex')) {
            return this.state.get('activeSlideIndex') as number;
        }
        return 0;
    }

    public getTotalSlides(): number {
        return this.items.size;
    }

    public getItems(): Set<SlideConfig> {
        return this.items;
    }

    public updateNavigationButtons(): void {
        if (this.items.size === 1) {
            this.modal && addClass(this.modal, 'gl-single-slide');
            return;
        }
        if (!this.nextButton || !this.prevButton) {
            return;
        }

        const loop = this.options.loop;
        const currentIndex = this.getActiveSlideIndex();
        const total = this.getTotalSlides() - 1;

        this.prevButton.disabled = false;
        this.nextButton.disabled = false;

        if (currentIndex === 0 && !loop) {
            this.prevButton.disabled = true;
        } else if (currentIndex === total && !loop) {
            this.nextButton.disabled = true;
        }
    }

    private setSlideError(slide: HTMLElement, error: string): void {
        slide.querySelector('.gl-slide-loader')?.remove();
        const media = slide.querySelector<HTMLElement>('.gl-media');
        if (media) {
            addClass(media, 'gl-load-error');
            removeClass(media, 'gl-invisible');
            media.innerHTML = `<div class="gl-error">${error}</div>`;
        }
    }

    private afterSlideLoaded(slide: HTMLElement): void {
        addClass(slide, 'loaded');
        removeClass(slide, 'preloading');
    }

    public on(evt: string, callback: () => void, once = false): void {
        if (!evt || typeof callback !== 'function') {
            throw new TypeError('Event name and callback must be defined');
        }
        this.apiEvents.add({ evt, once, callback });
    }

    public once(evt: string, callback: () => void): void {
        this.on(evt, callback, true);
    }

    protected trigger(eventName: string, data: unknown = null): void {
        for (const event of this.apiEvents) {
            const { evt, once, callback } = event;
            if (evt === eventName) {
                callback(data);
                if (once) {
                    this.apiEvents.delete(event);
                }
            }
        }
    }

    private parseConfigFromNode(element: HTMLElement): SlideConfig {
        const slideDefaults: SlideConfig = {
            node: null,
            url: '',
            title: '',
            description: '',
            width: '',
            height: '',
            content: '',
            type: ''
        };

        let url = '';
        const data: SlideConfig = { url: '', type: '' };
        const nodeType = element.nodeName.toLowerCase();

        if (nodeType === 'a') {
            url = element.getAttribute('href') || '';
        }
        if (nodeType === 'img') {
            url = element.getAttribute('src') || '';
        }
        if (nodeType === 'figure') {
            url = element.querySelector('img')?.getAttribute('src') || '';
        }

        data.node = element;
        data.url = url;

        for (const key in slideDefaults) {
            let attr = 'data';
            if (this.options?.dataAttributesPrefix) {
                attr += `-${this.options?.dataAttributesPrefix}`;
            }
            let nodeData: string | boolean | null = element.getAttribute(`${attr}-${key}`);
            if (nodeData) {
                if (nodeData === 'true' || nodeData === 'false') {
                    nodeData = nodeData === 'true';
                }
                data[key] = nodeData;
            }
        }
        if (!data.title) {
            const title = element?.getAttribute('title');
            if (title) {
                data.title = title;
            }
        }

        if (data?.description?.startsWith('.')) {
            const description = document.querySelector(data.description)?.innerHTML;
            if (description) {
                data.description = description;
            }
        }

        if (!data.description) {
            const nodeDesc = element.querySelector('.gl-inline-desc');
            if (nodeDesc) {
                data.description = nodeDesc.innerHTML;
            }
        }

        return data;
    }

    private getRegisteredSlideType(id: string): false | Plugin {
        if (this.plugins.has('slide')) {
            const slideModules = this.plugins.get('slide');
            if (slideModules?.has(id)) {
                return slideModules.get(id) as Plugin;
            }
        }

        return false;
    }

    private getSlideData(index: number) {
        return [...this.items][index];
    }

    public processVariables(node: HTMLElement): void {
        const variables = {
            'current-slide': '',
            'total-slides': '',
            'close-svg': this.options?.appearance?.svg?.close ?? '',
            'next-svg': this.options?.appearance?.svg?.next ?? '',
            'prev-svg': this.options?.appearance?.svg?.prev ?? ''
        };

        for (const [key, value] of Object.entries(variables)) {
            const nodeInner = node.querySelector(`*[data-glightbox-${key}]`);
            if (nodeInner) {
                nodeInner.innerHTML = value;
            }
        }
        return;
    }

    protected registerPlugin(plugin: Plugin): void {
        if (!this.plugins.has(plugin.type)) {
            this.plugins.set(plugin.type, new Map());
        }
        const typeModules = this.plugins.get(plugin.type);
        plugin.instance = this;
        typeModules?.set(plugin.name, plugin);
    }

    protected initPlugins() {
        this.pluginsRunEach((plugin: Plugin) => {
            if (typeof plugin.init === 'function') {
                plugin.init();
            }
            if (typeof plugin.cssStyle === 'function') {
                const css = plugin?.cssStyle();
                this.injectCSS(css);
            }
        });
    }

    protected runPluginsMethod(method: string): void {
        this.pluginsRunEach((plugin: Plugin) => {
            if (typeof plugin[method as (keyof typeof plugin)] === 'function') {
                const methodFn = plugin[method as (keyof typeof plugin)];
                if (typeof methodFn === 'function') {
                    methodFn?.apply(plugin);
                }
            }
        });
    }

    public pluginsRunEach(callback: (plugin: Plugin) => void): void {
        for (const [type, pluginTypes] of this.plugins) {
            for (const [name, plugin] of pluginTypes) {
                callback(plugin);
            }
        }
    }

    protected injectCSS(css: string): void {
        if (!css) {
            return;
        }
        const el = document.createElement('style');
        el.type = 'text/css';
        el.className = 'gl-css';
        el.innerText = css;
        document.head.appendChild(el);
    }

    public async injectAssets(urls: (string | string[] | { src: string; module?: boolean })[]): Promise<void> {
        if (typeof urls === 'string') {
            urls = [urls];
        }

        urls.map(async (url) => {
            let load = url;
            if (typeof url === 'string') {
                load = url as string;
            } else {
                load = url as { src: string; module?: boolean };
            }
            await injectAssets(load);
        });
    }

    private clearAllEvents(fullClear = false): void {
        for (const [key, event] of this.events) {
            if (!fullClear && key === 'gallery') {
                continue;
            }
            event?.destroy();
            this.events.delete(key);
        }
        fullClear && this.events.clear();
        this.apiEvents.clear();
    }
}
