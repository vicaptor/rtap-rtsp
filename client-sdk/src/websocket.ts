import { WebSocketConfig, Annotation } from './types';
import { RTAPError } from './errors';

export class WebSocketManager {
  private config: WebSocketConfig;
  private socket?: WebSocket;
  private annotationHandlers: ((annotation: Annotation) => void)[] = [];

  constructor(config: WebSocketConfig) {
    this.config = config;
  }

  /**
   * Connect to the WebSocket server
   */
  public async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(this.config.url);

        this.socket.onopen = () => {
          this.startHeartbeat();
          resolve();
        };

        this.socket.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.socket.onerror = (error) => {
          reject(new RTAPError('WebSocket connection error', { cause: error }));
        };

        this.socket.onclose = () => {
          this.handleClose();
        };
      } catch (error) {
        reject(new RTAPError('Failed to connect to WebSocket', { cause: error }));
      }
    });
  }

  /**
   * Disconnect from the WebSocket server
   */
  public async disconnect(): Promise<void> {
    if (this.socket) {
      this.socket.close();
    }
  }

  /**
   * Subscribe to annotations for a specific stream
   * @param streamId Stream ID to subscribe to
   */
  public async subscribeToStream(streamId: string): Promise<void> {
    this.sendMessage({
      type: 'subscribe',
      streamId
    });
  }

  /**
   * Register a handler for annotation events
   * @param handler Function to handle annotation events
   */
  public onAnnotation(handler: (annotation: Annotation) => void): void {
    this.annotationHandlers.push(handler);
  }

  private sendMessage(message: any): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data);

      switch (message.type) {
        case 'annotation':
          this.annotationHandlers.forEach(handler => handler(message.annotation));
          break;
        case 'pong':
          // Handle heartbeat response
          break;
        default:
          console.warn('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  private handleClose(): void {
    if (this.config.autoReconnect) {
      setTimeout(() => this.connect(), this.config.reconnectInterval);
    }
  }

  private startHeartbeat(): void {
    setInterval(() => {
      this.sendMessage({ type: 'ping' });
    }, this.config.heartbeatInterval);
  }
}
