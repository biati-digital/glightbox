export interface EventType {
    (event: Event): void; // Just an example
    destroy(): void;
}

interface EventElement extends HTMLElement {
    attachedEvent: string;
}

/**
 * Merge two or more objects
 */
export const mergeObjects = <T extends object = object>(target: T, ...sources: T[]): T => {
    if (!sources.length) {
        return target;
    }
    const source = sources.shift();
    if (source === undefined) {
        return target;
    }

    if (isMergebleObject(target) && isMergebleObject(source)) {
        Object.keys(source).forEach(function (key: string) {
            if (isMergebleObject(source[key])) {
                if (!target[key]) {
                    target[key] = {};
                }
                mergeObjects(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        });
    }

    return mergeObjects(target, ...sources);
};


/**
 * Add element class
 */
export function addClass(node: HTMLElement | Element, classes: string): void {
    node.classList.add(...classes.split(' '));
}

/**
 * Remove element class
 */
export function removeClass(node: HTMLElement | Element, classes: string): void {
    node.classList.remove(...classes.split(' '));
}

/**
 * Has class
 */
export function hasClass(node: HTMLElement | Element, name: string): boolean {
    return node.classList.contains(name);
}

/**
 * Add Event
 * Add an event listener
 */
export function addEvent(eventName: string, {
    element,
    callback,
    preventDefault = true,
    once = false,
    useCapture = false
}: {
    element: HTMLElement | typeof window | null | string,
    callback: (this: unknown, el: HTMLElement, event: Event) => void,
    preventDefault?: boolean,
    once?: boolean,
    useCapture?: boolean
}, thisArg?: unknown): EventType {
    let items: (HTMLElement | Element | null)[] = [];
    const id = callback.toString().trim().replace(/\s/g, '');
    const isString = typeof element === 'string';

    if (!isString) {
        items = [element as HTMLElement];
    } else if (isString) {
        const queryElements = document.querySelectorAll(element as string);
        if (queryElements) {
            items = [...queryElements];
        }
    }

    const handler: EventType = function (event: Event) {
        if (typeof callback === 'function') {
            if (preventDefault) {
                event.preventDefault();
            }
            callback.call(thisArg, this, event);
        }
        if (once) {
            handler.destroy();
        }
    }

    handler.destroy = function () {
        items.forEach(el => {
            el?.removeEventListener(eventName, handler, useCapture);
        });
    };
    items.forEach((el) => {
        if (el && (el as EventElement).attachedEvent !== id) {
            el.addEventListener(eventName, handler, useCapture);
            (el as EventElement).attachedEvent = id;
        }
    });

    return handler;
}

export function animate(element: HTMLElement, classes: string): Promise<boolean> {
    return new Promise((resolve) => {
        element.addEventListener('animationend', () => {
            resolve(true);
        });
        addClass(element, classes);
    });
}

/**
 * Return screen size
 * return the current screen dimensions
 *
 * @returns {object}
 */
export function windowSize() {
    return {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    };
}

/**
 * Inject videos api
 * used for video player
 *
 * @param {string} url
 * @param {function} callback
 */
export function injectAssets(url: string | { src: string; module?: boolean }): Promise<boolean> {
    return new Promise((resolve, reject) => {
        if (!url) {
            reject('url must be defined');
        }
        let src = '';
        if (typeof url !== 'string') {
            src = url.src as string;
        } else {
            src = url;
        }

        let found;
        const scriptType = src.includes('.css') ? 'css' : 'js';
        if (scriptType === 'css') {
            found = document.querySelectorAll('link[href="' + src + '"]');
            if (found && found.length > 0) {
                resolve(true);
                return;
            }

            const head = document.getElementsByTagName('head')[0];
            const headStyles = head.querySelectorAll('link[rel="stylesheet"]');
            const link = document.createElement('link');

            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = src;
            link.media = 'all';

            if (headStyles) {
                head.insertBefore(link, headStyles[0]);
            } else {
                head.appendChild(link);
            }
            resolve(true);
            return;
        }

        found = document.querySelectorAll('script[src="' + src + '"]');
        if (found && found.length > 0) {
            resolve(true);
            return;
        }

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;

        if (typeof url !== 'string' && url?.module) {
            script.type = 'module';
        }

        script.onload = () => {
            resolve(true);
        };
        document.body.appendChild(script);
    });
}

export function isNode(el: unknown): boolean {
    return !!(el && (el as Node).nodeType && (el as Node).nodeType == 1);
}

const isObject = (item: unknown): boolean => {
    return item !== null && typeof item === 'object';
};

const isMergebleObject = (item): boolean => {
    return isObject(item) && !Array.isArray(item);
};
