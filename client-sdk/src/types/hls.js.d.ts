declare module 'hls.js' {
  export interface HlsConfig {
    debug?: boolean;
    autoStartLoad?: boolean;
    startPosition?: number;
    defaultAudioCodec?: string;
    initialLiveManifestSize?: number;
    maxBufferLength?: number;
    maxMaxBufferLength?: number;
    maxBufferSize?: number;
    maxBufferHole?: number;
    lowBufferWatchdogPeriod?: number;
    highBufferWatchdogPeriod?: number;
    nudgeOffset?: number;
    nudgeMaxRetry?: number;
    maxFragLookUpTolerance?: number;
    liveSyncDurationCount?: number;
    liveMaxLatencyDurationCount?: number;
    liveSyncDuration?: number;
    liveMaxLatencyDuration?: number;
    maxLiveSyncPlaybackRate?: number;
    [key: string]: any;
  }

  export default class Hls {
    static isSupported(): boolean;
    
    constructor(config?: HlsConfig);
    
    loadSource(url: string): void;
    attachMedia(element: HTMLMediaElement): void;
    destroy(): void;
  }
}
