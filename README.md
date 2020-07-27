# GLightbox

Glightbox is a pure javascript lightbox. It can display images, iframes, inline content and videos with optional autoplay for YouTube, Vimeo and even self hosted videos.

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
- **API** - control the lightbox with the provided methods
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
<a href="large.jpg" class="glightbox4" data-glightbox="title: My title; description: this is the slide description">
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

<!-- URL with no extension -->
<a href="https://picsum.photos/1200/800" data-glightbox="type: image">
    <img src="small.jpg" alt="image">
</a>
<!-- OR using multiple data attributes -->
<a href="https://picsum.photos/1200/800" data-type="image">
    <img src="small.jpg" alt="image">
</a>


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
* zoomable
* draggable

```html
<!-- One line config -->
<a href="large.jpg" data-glightbox="title: Your title; description: description here; descPosition: left; type: image; effect: fade; width: 900px; height: auto; zoomable: true; draggable: true;"></a>

<!-- Multiple data attributes / You can use the options as separated data attributes -->
<a href="large.jpg" data-title="My title" data-description="description here" data-desc-position="right" data-type="image" data-effect="fade" data-width="900px" data-height="auto" data-zoomable="true" data-draggable="true"></a>
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
    beforeSlideLoad: (slideData) => {
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
        },
        {
            'content': '<p>This will append some html inside the slide</p>' // read more in the API section
        },
        {
            'content': document.getElementById('inline-example') // this will append a node inside the slide
        },
    ],
    autoplayVideos: true,
});
myGallery.open();

// If later you need to modify the elements you can use setElements
myGallery.setElements([...]);
```

