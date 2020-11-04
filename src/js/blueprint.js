// todo in widget: 
// 1. canvas [x]
// 2. multistep zoom [x]
// 3. zoom with scroll on desktop
// 4. zoom with fingers on phone
// 5. zoom buttons: in, out, center
// 6. point event handler
// 7. all data must be received through json (bg, points, rows)
// 8. placeholder of point

export default class Blueprint {
  constructor(target, bg, points) {
    this.target = target;
    
    this.scheme = bg;
    this.scheme.sizes = { w: +bg.width, h: +bg.height };
    this.points = points;

    this.scales = this.setScales();
    this.isDragged = false;

    this.schemeCanvas = null;

    // this.CANVAS_SELECTOR = '.blueprint__canvas-wrapper';
    this.IS_MOBILE = window.innerWidth <= 1024;

    this.current = { x: 0, y: 0 };
    this.initialize();
  }

  get center() {
    return { x : this.target.offsetWidth / 2, y : this.target.offsetHeight / 2 }
  }

  initialize() {
    this.initializeSchemeLayout();
  }

  initializeSchemeLayout() {
    const { w, h } = this.scheme.sizes;

    this.schemeCanvas = this.buildCanvasLayout(
      this.createCanvas('background'), w, h
    );

    this.initializeSchemeDrag();
  }

  createCanvas(type) {
    const c = document.createElement('canvas');

    c.setAttribute('id', `blueprint-${type}`);
    c.setAttribute('class', `blueprint__canvas`);
    c.setAttribute('data-type', type);

    this.target.append(c);
    
    return c;
  } 

  buildCanvasLayout(layout, width, height) {
    let ctx;

    // todo: refactor
    switch(layout.getAttribute('data-type')) {
      case 'background':
        ctx = layout.getContext('2d');
    
        layout.setAttribute('width',  this.target.offsetWidth);
        layout.setAttribute('height', this.target.offsetHeight);

        const bg = new Image(width, height);
        bg.src = this.scheme.image;
        
        bg.onload = _ => {
          ctx.drawImage(
            bg, 
            0, 0,
            width, height,
            this.center.x - width * this.scales[0] / 2, this.center.y - height * this.scales[0] / 2,
            width * this.scales[0], height * this.scales[0],
          );
        }
        
        break;
        
      default: break;
    }
    
    return ctx;
  }
  
  setScales() {
    const { w, h } = this.scheme.sizes;
    const { offsetWidth, offsetHeight } = this.target;

    let bgWidth  = w,
        bgHeight = h;
    
    let zw = offsetWidth / bgWidth,
        zh = offsetHeight / bgHeight;

    let z = Math.min(zw, zh);

    let minScales = [ ...new Array(5) ].map(( _, k) => Math.max(z, z * (Math.pow(1.5, k)))).filter(i => i < 1);
    let maxScales = [ ...new Array(5) ].map(( _, k) => Math.max(z, z * (Math.pow(1.5, k)))).filter(i => i > 1);
    
    return [ ...minScales, 1, ...maxScales ];
  }

  initializeSchemeDrag() {
    let sx, sy;

    const startDrag = e => {
      if(e.target !== this.schemeCanvas.canvas) return;

      this.isDragged = true;
      const { left, top } = this.schemeCanvas.canvas.getBoundingClientRect();

      if(!this.IS_MOBILE) {
        sx = e.clientX - left;
        sy = e.clientY - top;
      } else {
        sx = e.changedTouches[0].clientX - left;
        sy = e.changedTouches[0].clientY - top;
      }
    }

    const drag = e => {
      if(this.isDragged) {
        const { left, top } = this.schemeCanvas.canvas.getBoundingClientRect();
        let dx, dy;

        if(!this.IS_MOBILE) {
          dx = (e.clientX - left) - sx;
          dy = (e.clientY - top) - sy;
        } else {
          dx = (e.changedTouches[0].clientX - left) - sx;
          dy = (e.changedTouches[0].clientY - top) - sy;
        }

        this.current.x += dx;
        this.current.y += dy;

        e.target.style = `transform: translate(${this.current.x}px, ${this.current.y}px)`;
      }
    }

    const endDrag = e => {
      if(this.isDragged) this.isDragged = false;
      
      // const { width, height, left, top } = this.schemeCanvas.canvas.getBoundingClientRect();
      // const { w, h } = this.scheme.sizes;
      // if(
      //   left + width > w || 
      //   left - width < w ||
      //   top + height > h ||
      //   top - height < h
      // ) {
      //   this.schemeCanvas.canvas.style = 'transform: translate(0px, 0px)';
      // }
    };

    this.target.addEventListener('mousedown', startDrag);
    this.target.addEventListener('mousemove', drag);
    this.target.addEventListener('mouseup', endDrag);
    this.target.addEventListener('mouseleave', endDrag);
    this.target.addEventListener('touchstart', startDrag);
    this.target.addEventListener('touchmove', drag);
    this.target.addEventListener('touchend', endDrag);
  }
}


  // initializePointsLayout() {
  //   const { pointsRadius } = this.options;
  //   const ctx = this.buildCanvasLayout(this.pointsLayout);

  //   this.points.forEach(el => {
  //     ctx.beginPath();
  //     ctx.arc(el.x - pointsRadius, el.y - pointsRadius, pointsRadius, 0, Math.PI * 2);
  //     console.log(el)
  //     ctx.fillStyle = "#000";
  //     ctx.fill();
  //   });

  // }

  // create zoom
  // createZoomBar() {
  //   // ...
  // }