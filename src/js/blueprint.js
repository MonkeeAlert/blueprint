// todo in widget: 
// 1. canvas [x]
// 2. multistep zoom [x]
// 3. zoom with scroll on desktop [x]
// 4. zoom with double click/tap 
// 5. zoom with fingers on phone
// 6. zoom buttons: in, out, center
// 7. point event handler
// 8. all data must be received through json (bg, points, rows)
// 9. placeholder of point

// FIXME: bug with zoom on windows with size less original scheme image size 

export default class Blueprint {
  constructor(target, bg, points) {
    this.target = target;
    
    this.scheme = bg;
    this.scheme.sizes = { w: +bg.width, h: +bg.height };
    this.points = points;

    this.current = { 
      x: 0, 
      y: 0, 
      zoom: { scale: null, step: null },
      acceptOverflow: false
    };

    this.schemeCanvas = null;
    this.scales = this.setScales();
    this.isDragged = false;

    this.IS_MOBILE = window.innerWidth <= 1024;

    this.initialize();
  }

  get center() {
    const { offsetWidth, offsetHeight } = this.target;
    
    return { x : offsetWidth / 2, y : offsetHeight / 2 }
  }

  get zoom() {
    return this.current.zoom;
  }

  set zoom(arr) {
    const [ scale, step ] = arr;
    this.current.zoom = { scale, step }

    return this.current.zoom;
  }

  get overflow() {
    return this.current.acceptOverflow;
  }

  set overflow(bool) {
    this.current.acceptOverflow = bool

    return this.current.acceptOverflow;
  }

  initialize() {
    this.initializeSchemeLayout();
  }

  initializeSchemeLayout() {
    const { w, h } = this.scheme.sizes;

    this.schemeCanvas = this.buildCanvasLayout(
      this.createCanvas('background'), 
      w, h
    );

    this.initializeSchemeDrag();
    this.initializeSchemeZoom();
  }

  createCanvas(type) {
    const c = document.createElement('canvas');

    c.setAttribute('id', `blueprint-${type}`);
    c.setAttribute('class', `blueprint__canvas`);
    c.setAttribute('data-type', type);
    c.setAttribute('style', 'transform: scale(1) translate(0px, 0px)');

    this.target.append(c);
    
    return c;
  } 

  buildCanvasLayout(layout, width, height) {
    let ctx;

    switch(layout.getAttribute('data-type')) {
      case 'background':
        const { offsetWidth, offsetHeight } = this.target;
        ctx = layout.getContext('2d');
    
        layout.setAttribute('width',  offsetWidth);
        layout.setAttribute('height', offsetHeight);

        const bg = new Image();
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
    let maxScales = [ ...new Array(5) ].map(( _, k) => Math.max(z, z * (Math.pow(1.5, k)))).filter(i => i > 1 && i <= 2);
    
    this.zoom = [ Object.values(minScales).length === 0 ? 1 : minScales[0] , 0 ];

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
      if(e.target !== this.schemeCanvas.canvas) return;
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

        e.target.style = `transform: scale(${this.zoom.scale}) translate(${this.current.x}px, ${this.current.y}px)`;
      }
    }

    const endDrag = e => {
      if(this.isDragged) this.isDragged = false;

      const { canvas } = this.schemeCanvas;
      const { width, height, left, top } = canvas.getBoundingClientRect();
      const { w, h } = this.scheme.sizes;
      
      if(this.overflow) return;
      else {
        if(
          left + width > w || 
          left - width < w ||
          top + height > h ||
          top - height < h
        ) {
          this.current.x = 0; 
          this.current.y = 0;
          canvas.style = 'transform: scale(1), transform: translate(0px, 0px)';
        }
      }
    };

    this.target.addEventListener('mousedown', startDrag);
    this.target.addEventListener('mousemove', drag);
    this.target.addEventListener('mouseup', endDrag);
    this.target.addEventListener('mouseleave', endDrag);
    this.target.addEventListener('touchstart', startDrag);
    this.target.addEventListener('touchmove', drag);
    this.target.addEventListener('touchend', endDrag);
  }
  
  initializeSchemeZoom() {
    const { length } = this.scales;
    const _step = 0.1;

    const zoomIn = withStep => {
      if(withStep) {
        let { scale, step } = this.zoom;
        
        this.overflow = true;
        if(scale + _step < this.scales[length - 1] - _step) {
          this.zoom = [ scale + _step, ++step];
        } else {
          this.zoom = [ this.scales[length - 1], length - 1];
        }
      }
    };

    const zoomOut = withStep => {
      if(withStep) {
        let { scale, step } = this.zoom;
        
        if(scale - _step > this.scales[0]) {
          this.zoom = [ scale - _step, --step];
        } else {
          this.zoom = [ this.scales[0], 0];
          this.overflow = false;
        }
      }
    };

    const wheelHandler = e => {
      let delta = Math.max(-1, Math.min(1 , e.wheelDelta || -e.detail));

      if(delta > 0) zoomIn(true);
      if(delta < 0) zoomOut(true);
    
      this.recalculateCanvas()
    }

    this.target.addEventListener('wheel', wheelHandler)
  }

  recalculateCanvas(zoom) {
    const { canvas } = this.schemeCanvas;
    const { x, y } = this.current;

    canvas.setAttribute('style', `transform: scale(${this.zoom.scale}) translate(${x}px, ${y}px)`);
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