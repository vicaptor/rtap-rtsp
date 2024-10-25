import { MediaPlayer } from './player';
import { AnnotationManager } from './annotation';
import { WebSocketManager } from './websocket';
import { RTAPConfig, StreamOptions } from './types';
import { RTAPError } from './errors';

export class RTAPClient {
  private player: MediaPlayer;
  private annotationManager: AnnotationManager;
  private wsManager: WebSocketManager;

  constructor(config: RTAPConfig) {
    this.player = new MediaPlayer(config.playerConfig);
    this.annotationManager = new AnnotationManager(config.annotationConfig);
    this.wsManager = new WebSocketManager(config.wsConfig);

    // Connect annotation manager with WebSocket
    this.wsManager.onAnnotation((annotation) => {
      this.annotationManager.handleRemoteAnnotation(annotation);
    });
  }

  /**
   * Initialize the client with a video element
   * @param element HTML video element to attach the player to
   */
  public async initialize(element: HTMLVideoElement): Promise<void> {
    try {
      await this.player.attach(element);
      this.annotationManager.attachToPlayer(this.player);
      await this.wsManager.connect();
    } catch (error) {
      throw new RTAPError('Failed to initialize client', { cause: error });
    }
  }

  /**
   * Load and start playing a stream
   * @param streamUrl URL of the stream to play
   * @param options Stream options
   */
  public async loadStream(streamUrl: string, options?: StreamOptions): Promise<void> {
    try {
      await this.player.loadStream(streamUrl, options);
      await this.wsManager.subscribeToStream(streamUrl);
    } catch (error) {
      throw new RTAPError('Failed to load stream', { cause: error });
    }
  }

  /**
   * Stop the current stream and cleanup resources
   */
  public async stop(): Promise<void> {
    try {
      await this.player.stop();
      await this.wsManager.disconnect();
      this.annotationManager.clear();
    } catch (error) {
      throw new RTAPError('Failed to stop client', { cause: error });
    }
  }

  /**
   * Get the media player instance
   */
  public getPlayer(): MediaPlayer {
    return this.player;
  }

  /**
   * Get the annotation manager instance
   */
  public getAnnotationManager(): AnnotationManager {
    return this.annotationManager;
  }

  /**
   * Get the WebSocket manager instance
   */
  public getWebSocketManager(): WebSocketManager {
    return this.wsManager;
  }
}
