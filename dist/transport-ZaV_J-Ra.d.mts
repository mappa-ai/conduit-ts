//#region src/errors.d.ts
declare const customInspect: unique symbol;
declare class ConduitError extends Error {
  name: string;
  requestId?: string;
  code?: string;
  constructor(message: string, opts?: {
    requestId?: string;
    code?: string;
    cause?: unknown;
  });
  toString(): string;
  [customInspect](): string;
}
declare class InitializationError extends ConduitError {
  name: string;
}
declare class UnsupportedRuntimeError extends ConduitError {
  name: string;
}
declare class WebhookVerificationError extends ConduitError {
  name: string;
}
declare class SourceError extends ConduitError {
  name: string;
  url?: string;
  status?: number;
  constructor(message: string, opts?: {
    requestId?: string;
    code?: string;
    cause?: unknown;
    url?: string;
    status?: number;
  });
}
declare class InvalidSourceError extends SourceError {
  name: string;
}
declare class RemoteFetchError extends SourceError {
  name: string;
}
declare class RemoteFetchTimeoutError extends RemoteFetchError {
  name: string;
}
declare class RemoteFetchTooLargeError extends RemoteFetchError {
  name: string;
}
declare class ApiError extends ConduitError {
  name: string;
  status: number;
  details?: unknown;
  constructor(message: string, opts: {
    status: number;
    requestId?: string;
    code?: string;
    details?: unknown;
  });
  toString(): string;
}
declare class RateLimitError extends ApiError {
  name: string;
  retryAfterMs?: number;
}
declare class AuthError extends ApiError {
  name: string;
}
declare class ValidationError extends ApiError {
  name: string;
}
declare class InsufficientCreditsError extends ApiError {
  name: string;
  required: number;
  available: number;
  constructor(message: string, opts: {
    status: number;
    requestId?: string;
    code?: string;
    details?: {
      required?: number;
      available?: number;
    };
  });
}
declare class JobFailedError extends ConduitError {
  name: string;
  jobId: string;
  constructor(jobId: string, message: string, opts?: {
    requestId?: string;
    code?: string;
    cause?: unknown;
  });
}
declare class JobCanceledError extends ConduitError {
  name: string;
  jobId: string;
  constructor(jobId: string, message: string, opts?: {
    requestId?: string;
    cause?: unknown;
    code?: string;
  });
}
declare class TimeoutError extends ConduitError {
  name: string;
}
declare class RequestAbortedError extends ConduitError {
  name: string;
}
declare class StreamError extends ConduitError {
  name: string;
  jobId?: string;
  lastEventId?: string;
  url?: string;
  retryCount: number;
  constructor(message: string, opts: {
    jobId?: string;
    lastEventId?: string;
    url?: string;
    retryCount: number;
    requestId?: string;
    cause?: unknown;
  });
}
//#endregion
//#region src/resources/transport.d.ts
type SSEStreamOptions = {
  signal?: AbortSignal;
  lastEventId?: string;
};
type SSEEvent<T = unknown> = {
  id?: string;
  event: string;
  data: T;
};
type Telemetry = {
  onRequest?: (ctx: {
    method: string;
    url: string;
    requestId?: string;
  }) => void;
  onResponse?: (ctx: {
    status: number;
    url: string;
    requestId?: string;
    durationMs: number;
  }) => void;
  onError?: (ctx: {
    url: string;
    requestId?: string;
    error: unknown;
    context?: Record<string, unknown>;
  }) => void;
};
type TransportOptions = {
  apiKey: string;
  authHeaderName?: string;
  baseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  defaultHeaders?: Record<string, string>;
  fetch?: typeof fetch;
  telemetry?: Telemetry;
  userAgent?: string;
};
type RequestOptions = {
  method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string | undefined>;
  body?: unknown;
  idempotencyKey?: string;
  requestId?: string;
  signal?: AbortSignal;
  retryable?: boolean;
};
type TransportResponse<T> = {
  data: T;
  status: number;
  requestId?: string;
  headers: Headers;
};
declare class Transport {
  private readonly opts;
  private readonly fetchImpl;
  constructor(opts: TransportOptions);
  private authHeaderName;
  get timeoutMs(): number;
  streamSSE<T>(path: string, opts?: SSEStreamOptions): AsyncGenerator<SSEEvent<T>>;
  private createSseHeaders;
  private openSseAttempt;
  private shouldRetrySseAttempt;
  private parseSSEStream;
  private parseSSEParts;
  private parseSSEEvent;
  request<T>(req: RequestOptions): Promise<TransportResponse<T>>;
  private createRequestHeaders;
  private requestAttempt;
  private parseResponseData;
}
//#endregion
export { StreamError as _, ConduitError as a, ValidationError as b, InvalidSourceError as c, RateLimitError as d, RemoteFetchError as f, SourceError as g, RequestAbortedError as h, AuthError as i, JobCanceledError as l, RemoteFetchTooLargeError as m, Transport as n, InitializationError as o, RemoteFetchTimeoutError as p, ApiError as r, InsufficientCreditsError as s, Telemetry as t, JobFailedError as u, TimeoutError as v, WebhookVerificationError as x, UnsupportedRuntimeError as y };
//# sourceMappingURL=transport-ZaV_J-Ra.d.mts.map