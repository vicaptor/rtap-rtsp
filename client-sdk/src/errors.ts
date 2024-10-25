interface ErrorOptions {
  cause?: Error;
}

export class RTAPError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message);
    this.name = 'RTAPError';
    this.cause = options?.cause;
  }
}
