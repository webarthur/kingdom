/**
 * Selects an element from the DOM.
 * @param {string|Element} target - The target element or selector.
 * @returns {Element} The selected element.
 */
export default function $ (target) {
  const el = typeof(target) === 'string' ? document.querySelector(target) : el

  if (!el.on) el.on = function (event, cb) {
    el.addEventListener(event, cb)
  }

  return el
}

/**
 * Gets an element from the DOM.
 * @param {string|Element} target - The target element or selector.
 * @param {Element} [parent=document] - The parent element to search within.
 * @returns {Element|null} The found element or null.
 */
function get (target, parent=document) {
  const el = typeof(target) === 'string' ? parent.querySelector(target) : target
  if (!el) {
    console.warn('Element not found:', target)
  }
  return el
}

/**
 * Checks if an element exists in the DOM.
 * @param {string|Element} target - The target element or selector.
 * @param {Element} [parent=document] - The parent element to search within.
 * @returns {boolean} True if the element exists, false otherwise.
 */
function exists (target, parent=document) {
  const el = typeof(target) === 'string' ? parent.querySelector(target) : target
  return el !== null
}

/**
 * Adds an event listener to an element.
 * @param {string|Element} target - The target element or selector.
 * @param {string} event - The event type.
 * @param {Function} cb - The event callback function.
 * @returns {Element} The target element.
 */
function on (target, event, cb) {
  if (!cb) {
    cb = event
    event = target
    target = window
  }
  const el = get(target)
  el?.addEventListener(event, cb)
  return el
}

/**
 * Toggles a class on an element.
 * @param {string|Element} target - The target element or selector.
 * @param {string} [className='d-none'] - The class to toggle.
 * @param {boolean} [force] - Force add or remove the class.
 * @returns {Element} The target element.
 */
function toggle (target, className = 'd-none', force) {
  const el = get(target)
  if (force === true) {
    el.classList.add(className)
  }
  else if (force === false) {
    el.classList.remove(className)
  }
  else {
    el.classList.toggle(className)
  }
  return el
}

/**
 * Updates the content of an element.
 * @param {string|Element} target - The target element or selector.
 * @param {string|Array|Object} content - The content to set.
 * @param {string} [type='html'] - The type of content ('html' or 'text').
 * @returns {Element} The target element.
 */
function update(target, content, type='html') {
  const el = get(target)
  
  if (el.tagName === 'SELECT' && Array.isArray(content)) {
    content = content.map(item => {
      if (typeof item === 'object') {
        return `<option value="${item.value}">${item.label}</option>`
      }
      return `<option value="${item}">${item}</option>`
    }).join('')
  }

  if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
    el.value = content
  }
  else if (type === 'html') {
    el.innerHTML = content
  } else if (type === 'text') {
    el.textContent = content
  }
  
  return el
}

/**
 * Iterates over a collection of elements.
 * @param {string|Array|NodeList} target - The target elements or selector.
 * @param {Function} cb - The callback function to execute for each element.
 * @returns {Array|NodeList} The collection of elements.
 */
function each(target, cb) {
  const els = Array.isArray(target) || target instanceof NodeList 
    ? target 
    : document.querySelectorAll(target)
  cb && els.forEach(cb)
  return els
}

/**
 * Shows an element.
 * @param {string|Element} target - The target element or selector.
 * @param {boolean} [force=true] - Force show the element.
 * @returns {Element} The target element.
 */
function show (target, force=true) {
  const el = get(target)
  if (force === true) el.classList.remove('d-none')
  else el.classList.add('d-none')
}

/**
 * Hides an element.
 * @param {string|Element} target - The target element or selector.
 * @returns {Element} The target element.
 */
function hide (target) {
  const el = get(target)
  el.classList.add('d-none')
}

/**
 * Sets or gets an attribute of an element.
 * @param {string|Element} target - The target element or selector.
 * @param {string} attr - The attribute name.
 * @param {string} [value] - The attribute value.
 * @returns {string|Element} The attribute value or the target element.
 */
function set (target, attr, value) {
  const el = get(target)
  if (value === undefined) {
    return el.getAttribute(attr)
  } 
  else {
    el.setAttribute(attr, value)
    return el
  }
}

