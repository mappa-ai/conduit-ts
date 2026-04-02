import { A as InitializationError, B as SourceError, C as url, D as ApiError, E as _coercedNumber, F as RateLimitError, G as WebhookVerificationError, H as TimeoutError, I as RemoteFetchError, L as RemoteFetchTimeoutError, M as InvalidSourceError, N as JobCanceledError, O as AuthError, P as JobFailedError, R as RemoteFetchTooLargeError, S as unknown, T as _coercedBoolean, U as UnsupportedRuntimeError, V as StreamError, W as ValidationError, _ as preprocess, a as materializeSource, b as tuple, c as ZodBoolean, d as array, f as boolean$1, g as object, h as number$1, i as DEFAULT_MAX_SOURCE_BYTES, j as InsufficientCreditsError, k as ConduitError, l as ZodNumber, m as literal, n as randomId, o as parseReq, p as discriminatedUnion, r as withDeadline, s as parseRes, t as Transport, u as _enum, v as record, w as datetime, x as union, y as string, z as RequestAbortedError } from "./transport-DPEQb-cP.mjs";

//#region ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/classic/compat.js
/** @deprecated Use the raw string literal codes instead, e.g. "invalid_type". */
const ZodIssueCode = {
	invalid_type: "invalid_type",
	too_big: "too_big",
	too_small: "too_small",
	invalid_format: "invalid_format",
	not_multiple_of: "not_multiple_of",
	unrecognized_keys: "unrecognized_keys",
	invalid_union: "invalid_union",
	invalid_key: "invalid_key",
	invalid_element: "invalid_element",
	invalid_value: "invalid_value",
	custom: "custom"
};
/** @deprecated Do not use. Stub definition, only included for zod-to-json-schema compatibility. */
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind) {})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));

//#endregion
//#region ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/classic/coerce.js
function number(params) {
	return _coercedNumber(ZodNumber, params);
}
function boolean(params) {
	return _coercedBoolean(ZodBoolean, params);
}

//#endregion
//#region ../contracts/src/v1/entities.ts
/**
* Entities module Zod schemas and types.
*
* Provides workspace-scoped labels for speaker entities.
* Labels allow workspaces to identify analyzed speakers with human-readable names.
*/
/**
* Label validation schema.
* - Max 64 characters
* - Trimmed whitespace
* - Free-form text (allows spaces, special characters)
*/
const label = string().trim().min(1, "Label must be at least 1 character").max(64, "Label must be at most 64 characters");
/**
* Query parameters for listing entities.
*/
const listEntitiesQuery = object({
	cursor: string().optional(),
	limit: number().min(1).max(100).default(20)
});
/**
* Request body for updating an entity (PATCH).
*/
const updateEntityBody = object({ label: label.nullable().optional() });
/**
* Single entity response with label and metadata.
*/
const entityResponse = object({
	createdAt: datetime(),
	id: string(),
	label: string().nullable(),
	lastSeenAt: datetime().nullable(),
	mediaCount: number$1()
});
/**
* Paginated list of entities response.
*/
const listEntitiesResponse = object({
	cursor: string().nullable(),
	entities: array(entityResponse),
	hasMore: boolean$1()
});

//#endregion
//#region src/resources/entities.ts
var EntitiesResource = class {
	transport;
	constructor(transport) {
		this.transport = transport;
	}
	async get(entityId, opts) {
		if (!entityId) throw new ConduitError("entityId must be a non-empty string", { code: "invalid_request" });
		return parseRes(entityResponse, (await this.transport.request({
			method: "GET",
			path: `/v1/entities/${encodeURIComponent(entityId)}`,
			requestId: opts?.requestId,
			retryable: true,
			signal: opts?.signal
		})).data, "entities.get");
	}
	async list(opts) {
		const query = parseReq(listEntitiesQuery, {
			cursor: opts?.cursor,
			limit: opts?.limit
		}, "entities.list query");
		return parseRes(listEntitiesResponse, (await this.transport.request({
			method: "GET",
			path: "/v1/entities",
			query: {
				limit: String(query.limit),
				...query.cursor ? { cursor: query.cursor } : {}
			},
			requestId: opts?.requestId,
			retryable: true,
			signal: opts?.signal
		})).data, "entities.list");
	}
	async *listAll(opts) {
		let cursor;
		let hasMore = true;
		while (hasMore) {
			const page = await this.list({
				...opts,
				cursor
			});
			for (const entity of page.entities) yield entity;
			cursor = page.cursor ?? void 0;
			hasMore = page.hasMore;
		}
	}
	async update(entityId, body, opts) {
		if (!entityId) throw new ConduitError("entityId must be a non-empty string", { code: "invalid_request" });
		const payload = parseReq(updateEntityBody, body, "entities.update body");
		return parseRes(entityResponse, (await this.transport.request({
			body: payload,
			method: "PATCH",
			path: `/v1/entities/${encodeURIComponent(entityId)}`,
			requestId: opts?.requestId,
			retryable: true,
			signal: opts?.signal
		})).data, "entities.update");
	}
};

