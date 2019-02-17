## GLightbox

Glightbox is a pure javascript lightbox. It can display images, iframes, inline content and videos with optional autoplay for youtube, vimeo and even self hosted videos with JWPlayer support

## Demo
You can check the live demo [right here](https://mcstudios.github.io/glightbox/)

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

```
<link rel="stylesheet" href="dist/css/glightbox.css">
<script src="dist/js/glightbox.min.js"></script>
```

For more information please check the demo site.

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
### 2.0.0
- Fixed youtube, vimeo autoplay when changing slides
- Fixed lightbox won't fit screen with description
- Fixed Removed global body variable that was causing some problems
- New: Delegated permissions to cross-origin iframes (for the new browsers autoplay restrictions)

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

## Todo
- [ ] Improve github description with more documentation and examples

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details