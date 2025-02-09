export interface EventType {
	(event: Event): void;
	destroy(): void;
}

interface EventElement extends HTMLElement {
	attachedEvent: string;
}

export const mergeObjects = <T extends object = object>(
	target: T,
	...sources: T[]
): T => {
	if (!sources.length) {
		return target;
	}
	const source = sources.shift();
	if (source === undefined) {
		return target;
	}

	if (isMergebleObject(target) && isMergebleObject(source)) {
		for (const key of Object.keys(source)) {
			if (isMergebleObject(source[key])) {
				if (!target[key]) {
					target[key] = {};
				}
				mergeObjects(target[key], source[key]);
			} else {
				target[key] = source[key];
			}
		}
	}

	return mergeObjects(target, ...sources);
};

export function addClass(node: HTMLElement | Element, classes: string): void {
	node.classList.add(...classes.split(" "));
}

export function removeClass(
	node: HTMLElement | Element,
	classes: string,
): void {
	node.classList.remove(...classes.split(" "));
}

export function hasClass(node: HTMLElement | Element, name: string): boolean {
	return node.classList.contains(name);
}

const nodesEvents = new WeakMap();

export function addEvent(
	eventName: string,
	{
		element,
		signal,
		callback,
		preventDefault = true,
		once = false,
		capture = false,
	}: {
		element: HTMLElement | typeof window | null | string;
		signal?: AbortSignal | undefined;
		callback: (this: unknown, el: HTMLElement, event: Event) => void;
		preventDefault?: boolean;
		once?: boolean;
		capture?: boolean;
	},
	thisArg?: unknown,
): void {
	let items: (HTMLElement | Element | null)[] = [];
	const id = callback.toString().trim().replace(/\s/g, "");
	const isString = typeof element === "string";

	if (!isString) {
		items = [element as HTMLElement];
	} else if (isString) {
		const queryElements = document.querySelectorAll(element as string);
		if (queryElements) {
			items = [...queryElements];
		}
	}

	const handler = (event: Event) => {
		if (preventDefault) {
			event.preventDefault();
		}
		callback.call(thisArg, event.currentTarget as HTMLElement, event);
	};

	for (const el of items) {
		if (!nodesEvents.has(el)) {
			nodesEvents.set(el, new Map());
		}

		const elEvents = nodesEvents.get(el);
		if (!elEvents.has(eventName)) {
			elEvents.set(eventName, new Set());
		}

		const elEventCallbacks = elEvents.get(eventName);
		if (!elEventCallbacks.has(id)) {
			el.addEventListener(eventName, handler, {
				capture,
				once,
				signal,
			});
			elEventCallbacks.add(id);
		}
	}
}

export function animate(
	element: HTMLElement,
	classes: string,
): Promise<boolean> {
	return new Promise((resolve) => {
		element.addEventListener("animationend", () => {
			resolve(true);
		});
		addClass(element, classes);
	});
}

export function windowSize() {
	return {
		width:
			window.innerWidth ||
			document.documentElement.clientWidth ||
			document.body.clientWidth,
		height:
			window.innerHeight ||
			document.documentElement.clientHeight ||
			document.body.clientHeight,
	};
}

export function createIframe(config) {
	const { url, attrs, appendTo } = config;
	const iframe = document.createElement("iframe");
	iframe.className = "gl-iframe";
	iframe.src = url;
	iframe.style.width = "100%";
	iframe.style.height = "100%";

	if (attrs) {
		for (const [key, value] of Object.entries(attrs)) {
			iframe.setAttribute(key, value as string);
		}
	}
	if (appendTo) {
		appendTo.appendChild(iframe);
	}
	return iframe;
}

export function injectAssets(
	url: string | { src: string; module?: boolean },
): Promise<boolean> {
	return new Promise((resolve, reject) => {
		if (!url) {
			reject("url must be defined");
		}
		let src = "";
		if (typeof url !== "string") {
			src = url.src as string;
		} else {
			src = url;
		}

		let found: NodeListOf<HTMLLinkElement | HTMLScriptElement>;
		const scriptType = src.includes(".css") ? "css" : "js";
		if (scriptType === "css") {
			found = document.querySelectorAll(`link[href="${src}"]`);
			if (found && found.length > 0) {
				resolve(true);
				return;
			}

			const head = document.getElementsByTagName("head")[0];
			const headStyles = head.querySelectorAll('link[rel="stylesheet"]');
			const link = document.createElement("link");

			link.rel = "stylesheet";
			link.type = "text/css";
			link.href = src;
			link.media = "all";

			if (headStyles) {
				head.insertBefore(link, headStyles[0]);
			} else {
				head.appendChild(link);
			}
			resolve(true);
			return;
		}

		found = document.querySelectorAll(`script[src="${src}"]`);
		if (found && found.length > 0) {
			resolve(true);
			return;
		}

		const script = document.createElement("script");
		script.type = "text/javascript";
		script.src = src;

		if (typeof url !== "string" && url?.module) {
			script.type = "module";
		}

		script.onload = () => {
			resolve(true);
		};
		document.body.appendChild(script);
	});
}

export function isNode(el: unknown): boolean {
	return !!(el && (el as Node).nodeType && (el as Node).nodeType === 1);
}

const isObject = (item: unknown): boolean => {
	return item !== null && typeof item === "object";
};

const isMergebleObject = (item): boolean => {
	return isObject(item) && !Array.isArray(item);
};
