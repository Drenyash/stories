/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/the-new-css-reset/css/reset.css":
/*!******************************************************!*\
  !*** ./node_modules/the-new-css-reset/css/reset.css ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/css/main.scss":
/*!***************************!*\
  !*** ./src/css/main.scss ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/assets/sprite/icon-arrow.svg":
/*!******************************************!*\
  !*** ./src/assets/sprite/icon-arrow.svg ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
      id: "icon-arrow-usage",
      viewBox: "0 0 24 24",
      url: "/assets/sprite/" + "sprite.svg#icon-arrow-usage",
      toString: function () {
        return this.url;
      }
    });

/***/ }),

/***/ "./src/assets/sprite/icon-close.svg":
/*!******************************************!*\
  !*** ./src/assets/sprite/icon-close.svg ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
      id: "icon-close-usage",
      viewBox: "0 0 27 27",
      url: "/assets/sprite/" + "sprite.svg#icon-close-usage",
      toString: function () {
        return this.url;
      }
    });

/***/ }),

/***/ "./src/js/Stories.js":
/*!***************************!*\
  !*** ./src/js/Stories.js ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _templates__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./templates */ "./src/js/templates.js");


class Stories {
    constructor(container, url) {
        this.component = document.querySelector(container);
        this.url = url;
        this.currentStory = 0;
        this.currentFrame = 0;
        this.totalData = null;

        this.container = null;
        this.stories = null;
        this.wrapper = null;
        this.frames = null;
        this.dataFrames = null;
        this.videos = null;
        this.toolboxItems = null;
        this.close = null;
        this.duration = null;
        this.played = false;
        this.timeout = null;
        this.toolboxItemsEl = null;
        this.videoFrame = null;
        this.controls = null;

        this.#getData()
    }

