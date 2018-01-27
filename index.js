import 'wicg-inert'

const ButaneShowHide = (() => {
  'use-strict'

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
      target,
      triggers = [],
      hideSelector = 'data-butane-hide',
      activeClass = 'is-active',
      onShow = () => {},
      onHide = () => {},
      debugMode = false
    }) {
      this.containerEl = containerEl
      this.target = document.getElementById(target)
      this.config = { debugMode, hideSelector, activeClass, onShow, onHide }
      if (!this.target) return

      this.target.inert = true

      if (triggers.length > 0) this.registerTriggers(...triggers)

      this.onClick = this.onClick.bind(this)
      this.onKeydown = this.onKeydown.bind(this)
    }

    registerTriggers(...triggers) {
      triggers.forEach(trigger => {
        trigger.addEventListener('click', () => this.show())
      })
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
      this.config.onShow(this.target)
    }

    hide() {
      this.containerEl.inert = false
      this.target.inert = true
      this.target.classList.remove(this.config.activeClass)
      this.removeEventListeners()
      this.config.onHide(this.target)
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
      if (event.target.hasAttribute(this.config.hideSelector)) {
        this.hide()
        event.preventDefault()
      }
    }

    onKeydown(event) {
      if (event.keyCode === 27) this.hide(event)
    }
  }

  let activeTarget = null

  const generateTriggerMap = (triggers, triggerAttr) => {
    const triggerMap = []

    triggers.forEach(trigger => {
      const target = trigger.attributes[triggerAttr].value
      if (triggerMap[target] === undefined) triggerMap[target] = []
      triggerMap[target].push(trigger)
    })

    return triggerMap
  }

  const validateTriggers = triggers => {
    if (triggers.length <= 0) {
      return false
    }
  }

  validateIds = id => {
    if (!document.getElementById(id)) {
      throw new Error(
        `ButaneShowHide cannot find a target element with an id of '${id}'`
      )
      return false
    }
  }

  const runValidation = (triggers, triggerMap) => {
    validateTriggers(triggers)
    if (!triggerMap) return true
    for (var id in triggerMap) validateIds(id)
    return true
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

    const containerEl = document.querySelector(`[${options.containerSelector}]`)

    const triggers = Array.from(
      document.querySelectorAll(`[${options.showTrigger}]`)
    )

    const triggerMap = generateTriggerMap(triggers, options.showTrigger)

    if (
      options.debugMode === true &&
      runValidation(triggers, triggerMap) === false
    )
      return

    for (var key in triggerMap) {
      let value = triggerMap[key]
      options.containerEl = containerEl
      options.target = key
      options.triggers = [...value]
      new ShowHide(options)
    }
  }

  return { init }
})()

export default ButaneShowHide
