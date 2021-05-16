<div align="center">
	<br />
	<img src="https://raw.githubusercontent.com/frankie-tech/glightbox/updated-docs/logo.svg" alt="GLightbox" width="500" height="240"/>
	<br />
</div>

<!-- the standard markdown way of linking an image, won't work in a github readme for svg though
![Logo](https://raw.githubusercontent.com/frankie-tech/glightbox/updated-docs/logo.svg)
 -->

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

![Current Version](https://img.shields.io/github/package-json/v/biati-digital/glightbox)

## Features

-   Only 11kb Gzipped
-   Works with any screen size
-   Create multiple galleries
-   Supports Youtube, Vimeo, and self hosted videos
-   Display inline content
-   `iframe` embed support
-   Keyboard navigation
-   Zoom and drag images on desktop
-   Style with minor CSS changes, or create your own skin.

## Before you dive in...

GLightbox is **not** a _Kitchen Sink_ lightbox solution.

The defaults provided will cover most use cases, and is been designed to give you, the developer, the power to customize the experience to meet your needs.

We ask and encourage you to read through the [documentation](https://linktodocumentation/), maybe more than once, search through the issues that have already been answered, and read our [support policy](#support) before submitting one of your own.

<div align="center">
	<br />
	<h2><strong>Links</strong></h2>
	<nav>
		<a href="#Installation"><strong>Installation</strong></a> | 
		<a href="#Usage/Examples"><strong>Usage/Examples</strong></a> | 
		<a href="#Documentation"><strong>Documentation</strong></a> | 
		<a href="#License"><strong>License</strong></a> | 
		<a href="#Support"><strong>Support</strong></a>
	</nav>
	<br />
</div>

## Installation

```sh
$ npm install glightbox
```

Or using a CDN

```html
<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css"
/>
<script src="https://cdn.jsdelivr.net/gh/mcstudios/glightbox/dist/js/glightbox.min.js"></script>
```

## Usage/Examples

GLightbox is designed to let you get started quickly. All you need is the two blocks of code below.

```js
const lightbox = GLightbox();
```

```html
<a href="large.jpg" class="glightbox">
	<img src="small.jpg" alt="image" />
</a>
```

### Use a video

```html
<a href="https://vimeo.com/115041822" class="glightbox">
	<img src="..." alt="" />
</a>
```

### Create multiple galleries from a single lightbox

Use the `data-gallery` attribute to create a gallery inside of an existing lightbox.

```html
<!-- Add the data-gallery with the same value -->
<a href="large.jpg" class="glightbox" data-gallery="Picasso">
	<img src="small.jpg" alt="image" />
</a>
<a href="video.mp4" class="glightbox" data-gallery="Picasso">
	<img src="small.jpg" alt="image" />
</a>
<a href="video2.mp4" class="glightbox" data-gallery="Van Gogh">
	<img src="small.jpg" alt="image" />
</a>
<button id="openGallery" data-gallery="Picasso">Open The Gallery</button>
```

```js
// Create a lightbox
const lightbox = GLightbox();
const openGallery = document.getElementById('openGallery');

// Using GLightbox.open(), pass an element with a data-gallery
// attribute, and only slides with that same gallery name
// will be included in that gallery
openGallery.onclick = ({ target }) => lightbox.open(target);
```

### Use events to run callbacks

It is also possible to listen for events on the GLightbox instance using `on` and `once`.

```js
const lightbox = GLightbox();

lightbox.once('open', () => {
	console.log(
		'This function is only going to run once when the lightbox opens!',
	);
});

lightbox.on('slide_before_change', (data) => {
	const { prev, current } = data;
	// data.prev and data.current contain the same data
	const {
		slideIndex, // current slide index
		slideNode, // current slide node (editable)
		slideConfig, // current config
		player, // player object, defaults to false
		trigger, // the element that triggered the slide [1]
	} = current;
});
```

[1] This can be the link, button, HTML element that opened this slide, or null if the slides were set dynamically

## Documentation

GLightbox offers more methods and configuration options, and we encourage you to read the [documentation](https://linktodocumentation) here.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Support

Issues **must** be submitted using the proper template. There are templates available for _feature requests_ and _bug reports_. Currently we are **unable** to offer support for debugging.
