import {controlsTemplate, frameTemplate, mainTemplate, storyButtonTemplate} from "./templates";

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
                    this.component.insertAdjacentHTML('beforeend', storyButtonTemplate(data[i].id, data[i].url, data[i].name))
                }
                this.totalData = data;
                this.#showStory(data);
            })
    }

    #renderToolbox({count, name, url}) {
        this.container.insertAdjacentHTML('beforeend', controlsTemplate({count, name, url}))
        this.close = this.stories.querySelector('.stories__close')
        this.toolboxItems = this.stories.querySelectorAll('.stories__item')
        this.toolboxItemsEl = this.toolboxItems[this.currentFrame].querySelector('span');

        this.#updateStories()
    }

    #renderStories() {
        this.component.insertAdjacentHTML('beforeend', mainTemplate())
        this.stories = this.component.querySelector('.stories');
        this.container = this.stories.querySelector('.stories__container')
        this.wrapper = this.stories.querySelector('.stories__wrapper')
        this.controls = this.stories.querySelectorAll('.stories__button')
        this.#changeFrame();
    }

    #renderFrames(data) {
        for (let i = 0; i < data[this.currentStory].stories.length; i++) {
            this.wrapper.insertAdjacentHTML('beforeend', frameTemplate(data[this.currentStory].stories[i].url, data[this.currentStory].stories[i].type))
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

export default Stories;
