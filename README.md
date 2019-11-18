# GLightbox

Glightbox is a pure javascript lightbox. It can display images, iframes, inline content and videos with optional autoplay for youtube, vimeo and even self hosted videos.

## Features
- **Small** - only 11KB Gzipped
- **Responsive** - works with any screen size
- **Gallery Support** - Create multiple galleries
- **Video Support** - Youtube, Vimeo and self hosted videos with autoplay
- **Inline content support** - display any inline content
- **Iframe support** - need to embed an iframe? no problem
- **Keyboard Navigation** - esc, arrows keys, tab and enter is all you need
- **Touch Navigation** - mobile touch events
- **Zoomable images** - zoom and drag images on mobile and desktop
- **Api** - control the lightbox with the provided methods
- **Customizable** - create your skin or modify the animations with some minor css changes

## Live Demo
You can check the live demo [right here](https://biati-digital.github.io/glightbox/)

## Usage

```bash
$ npm install glightbox
# OR
$ yarn add glightbox
# OR
$ bower install glightbox
```

```javascript
import GLightbox from 'glightbox'
```

Or manually download and link `glightbox.min.js` in your HTML:

```html
<link rel="stylesheet" href="dist/css/glightbox.css">
<script src="dist/js/glightbox.min.js"></script>

OR CDN

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css">
<script src="https://cdn.jsdelivr.net/gh/mcstudios/glightbox/dist/js/glightbox.min.js"></script>

<script type="text/javascript">
    const lightbox = GLightbox({ ...options });
</script>
```

## Examples

```html
<!-- Simple image -->
<a href="large.jpg" class="glightbox">
    <img src="small.jpg" alt="image">
</a>

<!-- Video -->
<a href="https://vimeo.com/115041822" class="glightbox2">
    <img src="small.jpg" alt="image">
</a>

<!-- Gallery -->
<a href="large.jpg" class="glightbox3" data-gallery="gallery1">
    <img src="small.jpg" alt="image">
</a>
<a href="video.mp4" class="glightbox3" data-gallery="gallery1">
    <img src="small.jpg" alt="image">
</a>

<!-- Simple Description -->
<a href="large.jpg" class="glightbox4" data-glightbox="title: My title; description: this is the slide desciption">
    <img src="small.jpg" alt="image">
</a>

<!-- Advanced Description -->
<a href="large.jpg" class="glightbox5" data-glightbox="title: My title; description: .custom-desc1">
    <img src="small.jpg" alt="image">
</a>

<div class="glightbox-desc custom-desc1">
    <p>The content of this div will be used as the slide description</p>
    <p>You can add links and any HTML you want</p>
</div>
```

## Slide Options

You can specify some options to each individual slide, the available options are:
* title
* description
* descPosition
* type
* effect
* width
* height

```html
<!-- One line config -->
<a href="large.jpg" data-glightbox="title: Your title; description: desciption here; descPosition: left; type: image; effect: fade; width: 900px; height: auto;"></a>

<!-- Multiple data attributes / You can use the options as separated data attributes -->
<a href="large.jpg" data-title="My title" data-description="desciption here" data-descPosition="right" data-type="image" data-effect="fade" data-width="900px" data-height="auto"></a>
```


## Lightbox Options

Example use of the options.

```javascript
const lightbox = GLightbox({
    touchNavigation: true,
    loop: true,
    autoplayVideos: true,
    onOpen: () => {
        console.log('Lightbox opened')
    },
    beforeSlideLoad: (slide, data) => {
        // Need to execute a script in the slide?
        // You can do that here...
    }
});

// Instead of using a selector, define the gallery elements
const myGallery = GLightbox({
    elements: [
        {
            'href': 'https://picsum.photos/1200/800',
            'type': 'image',
            'title': 'My Title',
            'description': 'Example',
        },
        {
            'href': 'https://picsum.photos/1200/800',
            'type': 'image'
        },
        {
            'href': 'https://www.youtube.com/watch?v=Ga6RYejo6Hk',
            'type': 'video',
            'source': 'youtube', //vimeo, youtube or local
            'width': 900,
        }
    ],
    autoplayVideos: true,
});
myGallery.open();

// If later you need to modify the elements you can use setElements
myGallery.setElements([...]);
```

Option               | Type     |  Default         | Description
------               | ----     |  -------         | -----------
selector             | string   | `glightbox`      | Class name of the elements.
elements             | array    | `null`           | Instead of passing a selector you can pass all the items that you want in the gallery.
skin                 | string   | `clean`          | Name of the skin, it will add a class to the lightbox so you can style it with css.
openEffect           | string   | `zoomIn`         | Name of the effect on lightbox open. (zoom, fade, none)
closeEffect          | string   | `zoomOut`        | Name of the effect on lightbox close. (zoom, fade, none)
slideEffect          | string   | `slide`          | Name of the effect on slide change. (slide, fade, zoom, none)
moreText             | string   | `See more`       | More text for descriptions on mobile devices.
moreLength           | number   | `60`             | Number of characters to display on the description before adding the moreText link (only for mobiles), if 0 it will display the entire description.
closeButton          | boolean  | `true`           | Show or hide the close button.
touchNavigation      | boolean  | `true`           | Enable or disable the touch navigation (swipe).
touchFollowAxis      | boolean  | `true`           | Image follow axis when dragging on mobile.
keyboardNavigation   | boolean  | `true`           | Enable or disable the keyboard navigation.
closeOnOutsideClick  | boolean  | `true`           | Close the lightbox when clicking outside the active slide.
startAt              | number   | `0`              | Start lightbox at defined index.
width                | number   | `900`            | Default with for inline elements and iframes, you can define a specific size on each slide.
height               | number   | `506`            | Default height for inline elements and iframes, you can define a specific size on each slide. **For inline elements you can set the height to auto**.
videosWidth          | number   | `960`            | Default width for videos. Videos are responsive so height is not required.
descPosition         | string   | `bottom`         | Global position for slides description, you can define a specific position on each slide (bottom, top, left, right).
loop                 | boolean  | `false`          | Loop slides on end.
svg                  | object   | `{}`             | Set your own svg icons
autoplayVideos       | boolean  | `true`           | Autoplay videos on open.
plyr                 | object   | `{}`             | [View video player options.](#player)

## Events

Option               | Description
------               | -----------
onOpen               | Provide a function when the lightbox is opened for the first time.
onClose              | Provide a function when the lightbox is closed.
beforeSlideChange    | Trigger a function before the slide is changed `beforeSlideChange: function(prevSlide, slide) {}`
afterSlideChange     | Trigger a function after the slide is changed `afterSlideChange: function(prevSlide, activeSlide) {}`
beforeSlideLoad      | Trigger a function before a slide is loaded for the first time, the function will only be called once. `beforeSlideLoad: function(slide, data) {}`
afterSlideLoad       | Trigger a function after a slide is loaded for the first time, the function will only be called once. `afterSlideLoad: function(slide, data) {}`

## Video player

Starting from version 2.0.2 glightbox droped support of JWPlayer because that player implemented new restrictions for the free edition, it was replaced with an awesome new player "[Plyr](https://plyr.io/)" that also includes support for youtube and vimeo. So instead of maintaining 3 different apis now we only can focus on one. You can pass any Plyr option to the player, view all available options here [Plyr options](https://github.com/sampotts/plyr).

Please note that GLightbox will only inject the video player library if required and only when the lightbox is opened.

```javascript
const lightbox = GLightbox({
    plyr: {
        css: 'https://cdn.plyr.io/3.5.6/plyr.css', // Default not required to include
        js: 'https://cdn.plyr.io/3.5.6/plyr.js', // Default not required to include
        config: {
            muted: false,
            hideControls: true,
            youtube: {
                noCookie: true,
                rel: 0,
                showinfo: 0,
                iv_load_policy: 3
            },
            vimeo: {
                byline: false,
                portrait: false,
                title: false,
                speed: true,
                transparent: false
            }
        }
    }
});
```

## Api
There are methods, setters and getters on a GLightbox object. The easiest way to access the GLightbox object is to set the return value from your call to a variable. For example:

```javascript
const lightbox = GLightbox({...options});
```

## Methods

Example method use:

```javascript
lightbox.nextSlide(); // Go to next slide
lightbox.close(); // Close de lightbox
```

Option                |  Parameters      | Description
------                |  -------         | -----------
open                  | `node`           | Open the lightbox, you can optionally pass a node.
close                 | `-`              | Close the lightbox.
reload                | `-`              | Reload the lightbox, after inserting content with ajax.
destroy               | `-`              | Destroy and remove all attached events.
prevSlide             | `-`              | Go to the previous slide.
nextSlide             | `-`              | Go to the next slide.
goToSlide             | `number`         | Index of the slide.
getActiveSlide        | `-`              | Get active slide. It will return the active node.
getActiveSlideIndex   | `-`              | Get active slide. It will return the active slide index.
playSlideVideo        | `number`         | Play video in the specified slide.
stopSlideVideo        | `number`         | Stop video in the specified slide.
setElements           | `{}`             | Update the lightbox gallery elements.

```javascript
// Example set custom gallery items
lightbox.setElements([
  {
    'href': 'https://picsum.photos/1200/800',
    'type': 'image'
  },
  {
    'href': 'https://www.youtube.com/watch?v=Ga6RYejo6Hk',
    'type': 'video',
    'source': 'youtube', //vimeo, youtube or local
    'width': 900,
  }
]);
// Open the lightbox
lightbox.open();
```


## Development

```bash
$ npm install
$ npm run watch
```

## Browser Support

GLightbox was tested in the following browsers.
- Safari
- Mobile Safari
- Opera
- Edge
- Firefox
- Internet Explorer 11

It will work in any browser that supports css Flexbox

## Contributing

Feel free to report any issues! If you wish to contribute by fixing a bug or implementing a new feature, please first read the [CONTRIBUTING](./CONTRIBUTING.md) guide.


## Changelog
### 2.0.5
- New: Loop, renamed loopAtEnd to loop and now works in both directions
- New: added touchFollowAxis, for mobile when dragging the media will follow the same axis, set to false to move media as you wish
- New: added jpe format
- Fixed .mov videos not recognized as videos

### 2.0.4
- Fixed some errors when zooming and dragging images
- Fixed description position not respected when configured globally
- Fixed local videos not resized correctly when entered fullscreen

### 2.0.3
- New: Zooming images. Now you can zoom images on desktop if image is too large
- New: Now you can also define the slide description using the content of any div you want.
- New: Replaced png icons with svg and added options to customize them.
- Fixed responsive videos not resizing correctly when resizing the window vertically
- Fixed responsive images not resizing correctly if they have description and the window height is lower that the slide height
- Fixed youtube video not detected correctly for urls like youtube(-nocookie).com/embed/...

### 2.0.2
- New: [Plyr player](https://plyr.io/), we have changed to this player so that way only one api is managed instead of 3
- New: Added tabindex accesibility to loop the controls with the tab key
- New: Inside inline content you can close the lightbox by adding the class **gtrigger-close** to any element
- Fixed StartAt not taking specified index
- Removed JWPlayer because that player implemented some restrictions unless you pay for a license
- Improved mobile touch events, swipe, move, zoom, etc.
- Changed: Youtube now by default uses youtube-nocookie.com, you can enable cookies in the config with youtube.nocookie to false
- Removed option videosHeight. The height is automatic depending the video width and ratio.
- Removed Gulp and replaced for pure nodejs scripts
- Improved documentation

### 2.0.1
- Fixed Mobile navigation
- Fixed slide width for external sources

### 2.0.0
- New: Delegated permissions to cross-origin iframes (for the new browsers autoplay restrictions)
- Fixed youtube, vimeo autoplay when changing slides
- Fixed lightbox won't fit screen with description
- Fixed Removed global body variable that was causing some problems

### 1.0.9
- Added svg to source types so it can be displayed as an image [@tuomassalo](https://github.com/mcstudios/glightbox/pull/40)
- Added contributing file
- Updated dependencies [@tuomassalo](https://github.com/mcstudios/glightbox/pull/40).
- Removed demo folder from npm

### 1.0.8
- New: You can define each slide option in a different data attribute (data-title="example" data-description="...")
- Fixed youtube and vimeo autoplay when opened for the first time
- Fixed global slide params not working
- Fixed some issues on IE11
- Fixed using characters : or ; in slide description
### 1.0.7
- New: Added reload method, useful when injecting content with ajax, cloning nodes, etc.
- Fixed closeButton setting not removing the element
- Fixed video not displayed on mobile devices
### 1.0.6
- New: Now you can set individual width and height for each slide with inlines or iframes.
- New: Now you can set individual source types for each slide ('type': 'image' | 'iframe' | 'video' | 'inline' | 'external).
- New: Published on npm
- New: Published on bower
- Fixed afterSlideLoad only triggered one time for all the slides
- Fixed a small space between the image and description when is set to top or bottom
### 1.0.5
- New: Added none as a new option to disable open, close and slide animations
- New: Added new options (touchNavigation, keyboardNavigation, closeOnOutsideClick) to enable or disable user interaction
- Fixed open and close effect not taking a custom animation
- Fixed an error when calling the destroy method and no videos were present in the slider
### 1.0.4
- Improved the open method so it can be called without duplicating the structure and events
- New: The original node is passed to events like beforeSlideChange, afterSlideChange, etc.
### 1.0.3
- New: Added option moreLength to control the number of characters in the description for mobile devices
### 1.0.2
- Fixed instance not returned and unable to call public methods
### 1.0.1
- Fixed large images not displayed correctly

### 1.0.0
- Initial release

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details