//#endregion
//#region ../contracts/src/v1/reports.ts
const targetSelector$1 = object({
	entity_id: string().min(1).max(256).trim().nullish(),
	hint: string().min(1).max(1024).trim().nullish(),
	on_miss: _enum(["fallback_dominant", "error"]).default("error"),
	speaker_index: number$1().int().min(0).nullish(),
	strategy: _enum([
		"dominant",
		"timerange",
		"entity_id",
		"magic_hint",
		"speaker_index"
	]),
	timerange: object({
		end_seconds: number$1().min(0).nullish(),
		start_seconds: number$1().min(0).nullish()
	}).nullish()
}).refine((data) => {
	if (data.strategy === "entity_id" && !data.entity_id) return false;
	if (data.strategy === "magic_hint" && (!data.hint || data.hint.trim() === "")) return false;
	if (data.strategy === "speaker_index" && typeof data.speaker_index !== "number") return false;
	return true;
}, { message: "entity_id is required for entity_id strategy, hint is required for magic_hint strategy, speaker_index is required for speaker_index strategy" });
/**
* Available report templates.
* All templates analyze the same behavioral map (LayeredLenses) but apply
* different lenses optimized for specific use cases.
*/
const reportTemplates = _enum(["sales_playbook", "general_report"]);
const reportOutput = object({
	template: reportTemplates,
	templateParams: record(string(), unknown()).optional()
}).strict();
const webhookConfig$1 = object({
	headers: record(string(), string()).optional(),
	url: url()
}).optional();
const reportCreateJobBody = object({
	entityLabel: string().trim().min(1).max(64).optional(),
	idempotencyKey: string().optional(),
	label: string().trim().min(1).max(64).optional(),
	media: object({ mediaId: string() }),
	output: reportOutput,
	target: targetSelector$1,
	webhook: webhookConfig$1
});
const jobReceipt$1 = object({
	estimatedWaitSec: number$1().optional(),
	jobId: string(),
	stage: string().optional(),
	status: _enum(["queued", "running"])
});
const listStatus = _enum([
	"completed",
	"processing",
	"failed"
]);
const listDateRange = _enum([
	"all",
	"last_7_days",
	"last_30_days",
	"last_90_days"
]);
const listOutputFormat = _enum(["markdown", "json"]);
const listReportsQuery = object({
	dateRange: listDateRange.default("all"),
	entityId: string().optional(),
	limit: number().int().min(1).max(50).default(5),
	mediaId: string().optional(),
	page: number().int().min(1).default(1),
	search: string().trim().min(1).max(128).optional(),
	status: listStatus.optional(),
	workspaceId: string(),
	template: reportTemplates.optional()
});
const listReportItem = object({
	createdAt: datetime(),
	entity: object({
		id: string(),
		label: string().nullable()
	}).nullable(),
	id: string(),
	label: string().nullable(),
	output: object({ availableFormats: array(listOutputFormat) }),
	status: listStatus,
	template: reportTemplates
});
const listReportsResponse = object({
	items: array(listReportItem),
	pagination: object({
		limit: number$1().int().min(1),
		page: number$1().int().min(1),
		totalItems: number$1().int().min(0),
		totalPages: number$1().int().min(0)
	})
});
const reportViewQuery = object({ workspaceId: string() });
_enum([
	"dominating_traits",
	"how_they_think",
	"how_they_operate",
	"what_drives_them",
	"how_they_connect",
	"how_they_handle_feedback",
	"pressure_response",
	"how_to_get_their_best",
	"how_to_handle_the_hard_parts",
	"bottom_line",
	"what_drives_a_yes",
	"how_to_build_rapport_fast",
	"buying_tendencies",
	"how_they_handle_pushback_and_objections",
	"how_they_deal_when_a_deal_gets_sticky",
	"how_to_close",
	"how_to_follow_up"
]);
const reportJsonParagraphSectionKey = _enum([
	"how_they_think",
	"how_they_operate",
	"what_drives_them",
	"how_they_connect",
	"how_they_handle_feedback",
	"pressure_response",
	"bottom_line",
	"what_drives_a_yes",
	"how_to_build_rapport_fast",
	"buying_tendencies",
	"how_they_handle_pushback_and_objections",
	"how_they_deal_when_a_deal_gets_sticky"
]);
const reportJsonActionItem = object({
	context: string().min(1),
	title: string().min(1)
}).strict();
const reportJsonParagraphSection = object({
	body: string().min(1),
	key: reportJsonParagraphSectionKey,
	kind: literal("paragraph"),
	title: string().min(1)
}).strict();
const reportJsonTraitsSection = object({
	body: string().min(1),
	key: literal("dominating_traits"),
	kind: literal("traits"),
	phrases: tuple([
		string().min(1),
		string().min(1),
		string().min(1)
	]),
	title: string().min(1)
}).strict();
const reportJsonActionsSection = object({
	items: array(reportJsonActionItem).min(1),
	key: _enum([
		"how_to_get_their_best",
		"how_to_handle_the_hard_parts",
		"how_to_close",
		"how_to_follow_up"
	]),
	kind: literal("actions"),
	title: string().min(1)
}).strict();
const reportJsonSection = discriminatedUnion("kind", [
	reportJsonParagraphSection,
	reportJsonTraitsSection,
	reportJsonActionsSection
]);
const reportJson = object({
	meta: object({
		prompt: object({
			labels: array(string()),
			name: string().min(1),
			version: number$1().int().positive()
		}).strict(),
		render: object({
			attempts: number$1().int().positive(),
			model: string().min(1),
			provider: _enum(["openai", "anthropic"])
		}).strict()
	}).strict(),
	schemaVersion: literal(2),
	sections: array(reportJsonSection).min(1),
	summary: string().min(1),
	template: reportTemplates,
	title: string().min(1)
}).strict();
const cardContent = object({
	content: string(),
	icon: string(),
	title: string(),
	type: literal("card")
});
const textContent = object({
	content: string(),
	title: string().optional(),
	type: literal("text")
});
const gridContent = object({
	columns: union([
		literal(2),
		literal(3),
		literal(4)
	]),
	items: array(cardContent),
	type: literal("grid")
});
const illustrationContent = object({
	type: literal("illustration"),
	variant: _enum([
		"conversation",
		"growth",
		"connection",
		"analysis"
	])
});
const sectionContent = discriminatedUnion("type", [
	cardContent,
	textContent,
	gridContent,
	illustrationContent
]);
const reportSection = object({
	section_content: union([
		sectionContent,
		array(sectionContent),
		unknown()
	]),
	section_title: string()
});
const reportProvenance = object({
	baselineSampleIds: array(string()).min(1),
	behaviorMapId: string()
}).strict();
const reportResponse = object({
	createdAt: string(),
	entity: object({
		id: string(),
		label: string().nullable()
	}).strict().optional(),
	id: string(),
	json: reportJson.nullish(),
	jobId: string().optional(),
	label: string().optional(),
	markdown: string().nullish(),
	media: object({
		mediaId: string().optional(),
		url: string().optional()
	}).strict(),
	output: object({ template: _enum(["sales_playbook", "general_report"]) }).strict(),
	provenance: reportProvenance.optional()
}).strict();
const sharingStatus$1 = object({
	active: boolean$1(),
	shareUrl: url().nullable()
});
const toggleSharingBody$1 = object({
	active: boolean$1(),
	workspaceId: string()
});
const sharingQuery$1 = object({ workspaceId: string() });

//#endregion
//#region ../contracts/src/v1/files.ts
const retentionInfo = object({
	daysRemaining: number$1().int().nullable().describe("Days until expiry (null if locked or deleted)"),
	expiresAt: datetime().nullable().describe("When the file will expire (null if locked)"),
	locked: boolean$1().describe("Whether the file is locked from automatic deletion")
});
const retentionUpdateBody = object({ lock: boolean$1().describe("Set to true to lock, false to unlock") });
const retentionUpdateResponse = object({
	mediaId: string(),
	message: string(),
	retentionLock: boolean$1()
});
const mediaSource = _enum([
	"NOTETAKER",
	"MANUAL_UPLOAD",
	"PLAYGROUND",
	"SDK"
]);
const mediaProcessingStatus = _enum([
	"PENDING",
	"PROCESSING",
	"COMPLETED",
	"FAILED"
]);
const manualUploadReportTemplates = preprocess((val) => typeof val === "string" ? [val] : val, array(reportTemplates).min(1).max(2).refine((value) => new Set(value).size === value.length, { message: "Report templates must be unique" }));
const uploadResponse = object({
	contentType: string(),
	createdByApiKeyId: string().nullable(),
	createdByUserId: string(),
	createdAt: string(),
	durationSeconds: number$1().nullish(),
	label: string(),
	mediaId: string(),
	source: mediaSource,
	sizeBytes: number$1().int().nullish(),
	workspaceId: string()
});
const fileResponse = object({
	contentType: string(),
	createdByApiKeyId: string().nullable(),
	createdByUserId: string(),
	createdAt: datetime(),
	durationSeconds: number$1().nullish(),
	hasReports: boolean$1(),
	label: string(),
	lastUsedAt: datetime().nullable(),
	mediaId: string(),
	processingStatus: mediaProcessingStatus,
	retention: retentionInfo,
	source: mediaSource,
	sizeBytes: number$1().int().nullish(),
	workspaceId: string()
});
const listFilesQuery = object({
	createdAfter: datetime().optional(),
	createdByUserId: string().optional(),
	cursor: string().optional(),
	includeDeleted: boolean().default(false),
	limit: number().int().min(1).max(100).default(20),
	search: string().trim().min(1).max(200).optional()
});
const listFilesResponse = object({
	files: array(fileResponse),
	hasMore: boolean$1(),
	nextCursor: string().nullable()
});
const transcriptUtterance = object({
	endSeconds: number$1(),
	speakerIndex: number$1().int().nonnegative(),
	startSeconds: number$1(),
	text: string()
});
const mediaSpeaker = object({
	entityId: string().nullable(),
	entityLabel: string().nullable(),
	speakerIndex: number$1().int().nonnegative(),
	totalDurationSeconds: number$1().nonnegative(),
	utteranceCount: number$1().int().nonnegative()
});
const fileDetailResponse = fileResponse.extend({
	speakers: array(mediaSpeaker),
	transcription: object({
		durationSeconds: number$1().nonnegative(),
		speakerCount: number$1().int().nonnegative(),
		utterances: array(transcriptUtterance)
	})
});
const audioUrlResponse = object({ url: string().url() });
const audioMetadataWarningBody = object({
	metadataDurationSeconds: number$1().nonnegative(),
	transcriptDurationSeconds: number$1().nonnegative()
});
const audioMetadataWarningResponse = object({
	enqueuedRemediation: boolean$1(),
	mediaId: string(),
	severity: _enum(["minor", "major"])
});
const deleteResponse = object({
	deleted: literal(true),
	mediaId: string()
});
const goneError = object({
	deletedAt: datetime(),
	error: literal("gone"),
	message: string()
});
const notFoundError = object({ error: object({
	code: literal("not_found"),
	message: string()
}) });
const unsupportedMediaTypeError = object({ error: object({
	code: literal("unsupported_media_type"),
	message: string()
}) });

