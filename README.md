# butane-show-hide

> An accessibile show/hide JS library

## Features

✔︎ Traps focus via the inert attribute
✔︎ Hide via the <kbd>ESC</kbd> key or an optional overlay
✔︎ Assumes no styling layer

## Install

```bash
$ npm install butane-show-hide --save-dev
```

## Usage

```js
import ButaneShowHide from 'butane-show-hide'

ButaneShowHide.init()
```

## Options

```js
ButaneShowHide.init({
  showTrigger: 'data-custom-show',
  hideTrigger: 'data-custom-hide',
  onShow: (trigger, target) => console.log('Show ' + target.getAttribute('id')),
  onHide: (trigger, target) => console.log('Hide ' + target.getAttribute('id'))
})
```

## License

[MIT](https://opensource.org/licenses/MIT). © 2018 Alex Carpenter
