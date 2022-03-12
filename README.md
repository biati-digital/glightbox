# GLightbox

GLightbox is a pure javascript lightbox. It can display images, iframes, inline content and videos with optional autoplay for YouTube, Vimeo and even self hosted videos.

## Features

- **Small** - only 11KB Gzipped
- **Fast and Responsive** - works with any screen size
- **Gallery Support** - Create multiple galleries
- **Response Images Support** - Let the browser use the optimal image for the current screen resolution
- **Video Support** - Youtube, Vimeo and self hosted videos with autoplay
- **Inline content support** - display any inline content
- **Iframe support** - need to embed an iframe? no problem
- **Keyboard Navigation** - esc, arrows keys, tab and enter is all you need
- **Touch Navigation** - mobile touch events
- **Zoomable images** - zoom and drag images on mobile and desktop
- **API** - control the lightbox with the provided methods
- **Themeable** - create your skin or modify the animations with some minor css changes

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
// Using ESM specification
import '/path/to/glightbox.js';

// Using a bundler like webpack
import GLightbox from 'glightbox';
```

Or manually download and link `glightbox.min.js` in your HTML:

```html
<link rel="stylesheet" href="dist/css/glightbox.css" />
<script src="dist/js/glightbox.min.js"></script>

<!-- USING A CDN -->

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css" />
<script src="https://cdn.jsdelivr.net/gh/mcstudios/glightbox/dist/js/glightbox.min.js"></script>

<script type="text/javascript">
  const lightbox = GLightbox({ ...options });
</script>

<!-- USING ES MODULES -->

<script type="module">
  import 'https://cdn.jsdelivr.net/gh/mcstudios/glightbox/dist/js/glightbox.min.js';

  const lightbox = GLightbox({ ...options });
</script>
```

## Examples

```html
<!-- Simple image -->
<a href="large.jpg" class="glightbox">
  <img src="small.jpg" alt="image" />
</a>

<!-- Video -->
<a href="https://vimeo.com/115041822" class="glightbox2">
  <img src="small.jpg" alt="image" />
</a>

<!-- Gallery -->
<a href="large.jpg" class="glightbox3" data-gallery="gallery1">
  <img src="small.jpg" alt="image" />
</a>
<a href="video.mp4" class="glightbox3" data-gallery="gallery1">
  <img src="small.jpg" alt="image" />
</a>

<!-- Simple Description -->
<a href="large.jpg" class="glightbox4" data-glightbox="title: My title; description: this is the slide description">
  <img src="small.jpg" alt="image" />
</a>

<!-- Advanced Description -->
<a href="large.jpg" class="glightbox5" data-glightbox="title: My title; description: .custom-desc1">
  <img src="small.jpg" alt="image" />
</a>

<div class="glightbox-desc custom-desc1">
  <p>The content of this div will be used as the slide description</p>
  <p>You can add links and any HTML you want</p>
</div>

<!-- URL with no extension -->
<a href="https://picsum.photos/1200/800" data-glightbox="type: image">
  <img src="small.jpg" alt="image" />
</a>
<!-- OR using multiple data attributes -->
<a href="https://picsum.photos/1200/800" data-type="image">
  <img src="small.jpg" alt="image" />
</a>

<!-- Using responsive images: specify sizes and srcset through data attributes in the
     same way you would with the img tag.
     See: https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images -->
<a href="deafult.jpg" class="glightbox6" data-title="Responsive example"
data-description="Your browser will choose the optimal image for the resolution"
data-sizes="(max-width: 600px) 480px, 800px"
data-srcset="img480.jpx 480w img800.jpg 800w">
  <img src="small.jpg" alt="image" />
</a>
```

## Slide Options

You can specify some options to each individual slide, the available options are:

- title
- alt
- description
- descPosition
- type
- effect
- width
- height
- zoomable
- draggable

```html
<!-- One line config -->
<a href="large.jpg" data-glightbox="title: Your title; description: description here; descPosition: left; type: image; effect: fade; width: 900px; height: auto; zoomable: true; draggable: true;"></a>

<!-- Multiple data attributes / You can use the options as separated data attributes -->
<a
  href="large.jpg"
  data-title="My title"
  data-description="description here"
  data-desc-position="right"
  data-type="image"
  data-effect="fade"
  data-width="900px"
  data-height="auto"
  data-zoomable="true"
  data-draggable="true"
