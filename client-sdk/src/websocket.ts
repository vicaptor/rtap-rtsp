import { WebSocketConfig, Annotation } from './types';
import { RTAPError } from './errors';

type MessageHandler = (annotation: Annotation) => void;

interface WebSocketMessage {
  type: string;
  streamId?: string;
  annotation?: Annotation;
}

export class WebSocketManager {
  private config: WebSocketConfig;
  private socket?: WebSocket;
  private annotationHandlers: MessageHandler[] = [];
  private heartbeatInterval?: number;

  constructor(config: WebSocketConfig) {
    this.config = {
      autoReconnect: true,
      reconnectInterval: 5000,
      heartbeatInterval: 30000,
      ...config
    };
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
          reject(new RTAPError('WebSocket connection error', { cause: error instanceof Error ? error : undefined }));
        };

        this.socket.onclose = () => {
          this.handleClose();
        };
      } catch (error) {
        reject(new RTAPError('Failed to connect to WebSocket', { cause: error instanceof Error ? error : undefined }));
      }
    });
  }

  /**
   * Disconnect from the WebSocket server
   */
  public async disconnect(): Promise<void> {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
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
  public onAnnotation(handler: MessageHandler): void {
    this.annotationHandlers.push(handler);
  }

  private sendMessage(message: WebSocketMessage): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data) as WebSocketMessage;

      switch (message.type) {
        case 'annotation':
          if (message.annotation) {
            this.annotationHandlers.forEach(handler => handler(message.annotation!));
          }
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
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    this.heartbeatInterval = window.setInterval(() => {
      this.sendMessage({ type: 'ping' });
    }, this.config.heartbeatInterval);
  }
}