//#endregion
//#region src/resources/files.ts
const LABEL_SUFFIX_REGEX = /(\.[^.]+)+$/;
var FilesResource = class {
	transport;
	fetchImpl;
	timeoutMs;
	maxSourceBytes;
	constructor(transport, opts) {
		this.transport = transport;
		this.fetchImpl = opts?.fetchImpl ?? fetch;
		this.timeoutMs = opts?.timeoutMs ?? 3e5;
		this.maxSourceBytes = opts?.maxSourceBytes ?? 5368709120;
	}
	async upload(req) {
		if (typeof FormData === "undefined") throw new UnsupportedRuntimeError("FormData is not available in this runtime; cannot perform multipart upload", { code: "unsupported_runtime" });
		const { file, label: rawLabel } = await materializeSource(validateUploadSource(req), {
			fetchImpl: this.fetchImpl,
			maxSourceBytes: this.maxSourceBytes,
			signal: req.signal,
			timeoutMs: this.timeoutMs
		});
		const label = filesLabel(rawLabel);
		if (!label) throw new InvalidSourceError("label is required", { code: "invalid_source" });
		const form = new FormData();
		form.append("file", file, label);
		form.append("label", label);
		return parseRes(uploadResponse, (await this.transport.request({
			body: form,
			idempotencyKey: req.idempotencyKey,
			method: "POST",
			path: "/v1/files",
			requestId: req.requestId,
			retryable: true,
			signal: req.signal
		})).data, "files.upload");
	}
	async get(mediaId, opts) {
		if (!mediaId) throw new ConduitError("mediaId is required", { code: "invalid_request" });
		return parseRes(fileResponse, (await this.transport.request({
			method: "GET",
			path: `/v1/files/${encodeURIComponent(mediaId)}`,
			requestId: opts?.requestId,
			retryable: true,
			signal: opts?.signal
		})).data, "files.get");
	}
	async list(opts) {
		const query = parseReq(listFilesQuery, {
			cursor: opts?.cursor,
			includeDeleted: opts?.includeDeleted,
			limit: opts?.limit
		}, "files.list query");
		return parseRes(listFilesResponse, (await this.transport.request({
			method: "GET",
			path: "/v1/files",
			query: {
				limit: String(query.limit),
				...query.cursor ? { cursor: query.cursor } : {},
				includeDeleted: String(query.includeDeleted)
			},
			requestId: opts?.requestId,
			retryable: true,
			signal: opts?.signal
		})).data, "files.list");
	}
	async *listAll(opts) {
		let cursor;
		let hasMore = true;
		while (hasMore) {
			const page = await this.list({
				...opts,
				cursor
			});
			for (const file of page.files) yield file;
			cursor = page.nextCursor ?? void 0;
			hasMore = page.hasMore;
		}
	}
	async setRetentionLock(mediaId, locked, opts) {
		if (!mediaId) throw new ConduitError("mediaId is required", { code: "invalid_request" });
		return parseRes(retentionUpdateResponse, (await this.transport.request({
			body: { lock: locked },
			method: "PATCH",
			path: `/v1/files/${encodeURIComponent(mediaId)}/retention`,
			requestId: opts?.requestId,
			retryable: true,
			signal: opts?.signal
		})).data, "files.setRetentionLock");
	}
	async delete(mediaId, opts) {
		if (!mediaId) throw new ConduitError("mediaId is required", { code: "invalid_request" });
		return parseRes(deleteResponse, (await this.transport.request({
			idempotencyKey: opts?.idempotencyKey,
			method: "DELETE",
			path: `/v1/files/${encodeURIComponent(mediaId)}`,
			requestId: opts?.requestId,
			retryable: true,
			signal: opts?.signal
		})).data, "files.delete");
	}
};
function filesLabel(value) {
	const label = value.replace(LABEL_SUFFIX_REGEX, "").trim();
	if (label) return label;
	return "";
}
function validateUploadSource(req) {
	if ([
		"file",
		"url",
		"path"
	].filter((key) => key in req).length === 1) return req;
	throw new InvalidSourceError("upload() must include exactly one of file, url, or path", { code: "invalid_source" });
}

//#endregion
//#region ../contracts/src/v1/jobs.ts
const jobStatus = _enum([
	"queued",
	"running",
	"succeeded",
	"failed",
	"canceled"
]);
const jobStage = _enum([
	"uploaded",
	"queued",
	"transcoding",
	"extracting",
	"scoring",
	"rendering",
	"finalizing"
]);
const jobResponse = object({
	createdAt: string(),
	credits: object({
		reservationStatus: _enum([
			"active",
			"released",
			"applied"
		]).nullable(),
		reservedCredits: number$1().nullable()
	}).optional(),
	error: object({
		code: string(),
		details: unknown().optional(),
		message: string(),
		retryable: boolean$1().optional()
	}).optional(),
	id: string(),
	matchingId: string().optional(),
	progress: number$1().optional(),
	releasedCredits: number$1().nullable().optional(),
	reportId: string().optional(),
	stage: _enum([
		"uploaded",
		"queued",
		"transcoding",
		"extracting",
		"scoring",
		"rendering",
		"finalizing"
	]).optional(),
	status: _enum([
		"queued",
		"running",
		"succeeded",
		"failed",
		"canceled"
	]),
	type: _enum(["report.generate", "matching.generate"]),
	updatedAt: string(),
	usage: object({
		creditsDiscounted: number$1().optional(),
		creditsNetUsed: number$1(),
		creditsUsed: number$1(),
		durationMs: number$1().optional(),
		modelVersion: string().optional()
	}).optional()
});
const streamEventType = _enum([
	"status",
	"stage",
	"terminal",
	"heartbeat"
]);
/**
* Base SSE event structure with event ID for Last-Event-ID support.
*/
const baseStreamEvent = object({ id: string().describe("Monotonically increasing event ID for resumption") });
const statusStreamEvent = baseStreamEvent.extend({
	data: object({
		job: jobResponse,
		progress: number$1().optional(),
		stage: jobStage.optional(),
		status: jobStatus
	}),
	event: literal("status")
});
const stageStreamEvent = baseStreamEvent.extend({
	data: object({
		job: jobResponse,
		progress: number$1().optional(),
		stage: jobStage
	}),
	event: literal("stage")
});
const terminalStreamEvent = baseStreamEvent.extend({
	data: object({
		error: object({
			code: string(),
			message: string()
		}).optional(),
		job: jobResponse,
		matchingId: string().optional(),
		reportId: string().optional(),
		status: _enum([
			"succeeded",
			"failed",
			"canceled"
		])
	}),
	event: literal("terminal")
});
const heartbeatStreamEvent = baseStreamEvent.extend({
	data: object({ timestamp: string() }),
	event: literal("heartbeat")
});
const jobStreamEvent = discriminatedUnion("event", [
	statusStreamEvent,
	stageStreamEvent,
	terminalStreamEvent,
	heartbeatStreamEvent
]);
const streamQueryParams = object({ timeout: number().min(1e3).max(3e5).default(3e5).describe("Stream timeout in milliseconds (default: 300000, max: 300000)") });

