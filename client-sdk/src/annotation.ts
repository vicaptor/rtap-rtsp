import { MediaPlayer } from './player';
import { Annotation, AnnotationConfig, AnnotationType } from './types';
import { RTAPError } from './errors';

export class AnnotationManager {
  private config: AnnotationConfig;
  private player?: MediaPlayer;
  private canvas?: HTMLCanvasElement;
  private context?: CanvasRenderingContext2D;
  private annotations: Map<string, Annotation> = new Map();

  constructor(config: AnnotationConfig) {
    this.config = config;
  }

  /**
   * Attach the annotation manager to a media player
   * @param player MediaPlayer instance
   */
  public attachToPlayer(player: MediaPlayer): void {
    this.player = player;
    const videoElement = player.getVideoElement();
    
    if (!videoElement) {
      throw new RTAPError('Video element not found');
    }

    // Create canvas overlay
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.width = videoElement.clientWidth || 640; // Default width if not set
    this.canvas.height = videoElement.clientHeight || 480; // Default height if not set

    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new RTAPError('Failed to get canvas context');
    }
    this.context = context;

    // Add canvas to video container
    const container = videoElement.parentElement;
    if (!container) {
      throw new RTAPError('Video element must be in a container');
    }
    container.appendChild(this.canvas);

    // Handle resize
    window.addEventListener('resize', this.handleResize.bind(this));

    // Start render loop
    this.render();
  }

  /**
   * Add a new annotation
   * @param annotation Annotation object
   */
  public addAnnotation(annotation: Annotation): void {
    this.annotations.set(annotation.id, annotation);
  }

  /**
   * Remove an annotation
   * @param id Annotation ID
   */
  public removeAnnotation(id: string): void {
    this.annotations.delete(id);
  }

  /**
   * Handle an annotation from the WebSocket
   * @param annotation Annotation object
   */
  public handleRemoteAnnotation(annotation: Annotation): void {
    this.addAnnotation(annotation);
  }

  /**
   * Clear all annotations
   */
  public clear(): void {
    this.annotations.clear();
    if (this.context && this.canvas) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  /**
   * Get all current annotations
   */
  public getAnnotations(): Annotation[] {
    return Array.from(this.annotations.values());
  }

  private handleResize(): void {
    if (this.canvas && this.player?.getVideoElement()) {
      const video = this.player.getVideoElement();
      if (video) {
        this.canvas.width = video.clientWidth || 640;
        this.canvas.height = video.clientHeight || 480;
      }
    }
  }

  private render(): void {
    if (!this.context || !this.canvas) return;

    // Clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw annotations
    const currentTime = this.player?.getCurrentTime() || 0;
    
    for (const annotation of this.annotations.values()) {
      if (Math.abs(annotation.timestamp - currentTime) < this.config.annotationDuration) {
        this.drawAnnotation(annotation);
      }
    }

    // Continue render loop
    requestAnimationFrame(this.render.bind(this));
  }

  private drawAnnotation(annotation: Annotation): void {
    if (!this.context) return;

    this.context.save();

    switch (annotation.type) {
      case AnnotationType.MARKER:
        this.drawMarker(annotation);
        break;
      case AnnotationType.RECTANGLE:
        this.drawRectangle(annotation);
        break;
      case AnnotationType.POLYGON:
        this.drawPolygon(annotation);
        break;
      case AnnotationType.TEXT:
        this.drawText(annotation);
        break;
    }

    this.context.restore();
  }

  private drawMarker(annotation: Annotation): void {
    if (!this.context) return;

    const { x, y } = annotation.data;
    const radius = 5;

    this.context.beginPath();
    this.context.arc(x, y, radius, 0, Math.PI * 2);
    this.context.fillStyle = annotation.style?.color || '#ff0000';
    this.context.fill();
  }

  private drawRectangle(annotation: Annotation): void {
    if (!this.context) return;

    const { x, y, width, height } = annotation.data;

    this.context.strokeStyle = annotation.style?.color || '#ff0000';
    this.context.lineWidth = annotation.style?.lineWidth || 2;
    this.context.strokeRect(x, y, width, height);
  }

  private drawPolygon(annotation: Annotation): void {
    if (!this.context) return;

    const { points } = annotation.data;

    this.context.beginPath();
    this.context.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      this.context.lineTo(points[i].x, points[i].y);
    }

    this.context.closePath();
    this.context.strokeStyle = annotation.style?.color || '#ff0000';
    this.context.lineWidth = annotation.style?.lineWidth || 2;
    this.context.stroke();
  }

  private drawText(annotation: Annotation): void {
    if (!this.context) return;

    const { x, y, text } = annotation.data;

    this.context.font = annotation.style?.font || '16px Arial';
    this.context.fillStyle = annotation.style?.color || '#ff0000';
    this.context.fillText(text, x, y);
  }
}
