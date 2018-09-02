## GLightbox

Glightbox is a pure javascript lightbox. It can display images, iframes, inline content and videos with optional autoplay for youtube, vimeo and even self hosted videos with JWPlayer support

## Demo
You can check the live demo [clicking here](https://glightbox.mcstudios.com.mx/)

## Usage

```bash
$ npm install glightbox
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

## Changelog
### 1.0.7
- Fixed closeButton setting not removing the element
- Fixed video not displayed on mobile devices
- New: Added reload method, useful when injecting content with ajax, cloning nodes, etc.
### 1.0.6
- Fixed afterSlideLoad only triggered one time for all the slides
- Fixed a small space between the image and description when is set to top or bottom
- New: Now you can set individual width and height for each slide with inlines or iframes.
- New: Now you can set individual source types for each slide ('type': 'image' | 'iframe' | 'video' | 'inline' | 'external).
- New: Published on npm
- New: Published on bower
### 1.0.5
- Fixed open and close effect not taking a custom animation
- New: Added none as a new option to disable open, close and slide animations
- New: Added new options (touchNavigation, keyboardNavigation, closeOnOutsideClick) to enable or disable user interaction
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