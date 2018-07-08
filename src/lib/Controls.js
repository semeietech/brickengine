function controlsFactory(...configs) {
    const KEYS = {
      left: 37,
      up: 38,
      rigth: 39,
      down: 40,
      space: 32,
      enter: 13,
      esc: 27,
    }
    
    function addListner(type) {
      return (handler) => window.addEventListener(type, handler, false)
    }
    
    function removeListner(type) {
      return (handler) => window.removeEventListener(type, handler, false)
    }
    
    function keyEvent(key) {
      return (fn) => (console.log('key', key, fn), (...args) => ( console.log('@k'), args[0].keyCode == key && fn(...args)) )
    }
    
    const events = configs.reduce((evts, {name, type, key}) => Object.assign({
      [name]: {
        type,
        handler: keyEvent(KEYS[key])
      }
    }, evts), {})

    return Object.assign(
      {
        remove: (name, fn) => removeListner(events[name].type)(events[name].handler(fn)),
        add: (name, fn) => addListner(events[name].type)(events[name].handler(fn))
      },
      Object.keys(events).reduce(
        (alias, name) => Object.assign(
           {[name]: (fn) => addListner(events[name].type)(events[name].handler(fn))},
           alias,
        ),
      {},
     ),
    )
    // TODO: gestures
    // TODO: screen buttons
}

export default controlsFactory
