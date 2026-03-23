Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
const require_transport = require('./transport-CgAHMI43.cjs');

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
	return require_transport._coercedNumber(require_transport.ZodNumber, params);
}
function boolean(params) {
	return require_transport._coercedBoolean(require_transport.ZodBoolean, params);
}

//#endregion
//#region ../contracts/dist/v1/entities.mjs
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
const label = require_transport.string().trim().min(1, "Label must be at least 1 character").max(64, "Label must be at most 64 characters");
/**
* Query parameters for listing entities.
*/
const listEntitiesQuery = require_transport.object({
	cursor: require_transport.string().optional(),
	limit: number().min(1).max(100).default(20)
});
/**
* Request body for updating an entity (PATCH).
*/
const updateEntityBody = require_transport.object({ label: label.nullable().optional() });
/**
* Single entity response with label and metadata.
*/
const entityResponse = require_transport.object({
	createdAt: require_transport.datetime(),
	id: require_transport.string(),
	label: require_transport.string().nullable(),
	lastSeenAt: require_transport.datetime().nullable(),
	mediaCount: require_transport.number()
});
/**
* Paginated list of entities response.
*/
const listEntitiesResponse = require_transport.object({
	cursor: require_transport.string().nullable(),
	entities: require_transport.array(entityResponse),
	hasMore: require_transport.boolean()
});

