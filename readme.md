# KingDom.js: A lightweight DOM manipulation library

KingDom.js is a lightweight, utility-driven JavaScript library designed to simplify DOM manipulation, event handling, and dynamic content management in your web projects. With a fluent and intuitive API, KingDom.js empowers developers to write cleaner and more efficient code when interacting with the Document Object Model (DOM).

## Installation

You can install KingDom.js using a package manager like npm or yarn:

```bash
npm install @webarthur/kingdom
```

You can also include KingDom.js in your project by downloading the file and linking it directly in your HTML or by importing it into your JavaScript modules. Download `KingDom.js` and include it in your HTML file:

```html
<script src="path/to/kingdom.js"></script>
```

## Usage

KingDom.js exposes a set of utility functions that can be used to perform common DOM manipulation tasks. Below are examples of how to use each function:

- `get(target)`: Accepts a CSS selector string or an existing DOM element and returns the selected element(s).
- `each(target, callback)`: Iterates over a collection of elements selected using a CSS selector and executes the callback function for each element.
- `on(target, event, callback)`: Attaches an event listener to the specified element. Provides a convenient shorthand for common events:
- `update(target, content, type='html')`: Updates the content of an element. `type` can be `'html'` or `'text'`.
- `show(target)`: Makes an element visible by removing the `d-none` class (assuming a Bootstrap-like class naming convention).
- `hide(target)`: Hides an element by adding the `d-none` class.
- `append(target, code, position = 'beforeend')`: Appends content (string or element) to an existing element at a specified position.
- `set(target, attribute, value)`: Sets or retrieves an attribute value for an element.
- `setStyle(target, style, value)`: Sets a CSS style property for an element. You can pass an object for multiple styles.
- `create(tag, attributes = {}, parent, position = 'beforeend')`: Creates a new DOM element with the specified tag, attributes, and optional parent and position for insertion.
- `remove(target)`: Removes an element from the DOM.
- `toggle(target, className = 'd-none', force)`: Toggles a CSS class for an element, optionally adding or removing it based on a `force` flag.
- `exists(target, parent = document)`: Checks if an element exists in the DOM.
- `dispatch(target, event)`: Dispatches a custom event on an element.
- `load(src, props = {}, parent = document.head)`: Loads a script or stylesheet from the specified source with optional properties and parent element.
- `until(test, finalCallback, interval = 50)`: Executes a callback repeatedly until a test function returns true.

## Examples

### Adding Event Listeners

Using `on()` to attach an event listener to the specified element.

```javascript
import { on } from '@webarthur/kingdom'

// Attaches a callback to button on click event
on('#button-id', 'click', () => {
  console.log('Button clicked!')
})

// Attaches a callback to window on load
on('load', () => {
  console.log('Page loaded!')
})
```

### Updating Element Content

Using `update()` topdate the content of an element.

```javascript
import { update } from '@webarthur/kingdom'

update('#myDiv', 'New content here')
```

### Showing and Hiding Elements

```javascript
import { hide, showw } from '@webarthur/kingdom'

hide('#element-id') // Hide element
show('#element-id') // Show element
```

### Toggling Classes

```javascript
import { toggle } from '@webarthur/kingdom'

toggle('#element-id', 'my-class')
```

### Creating and Appending Elements


```javascript
import { get, create } from '@webarthur/kingdom'

// Get container ref
const container = get('#container-id')

// Create new div and append to container
const newDiv = create('div', { 
  class: 'my-new-div', 
  text: 'Hello, world!' 
}, container)
```

### Removing Elements

```javascript
remove('#element-id')
```

### Loading External Resources

```javascript
load('path/to/script.js') // Load an external JavaScript file
load('path/to/style.css') // Load an external CSS file
```

### Executing Callbacks Until a Condition is Met

```javascript
import { until } from '@webarthur/kingdom'

let count = 0
until(
  () => count === 5, // Test function: continues until count is 5
  () => console.log('Count reached 5!'), // Callback: executed when test returns true
  100 // Interval: checks every 100 milliseconds
)

const incrementCount = setInterval(() => {
  count++
  console.log('Count:', count)
  if (count >= 5) {
    clearInterval(incrementCount)
  }
}, 100)
```

### Waiting for a Global Variable to Load (e.g., TinyMCE)

```javascript
import { until } from '@webarthur/kingdom'
import { load } from '@webarthur/kingdom'

// Load TinyMCE script (assuming it exposes `window.tinymce`)
load('https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.10.2/tinymce.min.js', {}, document.body)

// Wait until TinyMCE is loaded, then initialize it
until(
  () => typeof window.tinymce !== 'undefined', // Checks if tinymce is available
  () => {
    window.tinymce.init({
      selector: '#my-text-area', // Replace with your actual selector
      plugins: 'advlist autolink lists link image charmap print preview hr anchor pagebreak',
      toolbar_mode: 'floating',
    })
    console.log('TinyMCE initialized!')
  }
)
```

## Contributing

Contributions to KingDom.js are always welcome! Whether it's bug reports, feature requests, or pull requests, all contributions help make KingDom.js better for everyone.

## License

KingDom.js is open source and released under the MIT License. See the LICENSE file for more details.
