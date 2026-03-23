//#region src/errors.ts
const customInspect = Symbol.for("nodejs.util.inspect.custom");
function formatDetails(details, indent = "  ") {
	if (details === void 0 || details === null) return "";
	try {
		return JSON.stringify(details, null, 2).split("\n").join(`\n${indent}`);
	} catch {
		return String(details);
	}
}
var ConduitError = class extends Error {
	name = "ConduitError";
	requestId;
	code;
	constructor(message, opts) {
		super(message);
		this.requestId = opts?.requestId;
		this.code = opts?.code ?? "conduit_error";
		this.cause = opts?.cause;
	}
	toString() {
		const lines = [`${this.name}: ${this.message}`];
		if (this.code) lines.push(`  Code: ${this.code}`);
		if (this.requestId) lines.push(`  Request ID: ${this.requestId}`);
		return lines.join("\n");
	}
	[customInspect]() {
		return this.toString();
	}
};
var InitializationError = class extends ConduitError {
	name = "InitializationError";
};
var UnsupportedRuntimeError = class extends ConduitError {
	name = "UnsupportedRuntimeError";
};
var WebhookVerificationError = class extends ConduitError {
	name = "WebhookVerificationError";
};
var SourceError = class extends ConduitError {
	name = "SourceError";
	url;
	status;
	constructor(message, opts) {
		super(message, opts);
		this.url = opts?.url;
		this.status = opts?.status;
	}
};
var InvalidSourceError = class extends SourceError {
	name = "InvalidSourceError";
};
var RemoteFetchError = class extends SourceError {
	name = "RemoteFetchError";
};
var RemoteFetchTimeoutError = class extends RemoteFetchError {
	name = "RemoteFetchTimeoutError";
};
var RemoteFetchTooLargeError = class extends RemoteFetchError {
	name = "RemoteFetchTooLargeError";
};
var ApiError = class extends ConduitError {
	name = "ApiError";
	status;
	details;
	constructor(message, opts) {
		super(message, {
			code: opts.code,
			requestId: opts.requestId
		});
		this.status = opts.status;
		this.details = opts.details;
	}
	toString() {
		const lines = [`${this.name}: ${this.message}`, `  Status: ${this.status}`];
		if (this.code) lines.push(`  Code: ${this.code}`);
		if (this.requestId) lines.push(`  Request ID: ${this.requestId}`);
		if (this.details !== void 0 && this.details !== null) lines.push(`  Details: ${formatDetails(this.details)}`);
		return lines.join("\n");
	}
};
var RateLimitError = class extends ApiError {
	name = "RateLimitError";
	retryAfterMs;
};
var AuthError = class extends ApiError {
	name = "AuthError";
};
var ValidationError = class extends ApiError {
	name = "ValidationError";
};
var InsufficientCreditsError = class extends ApiError {
	name = "InsufficientCreditsError";
	required;
	available;
	constructor(message, opts) {
		super(message, opts);
		this.required = opts.details?.required ?? 0;
		this.available = opts.details?.available ?? 0;
	}
};
var JobFailedError = class extends ConduitError {
	name = "JobFailedError";
	jobId;
	constructor(jobId, message, opts) {
		super(message, opts);
		this.jobId = jobId;
	}
};
var JobCanceledError = class extends ConduitError {
	name = "JobCanceledError";
	jobId;
	constructor(jobId, message, opts) {
		super(message, opts);
		this.jobId = jobId;
	}
};
var TimeoutError = class extends ConduitError {
	name = "TimeoutError";
};
var RequestAbortedError = class extends ConduitError {
	name = "RequestAbortedError";
};
var StreamError = class extends ConduitError {
	name = "StreamError";
	jobId;
	lastEventId;
	url;
	retryCount;
	constructor(message, opts) {
		super(message, {
			cause: opts.cause,
			requestId: opts.requestId
		});
		this.jobId = opts.jobId;
		this.lastEventId = opts.lastEventId;
		this.url = opts.url;
		this.retryCount = opts.retryCount;
	}
};