    #getData() {
        fetch(this.url, {method: 'GET'})
            .then(response => response.json())
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    this.component.insertAdjacentHTML('beforeend', (0,_templates__WEBPACK_IMPORTED_MODULE_0__.storyButtonTemplate)(data[i].id, data[i].url, data[i].name))
                }
                this.totalData = data;
                this.#showStory(data);
            })
    }

    #renderToolbox({count, name, url}) {
        this.container.insertAdjacentHTML('beforeend', (0,_templates__WEBPACK_IMPORTED_MODULE_0__.controlsTemplate)({count, name, url}))
        this.close = this.stories.querySelector('.stories__close')
        this.toolboxItems = this.stories.querySelectorAll('.stories__item')
        this.toolboxItemsEl = this.toolboxItems[this.currentFrame].querySelector('span');

        this.#updateStories()
    }

    #renderStories() {
        this.component.insertAdjacentHTML('beforeend', (0,_templates__WEBPACK_IMPORTED_MODULE_0__.mainTemplate)())
        this.stories = this.component.querySelector('.stories');
        this.container = this.stories.querySelector('.stories__container')
        this.wrapper = this.stories.querySelector('.stories__wrapper')
        this.controls = this.stories.querySelectorAll('.stories__button')
        this.#changeFrame();
    }

    #renderFrames(data) {
        for (let i = 0; i < data[this.currentStory].stories.length; i++) {
            this.wrapper.insertAdjacentHTML('beforeend', (0,_templates__WEBPACK_IMPORTED_MODULE_0__.frameTemplate)(data[this.currentStory].stories[i].url, data[this.currentStory].stories[i].type))
        }
        this.frames = this.wrapper.querySelectorAll('.stories__frame')
        this.frames[this.currentFrame].classList.add('stories__frame--active')
        this.videoFrame = this.frames[this.currentFrame].children[0]
        this.videos = this.frames[this.currentFrame].querySelectorAll('video')
        if (data[this.currentStory].stories[this.currentFrame].duration) {
            this.duration = data[this.currentStory].stories[this.currentFrame].duration
        }
        this.dataFrames = data[this.currentStory]
    }

    #showStory(data) {
        const openStory = document.querySelectorAll('[data-open-story]')
        openStory.forEach((el, idx) => {
            el.addEventListener('click', () => {
                this.currentStory = parseInt(el.dataset.openStory)
                this.#renderStories()
                this.#renderFrames(data)
                this.#renderToolbox({count: data[idx].stories.length, name: data[idx].name, url: data[idx].url})
            })
        })
    }

    #closeStories() {
        if (!this.close) return;
        this.close.addEventListener('click', () => {
            this.#removeStories()
        })
    }

    #removeStories() {
        this.currentFrame = 0
        this.currentStory = 0
        this.stories.remove()
    }

    #changeFrame() {
        this.controls.forEach(button => {
            button.addEventListener('click', () => {
                if (button.classList.contains('stories__button--next')) {
                    this.currentFrame += 1
                    if (this.currentFrame === this.frames.length && this.currentStory === this.totalData.length - 1) {
                        this.#removeStories()
                        return
                    }
                    if (this.currentFrame === this.frames.length) {
                        this.#changeStories('forward')
                        this.currentFrame = 0
                    }
                    this.#updateStories()

                } else if (button.classList.contains('stories__button--prev')) {
                    this.currentFrame -= 1
                    if (this.currentFrame < 0 && this.currentStory === 0) {
                        this.#removeStories()
                        return
                    } else if (this.currentFrame < 0) {
                        this.currentFrame = 0
                        this.#changeStories('backward')
                    }
                    this.#updateStories()

                }
            })
        })
    }

    #pauseFrame() {
        this.videos.forEach(el => {
            el.addEventListener('click', () => {
                this.played = !this.played
                if (this.played) {
                    el.pause()
                    this.toolboxItemsEl.style.animationPlayState = 'paused'
                } else {
                    el.play()
                    this.toolboxItemsEl.style.animationPlayState = 'running'
                }
            })
        })
        this.frames.forEach(el => {
            if (el.getAttribute('style')) {
                el.addEventListener('click', () => {
                    this.played = !this.played
                    if (this.played) {
                        this.toolboxItemsEl.style.animationPlayState = 'paused'
                    } else {
                        this.toolboxItemsEl.style.animationPlayState = 'running'
                    }
                })
            }
        })
    }

    #changeStories(direction) {
        if (this.currentStory < this.totalData.length) {
            if (direction === 'forward') this.currentStory += 1
            else if (direction === 'backward') this.currentStory -= 1
            this.currentFrame = 0
            this.stories.remove()
            this.#renderStories()
            this.#renderFrames(this.totalData)
            this.#renderToolbox({
                count: this.totalData[this.currentStory].stories.length,
                name: this.totalData[this.currentStory].name,
                url: this.totalData[this.currentStory].url
            })
        }
    }

    #updateDuration() {
        if (this.dataFrames.stories[this.currentFrame].duration) {
            this.duration = this.dataFrames.stories[this.currentFrame].duration
        } else if (this.videoFrame) {
            this.duration = this.videoFrame.duration
        } else {
            this.duration = 5
        }
    }

    #updateStories() {
        this.videoFrame = this.frames[this.currentFrame].children[0]
        this.toolboxItemsEl = this.toolboxItems[this.currentFrame].querySelector('span');
        this.#pauseFrame()
        this.#closeStories()
        const updateToolboxAnimation = () => {
            this.toolboxItems[this.currentFrame].classList.add('animate')
            this.toolboxItemsEl.style.animationDuration = this.duration + 's';
            this.toolboxItemsEl.style.animationPlayState = 'running'
        }

        const runVideo = () => {
            this.videoFrame.currentTime = 0;
            this.videoFrame.play()
            this.duration = this.videoFrame.duration
        }

        this.#updateDuration()

        this.frames.forEach(el => el.classList.remove('stories__frame--active'))
        this.toolboxItems.forEach((el, idx) => {
            if (idx < this.currentFrame) {
                el.classList.add('stories__item--prev')
            } else {
                el.classList.remove('stories__item--prev')
            }
            el.classList.remove('animate')
        })
        this.played = false;
        this.frames[this.currentFrame].classList.add('stories__frame--active')
        clearTimeout(this.timeout)
        if (this.videoFrame) {
            runVideo()
            this.videoFrame.addEventListener('loadedmetadata', () => {
                runVideo()
                updateToolboxAnimation()
            })
            this.videoFrame.addEventListener('ended', () => {
                if (this.currentFrame < this.frames.length - 1) {
                    this.currentFrame++;
                    this.#updateStories()
                }
            })
        } else if (this.currentFrame < this.frames.length - 1) {
            this.timeout = setTimeout(() => {
                this.currentFrame++;
                this.#updateStories()
            }, this.duration * 1000)
        }

        updateToolboxAnimation()

        if (this.currentFrame === this.frames.length - 1 && this.currentStory < this.totalData.length - 1) {
            this.timeout = setTimeout(() => {
                this.#changeStories('forward')
            }, this.duration * 1000)
        } else if (this.currentFrame === this.frames.length - 1) {
            this.timeout = setTimeout(() => {
                this.#removeStories()
            }, this.duration * 1000)
        }
    }
}

/* harmony default export */ __webpack_exports__["default"] = (Stories);


/***/ }),

/***/ "./src/js/main-stories.js":
/*!********************************!*\
  !*** ./src/js/main-stories.js ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Stories__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Stories */ "./src/js/Stories.js");

