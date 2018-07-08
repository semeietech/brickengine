function screenFactory(linesNumber, colunsNumber, prefixer) {
    let frame
    const prefix = prefixer || ''

    function parseIds(frame) {
      return frame.reduce(
        (ids, line, il) => [
          ...ids,
          ...line.reduce(
            (ids, col, ic) => col ? [...ids,  '#' + prefix + 'l' + il + 'p' + ic ] : ids,
            '',
          ),
        ],
        [],
      ).join(', ')
    }
  
    function queryPixels(parsedIds) {
      return document.querySelectorAll(parsedIds)
    }
  
    function writePixel(pixel) {
      return (pixel.style.opacity = 1, pixel)
    }
    
    function erasePixel(pixel) {
      return (pixel.style.opacity = null, pixel)
    }
    
    // TODO: add a render module
    function renderHTML() {
      const pixel = id => `<div class="pixel" id="${id}"></div>`;
      const linha = id => child => `<div class="linha" id="${id}">${child}</div>`;
      return true
    }
    
    function write() {
       const ids = parseIds(frame)
       const pixels = queryPixels(ids);
          pixels.forEach(writePixel);
       return '200'
     }
    
    
    function erase() {
       const ids = parseIds(frame);
       const pixels = queryPixels(ids);
          pixels.forEach(erasePixel);
       return '200';
    }
    
    function unmount(id) {
      return document.getElementById(id).innerHtml(renderHTML())
    }
    
    function mount(id) {
      return document.getElementById(id).innerHtml(renderHTML())
    }
    
    function display(frames, idForRemount, keepBoth) {
       if (idForRemount) {
         if (!keepBoth) {
           unmount()
         }
         mount(idForRemount)
       }
  
       if (frame) {
        erase();
       }
       frame = frames;
       return write();
     }
      
    return display
}

export default screenFactory