/**
 * Sets the style of an element.
 * @param {string|Element} target - The target element or selector.
 * @param {string|Object} style - The style property or an object of styles.
 * @param {string} [value] - The style value.
 * @returns {Element} The target element.
 */
function setStyle (target, style, value) {
  const el = get(target)
  if (typeof style === 'object') Object.assign(el.style, style)
  else el.style[style] = value
}

/**
 * Removes an element from the DOM.
 * @param {string|Element} target - The target element or selector.
 */
function remove (target) {
  get(target).remove()
}

/**
 * Creates a new element.
 * @param {string} tag - The tag name of the element.
 * @param {Object} [attributes={}] - The attributes to set on the element.
 * @param {Element} [parent] - The parent element to append to.
 * @param {string} [position] - The position to insert the element.
 * @returns {Element} The created element.
 */
function create (tag, attributes = {}, parent, position) {
  const el = document.createElement(tag)
  Object.keys(attributes).forEach(attr => {
    if (attr.startsWith('on') || typeof(attributes[attr]) === 'function') {
      el.addEventListener(attr.replace(/^on/, ''), attributes[attr])
    }
    else if (attr === 'text') {
      el.textContent = attributes[attr]
    }
    else if (attr === 'html') {
      el.innerHTML = attributes[attr]
    }
    else if (attr === 'child') {
      el.appendChild(attributes[attr])
    }
    else {
      el.setAttribute(attr, attributes[attr])
    }
  })

  if (parent) {
    append(parent, el, position)
  }

  return el
}

/**
 * Appends content to an element.
 * @param {string|Element} target - The target element or selector.
 * @param {string|Element} code - The content to append.
 * @param {string} [position='beforeend'] - The position to insert the content.
 * @returns {Element} The target element.
 */
function append (target, code, position = 'beforeend') {
  target = get(target)
  if (typeof(code) === 'string') {
    target.insertAdjacentHTML(position, code)
  }
  else {
    target.insertAdjacentElement(position, code)
  }
  return target
}

/**
 * Dispatches a custom event.
 * @param {string|Element} target - The target element or selector.
 * @param {string} evt - The event type.
 */
function dispatch (target, evt) {
  if (!evt) {
    evt = target
    target = window
  }
  target.dispatchEvent(new CustomEvent(evt))
}

/**
 * Loads a script or stylesheet.
 * @param {string} src - The source URL.
 * @param {Object} [props={}] - The properties to set on the element.
 * @param {Element} [parent=document.head] - The parent element to append to.
 * @returns {Element} The created element.
 */
function load (src, props = {}, parent = document.head) {
  let el
  if (props.id && (el = document.getElementById(props.id))) {
    return el
  }

  if (src.endsWith('.css')) {
    return create('link', {
      rel: 'stylesheet',
      href: src,
      ...props
    }, parent)
  }
  else {
    return create('script', {
      src,
      ...props
    }, parent)
  }
}

/**
 * Disables an element.
 * @param {string|Element} el - The target element or selector.
 * @returns {Element} The target element.
 */
function disable (el) {
  el = get(el)
  el.setAttribute('disabled', 'disabled')
  return el
}

/**
 * Enables an element.
 * @param {string|Element} el - The target element or selector.
 * @returns {Element} The target element.
 */
function enable (el) {
  el = get(el)
  el.removeAttribute('disabled')
  return el
}

/**
 * Gets the values of checked checkboxes.
 * @param {NodeList} els - The collection of checkboxes.
 * @returns {Array} The values of checked checkboxes.
 */
function checked (els) {
  return Array.from(els)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value)
}

/**
 * Focuses an element.
 * @param {string|Element} el - The target element or selector.
 * @returns {Element} The target element.
 */
function focus(el) {
  el = get(el)
  if (el && typeof el.focus === 'function') {
    el.focus()
  }
  return el
}

export {
  $,
  get,
  on,
  update,
  each,
  show,
  hide,
  set,
  setStyle,
  remove,
  toggle,
  append,
  exists,
  create,
  dispatch,
  load,
  disable,
  enable,
  checked,
  focus
}