//#endregion
//#region src/resources/jobs.ts
var JobsResource = class {
	transport;
	constructor(transport) {
		this.transport = transport;
	}
	async get(jobId, opts) {
		return parseRes(jobResponse, (await this.transport.request({
			method: "GET",
			path: `/v1/jobs/${encodeURIComponent(jobId)}`,
			requestId: opts?.requestId,
			retryable: true,
			signal: opts?.signal
		})).data, "jobs.get");
	}
	async cancel(jobId, opts) {
		return parseRes(jobResponse, (await this.transport.request({
			idempotencyKey: opts?.idempotencyKey,
			method: "POST",
			path: `/v1/jobs/${encodeURIComponent(jobId)}/cancel`,
			requestId: opts?.requestId,
			retryable: true,
			signal: opts?.signal
		})).data, "jobs.cancel");
	}
	async wait(jobId, opts) {
		const timeoutMs = opts?.timeoutMs ?? 3e5;
		const deadline = withDeadline(timeoutMs, {
			onTimeout: () => new TimeoutError(`Timed out waiting for job ${jobId} after ${timeoutMs}ms`, { code: "timeout" }),
			signal: opts?.signal
		});
		try {
			for await (const event of this.stream(jobId, {
				onEvent: opts?.onEvent,
				signal: deadline.signal
			})) {
				if (event.type !== "terminal") continue;
				const job = event.job;
				if (job.status === "succeeded") return job;
				if (job.status === "failed") throw new JobFailedError(jobId, job.error?.message ?? "Job failed", {
					cause: job.error,
					code: job.error?.code,
					requestId: job.requestId
				});
				if (job.status === "canceled") throw new JobCanceledError(jobId, "Job canceled", {
					cause: job.error,
					requestId: job.requestId
				});
			}
			throw new TimeoutError(`Timed out waiting for job ${jobId} after ${timeoutMs}ms`, { code: "timeout" });
		} finally {
			deadline.cleanup();
		}
	}
	async *stream(jobId, opts) {
		yield* this.streamWithRetry(jobId, opts);
	}
	async *streamWithRetry(jobId, opts) {
		const maxRetries = 3;
		let state = { retries: 0 };
		while (state.retries < maxRetries) {
			state = yield* this.runStreamAttempt(jobId, opts, state, maxRetries);
			if (state.retries < 0) return;
		}
		throw new StreamError(`Failed to get status for job ${jobId} after ${maxRetries} retries`, {
			jobId,
			lastEventId: state.lastEventId,
			retryCount: maxRetries
		});
	}
	async *runStreamAttempt(jobId, opts, state, maxRetries) {
		try {
			if (yield* this.streamAttempt(jobId, opts, state)) return {
				...state,
				retries: -1
			};
			const retries = state.retries + 1;
			if (retries < maxRetries) await this.backoff(retries);
			return {
				...state,
				retries
			};
		} catch (err) {
			if (opts?.signal?.aborted) throw err;
			const retries = state.retries + 1;
			if (retries >= maxRetries) throw new StreamError(`Stream connection failed for job ${jobId} after ${maxRetries} retries`, {
				cause: err,
				jobId,
				lastEventId: state.lastEventId,
				retryCount: retries
			});
			await this.backoff(retries);
			return {
				...state,
				retries
			};
		}
	}
	async *streamAttempt(jobId, opts, state) {
		const stream = this.transport.streamSSE(`/v1/jobs/${encodeURIComponent(jobId)}/stream`, {
			lastEventId: state.lastEventId,
			signal: opts?.signal
		});
		for await (const sse of stream) {
			state.lastEventId = sse.id;
			const handled = this.handleSseEvent(sse);
			if (!handled.event) {
				if (handled.terminal) return true;
				continue;
			}
			state.retries = 0;
			opts?.onEvent?.(handled.event);
			yield handled.event;
			if (handled.terminal) return true;
		}
		return false;
	}
	handleSseEvent(sse) {
		if (sse.event === "error") {
			const err = readSseError(sse.data);
			throw new ConduitError(err.message ?? "Unknown SSE error", { code: err.code });
		}
		if (sse.event === "heartbeat") return { terminal: false };
		const event = this.mapSSEToJobEvent(sse);
		if (!event) return { terminal: sse.event === "terminal" };
		return {
			event,
			terminal: sse.event === "terminal"
		};
	}
	mapSSEToJobEvent(sse) {
		const parsed = parseRes(jobStreamEvent, {
			data: sse.data,
			event: sse.event,
			id: sse.id ?? ""
		}, "jobs.stream event");
		if (parsed.event === "status") return {
			job: parsed.data.job,
			type: "status"
		};
		if (parsed.event === "stage") return {
			job: parsed.data.job,
			progress: parsed.data.progress,
			stage: parsed.data.stage,
			type: "stage"
		};
		if (parsed.event === "terminal") return {
			job: parsed.data.job,
			type: "terminal"
		};
		return null;
	}
	async backoff(attempt) {
		const base = Math.min(1e3 * 2 ** attempt, 1e4);
		const offset = base * .5 * Math.random();
		await new Promise((r) => setTimeout(r, base + offset));
	}
};
function readSseError(data) {
	if (!data || typeof data !== "object") return {};
	const err = data;
	return {
		code: typeof err.code === "string" ? err.code : void 0,
		message: typeof err.message === "string" ? err.message : void 0
	};
}