></a>
```

## Lightbox Options

Example use of the options.

```javascript
const lightbox = GLightbox({
    touchNavigation: true,
    loop: true,
    autoplayVideos: true
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
            'type': 'image',
            'alt': 'image text alternatives'
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

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| selector | string | `.glightbox` | Name of the selector for example '.glightbox' or 'data-glightbox' or '\*[data-glightbox]' |
| elements | array | `null` | Instead of passing a selector you can pass all the items that you want in the gallery. |
| skin | string | `clean` | Name of the skin, it will add a class to the lightbox so you can style it with css. |
| openEffect | string | `zoom` | Name of the effect on lightbox open. (zoom, fade, none) |
| closeEffect | string | `zoom` | Name of the effect on lightbox close. (zoom, fade, none) |
| slideEffect | string | `slide` | Name of the effect on slide change. (slide, fade, zoom, none) |
| moreText | string | `See more` | More text for descriptions on mobile devices. |
| moreLength | number | `60` | Number of characters to display on the description before adding the moreText link (only for mobiles), if 0 it will display the entire description. |
| closeButton | boolean | `true` | Show or hide the close button. |
| touchNavigation | boolean | `true` | Enable or disable the touch navigation (swipe). |
| touchFollowAxis | boolean | `true` | Image follow axis when dragging on mobile. |
| keyboardNavigation | boolean | `true` | Enable or disable the keyboard navigation. |
| closeOnOutsideClick | boolean | `true` | Close the lightbox when clicking outside the active slide. |
| startAt | number | `0` | Start lightbox at defined index. |
| width | number | `900px` | Default width for inline elements and iframes, you can define a specific size on each slide. You can use any unit for example 90% or 100vw for full width |
| height | number | `506px` | Default height for inline elements and iframes, you can define a specific size on each slide.You can use any unit for example 90% or 100vw **For inline elements you can set the height to auto**. |
| videosWidth | number | `960px` | Default width for videos. Videos are responsive so height is not required. The width can be in px % or even vw for example, 500px, 90% or 100vw for full width videos |
| descPosition | string | `bottom` | Global position for slides description, you can define a specific position on each slide (bottom, top, left, right). |
| loop | boolean | `false` | Loop slides on end. |
| zoomable | boolean | `true` | Enable or disable zoomable images you can also use data-zoomable="false" on individual nodes. |
| draggable | boolean | `true` | Enable or disable mouse drag to go prev and next slide (only images and inline content), you can also use data-draggable="false" on individual nodes. |
| dragToleranceX | number | `40` | Used with draggable. Number of pixels the user has to drag to go to prev or next slide. |
| dragToleranceY | number | `65` | Used with draggable. Number of pixels the user has to drag up or down to close the lightbox (Set 0 to disable vertical drag). |
| dragAutoSnap | boolean | `false` | If true the slide will automatically change to prev/next or close if dragToleranceX or dragToleranceY is reached, otherwise it will wait till the mouse is released. |
| preload | boolean | `true` | Enable or disable preloading. |
| svg | object | `{}` | Set your own svg icons. |
| cssEfects | object | 'See animations' | Define or adjust lightbox animations. See the Animations section in the README. |
| lightboxHTML | string | 'See themes' | You can completely change the html of GLightbox. See the Themeable section in the README. |
| slideHTML | string | 'See themes' | You can completely change the html of the individual slide. See the Themeable section in the README. |
| autoplayVideos | boolean | `true` | Autoplay videos on open. |
| autofocusVideos | boolean | `false` | If true video will be focused on play to allow keyboard sortcuts for the player, this will deactivate prev and next arrows to change slide so use it only if you know what you are doing. |
| plyr | object | `{}` | [View video player options.](#video-player) |

## Events

You can listen for events using your GLightbox instance (see example under the table). You can use the on() API method or once().

```javascript
const lightbox = GLightbox();
lightbox.on('open', () => {
  // Do something
});

lightbox.once('slide_changed', () => {
  // Do something just one time
});
```

| Event Type          | Description                                                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| open                | Provide a function when the lightbox is opened.                                                                              |
| close               | Provide a function when the lightbox is closed.                                                                              |
| slide_before_change | Trigger a function before the slide is changed.                                                                              |
| slide_changed       | Trigger a function after the slide is changed.                                                                               |
| slide_before_load   | Trigger a function before a slide is loaded for the first time, the function will only be called once                        |
| slide_after_load    | Trigger a function after a slide is loaded and it's content is set for the first time, the function will only be called once |
| slide_inserted      | Trigger a function after a slide is inserted using insertSlide.                                                              |
| slide_removed       | Trigger a function after a slide is removed`                                                                                 |

```javascript
const lightbox = GLightbox();
lightbox.on('slide_before_change', ({ prev, current }) => {
  console.log('Prev slide', prev);
  console.log('Current slide', current);

  // Prev and current are objects that contain the following data
  const { slideIndex, slideNode, slideConfig, player, trigger } = current;

  // slideIndex - the slide index
  // slideNode - the node you can modify
  // slideConfig - will contain the configuration of the slide like title, description, etc.
  // player - the slide player if it exists otherwise will return false
  // trigger - this will contain the element that triggers this slide, this can be a link, a button, etc in your HTML, it can be null if the elements in the gallery were set dinamically
});

lightbox.on('slide_changed', ({ prev, current }) => {
  console.log('Prev slide', prev);
  console.log('Current slide', current);

  // Prev and current are objects that contain the following data
  const { slideIndex, slideNode, slideConfig, player, trigger } = current;

  // slideIndex - the slide index
  // slideNode - the node you can modify
  // slideConfig - will contain the configuration of the slide like title, description, etc.
  // player - the slide player if it exists otherwise will return false
  // trigger - this will contain the element that triggers this slide, this can be a link, a button, etc in your HTML, it can be null if the elements in the gallery were set dinamically

  if (player) {
    if (!player.ready) {
      // If player is not ready
      player.on('ready', (event) => {
        // Do something when video is ready
      });
    }

    player.on('play', (event) => {
      console.log('Started play');
    });

    player.on('volumechange', (event) => {
      console.log('Volume change');
    });

    player.on('ended', (event) => {
      console.log('Video ended');
    });
  }
});

// Useful to modify the slide
// before it's content is added
lightbox.on('slide_before_load', (data) => {
  // data is an object that contain the following
  const { slideIndex, slideNode, slideConfig, player, trigger } = data;

  // slideIndex - the slide index
  // slideNode - the node you can modify
  // slideConfig - will contain the configuration of the slide like title, description, etc.
  // player - the slide player if it exists otherwise will return false
  // trigger - this will contain the element that triggers this slide, this can be a link, a button, etc in your HTML, it can be null if the elements in the gallery were set dinamically
});

// Useful to execute scripts that depends
// on the slide to be ready with all it's content
// and already has a height
// data will contain all the info about the slide
lightbox.on('slide_after_load', (data) => {
  // data is an object that contain the following
  const { slideIndex, slideNode, slideConfig, player, trigger } = data;

  // slideIndex - the slide index
  // slideNode - the node you can modify
  // slideConfig - will contain the configuration of the slide like title, description, etc.
  // player - the slide player if it exists otherwise will return false
  // trigger - this will contain the element that triggers this slide, this can be a link, a button, etc in your HTML, it can be null if the elements in the gallery were set dinamically
});

// Trigger a function when a slide is inserted
lightbox.on('slide_inserted', (data) => {
  // data is an object that contain the following
  const { slideIndex, slideNode, slideConfig, player, trigger } = data;

  // slideIndex - the slide index
  // slideNode - the node you can modify
  // slideConfig - will contain the configuration of the slide like title, description, etc.
  // player - the slide player if it exists otherwise will return false
  // trigger - null
});

// Trigger a function when a slide is removed
lightbox.on('slide_removed', (index) => {
  // index is the position of the element in the gallery
});
```

## Video player

GLightbox includes "[Plyr](https://plyr.io/)" the best player out there, you can pass any Plyr option to the player, view all available options here [Plyr options](https://github.com/sampotts/plyr). GLightbox will only inject the player library if required and only when the lightbox is opened.

**Internet Explorer 11. If you need support for this browser you need to set the js url to use the polyfilled version. This is not the default because IE11 is ancient and we need to let it die.**

### Autoplay for mobile/tablet

Please note, autoplay is blocked in some browsers, there’s nothing we can do to change that unfortunately, the browser will decide if your video can be autoplayed. Please do not post issues about this, instead inform yourself about this topic:

- [https://webkit.org/blog/6784/new-video-policies-for-ios/](https://webkit.org/blog/6784/new-video-policies-for-ios/)
- [https://developers.google.com/web/updates/2017/09/autoplay-policy-changes](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes)
- [https://hacks.mozilla.org/2019/02/firefox-66-to-block-automatically-playing-audible-video-and-audio/](https://hacks.mozilla.org/2019/02/firefox-66-to-block-automatically-playing-audible-video-and-audio/)

they decide if a video can be autoplayed based in a few rules

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
const lightbox = GLightbox({ ...options });
```

## Methods

Example method use:

```javascript
lightbox.nextSlide(); // Go to next slide
lightbox.close(); // Close the lightbox
```

| Option                 | Parameters         | Description                                                                |
| ---------------------- | ------------------ | -------------------------------------------------------------------------- |
| open                   | `node`             | Open the lightbox, you can optionally pass a node.                         |
| openAt                 | `number`           | Open at specific index.                                                    |
| close                  | `-`                | Close the lightbox.                                                        |
| reload                 | `-`                | Reload the lightbox, after inserting content with ajax.                    |
| destroy                | `-`                | Destroy and remove all attached events.                                    |
| prevSlide              | `-`                | Go to the previous slide.                                                  |
| nextSlide              | `-`                | Go to the next slide.                                                      |
| goToSlide              | `number`           | Index of the slide.                                                        |
| insertSlide            | `object, index`    | Insert a slide at the specified index.                                     |
| removeSlide            | `index`            | Remove slide at the specified index.                                       |
| getActiveSlide         | `-`                | Get active slide. It will return the active node.                          |
| getActiveSlideIndex    | `-`                | Get active slide. It will return the active slide index.                   |
| slidePlayerPlay        | `number`           | Play video in the specified slide.                                         |
| slidePlayerPause       | `number`           | Pause video in the specified slide.                                        |
| getSlidePlayerInstance | `node, index`      | Get the player instance of the specified slide.                            |
| getAllPlayers          | `-`                | Get all players instance.                                                  |
| setElements            | `[]`               | Update the lightbox gallery elements.                                      |
| on                     | `string, function` | Set an event listener. See Events section                                  |
| once                   | `string, function` | Set an event listener that will be triggered only once. See Events section |

```javascript
// Example set custom gallery items
// This overwrites all the items in the gallery
lightbox.setElements([
  {
    'href': 'https://picsum.photos/1200/800',
    'type': 'image' // Type is only required if GLightbox fails to know what kind of content should display
  },
  {
    'href': 'https://www.youtube.com/watch?v=Ga6RYejo6Hk',
    'type': 'video', // Type is only required if GLightbox fails to know what kind of content should display
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

## Animations

Animations are created with CSS, each effect has an in and out value and they are used to attach the correct classes to the node.

For example if you are using

```javascript
const glightbox = GLightbox({
  openEffect: 'zoom',
  closeEffect: 'fade',
  cssEfects: {
    // This are some of the animations included, no need to overwrite
    fade: { in: 'fadeIn', out: 'fadeOut' },
    zoom: { in: 'zoomIn', out: 'zoomOut' }
  }
});
```

The open effect will use cssEfects.zoom.in and will add the class gzoomIn, if you take a look at the CSS you'll see:

```javascript
.gzoomIn {
    animation: gzoomIn .5s ease;
}

@keyframes gzoomIn {
    from {
        opacity: 0;
        transform: scale3d(.3, .3, .3);
    }
    to {
        opacity: 1;
    }
}
```

### Adding a custom animation

You can create any animation you want, you can find some inspiration in the Animate.css library, for example you can add the bounce animation like this:

```javascript
const glightbox = GLightbox({
  openEffect: 'bounce', // Define that we want the bounce animation on open
  cssEfects: {
    // register our new animation
    bounce: { in: 'bounceIn', out: 'bounceOut' }
  }
});
```

```css
/*A g will be appended to the animation name so bounceIn will become gbounceIn */
.gbounceIn {
  animation: bounceIn 1.3s ease;
}

@keyframes bounceIn {
  from,
  20%,
  40%,
  60%,
  80%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }

  20% {
    transform: scale3d(1.1, 1.1, 1.1);
  }

  40% {
    transform: scale3d(0.9, 0.9, 0.9);
  }

  60% {
    opacity: 1;
    transform: scale3d(1.03, 1.03, 1.03);
  }

  80% {
    transform: scale3d(0.97, 0.97, 0.97);
  }

  to {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}
```

## Themeable

You can completely customize the structure of GLightbox and use CSS to change any part you want.

```javascript
const customLightboxHTML = `<div id="glightbox-body" class="glightbox-container">
    <div class="gloader visible"></div>
    <div class="goverlay"></div>
    <div class="gcontainer">
    <div id="glightbox-slider" class="gslider"></div>
    <button class="gnext gbtn" tabindex="0" aria-label="Next" data-customattribute="example">{nextSVG}</button>
    <button class="gprev gbtn" tabindex="1" aria-label="Previous">{prevSVG}</button>
    <button class="gclose gbtn" tabindex="2" aria-label="Close">{closeSVG}</button>
</div>
</div>`;

let customSlideHTML = `<div class="gslide">
    <div class="gslide-inner-content">
        <div class="ginner-container">
            <div class="gslide-media">
            </div>
            <div class="gslide-description">
                <div class="gdesc-inner">
                    <h4 class="gslide-title"></h4>
                    <div class="gslide-desc"></div>
                </div>
            </div>
        </div>
    </div>
</div>`;

const glightbox = GLightbox({
  lightboxHTML: customLightboxHTML,
  slideHTML: customSlideHTML,
  skin: 'supercool'
});
```

You can also define a skin name and the lightbox will append the class name "glightbox-supercool" so you can customize it with CSS, this will leave a barebones structure so you can change the buttons appearance, etc.

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

## Support

We only provide support for bugs and feature requests, so please only post issues about this two topics, if you need help implementing GLightbox or you are just starting with HTML/CSS/Javascript please use stackoverlow, you'll be able to find more help there. This will help us to keep the issues related to the library and solve issues faster.

## Changelog

#### Latest version vundefined

See the [CHANGELOG.md](CHANGELOG.md) file for details

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