//#endregion
//#region src/resources/validate.ts
function summarize(err) {
	if (!err || typeof err !== "object") return "unknown validation error";
	if (!("issues" in err && Array.isArray(err.issues))) return "unknown validation error";
	return err.issues.slice(0, 3).map((issue) => {
		if (!issue || typeof issue !== "object") return "invalid value";
		return `${"path" in issue && Array.isArray(issue.path) && issue.path.length > 0 ? issue.path.join(".") : "root"}: ${"message" in issue && typeof issue.message === "string" ? issue.message : "invalid value"}`;
	}).join("; ") || "unknown validation error";
}
function parseReq(schema, input, name) {
	const out = schema.safeParse(input);
	if (out.success) return out.data;
	throw new ConduitError(`Invalid ${name}: ${summarize(out.error)}`, {
		cause: out.error,
		code: "invalid_request"
	});
}
function parseRes(schema, input, name) {
	const out = schema.safeParse(input);
	if (out.success) return out.data;
	throw new ConduitError(`Invalid ${name} response: ${summarize(out.error)}`, {
		cause: out.error,
		code: "invalid_response"
	});
}

//#endregion
//#region src/utils/index.ts
function getHeader(headers, name) {
	const value = headers.get(name);
	if (value === null) return;
	return value;
}
function jitter(ms) {
	const ratio = .8 + Math.random() * .4;
	return Math.floor(ms * ratio);
}
function backoffMs(attempt, baseMs, maxMs) {
	const ms = baseMs * 2 ** Math.max(0, attempt - 1);
	if (ms > maxMs) return maxMs;
	return ms;
}
function withDeadline(timeoutMs, opts) {
	const ctrl = new AbortController();
	const timeout = setTimeout(() => {
		ctrl.abort(opts?.onTimeout?.() ?? new TimeoutError(`The operation timed out after ${timeoutMs}ms`, { code: "timeout" }));
	}, timeoutMs);
	if (opts?.signal?.aborted) {
		clearTimeout(timeout);
		throw (opts.signal.reason instanceof Error ? opts.signal.reason : void 0) ?? opts.onAbort?.() ?? new RequestAbortedError("The operation was aborted", { code: "request_aborted" });
	}
	opts?.signal?.addEventListener("abort", () => ctrl.abort((opts.signal?.reason instanceof Error ? opts.signal.reason : void 0) ?? opts.onAbort?.() ?? new RequestAbortedError("The operation was aborted", { code: "request_aborted" })), { once: true });
	return {
		cleanup: () => clearTimeout(timeout),
		signal: ctrl.signal
	};
}
function randomId(prefix = "req") {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return `${prefix}_${crypto.randomUUID().replace(/-/g, "")}`;
	return `${prefix}_${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
}

//#endregion
//#region src/resources/transport.ts
const LEADING_SLASH_REGEX = /^\//;
function buildUrl(baseUrl, path, query) {
	const url = new URL(path.replace(LEADING_SLASH_REGEX, ""), baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
	if (!query) return url.toString();
	for (const [k, v] of Object.entries(query)) {
		if (v === void 0) continue;
		url.searchParams.set(k, String(v));
	}
	return url.toString();
}
async function readBody(res) {
	const text = await res.text();
	if (!text) return {
		parsed: null,
		text: ""
	};
	try {
		return {
			parsed: JSON.parse(text),
			text
		};
	} catch {
		return {
			parsed: text,
			text
		};
	}
}
function coerceApiError(res, parsed) {
	const requestId = res.headers.get("x-request-id") ?? void 0;
	const normalized = normalizeApiErrorParsed(parsed, res.status);
	const code = normalized.code;
	const message = normalized.message;
	const details = normalized.details;
	if (res.status === 401 || res.status === 403) return new AuthError(message, {
		code,
		details,
		requestId,
		status: res.status
	});
	if (res.status === 422) return new ValidationError(message, {
		code,
		details,
		requestId,
		status: res.status
	});
	if (res.status === 402 && code === "insufficient_credits") return new InsufficientCreditsError(message, {
		code,
		details: normalizeCredits(details),
		requestId,
		status: res.status
	});
	if (res.status === 429) {
		const err = new RateLimitError(message, {
			code,
			details,
			requestId,
			status: res.status
		});
		err.retryAfterMs = parseRetryAfterMs(res.headers.get("retry-after"));
		return err;
	}
	return new ApiError(message, {
		code,
		details,
		requestId,
		status: res.status
	});
}
function normalizeApiErrorParsed(parsed, status) {
	if (typeof parsed === "string") return {
		details: parsed,
		message: parsed
	};
	if (!(parsed && typeof parsed === "object")) return {
		details: parsed,
		message: `Request failed with status ${status}`
	};
	const obj = parsed;
	const err = obj.error && typeof obj.error === "object" ? obj.error : obj;
	return {
		code: typeof err.code === "string" ? err.code : void 0,
		details: "details" in err ? err.details : parsed,
		message: typeof err.message === "string" ? err.message : `Request failed with status ${status}`
	};
}
function parseRetryAfterMs(value) {
	if (!value) return;
	const sec = Number(value);
	if (!Number.isFinite(sec) || sec < 0) return;
	return sec * 1e3;
}
function normalizeCredits(details) {
	const root = readCredits(details);
	if (root.required !== void 0 || root.available !== void 0) return root;
	if (!(details && typeof details === "object")) return {};
	if (!("details" in details)) return {};
	return readCredits(details.details);
}
function readCredits(value) {
	if (!(value && typeof value === "object")) return {};
	const obj = value;
	const required = typeof obj.required === "number" && Number.isFinite(obj.required) ? obj.required : void 0;
	return {
		available: typeof obj.available === "number" && Number.isFinite(obj.available) ? obj.available : void 0,
		required
	};
}
function shouldRetry(req, err) {
	if (!req.retryable) return { retry: false };
	if (err instanceof RateLimitError) return {
		retry: true,
		retryAfterMs: err.retryAfterMs
	};
	if (err instanceof ApiError) return { retry: err.status >= 500 && err.status <= 599 };
	if (err instanceof TypeError) return { retry: true };
	return { retry: false };
}
function isNetworkError(err) {
	if (err instanceof TypeError) return true;
	if (!err || typeof err !== "object") return false;
	if (!("code" in err)) return false;
	if (typeof err.code !== "string") return false;
	return [
		"FailedToOpenSocket",
		"ECONNREFUSED",
		"ECONNRESET",
		"ETIMEDOUT",
		"ENOTFOUND",
		"EAI_AGAIN"
	].includes(err.code);
}
function encodeRequestBody(body) {
	if (body === void 0) return;
	if (typeof FormData !== "undefined" && body instanceof FormData) return body;
	return JSON.stringify(body);
}
function wrapTransportError(err, ctx) {
	if (err instanceof ApiError || err instanceof ConduitError) return err;
	if (err instanceof TypeError) return new ConduitError("Transport request failed", {
		cause: err,
		code: "transport_error",
		requestId: ctx.requestId
	});
	return new ConduitError("Unexpected transport failure", {
		cause: err,
		code: "transport_error",
		requestId: ctx.requestId
	});
}
var Transport = class {
	opts;
	fetchImpl;
	constructor(opts) {
		this.opts = opts;
		this.fetchImpl = opts.fetch ?? fetch;
	}
	authHeaderName() {
		return this.opts.authHeaderName ?? "Mappa-Api-Key";
	}
	get timeoutMs() {
		return this.opts.timeoutMs;
	}
	async *streamSSE(path, opts) {
		const url = buildUrl(this.opts.baseUrl, path);
		const requestId = randomId("req");
		const maxRetries = Math.max(0, this.opts.maxRetries);
		const headers = this.createSseHeaders(requestId, opts?.lastEventId);
		let res;
		let lastError;
		for (const attempt of Array.from({ length: maxRetries + 1 }, (_, i) => i)) try {
			res = await this.openSseAttempt({
				attempt,
				headers,
				lastEventId: opts?.lastEventId,
				requestId,
				signal: opts?.signal,
				url
			});
			break;
		} catch (err) {
			lastError = err;
			this.opts.telemetry?.onError?.({
				context: {
					attempt,
					lastEventId: opts?.lastEventId
				},
				error: err,
				requestId,
				url
			});
			if (this.shouldRetrySseAttempt(err, attempt, maxRetries)) {
				const delay = jitter(backoffMs(attempt + 1, 500, 4e3));
				await new Promise((r) => setTimeout(r, delay));
				continue;
			}
			throw err;
		}
		if (!res) throw lastError;
		if (!res.body) throw new ConduitError("SSE response has no body", { code: "stream_error" });
		yield* this.parseSSEStream(res.body);
	}
	createSseHeaders(requestId, lastEventId) {
		const headers = {
			Accept: "text/event-stream",
			"Cache-Control": "no-cache",
			[this.authHeaderName()]: this.opts.apiKey,
			"X-Request-Id": requestId,
			...this.opts.userAgent ? { "User-Agent": this.opts.userAgent } : {},
			...this.opts.defaultHeaders ?? {}
		};
		if (lastEventId) headers["Last-Event-ID"] = lastEventId;
		return headers;
	}
	async openSseAttempt(opts) {
		const deadline = withDeadline(this.opts.timeoutMs, { signal: opts.signal });
		this.opts.telemetry?.onRequest?.({
			method: "GET",
			requestId: opts.requestId,
			url: opts.url
		});
		try {
			let res;
			try {
				res = await this.fetchImpl(opts.url, {
					headers: opts.headers,
					method: "GET",
					signal: deadline.signal
				});
			} catch (cause) {
				if (deadline.signal.aborted && deadline.signal.reason instanceof Error) throw deadline.signal.reason;
				throw cause;
			}
			if (res.ok) return res;
			const { parsed } = await readBody(res);
			const err = coerceApiError(res, parsed);
			this.opts.telemetry?.onError?.({
				context: {
					attempt: opts.attempt,
					lastEventId: opts.lastEventId
				},
				error: err,
				requestId: opts.requestId,
				url: opts.url
			});
			throw err;
		} finally {
			deadline.cleanup();
		}
	}
	shouldRetrySseAttempt(err, attempt, maxRetries) {
		if (!(attempt < maxRetries)) return false;
		if (isNetworkError(err)) return true;
		if (!(err instanceof ApiError)) return false;
		return err.status >= 500 && err.status <= 599;
	}
	async *parseSSEStream(body) {
		const decoder = new TextDecoder();
		const reader = body.getReader();
		let buf = "";
		try {
			for (;;) {
				const { done, value } = await reader.read();
				if (done) break;
				buf += decoder.decode(value, { stream: true });
				const parts = buf.split("\n\n");
				buf = parts.pop() ?? "";
				yield* this.parseSSEParts(parts);
			}
			if (buf.trim()) yield* this.parseSSEParts([buf]);
		} finally {
			reader.releaseLock();
		}
	}
	*parseSSEParts(parts) {
		for (const part of parts) {
			if (!part.trim()) continue;
			const event = this.parseSSEEvent(part);
			if (event) yield event;
		}
	}
	parseSSEEvent(text) {
		const lines = text.split("\n");
		let id;
		let event = "message";
		let data = "";
		for (const line of lines) {
			if (line.startsWith("id:")) id = line.slice(3).trim();
			if (line.startsWith("event:")) event = line.slice(6).trim();
			if (!line.startsWith("data:")) continue;
			if (data) data += "\n";
			data += line.slice(5).trim();
		}
		if (!data) return null;
		try {
			return {
				data: JSON.parse(data),
				event,
				id
			};
		} catch {
			return {
				data,
				event,
				id
			};
		}
	}
	async request(req) {
		const url = buildUrl(this.opts.baseUrl, req.path, req.query);
		const requestId = req.requestId ?? randomId("req");
		const headers = this.createRequestHeaders(req, requestId);
		const body = encodeRequestBody(req.body);
		const maxRetries = Math.max(0, this.opts.maxRetries);
		const start = Date.now();
		for (const attempt of Array.from({ length: maxRetries + 1 }, (_, i) => i + 1)) try {
			return await this.requestAttempt({
				body,
				headers,
				req,
				requestId,
				start,
				url
			});
		} catch (err) {
			this.opts.telemetry?.onError?.({
				error: err,
				requestId,
				url
			});
			const decision = shouldRetry(req, err);
			if (attempt <= maxRetries && decision.retry) {
				const sleep = decision.retryAfterMs ?? jitter(backoffMs(attempt, 500, 4e3));
				await new Promise((r) => setTimeout(r, sleep));
				continue;
			}
			throw wrapTransportError(err, {
				requestId,
				url
			});
		}
		throw new ConduitError("Unexpected transport exit", {
			code: "transport_error",
			requestId
		});
	}
	createRequestHeaders(req, requestId) {
		const headers = {
			[this.authHeaderName()]: this.opts.apiKey,
			"X-Request-Id": requestId,
			...this.opts.userAgent ? { "User-Agent": this.opts.userAgent } : {},
			...this.opts.defaultHeaders ?? {}
		};
		if (req.idempotencyKey) headers["Idempotency-Key"] = req.idempotencyKey;
		if (req.headers) {
			for (const [k, v] of Object.entries(req.headers)) if (v !== void 0) headers[k] = v;
		}
		const isFormData = typeof FormData !== "undefined" && req.body instanceof FormData;
		if (req.body !== void 0 && !isFormData) headers["Content-Type"] = "application/json";
		return headers;
	}
	async requestAttempt(opts) {
		const deadline = withDeadline(this.opts.timeoutMs, { signal: opts.req.signal });
		this.opts.telemetry?.onRequest?.({
			method: opts.req.method,
			requestId: opts.requestId,
			url: opts.url
		});
		try {
			let res;
			try {
				res = await this.fetchImpl(opts.url, {
					body: opts.body,
					headers: opts.headers,
					method: opts.req.method,
					signal: deadline.signal
				});
			} catch (cause) {
				if (deadline.signal.aborted && deadline.signal.reason instanceof Error) throw deadline.signal.reason;
				throw cause;
			}
			const serverRequestId = getHeader(res.headers, "x-request-id") ?? opts.requestId;
			if (!res.ok) {
				const { parsed } = await readBody(res);
				const err = coerceApiError(res, parsed);
				this.opts.telemetry?.onError?.({
					error: err,
					requestId: serverRequestId,
					url: opts.url
				});
				throw err;
			}
			const data = await this.parseResponseData(res);
			this.opts.telemetry?.onResponse?.({
				durationMs: Date.now() - opts.start,
				requestId: serverRequestId,
				status: res.status,
				url: opts.url
			});
			return {
				data,
				headers: res.headers,
				requestId: serverRequestId,
				status: res.status
			};
		} finally {
			deadline.cleanup();
		}
	}
	parseResponseData(res) {
		if ((res.headers.get("content-type") ?? "").includes("application/json")) return res.json();
		return res.text();
	}
};

//#endregion
export { ValidationError as C, UnsupportedRuntimeError as S, RemoteFetchTooLargeError as _, parseRes as a, StreamError as b, ConduitError as c, InvalidSourceError as d, JobCanceledError as f, RemoteFetchTimeoutError as g, RemoteFetchError as h, parseReq as i, InitializationError as l, RateLimitError as m, randomId as n, ApiError as o, JobFailedError as p, withDeadline as r, AuthError as s, Transport as t, InsufficientCreditsError as u, RequestAbortedError as v, WebhookVerificationError as w, TimeoutError as x, SourceError as y };
//# sourceMappingURL=transport-DqgfUztT.mjs.map