//#endregion
//#region src/resources/entities.ts
var EntitiesResource = class {
	transport;
	constructor(transport) {
		this.transport = transport;
	}
	async get(entityId, opts) {
		if (!entityId) throw new require_transport.ConduitError("entityId must be a non-empty string", { code: "invalid_request" });
		return require_transport.parseRes(entityResponse, (await this.transport.request({
			method: "GET",
			path: `/v1/entities/${encodeURIComponent(entityId)}`,
			requestId: opts?.requestId,
			retryable: true,
			signal: opts?.signal
		})).data, "entities.get");
	}
	async list(opts) {
		const query = require_transport.parseReq(listEntitiesQuery, {
			cursor: opts?.cursor,
			limit: opts?.limit
		}, "entities.list query");
		return require_transport.parseRes(listEntitiesResponse, (await this.transport.request({
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
		if (!entityId) throw new require_transport.ConduitError("entityId must be a non-empty string", { code: "invalid_request" });
		const payload = require_transport.parseReq(updateEntityBody, body, "entities.update body");
		return require_transport.parseRes(entityResponse, (await this.transport.request({
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
//#region ../contracts/dist/v1/reports.mjs
const targetSelector$1 = require_transport.object({
	entity_id: require_transport.string().min(1).max(256).trim().nullish(),
	hint: require_transport.string().min(1).max(1024).trim().nullish(),
	on_miss: require_transport._enum(["fallback_dominant", "error"]).default("error"),
	speaker_index: require_transport.number().int().min(0).nullish(),
	strategy: require_transport._enum([
		"dominant",
		"timerange",
		"entity_id",
		"magic_hint",
		"speaker_index"
	]),
	timerange: require_transport.object({
		end_seconds: require_transport.number().min(0).nullish(),
		start_seconds: require_transport.number().min(0).nullish()
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
const reportTemplates = require_transport._enum(["sales_playbook", "general_report"]);
const reportOutput = require_transport.object({
	template: reportTemplates,
	templateParams: require_transport.record(require_transport.string(), require_transport.unknown()).optional()
}).strict();
const webhookConfig$1 = require_transport.object({
	headers: require_transport.record(require_transport.string(), require_transport.string()).optional(),
	url: require_transport.url()
}).optional();
const reportCreateJobBody = require_transport.object({
	entityLabel: require_transport.string().trim().min(1).max(64).optional(),
	idempotencyKey: require_transport.string().optional(),
	label: require_transport.string().trim().min(1).max(64).optional(),
	media: require_transport.object({ mediaId: require_transport.string() }),
	output: reportOutput,
	target: targetSelector$1,
	webhook: webhookConfig$1
});
const jobReceipt$1 = require_transport.object({
	estimatedWaitSec: require_transport.number().optional(),
	jobId: require_transport.string(),
	stage: require_transport.string().optional(),
	status: require_transport._enum(["queued", "running"])
});
const listStatus = require_transport._enum([
	"completed",
	"processing",
	"failed"
]);
const listDateRange = require_transport._enum([
	"all",
	"last_7_days",
	"last_30_days",
	"last_90_days"
]);
const listOutputFormat = require_transport._enum(["markdown", "json"]);
const listReportsQuery = require_transport.object({
	dateRange: listDateRange.default("all"),
	entityId: require_transport.string().optional(),
	limit: number().int().min(1).max(50).default(5),
	mediaId: require_transport.string().optional(),
	page: number().int().min(1).default(1),
	search: require_transport.string().trim().min(1).max(128).optional(),
	status: listStatus.optional(),
	workspaceId: require_transport.string(),
	template: reportTemplates.optional()
});
const listReportItem = require_transport.object({
	createdAt: require_transport.datetime(),
	entity: require_transport.object({
		id: require_transport.string(),
		label: require_transport.string().nullable()
	}).nullable(),
	id: require_transport.string(),
	label: require_transport.string().nullable(),
	output: require_transport.object({ availableFormats: require_transport.array(listOutputFormat) }),
	status: listStatus,
	template: reportTemplates
});
const listReportsResponse = require_transport.object({
	items: require_transport.array(listReportItem),
	pagination: require_transport.object({
		limit: require_transport.number().int().min(1),
		page: require_transport.number().int().min(1),
		totalItems: require_transport.number().int().min(0),
		totalPages: require_transport.number().int().min(0)
	})
});
const reportViewQuery = require_transport.object({ workspaceId: require_transport.string() });
require_transport._enum([
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
const reportJsonParagraphSectionKey = require_transport._enum([
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
const reportJsonActionItem = require_transport.object({
	context: require_transport.string().min(1),
	title: require_transport.string().min(1)
}).strict();
const reportJsonParagraphSection = require_transport.object({
	body: require_transport.string().min(1),
	key: reportJsonParagraphSectionKey,
	kind: require_transport.literal("paragraph"),
	title: require_transport.string().min(1)
}).strict();
const reportJsonTraitsSection = require_transport.object({
	body: require_transport.string().min(1),
	key: require_transport.literal("dominating_traits"),
	kind: require_transport.literal("traits"),
	phrases: require_transport.tuple([
		require_transport.string().min(1),
		require_transport.string().min(1),
		require_transport.string().min(1)
	]),
	title: require_transport.string().min(1)
}).strict();
const reportJsonActionsSection = require_transport.object({
	items: require_transport.array(reportJsonActionItem).min(1),
	key: require_transport._enum([
		"how_to_get_their_best",
		"how_to_handle_the_hard_parts",
		"how_to_close",
		"how_to_follow_up"
	]),
	kind: require_transport.literal("actions"),
	title: require_transport.string().min(1)
}).strict();
const reportJsonSection = require_transport.discriminatedUnion("kind", [
	reportJsonParagraphSection,
	reportJsonTraitsSection,
	reportJsonActionsSection
]);
const reportJson = require_transport.object({
	meta: require_transport.object({
		prompt: require_transport.object({
			labels: require_transport.array(require_transport.string()),
			name: require_transport.string().min(1),
			version: require_transport.number().int().positive()
		}).strict(),
		render: require_transport.object({
			attempts: require_transport.number().int().positive(),
			model: require_transport.string().min(1),
			provider: require_transport._enum(["openai", "anthropic"])
		}).strict()
	}).strict(),
	schemaVersion: require_transport.literal(2),
	sections: require_transport.array(reportJsonSection).min(1),
	summary: require_transport.string().min(1),
	template: reportTemplates,
	title: require_transport.string().min(1)
}).strict();
const cardContent = require_transport.object({
	content: require_transport.string(),
	icon: require_transport.string(),
	title: require_transport.string(),
	type: require_transport.literal("card")
});
const textContent = require_transport.object({
	content: require_transport.string(),
	title: require_transport.string().optional(),
	type: require_transport.literal("text")
});
const gridContent = require_transport.object({
	columns: require_transport.union([
		require_transport.literal(2),
		require_transport.literal(3),
		require_transport.literal(4)
	]),
	items: require_transport.array(cardContent),
	type: require_transport.literal("grid")
});
const illustrationContent = require_transport.object({
	type: require_transport.literal("illustration"),
	variant: require_transport._enum([
		"conversation",
		"growth",
		"connection",
		"analysis"
	])
});
const sectionContent = require_transport.discriminatedUnion("type", [
	cardContent,
	textContent,
	gridContent,
	illustrationContent
]);
const reportSection = require_transport.object({
	section_content: require_transport.union([
		sectionContent,
		require_transport.array(sectionContent),
		require_transport.unknown()
	]),
	section_title: require_transport.string()
});
const reportProvenance = require_transport.object({
	baselineSampleIds: require_transport.array(require_transport.string()).min(1),
	behaviorMapId: require_transport.string()
}).strict();
const reportResponse = require_transport.object({
	createdAt: require_transport.string(),
	entity: require_transport.object({
		id: require_transport.string(),
		label: require_transport.string().nullable()
	}).strict().optional(),
	id: require_transport.string(),
	json: reportJson.nullish(),
	jobId: require_transport.string().optional(),
	label: require_transport.string().optional(),
	markdown: require_transport.string().nullish(),
	media: require_transport.object({
		mediaId: require_transport.string().optional(),
		url: require_transport.string().optional()
	}).strict(),
	output: require_transport.object({ template: require_transport._enum(["sales_playbook", "general_report"]) }).strict(),
	provenance: reportProvenance.optional()
}).strict();
const sharingStatus$1 = require_transport.object({
	active: require_transport.boolean(),
	shareUrl: require_transport.url().nullable()
});
const toggleSharingBody$1 = require_transport.object({
	active: require_transport.boolean(),
	workspaceId: require_transport.string()
});
const sharingQuery$1 = require_transport.object({ workspaceId: require_transport.string() });

//#endregion
//#region ../contracts/dist/v1/files.mjs
const retentionInfo = require_transport.object({
	daysRemaining: require_transport.number().int().nullable().describe("Days until expiry (null if locked or deleted)"),
	expiresAt: require_transport.datetime().nullable().describe("When the file will expire (null if locked)"),
	locked: require_transport.boolean().describe("Whether the file is locked from automatic deletion")
});
const retentionUpdateBody = require_transport.object({ lock: require_transport.boolean().describe("Set to true to lock, false to unlock") });
const retentionUpdateResponse = require_transport.object({
	mediaId: require_transport.string(),
	message: require_transport.string(),
	retentionLock: require_transport.boolean()
});
const mediaSource = require_transport._enum([
	"NOTETAKER",
	"MANUAL_UPLOAD",
	"PLAYGROUND",
	"SDK"
]);
const mediaProcessingStatus = require_transport._enum([
	"PENDING",
	"PROCESSING",
	"COMPLETED",
	"FAILED"
]);
const manualUploadReportTemplates = require_transport.array(reportTemplates).min(1).max(2).refine((value) => new Set(value).size === value.length, { message: "Report templates must be unique" });
const uploadResponse = require_transport.object({
	contentType: require_transport.string(),
	createdByApiKeyId: require_transport.string().nullable(),
	createdByUserId: require_transport.string(),
	createdAt: require_transport.string(),
	durationSeconds: require_transport.number().nullish(),
	label: require_transport.string(),
	mediaId: require_transport.string(),
	source: mediaSource,
	sizeBytes: require_transport.number().int().nullish(),
	workspaceId: require_transport.string()
});
const fileResponse = require_transport.object({
	contentType: require_transport.string(),
	createdByApiKeyId: require_transport.string().nullable(),
	createdByUserId: require_transport.string(),
	createdAt: require_transport.datetime(),
	durationSeconds: require_transport.number().nullish(),
	hasReports: require_transport.boolean(),
	label: require_transport.string(),
	lastUsedAt: require_transport.datetime().nullable(),
	mediaId: require_transport.string(),
	processingStatus: mediaProcessingStatus,
	retention: retentionInfo,
	source: mediaSource,
	sizeBytes: require_transport.number().int().nullish(),
	workspaceId: require_transport.string()
});
const listFilesQuery = require_transport.object({
	createdAfter: require_transport.datetime().optional(),
	createdByUserId: require_transport.string().optional(),
	cursor: require_transport.string().optional(),
	includeDeleted: boolean().default(false),
	limit: number().int().min(1).max(100).default(20),
	search: require_transport.string().trim().min(1).max(200).optional()
});
const listFilesResponse = require_transport.object({
	files: require_transport.array(fileResponse),
	hasMore: require_transport.boolean(),
	nextCursor: require_transport.string().nullable()
});
const transcriptUtterance = require_transport.object({
	endSeconds: require_transport.number(),
	speakerIndex: require_transport.number().int().nonnegative(),
	startSeconds: require_transport.number(),
	text: require_transport.string()
});
const mediaSpeaker = require_transport.object({
	entityId: require_transport.string().nullable(),
	entityLabel: require_transport.string().nullable(),
	speakerIndex: require_transport.number().int().nonnegative(),
	totalDurationSeconds: require_transport.number().nonnegative(),
	utteranceCount: require_transport.number().int().nonnegative()
});
const fileDetailResponse = fileResponse.extend({
	speakers: require_transport.array(mediaSpeaker),
	transcription: require_transport.object({
		durationSeconds: require_transport.number().nonnegative(),
		speakerCount: require_transport.number().int().nonnegative(),
		utterances: require_transport.array(transcriptUtterance)
	})
});
const audioUrlResponse = require_transport.object({ url: require_transport.string().url() });
const audioMetadataWarningBody = require_transport.object({
	metadataDurationSeconds: require_transport.number().nonnegative(),
	transcriptDurationSeconds: require_transport.number().nonnegative()
});
const audioMetadataWarningResponse = require_transport.object({
	enqueuedRemediation: require_transport.boolean(),
	mediaId: require_transport.string(),
	severity: require_transport._enum(["minor", "major"])
});
const deleteResponse = require_transport.object({
	deleted: require_transport.literal(true),
	mediaId: require_transport.string()
});
const goneError = require_transport.object({
	deletedAt: require_transport.datetime(),
	error: require_transport.literal("gone"),
	message: require_transport.string()
});
const notFoundError = require_transport.object({ error: require_transport.object({
	code: require_transport.literal("not_found"),
	message: require_transport.string()
}) });
const unsupportedMediaTypeError = require_transport.object({ error: require_transport.object({
	code: require_transport.literal("unsupported_media_type"),
	message: require_transport.string()
}) });

//#endregion
//#region src/resources/source.ts
const LABEL_SUFFIX_REGEX$1 = /(\.[^.]+)+$/;
const REDIRECT_STATUSES = new Set([
	301,
	302,
	303,
	307,
	308
]);
const DEFAULT_MAX_SOURCE_BYTES = 1024 * 1024 * 1024 * 5;
async function materializeSource(source, opts) {
	if ("file" in source) return {
		file: await toBlob(source.file, opts.maxSourceBytes),
		label: source.label ?? "Uploaded file"
	};
	if ("path" in source) {
		const file = await readPathSource(source.path, opts.maxSourceBytes);
		return {
			file: new Blob([toArrayBuffer(file.bytes)]),
			label: source.label ?? labelFromPath(source.path)
		};
	}
	const remote = await downloadUrlSource(parseSourceUrl(source.url), opts);
	return {
		file: remote.file,
		label: source.label ?? labelFromUrl(remote.url)
	};
}
function labelFromPath(value) {
	const raw = value.replace(/\\/g, "/").split("/").at(-1)?.trim() ?? "";
	if (!raw) return "Uploaded file";
	const label = raw.replace(LABEL_SUFFIX_REGEX$1, "").trim();
	if (label) return label;
	return "Uploaded file";
}
function labelFromUrl(url) {
	const raw = url.pathname.split("/").at(-1)?.trim() ?? "";
	if (!raw) return "Uploaded file";
	const label = decodeURIComponent(raw).replace(LABEL_SUFFIX_REGEX$1, "").trim();
	if (label) return label;
	return "Uploaded file";
}
function parseSourceUrl(value) {
	if (!value.trim()) throw new require_transport.InvalidSourceError("source.url must be a non-empty string", { code: "invalid_source" });
	let url;
	try {
		url = new URL(value);
	} catch {
		throw new require_transport.InvalidSourceError("source.url must be a valid URL", { code: "invalid_source" });
	}
	if (url.protocol !== "http:" && url.protocol !== "https:") throw new require_transport.InvalidSourceError("source.url must use http: or https:", { code: "invalid_source" });
	return url;
}
async function readPathSource(value, maxSourceBytes) {
	if (!value.trim()) throw new require_transport.InvalidSourceError("source.path must be a non-empty string", { code: "invalid_source" });
	let fs;
	let p;
	try {
		fs = await import("node:fs/promises");
		p = await import("node:path");
	} catch (cause) {
		throw new require_transport.UnsupportedRuntimeError("source.path is not supported in this runtime", {
			cause,
			code: "unsupported_runtime"
		});
	}
	const path = p.resolve(value);
	const stat = await fs.stat(path).catch((cause) => {
		throw new require_transport.InvalidSourceError(`source.path could not be read: ${path}`, {
			cause,
			code: "invalid_source"
		});
	});
	if (stat.isDirectory()) throw new require_transport.InvalidSourceError("source.path must point to a file", { code: "invalid_source" });
	assertWithinLimit(stat.size, maxSourceBytes, {
		kind: "source.path",
		url: path
	});
	return {
		bytes: await fs.readFile(path),
		path
	};
}
async function downloadUrlSource(start, opts) {
	let url = start;
	for (let i = 0; i <= 5; i++) {
		const response = await fetchWithTimeout(url, opts);
		const redirected = readRedirect(response, url, i);
		if (redirected) {
			url = redirected;
			continue;
		}
		if (!response.ok) throw new require_transport.RemoteFetchError(`Failed to download source.url (status ${response.status})`, {
			code: "remote_fetch_failed",
			status: response.status,
			url: url.toString()
		});
		const size = parseContentLength(response.headers.get("content-length"));
		if (size !== void 0) assertWithinLimit(size, opts.maxSourceBytes, {
			kind: "source.url",
			status: response.status,
			url: url.toString()
		});
		const body = new Uint8Array(await response.arrayBuffer());
		assertWithinLimit(body.byteLength, opts.maxSourceBytes, {
			kind: "source.url",
			status: response.status,
			url: url.toString()
		});
		return {
			file: new Blob([toArrayBuffer(body)], { type: response.headers.get("content-type") ?? void 0 }),
			url
		};
	}
	throw new require_transport.RemoteFetchError("Failed to download source.url", {
		code: "remote_fetch_failed",
		url: start.toString()
	});
}
function readRedirect(response, url, hops) {
	if (!REDIRECT_STATUSES.has(response.status)) return null;
	if (hops === 5) throw new require_transport.RemoteFetchError("source.url exceeded the redirect limit", {
		code: "remote_fetch_redirect_limit",
		status: response.status,
		url: url.toString()
	});
	const next = response.headers.get("location");
	if (!next) throw new require_transport.RemoteFetchError("source.url returned a redirect without a location header", {
		code: "remote_fetch_failed",
		status: response.status,
		url: url.toString()
	});
	return new URL(next, url);
}
async function fetchWithTimeout(url, opts) {
	const ctrl = new AbortController();
	const timeout = setTimeout(() => {
		ctrl.abort(new require_transport.RemoteFetchTimeoutError("source.url timed out while downloading", {
			code: "remote_fetch_timeout",
			url: url.toString()
		}));
	}, opts.timeoutMs);
	if (opts.signal?.aborted) {
		clearTimeout(timeout);
		throw new require_transport.RequestAbortedError("source.url download was aborted", { code: "request_aborted" });
	}
	opts.signal?.addEventListener("abort", () => ctrl.abort(new require_transport.RequestAbortedError("source.url download was aborted", { code: "request_aborted" })), { once: true });
	try {
		return await opts.fetchImpl(url.toString(), {
			method: "GET",
			redirect: "manual",
			signal: ctrl.signal
		});
	} catch (cause) {
		if (ctrl.signal.aborted && ctrl.signal.reason instanceof Error) throw ctrl.signal.reason;
		throw new require_transport.RemoteFetchError("Failed to download source.url", {
			cause,
			code: "remote_fetch_failed",
			url: url.toString()
		});
	} finally {
		clearTimeout(timeout);
	}
}
async function toBlob(file, maxSourceBytes) {
	if (typeof Blob !== "undefined" && file instanceof Blob) {
		assertWithinLimit(file.size, maxSourceBytes, { kind: "source.file" });
		return file;
	}
	if (file instanceof ArrayBuffer) {
		assertWithinLimit(file.byteLength, maxSourceBytes, { kind: "source.file" });
		return new Blob([file]);
	}
	if (file instanceof Uint8Array) {
		assertWithinLimit(file.byteLength, maxSourceBytes, { kind: "source.file" });
		return new Blob([toArrayBuffer(file)]);
	}
	if (typeof ReadableStream !== "undefined" && file instanceof ReadableStream) {
		if (typeof Response === "undefined") throw new require_transport.UnsupportedRuntimeError("ReadableStream upload requires Response to convert stream to Blob", { code: "unsupported_runtime" });
		const blob = await new Response(file).blob();
		assertWithinLimit(blob.size, maxSourceBytes, { kind: "source.file" });
		return blob;
	}
	throw new require_transport.InvalidSourceError("Unsupported file type for upload()", { code: "invalid_source" });
}
function assertWithinLimit(size, maxSourceBytes, opts) {
	if (size <= maxSourceBytes) return;
	throw new require_transport.RemoteFetchTooLargeError(`${opts.kind} exceeds the supported upload limit of ${maxSourceBytes} bytes`, {
		code: "source_too_large",
		status: opts.status,
		url: opts.url
	});
}
function parseContentLength(value) {
	if (!value) return;
	const size = Number(value);
	if (!Number.isFinite(size) || size < 0) return;
	return size;
}
function toArrayBuffer(bytes) {
	return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

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
		this.maxSourceBytes = opts?.maxSourceBytes ?? DEFAULT_MAX_SOURCE_BYTES;
	}
	async upload(req) {
		if (typeof FormData === "undefined") throw new require_transport.UnsupportedRuntimeError("FormData is not available in this runtime; cannot perform multipart upload", { code: "unsupported_runtime" });
		const { file, label: rawLabel } = await materializeSource(validateUploadSource(req), {
			fetchImpl: this.fetchImpl,
			maxSourceBytes: this.maxSourceBytes,
			signal: req.signal,
			timeoutMs: this.timeoutMs
		});
		const label = filesLabel(rawLabel);
		if (!label) throw new require_transport.InvalidSourceError("label is required", { code: "invalid_source" });
		const form = new FormData();
		form.append("file", file, label);
		form.append("label", label);
		return require_transport.parseRes(uploadResponse, (await this.transport.request({
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
		if (!mediaId) throw new require_transport.ConduitError("mediaId is required", { code: "invalid_request" });
		return require_transport.parseRes(fileResponse, (await this.transport.request({
			method: "GET",
			path: `/v1/files/${encodeURIComponent(mediaId)}`,
			requestId: opts?.requestId,
			retryable: true,
			signal: opts?.signal
		})).data, "files.get");
	}
	async list(opts) {
		const query = require_transport.parseReq(listFilesQuery, {
			cursor: opts?.cursor,
			includeDeleted: opts?.includeDeleted,
			limit: opts?.limit
		}, "files.list query");
		return require_transport.parseRes(listFilesResponse, (await this.transport.request({
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
		if (!mediaId) throw new require_transport.ConduitError("mediaId is required", { code: "invalid_request" });
		return require_transport.parseRes(retentionUpdateResponse, (await this.transport.request({
			body: { lock: locked },
			method: "PATCH",
			path: `/v1/files/${encodeURIComponent(mediaId)}/retention`,
			requestId: opts?.requestId,
			retryable: true,
			signal: opts?.signal
		})).data, "files.setRetentionLock");
	}
	async delete(mediaId, opts) {
		if (!mediaId) throw new require_transport.ConduitError("mediaId is required", { code: "invalid_request" });
		return require_transport.parseRes(deleteResponse, (await this.transport.request({
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
	throw new require_transport.InvalidSourceError("upload() must include exactly one of file, url, or path", { code: "invalid_source" });
}

//#endregion
//#region ../contracts/dist/v1/jobs.mjs
const jobStatus = require_transport._enum([
	"queued",
	"running",
	"succeeded",
	"failed",
	"canceled"
]);
const jobStage = require_transport._enum([
	"uploaded",
	"queued",
	"transcoding",
	"extracting",
	"scoring",
	"rendering",
	"finalizing"
]);
const jobResponse = require_transport.object({
	createdAt: require_transport.string(),
	credits: require_transport.object({
		reservationStatus: require_transport._enum([
			"active",
			"released",
			"applied"
		]).nullable(),
		reservedCredits: require_transport.number().nullable()
	}).optional(),
	error: require_transport.object({
		code: require_transport.string(),
		details: require_transport.unknown().optional(),
		message: require_transport.string(),
		retryable: require_transport.boolean().optional()
	}).optional(),
	id: require_transport.string(),
	matchingId: require_transport.string().optional(),
	progress: require_transport.number().optional(),
	releasedCredits: require_transport.number().nullable().optional(),
	reportId: require_transport.string().optional(),
	stage: require_transport._enum([
		"uploaded",
		"queued",
		"transcoding",
		"extracting",
		"scoring",
		"rendering",
		"finalizing"
	]).optional(),
	status: require_transport._enum([
		"queued",
		"running",
		"succeeded",
		"failed",
		"canceled"
	]),
	type: require_transport._enum(["report.generate", "matching.generate"]),
	updatedAt: require_transport.string(),
	usage: require_transport.object({
		creditsDiscounted: require_transport.number().optional(),
		creditsNetUsed: require_transport.number(),
		creditsUsed: require_transport.number(),
		durationMs: require_transport.number().optional(),
		modelVersion: require_transport.string().optional()
	}).optional()
});
const streamEventType = require_transport._enum([
	"status",
	"stage",
	"terminal",
	"heartbeat"
]);
/**
* Base SSE event structure with event ID for Last-Event-ID support.
*/
const baseStreamEvent = require_transport.object({ id: require_transport.string().describe("Monotonically increasing event ID for resumption") });
const statusStreamEvent = baseStreamEvent.extend({
	data: require_transport.object({
		job: jobResponse,
		progress: require_transport.number().optional(),
		stage: jobStage.optional(),
		status: jobStatus
	}),
	event: require_transport.literal("status")
});
const stageStreamEvent = baseStreamEvent.extend({
	data: require_transport.object({
		job: jobResponse,
		progress: require_transport.number().optional(),
		stage: jobStage
	}),
	event: require_transport.literal("stage")
});
const terminalStreamEvent = baseStreamEvent.extend({
	data: require_transport.object({
		error: require_transport.object({
			code: require_transport.string(),
			message: require_transport.string()
		}).optional(),
		job: jobResponse,
		matchingId: require_transport.string().optional(),
		reportId: require_transport.string().optional(),
		status: require_transport._enum([
			"succeeded",
			"failed",
			"canceled"
		])
	}),
	event: require_transport.literal("terminal")
});
const heartbeatStreamEvent = baseStreamEvent.extend({
	data: require_transport.object({ timestamp: require_transport.string() }),
	event: require_transport.literal("heartbeat")
});
const jobStreamEvent = require_transport.discriminatedUnion("event", [
	statusStreamEvent,
	stageStreamEvent,
	terminalStreamEvent,
	heartbeatStreamEvent
]);
const streamQueryParams = require_transport.object({ timeout: number().min(1e3).max(3e5).default(3e5).describe("Stream timeout in milliseconds (default: 300000, max: 300000)") });

//#endregion
//#region src/resources/jobs.ts
var JobsResource = class {
	transport;
	constructor(transport) {
		this.transport = transport;
	}
	async get(jobId, opts) {
		return require_transport.parseRes(jobResponse, (await this.transport.request({
			method: "GET",
			path: `/v1/jobs/${encodeURIComponent(jobId)}`,
			requestId: opts?.requestId,
			retryable: true,
			signal: opts?.signal
		})).data, "jobs.get");
	}
	async cancel(jobId, opts) {
		return require_transport.parseRes(jobResponse, (await this.transport.request({
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
		const deadline = require_transport.withDeadline(timeoutMs, {
			onTimeout: () => new require_transport.TimeoutError(`Timed out waiting for job ${jobId} after ${timeoutMs}ms`, { code: "timeout" }),
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
				if (job.status === "failed") throw new require_transport.JobFailedError(jobId, job.error?.message ?? "Job failed", {
					cause: job.error,
					code: job.error?.code,
					requestId: job.requestId
				});
				if (job.status === "canceled") throw new require_transport.JobCanceledError(jobId, "Job canceled", {
					cause: job.error,
					requestId: job.requestId
				});
			}
			throw new require_transport.TimeoutError(`Timed out waiting for job ${jobId} after ${timeoutMs}ms`, { code: "timeout" });
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
		throw new require_transport.StreamError(`Failed to get status for job ${jobId} after ${maxRetries} retries`, {
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
			if (retries >= maxRetries) throw new require_transport.StreamError(`Stream connection failed for job ${jobId} after ${maxRetries} retries`, {
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
			throw new require_transport.ConduitError(err.message ?? "Unknown SSE error", { code: err.code });
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
		const parsed = require_transport.parseRes(jobStreamEvent, {
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
//#region ../contracts/dist/matching-analysis-CpgnrP6p.mjs
const targetSelector = targetSelector$1;
const matchingContext = require_transport.literal("hiring_team_fit");
const subjectRef = require_transport.discriminatedUnion("type", [require_transport.object({
	entityId: require_transport.string().min(1).max(256).trim(),
	type: require_transport.literal("entity_id")
}), require_transport.object({
	mediaId: require_transport.string().min(1).max(256).trim(),
	selector: targetSelector,
	type: require_transport.literal("media_target")
})]);
const resolvedSubject = require_transport.object({
	entityId: require_transport.string().optional(),
	resolvedLabel: require_transport.string().nullable().optional(),
	source: subjectRef
});
const requestSubjects = require_transport.object({
	group: require_transport.array(subjectRef).min(1),
	target: subjectRef
}).strict();
const resolvedSubjects = require_transport.object({
	group: require_transport.array(resolvedSubject).min(1),
	target: resolvedSubject
}).strict();
const output = require_transport.object({ template: require_transport.literal("matching") }).strict();
const webhookConfig = require_transport.object({
	headers: require_transport.record(require_transport.string(), require_transport.string()).optional(),
	url: require_transport.url()
}).optional();
const createJobBody = requestSubjects.extend({
	context: matchingContext,
	idempotencyKey: require_transport.string().optional(),
	label: require_transport.string().trim().min(1).max(64).optional(),
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
const jobReceipt = require_transport.object({
	estimatedWaitSec: require_transport.number().optional(),
	jobId: require_transport.string(),
	stage: require_transport.string().optional(),
	status: require_transport._enum(["queued", "running"])
});
const matchingAnalysisJson = require_transport.object({
	schemaVersion: require_transport.literal(1),
	sections: require_transport.array(reportSection).min(1),
	summary: require_transport.string().min(1),
	title: require_transport.string().min(1)
}).strict();
const matchingAnalysisResponse = require_transport.object({
	context: matchingContext,
	createdAt: require_transport.string(),
	group: require_transport.array(resolvedSubject).min(1),
	id: require_transport.string(),
	json: matchingAnalysisJson.nullish(),
	jobId: require_transport.string().optional(),
	label: require_transport.string().optional(),
	markdown: require_transport.string().nullish(),
	output,
	target: resolvedSubject
}).strict();
const listQuery = require_transport.object({
	entityId: require_transport.string().optional(),
	limit: number().int().min(1).max(100).default(25),
	page: number().int().min(1).default(1),
	workspaceId: require_transport.string()
});
const listItem = require_transport.object({
	createdAt: require_transport.string(),
	group: require_transport.array(resolvedSubject).min(1),
	id: require_transport.string(),
	jobId: require_transport.string().optional(),
	label: require_transport.string().optional(),
	target: resolvedSubject
});
const listResponse = require_transport.object({
	items: require_transport.array(listItem),
	pagination: require_transport.object({
		limit: require_transport.number().int().min(1),
		page: require_transport.number().int().min(1),
		totalItems: require_transport.number().int().min(0),
		totalPages: require_transport.number().int().min(0)
	})
});
const sharingStatus = require_transport.object({
	active: require_transport.boolean(),
	shareUrl: require_transport.url().nullable()
});
const toggleSharingBody = require_transport.object({
	active: require_transport.boolean(),
	workspaceId: require_transport.string()
});
const sharingQuery = require_transport.object({ workspaceId: require_transport.string() });

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
		const idempotencyKey = req.idempotencyKey ?? require_transport.randomId("idem");
		const body = require_transport.parseReq(createJobBody, this.normalizeBody(req), "matching.create body");
		const res = await this.transport.request({
			body,
			idempotencyKey,
			method: "POST",
			path: "/v1/matching/jobs",
			requestId: req.requestId,
			retryable: true,
			signal: req.signal
		});
		const receiptData = require_transport.parseRes(jobReceipt, res.data, "matching.create");
		const receipt = {
			...receiptData,
			requestId: res.requestId ?? res.data.requestId,
			stage: toJobStage$1(receiptData.stage)
		};
		receipt.handle = this.makeHandle(receipt.jobId);
		return receipt;
	}
	async get(matchingId, opts) {
		return toMatchingAnalysis(require_transport.parseRes(matchingAnalysisResponse, (await this.transport.request({
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
		return toMatchingAnalysis(require_transport.parseRes(matchingAnalysisResponse, res.data, "matching.getByJob"));
	}
	async generate(req, opts) {
		const receipt = await this.createJob(req);
		if (!receipt.handle) throw new require_transport.ConduitError("Job receipt is missing handle", { code: "invalid_response" });
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
				if (!matchingId) throw new require_transport.ConduitError(`Job ${jobId} succeeded but no matching id was returned`, { code: "invalid_response" });
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
	if (req.context !== "hiring_team_fit") throw new require_transport.ConduitError("context must be hiring_team_fit", { code: "invalid_request" });
	if (req.group.length < 1) throw new require_transport.ConduitError("group must include at least one subject", { code: "invalid_request" });
	const ids = /* @__PURE__ */ new Set();
	for (const item of [req.target, ...req.group]) {
		if (!isEntitySource(item)) {
			if (!item.mediaId.trim()) throw new require_transport.ConduitError("mediaId is required", { code: "invalid_request" });
			validateTarget$1(item.selector);
			continue;
		}
		if (!item.entityId.trim()) throw new require_transport.ConduitError("entityId is required", { code: "invalid_request" });
		if (ids.has(item.entityId)) throw new require_transport.ConduitError("target and group must reference different direct entity IDs", { code: "invalid_request" });
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
	if (target.strategy === "entity_id" && !target.entityId.trim()) throw new require_transport.ConduitError("target.entityId is required for entity_id", { code: "invalid_request" });
	if (target.strategy === "speaker_index" && (!Number.isInteger(target.speakerIndex) || target.speakerIndex < 0)) throw new require_transport.ConduitError("target.speakerIndex is required for speaker_index", { code: "invalid_request" });
	if (target.strategy === "magic_hint" && !target.hint.trim()) throw new require_transport.ConduitError("target.hint is required for magic_hint", { code: "invalid_request" });
}
function validateTimerangeTarget$1(timeRange) {
	if (!timeRange) throw new require_transport.ConduitError("target.timeRange is required for timerange", { code: "invalid_request" });
	const start = timeRange.startSeconds;
	const end = timeRange.endSeconds;
	if (start === void 0 && end === void 0) throw new require_transport.ConduitError("target.timeRange must include startSeconds or endSeconds", { code: "invalid_request" });
	if (start !== void 0 && end !== void 0 && !(start < end)) throw new require_transport.ConduitError("target.timeRange.startSeconds must be less than endSeconds", { code: "invalid_request" });
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
		const body = require_transport.parseReq(reportCreateJobBody, this.normalizeCreateRequest(req, mediaId), "reports.create body");
		const res = await this.transport.request({
			body,
			idempotencyKey: idem,
			method: "POST",
			path: "/v1/reports/jobs",
			requestId: req.requestId,
			retryable: true,
			signal: req.signal
		});
		const receiptData = require_transport.parseRes(jobReceipt$1, res.data, "reports.createJob");
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
		return toReport(require_transport.parseRes(reportResponse, (await this.transport.request({
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
		return toReport(require_transport.parseRes(reportResponse, res.data, "reports.getByJob"));
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
				if (!terminal.reportId) throw new require_transport.ConduitError(`Job ${jobId} succeeded but no reportId was returned`, { code: "invalid_response" });
				return this.get(terminal.reportId);
			}
		};
	}
	defaultIdempotencyKey() {
		return require_transport.randomId("idem");
	}
	async resolveSource(source, opts) {
		if ([
			"mediaId",
			"file",
			"url",
			"path"
		].filter((key) => key in source).length !== 1) throw new require_transport.InvalidSourceError("source must include exactly one of mediaId, file, url, or path", { code: "invalid_source" });
		if ("mediaId" in source) {
			if (!source.mediaId) throw new require_transport.InvalidSourceError("source.mediaId must be a non-empty string", { code: "invalid_source" });
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
	if (target.strategy === "entity_id" && !target.entityId.trim()) throw new require_transport.ConduitError("target.entityId is required for entity_id", { code: "invalid_request" });
	if (target.strategy === "speaker_index" && (!Number.isInteger(target.speakerIndex) || target.speakerIndex < 0)) throw new require_transport.ConduitError("target.speakerIndex is required for speaker_index", { code: "invalid_request" });
	if (target.strategy === "magic_hint" && !target.hint.trim()) throw new require_transport.ConduitError("target.hint is required for magic_hint", { code: "invalid_request" });
}
function validateTimerangeTarget(timeRange) {
	if (!timeRange) throw new require_transport.ConduitError("target.timeRange is required for timerange", { code: "invalid_request" });
	const start = timeRange.startSeconds;
	const end = timeRange.endSeconds;
	if (start === void 0 && end === void 0) throw new require_transport.ConduitError("target.timeRange must include startSeconds or endSeconds", { code: "invalid_request" });
	if (start !== void 0 && end !== void 0 && !(start < end)) throw new require_transport.ConduitError("target.timeRange.startSeconds must be less than endSeconds", { code: "invalid_request" });
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
		if (!sigHeader) throw new require_transport.WebhookVerificationError("Missing conduit-signature header", { code: "webhook_signature_missing" });
		const sig = parseSignature(sigHeader);
		const ts = Number(sig.t);
		if (!Number.isFinite(ts)) throw new require_transport.WebhookVerificationError("Invalid signature timestamp", { code: "webhook_signature_invalid" });
		const now = Math.floor(Date.now() / 1e3);
		if (Math.abs(now - ts) > tolerance) throw new require_transport.WebhookVerificationError("Signature timestamp outside tolerance", { code: "webhook_signature_stale" });
		if (!timingSafeEqualHex(await hmacHex(params.secret, `${sig.t}.${params.payload}`), sig.v1)) throw new require_transport.WebhookVerificationError("Invalid signature", { code: "webhook_signature_invalid" });
		return { ok: true };
	}
	parseEvent(payload) {
		let raw;
		try {
			raw = JSON.parse(payload);
		} catch (cause) {
			throw new require_transport.ConduitError("Invalid webhook payload: invalid JSON", {
				cause,
				code: "invalid_webhook_payload"
			});
		}
		if (!isObject(raw)) throw new require_transport.ConduitError("Invalid webhook payload: not an object", { code: "invalid_webhook_payload" });
		if (typeof raw.id !== "string") throw new require_transport.ConduitError("Invalid webhook payload: id must be a string", { code: "invalid_webhook_payload" });
		if (typeof raw.type !== "string") throw new require_transport.ConduitError("Invalid webhook payload: type must be a string", { code: "invalid_webhook_payload" });
		if (typeof raw.createdAt !== "string") throw new require_transport.ConduitError("Invalid webhook payload: createdAt must be a string", { code: "invalid_webhook_payload" });
		if (!isIsoTimestamp(raw.createdAt)) throw new require_transport.ConduitError("Invalid webhook payload: createdAt must be an ISO8601 string", { code: "invalid_webhook_payload" });
		if (typeof raw.timestamp !== "string") throw new require_transport.ConduitError("Invalid webhook payload: timestamp must be a string", { code: "invalid_webhook_payload" });
		if (!isIsoTimestamp(raw.timestamp)) throw new require_transport.ConduitError("Invalid webhook payload: timestamp must be an ISO8601 string", { code: "invalid_webhook_payload" });
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
	return new require_transport.ConduitError(message, { code: "invalid_webhook_payload" });
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
	return new require_transport.WebhookVerificationError(message, { code: "webhook_signature_invalid" });
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
		if (!options.apiKey) throw new require_transport.InitializationError("apiKey is required", { code: "config_error" });
		if (isBrowserRuntime() && !options.dangerouslyAllowBrowser) throw new require_transport.InitializationError("Conduit SDK cannot run in browser environments by default because API keys are secret. Use a server/edge proxy or pass dangerouslyAllowBrowser: true only if you understand the risk.", { code: "unsupported_runtime" });
		const baseUrl = options.baseUrl ?? "https://api.mappa.ai";
		if (!isValidUrl(baseUrl)) throw new require_transport.InitializationError("baseUrl must be a valid URL", { code: "config_error" });
		const timeoutMs = options.timeoutMs ?? 3e5;
		const maxRetries = options.maxRetries ?? 2;
		const maxSourceBytes = options.maxSourceBytes ?? DEFAULT_MAX_SOURCE_BYTES;
		const transport = new require_transport.Transport({
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
	return err instanceof require_transport.ConduitError;
}
function isApiError(err) {
	return err instanceof require_transport.ApiError;
}
function isAuthError(err) {
	return err instanceof require_transport.AuthError;
}
function isInitializationError(err) {
	return err instanceof require_transport.InitializationError;
}
function isInsufficientCreditsError(err) {
	return err instanceof require_transport.InsufficientCreditsError;
}
function isInvalidSourceError(err) {
	return err instanceof require_transport.InvalidSourceError;
}
function isJobCanceledError(err) {
	return err instanceof require_transport.JobCanceledError;
}
function isJobFailedError(err) {
	return err instanceof require_transport.JobFailedError;
}
function isRateLimitError(err) {
	return err instanceof require_transport.RateLimitError;
}
function isRemoteFetchError(err) {
	return err instanceof require_transport.RemoteFetchError;
}
function isRemoteFetchTimeoutError(err) {
	return err instanceof require_transport.RemoteFetchTimeoutError;
}
function isRemoteFetchTooLargeError(err) {
	return err instanceof require_transport.RemoteFetchTooLargeError;
}
function isRequestAbortedError(err) {
	return err instanceof require_transport.RequestAbortedError;
}
function isSourceError(err) {
	return err instanceof require_transport.SourceError;
}
function isStreamError(err) {
	return err instanceof require_transport.StreamError;
}
function isTimeoutError(err) {
	return err instanceof require_transport.TimeoutError;
}
function isUnsupportedRuntimeError(err) {
	return err instanceof require_transport.UnsupportedRuntimeError;
}
function isValidationError(err) {
	return err instanceof require_transport.ValidationError;
}
function isWebhookVerificationError(err) {
	return err instanceof require_transport.WebhookVerificationError;
}

//#endregion
exports.ApiError = require_transport.ApiError;
exports.AuthError = require_transport.AuthError;
exports.Conduit = Conduit;
exports.ConduitError = require_transport.ConduitError;
exports.InitializationError = require_transport.InitializationError;
exports.InsufficientCreditsError = require_transport.InsufficientCreditsError;
exports.InvalidSourceError = require_transport.InvalidSourceError;
exports.JobCanceledError = require_transport.JobCanceledError;
exports.JobFailedError = require_transport.JobFailedError;
exports.RateLimitError = require_transport.RateLimitError;
exports.RemoteFetchError = require_transport.RemoteFetchError;
exports.RemoteFetchTimeoutError = require_transport.RemoteFetchTimeoutError;
exports.RemoteFetchTooLargeError = require_transport.RemoteFetchTooLargeError;
exports.RequestAbortedError = require_transport.RequestAbortedError;
exports.SourceError = require_transport.SourceError;
exports.StreamError = require_transport.StreamError;
exports.TimeoutError = require_transport.TimeoutError;
exports.UnsupportedRuntimeError = require_transport.UnsupportedRuntimeError;
exports.ValidationError = require_transport.ValidationError;
exports.WebhookVerificationError = require_transport.WebhookVerificationError;
exports.isApiError = isApiError;
exports.isAuthError = isAuthError;
exports.isConduitError = isConduitError;
exports.isInitializationError = isInitializationError;
exports.isInsufficientCreditsError = isInsufficientCreditsError;
exports.isInvalidSourceError = isInvalidSourceError;
exports.isJobCanceledError = isJobCanceledError;
exports.isJobFailedError = isJobFailedError;
exports.isRateLimitError = isRateLimitError;
exports.isRemoteFetchError = isRemoteFetchError;
exports.isRemoteFetchTimeoutError = isRemoteFetchTimeoutError;
exports.isRemoteFetchTooLargeError = isRemoteFetchTooLargeError;
exports.isRequestAbortedError = isRequestAbortedError;
exports.isSourceError = isSourceError;
exports.isStreamError = isStreamError;
exports.isTimeoutError = isTimeoutError;
exports.isUnsupportedRuntimeError = isUnsupportedRuntimeError;
exports.isValidationError = isValidationError;
exports.isWebhookVerificationError = isWebhookVerificationError;
//# sourceMappingURL=index.cjs.map