//#endregion
//#region ../contracts/src/v1/matching-analysis.ts
const targetSelector = targetSelector$1;
const matchingContext = literal("behavioral_compatibility");
const subjectRef = discriminatedUnion("type", [object({
	entityId: string().min(1).max(256).trim(),
	type: literal("entity_id")
}), object({
	mediaId: string().min(1).max(256).trim(),
	selector: targetSelector,
	type: literal("media_target")
})]);
const resolvedSubject = object({
	entityId: string().optional(),
	resolvedLabel: string().nullable().optional(),
	source: subjectRef
});
const requestSubjects = object({
	group: array(subjectRef).min(1),
	target: subjectRef
}).strict();
const resolvedSubjects = object({
	group: array(resolvedSubject).min(1),
	target: resolvedSubject
}).strict();
const output = object({ template: literal("matching") }).strict();
const webhookConfig = object({
	headers: record(string(), string()).optional(),
	url: url()
}).optional();
const createJobBody = requestSubjects.extend({
	context: matchingContext,
	idempotencyKey: string().optional(),
	label: string().trim().min(1).max(64).optional(),
	webhook: webhookConfig
}).superRefine((data, ctx) => {
	const directEntityIds = /* @__PURE__ */ new Set();
	const directRefs = [data.target, ...data.group];
	for (const [index, item] of directRefs.entries()) {
		if (item.type !== "entity_id") continue;
		if (directEntityIds.has(item.entityId)) {
			const path = index === 0 ? ["target"] : ["group", index - 1];
			ctx.addIssue({
				code: ZodIssueCode.custom,
				message: "target and group must reference different direct entity IDs",
				path
			});
			continue;
		}
		directEntityIds.add(item.entityId);
	}
});
const jobReceipt = object({
	estimatedWaitSec: number$1().optional(),
	jobId: string(),
	stage: string().optional(),
	status: _enum(["queued", "running"])
});
const matchingAnalysisJson = object({
	schemaVersion: literal(1),
	sections: array(reportSection).min(1),
	summary: string().min(1),
	title: string().min(1)
}).strict();
const matchingAnalysisResponse = object({
	context: matchingContext,
	createdAt: string(),
	group: array(resolvedSubject).min(1),
	id: string(),
	json: matchingAnalysisJson.nullish(),
	jobId: string().optional(),
	label: string().optional(),
	markdown: string().nullish(),
	output,
	target: resolvedSubject
}).strict();
const listQuery = object({
	entityId: string().optional(),
	limit: number().int().min(1).max(100).default(25),
	page: number().int().min(1).default(1),
	workspaceId: string()
});
const listItem = object({
	createdAt: string(),
	group: array(resolvedSubject).min(1),
	id: string(),
	jobId: string().optional(),
	label: string().optional(),
	target: resolvedSubject
});
const listResponse = object({
	items: array(listItem),
	pagination: object({
		limit: number$1().int().min(1),
		page: number$1().int().min(1),
		totalItems: number$1().int().min(0),
		totalPages: number$1().int().min(0)
	})
});
const sharingStatus = object({
	active: boolean$1(),
	shareUrl: url().nullable()
});
const toggleSharingBody = object({
	active: boolean$1(),
	workspaceId: string()
});
const sharingQuery = object({ workspaceId: string() });

//#endregion
//#region src/resources/matching-analysis.ts
var MatchingAnalysisResource = class {
	transport;
	jobs;
	constructor(transport, jobs) {
		this.transport = transport;
		this.jobs = jobs;
	}
	create(req) {
		return this.createJob(req);
	}
	async createJob(req) {
		validateMatchingRequest(req);
		const idempotencyKey = req.idempotencyKey ?? randomId("idem");
		const body = parseReq(createJobBody, this.normalizeBody(req), "matching.create body");
		const res = await this.transport.request({
			body,
			idempotencyKey,
			method: "POST",
			path: "/v1/matching/jobs",
			requestId: req.requestId,
			retryable: true,
			signal: req.signal
		});
		const receiptData = parseRes(jobReceipt, res.data, "matching.create");
		const receipt = {
			...receiptData,
			requestId: res.requestId ?? res.data.requestId,
			stage: toJobStage$1(receiptData.stage)
		};
		receipt.handle = this.makeHandle(receipt.jobId);
		return receipt;
	}
	async get(matchingId, opts) {
		return toMatchingAnalysis(parseRes(matchingAnalysisResponse, (await this.transport.request({
			method: "GET",
			path: `/v1/matching/${encodeURIComponent(matchingId)}`,
			requestId: opts?.requestId,
			retryable: true,
			signal: opts?.signal
		})).data, "matching.get"));
	}
	async getByJob(jobId, opts) {
		const res = await this.transport.request({
			method: "GET",
			path: `/v1/matching/by-job/${encodeURIComponent(jobId)}`,
			requestId: opts?.requestId,
			retryable: true,
			signal: opts?.signal
		});
		if (res.data === null) return null;
		return toMatchingAnalysis(parseRes(matchingAnalysisResponse, res.data, "matching.getByJob"));
	}
	async generate(req, opts) {
		const receipt = await this.createJob(req);
		if (!receipt.handle) throw new ConduitError("Job receipt is missing handle", { code: "invalid_response" });
		return receipt.handle.wait(opts?.wait);
	}
	makeHandle(jobId) {
		return {
			cancel: () => this.jobs.cancel(jobId),
			job: () => this.jobs.get(jobId),
			jobId,
			matching: () => this.getByJob(jobId),
			stream: (opts) => this.jobs.stream(jobId, opts),
			wait: async (opts) => {
				const matchingId = (await this.jobs.wait(jobId, opts)).matchingId;
				if (!matchingId) throw new ConduitError(`Job ${jobId} succeeded but no matching id was returned`, { code: "invalid_response" });
				return this.get(matchingId);
			}
		};
	}
	normalizeBody(req) {
		return {
			context: req.context,
			group: req.group.map((item) => this.normalizeEntitySource(item)),
			idempotencyKey: req.idempotencyKey,
			label: req.label,
			target: this.normalizeEntitySource(req.target),
			webhook: req.webhook
		};
	}
	normalizeEntitySource(source) {
		if (isEntitySource(source)) return {
			entityId: source.entityId,
			type: "entity_id"
		};
		return {
			mediaId: source.mediaId,
			selector: this.normalizeTarget(source.selector),
			type: "media_target"
		};
	}
	normalizeTarget(target) {
		if (target.strategy === "dominant") return {
			strategy: target.strategy,
			...target.onMiss ? { on_miss: target.onMiss } : {}
		};
		if (target.strategy === "timerange") return {
			strategy: target.strategy,
			...target.onMiss ? { on_miss: target.onMiss } : {},
			timerange: {
				end_seconds: target.timeRange?.endSeconds ?? null,
				start_seconds: target.timeRange?.startSeconds ?? null
			}
		};
		if (target.strategy === "entity_id") return {
			strategy: target.strategy,
			...target.onMiss ? { on_miss: target.onMiss } : {},
			entity_id: target.entityId
		};
		if (target.strategy === "speaker_index") return {
			strategy: target.strategy,
			...target.onMiss ? { on_miss: target.onMiss } : {},
			speaker_index: target.speakerIndex
		};
		return {
			strategy: target.strategy,
			...target.onMiss ? { on_miss: target.onMiss } : {},
			hint: target.hint
		};
	}
};
function validateMatchingRequest(req) {
	if (req.context !== "behavioral_compatibility") throw new ConduitError("context must be behavioral_compatibility", { code: "invalid_request" });
	if (req.group.length < 1) throw new ConduitError("group must include at least one subject", { code: "invalid_request" });
	const ids = /* @__PURE__ */ new Set();
	for (const item of [req.target, ...req.group]) {
		if (!isEntitySource(item)) {
			if (!item.mediaId.trim()) throw new ConduitError("mediaId is required", { code: "invalid_request" });
			validateTarget$1(item.selector);
			continue;
		}
		if (!item.entityId.trim()) throw new ConduitError("entityId is required", { code: "invalid_request" });
		if (ids.has(item.entityId)) throw new ConduitError("target and group must reference different direct entity IDs", { code: "invalid_request" });
		ids.add(item.entityId);
	}
}
function isEntitySource(source) {
	return "entityId" in source;
}
function toMatchingAnalysis(matching) {
	return {
		context: matching.context,
		createdAt: matching.createdAt,
		group: matching.group.map((subject) => ({
			entityId: subject.entityId,
			resolvedLabel: subject.resolvedLabel,
			source: toSubjectRef(subject.source)
		})),
		id: matching.id,
		jobId: matching.jobId,
		label: matching.label,
		output: {
			json: matching.json ?? null,
			markdown: matching.markdown ?? null
		},
		target: {
			entityId: matching.target.entityId,
			resolvedLabel: matching.target.resolvedLabel,
			source: toSubjectRef(matching.target.source)
		}
	};
}
function toSubjectRef(source) {
	if (source.type === "entity_id") return { entityId: source.entityId };
	return {
		mediaId: source.mediaId,
		selector: toTargetSelector(source.selector)
	};
}
function toTargetSelector(selector) {
	if (selector.strategy === "dominant") return {
		onMiss: selector.on_miss,
		strategy: "dominant"
	};
	if (selector.strategy === "timerange") return {
		onMiss: selector.on_miss,
		strategy: "timerange",
		timeRange: {
			endSeconds: selector.timerange?.end_seconds ?? void 0,
			startSeconds: selector.timerange?.start_seconds ?? void 0
		}
	};
	if (selector.strategy === "entity_id") return {
		entityId: selector.entity_id ?? "",
		onMiss: selector.on_miss,
		strategy: "entity_id"
	};
	if (selector.strategy === "speaker_index") return {
		onMiss: selector.on_miss,
		speakerIndex: selector.speaker_index ?? 0,
		strategy: "speaker_index"
	};
	return {
		hint: selector.hint ?? "",
		onMiss: selector.on_miss,
		strategy: "magic_hint"
	};
}
function validateTarget$1(target) {
	if (target.strategy === "timerange") {
		validateTimerangeTarget$1(target.timeRange);
		return;
	}
	if (target.strategy === "entity_id" && !target.entityId.trim()) throw new ConduitError("target.entityId is required for entity_id", { code: "invalid_request" });
	if (target.strategy === "speaker_index" && (!Number.isInteger(target.speakerIndex) || target.speakerIndex < 0)) throw new ConduitError("target.speakerIndex is required for speaker_index", { code: "invalid_request" });
	if (target.strategy === "magic_hint" && !target.hint.trim()) throw new ConduitError("target.hint is required for magic_hint", { code: "invalid_request" });
}
function validateTimerangeTarget$1(timeRange) {
	if (!timeRange) throw new ConduitError("target.timeRange is required for timerange", { code: "invalid_request" });
	const start = timeRange.startSeconds;
	const end = timeRange.endSeconds;
	if (start === void 0 && end === void 0) throw new ConduitError("target.timeRange must include startSeconds or endSeconds", { code: "invalid_request" });
	if (start !== void 0 && end !== void 0 && !(start < end)) throw new ConduitError("target.timeRange.startSeconds must be less than endSeconds", { code: "invalid_request" });
}
function toJobStage$1(stage) {
	if (!stage) return;
	if (stage === "uploaded" || stage === "queued" || stage === "transcoding" || stage === "extracting" || stage === "scoring" || stage === "rendering" || stage === "finalizing") return stage;
}