const stories = new _Stories__WEBPACK_IMPORTED_MODULE_0__["default"]('.main-stories', 'http://localhost:3001/stories');


/***/ }),

/***/ "./src/js/sprite.js":
/*!**************************!*\
  !*** ./src/js/sprite.js ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assets_sprite_icon_arrow_svg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../assets/sprite/icon-arrow.svg */ "./src/assets/sprite/icon-arrow.svg");
/* harmony import */ var _assets_sprite_icon_close_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../assets/sprite/icon-close.svg */ "./src/assets/sprite/icon-close.svg");


/* harmony default export */ __webpack_exports__["default"] = ({
    arrow: _assets_sprite_icon_arrow_svg__WEBPACK_IMPORTED_MODULE_0__["default"],
    close: _assets_sprite_icon_close_svg__WEBPACK_IMPORTED_MODULE_1__["default"],
});


/***/ }),

/***/ "./src/js/templates.js":
/*!*****************************!*\
  !*** ./src/js/templates.js ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "controlsTemplate": function() { return /* binding */ controlsTemplate; },
/* harmony export */   "frameTemplate": function() { return /* binding */ frameTemplate; },
/* harmony export */   "mainTemplate": function() { return /* binding */ mainTemplate; },
/* harmony export */   "storyButtonTemplate": function() { return /* binding */ storyButtonTemplate; }
/* harmony export */ });
const mainTemplate = () => {
    return `
            <div class="stories">
                <div class="stories__container">
                    <div class="stories__wrapper"></div>
                    <div class="stories__toolbox">
                        <button class="stories__button stories__button--prev">
                            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                      d="M15.7071 18.7071C15.3166 19.0976 14.6834 19.0976 14.2929 18.7071L8.29289 12.7071C7.90237 12.3166 7.90237 11.6834 8.29289 11.2929L14.2929 5.29289C14.6834 4.90237 15.3166 4.90237 15.7071 5.29289C16.0976 5.68342 16.0976 6.31658 15.7071 6.70711L10.4142 12L15.7071 17.2929C16.0976 17.6834 16.0976 18.3166 15.7071 18.7071Z"
                                      fill="#FFFFFF"/>
                            </svg>
                        </button>
                        <button class="stories__button stories__button--next">
                            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                      d="M8.29289 5.29289C8.68342 4.90237 9.31658 4.90237 9.70711 5.29289L15.7071 11.2929C16.0976 11.6834 16.0976 12.3166 15.7071 12.7071L9.70711 18.7071C9.31658 19.0976 8.68342 19.0976 8.29289 18.7071C7.90237 18.3166 7.90237 17.6834 8.29289 17.2929L13.5858 12L8.29289 6.70711C7.90237 6.31658 7.90237 5.68342 8.29289 5.29289Z"
                                      fill="#FFFFFF"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `
}

const controlsTemplate = ({count, name, url}) => {
    const renderToolboxItems = (count) => {
        const itemsArray = []
        for (let i = 0; i < count; i++) {
            itemsArray.push(`<div class="stories__item"><span></span></div>`)
        }
        return itemsArray.join('')
    }
    return `
            <div class="stories__top">
                <div class="stories__count">
                    ${renderToolboxItems(count)}
                </div>
                <div class="stories__control">
                    <div class="stories__author">
                        <picture class="stories__picture">
                            <img src="${url}" alt="">
                        </picture>
                        <p class="stories__text">${name}</p>
                    </div>
                    <div class="stories__close"></div>
                </div>
            </div>
        `
}

const frameTemplate = (url, type) => {
    if (type === 'picture') {
        return `
                <div class="stories__frame" style="background-image: url('${url}')"></div>
            `
    } else if (type === 'video') {
        return `
                <div class="stories__frame">
                    <video src="${url}"></video>
                </div>
            `
    }
}

const storyButtonTemplate = (id, url, name) => {
    return `
        <button class="button" data-open-story="${id}">
            <picture>
                <img src="${url}" alt="${name}">
            </picture>
            <span>${name}</span>
        </button>
    `
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var the_new_css_reset_css_reset_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! the-new-css-reset/css/reset.css */ "./node_modules/the-new-css-reset/css/reset.css");
/* harmony import */ var _css_main_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css/main.scss */ "./src/css/main.scss");
/* harmony import */ var _sprite__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sprite */ "./src/js/sprite.js");
/* harmony import */ var _Stories__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Stories */ "./src/js/Stories.js");
/* harmony import */ var _main_stories__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./main-stories */ "./src/js/main-stories.js");






}();
/******/ })()
;