class Stories {
    constructor(container, url) {
        this.component = document.querySelector(container);
        this.url = url;
        this.currentStory = 0;
        this.stories = null;
        this.container = null;
        this.wrapper = null;
        this.close = null;
        this.currentFrame = 0;
        this.videos = null;
        this.frames = null;
        this.duration = null;
        this.toolboxItems = null;
        this.played = false;
        this.totalDataLength = null;
        this.timeout = null;
        this.dataFrames = null;

        this.controls = null;
        this.#setListeners()
    }

    #setListeners() {
        this.#renderButtons();
    }

    #mainTemplate() {
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

    #controlsTemplate({count, name, url}) {
        return `
            <div class="stories__top">
                <div class="stories__count">
                    ${this.#renderToolboxItems(count)}
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

    #frameTemplate(url, type) {
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

    async #getData() {
        const response = await fetch(this.url, {
            method: 'GET'
        });
        return response.json();
    }

    #renderToolbox({count, name, url}) {
        this.container.insertAdjacentHTML('beforeend', this.#controlsTemplate({
            count,
            name,
            url
        }))
        this.close = this.stories.querySelector('.stories__close')
        this.#closeStories()
        this.#firstLoad();
    }

    #renderToolboxItems(count) {
        const itemsArray = []
        for (let i = 0; i < count; i++) {
            itemsArray.push(`<div class="stories__item"><span></span></div>`)
        }
        return itemsArray.join('')
    }

    #renderStories() {
        this.component.insertAdjacentHTML('beforeend', this.#mainTemplate())
        this.stories = this.component.querySelector('.stories');
        this.container = this.stories.querySelector('.stories__container')
        this.wrapper = this.stories.querySelector('.stories__wrapper')
        this.controls = this.stories.querySelectorAll('.stories__button')
        this.#changeFrame();
    }

    #renderFrames(data) {
        for (let i = 0; i < data[this.currentStory].stories.length; i++) {
            this.wrapper.insertAdjacentHTML('beforeend', this.#frameTemplate(data[this.currentStory].stories[i].url, data[this.currentStory].stories[i].type))
        }
        this.frames = this.wrapper.querySelectorAll('.stories__frame')
        this.frames[this.currentFrame].classList.add('stories__frame--active')
        if (data[this.currentStory].stories[this.currentFrame].duration) {
            this.duration = data[this.currentStory].stories[this.currentFrame].duration
        }
        this.dataFrames = data[this.currentStory]
    }

    #renderButtons() {
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

        this.#getData().then(data => {
            for (let i = 0; i < data.length; i++) {
                this.component.insertAdjacentHTML('beforeend', storyButtonTemplate(data[i].id, data[i].url, data[i].name))
            }
            this.totalDataLength = data.length;
            this.#showStory(data);
        })
    }

    #showStory(data) {
        const openStory = document.querySelectorAll('[data-open-story]')
        openStory.forEach((el, idx) => {
            el.addEventListener('click', () => {
                this.currentStory = parseInt(el.dataset.openStory);
                this.#renderStories()
                this.#renderFrames(data)
                this.#renderToolbox({count: data[idx].stories.length, name: data[idx].name, url: data[idx].url})
            })
        })
    }

    #closeStories() {
        if (!this.close) return;
        this.close.addEventListener('click', () => {
            this.stories.remove()
            this.currentFrame = 0;
        })
    }

    #firstLoad() {
        this.toolboxItems = this.stories.querySelectorAll('.stories__item')
        this.videos = this.stories.querySelectorAll('.stories__frame video')
        this.#pauseVideo()
        this.#updateStories()
    }

    #changeFrame() {
        this.controls.forEach(button => {
            button.addEventListener('click', () => {
                if (button.classList.contains('stories__button--next')) {
                    this.currentFrame += 1;
                    if (this.currentFrame === this.frames.length && this.currentStory === this.totalDataLength - 1) {
                        this.stories.remove()
                        this.currentFrame = 0;
                        this.currentStory = 0;
                    }
                    if (this.currentFrame === this.frames.length) {
                        this.#changeStories('forward')
                        this.currentFrame = 0;
                    }
                } else if (button.classList.contains('stories__button--prev')) {
                    this.currentFrame -= 1;
                    if (this.currentFrame < 0 && this.currentStory === 0) {
                        this.stories.remove()
                        this.currentFrame = 0;
                        this.currentStory = 0;
                    } else if (this.currentFrame < 0) {
                        this.currentFrame = 0;
                        this.#changeStories('backward')
                    }
                }
                this.#updateStories()
            })
        })
    }

    #pauseVideo() {
        this.videos.forEach(el => {
            el.addEventListener('click', () => {
                this.played = !this.played
                if (this.played) {
                    el.pause()
                    this.toolboxItems[this.currentFrame].querySelector('span').style.animationPlayState = 'paused'
                } else {
                    el.play()
                    this.toolboxItems[this.currentFrame].querySelector('span').style.animationPlayState = 'running'
                }
            })
        })
    }

    // Изменение истории при достижении последнего фрейма в текущей истории
    #changeStories(direction) {
        this.#getData()
            .then(data => {
                if (this.currentStory < data.length) {
                    if (direction === 'forward') this.currentStory += 1;
                    else this.currentStory -= 1;
                    this.currentFrame = 0;
                    this.stories.remove()
                    this.#renderStories()
                    this.#renderFrames(data)
                    this.#renderToolbox({
                        count: data[this.currentStory].stories.length,
                        name: data[this.currentStory].name,
                        url: data[this.currentStory].url
                    })
                }
            })
    }

    #updateStories() {
        if (this.dataFrames.stories[this.currentFrame].duration) {
            this.duration = this.dataFrames.stories[this.currentFrame].duration
        } else if (this.frames[this.currentFrame].children[0]) {
            this.duration = this.frames[this.currentFrame].children[0].duration
        } else {
            this.duration = 5
        }
        this.videos.forEach(el => el.pause())
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
        if (this.frames[this.currentFrame].children[0]) {
            this.frames[this.currentFrame].children[0].currentTime = 0;
            this.frames[this.currentFrame].children[0].play()
            this.frames[this.currentFrame].children[0].addEventListener('loadeddata', () => {
                this.frames[this.currentFrame].children[0].currentTime = 0;
                this.frames[this.currentFrame].children[0].play()
                this.duration = this.frames[this.currentFrame].children[0].duration
                this.toolboxItems[this.currentFrame].classList.add('animate')
                this.toolboxItems[this.currentFrame].querySelector('span').style.animationDuration = this.duration + 's';
                this.toolboxItems[this.currentFrame].querySelector('span').style.animationPlayState = 'running'
            })
            this.frames[this.currentFrame].children[0].addEventListener('ended', () => {
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
        console.log(this.currentFrame, this.currentStory)
        this.toolboxItems[this.currentFrame].classList.add('animate')
        this.toolboxItems[this.currentFrame].querySelector('span').style.animationDuration = this.duration + 's';
        this.toolboxItems[this.currentFrame].querySelector('span').style.animationPlayState = 'running';

        if (this.currentFrame === this.frames.length - 1 && this.currentStory < this.totalDataLength - 1) {
            this.timeout = setTimeout(() => {
                this.#changeStories('forward')
            }, this.duration * 1000)
        }
        if (this.currentStory === this.totalDataLength - 1 && this.currentFrame === this.frames.length - 1) {
            this.timeout = setTimeout(() => {
                this.stories.remove()
                this.currentFrame = 0;
                this.currentStory = 0;
            }, this.duration * 1000)
        }
    }
}

export default Stories;