//#endregion
//#region src/resources/reports.ts
var ReportsResource = class {
	transport;
	jobs;
	files;
	constructor(transport, jobs, files) {
		this.transport = transport;
		this.jobs = jobs;
		this.files = files;
	}
	async create(req) {
		validateTarget(req.target);
		const mediaId = await this.resolveSource(req.source, {
			idempotencyKey: req.idempotencyKey,
			requestId: req.requestId,
			signal: req.signal
		});
		const idem = req.idempotencyKey ?? this.defaultIdempotencyKey();
		const body = parseReq(reportCreateJobBody, this.normalizeCreateRequest(req, mediaId), "reports.create body");
		const res = await this.transport.request({
			body,
			idempotencyKey: idem,
			method: "POST",
			path: "/v1/reports/jobs",
			requestId: req.requestId,
			retryable: true,
			signal: req.signal
		});
		const receiptData = parseRes(jobReceipt$1, res.data, "reports.createJob");
		const receipt = {
			...receiptData,
			mediaId,
			requestId: res.requestId ?? res.data.requestId,
			stage: toJobStage(receiptData.stage)
		};
		receipt.handle = this.handle(receipt.jobId);
		return receipt;
	}
	async get(reportId, opts) {
		return toReport(parseRes(reportResponse, (await this.transport.request({
			method: "GET",
			path: `/v1/reports/${encodeURIComponent(reportId)}`,
			requestId: opts?.requestId,
			retryable: true,
			signal: opts?.signal
		})).data, "reports.get"));
	}
	async getByJob(jobId, opts) {
		const res = await this.transport.request({
			method: "GET",
			path: `/v1/reports/by-job/${encodeURIComponent(jobId)}`,
			requestId: opts?.requestId,
			retryable: true,
			signal: opts?.signal
		});
		if (res.data === null) return null;
		return toReport(parseRes(reportResponse, res.data, "reports.getByJob"));
	}
	handle(jobId) {
		return {
			cancel: () => this.jobs.cancel(jobId),
			job: () => this.jobs.get(jobId),
			jobId,
			report: () => this.getByJob(jobId),
			stream: (opts) => this.jobs.stream(jobId, opts),
			wait: async (opts) => {
				const terminal = await this.jobs.wait(jobId, opts);
				if (!terminal.reportId) throw new ConduitError(`Job ${jobId} succeeded but no reportId was returned`, { code: "invalid_response" });
				return this.get(terminal.reportId);
			}
		};
	}
	defaultIdempotencyKey() {
		return randomId("idem");
	}
	async resolveSource(source, opts) {
		if ([
			"mediaId",
			"file",
			"url",
			"path"
		].filter((key) => key in source).length !== 1) throw new InvalidSourceError("source must include exactly one of mediaId, file, url, or path", { code: "invalid_source" });
		if ("mediaId" in source) {
			if (!source.mediaId) throw new InvalidSourceError("source.mediaId must be a non-empty string", { code: "invalid_source" });
			return source.mediaId;
		}
		if ("file" in source) return (await this.files.upload({
			file: source.file,
			idempotencyKey: opts.idempotencyKey,
			label: source.label,
			requestId: opts.requestId,
			signal: opts.signal
		})).mediaId;
		if ("path" in source) return (await this.files.upload({
			idempotencyKey: opts.idempotencyKey,
			label: source.label,
			path: source.path,
			requestId: opts.requestId,
			signal: opts.signal
		})).mediaId;
		return (await this.files.upload({
			idempotencyKey: opts.idempotencyKey,
			label: source.label,
			requestId: opts.requestId,
			signal: opts.signal,
			url: source.url
		})).mediaId;
	}
	normalizeCreateRequest(req, mediaId) {
		return {
			entityLabel: req.entityLabel,
			idempotencyKey: req.idempotencyKey,
			label: req.label,
			media: { mediaId },
			output: req.output,
			target: normalizeTarget(req.target),
			webhook: req.webhook
		};
	}
};
function normalizeTarget(target) {
	if (target.strategy === "dominant") return {
		strategy: target.strategy,
		...target.onMiss ? { on_miss: target.onMiss } : {}
	};
	if (target.strategy === "timerange") return {
		strategy: target.strategy,
		...target.onMiss ? { on_miss: target.onMiss } : {},
		timerange: {
			end_seconds: target.timeRange?.endSeconds ?? null,
			start_seconds: target.timeRange?.startSeconds ?? null
		}
	};
	if (target.strategy === "entity_id") return {
		strategy: target.strategy,
		...target.onMiss ? { on_miss: target.onMiss } : {},
		entity_id: target.entityId
	};
	if (target.strategy === "speaker_index") return {
		strategy: target.strategy,
		...target.onMiss ? { on_miss: target.onMiss } : {},
		speaker_index: target.speakerIndex
	};
	return {
		strategy: target.strategy,
		...target.onMiss ? { on_miss: target.onMiss } : {},
		hint: target.hint
	};
}
function validateTarget(target) {
	if (target.strategy === "timerange") {
		validateTimerangeTarget(target.timeRange);
		return;
	}
	if (target.strategy === "entity_id" && !target.entityId.trim()) throw new ConduitError("target.entityId is required for entity_id", { code: "invalid_request" });
	if (target.strategy === "speaker_index" && (!Number.isInteger(target.speakerIndex) || target.speakerIndex < 0)) throw new ConduitError("target.speakerIndex is required for speaker_index", { code: "invalid_request" });
	if (target.strategy === "magic_hint" && !target.hint.trim()) throw new ConduitError("target.hint is required for magic_hint", { code: "invalid_request" });
}
function validateTimerangeTarget(timeRange) {
	if (!timeRange) throw new ConduitError("target.timeRange is required for timerange", { code: "invalid_request" });
	const start = timeRange.startSeconds;
	const end = timeRange.endSeconds;
	if (start === void 0 && end === void 0) throw new ConduitError("target.timeRange must include startSeconds or endSeconds", { code: "invalid_request" });
	if (start !== void 0 && end !== void 0 && !(start < end)) throw new ConduitError("target.timeRange.startSeconds must be less than endSeconds", { code: "invalid_request" });
}
function toJobStage(stage) {
	if (!stage) return;
	if (stage === "uploaded" || stage === "queued" || stage === "transcoding" || stage === "extracting" || stage === "scoring" || stage === "rendering" || stage === "finalizing") return stage;
}
function toReport(report) {
	return {
		createdAt: report.createdAt,
		entityId: report.entity?.id,
		entityLabel: report.entity?.label,
		id: report.id,
		jobId: report.jobId,
		label: report.label,
		mediaId: report.media.mediaId,
		provenance: report.provenance,
		output: {
			json: report.json ?? null,
			markdown: report.markdown ?? null,
			template: report.output.template
		}
	};
}

