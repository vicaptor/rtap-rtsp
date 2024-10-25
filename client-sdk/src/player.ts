import Hls from 'hls.js';
import { PlayerConfig, StreamOptions, StreamState } from './types';
import { RTAPError } from './errors';

export class MediaPlayer {
  private config: PlayerConfig;
  private videoElement?: HTMLVideoElement;
  private hls?: Hls;
  private state: StreamState = StreamState.IDLE;

  constructor(config: PlayerConfig) {
    this.config = config;
  }

  /**
   * Attach the player to a video element
   * @param element HTML video element
   */
  public async attach(element: HTMLVideoElement): Promise<void> {
    this.videoElement = element;
    
    if (Hls.isSupported()) {
      this.hls = new Hls(this.config.hlsConfig);
    } else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support
    } else {
      throw new RTAPError('HLS is not supported in this browser');
    }
  }

  /**
   * Load and start playing a stream
   * @param url Stream URL
   * @param options Stream options
   */
  public async loadStream(url: string, options?: StreamOptions): Promise<void> {
    if (!this.videoElement) {
      throw new RTAPError('Video element not attached');
    }

    try {
      if (this.hls) {
        this.hls.loadSource(url);
        this.hls.attachMedia(this.videoElement);
      } else {
        this.videoElement.src = url;
      }

      if (options?.autoplay) {
        await this.videoElement.play();
      }

      this.state = StreamState.PLAYING;
    } catch (error) {
      throw new RTAPError('Failed to load stream', { cause: error });
    }
  }

  /**
   * Stop the current stream
   */
  public async stop(): Promise<void> {
    if (this.hls) {
      this.hls.destroy();
    }
    if (this.videoElement) {
      this.videoElement.src = '';
    }
    this.state = StreamState.IDLE;
  }

  /**
   * Get the current stream state
   */
  public getState(): StreamState {
    return this.state;
  }

  /**
   * Get the video element
   */
  public getVideoElement(): HTMLVideoElement | undefined {
    return this.videoElement;
  }

  /**
   * Get the current time of the video
   */
  public getCurrentTime(): number {
    return this.videoElement?.currentTime || 0;
  }
}
