export interface RTAPConfig {
  playerConfig: PlayerConfig;
  annotationConfig: AnnotationConfig;
  wsConfig: WebSocketConfig;
}

export interface PlayerConfig {
  hlsConfig?: any;
}

export interface AnnotationConfig {
  annotationDuration: number;
}

export interface WebSocketConfig {
  url: string;
  autoReconnect?: boolean;
  reconnectInterval?: number;
  heartbeatInterval?: number;
}

export interface StreamOptions {
  autoplay?: boolean;
  muted?: boolean;
}

export enum StreamState {
  IDLE = 'idle',
  LOADING = 'loading',
  PLAYING = 'playing',
  ERROR = 'error'
}

export enum AnnotationType {
  MARKER = 'marker',
  RECTANGLE = 'rectangle',
  POLYGON = 'polygon',
  TEXT = 'text'
}

export interface Annotation {
  id: string;
  type: AnnotationType;
  timestamp: number;
  data: any;
  style?: AnnotationStyle;
}

export interface AnnotationStyle {
  color?: string;
  lineWidth?: number;
  font?: string;
}

export interface Point {
  x: number;
  y: number;
}