//#endregion
//#region src/resources/webhooks.ts
function isObject(v) {
	return v !== null && typeof v === "object";
}
var WebhooksResource = class {
	async verifySignature(params) {
		const tolerance = params.toleranceSec ?? 300;
		const sigHeader = getHeader(params.headers, "conduit-signature");
		if (!sigHeader) throw new WebhookVerificationError("Missing conduit-signature header", { code: "webhook_signature_missing" });
		const sig = parseSignature(sigHeader);
		const ts = Number(sig.t);
		if (!Number.isFinite(ts)) throw new WebhookVerificationError("Invalid signature timestamp", { code: "webhook_signature_invalid" });
		const now = Math.floor(Date.now() / 1e3);
		if (Math.abs(now - ts) > tolerance) throw new WebhookVerificationError("Signature timestamp outside tolerance", { code: "webhook_signature_stale" });
		if (!timingSafeEqualHex(await hmacHex(params.secret, `${sig.t}.${params.payload}`), sig.v1)) throw new WebhookVerificationError("Invalid signature", { code: "webhook_signature_invalid" });
		return { ok: true };
	}
	parseEvent(payload) {
		let raw;
		try {
			raw = JSON.parse(payload);
		} catch (cause) {
			throw new ConduitError("Invalid webhook payload: invalid JSON", {
				cause,
				code: "invalid_webhook_payload"
			});
		}
		if (!isObject(raw)) throw new ConduitError("Invalid webhook payload: not an object", { code: "invalid_webhook_payload" });
		if (typeof raw.id !== "string") throw new ConduitError("Invalid webhook payload: id must be a string", { code: "invalid_webhook_payload" });
		if (typeof raw.type !== "string") throw new ConduitError("Invalid webhook payload: type must be a string", { code: "invalid_webhook_payload" });
		if (typeof raw.createdAt !== "string") throw new ConduitError("Invalid webhook payload: createdAt must be a string", { code: "invalid_webhook_payload" });
		if (!isIsoTimestamp(raw.createdAt)) throw new ConduitError("Invalid webhook payload: createdAt must be an ISO8601 string", { code: "invalid_webhook_payload" });
		if (typeof raw.timestamp !== "string") throw new ConduitError("Invalid webhook payload: timestamp must be a string", { code: "invalid_webhook_payload" });
		if (!isIsoTimestamp(raw.timestamp)) throw new ConduitError("Invalid webhook payload: timestamp must be an ISO8601 string", { code: "invalid_webhook_payload" });
		const data = "data" in raw ? raw.data : void 0;
		if (raw.type === "report.completed") return {
			createdAt: raw.createdAt,
			data: parseReportCompletedData(data),
			id: raw.id,
			timestamp: raw.timestamp,
			type: raw.type
		};
		if (raw.type === "report.failed") return {
			createdAt: raw.createdAt,
			data: parseReportFailedData(data),
			id: raw.id,
			timestamp: raw.timestamp,
			type: raw.type
		};
		if (raw.type === "matching.completed") return {
			createdAt: raw.createdAt,
			data: parseMatchingCompletedData(data),
			id: raw.id,
			timestamp: raw.timestamp,
			type: raw.type
		};
		if (raw.type === "matching.failed") return {
			createdAt: raw.createdAt,
			data: parseMatchingFailedData(data),
			id: raw.id,
			timestamp: raw.timestamp,
			type: raw.type
		};
		return {
			createdAt: raw.createdAt,
			data,
			id: raw.id,
			timestamp: raw.timestamp,
			type: raw.type
		};
	}
};
function parseReportCompletedData(data) {
	if (!isObject(data)) throw invalidPayloadError("Invalid report.completed data: not an object");
	if (typeof data.jobId !== "string") throw invalidPayloadError("Invalid report.completed data: jobId must be a string");
	if (typeof data.reportId !== "string") throw invalidPayloadError("Invalid report.completed data: reportId must be a string");
	if (data.status !== "succeeded") throw invalidPayloadError("Invalid report.completed data: status must be succeeded");
	return {
		jobId: data.jobId,
		reportId: data.reportId,
		status: data.status
	};
}
function parseReportFailedData(data) {
	if (!isObject(data)) throw invalidPayloadError("Invalid report.failed data: not an object");
	if (typeof data.jobId !== "string") throw invalidPayloadError("Invalid report.failed data: jobId must be a string");
	if (data.status !== "failed") throw invalidPayloadError("Invalid report.failed data: status must be failed");
	if (!isObject(data.error)) throw invalidPayloadError("Invalid report.failed data: error must be an object");
	if (typeof data.error.code !== "string") throw invalidPayloadError("Invalid report.failed data: error.code must be a string");
	if (typeof data.error.message !== "string") throw invalidPayloadError("Invalid report.failed data: error.message must be a string");
	return {
		error: {
			code: data.error.code,
			message: data.error.message
		},
		jobId: data.jobId,
		status: data.status
	};
}
function parseMatchingCompletedData(data) {
	if (!isObject(data)) throw invalidPayloadError("Invalid matching.completed data: not an object");
	if (typeof data.jobId !== "string") throw invalidPayloadError("Invalid matching.completed data: jobId must be a string");
	if (typeof data.matchingId !== "string") throw invalidPayloadError("Invalid matching.completed data: matchingId must be a string");
	if (data.status !== "succeeded") throw invalidPayloadError("Invalid matching.completed data: status must be succeeded");
	return {
		jobId: data.jobId,
		matchingId: data.matchingId,
		status: data.status
	};
}
function parseMatchingFailedData(data) {
	if (!isObject(data)) throw invalidPayloadError("Invalid matching.failed data: not an object");
	if (typeof data.jobId !== "string") throw invalidPayloadError("Invalid matching.failed data: jobId must be a string");
	if (data.status !== "failed") throw invalidPayloadError("Invalid matching.failed data: status must be failed");
	if (!isObject(data.error)) throw invalidPayloadError("Invalid matching.failed data: error must be an object");
	if (typeof data.error.code !== "string") throw invalidPayloadError("Invalid matching.failed data: error.code must be a string");
	if (typeof data.error.message !== "string") throw invalidPayloadError("Invalid matching.failed data: error.message must be a string");
	return {
		error: {
			code: data.error.code,
			message: data.error.message
		},
		jobId: data.jobId,
		status: data.status
	};
}
function invalidPayloadError(message) {
	return new ConduitError(message, { code: "invalid_webhook_payload" });
}
function isIsoTimestamp(value) {
	return !Number.isNaN(Date.parse(value));
}
function getHeader(headers, name) {
	const key = Object.keys(headers).find((k) => k.toLowerCase() === name.toLowerCase());
	if (!key) return;
	const value = headers[key];
	if (!value) return;
	if (Array.isArray(value)) return value[0];
	return value;
}
function parseSignature(value) {
	const out = {};
	for (const part of value.split(",")) {
		const [k, v] = part.split("=");
		if (!(k && v)) throw invalidSignatureError("Invalid signature format");
		const key = k.trim();
		if (key in out) throw invalidSignatureError("Invalid signature format: duplicate component");
		out[key] = v.trim();
	}
	if (!(out.t && out.v1)) throw invalidSignatureError("Invalid signature format");
	return {
		t: out.t,
		v1: out.v1
	};
}
function invalidSignatureError(message) {
	return new WebhookVerificationError(message, { code: "webhook_signature_invalid" });
}
async function hmacHex(secret, message) {
	const enc = new TextEncoder();
	const key = await crypto.subtle.importKey("raw", enc.encode(secret), {
		hash: "SHA-256",
		name: "HMAC"
	}, false, ["sign"]);
	const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
	const bytes = new Uint8Array(sig);
	let out = "";
	for (const b of bytes) out += b.toString(16).padStart(2, "0");
	return out;
}
function timingSafeEqualHex(a, b) {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return diff === 0;
}

