import { _ as StreamError, a as ConduitError, b as ValidationError, c as InvalidSourceError, d as RateLimitError, f as RemoteFetchError, g as SourceError, h as RequestAbortedError, i as AuthError, l as JobCanceledError, m as RemoteFetchTooLargeError, n as Transport, o as InitializationError, p as RemoteFetchTimeoutError, r as ApiError, s as InsufficientCreditsError, t as Telemetry, u as JobFailedError, v as TimeoutError, x as WebhookVerificationError, y as UnsupportedRuntimeError } from "./transport-Bs9e6oSo.mjs";

//#region src/types.d.ts
type ReportTemplateId = "sales_playbook" | "general_report";
type ReportOutput = {
  template: ReportTemplateId;
  templateParams?: Record<string, unknown>;
};
type ReportJsonActionItem = {
  title: string;
  context: string;
};
type ReportJsonSection = {
  body: string;
  key: "how_they_think" | "how_they_operate" | "what_drives_them" | "how_they_connect" | "how_they_handle_feedback" | "pressure_response" | "bottom_line" | "what_drives_a_yes" | "how_to_build_rapport_fast" | "buying_tendencies" | "how_they_handle_pushback_and_objections" | "how_they_deal_when_a_deal_gets_sticky";
  kind: "paragraph";
  title: string;
} | {
  body: string;
  key: "dominating_traits";
  kind: "traits";
  phrases: [string, string, string];
  title: string;
} | {
  items: ReportJsonActionItem[];
  key: "how_to_get_their_best" | "how_to_handle_the_hard_parts" | "how_to_close" | "how_to_follow_up";
  kind: "actions";
  title: string;
};
type ReportJson = {
  meta: {
    prompt: {
      labels: string[];
      name: string;
      version: number;
    };
    render: {
      attempts: number;
      model: string;
      provider: "openai" | "anthropic";
    };
  };
  schemaVersion: 2;
  sections: ReportJsonSection[];
  summary: string;
  template: ReportTemplateId;
  title: string;
};
type TargetSelector = {
  strategy: "dominant";
  onMiss?: "fallback_dominant" | "error";
} | {
  strategy: "timerange";
  onMiss?: "fallback_dominant" | "error";
  timeRange?: {
    startSeconds?: number;
    endSeconds?: number;
  };
} | {
  strategy: "entity_id";
  onMiss?: "fallback_dominant" | "error";
  entityId: string;
} | {
  strategy: "speaker_index";
  onMiss?: "fallback_dominant" | "error";
  speakerIndex: number;
} | {
  strategy: "magic_hint";
  onMiss?: "fallback_dominant" | "error";
  hint: string;
};
type WebhookConfig = {
  url: string;
  headers?: Record<string, string>;
};
type ReportSource = {
  mediaId: string;
} | {
  file: Blob | ArrayBuffer | Uint8Array | ReadableStream<Uint8Array>;
  label?: string;
} | {
  url: string;
  label?: string;
} | {
  path: string;
  label?: string;
};
type MediaUploadRequest = {
  file: Blob | ArrayBuffer | Uint8Array | ReadableStream<Uint8Array>;
  label?: string;
  idempotencyKey?: string;
  requestId?: string;
  signal?: AbortSignal;
} | {
  url: string;
  label?: string;
  idempotencyKey?: string;
  requestId?: string;
  signal?: AbortSignal;
} | {
  path: string;
  label?: string;
  idempotencyKey?: string;
  requestId?: string;
  signal?: AbortSignal;
};
type ReportCreateRequest = {
  source: ReportSource;
  output: ReportOutput;
  target: TargetSelector;
  label?: string;
  entityLabel?: string;
  webhook?: WebhookConfig;
  idempotencyKey?: string;
  requestId?: string;
  signal?: AbortSignal;
};
type JobStage = "uploaded" | "queued" | "transcoding" | "extracting" | "scoring" | "rendering" | "finalizing";
type JobStatus = "queued" | "running" | "succeeded" | "failed" | "canceled";
type Usage = {
  creditsUsed: number;
  creditsDiscounted?: number;
  creditsNetUsed: number;
  durationMs?: number;
  modelVersion?: string;
};
type JobCreditReservation = {
  reservedCredits: number | null;
  reservationStatus: "active" | "released" | "applied" | null;
};
type Job = {
  id: string;
  type: "report.generate" | "matching.generate";
  status: JobStatus;
  stage?: JobStage;
  progress?: number;
  createdAt: string;
  updatedAt: string;
  reportId?: string;
  matchingId?: string;
  usage?: Usage;
  credits?: JobCreditReservation;
  releasedCredits?: number | null;
  error?: {
    code: string;
    message: string;
    details?: unknown;
    retryable?: boolean;
  };
  requestId?: string;
};
type JobEvent = {
  type: "status";
  job: Job;
} | {
  type: "stage";
  stage: JobStage;
  progress?: number;
  job: Job;
} | {
  type: "terminal";
  job: Job;
};
type WaitOptions = {
  timeoutMs?: number;
  onEvent?: (event: JobEvent) => void;
  signal?: AbortSignal;
};
type Report = {
  id: string;
  createdAt: string;
  jobId?: string;
  label?: string;
  mediaId?: string;
  entityId?: string;
  entityLabel?: string | null;
  provenance?: {
    behaviorMapId: string;
    baselineSampleIds: string[];
  };
  output: {
    template: ReportTemplateId;
    markdown?: string | null;
    json?: ReportJson | null;
    reportUrl?: string;
  };
};
type ReportForOutputType = Report;
type ReportRunHandle = {
  jobId: string;
  stream(opts?: {
    signal?: AbortSignal;
    onEvent?: (e: JobEvent) => void;
  }): AsyncIterable<JobEvent>;
  wait(opts?: WaitOptions): Promise<ReportForOutputType>;
  cancel(): Promise<Job>;
  job(): Promise<Job>;
  report(): Promise<ReportForOutputType | null>;
};
type MatchingSubjectRef = {
  entityId: string;
} | {
  mediaId: string;
  selector: TargetSelector;
};
type MatchingAnalysisEntitySource = MatchingSubjectRef;
type MatchingAnalysisResolvedSubject = {
  source: MatchingSubjectRef;
  entityId?: string;
  resolvedLabel?: string | null;
};
type MatchingAnalysisCreateJobRequest = {
  context: "hiring_team_fit";
  group: MatchingSubjectRef[];
  target: MatchingSubjectRef;
  label?: string;
  webhook?: WebhookConfig;
  idempotencyKey?: string;
  requestId?: string;
  signal?: AbortSignal;
};
type MatchingAnalysisJson = {
  schemaVersion: 1;
  sections: Array<{
    section_content: unknown;
    section_title: string;
  }>;
  summary: string;
  title: string;
};
type MatchingAnalysisResponse = {
  id: string;
  createdAt: string;
  jobId?: string;
  label?: string;
  context: "hiring_team_fit";
  target?: MatchingAnalysisResolvedSubject;
  group?: MatchingAnalysisResolvedSubject[];
  output: {
    markdown?: string | null;
    json?: MatchingAnalysisJson | null;
  };
};
type MatchingAnalysisForOutputType = MatchingAnalysisResponse;
type MatchingAnalysisRunHandle = {
  jobId: string;
  stream(opts?: {
    signal?: AbortSignal;
    onEvent?: (e: JobEvent) => void;
  }): AsyncIterable<JobEvent>;
  wait(opts?: WaitOptions): Promise<MatchingAnalysisForOutputType>;
  cancel(): Promise<Job>;
  job(): Promise<Job>;
  matching(): Promise<MatchingAnalysisForOutputType | null>;
};
type MatchingAnalysisJobReceipt = {
  jobId: string;
  status: "queued" | "running";
  stage?: JobStage;
  estimatedWaitSec?: number;
  requestId?: string;
  handle?: MatchingAnalysisRunHandle;
};
type ReportJobReceipt = {
  jobId: string;
  mediaId?: string;
  status: "queued" | "running";
  stage?: JobStage;
  estimatedWaitSec?: number;
  requestId?: string;
  handle?: ReportRunHandle;
};
type MediaObject = {
  mediaId: string;
  createdAt: string;
  contentType: string;
  label: string;
  sizeBytes?: number | null;
  durationSeconds?: number | null;
};
type MediaRetention = {
  expiresAt: string | null;
  daysRemaining: number | null;
  locked: boolean;
};
type MediaFile = {
  mediaId: string;
  createdAt: string;
  contentType: string;
  hasReports: boolean;
  label: string;
  sizeBytes?: number | null;
  durationSeconds?: number | null;
  processingStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  lastUsedAt: string | null;
  retention: MediaRetention;
};
type FileDeleteReceipt = {
  mediaId: string;
  deleted: true;
};
type RetentionLockResult = {
  mediaId: string;
  retentionLock: boolean;
  message: string;
};
type ListFilesResponse = {
  files: MediaFile[];
  nextCursor: string | null;
  hasMore: boolean;
};
type Entity = {
  id: string;
  label: string | null;
  createdAt: string;
  mediaCount: number;
  lastSeenAt: string | null;
};
type ListEntitiesResponse = {
  entities: Entity[];
  cursor: string | null;
  hasMore: boolean;
};
//#endregion
//#region src/resources/files.d.ts
type ListFilesOptions = {
  limit?: number;
  cursor?: string;
  includeDeleted?: boolean;
  requestId?: string;
  signal?: AbortSignal;
};
declare class FilesResource {
  private readonly transport;
  private readonly fetchImpl;
  private readonly timeoutMs;
  private readonly maxSourceBytes;
  constructor(transport: Transport, opts?: {
    fetchImpl?: typeof fetch;
    timeoutMs?: number;
    maxSourceBytes?: number;
  });
  upload(req: MediaUploadRequest): Promise<MediaObject>;
  get(mediaId: string, opts?: {
    requestId?: string;
    signal?: AbortSignal;
  }): Promise<MediaFile>;
  list(opts?: ListFilesOptions): Promise<ListFilesResponse>;
  listAll(opts?: Omit<ListFilesOptions, "cursor">): AsyncIterable<MediaFile>;
  setRetentionLock(mediaId: string, locked: boolean, opts?: {
    requestId?: string;
    signal?: AbortSignal;
  }): Promise<RetentionLockResult>;
  delete(mediaId: string, opts?: {
    idempotencyKey?: string;
    requestId?: string;
    signal?: AbortSignal;
  }): Promise<FileDeleteReceipt>;
}
//#endregion
//#region src/resources/jobs.d.ts
declare class JobsResource {
  private readonly transport;
  constructor(transport: Transport);
  get(jobId: string, opts?: {
    requestId?: string;
    signal?: AbortSignal;
  }): Promise<Job>;
  cancel(jobId: string, opts?: {
    idempotencyKey?: string;
    requestId?: string;
    signal?: AbortSignal;
  }): Promise<Job>;
  wait(jobId: string, opts?: WaitOptions): Promise<Job>;
  stream(jobId: string, opts?: {
    signal?: AbortSignal;
    onEvent?: (e: JobEvent) => void;
  }): AsyncIterable<JobEvent>;
  private streamWithRetry;
  private runStreamAttempt;
  private streamAttempt;
  private handleSseEvent;
  private mapSSEToJobEvent;
  private backoff;
}
//#endregion
//#region src/resources/reports.d.ts
declare class ReportsResource {
  private readonly transport;
  private readonly jobs;
  private readonly files;
  constructor(transport: Transport, jobs: JobsResource, files: FilesResource);
  create(req: ReportCreateRequest): Promise<ReportJobReceipt>;
  get(reportId: string, opts?: {
    requestId?: string;
    signal?: AbortSignal;
  }): Promise<Report>;
  private getByJob;
  private handle;
  private defaultIdempotencyKey;
  private resolveSource;
  private normalizeCreateRequest;
}
//#endregion
//#region src/resources/webhooks.d.ts
type WebhookEventType = "report.completed" | "report.failed" | "matching.completed" | "matching.failed";
type WebhookEvent<T = unknown> = {
  createdAt: string;
  data: T;
  id: string;
  timestamp: string;
  type: string;
};
type ReportCompletedData = {
  jobId: string;
  reportId: string;
  status: "succeeded";
};
type ReportFailedData = {
  error: {
    code: string;
    message: string;
  };
  jobId: string;
  status: "failed";
};
type MatchingCompletedData = {
  jobId: string;
  matchingId: string;
  status: "succeeded";
};
type MatchingFailedData = {
  error: {
    code: string;
    message: string;
  };
  jobId: string;
  status: "failed";
};
type ReportCompletedEvent = WebhookEvent<ReportCompletedData> & {
  type: "report.completed";
};
type ReportFailedEvent = WebhookEvent<ReportFailedData> & {
  type: "report.failed";
};
type MatchingCompletedEvent = WebhookEvent<MatchingCompletedData> & {
  type: "matching.completed";
};
type MatchingFailedEvent = WebhookEvent<MatchingFailedData> & {
  type: "matching.failed";
};
declare class WebhooksResource {
  verifySignature(params: {
    payload: string;
    headers: Record<string, string | string[] | undefined>;
    secret: string;
    toleranceSec?: number;
  }): Promise<{
    ok: true;
  }>;
  parseEvent(payload: string): ReportCompletedEvent | ReportFailedEvent | MatchingCompletedEvent | MatchingFailedEvent | WebhookEvent<unknown>;
  parseEvent<T = unknown>(payload: string): WebhookEvent<T>;
}
//#endregion
//#region src/Conduit.d.ts
type ConduitClientOptions = {
  /** API key used for Conduit authenticated requests. */apiKey: string; /** Base API URL. Defaults to https://api.mappa.ai. */
  baseUrl?: string; /** Per-request timeout in milliseconds. Defaults to 300000. */
  timeoutMs?: number; /** Number of retry attempts for retryable requests. Defaults to 2. */
  maxRetries?: number; /** Headers included on every request. */
  defaultHeaders?: Record<string, string>; /** Custom fetch implementation. */
  fetch?: typeof fetch; /** User-Agent header value sent on requests. */
  userAgent?: string; /** Request/response/error instrumentation hooks. */
  telemetry?: Telemetry; /** Maximum source size accepted for file/url/path uploads. Defaults to 5GB. */
  maxSourceBytes?: number;
  /**
   * Allow use from browser-like runtimes.
   *
   * This is unsafe for secret API keys and should only be used when
   * credentials are intentionally exposed.
   */
  dangerouslyAllowBrowser?: boolean;
};
type ConduitPrimitives = {
  entities: {
    get: (entityId: string, opts?: {
      requestId?: string;
      signal?: AbortSignal;
    }) => Promise<Entity>;
    list: (opts?: {
      limit?: number;
      cursor?: string;
      requestId?: string;
      signal?: AbortSignal;
    }) => Promise<ListEntitiesResponse>;
    update: (entityId: string, body: {
      label?: string | null;
    }, opts?: {
      requestId?: string;
      signal?: AbortSignal;
    }) => Promise<Entity>;
  };
  media: {
    upload: (req: MediaUploadRequest) => Promise<MediaObject>;
    get: (mediaId: string, opts?: {
      requestId?: string;
      signal?: AbortSignal;
    }) => Promise<MediaFile>;
    list: (opts?: {
      limit?: number;
      cursor?: string;
      includeDeleted?: boolean;
      requestId?: string;
      signal?: AbortSignal;
    }) => Promise<ListFilesResponse>;
    delete: (mediaId: string, opts?: {
      idempotencyKey?: string;
      requestId?: string;
      signal?: AbortSignal;
    }) => Promise<FileDeleteReceipt>;
    setRetentionLock: (mediaId: string, locked: boolean, opts?: {
      requestId?: string;
      signal?: AbortSignal;
    }) => Promise<RetentionLockResult>;
  };
  jobs: {
    get: (jobId: string, opts?: {
      requestId?: string;
      signal?: AbortSignal;
    }) => Promise<Job>;
    cancel: (jobId: string, opts?: {
      idempotencyKey?: string;
      requestId?: string;
      signal?: AbortSignal;
    }) => Promise<Job>;
  };
};
declare class Conduit {
  readonly matching: {
    create: (req: MatchingAnalysisCreateJobRequest) => Promise<MatchingAnalysisJobReceipt>;
    get: (matchingId: string, opts?: {
      requestId?: string;
      signal?: AbortSignal;
    }) => Promise<MatchingAnalysisResponse>;
  };
  readonly reports: ReportsResource;
  readonly primitives: ConduitPrimitives;
  readonly webhooks: WebhooksResource;
  /** Create a new client instance. */
  constructor(options: ConduitClientOptions);
}
//#endregion
//#region src/index.d.ts
declare function isConduitError(err: unknown): err is ConduitError;
declare function isApiError(err: unknown): err is ApiError;
declare function isAuthError(err: unknown): err is AuthError;
declare function isInitializationError(err: unknown): err is InitializationError;
declare function isInsufficientCreditsError(err: unknown): err is InsufficientCreditsError;
declare function isInvalidSourceError(err: unknown): err is InvalidSourceError;
declare function isJobCanceledError(err: unknown): err is JobCanceledError;
declare function isJobFailedError(err: unknown): err is JobFailedError;
declare function isRateLimitError(err: unknown): err is RateLimitError;
declare function isRemoteFetchError(err: unknown): err is RemoteFetchError;
declare function isRemoteFetchTimeoutError(err: unknown): err is RemoteFetchTimeoutError;
declare function isRemoteFetchTooLargeError(err: unknown): err is RemoteFetchTooLargeError;
declare function isRequestAbortedError(err: unknown): err is RequestAbortedError;
declare function isSourceError(err: unknown): err is SourceError;
declare function isStreamError(err: unknown): err is StreamError;
declare function isTimeoutError(err: unknown): err is TimeoutError;
declare function isUnsupportedRuntimeError(err: unknown): err is UnsupportedRuntimeError;
declare function isValidationError(err: unknown): err is ValidationError;
declare function isWebhookVerificationError(err: unknown): err is WebhookVerificationError;
//#endregion
export { ApiError, AuthError, Conduit, ConduitError, InitializationError, InsufficientCreditsError, InvalidSourceError, type Job, JobCanceledError, type JobEvent, JobFailedError, type JobStage, type JobStatus, type MatchingAnalysisCreateJobRequest, type MatchingAnalysisEntitySource, type MatchingAnalysisJobReceipt, type MatchingAnalysisResponse, type MatchingAnalysisRunHandle, type MatchingCompletedData, type MatchingCompletedEvent, type MatchingFailedData, type MatchingFailedEvent, type MatchingSubjectRef, type MediaUploadRequest, RateLimitError, RemoteFetchError, RemoteFetchTimeoutError, RemoteFetchTooLargeError, type Report, type ReportCompletedData, type ReportCompletedEvent, type ReportCreateRequest, type ReportFailedData, type ReportFailedEvent, type ReportJobReceipt, type ReportOutput, type ReportRunHandle, type ReportSource, RequestAbortedError, SourceError, StreamError, type TargetSelector, TimeoutError, UnsupportedRuntimeError, ValidationError, type WebhookConfig, type WebhookEvent, type WebhookEventType, WebhookVerificationError, isApiError, isAuthError, isConduitError, isInitializationError, isInsufficientCreditsError, isInvalidSourceError, isJobCanceledError, isJobFailedError, isRateLimitError, isRemoteFetchError, isRemoteFetchTimeoutError, isRemoteFetchTooLargeError, isRequestAbortedError, isSourceError, isStreamError, isTimeoutError, isUnsupportedRuntimeError, isValidationError, isWebhookVerificationError };
//# sourceMappingURL=index.d.mts.map