Option               | Type     |  Default         | Description
------               | ----     |  -------         | -----------
selector             | string   | `.glightbox`     | Name of the selector for example '.glightbox' or 'data-glightbox' or '*[data-glightbox]'
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
width                | number   | `900px`          | Default width for inline elements and iframes, you can define a specific size on each slide. You can use any unit for example 90% or 100vw for full width
height               | number   | `506px`          | Default height for inline elements and iframes, you can define a specific size on each slide.You can use any unit for example 90% or 100vw **For inline elements you can set the height to auto**.
videosWidth          | number   | `960px`          | Default width for videos. Videos are responsive so height is not required. The width can be in px % or even vw for example, 500px, 90% or 100vw for full width videos
descPosition         | string   | `bottom`         | Global position for slides description, you can define a specific position on each slide (bottom, top, left, right).
loop                 | boolean  | `false`          | Loop slides on end.
zoomable             | boolean  | `true`           | Enable or disable zoomable images you can also use data-zoomable="false" on individual nodes.
draggable            | boolean  | `true`           | Enable or disable mouse drag to go prev and next slide (only images and inline content), you can also use data-draggable="false" on individual nodes.
dragToleranceX       | number   | `40`             | Used with draggable. Number of pixels the user has to drag to go to prev or next slide
dragToleranceY       | number   | `65`             | Used with draggable. Number of pixels the user has to drag up or down to close the lightbox (Set 0 to disable vertical drag)
preload              | boolean  | `true`           | Enable or disable preloading
svg                  | object   | `{}`             | Set your own svg icons
autoplayVideos       | boolean  | `true`           | Autoplay videos on open.
plyr                 | object   | `{}`             | [View video player options.](#player)

## Events

Option               | Description
------               | -----------
onOpen               | Provide a function when the lightbox is opened for the first time.
onClose              | Provide a function when the lightbox is closed.
beforeSlideChange    | Trigger a function before the slide is changed `beforeSlideChange: function(prevSlide, currentSlide) {}`
afterSlideChange     | Trigger a function after the slide is changed `afterSlideChange: function(prevSlide, currentSlide) {}`
beforeSlideLoad      | Trigger a function before a slide is loaded for the first time, the function will only be called once. `beforeSlideLoad: function(slideData) {}`
afterSlideLoad       | Trigger a function after a slide is loaded for the first time, the function will only be called once. `afterSlideLoad: function(slideData) {}`
slideInserted        | Trigger a function after a slide is inserted using insertSlide. `slideInserted: function(slideData) {}`
slideRemoved         | Trigger a function after a slide is removed. `slideRemoved: function(deletedIndex) {}`

```javascript
const lightbox = GLightbox({
    selector: '.glightbox3',
    afterSlideChange: (prevSlide, currentSlide) => {
        // prevSlide is the previously active slide
        // currentSlide is the active slide
        // the player variable can be false if slide has no video

        const { index, slide, player } = currentSlide;

        if (player) {
            if (!player.ready) {
                // If player is not ready
                player.on('ready', event => {
                    // Do something when video is ready
                });
            }

            player.on('play', event => {
                console.log("Started play");
            });

            player.on('volumechange', event => {
                console.log("Volume change");
            });

            player.on('ended', event => {
                console.log("Video ended");
            });
        }
    },
    slideInserted: (slideData) => {
        const { index, slide, player } = slideData;
    },
    afterSlideLoad: (slideData) => {
        const { index, slide, player } = slideData;
    }
});
```

## Video player

Starting from version 2.0.2 glightbox droped support of JWPlayer because that player implemented new restrictions for the free edition, it was replaced with an awesome new player "[Plyr](https://plyr.io/)" that also includes support for YouTube and Vimeo. So instead of maintaining 3 different APIs now we only can focus on one. You can pass any Plyr option to the player, view all available options here [Plyr options](https://github.com/sampotts/plyr).

Please note that GLightbox will only inject the video player library if required and only when the lightbox is opened.

**Internet Explorer 11. If you need support for this browser you need to set the js url to use the polyfilled version. This is not the default because IE11 is ancient and we need to let it die.**

```
plyr: {
    js: 'https://cdn.plyr.io/3.6.2/plyr.polyfilled.js',
    ....
```


```javascript
const lightbox = GLightbox({
    plyr: {
        css: 'https://cdn.plyr.io/3.5.6/plyr.css', // Default not required to include
        js: 'https://cdn.plyr.io/3.5.6/plyr.js', // Default not required to include
        config: {
            ratio: '16:9', // or '4:3'
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

## API
There are methods, setters and getters on a GLightbox object. The easiest way to access the GLightbox object is to set the return value from your call to a variable. For example:

```javascript
const lightbox = GLightbox({...options});
```

## Methods

Example method use:

```javascript
lightbox.nextSlide(); // Go to next slide
lightbox.close(); // Close the lightbox
```

Option                |  Parameters      | Description
------                |  -------         | -----------
open                  | `node`           | Open the lightbox, you can optionally pass a node.
openAt                | `number`         | Open at specific index.
close                 | `-`              | Close the lightbox.
reload                | `-`              | Reload the lightbox, after inserting content with ajax.
destroy               | `-`              | Destroy and remove all attached events.
prevSlide             | `-`              | Go to the previous slide.
nextSlide             | `-`              | Go to the next slide.
goToSlide             | `number`         | Index of the slide.
insertSlide           | `object, index`  | Insert a slide at the specified index.
removeSlide           | `index`          | Remove slide at the specified index.
getActiveSlide        | `-`              | Get active slide. It will return the active node.
getActiveSlideIndex   | `-`              | Get active slide. It will return the active slide index.
playSlideVideo        | `number`         | Play video in the specified slide.
stopSlideVideo        | `number`         | Stop video in the specified slide.
getSlidePlayerInstance| `node, index`    | Get the player instance of the specified slide.
getAllPlayers         | `-`              | Get all players instance.
setElements           | `[]`             | Update the lightbox gallery elements.

```javascript
// Example set custom gallery items
// This overwrites all the items in the gallery
lightbox.setElements([
  {
    'href': 'https://picsum.photos/1200/800',
    'type': 'image' // Type is only required if GlIghtbox fails to know what kind of content should display
  },
  {
    'href': 'https://www.youtube.com/watch?v=Ga6RYejo6Hk',
    'type': 'video', // Type is only required if GlIghtbox fails to know what kind of content should display
    'width': '900px',
  },
  {
    'content': '<p>some html to append in the slide</p>',
    'width': '900px',
  }
]);


// Insert a single slide at the end of all the items,
lightbox.insertSlide({
    href: 'video url...',
    width: '90vw'
});

// Insert a single slide at index 2 or pass 0 to add it at the start
lightbox.insertSlide({
    href: 'video url...',
    width: '90vw'
}, 2);

// You can insert a slide with a defined html
lightbox.insertSlide({
    content: '<p>some html to append in the slide</p>',
    width: '90vw'
}, 2);

// Or if you prefer you can pass a node
// and it will be inserted in the slide
lightbox.insertSlide({
    content: document.getElementById('inline-example'),
    width: '90vw'
}, 2);

// Remove the slide at index 2
lightbox.removeSlide(2);

// Open the lightbox
lightbox.open();

// You can also open the lightbox at a specific index
lightbox.openAt(2);

// So imagine that you are making an ajax request that returns some html
// You can create an empty instance and append the content once is returned

const ajaxExample = GLightbox({ selector: null }); // or you can set the selector empty selector: ''

doAjaxCall({...}).then(response => {
    ajaxExample.insertSlide({
        width: '500px',
        content: response.html
    });
    ajaxExample.open();
})

// Or you could use the set elements method to empty all the slides if any

doAjaxCall({...}).then(response => {
    ajaxExample.setElements([
      {
        content: response.html
      }
    ]);
    ajaxExample.open();
})

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

It will work in any browser that supports CSS Flexbox

## Contributing

Feel free to report any issues! If you wish to contribute by fixing a bug or implementing a new feature, please first read the [CONTRIBUTING](./CONTRIBUTING.md) guide.

## Donate

If you find this code useful, please consider a donation to keep this project growing, any amount is appreciated.

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://paypal.me/bdigital9816/5usd)

## Changelog

### 3.0.2

- New: Option "zoomable" to enable or disable zoomable images
- New: Option "preload" to enable or disable preloading
- New: Option "draggable" to go to prev/next slide by mouse dragging. Thanks to @Hirbod for the donation to make this happen
- New: Option "dragToleranceX" Used with draggable. Number of pixels the user has to drag to go to prev or next slide
- New: Option "dragToleranceY" Used with draggable. Number of pixels the user has to drag up or down to close the lightbox (Set 0 to disable vertical drag)
- New: The code was refactored to make it easier to maintain
- Fixed: data gallery stopped working
- Fixed: iOS bug with Vimeo iframe when fullscreen button pressed
- Fixed: "See more" link in the description throws an JS error when clicked
- Fixed: Videos not resized vertically when window height was smaller that the window width

### 3.0.1

- Fixed: vertical scrolling of descriptions [@zothynine](https://github.com/biati-digital/glightbox/pull/134)
- Fixed: CSS properties bug
- Fixed: Passing null as selector throws an exception

### 3.0.0

- New: New methods to access player instances "getSlidePlayerInstance(index or node) and getAllPlayers"
- New: Access player instance from afterSlideChange and beforeSlideChange"
- New: New Method removeSlide(1) remove slide at the specified index, it works even when the lightbox is open
- New: insertSlide now works even when the lightbox is open
- New: Added Accesibility features to slides
- New: Enabled touchNavigation for all devices that support touch events and not only mobile devices
- Changed: afterSlideLoad and beforeSlideLoad methods to follow the same variables as afterSlideChange, beforeSlideChange
- Fixed: Calling `destroy()` throws an error when modal is not open
- Fixed: Navigation not disabled correctly when only one slide

### 2.0.6

- New: Now you can define width and height as 900px, 95%, 100vw, 100vh so you can have full screen content
- New: Now you can define custom html or a node in the slide data to append it to the slide (view the API section)
- New: Now you can use any attribute as selector for example '.glightbox' or 'data-glightbox' or '*[data-glightbox]'
- New: Method "openAt" you can open the lightbox at specific index eg: lightbox.openAt(2);
- New: Method "insertSlide" that allows you to append a slide at specified index
- Fixed Tab Key Doesn't Work on Form Within GLightbox Inline Content
- Fixed Scrolling Description triggers closing the lightbox on touch devices
- Fixed Page jumps depending on page scrollbar
- Fixed Overriding default plyr settings does not merge correctly
- Fixed fullscreen video button on ios
- Moved plyr.ratio to plyr.config.ratio

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