//#endregion
//#region src/Conduit.ts
var Conduit = class {
	matching;
	reports;
	primitives;
	webhooks;
	/** Create a new client instance. */
	constructor(options) {
		if (!options.apiKey) throw new InitializationError("apiKey is required", { code: "config_error" });
		if (isBrowserRuntime() && !options.dangerouslyAllowBrowser) throw new InitializationError("Conduit SDK cannot run in browser environments by default because API keys are secret. Use a server/edge proxy or pass dangerouslyAllowBrowser: true only if you understand the risk.", { code: "unsupported_runtime" });
		const baseUrl = options.baseUrl ?? "https://api.mappa.ai";
		if (!isValidUrl(baseUrl)) throw new InitializationError("baseUrl must be a valid URL", { code: "config_error" });
		const timeoutMs = options.timeoutMs ?? 3e5;
		const maxRetries = options.maxRetries ?? 2;
		const maxSourceBytes = options.maxSourceBytes ?? 5368709120;
		const transport = new Transport({
			apiKey: options.apiKey,
			baseUrl,
			defaultHeaders: options.defaultHeaders,
			fetch: options.fetch,
			maxRetries,
			telemetry: options.telemetry,
			timeoutMs,
			userAgent: options.userAgent
		});
		const files = new FilesResource(transport, {
			fetchImpl: options.fetch,
			maxSourceBytes,
			timeoutMs
		});
		const jobs = new JobsResource(transport);
		const entities = new EntitiesResource(transport);
		const matching = new MatchingAnalysisResource(transport, jobs);
		this.matching = {
			create: matching.create.bind(matching),
			get: matching.get.bind(matching)
		};
		this.reports = new ReportsResource(transport, jobs, files);
		this.primitives = {
			entities: {
				get: entities.get.bind(entities),
				list: entities.list.bind(entities),
				update: entities.update.bind(entities)
			},
			jobs: {
				cancel: jobs.cancel.bind(jobs),
				get: jobs.get.bind(jobs)
			},
			media: {
				delete: files.delete.bind(files),
				get: files.get.bind(files),
				list: files.list.bind(files),
				setRetentionLock: files.setRetentionLock.bind(files),
				upload: files.upload.bind(files)
			}
		};
		this.webhooks = new WebhooksResource();
	}
};
function isBrowserRuntime() {
	if (typeof globalThis.window === "undefined") return false;
	if (typeof document === "undefined") return false;
	return true;
}
function isValidUrl(value) {
	try {
		new URL(value);
		return true;
	} catch {
		return false;
	}
}

//#endregion
//#region src/index.ts
function isConduitError(err) {
	return err instanceof ConduitError;
}
function isApiError(err) {
	return err instanceof ApiError;
}
function isAuthError(err) {
	return err instanceof AuthError;
}
function isInitializationError(err) {
	return err instanceof InitializationError;
}
function isInsufficientCreditsError(err) {
	return err instanceof InsufficientCreditsError;
}
function isInvalidSourceError(err) {
	return err instanceof InvalidSourceError;
}
function isJobCanceledError(err) {
	return err instanceof JobCanceledError;
}
function isJobFailedError(err) {
	return err instanceof JobFailedError;
}
function isRateLimitError(err) {
	return err instanceof RateLimitError;
}
function isRemoteFetchError(err) {
	return err instanceof RemoteFetchError;
}
function isRemoteFetchTimeoutError(err) {
	return err instanceof RemoteFetchTimeoutError;
}
function isRemoteFetchTooLargeError(err) {
	return err instanceof RemoteFetchTooLargeError;
}
function isRequestAbortedError(err) {
	return err instanceof RequestAbortedError;
}
function isSourceError(err) {
	return err instanceof SourceError;
}
function isStreamError(err) {
	return err instanceof StreamError;
}
function isTimeoutError(err) {
	return err instanceof TimeoutError;
}
function isUnsupportedRuntimeError(err) {
	return err instanceof UnsupportedRuntimeError;
}
function isValidationError(err) {
	return err instanceof ValidationError;
}
function isWebhookVerificationError(err) {
	return err instanceof WebhookVerificationError;
}

//#endregion
export { ApiError, AuthError, Conduit, ConduitError, InitializationError, InsufficientCreditsError, InvalidSourceError, JobCanceledError, JobFailedError, RateLimitError, RemoteFetchError, RemoteFetchTimeoutError, RemoteFetchTooLargeError, RequestAbortedError, SourceError, StreamError, TimeoutError, UnsupportedRuntimeError, ValidationError, WebhookVerificationError, isApiError, isAuthError, isConduitError, isInitializationError, isInsufficientCreditsError, isInvalidSourceError, isJobCanceledError, isJobFailedError, isRateLimitError, isRemoteFetchError, isRemoteFetchTimeoutError, isRemoteFetchTooLargeError, isRequestAbortedError, isSourceError, isStreamError, isTimeoutError, isUnsupportedRuntimeError, isValidationError, isWebhookVerificationError };
//# sourceMappingURL=index.mjs.map