import 'wicg-inert'

const ButaneShowHide = (() => {
  const FOCUSABLE_ELEMENTS = [
    'a[href]',
    'area[href]',
    'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
    'select:not([disabled]):not([aria-hidden])',
    'textarea:not([disabled]):not([aria-hidden])',
    'button:not([disabled]):not([aria-hidden])',
    'iframe',
    'object',
    'embed',
    '[contenteditable]',
    '[tabindex]:not([tabindex^="-"])'
  ]

  class ShowHide {
    constructor({
      containerEl,
      trigger,
      target,
      showTrigger,
      hideTrigger = 'data-butane-hide',
      activeClass = 'is-active',
      onShow = () => {},
      onHide = () => {},
      debugMode = false
    }) {
      this.containerEl = containerEl
      this.trigger = trigger
      this.target = target
      this.config = {
        debugMode,
        showTrigger,
        hideTrigger,
        activeClass,
        onShow,
        onHide
      }

      this.target.inert = true
      this.trigger.addEventListener('click', () => this.show())

      this.onClick = this.onClick.bind(this)
      this.onKeydown = this.onKeydown.bind(this)
    }

    addEventListeners() {
      document.addEventListener('click', this.onClick)
      document.addEventListener('keydown', this.onKeydown)
    }

    removeEventListeners() {
      document.removeEventListener('click', this.onClick)
      document.removeEventListener('keydown', this.onKeydown)
    }

    show() {
      this.activeElement = document.activeElement
      this.containerEl.inert = true
      this.target.inert = false
      this.target.classList.add(this.config.activeClass)
      this.setFocusToFirstNode()
      this.addEventListeners()
      this.config.onShow(this.trigger, this.target)
    }

    hide() {
      this.containerEl.inert = false
      this.target.inert = true
      this.target.classList.remove(this.config.activeClass)
      this.removeEventListeners()
      this.config.onHide(this.trigger, this.target)
      this.activeElement.focus()
    }

    getFocusableNodes() {
      const nodes = this.target.querySelectorAll(FOCUSABLE_ELEMENTS)
      return Object.keys(nodes).map(key => nodes[key])
    }

    setFocusToFirstNode() {
      const focusableNodes = this.getFocusableNodes()
      if (focusableNodes.length) focusableNodes[0].focus()
    }

    onClick(event) {
      if (event.target.hasAttribute(this.config.hideTrigger)) {
        this.hide()
      }
    }

    onKeydown(event) {
      if (event.keyCode === 27) this.hide(event)
    }
  }

  const init = config => {
    const options = Object.assign(
      {},
      {
        containerSelector: 'data-butane-container',
        showTrigger: 'data-butane-show'
      },
      config
    )

    options.containerEl = document.querySelector(
      `[${options.containerSelector}]`
    )

    const triggers = Array.from(
      document.querySelectorAll(`[${options.showTrigger}]`)
    )

    triggers.forEach(trigger => {
      options.trigger = trigger
      options.target = document.getElementById(
        trigger.getAttribute(options.showTrigger)
      )
      new ShowHide(options)
    })
  }

  return { init }
})()

export default ButaneShowHide
