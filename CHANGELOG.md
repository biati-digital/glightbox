# Change Log

All notable changes to this project will be documented in this file.

## 3.2.0

- New: Support for videos without extension
- Updated: Plyr to 3.6.12
- Fixed: Inline content not centered on tablets #295
- Fixed: Duplicated CSS properties #293
- Fixed: YouTube video button not clickable on iOS #298

## 3.1.0

- New: Added Avif image support [@dramspro](https://github.com/biati-digital/glightbox/pull/266)
- New: Add support for responsive images [@gaborbsd](https://github.com/biati-digital/glightbox/pull/264)
- Updated: playsinline video attribute
- Updated: url check to allow query parameters in video and images
- Fixed: Image description/shadow off on mobile device #268
- Fixed: You can zoom next slide image if current slide is not full height #261
- Fixed: Draggable option not working with "setElements" #257


## 3.0.9

- Updated: Plyr to 3.6.8
- Improved: JS error when the description attribute is an invalid selector
- Fixed: Media Buttons Not responding on Android #233
- Fixed: When touch is activated images swipe independently of their descriptions #238
- Fixed: Width / Height data attributes do not work for image types #234
- Fixed: Adds missing size unit of video description on resize #229

## 3.0.8

- New: Added Aria-hidden on all root elements except the glightbox-container
- Fixed: Video in portrait mode is cropped
- Fixed: Video always has maxWidth 900px because of hardcoded setting
- Fixed: Removed explicit tabindex from navigation buttons

## 3.0.7

- Fixed: Lightbox playing incorrect video with multiple videos in gallery #187
- Fixed: Draggable: false option not working #192
- Fixed: Links not working inside inline content in mobile devices
- Fixed: moreLength not working correctly on mobile if description has HTML
- Added: Added plugins option for a future release that will allow extending GLightbox with plugins
- Changed: Plyr fullscreen set to iosNative
- Changed: Renamed skin option to theme for a future release that will allow creating themes like plugins, skin still works but will be replaced in a future relase

## 3.0.6

- Fixed: Events cleanup on `destroy()` method causes exception #175
- Fixed: "data-title" Getting Overwritten when "title" is present #178
- Fixed: IE 11 "Multiple definitions of a property not allowed in strict mode when bundling and minifying glightbox #155
- Fixed: Cannot add new slides #166
- Fixed: Video not playing on mobile #160
- Improved: Plyr will only be loaded if it's already used in the site
- New: Updated PLYR version to 3.6.3
- New: Added new option "autofocusVideos" to enable all Plyr shortcuts for the video player
- New: Improved events to use a generic way to access data
- New: Improved code

## 3.0.5

- Fixed: IE11 does not support ".includes()"
- Fixed: Clicking outside the content to close only works in specific areas
- Fixed: openEffect / closeEffect no longer accepting "none"

## 3.0.4

- New: New way to listen for events, the old events will still work but will be removed in a future update. See the Events section in the README
- New: Added new methods "slidePlayerPause" and "slidePlayerPlay" so in the future they will replace "playSlideVideo" and "stopSlideVideo" to provide support for audio slides in a future update
- New: Add preventDefault via touchstart on lightbox to prevent navigation swipe
- Fixed: e.getAttribute is not a function when there are no nodes in the gallery

## 3.0.3

- New: Option "dragAutoSnap" to control the mouse drag auto close or change slide
- Fixed: Multiple galleries not working
- Fixed: Setting the elements directly using an object triggered error

## 3.0.2

- New: Option "zoomable" to enable or disable zoomable images
- New: Option "preload" to enable or disable preloading
- New: Option "draggable" to go to prev/next slide by mouse dragging. Thanks to @Hirbod for the donation to make this happen
- New: Option "dragToleranceX" Used with draggable. Number of pixels the user has to drag to go to prev or next slide
- New: Option "dragToleranceY" Used with draggable. Number of pixels the user has to drag up or down to close the lightbox (Set 0 to disable vertical drag)
- New: The code was refactored to make it easier to maintain
- Fixed: data gallery stopped working
- Fixed: iOS bug with Vimeo iframe when fullscreen button pressed
- Fixed: "See more" link in the description throws an JS error when clicked
- Fixed: Videos not resized vertically when window height was smaller than the window width

## 3.0.1

- Fixed: vertical scrolling of descriptions [@zothynine](https://github.com/biati-digital/glightbox/pull/134)
- Fixed: CSS properties bug
- Fixed: Passing null as selector throws an exception

## 3.0.0

- New: New methods to access player instances "getSlidePlayerInstance(index or node) and getAllPlayers"
- New: Access player instance from afterSlideChange and beforeSlideChange"
- New: New Method removeSlide(1) remove slide at the specified index, it works even when the lightbox is open
- New: insertSlide now works even when the lightbox is open
- New: Added Accesibility features to slides
- New: Enabled touchNavigation for all devices that support touch events and not only mobile devices
- Changed: afterSlideLoad and beforeSlideLoad methods to follow the same variables as afterSlideChange, beforeSlideChange
- Fixed: Calling `destroy()` throws an error when modal is not open
- Fixed: Navigation not disabled correctly when only one slide

## 2.0.6

- New: Now you can define width and height as 900px, 95%, 100vw, 100vh so you can have full screen content
- New: Now you can define custom html or a node in the slide data to append it to the slide (view the API section)
- New: Now you can use any attribute as selector for example '.glightbox' or 'data-glightbox' or '\*[data-glightbox]'
- New: Method "openAt" you can open the lightbox at specific index eg: lightbox.openAt(2);
- New: Method "insertSlide" that allows you to append a slide at specified index
- Fixed Tab Key Doesn't Work on Form Within GLightbox Inline Content
- Fixed Scrolling Description triggers closing the lightbox on touch devices
- Fixed Page jumps depending on page scrollbar
- Fixed Overriding default plyr settings does not merge correctly
- Fixed fullscreen video button on ios
- Moved plyr.ratio to plyr.config.ratio

## 2.0.5

- New: Loop, renamed loopAtEnd to loop and now works in both directions
- New: added touchFollowAxis, for mobile when dragging the media will follow the same axis, set to false to move media as you wish
- New: added jpe format
- Fixed .mov videos not recognized as videos

## 2.0.4

- Fixed some errors when zooming and dragging images
- Fixed description position not respected when configured globally
- Fixed local videos not resized correctly when entered fullscreen

## 2.0.3

- New: Zooming images. Now you can zoom images on desktop if image is too large
- New: Now you can also define the slide description using the content of any div you want.
- New: Replaced png icons with svg and added options to customize them.
- Fixed responsive videos not resizing correctly when resizing the window vertically
- Fixed responsive images not resizing correctly if they have description and the window height is lower that the slide height
- Fixed youtube video not detected correctly for urls like youtube(-nocookie).com/embed/...

## 2.0.2

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

## 2.0.1

- Fixed Mobile navigation
- Fixed slide width for external sources

## 2.0.0

- New: Delegated permissions to cross-origin iframes (for the new browsers autoplay restrictions)
- Fixed youtube, vimeo autoplay when changing slides
- Fixed lightbox won't fit screen with description
- Fixed Removed global body variable that was causing some problems

## 1.0.9

- Added svg to source types so it can be displayed as an image [@tuomassalo](https://github.com/mcstudios/glightbox/pull/40)
- Added contributing file
- Updated dependencies [@tuomassalo](https://github.com/mcstudios/glightbox/pull/40).
- Removed demo folder from npm

## 1.0.8

- New: You can define each slide option in a different data attribute (data-title="example" data-description="...")
- Fixed youtube and vimeo autoplay when opened for the first time
- Fixed global slide params not working
- Fixed some issues on IE11
- Fixed using characters : or ; in slide description

## 1.0.7

- New: Added reload method, useful when injecting content with ajax, cloning nodes, etc.
- Fixed closeButton setting not removing the element
- Fixed video not displayed on mobile devices

## 1.0.6

- New: Now you can set individual width and height for each slide with inlines or iframes.
- New: Now you can set individual source types for each slide ('type': 'image' | 'iframe' | 'video' | 'inline' | 'external).
- New: Published on npm
- New: Published on bower
- Fixed afterSlideLoad only triggered one time for all the slides
- Fixed a small space between the image and description when is set to top or bottom

## 1.0.5

- New: Added none as a new option to disable open, close and slide animations
- New: Added new options (touchNavigation, keyboardNavigation, closeOnOutsideClick) to enable or disable user interaction
- Fixed open and close effect not taking a custom animation
- Fixed an error when calling the destroy method and no videos were present in the slider

## 1.0.4

- Improved the open method so it can be called without duplicating the structure and events
- New: The original node is passed to events like beforeSlideChange, afterSlideChange, etc.

## 1.0.3

- New: Added option moreLength to control the number of characters in the description for mobile devices

## 1.0.2

- Fixed instance not returned and unable to call public methods

## 1.0.1

- Fixed large images not displayed correctly

## 1.0.0

- Initial release
