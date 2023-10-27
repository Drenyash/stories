<h1 align="center" style="text-transform: uppercase; font-size: 48px; font-weight: 700">CUSTOMSTORIES</h1>
<p  align="center">Версии сайта: <b>1920px, 375px</b></p>
<p align="center">Кастомный модуль с Историями на сайт</p>
<p  align="center">Используемая версия NodeJS: <b>20.2.0</b></p>
<p align="center"><a href="https://drenyash.github.io/freshdress/dist/" target="_blank"><b>Вёрстка проекта</b></a></p>
<hr>
<h3>Структура проекта</h3>

```
└── src
    ├── assets
    |   ├── fonts
    |   ├── images
    |   └── sprite
    ├── components
    |   ├── _components.scss
    |   └── UI
    |       └── _ui.scss
    ├── css
    |   ├── base
    |   ├── helpers
    |   └── main.scss
    ├── includes
    ├── js
    |   ├── index.js
    |   └── sprite.js
    ├── pages
    └── index.html
├── .eslintrc.json
├── .gitignore
├── .stylelintrc.json
├── data.json
├── package.json
├── package-lock.json
├── README.md
└── webpack.config.js
```
<hr>
<h3>Методология</h3>
<p>БЭМ</p>

> Придерживаемся базовых принципов БЭМ.<br>
> Классы именуются: **block**, **block__element**, **block__element--modifier**<br>
> Указание модификатора без блока или элемента - **ЗАПРЕЩЕНО!**

<hr>
<h3>Спрайты</h3>
<p>Спрайты подключаются в файле <code>sprite.js</code> по структуре:</p>

```javascript
import arrow from "../assets/sprite/icon-arrow.svg"
import badge from "../assets/sprite/icon-badge.svg"
import button from "../assets/sprite/icon-button.svg"

export default {
    arrow,
    badge,
    button,
}
```

<p>Для использования спрайта на странице используем:</p>

```html
<svg>
    <use xlink:href="./assets/sprite/sprite.svg#icon-arrow"></use>
</svg>
```
<hr>
<h3>Подключение стилей и скриптов</h3>
<p>Все стили и скрипты импортируются в <code>./js/index.js</code> файле.</p>

```javascript
import "the-new-css-reset/css/reset.css";
import "../css/main.scss";

import "./sprite";
import "./slider";
import "./dropdown";
import "./form";
import "./phoneMask";
```
<p>Стили импортируются в <code>./css/main.scss</code></p>

```scss
// Helpers
@import "helpers/variables";
@import "helpers/mixins";
@import "helpers/functions";

// Base
@import "base/fonts";
@import "base/general";
@import "base/margins";
@import "base/paddings";
@import "base/temp";

// Components
@import "../components/components";
@import "base/helpers";
```
