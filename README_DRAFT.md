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
<script src="https://cdn.jsdelivr.net/npm/glightbox/dist/js/glightbox.min.js"></script>
```

## Usage/Examples

GLightbox is designed to let you get started quickly. All you need is the two blocks of code below.

```js
const lightbox = GLightbox();
```

```html
<a href="my-photograph.large.jpg" class="glightbox">
	<img src="my-photograph.small.jpg" alt="photograph description" />
</a>
```

### Use a video

```html
<a href="https://vimeo.com/115041822" class="glightbox">
	<img src="video-thumbnail.jpg" alt="..." />
</a>
```

### Create multiple galleries from a single lightbox

Use the `data-gallery` attribute to create a gallery inside of an existing lightbox.

```html
<!-- Open a gallery of Picasso images -->
<a href="the-weeping-woman.full-size.jpg" class="glightbox" data-gallery="Picasso">
	<img src="the-weeping-woman.thumbnail.jpg" alt="image" />
</a>
<a href="untitled-by-picasso.full-size.jpg" class="glightbox" data-gallery="Picasso">
	<img src="untitled-by-picasso.thumbnail.jpg" alt="image" />
</a>
<!-- Open a gallery of Van Gogh images -->
<a href="almond-blossoms.full-size.jpg" class="glightbox" data-gallery="Van Gogh">
	<img src="almond-blossoms.thumbnail.jpg" alt="image" />
</a>
<a href="the-potato-eaters.full-size.jpg" class="glightbox" data-gallery="Van Gogh">
	<img src="the-potato-eaters.thumbnail.jpg" alt="image" />
</a>
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


### Options

Options are passed to the GLightbox function as an object. A number of options can also be applied individually to the slides using `data-*` attributes or using `data-glightbox` on the element. [2] If not set on the element, then the options are inherited from the GLightbox instance.

#### Slide Options 

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| title | `string` | `''` | Add a title to slides. |
| alt | `string` | `''` | Passes the `alt` description of the image and adds it as an attribute to maintain accessibility. |
| description | `string` | `''` | Add descriptions to slides. |
| descPosition | `string` | `'bottom'` | Available Options: `'top'`, `'right'`, `'bottom'`, `'left'`. |
| type | `string` | `'image'` | Available Options: `'image'`, `'external'`, `'video'`, `'inline'`. |
| effect | `string` | `'fade'` | Available Options: `'fade'`, `'zoom'`, `'slide'`, `'none'`. |
| width | `string\|number` | `'900px'` | Applies to inline elements and iframes. Any unit can be used, but numbers will be converted to `px`. |
| height | `string\|number` | `'auto'` | Applies to inline elements and iframes. Any unit can be used, but numbers will be converted to `px`. |
| zoomable | `boolean` | `true` | Enable/disable zoom for images. |
| draggable | `boolean` | `true` | Enable/disable drag for images. |

[2] To apply options using `data-glightbox` they must be formatted like in the example below:
```html
<a data-glightbox="title: Quarterly report;description: yikes it's not good;descPosition: left;type: image;" href="quarterly-graph.jpg">See Quarterly Reports</a>
```

#### GLightbox Options
| Name | Type | Default | Description |
|---|---|---|---|
| selector | `string` | `'.glightbox'` | A valid selector, e.g. `'[data-glightbox]'`, `'.my-lightbox'`. | 
| elements | `array` | `null` | Option to pass in an array of elements, learn more [here](linktodocumentation). |
| skin | `'string'` | `'clean'` | Name of a CSS theme. Adds a class to the lightbox `'.glightbox-${skin}'` for more customization. |
| openEffect | `string` | `'zoom'` | Name of effect to run on lightbox open. Available Options: `'zoom'`, `'fade'`, `'none'`. |
| closeEffect | `string` | `'zoom'` | Name of effect to run on lightbox close. Available Options: `'zoom'`, `'fade'`, `'none'`. |
| slideEffect | `string` | `'slide'` | Name of effect to run on slide change. Available Options: `'slide'`, `'fade'`, `'zoom'`, `'none'`. |
| moreText | `string` | `'See more'` | When descriptions are too long on mobile, this text will show as the toggle text. |
| moreLength | `number` | `60` | Number of characters to display on the description before adding the moreText link. If set to `0`, then the entire description will always be shown. |
| closeButton | `boolean` | `true` | Show/hide the close button. |
| touchNavigation | `boolean` | `true` | Enable/disable ability to navigate by swipe/touch. |
| touchFollowAxis | `boolean` | `true` | Enable/disable image following the axis when dragging. |
| keyboardNavigation | `boolean` | `true` | Enable/disable ability to navigate by keyboard. |
| closeOnOutsideClick | `boolean` | `true` | Enable/disable clicking outside of the active slide closing the lightbox. |
| startAt | `number` | `0` | The slide index the lightbox should start at. |
| width | `string\|number` | `'900px'` | Default width for inline elements and iframes. Any unit can be used, but numbers will be converted to `px`. |
| height | `string\|number` | `'506px'` | Default height for inline elements and iframes. Any unit can be used, but numbers will be converted to `px`. **Inline elements can have their height set to 'auto'.** |
| videosWidth | `string\|number` | `'960px'` | Default width for videos. Any unit can be used, but numbers will be converted to `px`. |
| descPosition | `string` | `'bottom'` | Global position for slide descriptions. Available Options: `'top'`, `'right'`, `'bottom'`, `'left'`. |

<!--
## Documentation

GLightbox offers more methods and configuration options, and we encourage you to read the [documentation](https://linktodocumentation) here.
-->
## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Support

Issues **must** be submitted using the proper template. There are templates available for _feature requests_ and _bug reports_. Currently we are **unable** to offer support for debugging.
