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

interface IScheme {
  image: string,
  width: number,
  height: number
}

type Zoom = {
  scale: number,
  step: number,
}

interface ICurrent {
  x: number,
  y: number,
  zoom: Zoom,
  acceptOverflow: boolean,
  isDragged: boolean
}

class Blueprint {
  private target: HTMLElement;
  private scheme: IScheme;
  private points: object;
  private scales: Array<number>;
  private schemeCanvas: CanvasRenderingContext2D;
  current: ICurrent;

  constructor( _target: HTMLElement, _bg: IScheme, _points: object ) {
    this.target = _target;
    this.scheme = _bg;
    this.points = _points;

    this.current = <ICurrent>{
      x: 0, 
      y: 0, 
      zoom: {},
      acceptOverflow: false,
      isDragged: false
    }

    this.scales = this.setScales();
    this.schemeCanvas = null;

    this.initialize();
  }

  get center() {
    const { offsetWidth, offsetHeight } = this.target;
    
    return { x : offsetWidth / 2, y : offsetHeight / 2 }
  }

  get zoom() {
    return this.current.zoom
  }

  set zoom(obj: object) {
    const { scale, step } = <Zoom>obj;

    this.current.zoom = { scale, step }
  }

  get overflow() {
    return this.current.acceptOverflow;
  }

  set overflow(bool: boolean) {
    this.current.acceptOverflow = bool
  }

  get drag() {
    return this.current.isDragged
  }

  set drag(state: boolean) {
    this.current.isDragged = state
  }

  setScales = () : number[]=> {
    const { width, height } = <IScheme>this.scheme;
    const { offsetWidth, offsetHeight } = this.target;

    let bgWidth  = width,
        bgHeight = height;
    
    let zw = offsetWidth / bgWidth,
        zh = offsetHeight / bgHeight;

    let z = Math.min(zw, zh);

    let minScales = [ ...new Array(5) ].map(( _, k) => Math.max(z, z * (Math.pow(1.5, k)))).filter(i => i < 1);
    let maxScales = [ ...new Array(5) ].map(( _, k) => Math.max(z, z * (Math.pow(1.5, k)))).filter(i => i > 1 && i <= 2);
    
    this.current.zoom = { scale : Object.values(minScales).length === 0 ? 1 : minScales[0] , step : 0 };
    
    return [ ...minScales, 1, ...maxScales ];
  }

  initialize() : void {
    this.initializeSchemeLayout();
  }

  initializeSchemeLayout() : void {
    const { width, height } = <IScheme>this.scheme;
    const canvas: HTMLCanvasElement = this.createCanvas('background');

    this.schemeCanvas = this.buildCanvasLayout(canvas, width, height);

    this.initializeSchemeDrag();
    this.initializeSchemeZoom();
  }

  buildCanvasLayout(layout : HTMLCanvasElement, width : number, height : number) : CanvasRenderingContext2D {
    switch(layout.getAttribute('data-type')) {
      case 'background':
        const { offsetWidth, offsetHeight } = this.target;
        const bg : HTMLImageElement = new Image();
        let ctx : any = layout.getContext('2d');
        
        layout.setAttribute('width',  `${offsetWidth}`);
        layout.setAttribute('height', `${offsetHeight}`);

        bg.src = this.scheme.image;
        
        bg.onload = () : void => {
          ctx.drawImage(
            bg, 
            0, 0,
            width, height,
            this.center.x - width * this.scales[0] / 2, this.center.y - height * this.scales[0] / 2,
            width * this.scales[0], height * this.scales[0],
          );
        }
        
        return ctx;
        
      default: break;
    }
  }

  createCanvas(type: string) : HTMLCanvasElement {
    const c: HTMLCanvasElement = document.createElement('canvas');

    c.setAttribute('id', `blueprint-${type}`);
    c.setAttribute('class', `blueprint__canvas`);
    c.setAttribute('data-type', type);
    c.setAttribute('style', 'transform: scale(1) translate(0px, 0px)');

    this.target.append(c);
    
    return c;
  } 

  initializeSchemeDrag() {
    let sx : number = 0, 
        sy : number = 0;

    const startDrag = (e: MouseEvent & TouchEvent): void => {
      if(e.target !== this.schemeCanvas.canvas) return;

      const { left, top } : ClientRect = this.schemeCanvas.canvas.getBoundingClientRect();
      
      this.current.isDragged = true;
      
      // if(!this.IS_MOBILE) {
        sx = e.clientX - left;
        sy = e.clientY - top;
      // } else {
      //   sx = e.changedTouches[0].clientX - left;
      //   sy = e.changedTouches[0].clientY - top;
      // }
    }

    const drag = (e: any): void => {
      if(e.target !== this.schemeCanvas.canvas) return;
      if(this.current.isDragged) {
        const { left, top } = this.schemeCanvas.canvas.getBoundingClientRect();
        let dx: number = 0, 
            dy: number = 0;

        // if(!this.IS_MOBILE) {
          dx = (e.clientX - left) - sx;
          dy = (e.clientY - top) - sy;
        // } else {
        //   dx = (e.changedTouches[0].clientX - left) - sx;
        //   dy = (e.changedTouches[0].clientY - top) - sy;
        // }

        this.current.x += dx;
        this.current.y += dy;

        e.target.style = `transform: scale(${this.current.zoom.scale}) translate(${this.current.x}px, ${this.current.y}px)`;
      }
    }

    const endDrag = (): void => {
      if(this.current.isDragged) this.drag = false;

      const { width, height, left, top } = this.schemeCanvas.canvas.getBoundingClientRect();
      const { width: w, height: h } = this.scheme;
      
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
          this.schemeCanvas.canvas.setAttribute('style', 'transform: scale(1), transform: translate(0px, 0px)');
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
  
  initializeSchemeZoom(): void {
    const { length } = this.scales;
    const _step = 0.1;

    const zoomIn = (withStep: boolean): void => {
      if(withStep) {
        let { scale, step } = <Zoom>this.zoom;
        
        this.overflow = true;
        if(scale + _step < this.scales[length - 1] - _step) {
          this.zoom = {
            scale: scale + _step, 
            step: ++step
          };
        } else {
          this.zoom = {
            scale: this.scales[length - 1], 
            step: length - 1
          }; 
        }
      }
    };

    const zoomOut = (withStep: boolean): void => {
      if(withStep) {
        let { scale, step } = <Zoom>this.zoom;
        
        if(scale - _step > this.scales[0]) {
          this.zoom = { 
            scale: scale - _step, 
            step: --step 
          };
        } else {
          this.zoom = { 
            scale: this.scales[0], 
            step: 0
          };
          this.overflow = false;
        }
      }
    };

    const wheelHandler = (e: WheelEvent) => {
      let delta: number = Math.max(-1, Math.min(1 , e.deltaY || -e.detail));

      if(delta < 0) zoomIn(true);
      if(delta > 0) zoomOut(true);
    
      this.recalculateCanvas()
    }

    this.target.addEventListener('wheel', wheelHandler)
  }

  recalculateCanvas(zoom?: number) : void {
    const { canvas } = this.schemeCanvas;
    const { x, y } = this.current;
    const { scale } = <Zoom>this.zoom;

    canvas.setAttribute('style', `transform: scale(${scale}) translate(${x}px, ${y}px)`);
  }
}

export default Blueprint;