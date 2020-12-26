
export interface IScheme {
  image: string,
  width: number,
  height: number
}

export interface IZoom {
  scale: number,
  step: number,
}

export interface ICurrent {
  x: number,
  y: number,
  zoom: IZoom,
  acceptOverflow: boolean,
  isDragged: boolean,
  origin: number[]
}

export interface IOptions {
  step: number,
  renderButtons: boolean
  zoomInBtn: IButtonOptions,
  zoomOutBtn: IButtonOptions,
  centerizeBtn: IButtonOptions,
}

export interface IButtonOptions {
  shouldRender: boolean
}

export interface IDragTimer {
  id: any
}