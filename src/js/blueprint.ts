// todo of widget: 
// 1. canvas [x]

// ===== MOVING 
// 1. move scheme on click on any of its point [x]

// ===== ZOOM
// 1. multistep zoom                  [x]
// 2. zoom with scroll on desktop     [x]
// 3. zoom with double click          [x]
// 4. zoom with fingers on phone      
// 5. zooming not in center of screen
//    but on mouse pointer            

// ===== BUTTON PANEL
// 1. zoom in button                  [x]
// 2. zoom out button                 [x]
// 3. buttons panel                   [x]
// 4. centerize button
// 5. custom classname for panel                
// 6. buttons turn on/off 

// ===== POINTS
// 1. point event handler
// 2. placeholder of point

// ===== OTHERS
// 1. all data must be received through json (bg, points, rows)

// FIXME: bug with zoom on windows with size less original scheme image size 

import * as INTERFACES from './common/interfaces'; 
import { FUNCTIONS } from './common/functions';

class Blueprint {
  private target: HTMLElement;
  private scheme: INTERFACES.IScheme;
  private options: INTERFACES.IOptions;
  private scales: number[];
  private schemeCanvas: CanvasRenderingContext2D;
  private timer: INTERFACES.IDragTimer;
  private step: INTERFACES.IOptions['step'];
  current: INTERFACES.ICurrent;

  constructor( _target: HTMLElement, _bg: INTERFACES.IScheme, _options?: INTERFACES.IOptions ) {
    this.target = _target;
    this.scheme = _bg;
    
    this.timer = { id: null };

    this.step = _options?.step || 0.1;
    
    if(_options) {
      this.options = _options;
    }

    this.current = {
      x: 0, 
      y: 0, 
      zoom: { scale: 0, step: 0 },
      acceptOverflow: false,
      isDragged: false,
      origin: []
    }

    this.scales = this.setScales();
    this.schemeCanvas = null;

    this.initialize();
  }

  get targetCenter() {
    const { offsetWidth, offsetHeight } = this.target;
    
    return { 
      x: offsetWidth / 2, 
      y: offsetHeight / 2 
    }
  }

  get zoom() {
    return this.current.zoom
  }

