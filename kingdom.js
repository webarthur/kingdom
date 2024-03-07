export default function $ (target) {
  const el = typeof(target) === 'string' ? document.querySelector(target) : el

  if (!el.on) el.on = function (event, cb) {
    el.addEventListener(event, cb)
  }

  return el
}

function get (target, parent=document) {
  const el = typeof(target) === 'string' ? parent.querySelector(target) : target
  if (!el) {
    console.warn('Element not found:', target)
  }
  return el
}

function exists (target, parent=document) {
  const el = typeof(target) === 'string' ? parent.querySelector(target) : target
  return el !== null
}

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

function update (target, content, type='html') {
  const el = get(target)
  if (type === 'html') {
    el.innerHTML = content
  } else if (type === 'text') {
    el.textContent = content
  }
  return el
}

function each (target, cb) {
  const els = document.querySelectorAll(target)
  cb && els.forEach(cb)
  return els
}

// Function to show element or elements
function show (target, force=true) {
  const el = get(target)
  if (force === true) el.classList.remove('d-none')
  else el.classList.add('d-none')
}

// Function to hide element or elements
function hide (target) {
  const el = get(target)
  el.classList.add('d-none')
}

// Function to set attributes for element
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

// Function to set css for element
function setStyle (target, style, value) {
  const el = get(target)
  if (typeof style === 'object') Object.assign(el.style, style)
  else el.style[style] = value
}

// Remover elemento
function remove (target) {
  get(target).remove()
}

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
  // for (const attr in attributes) {
  //   if (attributes.hasOwnProperty(attr)) {
  //     el.setAttribute(attr, attributes[attr])
  //   }
  // }
  // if (content) {
  //   el.innerHTML = content
  // }

  if (parent) {
    append(parent, el, position)
  }

  return el
}

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

function dispatch (target, evt) {
  if (!evt) {
    evt = target
    target = window
  }
  target.dispatchEvent(new CustomEvent(evt))
}

function load (src, props = {}, parent = document.head) {
  // If element with an id exists it should return
  let el
  if (props.id && (el = document.getElementById(props.id))) {
    return el
  }

  // if (!parent) {
  //   parent = document.head
  // }

  if (src.endsWith('.css')) {
    // If the link element doesn't exist, create a new one and add it to the document's head
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
  // ready,
  append,
  exists,
  create,
  dispatch,
  load
}