  set zoom(obj: INTERFACES.IZoom) {
    const { scale, step } = obj;

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

  clearTimer(id: INTERFACES.IDragTimer['id']): void {
    clearTimeout(id);
    this.timer.id = null;
  } 
  
  setScales() : number[] {
    const { width, height } = this.scheme;
    const { offsetWidth, offsetHeight } = this.target;

    let bgWidth  = width,
        bgHeight = height;
    
    let zw = offsetWidth / bgWidth,
        zh = offsetHeight / bgHeight;

    let z = Math.min(zw, zh),
        tempArr = [ ...new Array(5)].map(( _, k) => Math.max(z, z * (Math.pow(1.5, k)))),
        minScales = tempArr.filter(i => i < 1),
        maxScales = tempArr.filter(i => i > 1 && i <= 2),
        scales = [ ...minScales, 1, ...maxScales ];

    this.zoom = { scale: scales[0], step : 0 };
    
    return scales;
  }

  initialize() : void {
    this.initializeSchemeLayout();
  }

  initializeSchemeLayout() : void {
    const { width, height } = this.scheme;
    const canvas: HTMLCanvasElement = this.createCanvas('background');

    this.schemeCanvas = this.buildCanvasLayout(canvas, width, height);

    this.initializeSchemeDrag();
    this.initializeSchemeZoom();
    // this.initializeScheme();
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
            this.targetCenter.x - width * this.scales[0] / 2, this.targetCenter.y - height * this.scales[0] / 2,
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
    c.setAttribute('style', `transform: scale(${this.zoom.scale}) translate(0px, 0px)`);

    this.target.append(c);
    return c;
  } 


  /** Drag initializer function for mouse and touch events */
  
  initializeSchemeDrag() : void {
    let sx : number = 0, 
        sy : number = 0;

    const startDrag = (e: MouseEvent & TouchEvent): void => {
      // console.log(functions.isDescendant(e.target as HTMLElement, this.target));
      if(!FUNCTIONS.isDescendant(e.target as HTMLElement, this.target)) return;
      
      const { left, top } : ClientRect = this.schemeCanvas.canvas.getBoundingClientRect();
      
      sx = e.clientX - left;
      sy = e.clientY - top;
      
      this.current.isDragged = true;
      
      this.target.addEventListener('mouseup', endDrag);
      this.target.addEventListener('mousemove', drag);
      this.target.addEventListener('mouseleave', endDrag);
    }

    const drag = (e: any): void => {

      if(this.current.isDragged) {
        const { left, top } = this.schemeCanvas.canvas.getBoundingClientRect();
        let dx = 0, 
            dy = 0;

        dx = (e.clientX - left) - sx;
        dy = (e.clientY - top) - sy;

        this.current.x += dx;
        this.current.y += dy;

        this.schemeCanvas.canvas.setAttribute('style', `transform: scale(${this.zoom.scale}) translate(${this.current.x}px, ${this.current.y}px)`);
      }
    }
    
    const endDrag = (e: any): void => {
      if(this.current.isDragged) this.drag = false;
      
      this.target.removeEventListener('mousemove', drag);
      this.target.removeEventListener('mouseup', endDrag);
      this.target.removeEventListener('mouseleave', endDrag);
    };

    this.target.addEventListener('mousedown', startDrag);
  }

  /** Zooming in function
   * 
   * @param {boolean} withStep zoom with constant
   */
  zoomIn(e: MouseEvent | null, withStep?: boolean): void{
    const { length } = this.scales;

    if(withStep) {
      this.overflow = true;
      
      let scale = this.zoom.scale + this.step,
          step = this.scales.filter(i => i <= scale).length;
      
      if(scale < this.scales[length - 1]) {
        this.zoom = { scale, step };
      } else {
        this.zoom = { scale: this.scales[length - 1], step}; 
      }
    } else {
      let step = Math.min(++this.zoom.step, length - 1);
      
      this.zoom = { scale: this.scales[step], step }
    }

    this.recalculateCanvas();
  };

  /** Zooming out function
   * 
   * @param {boolean} withStep zoom with constant
   */
  zoomOut(e: MouseEvent | null, withStep?: boolean): void{
    const { length } = this.scales;
    
    if(withStep) {
      let scale = this.zoom.scale - this.step,
          step = this.scales.filter(i => i <= scale).length;

      if(scale > this.scales[0]) {
        this.zoom = { scale, step };
      } else {
        this.zoom = { scale: this.scales[0], step: 0 };
        this.overflow = false;
      }
    } else {
      let step = Math.max(--this.zoom.step, 0);
      
      this.zoom = { scale: this.scales[step], step }
    }

    this.recalculateCanvas();
  };
  
  initializeSchemeZoom(): void {

    /** Zooming by wheel 
     * @param {WheelEvent} e event target
    */

    const handleWheel = (e: WheelEvent) => {
      let delta: number = Math.max(-1, Math.min(1 , e.deltaY || -e.detail));

      if(delta < 0) this.zoomIn(e, true);
      if(delta > 0) this.zoomOut(e, true);
    }

    const handleDblClick = () => {
      const scalesMiddleValue = Math.ceil(this.scales.length / 2) - 1;
      const step = this.zoom.step + scalesMiddleValue < this.scales.length ? this.zoom.step + scalesMiddleValue : 0 ;

      this.zoom = { scale: this.scales[step], step}
      this.recalculateCanvas();    
    }
  
    this.target.addEventListener('wheel', handleWheel)
    this.target.addEventListener('dblclick', handleDblClick);
  }

  recalculateCanvas(_origin?: number[]) : void {
    const { canvas } = this.schemeCanvas;
    const { x, y } = this.current;
    const { scale } = this.zoom;
    const origin = _origin && _origin.length > 0 ? _origin.map(i => i + 'px').join(' ') : '50% 50%';

    canvas.setAttribute('style', `transform: scale(${scale}) translate(${x}px, ${y}px); transform-origin: ${origin}`);
  }
}

export default Blueprint;