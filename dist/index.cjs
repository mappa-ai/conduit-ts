Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

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
//#region ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/core/core.js
/** A special constant with type `never` */
const NEVER = Object.freeze({ status: "aborted" });
function $constructor(name, initializer, params) {
	function init(inst, def) {
		if (!inst._zod) Object.defineProperty(inst, "_zod", {
			value: {
				def,
				constr: _,
				traits: /* @__PURE__ */ new Set()
			},
			enumerable: false
		});
		if (inst._zod.traits.has(name)) return;
		inst._zod.traits.add(name);
		initializer(inst, def);
		const proto = _.prototype;
		const keys = Object.keys(proto);
		for (let i = 0; i < keys.length; i++) {
			const k = keys[i];
			if (!(k in inst)) inst[k] = proto[k].bind(inst);
		}
	}
	const Parent = params?.Parent ?? Object;
	class Definition extends Parent {}
	Object.defineProperty(Definition, "name", { value: name });
	function _(def) {
		var _a;
		const inst = params?.Parent ? new Definition() : this;
		init(inst, def);
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		for (const fn of inst._zod.deferred) fn();
		return inst;
	}
	Object.defineProperty(_, "init", { value: init });
	Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
		if (params?.Parent && inst instanceof params.Parent) return true;
		return inst?._zod?.traits?.has(name);
	} });
	Object.defineProperty(_, "name", { value: name });
	return _;
}
var $ZodAsyncError = class extends Error {
	constructor() {
		super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
	}
};
var $ZodEncodeError = class extends Error {
	constructor(name) {
		super(`Encountered unidirectional transform during encode: ${name}`);
		this.name = "ZodEncodeError";
	}
};
const globalConfig = {};
function config(newConfig) {
	if (newConfig) Object.assign(globalConfig, newConfig);
	return globalConfig;
}

//#endregion
//#region ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/core/util.js
function getEnumValues(entries) {
	const numericValues = Object.values(entries).filter((v) => typeof v === "number");
	return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
}
function jsonStringifyReplacer(_, value) {
	if (typeof value === "bigint") return value.toString();
	return value;
}
function cached(getter) {
	return { get value() {
		{
			const value = getter();
			Object.defineProperty(this, "value", { value });
			return value;
		}
		throw new Error("cached value already set");
	} };
}
function nullish(input) {
	return input === null || input === void 0;
}
function cleanRegex(source) {
	const start = source.startsWith("^") ? 1 : 0;
	const end = source.endsWith("$") ? source.length - 1 : source.length;
	return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
	const valDecCount = (val.toString().split(".")[1] || "").length;
	const stepString = step.toString();
	let stepDecCount = (stepString.split(".")[1] || "").length;
	if (stepDecCount === 0 && /\d?e-\d?/.test(stepString)) {
		const match = stepString.match(/\d?e-(\d?)/);
		if (match?.[1]) stepDecCount = Number.parseInt(match[1]);
	}
	const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
	return Number.parseInt(val.toFixed(decCount).replace(".", "")) % Number.parseInt(step.toFixed(decCount).replace(".", "")) / 10 ** decCount;
}
const EVALUATING = Symbol("evaluating");
function defineLazy(object, key, getter) {
	let value = void 0;
	Object.defineProperty(object, key, {
		get() {
			if (value === EVALUATING) return;
			if (value === void 0) {
				value = EVALUATING;
				value = getter();
			}
			return value;
		},
		set(v) {
			Object.defineProperty(object, key, { value: v });
		},
		configurable: true
	});
}
function assignProp(target, prop, value) {
	Object.defineProperty(target, prop, {
		value,
		writable: true,
		enumerable: true,
		configurable: true
	});
}
function mergeDefs(...defs) {
	const mergedDescriptors = {};
	for (const def of defs) {
		const descriptors = Object.getOwnPropertyDescriptors(def);
		Object.assign(mergedDescriptors, descriptors);
	}
	return Object.defineProperties({}, mergedDescriptors);
}
function esc(str) {
	return JSON.stringify(str);
}
function slugify(input) {
	return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
const captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
function isObject$1(data) {
	return typeof data === "object" && data !== null && !Array.isArray(data);
}
const allowsEval = cached(() => {
	if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
	try {
		new Function("");
		return true;
	} catch (_) {
		return false;
	}
});
function isPlainObject(o) {
	if (isObject$1(o) === false) return false;
	const ctor = o.constructor;
	if (ctor === void 0) return true;
	if (typeof ctor !== "function") return true;
	const prot = ctor.prototype;
	if (isObject$1(prot) === false) return false;
	if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
	return true;
}
function shallowClone(o) {
	if (isPlainObject(o)) return { ...o };
	if (Array.isArray(o)) return [...o];
	return o;
}
const propertyKeyTypes = new Set([
	"string",
	"number",
	"symbol"
]);
function escapeRegex(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
	const cl = new inst._zod.constr(def ?? inst._zod.def);
	if (!def || params?.parent) cl._zod.parent = inst;
	return cl;
}
function normalizeParams(_params) {
	const params = _params;
	if (!params) return {};
	if (typeof params === "string") return { error: () => params };
	if (params?.message !== void 0) {
		if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
		params.error = params.message;
	}
	delete params.message;
	if (typeof params.error === "string") return {
		...params,
		error: () => params.error
	};
	return params;
}
function optionalKeys(shape) {
	return Object.keys(shape).filter((k) => {
		return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
	});
}
const NUMBER_FORMAT_RANGES = {
	safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
	int32: [-2147483648, 2147483647],
	uint32: [0, 4294967295],
	float32: [-34028234663852886e22, 34028234663852886e22],
	float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
};
function pick(schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
	return clone(schema, mergeDefs(schema._zod.def, {
		get shape() {
			const newShape = {};
			for (const key in mask) {
				if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
				if (!mask[key]) continue;
				newShape[key] = currDef.shape[key];
			}
			assignProp(this, "shape", newShape);
			return newShape;
		},
		checks: []
	}));
}
function omit(schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	if (checks && checks.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
	return clone(schema, mergeDefs(schema._zod.def, {
		get shape() {
			const newShape = { ...schema._zod.def.shape };
			for (const key in mask) {
				if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
				if (!mask[key]) continue;
				delete newShape[key];
			}
			assignProp(this, "shape", newShape);
			return newShape;
		},
		checks: []
	}));
}
function extend(schema, shape) {
	if (!isPlainObject(shape)) throw new Error("Invalid input to extend: expected a plain object");
	const checks = schema._zod.def.checks;
	if (checks && checks.length > 0) {
		const existingShape = schema._zod.def.shape;
		for (const key in shape) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
	}
	return clone(schema, mergeDefs(schema._zod.def, { get shape() {
		const _shape = {
			...schema._zod.def.shape,
			...shape
		};
		assignProp(this, "shape", _shape);
		return _shape;
	} }));
}
function safeExtend(schema, shape) {
	if (!isPlainObject(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
	return clone(schema, mergeDefs(schema._zod.def, { get shape() {
		const _shape = {
			...schema._zod.def.shape,
			...shape
		};
		assignProp(this, "shape", _shape);
		return _shape;
	} }));
}
function merge(a, b) {
	return clone(a, mergeDefs(a._zod.def, {
		get shape() {
			const _shape = {
				...a._zod.def.shape,
				...b._zod.def.shape
			};
			assignProp(this, "shape", _shape);
			return _shape;
		},
		get catchall() {
			return b._zod.def.catchall;
		},
		checks: []
	}));
}
function partial(Class, schema, mask) {
	const checks = schema._zod.def.checks;
	if (checks && checks.length > 0) throw new Error(".partial() cannot be used on object schemas containing refinements");
	return clone(schema, mergeDefs(schema._zod.def, {
		get shape() {
			const oldShape = schema._zod.def.shape;
			const shape = { ...oldShape };
			if (mask) for (const key in mask) {
				if (!(key in oldShape)) throw new Error(`Unrecognized key: "${key}"`);
				if (!mask[key]) continue;
				shape[key] = Class ? new Class({
					type: "optional",
					innerType: oldShape[key]
				}) : oldShape[key];
			}
			else for (const key in oldShape) shape[key] = Class ? new Class({
				type: "optional",
				innerType: oldShape[key]
			}) : oldShape[key];
			assignProp(this, "shape", shape);
			return shape;
		},
		checks: []
	}));
}
function required(Class, schema, mask) {
	return clone(schema, mergeDefs(schema._zod.def, { get shape() {
		const oldShape = schema._zod.def.shape;
		const shape = { ...oldShape };
		if (mask) for (const key in mask) {
			if (!(key in shape)) throw new Error(`Unrecognized key: "${key}"`);
			if (!mask[key]) continue;
			shape[key] = new Class({
				type: "nonoptional",
				innerType: oldShape[key]
			});
		}
		else for (const key in oldShape) shape[key] = new Class({
			type: "nonoptional",
			innerType: oldShape[key]
		});
		assignProp(this, "shape", shape);
		return shape;
	} }));
}
function aborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
	return false;
}
function prefixIssues(path, issues) {
	return issues.map((iss) => {
		var _a;
		(_a = iss).path ?? (_a.path = []);
		iss.path.unshift(path);
		return iss;
	});
}
function unwrapMessage(message) {
	return typeof message === "string" ? message : message?.message;
}
function finalizeIssue(iss, ctx, config) {
	const full = {
		...iss,
		path: iss.path ?? []
	};
	if (!iss.message) full.message = unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
	delete full.inst;
	delete full.continue;
	if (!ctx?.reportInput) delete full.input;
	return full;
}
function getLengthableOrigin(input) {
	if (Array.isArray(input)) return "array";
	if (typeof input === "string") return "string";
	return "unknown";
}
function issue(...args) {
	const [iss, input, inst] = args;
	if (typeof iss === "string") return {
		message: iss,
		code: "custom",
		input,
		inst
	};
	return { ...iss };
}

//#endregion
//#region ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/core/errors.js
const initializer$1 = (inst, def) => {
	inst.name = "$ZodError";
	Object.defineProperty(inst, "_zod", {
		value: inst._zod,
		enumerable: false
	});
	Object.defineProperty(inst, "issues", {
		value: def,
		enumerable: false
	});
	inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
	Object.defineProperty(inst, "toString", {
		value: () => inst.message,
		enumerable: false
	});
};
const $ZodError = $constructor("$ZodError", initializer$1);
const $ZodRealError = $constructor("$ZodError", initializer$1, { Parent: Error });
function flattenError(error, mapper = (issue) => issue.message) {
	const fieldErrors = {};
	const formErrors = [];
	for (const sub of error.issues) if (sub.path.length > 0) {
		fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
		fieldErrors[sub.path[0]].push(mapper(sub));
	} else formErrors.push(mapper(sub));
	return {
		formErrors,
		fieldErrors
	};
}
function formatError(error, mapper = (issue) => issue.message) {
	const fieldErrors = { _errors: [] };
	const processError = (error) => {
		for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }));
		else if (issue.code === "invalid_key") processError({ issues: issue.issues });
		else if (issue.code === "invalid_element") processError({ issues: issue.issues });
		else if (issue.path.length === 0) fieldErrors._errors.push(mapper(issue));
		else {
			let curr = fieldErrors;
			let i = 0;
			while (i < issue.path.length) {
				const el = issue.path[i];
				if (!(i === issue.path.length - 1)) curr[el] = curr[el] || { _errors: [] };
				else {
					curr[el] = curr[el] || { _errors: [] };
					curr[el]._errors.push(mapper(issue));
				}
				curr = curr[el];
				i++;
			}
		}
	};
	processError(error);
	return fieldErrors;
}

//#endregion
//#region ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/core/parse.js
const _parse = (_Err) => (schema, value, _ctx, _params) => {
	const ctx = _ctx ? Object.assign(_ctx, { async: false }) : { async: false };
	const result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) throw new $ZodAsyncError();
	if (result.issues.length) {
		const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
		captureStackTrace(e, _params?.callee);
		throw e;
	}
	return result.value;
};
const parse$1 = /* @__PURE__ */ _parse($ZodRealError);
const _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
	const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
	let result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) result = await result;
	if (result.issues.length) {
		const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
		captureStackTrace(e, params?.callee);
		throw e;
	}
	return result.value;
};
const parseAsync$1 = /* @__PURE__ */ _parseAsync($ZodRealError);
const _safeParse = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: false
	} : { async: false };
	const result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) throw new $ZodAsyncError();
	return result.issues.length ? {
		success: false,
		error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	} : {
		success: true,
		data: result.value
	};
};
const safeParse$1 = /* @__PURE__ */ _safeParse($ZodRealError);
const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
	let result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) result = await result;
	return result.issues.length ? {
		success: false,
		error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	} : {
		success: true,
		data: result.value
	};
};
const safeParseAsync$1 = /* @__PURE__ */ _safeParseAsync($ZodRealError);
const _encode = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
	return _parse(_Err)(schema, value, ctx);
};
const encode$1 = /* @__PURE__ */ _encode($ZodRealError);
const _decode = (_Err) => (schema, value, _ctx) => {
	return _parse(_Err)(schema, value, _ctx);
};
const decode$1 = /* @__PURE__ */ _decode($ZodRealError);
const _encodeAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
	return _parseAsync(_Err)(schema, value, ctx);
};
const encodeAsync$1 = /* @__PURE__ */ _encodeAsync($ZodRealError);
const _decodeAsync = (_Err) => async (schema, value, _ctx) => {
	return _parseAsync(_Err)(schema, value, _ctx);
};
const decodeAsync$1 = /* @__PURE__ */ _decodeAsync($ZodRealError);
const _safeEncode = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
	return _safeParse(_Err)(schema, value, ctx);
};
const safeEncode$1 = /* @__PURE__ */ _safeEncode($ZodRealError);
const _safeDecode = (_Err) => (schema, value, _ctx) => {
	return _safeParse(_Err)(schema, value, _ctx);
};
const safeDecode$1 = /* @__PURE__ */ _safeDecode($ZodRealError);
const _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
	return _safeParseAsync(_Err)(schema, value, ctx);
};
const safeEncodeAsync$1 = /* @__PURE__ */ _safeEncodeAsync($ZodRealError);
const _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
	return _safeParseAsync(_Err)(schema, value, _ctx);
};
const safeDecodeAsync$1 = /* @__PURE__ */ _safeDecodeAsync($ZodRealError);

//#endregion
//#region ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/core/regexes.js
const cuid = /^[cC][^\s-]{8,}$/;
const cuid2 = /^[0-9a-z]+$/;
const ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
const xid = /^[0-9a-vA-V]{20}$/;
const ksuid = /^[A-Za-z0-9]{27}$/;
const nanoid = /^[a-zA-Z0-9_-]{21}$/;
/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
const duration$1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
const guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
/** Returns a regex for validating an RFC 9562/4122 UUID.
*
* @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
const uuid = (version) => {
	if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
	return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
/** Practical email validation */
const email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
const _emoji$1 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
function emoji() {
	return new RegExp(_emoji$1, "u");
}
const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
const base64url = /^[A-Za-z0-9_-]*$/;
const e164 = /^\+[1-9]\d{6,14}$/;
const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
const date$1 = /* @__PURE__ */ new RegExp(`^${dateSource}$`);
function timeSource(args) {
	const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
	return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function time$1(args) {
	return new RegExp(`^${timeSource(args)}$`);
}
function datetime$1(args) {
	const time = timeSource({ precision: args.precision });
	const opts = ["Z"];
	if (args.local) opts.push("");
	if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
	const timeRegex = `${time}(?:${opts.join("|")})`;
	return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
const string$1 = (params) => {
	const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
	return new RegExp(`^${regex}$`);
};
const integer = /^-?\d+$/;
const number$2 = /^-?\d+(?:\.\d+)?$/;
const boolean$2 = /^(?:true|false)$/i;
const lowercase = /^[^A-Z]*$/;
const uppercase = /^[^a-z]*$/;

//#endregion
//#region ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/core/checks.js
const $ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def) => {
	var _a;
	inst._zod ?? (inst._zod = {});
	inst._zod.def = def;
	(_a = inst._zod).onattach ?? (_a.onattach = []);
});
const numericOriginMap = {
	number: "number",
	bigint: "bigint",
	object: "date"
};
const $ZodCheckLessThan = /* @__PURE__ */ $constructor("$ZodCheckLessThan", (inst, def) => {
	$ZodCheck.init(inst, def);
	const origin = numericOriginMap[typeof def.value];
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
		if (def.value < curr) if (def.inclusive) bag.maximum = def.value;
		else bag.exclusiveMaximum = def.value;
	});
	inst._zod.check = (payload) => {
		if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
		payload.issues.push({
			origin,
			code: "too_big",
			maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
			input: payload.value,
			inclusive: def.inclusive,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckGreaterThan = /* @__PURE__ */ $constructor("$ZodCheckGreaterThan", (inst, def) => {
	$ZodCheck.init(inst, def);
	const origin = numericOriginMap[typeof def.value];
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
		if (def.value > curr) if (def.inclusive) bag.minimum = def.value;
		else bag.exclusiveMinimum = def.value;
	});
	inst._zod.check = (payload) => {
		if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
		payload.issues.push({
			origin,
			code: "too_small",
			minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
			input: payload.value,
			inclusive: def.inclusive,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckMultipleOf = /* @__PURE__ */ $constructor("$ZodCheckMultipleOf", (inst, def) => {
	$ZodCheck.init(inst, def);
	inst._zod.onattach.push((inst) => {
		var _a;
		(_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
	});
	inst._zod.check = (payload) => {
		if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
		if (typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0) return;
		payload.issues.push({
			origin: typeof payload.value,
			code: "not_multiple_of",
			divisor: def.value,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckNumberFormat = /* @__PURE__ */ $constructor("$ZodCheckNumberFormat", (inst, def) => {
	$ZodCheck.init(inst, def);
	def.format = def.format || "float64";
	const isInt = def.format?.includes("int");
	const origin = isInt ? "int" : "number";
	const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.format = def.format;
		bag.minimum = minimum;
		bag.maximum = maximum;
		if (isInt) bag.pattern = integer;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		if (isInt) {
			if (!Number.isInteger(input)) {
				payload.issues.push({
					expected: origin,
					format: def.format,
					code: "invalid_type",
					continue: false,
					input,
					inst
				});
				return;
			}
			if (!Number.isSafeInteger(input)) {
				if (input > 0) payload.issues.push({
					input,
					code: "too_big",
					maximum: Number.MAX_SAFE_INTEGER,
					note: "Integers must be within the safe integer range.",
					inst,
					origin,
					inclusive: true,
					continue: !def.abort
				});
				else payload.issues.push({
					input,
					code: "too_small",
					minimum: Number.MIN_SAFE_INTEGER,
					note: "Integers must be within the safe integer range.",
					inst,
					origin,
					inclusive: true,
					continue: !def.abort
				});
				return;
			}
		}
		if (input < minimum) payload.issues.push({
			origin: "number",
			input,
			code: "too_small",
			minimum,
			inclusive: true,
			inst,
			continue: !def.abort
		});
		if (input > maximum) payload.issues.push({
			origin: "number",
			input,
			code: "too_big",
			maximum,
			inclusive: true,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = (payload) => {
		const val = payload.value;
		return !nullish(val) && val.length !== void 0;
	});
	inst._zod.onattach.push((inst) => {
		const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
		if (def.maximum < curr) inst._zod.bag.maximum = def.maximum;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		if (input.length <= def.maximum) return;
		const origin = getLengthableOrigin(input);
		payload.issues.push({
			origin,
			code: "too_big",
			maximum: def.maximum,
			inclusive: true,
			input,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckMinLength = /* @__PURE__ */ $constructor("$ZodCheckMinLength", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = (payload) => {
		const val = payload.value;
		return !nullish(val) && val.length !== void 0;
	});
	inst._zod.onattach.push((inst) => {
		const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
		if (def.minimum > curr) inst._zod.bag.minimum = def.minimum;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		if (input.length >= def.minimum) return;
		const origin = getLengthableOrigin(input);
		payload.issues.push({
			origin,
			code: "too_small",
			minimum: def.minimum,
			inclusive: true,
			input,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckLengthEquals = /* @__PURE__ */ $constructor("$ZodCheckLengthEquals", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = (payload) => {
		const val = payload.value;
		return !nullish(val) && val.length !== void 0;
	});
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.minimum = def.length;
		bag.maximum = def.length;
		bag.length = def.length;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		const length = input.length;
		if (length === def.length) return;
		const origin = getLengthableOrigin(input);
		const tooBig = length > def.length;
		payload.issues.push({
			origin,
			...tooBig ? {
				code: "too_big",
				maximum: def.length
			} : {
				code: "too_small",
				minimum: def.length
			},
			inclusive: true,
			exact: true,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckStringFormat = /* @__PURE__ */ $constructor("$ZodCheckStringFormat", (inst, def) => {
	var _a, _b;
	$ZodCheck.init(inst, def);
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.format = def.format;
		if (def.pattern) {
			bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
			bag.patterns.add(def.pattern);
		}
	});
	if (def.pattern) (_a = inst._zod).check ?? (_a.check = (payload) => {
		def.pattern.lastIndex = 0;
		if (def.pattern.test(payload.value)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: def.format,
			input: payload.value,
			...def.pattern ? { pattern: def.pattern.toString() } : {},
			inst,
			continue: !def.abort
		});
	});
	else (_b = inst._zod).check ?? (_b.check = () => {});
});
const $ZodCheckRegex = /* @__PURE__ */ $constructor("$ZodCheckRegex", (inst, def) => {
	$ZodCheckStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		def.pattern.lastIndex = 0;
		if (def.pattern.test(payload.value)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "regex",
			input: payload.value,
			pattern: def.pattern.toString(),
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckLowerCase = /* @__PURE__ */ $constructor("$ZodCheckLowerCase", (inst, def) => {
	def.pattern ?? (def.pattern = lowercase);
	$ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckUpperCase = /* @__PURE__ */ $constructor("$ZodCheckUpperCase", (inst, def) => {
	def.pattern ?? (def.pattern = uppercase);
	$ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckIncludes = /* @__PURE__ */ $constructor("$ZodCheckIncludes", (inst, def) => {
	$ZodCheck.init(inst, def);
	const escapedRegex = escapeRegex(def.includes);
	const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
	def.pattern = pattern;
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
		bag.patterns.add(pattern);
	});
	inst._zod.check = (payload) => {
		if (payload.value.includes(def.includes, def.position)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "includes",
			includes: def.includes,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckStartsWith = /* @__PURE__ */ $constructor("$ZodCheckStartsWith", (inst, def) => {
	$ZodCheck.init(inst, def);
	const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
	def.pattern ?? (def.pattern = pattern);
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
		bag.patterns.add(pattern);
	});
	inst._zod.check = (payload) => {
		if (payload.value.startsWith(def.prefix)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "starts_with",
			prefix: def.prefix,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckEndsWith = /* @__PURE__ */ $constructor("$ZodCheckEndsWith", (inst, def) => {
	$ZodCheck.init(inst, def);
	const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
	def.pattern ?? (def.pattern = pattern);
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
		bag.patterns.add(pattern);
	});
	inst._zod.check = (payload) => {
		if (payload.value.endsWith(def.suffix)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "ends_with",
			suffix: def.suffix,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def) => {
	$ZodCheck.init(inst, def);
	inst._zod.check = (payload) => {
		payload.value = def.tx(payload.value);
	};
});

//#endregion
//#region ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/core/doc.js
var Doc = class {
	constructor(args = []) {
		this.content = [];
		this.indent = 0;
		if (this) this.args = args;
	}
	indented(fn) {
		this.indent += 1;
		fn(this);
		this.indent -= 1;
	}
	write(arg) {
		if (typeof arg === "function") {
			arg(this, { execution: "sync" });
			arg(this, { execution: "async" });
			return;
		}
		const lines = arg.split("\n").filter((x) => x);
		const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
		const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
		for (const line of dedented) this.content.push(line);
	}
	compile() {
		const F = Function;
		const args = this?.args;
		const lines = [...(this?.content ?? [``]).map((x) => `  ${x}`)];
		return new F(...args, lines.join("\n"));
	}
};

//#endregion
//#region ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/core/versions.js
const version = {
	major: 4,
	minor: 3,
	patch: 6
};

//#endregion
//#region ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/core/schemas.js
const $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
	var _a;
	inst ?? (inst = {});
	inst._zod.def = def;
	inst._zod.bag = inst._zod.bag || {};
	inst._zod.version = version;
	const checks = [...inst._zod.def.checks ?? []];
	if (inst._zod.traits.has("$ZodCheck")) checks.unshift(inst);
	for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
	if (checks.length === 0) {
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		inst._zod.deferred?.push(() => {
			inst._zod.run = inst._zod.parse;
		});
	} else {
		const runChecks = (payload, checks, ctx) => {
			let isAborted = aborted(payload);
			let asyncResult;
			for (const ch of checks) {
				if (ch._zod.def.when) {
					if (!ch._zod.def.when(payload)) continue;
				} else if (isAborted) continue;
				const currLen = payload.issues.length;
				const _ = ch._zod.check(payload);
				if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
				if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
					await _;
					if (payload.issues.length === currLen) return;
					if (!isAborted) isAborted = aborted(payload, currLen);
				});
				else {
					if (payload.issues.length === currLen) continue;
					if (!isAborted) isAborted = aborted(payload, currLen);
				}
			}
			if (asyncResult) return asyncResult.then(() => {
				return payload;
			});
			return payload;
		};
		const handleCanaryResult = (canary, payload, ctx) => {
			if (aborted(canary)) {
				canary.aborted = true;
				return canary;
			}
			const checkResult = runChecks(payload, checks, ctx);
			if (checkResult instanceof Promise) {
				if (ctx.async === false) throw new $ZodAsyncError();
				return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
			}
			return inst._zod.parse(checkResult, ctx);
		};
		inst._zod.run = (payload, ctx) => {
			if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
			if (ctx.direction === "backward") {
				const canary = inst._zod.parse({
					value: payload.value,
					issues: []
				}, {
					...ctx,
					skipChecks: true
				});
				if (canary instanceof Promise) return canary.then((canary) => {
					return handleCanaryResult(canary, payload, ctx);
				});
				return handleCanaryResult(canary, payload, ctx);
			}
			const result = inst._zod.parse(payload, ctx);
			if (result instanceof Promise) {
				if (ctx.async === false) throw new $ZodAsyncError();
				return result.then((result) => runChecks(result, checks, ctx));
			}
			return runChecks(result, checks, ctx);
		};
	}
	defineLazy(inst, "~standard", () => ({
		validate: (value) => {
			try {
				const r = safeParse$1(inst, value);
				return r.success ? { value: r.data } : { issues: r.error?.issues };
			} catch (_) {
				return safeParseAsync$1(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
			}
		},
		vendor: "zod",
		version: 1
	}));
});
const $ZodString = /* @__PURE__ */ $constructor("$ZodString", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$1(inst._zod.bag);
	inst._zod.parse = (payload, _) => {
		if (def.coerce) try {
			payload.value = String(payload.value);
		} catch (_) {}
		if (typeof payload.value === "string") return payload;
		payload.issues.push({
			expected: "string",
			code: "invalid_type",
			input: payload.value,
			inst
		});
		return payload;
	};
});
const $ZodStringFormat = /* @__PURE__ */ $constructor("$ZodStringFormat", (inst, def) => {
	$ZodCheckStringFormat.init(inst, def);
	$ZodString.init(inst, def);
});
const $ZodGUID = /* @__PURE__ */ $constructor("$ZodGUID", (inst, def) => {
	def.pattern ?? (def.pattern = guid);
	$ZodStringFormat.init(inst, def);
});
const $ZodUUID = /* @__PURE__ */ $constructor("$ZodUUID", (inst, def) => {
	if (def.version) {
		const v = {
			v1: 1,
			v2: 2,
			v3: 3,
			v4: 4,
			v5: 5,
			v6: 6,
			v7: 7,
			v8: 8
		}[def.version];
		if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
		def.pattern ?? (def.pattern = uuid(v));
	} else def.pattern ?? (def.pattern = uuid());
	$ZodStringFormat.init(inst, def);
});
const $ZodEmail = /* @__PURE__ */ $constructor("$ZodEmail", (inst, def) => {
	def.pattern ?? (def.pattern = email);
	$ZodStringFormat.init(inst, def);
});
const $ZodURL = /* @__PURE__ */ $constructor("$ZodURL", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		try {
			const trimmed = payload.value.trim();
			const url = new URL(trimmed);
			if (def.hostname) {
				def.hostname.lastIndex = 0;
				if (!def.hostname.test(url.hostname)) payload.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid hostname",
					pattern: def.hostname.source,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			}
			if (def.protocol) {
				def.protocol.lastIndex = 0;
				if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) payload.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid protocol",
					pattern: def.protocol.source,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			}
			if (def.normalize) payload.value = url.href;
			else payload.value = trimmed;
			return;
		} catch (_) {
			payload.issues.push({
				code: "invalid_format",
				format: "url",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		}
	};
});
const $ZodEmoji = /* @__PURE__ */ $constructor("$ZodEmoji", (inst, def) => {
	def.pattern ?? (def.pattern = emoji());
	$ZodStringFormat.init(inst, def);
});
const $ZodNanoID = /* @__PURE__ */ $constructor("$ZodNanoID", (inst, def) => {
	def.pattern ?? (def.pattern = nanoid);
	$ZodStringFormat.init(inst, def);
});
const $ZodCUID = /* @__PURE__ */ $constructor("$ZodCUID", (inst, def) => {
	def.pattern ?? (def.pattern = cuid);
	$ZodStringFormat.init(inst, def);
});
const $ZodCUID2 = /* @__PURE__ */ $constructor("$ZodCUID2", (inst, def) => {
	def.pattern ?? (def.pattern = cuid2);
	$ZodStringFormat.init(inst, def);
});
const $ZodULID = /* @__PURE__ */ $constructor("$ZodULID", (inst, def) => {
	def.pattern ?? (def.pattern = ulid);
	$ZodStringFormat.init(inst, def);
});
const $ZodXID = /* @__PURE__ */ $constructor("$ZodXID", (inst, def) => {
	def.pattern ?? (def.pattern = xid);
	$ZodStringFormat.init(inst, def);
});
const $ZodKSUID = /* @__PURE__ */ $constructor("$ZodKSUID", (inst, def) => {
	def.pattern ?? (def.pattern = ksuid);
	$ZodStringFormat.init(inst, def);
});
const $ZodISODateTime = /* @__PURE__ */ $constructor("$ZodISODateTime", (inst, def) => {
	def.pattern ?? (def.pattern = datetime$1(def));
	$ZodStringFormat.init(inst, def);
});
const $ZodISODate = /* @__PURE__ */ $constructor("$ZodISODate", (inst, def) => {
	def.pattern ?? (def.pattern = date$1);
	$ZodStringFormat.init(inst, def);
});
const $ZodISOTime = /* @__PURE__ */ $constructor("$ZodISOTime", (inst, def) => {
	def.pattern ?? (def.pattern = time$1(def));
	$ZodStringFormat.init(inst, def);
});
const $ZodISODuration = /* @__PURE__ */ $constructor("$ZodISODuration", (inst, def) => {
	def.pattern ?? (def.pattern = duration$1);
	$ZodStringFormat.init(inst, def);
});
const $ZodIPv4 = /* @__PURE__ */ $constructor("$ZodIPv4", (inst, def) => {
	def.pattern ?? (def.pattern = ipv4);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.format = `ipv4`;
});
const $ZodIPv6 = /* @__PURE__ */ $constructor("$ZodIPv6", (inst, def) => {
	def.pattern ?? (def.pattern = ipv6);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.format = `ipv6`;
	inst._zod.check = (payload) => {
		try {
			new URL(`http://[${payload.value}]`);
		} catch {
			payload.issues.push({
				code: "invalid_format",
				format: "ipv6",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		}
	};
});
const $ZodCIDRv4 = /* @__PURE__ */ $constructor("$ZodCIDRv4", (inst, def) => {
	def.pattern ?? (def.pattern = cidrv4);
	$ZodStringFormat.init(inst, def);
});
const $ZodCIDRv6 = /* @__PURE__ */ $constructor("$ZodCIDRv6", (inst, def) => {
	def.pattern ?? (def.pattern = cidrv6);
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		const parts = payload.value.split("/");
		try {
			if (parts.length !== 2) throw new Error();
			const [address, prefix] = parts;
			if (!prefix) throw new Error();
			const prefixNum = Number(prefix);
			if (`${prefixNum}` !== prefix) throw new Error();
			if (prefixNum < 0 || prefixNum > 128) throw new Error();
			new URL(`http://[${address}]`);
		} catch {
			payload.issues.push({
				code: "invalid_format",
				format: "cidrv6",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		}
	};
});
function isValidBase64(data) {
	if (data === "") return true;
	if (data.length % 4 !== 0) return false;
	try {
		atob(data);
		return true;
	} catch {
		return false;
	}
}
const $ZodBase64 = /* @__PURE__ */ $constructor("$ZodBase64", (inst, def) => {
	def.pattern ?? (def.pattern = base64);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.contentEncoding = "base64";
	inst._zod.check = (payload) => {
		if (isValidBase64(payload.value)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "base64",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
function isValidBase64URL(data) {
	if (!base64url.test(data)) return false;
	const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
	return isValidBase64(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
}
const $ZodBase64URL = /* @__PURE__ */ $constructor("$ZodBase64URL", (inst, def) => {
	def.pattern ?? (def.pattern = base64url);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.contentEncoding = "base64url";
	inst._zod.check = (payload) => {
		if (isValidBase64URL(payload.value)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "base64url",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodE164 = /* @__PURE__ */ $constructor("$ZodE164", (inst, def) => {
	def.pattern ?? (def.pattern = e164);
	$ZodStringFormat.init(inst, def);
});
function isValidJWT(token, algorithm = null) {
	try {
		const tokensParts = token.split(".");
		if (tokensParts.length !== 3) return false;
		const [header] = tokensParts;
		if (!header) return false;
		const parsedHeader = JSON.parse(atob(header));
		if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
		if (!parsedHeader.alg) return false;
		if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
		return true;
	} catch {
		return false;
	}
}
const $ZodJWT = /* @__PURE__ */ $constructor("$ZodJWT", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (isValidJWT(payload.value, def.alg)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "jwt",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodNumber = /* @__PURE__ */ $constructor("$ZodNumber", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = inst._zod.bag.pattern ?? number$2;
	inst._zod.parse = (payload, _ctx) => {
		if (def.coerce) try {
			payload.value = Number(payload.value);
		} catch (_) {}
		const input = payload.value;
		if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
		const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
		payload.issues.push({
			expected: "number",
			code: "invalid_type",
			input,
			inst,
			...received ? { received } : {}
		});
		return payload;
	};
});
const $ZodNumberFormat = /* @__PURE__ */ $constructor("$ZodNumberFormat", (inst, def) => {
	$ZodCheckNumberFormat.init(inst, def);
	$ZodNumber.init(inst, def);
});
const $ZodBoolean = /* @__PURE__ */ $constructor("$ZodBoolean", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = boolean$2;
	inst._zod.parse = (payload, _ctx) => {
		if (def.coerce) try {
			payload.value = Boolean(payload.value);
		} catch (_) {}
		const input = payload.value;
		if (typeof input === "boolean") return payload;
		payload.issues.push({
			expected: "boolean",
			code: "invalid_type",
			input,
			inst
		});
		return payload;
	};
});
const $ZodUnknown = /* @__PURE__ */ $constructor("$ZodUnknown", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload) => payload;
});
const $ZodNever = /* @__PURE__ */ $constructor("$ZodNever", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, _ctx) => {
		payload.issues.push({
			expected: "never",
			code: "invalid_type",
			input: payload.value,
			inst
		});
		return payload;
	};
});
function handleArrayResult(result, final, index) {
	if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
	final.value[index] = result.value;
}
const $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		if (!Array.isArray(input)) {
			payload.issues.push({
				expected: "array",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = Array(input.length);
		const proms = [];
		for (let i = 0; i < input.length; i++) {
			const item = input[i];
			const result = def.element._zod.run({
				value: item,
				issues: []
			}, ctx);
			if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
			else handleArrayResult(result, payload, i);
		}
		if (proms.length) return Promise.all(proms).then(() => payload);
		return payload;
	};
});
function handlePropertyResult(result, final, key, input, isOptionalOut) {
	if (result.issues.length) {
		if (isOptionalOut && !(key in input)) return;
		final.issues.push(...prefixIssues(key, result.issues));
	}
	if (result.value === void 0) {
		if (key in input) final.value[key] = void 0;
	} else final.value[key] = result.value;
}
function normalizeDef(def) {
	const keys = Object.keys(def.shape);
	for (const k of keys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
	const okeys = optionalKeys(def.shape);
	return {
		...def,
		keys,
		keySet: new Set(keys),
		numKeys: keys.length,
		optionalKeys: new Set(okeys)
	};
}
function handleCatchall(proms, input, payload, ctx, def, inst) {
	const unrecognized = [];
	const keySet = def.keySet;
	const _catchall = def.catchall._zod;
	const t = _catchall.def.type;
	const isOptionalOut = _catchall.optout === "optional";
	for (const key in input) {
		if (keySet.has(key)) continue;
		if (t === "never") {
			unrecognized.push(key);
			continue;
		}
		const r = _catchall.run({
			value: input[key],
			issues: []
		}, ctx);
		if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalOut)));
		else handlePropertyResult(r, payload, key, input, isOptionalOut);
	}
	if (unrecognized.length) payload.issues.push({
		code: "unrecognized_keys",
		keys: unrecognized,
		input,
		inst
	});
	if (!proms.length) return payload;
	return Promise.all(proms).then(() => {
		return payload;
	});
}
const $ZodObject = /* @__PURE__ */ $constructor("$ZodObject", (inst, def) => {
	$ZodType.init(inst, def);
	if (!Object.getOwnPropertyDescriptor(def, "shape")?.get) {
		const sh = def.shape;
		Object.defineProperty(def, "shape", { get: () => {
			const newSh = { ...sh };
			Object.defineProperty(def, "shape", { value: newSh });
			return newSh;
		} });
	}
	const _normalized = cached(() => normalizeDef(def));
	defineLazy(inst._zod, "propValues", () => {
		const shape = def.shape;
		const propValues = {};
		for (const key in shape) {
			const field = shape[key]._zod;
			if (field.values) {
				propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
				for (const v of field.values) propValues[key].add(v);
			}
		}
		return propValues;
	});
	const isObject = isObject$1;
	const catchall = def.catchall;
	let value;
	inst._zod.parse = (payload, ctx) => {
		value ?? (value = _normalized.value);
		const input = payload.value;
		if (!isObject(input)) {
			payload.issues.push({
				expected: "object",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = {};
		const proms = [];
		const shape = value.shape;
		for (const key of value.keys) {
			const el = shape[key];
			const isOptionalOut = el._zod.optout === "optional";
			const r = el._zod.run({
				value: input[key],
				issues: []
			}, ctx);
			if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalOut)));
			else handlePropertyResult(r, payload, key, input, isOptionalOut);
		}
		if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
		return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
	};
});
const $ZodObjectJIT = /* @__PURE__ */ $constructor("$ZodObjectJIT", (inst, def) => {
	$ZodObject.init(inst, def);
	const superParse = inst._zod.parse;
	const _normalized = cached(() => normalizeDef(def));
	const generateFastpass = (shape) => {
		const doc = new Doc([
			"shape",
			"payload",
			"ctx"
		]);
		const normalized = _normalized.value;
		const parseStr = (key) => {
			const k = esc(key);
			return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
		};
		doc.write(`const input = payload.value;`);
		const ids = Object.create(null);
		let counter = 0;
		for (const key of normalized.keys) ids[key] = `key_${counter++}`;
		doc.write(`const newResult = {};`);
		for (const key of normalized.keys) {
			const id = ids[key];
			const k = esc(key);
			const isOptionalOut = shape[key]?._zod?.optout === "optional";
			doc.write(`const ${id} = ${parseStr(key)};`);
			if (isOptionalOut) doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
			else doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
		}
		doc.write(`payload.value = newResult;`);
		doc.write(`return payload;`);
		const fn = doc.compile();
		return (payload, ctx) => fn(shape, payload, ctx);
	};
	let fastpass;
	const isObject = isObject$1;
	const jit = !globalConfig.jitless;
	const allowsEval$1 = allowsEval;
	const fastEnabled = jit && allowsEval$1.value;
	const catchall = def.catchall;
	let value;
	inst._zod.parse = (payload, ctx) => {
		value ?? (value = _normalized.value);
		const input = payload.value;
		if (!isObject(input)) {
			payload.issues.push({
				expected: "object",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
			if (!fastpass) fastpass = generateFastpass(def.shape);
			payload = fastpass(payload, ctx);
			if (!catchall) return payload;
			return handleCatchall([], input, payload, ctx, value, inst);
		}
		return superParse(payload, ctx);
	};
});
function handleUnionResults(results, final, inst, ctx) {
	for (const result of results) if (result.issues.length === 0) {
		final.value = result.value;
		return final;
	}
	const nonaborted = results.filter((r) => !aborted(r));
	if (nonaborted.length === 1) {
		final.value = nonaborted[0].value;
		return nonaborted[0];
	}
	final.issues.push({
		code: "invalid_union",
		input: final.value,
		inst,
		errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	});
	return final;
}
const $ZodUnion = /* @__PURE__ */ $constructor("$ZodUnion", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0);
	defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
	defineLazy(inst._zod, "values", () => {
		if (def.options.every((o) => o._zod.values)) return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
	});
	defineLazy(inst._zod, "pattern", () => {
		if (def.options.every((o) => o._zod.pattern)) {
			const patterns = def.options.map((o) => o._zod.pattern);
			return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
		}
	});
	const single = def.options.length === 1;
	const first = def.options[0]._zod.run;
	inst._zod.parse = (payload, ctx) => {
		if (single) return first(payload, ctx);
		let async = false;
		const results = [];
		for (const option of def.options) {
			const result = option._zod.run({
				value: payload.value,
				issues: []
			}, ctx);
			if (result instanceof Promise) {
				results.push(result);
				async = true;
			} else {
				if (result.issues.length === 0) return result;
				results.push(result);
			}
		}
		if (!async) return handleUnionResults(results, payload, inst, ctx);
		return Promise.all(results).then((results) => {
			return handleUnionResults(results, payload, inst, ctx);
		});
	};
});
const $ZodDiscriminatedUnion = /* @__PURE__ */ $constructor("$ZodDiscriminatedUnion", (inst, def) => {
	def.inclusive = false;
	$ZodUnion.init(inst, def);
	const _super = inst._zod.parse;
	defineLazy(inst._zod, "propValues", () => {
		const propValues = {};
		for (const option of def.options) {
			const pv = option._zod.propValues;
			if (!pv || Object.keys(pv).length === 0) throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(option)}"`);
			for (const [k, v] of Object.entries(pv)) {
				if (!propValues[k]) propValues[k] = /* @__PURE__ */ new Set();
				for (const val of v) propValues[k].add(val);
			}
		}
		return propValues;
	});
	const disc = cached(() => {
		const opts = def.options;
		const map = /* @__PURE__ */ new Map();
		for (const o of opts) {
			const values = o._zod.propValues?.[def.discriminator];
			if (!values || values.size === 0) throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(o)}"`);
			for (const v of values) {
				if (map.has(v)) throw new Error(`Duplicate discriminator value "${String(v)}"`);
				map.set(v, o);
			}
		}
		return map;
	});
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		if (!isObject$1(input)) {
			payload.issues.push({
				code: "invalid_type",
				expected: "object",
				input,
				inst
			});
			return payload;
		}
		const opt = disc.value.get(input?.[def.discriminator]);
		if (opt) return opt._zod.run(payload, ctx);
		if (def.unionFallback) return _super(payload, ctx);
		payload.issues.push({
			code: "invalid_union",
			errors: [],
			note: "No matching discriminator",
			discriminator: def.discriminator,
			input,
			path: [def.discriminator],
			inst
		});
		return payload;
	};
});
const $ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		const left = def.left._zod.run({
			value: input,
			issues: []
		}, ctx);
		const right = def.right._zod.run({
			value: input,
			issues: []
		}, ctx);
		if (left instanceof Promise || right instanceof Promise) return Promise.all([left, right]).then(([left, right]) => {
			return handleIntersectionResults(payload, left, right);
		});
		return handleIntersectionResults(payload, left, right);
	};
});
function mergeValues(a, b) {
	if (a === b) return {
		valid: true,
		data: a
	};
	if (a instanceof Date && b instanceof Date && +a === +b) return {
		valid: true,
		data: a
	};
	if (isPlainObject(a) && isPlainObject(b)) {
		const bKeys = Object.keys(b);
		const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
		const newObj = {
			...a,
			...b
		};
		for (const key of sharedKeys) {
			const sharedValue = mergeValues(a[key], b[key]);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
			};
			newObj[key] = sharedValue.data;
		}
		return {
			valid: true,
			data: newObj
		};
	}
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return {
			valid: false,
			mergeErrorPath: []
		};
		const newArray = [];
		for (let index = 0; index < a.length; index++) {
			const itemA = a[index];
			const itemB = b[index];
			const sharedValue = mergeValues(itemA, itemB);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
			};
			newArray.push(sharedValue.data);
		}
		return {
			valid: true,
			data: newArray
		};
	}
	return {
		valid: false,
		mergeErrorPath: []
	};
}
function handleIntersectionResults(result, left, right) {
	const unrecKeys = /* @__PURE__ */ new Map();
	let unrecIssue;
	for (const iss of left.issues) if (iss.code === "unrecognized_keys") {
		unrecIssue ?? (unrecIssue = iss);
		for (const k of iss.keys) {
			if (!unrecKeys.has(k)) unrecKeys.set(k, {});
			unrecKeys.get(k).l = true;
		}
	} else result.issues.push(iss);
	for (const iss of right.issues) if (iss.code === "unrecognized_keys") for (const k of iss.keys) {
		if (!unrecKeys.has(k)) unrecKeys.set(k, {});
		unrecKeys.get(k).r = true;
	}
	else result.issues.push(iss);
	const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
	if (bothKeys.length && unrecIssue) result.issues.push({
		...unrecIssue,
		keys: bothKeys
	});
	if (aborted(result)) return result;
	const merged = mergeValues(left.value, right.value);
	if (!merged.valid) throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
	result.value = merged.data;
	return result;
}
const $ZodTuple = /* @__PURE__ */ $constructor("$ZodTuple", (inst, def) => {
	$ZodType.init(inst, def);
	const items = def.items;
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		if (!Array.isArray(input)) {
			payload.issues.push({
				input,
				inst,
				expected: "tuple",
				code: "invalid_type"
			});
			return payload;
		}
		payload.value = [];
		const proms = [];
		const reversedIndex = [...items].reverse().findIndex((item) => item._zod.optin !== "optional");
		const optStart = reversedIndex === -1 ? 0 : items.length - reversedIndex;
		if (!def.rest) {
			const tooBig = input.length > items.length;
			const tooSmall = input.length < optStart - 1;
			if (tooBig || tooSmall) {
				payload.issues.push({
					...tooBig ? {
						code: "too_big",
						maximum: items.length,
						inclusive: true
					} : {
						code: "too_small",
						minimum: items.length
					},
					input,
					inst,
					origin: "array"
				});
				return payload;
			}
		}
		let i = -1;
		for (const item of items) {
			i++;
			if (i >= input.length) {
				if (i >= optStart) continue;
			}
			const result = item._zod.run({
				value: input[i],
				issues: []
			}, ctx);
			if (result instanceof Promise) proms.push(result.then((result) => handleTupleResult(result, payload, i)));
			else handleTupleResult(result, payload, i);
		}
		if (def.rest) {
			const rest = input.slice(items.length);
			for (const el of rest) {
				i++;
				const result = def.rest._zod.run({
					value: el,
					issues: []
				}, ctx);
				if (result instanceof Promise) proms.push(result.then((result) => handleTupleResult(result, payload, i)));
				else handleTupleResult(result, payload, i);
			}
		}
		if (proms.length) return Promise.all(proms).then(() => payload);
		return payload;
	};
});
function handleTupleResult(result, final, index) {
	if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
	final.value[index] = result.value;
}
const $ZodRecord = /* @__PURE__ */ $constructor("$ZodRecord", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		if (!isPlainObject(input)) {
			payload.issues.push({
				expected: "record",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		const proms = [];
		const values = def.keyType._zod.values;
		if (values) {
			payload.value = {};
			const recordKeys = /* @__PURE__ */ new Set();
			for (const key of values) if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
				recordKeys.add(typeof key === "number" ? key.toString() : key);
				const result = def.valueType._zod.run({
					value: input[key],
					issues: []
				}, ctx);
				if (result instanceof Promise) proms.push(result.then((result) => {
					if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
					payload.value[key] = result.value;
				}));
				else {
					if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
					payload.value[key] = result.value;
				}
			}
			let unrecognized;
			for (const key in input) if (!recordKeys.has(key)) {
				unrecognized = unrecognized ?? [];
				unrecognized.push(key);
			}
			if (unrecognized && unrecognized.length > 0) payload.issues.push({
				code: "unrecognized_keys",
				input,
				inst,
				keys: unrecognized
			});
		} else {
			payload.value = {};
			for (const key of Reflect.ownKeys(input)) {
				if (key === "__proto__") continue;
				let keyResult = def.keyType._zod.run({
					value: key,
					issues: []
				}, ctx);
				if (keyResult instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
				if (typeof key === "string" && number$2.test(key) && keyResult.issues.length) {
					const retryResult = def.keyType._zod.run({
						value: Number(key),
						issues: []
					}, ctx);
					if (retryResult instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
					if (retryResult.issues.length === 0) keyResult = retryResult;
				}
				if (keyResult.issues.length) {
					if (def.mode === "loose") payload.value[key] = input[key];
					else payload.issues.push({
						code: "invalid_key",
						origin: "record",
						issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
						input: key,
						path: [key],
						inst
					});
					continue;
				}
				const result = def.valueType._zod.run({
					value: input[key],
					issues: []
				}, ctx);
				if (result instanceof Promise) proms.push(result.then((result) => {
					if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
					payload.value[keyResult.value] = result.value;
				}));
				else {
					if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
					payload.value[keyResult.value] = result.value;
				}
			}
		}
		if (proms.length) return Promise.all(proms).then(() => payload);
		return payload;
	};
});
const $ZodEnum = /* @__PURE__ */ $constructor("$ZodEnum", (inst, def) => {
	$ZodType.init(inst, def);
	const values = getEnumValues(def.entries);
	const valuesSet = new Set(values);
	inst._zod.values = valuesSet;
	inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
	inst._zod.parse = (payload, _ctx) => {
		const input = payload.value;
		if (valuesSet.has(input)) return payload;
		payload.issues.push({
			code: "invalid_value",
			values,
			input,
			inst
		});
		return payload;
	};
});
const $ZodLiteral = /* @__PURE__ */ $constructor("$ZodLiteral", (inst, def) => {
	$ZodType.init(inst, def);
	if (def.values.length === 0) throw new Error("Cannot create literal schema with no valid values");
	const values = new Set(def.values);
	inst._zod.values = values;
	inst._zod.pattern = new RegExp(`^(${def.values.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$`);
	inst._zod.parse = (payload, _ctx) => {
		const input = payload.value;
		if (values.has(input)) return payload;
		payload.issues.push({
			code: "invalid_value",
			values: def.values,
			input,
			inst
		});
		return payload;
	};
});
const $ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
		const _out = def.transform(payload.value, payload);
		if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
			payload.value = output;
			return payload;
		});
		if (_out instanceof Promise) throw new $ZodAsyncError();
		payload.value = _out;
		return payload;
	};
});
function handleOptionalResult(result, input) {
	if (result.issues.length && input === void 0) return {
		issues: [],
		value: void 0
	};
	return result;
}
const $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	inst._zod.optout = "optional";
	defineLazy(inst._zod, "values", () => {
		return def.innerType._zod.values ? new Set([...def.innerType._zod.values, void 0]) : void 0;
	});
	defineLazy(inst._zod, "pattern", () => {
		const pattern = def.innerType._zod.pattern;
		return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		if (def.innerType._zod.optin === "optional") {
			const result = def.innerType._zod.run(payload, ctx);
			if (result instanceof Promise) return result.then((r) => handleOptionalResult(r, payload.value));
			return handleOptionalResult(result, payload.value);
		}
		if (payload.value === void 0) return payload;
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodExactOptional = /* @__PURE__ */ $constructor("$ZodExactOptional", (inst, def) => {
	$ZodOptional.init(inst, def);
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
	inst._zod.parse = (payload, ctx) => {
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
	defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
	defineLazy(inst._zod, "pattern", () => {
		const pattern = def.innerType._zod.pattern;
		return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
	});
	defineLazy(inst._zod, "values", () => {
		return def.innerType._zod.values ? new Set([...def.innerType._zod.values, null]) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		if (payload.value === null) return payload;
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		if (payload.value === void 0) {
			payload.value = def.defaultValue;
			/**
			* $ZodDefault returns the default value immediately in forward direction.
			* It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
			return payload;
		}
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result) => handleDefaultResult(result, def));
		return handleDefaultResult(result, def);
	};
});
function handleDefaultResult(payload, def) {
	if (payload.value === void 0) payload.value = def.defaultValue;
	return payload;
}
const $ZodPrefault = /* @__PURE__ */ $constructor("$ZodPrefault", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		if (payload.value === void 0) payload.value = def.defaultValue;
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "values", () => {
		const v = def.innerType._zod.values;
		return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result) => handleNonOptionalResult(result, inst));
		return handleNonOptionalResult(result, inst);
	};
});
function handleNonOptionalResult(payload, inst) {
	if (!payload.issues.length && payload.value === void 0) payload.issues.push({
		code: "invalid_type",
		expected: "nonoptional",
		input: payload.value,
		inst
	});
	return payload;
}
const $ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
	defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result) => {
			payload.value = result.value;
			if (result.issues.length) {
				payload.value = def.catchValue({
					...payload,
					error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
					input: payload.value
				});
				payload.issues = [];
			}
			return payload;
		});
		payload.value = result.value;
		if (result.issues.length) {
			payload.value = def.catchValue({
				...payload,
				error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
				input: payload.value
			});
			payload.issues = [];
		}
		return payload;
	};
});
const $ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "values", () => def.in._zod.values);
	defineLazy(inst._zod, "optin", () => def.in._zod.optin);
	defineLazy(inst._zod, "optout", () => def.out._zod.optout);
	defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") {
			const right = def.out._zod.run(payload, ctx);
			if (right instanceof Promise) return right.then((right) => handlePipeResult(right, def.in, ctx));
			return handlePipeResult(right, def.in, ctx);
		}
		const left = def.in._zod.run(payload, ctx);
		if (left instanceof Promise) return left.then((left) => handlePipeResult(left, def.out, ctx));
		return handlePipeResult(left, def.out, ctx);
	};
});
function handlePipeResult(left, next, ctx) {
	if (left.issues.length) {
		left.aborted = true;
		return left;
	}
	return next._zod.run({
		value: left.value,
		issues: left.issues
	}, ctx);
}
const $ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
	defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then(handleReadonlyResult);
		return handleReadonlyResult(result);
	};
});
function handleReadonlyResult(payload) {
	payload.value = Object.freeze(payload.value);
	return payload;
}
const $ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def) => {
	$ZodCheck.init(inst, def);
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, _) => {
		return payload;
	};
	inst._zod.check = (payload) => {
		const input = payload.value;
		const r = def.fn(input);
		if (r instanceof Promise) return r.then((r) => handleRefineResult(r, payload, input, inst));
		handleRefineResult(r, payload, input, inst);
	};
});
function handleRefineResult(result, payload, input, inst) {
	if (!result) {
		const _iss = {
			code: "custom",
			input,
			inst,
			path: [...inst._zod.def.path ?? []],
			continue: !inst._zod.def.abort
		};
		if (inst._zod.def.params) _iss.params = inst._zod.def.params;
		payload.issues.push(issue(_iss));
	}
}

//#endregion
//#region ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/core/registries.js
var _a;
var $ZodRegistry = class {
	constructor() {
		this._map = /* @__PURE__ */ new WeakMap();
		this._idmap = /* @__PURE__ */ new Map();
	}
	add(schema, ..._meta) {
		const meta = _meta[0];
		this._map.set(schema, meta);
		if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
		return this;
	}
	clear() {
		this._map = /* @__PURE__ */ new WeakMap();
		this._idmap = /* @__PURE__ */ new Map();
		return this;
	}
	remove(schema) {
		const meta = this._map.get(schema);
		if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
		this._map.delete(schema);
		return this;
	}
	get(schema) {
		const p = schema._zod.parent;
		if (p) {
			const pm = { ...this.get(p) ?? {} };
			delete pm.id;
			const f = {
				...pm,
				...this._map.get(schema)
			};
			return Object.keys(f).length ? f : void 0;
		}
		return this._map.get(schema);
	}
	has(schema) {
		return this._map.has(schema);
	}
};
function registry() {
	return new $ZodRegistry();
}
(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
const globalRegistry = globalThis.__zod_globalRegistry;

//#endregion
//#region ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/core/api.js
/* @__NO_SIDE_EFFECTS__ */
function _string(Class, params) {
	return new Class({
		type: "string",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _email(Class, params) {
	return new Class({
		type: "string",
		format: "email",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _guid(Class, params) {
	return new Class({
		type: "string",
		format: "guid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _uuid(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _uuidv4(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v4",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _uuidv6(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v6",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _uuidv7(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v7",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _url(Class, params) {
	return new Class({
		type: "string",
		format: "url",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _emoji(Class, params) {
	return new Class({
		type: "string",
		format: "emoji",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _nanoid(Class, params) {
	return new Class({
		type: "string",
		format: "nanoid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _cuid(Class, params) {
	return new Class({
		type: "string",
		format: "cuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _cuid2(Class, params) {
	return new Class({
		type: "string",
		format: "cuid2",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _ulid(Class, params) {
	return new Class({
		type: "string",
		format: "ulid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _xid(Class, params) {
	return new Class({
		type: "string",
		format: "xid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _ksuid(Class, params) {
	return new Class({
		type: "string",
		format: "ksuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _ipv4(Class, params) {
	return new Class({
		type: "string",
		format: "ipv4",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _ipv6(Class, params) {
	return new Class({
		type: "string",
		format: "ipv6",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _cidrv4(Class, params) {
	return new Class({
		type: "string",
		format: "cidrv4",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _cidrv6(Class, params) {
	return new Class({
		type: "string",
		format: "cidrv6",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _base64(Class, params) {
	return new Class({
		type: "string",
		format: "base64",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _base64url(Class, params) {
	return new Class({
		type: "string",
		format: "base64url",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _e164(Class, params) {
	return new Class({
		type: "string",
		format: "e164",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _jwt(Class, params) {
	return new Class({
		type: "string",
		format: "jwt",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _isoDateTime(Class, params) {
	return new Class({
		type: "string",
		format: "datetime",
		check: "string_format",
		offset: false,
		local: false,
		precision: null,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _isoDate(Class, params) {
	return new Class({
		type: "string",
		format: "date",
		check: "string_format",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _isoTime(Class, params) {
	return new Class({
		type: "string",
		format: "time",
		check: "string_format",
		precision: null,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _isoDuration(Class, params) {
	return new Class({
		type: "string",
		format: "duration",
		check: "string_format",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _number(Class, params) {
	return new Class({
		type: "number",
		checks: [],
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _coercedNumber(Class, params) {
	return new Class({
		type: "number",
		coerce: true,
		checks: [],
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _int(Class, params) {
	return new Class({
		type: "number",
		check: "number_format",
		abort: false,
		format: "safeint",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _boolean(Class, params) {
	return new Class({
		type: "boolean",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _coercedBoolean(Class, params) {
	return new Class({
		type: "boolean",
		coerce: true,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _unknown(Class) {
	return new Class({ type: "unknown" });
}
/* @__NO_SIDE_EFFECTS__ */
function _never(Class, params) {
	return new Class({
		type: "never",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _lt(value, params) {
	return new $ZodCheckLessThan({
		check: "less_than",
		...normalizeParams(params),
		value,
		inclusive: false
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _lte(value, params) {
	return new $ZodCheckLessThan({
		check: "less_than",
		...normalizeParams(params),
		value,
		inclusive: true
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _gt(value, params) {
	return new $ZodCheckGreaterThan({
		check: "greater_than",
		...normalizeParams(params),
		value,
		inclusive: false
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _gte(value, params) {
	return new $ZodCheckGreaterThan({
		check: "greater_than",
		...normalizeParams(params),
		value,
		inclusive: true
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _multipleOf(value, params) {
	return new $ZodCheckMultipleOf({
		check: "multiple_of",
		...normalizeParams(params),
		value
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _maxLength(maximum, params) {
	return new $ZodCheckMaxLength({
		check: "max_length",
		...normalizeParams(params),
		maximum
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _minLength(minimum, params) {
	return new $ZodCheckMinLength({
		check: "min_length",
		...normalizeParams(params),
		minimum
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _length(length, params) {
	return new $ZodCheckLengthEquals({
		check: "length_equals",
		...normalizeParams(params),
		length
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _regex(pattern, params) {
	return new $ZodCheckRegex({
		check: "string_format",
		format: "regex",
		...normalizeParams(params),
		pattern
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _lowercase(params) {
	return new $ZodCheckLowerCase({
		check: "string_format",
		format: "lowercase",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _uppercase(params) {
	return new $ZodCheckUpperCase({
		check: "string_format",
		format: "uppercase",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _includes(includes, params) {
	return new $ZodCheckIncludes({
		check: "string_format",
		format: "includes",
		...normalizeParams(params),
		includes
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _startsWith(prefix, params) {
	return new $ZodCheckStartsWith({
		check: "string_format",
		format: "starts_with",
		...normalizeParams(params),
		prefix
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _endsWith(suffix, params) {
	return new $ZodCheckEndsWith({
		check: "string_format",
		format: "ends_with",
		...normalizeParams(params),
		suffix
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _overwrite(tx) {
	return new $ZodCheckOverwrite({
		check: "overwrite",
		tx
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _normalize(form) {
	return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
}
/* @__NO_SIDE_EFFECTS__ */
function _trim() {
	return /* @__PURE__ */ _overwrite((input) => input.trim());
}
/* @__NO_SIDE_EFFECTS__ */
function _toLowerCase() {
	return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
}
/* @__NO_SIDE_EFFECTS__ */
function _toUpperCase() {
	return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
}
/* @__NO_SIDE_EFFECTS__ */
function _slugify() {
	return /* @__PURE__ */ _overwrite((input) => slugify(input));
}
/* @__NO_SIDE_EFFECTS__ */
function _array(Class, element, params) {
	return new Class({
		type: "array",
		element,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _refine(Class, fn, _params) {
	return new Class({
		type: "custom",
		check: "custom",
		fn,
		...normalizeParams(_params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _superRefine(fn) {
	const ch = /* @__PURE__ */ _check((payload) => {
		payload.addIssue = (issue$2) => {
			if (typeof issue$2 === "string") payload.issues.push(issue(issue$2, payload.value, ch._zod.def));
			else {
				const _issue = issue$2;
				if (_issue.fatal) _issue.continue = false;
				_issue.code ?? (_issue.code = "custom");
				_issue.input ?? (_issue.input = payload.value);
				_issue.inst ?? (_issue.inst = ch);
				_issue.continue ?? (_issue.continue = !ch._zod.def.abort);
				payload.issues.push(issue(_issue));
			}
		};
		return fn(payload.value, payload);
	});
	return ch;
}
/* @__NO_SIDE_EFFECTS__ */
function _check(fn, params) {
	const ch = new $ZodCheck({
		check: "custom",
		...normalizeParams(params)
	});
	ch._zod.check = fn;
	return ch;
}
/* @__NO_SIDE_EFFECTS__ */
function describe$1(description) {
	const ch = new $ZodCheck({ check: "describe" });
	ch._zod.onattach = [(inst) => {
		const existing = globalRegistry.get(inst) ?? {};
		globalRegistry.add(inst, {
			...existing,
			description
		});
	}];
	ch._zod.check = () => {};
	return ch;
}
/* @__NO_SIDE_EFFECTS__ */
function meta$1(metadata) {
	const ch = new $ZodCheck({ check: "meta" });
	ch._zod.onattach = [(inst) => {
		const existing = globalRegistry.get(inst) ?? {};
		globalRegistry.add(inst, {
			...existing,
			...metadata
		});
	}];
	ch._zod.check = () => {};
	return ch;
}

//#endregion
//#region ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/core/to-json-schema.js
function initializeContext(params) {
	let target = params?.target ?? "draft-2020-12";
	if (target === "draft-4") target = "draft-04";
	if (target === "draft-7") target = "draft-07";
	return {
		processors: params.processors ?? {},
		metadataRegistry: params?.metadata ?? globalRegistry,
		target,
		unrepresentable: params?.unrepresentable ?? "throw",
		override: params?.override ?? (() => {}),
		io: params?.io ?? "output",
		counter: 0,
		seen: /* @__PURE__ */ new Map(),
		cycles: params?.cycles ?? "ref",
		reused: params?.reused ?? "inline",
		external: params?.external ?? void 0
	};
}
function process(schema, ctx, _params = {
	path: [],
	schemaPath: []
}) {
	var _a;
	const def = schema._zod.def;
	const seen = ctx.seen.get(schema);
	if (seen) {
		seen.count++;
		if (_params.schemaPath.includes(schema)) seen.cycle = _params.path;
		return seen.schema;
	}
	const result = {
		schema: {},
		count: 1,
		cycle: void 0,
		path: _params.path
	};
	ctx.seen.set(schema, result);
	const overrideSchema = schema._zod.toJSONSchema?.();
	if (overrideSchema) result.schema = overrideSchema;
	else {
		const params = {
			..._params,
			schemaPath: [..._params.schemaPath, schema],
			path: _params.path
		};
		if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx, result.schema, params);
		else {
			const _json = result.schema;
			const processor = ctx.processors[def.type];
			if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
			processor(schema, ctx, _json, params);
		}
		const parent = schema._zod.parent;
		if (parent) {
			if (!result.ref) result.ref = parent;
			process(parent, ctx, params);
			ctx.seen.get(parent).isParent = true;
		}
	}
	const meta = ctx.metadataRegistry.get(schema);
	if (meta) Object.assign(result.schema, meta);
	if (ctx.io === "input" && isTransforming(schema)) {
		delete result.schema.examples;
		delete result.schema.default;
	}
	if (ctx.io === "input" && result.schema._prefault) (_a = result.schema).default ?? (_a.default = result.schema._prefault);
	delete result.schema._prefault;
	return ctx.seen.get(schema).schema;
}
function extractDefs(ctx, schema) {
	const root = ctx.seen.get(schema);
	if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
	const idToSchema = /* @__PURE__ */ new Map();
	for (const entry of ctx.seen.entries()) {
		const id = ctx.metadataRegistry.get(entry[0])?.id;
		if (id) {
			const existing = idToSchema.get(id);
			if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
			idToSchema.set(id, entry[0]);
		}
	}
	const makeURI = (entry) => {
		const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
		if (ctx.external) {
			const externalId = ctx.external.registry.get(entry[0])?.id;
			const uriGenerator = ctx.external.uri ?? ((id) => id);
			if (externalId) return { ref: uriGenerator(externalId) };
			const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
			entry[1].defId = id;
			return {
				defId: id,
				ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}`
			};
		}
		if (entry[1] === root) return { ref: "#" };
		const defUriPrefix = `#/${defsSegment}/`;
		const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
		return {
			defId,
			ref: defUriPrefix + defId
		};
	};
	const extractToDef = (entry) => {
		if (entry[1].schema.$ref) return;
		const seen = entry[1];
		const { ref, defId } = makeURI(entry);
		seen.def = { ...seen.schema };
		if (defId) seen.defId = defId;
		const schema = seen.schema;
		for (const key in schema) delete schema[key];
		schema.$ref = ref;
	};
	if (ctx.cycles === "throw") for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (seen.cycle) throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
	}
	for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (schema === entry[0]) {
			extractToDef(entry);
			continue;
		}
		if (ctx.external) {
			const ext = ctx.external.registry.get(entry[0])?.id;
			if (schema !== entry[0] && ext) {
				extractToDef(entry);
				continue;
			}
		}
		if (ctx.metadataRegistry.get(entry[0])?.id) {
			extractToDef(entry);
			continue;
		}
		if (seen.cycle) {
			extractToDef(entry);
			continue;
		}
		if (seen.count > 1) {
			if (ctx.reused === "ref") {
				extractToDef(entry);
				continue;
			}
		}
	}
}
function finalize(ctx, schema) {
	const root = ctx.seen.get(schema);
	if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
	const flattenRef = (zodSchema) => {
		const seen = ctx.seen.get(zodSchema);
		if (seen.ref === null) return;
		const schema = seen.def ?? seen.schema;
		const _cached = { ...schema };
		const ref = seen.ref;
		seen.ref = null;
		if (ref) {
			flattenRef(ref);
			const refSeen = ctx.seen.get(ref);
			const refSchema = refSeen.schema;
			if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
				schema.allOf = schema.allOf ?? [];
				schema.allOf.push(refSchema);
			} else Object.assign(schema, refSchema);
			Object.assign(schema, _cached);
			if (zodSchema._zod.parent === ref) for (const key in schema) {
				if (key === "$ref" || key === "allOf") continue;
				if (!(key in _cached)) delete schema[key];
			}
			if (refSchema.$ref && refSeen.def) for (const key in schema) {
				if (key === "$ref" || key === "allOf") continue;
				if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) delete schema[key];
			}
		}
		const parent = zodSchema._zod.parent;
		if (parent && parent !== ref) {
			flattenRef(parent);
			const parentSeen = ctx.seen.get(parent);
			if (parentSeen?.schema.$ref) {
				schema.$ref = parentSeen.schema.$ref;
				if (parentSeen.def) for (const key in schema) {
					if (key === "$ref" || key === "allOf") continue;
					if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) delete schema[key];
				}
			}
		}
		ctx.override({
			zodSchema,
			jsonSchema: schema,
			path: seen.path ?? []
		});
	};
	for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
	const result = {};
	if (ctx.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
	else if (ctx.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
	else if (ctx.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
	else if (ctx.target === "openapi-3.0") {}
	if (ctx.external?.uri) {
		const id = ctx.external.registry.get(schema)?.id;
		if (!id) throw new Error("Schema is missing an `id` property");
		result.$id = ctx.external.uri(id);
	}
	Object.assign(result, root.def ?? root.schema);
	const defs = ctx.external?.defs ?? {};
	for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (seen.def && seen.defId) defs[seen.defId] = seen.def;
	}
	if (ctx.external) {} else if (Object.keys(defs).length > 0) if (ctx.target === "draft-2020-12") result.$defs = defs;
	else result.definitions = defs;
	try {
		const finalized = JSON.parse(JSON.stringify(result));
		Object.defineProperty(finalized, "~standard", {
			value: {
				...schema["~standard"],
				jsonSchema: {
					input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
					output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
				}
			},
			enumerable: false,
			writable: false
		});
		return finalized;
	} catch (_err) {
		throw new Error("Error converting schema to JSON.");
	}
}
function isTransforming(_schema, _ctx) {
	const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
	if (ctx.seen.has(_schema)) return false;
	ctx.seen.add(_schema);
	const def = _schema._zod.def;
	if (def.type === "transform") return true;
	if (def.type === "array") return isTransforming(def.element, ctx);
	if (def.type === "set") return isTransforming(def.valueType, ctx);
	if (def.type === "lazy") return isTransforming(def.getter(), ctx);
	if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") return isTransforming(def.innerType, ctx);
	if (def.type === "intersection") return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
	if (def.type === "record" || def.type === "map") return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
	if (def.type === "pipe") return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
	if (def.type === "object") {
		for (const key in def.shape) if (isTransforming(def.shape[key], ctx)) return true;
		return false;
	}
	if (def.type === "union") {
		for (const option of def.options) if (isTransforming(option, ctx)) return true;
		return false;
	}
	if (def.type === "tuple") {
		for (const item of def.items) if (isTransforming(item, ctx)) return true;
		if (def.rest && isTransforming(def.rest, ctx)) return true;
		return false;
	}
	return false;
}
/**
* Creates a toJSONSchema method for a schema instance.
* This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
*/
const createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
	const ctx = initializeContext({
		...params,
		processors
	});
	process(schema, ctx);
	extractDefs(ctx, schema);
	return finalize(ctx, schema);
};
const createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
	const { libraryOptions, target } = params ?? {};
	const ctx = initializeContext({
		...libraryOptions ?? {},
		target,
		io,
		processors
	});
	process(schema, ctx);
	extractDefs(ctx, schema);
	return finalize(ctx, schema);
};

//#endregion
//#region ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/core/json-schema-processors.js
const formatMap = {
	guid: "uuid",
	url: "uri",
	datetime: "date-time",
	json_string: "json-string",
	regex: ""
};
const stringProcessor = (schema, ctx, _json, _params) => {
	const json = _json;
	json.type = "string";
	const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
	if (typeof minimum === "number") json.minLength = minimum;
	if (typeof maximum === "number") json.maxLength = maximum;
	if (format) {
		json.format = formatMap[format] ?? format;
		if (json.format === "") delete json.format;
		if (format === "time") delete json.format;
	}
	if (contentEncoding) json.contentEncoding = contentEncoding;
	if (patterns && patterns.size > 0) {
		const regexes = [...patterns];
		if (regexes.length === 1) json.pattern = regexes[0].source;
		else if (regexes.length > 1) json.allOf = [...regexes.map((regex) => ({
			...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
			pattern: regex.source
		}))];
	}
};
const numberProcessor = (schema, ctx, _json, _params) => {
	const json = _json;
	const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
	if (typeof format === "string" && format.includes("int")) json.type = "integer";
	else json.type = "number";
	if (typeof exclusiveMinimum === "number") if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") {
		json.minimum = exclusiveMinimum;
		json.exclusiveMinimum = true;
	} else json.exclusiveMinimum = exclusiveMinimum;
	if (typeof minimum === "number") {
		json.minimum = minimum;
		if (typeof exclusiveMinimum === "number" && ctx.target !== "draft-04") if (exclusiveMinimum >= minimum) delete json.minimum;
		else delete json.exclusiveMinimum;
	}
	if (typeof exclusiveMaximum === "number") if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") {
		json.maximum = exclusiveMaximum;
		json.exclusiveMaximum = true;
	} else json.exclusiveMaximum = exclusiveMaximum;
	if (typeof maximum === "number") {
		json.maximum = maximum;
		if (typeof exclusiveMaximum === "number" && ctx.target !== "draft-04") if (exclusiveMaximum <= maximum) delete json.maximum;
		else delete json.exclusiveMaximum;
	}
	if (typeof multipleOf === "number") json.multipleOf = multipleOf;
};
const booleanProcessor = (_schema, _ctx, json, _params) => {
	json.type = "boolean";
};
const neverProcessor = (_schema, _ctx, json, _params) => {
	json.not = {};
};
const unknownProcessor = (_schema, _ctx, _json, _params) => {};
const enumProcessor = (schema, _ctx, json, _params) => {
	const def = schema._zod.def;
	const values = getEnumValues(def.entries);
	if (values.every((v) => typeof v === "number")) json.type = "number";
	if (values.every((v) => typeof v === "string")) json.type = "string";
	json.enum = values;
};
const literalProcessor = (schema, ctx, json, _params) => {
	const def = schema._zod.def;
	const vals = [];
	for (const val of def.values) if (val === void 0) {
		if (ctx.unrepresentable === "throw") throw new Error("Literal `undefined` cannot be represented in JSON Schema");
	} else if (typeof val === "bigint") if (ctx.unrepresentable === "throw") throw new Error("BigInt literals cannot be represented in JSON Schema");
	else vals.push(Number(val));
	else vals.push(val);
	if (vals.length === 0) {} else if (vals.length === 1) {
		const val = vals[0];
		json.type = val === null ? "null" : typeof val;
		if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") json.enum = [val];
		else json.const = val;
	} else {
		if (vals.every((v) => typeof v === "number")) json.type = "number";
		if (vals.every((v) => typeof v === "string")) json.type = "string";
		if (vals.every((v) => typeof v === "boolean")) json.type = "boolean";
		if (vals.every((v) => v === null)) json.type = "null";
		json.enum = vals;
	}
};
const customProcessor = (_schema, ctx, _json, _params) => {
	if (ctx.unrepresentable === "throw") throw new Error("Custom types cannot be represented in JSON Schema");
};
const transformProcessor = (_schema, ctx, _json, _params) => {
	if (ctx.unrepresentable === "throw") throw new Error("Transforms cannot be represented in JSON Schema");
};
const arrayProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	const { minimum, maximum } = schema._zod.bag;
	if (typeof minimum === "number") json.minItems = minimum;
	if (typeof maximum === "number") json.maxItems = maximum;
	json.type = "array";
	json.items = process(def.element, ctx, {
		...params,
		path: [...params.path, "items"]
	});
};
const objectProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	json.type = "object";
	json.properties = {};
	const shape = def.shape;
	for (const key in shape) json.properties[key] = process(shape[key], ctx, {
		...params,
		path: [
			...params.path,
			"properties",
			key
		]
	});
	const allKeys = new Set(Object.keys(shape));
	const requiredKeys = new Set([...allKeys].filter((key) => {
		const v = def.shape[key]._zod;
		if (ctx.io === "input") return v.optin === void 0;
		else return v.optout === void 0;
	}));
	if (requiredKeys.size > 0) json.required = Array.from(requiredKeys);
	if (def.catchall?._zod.def.type === "never") json.additionalProperties = false;
	else if (!def.catchall) {
		if (ctx.io === "output") json.additionalProperties = false;
	} else if (def.catchall) json.additionalProperties = process(def.catchall, ctx, {
		...params,
		path: [...params.path, "additionalProperties"]
	});
};
const unionProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const isExclusive = def.inclusive === false;
	const options = def.options.map((x, i) => process(x, ctx, {
		...params,
		path: [
			...params.path,
			isExclusive ? "oneOf" : "anyOf",
			i
		]
	}));
	if (isExclusive) json.oneOf = options;
	else json.anyOf = options;
};
const intersectionProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const a = process(def.left, ctx, {
		...params,
		path: [
			...params.path,
			"allOf",
			0
		]
	});
	const b = process(def.right, ctx, {
		...params,
		path: [
			...params.path,
			"allOf",
			1
		]
	});
	const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
	json.allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
};
const tupleProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	json.type = "array";
	const prefixPath = ctx.target === "draft-2020-12" ? "prefixItems" : "items";
	const restPath = ctx.target === "draft-2020-12" ? "items" : ctx.target === "openapi-3.0" ? "items" : "additionalItems";
	const prefixItems = def.items.map((x, i) => process(x, ctx, {
		...params,
		path: [
			...params.path,
			prefixPath,
			i
		]
	}));
	const rest = def.rest ? process(def.rest, ctx, {
		...params,
		path: [
			...params.path,
			restPath,
			...ctx.target === "openapi-3.0" ? [def.items.length] : []
		]
	}) : null;
	if (ctx.target === "draft-2020-12") {
		json.prefixItems = prefixItems;
		if (rest) json.items = rest;
	} else if (ctx.target === "openapi-3.0") {
		json.items = { anyOf: prefixItems };
		if (rest) json.items.anyOf.push(rest);
		json.minItems = prefixItems.length;
		if (!rest) json.maxItems = prefixItems.length;
	} else {
		json.items = prefixItems;
		if (rest) json.additionalItems = rest;
	}
	const { minimum, maximum } = schema._zod.bag;
	if (typeof minimum === "number") json.minItems = minimum;
	if (typeof maximum === "number") json.maxItems = maximum;
};
const recordProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	json.type = "object";
	const keyType = def.keyType;
	const patterns = keyType._zod.bag?.patterns;
	if (def.mode === "loose" && patterns && patterns.size > 0) {
		const valueSchema = process(def.valueType, ctx, {
			...params,
			path: [
				...params.path,
				"patternProperties",
				"*"
			]
		});
		json.patternProperties = {};
		for (const pattern of patterns) json.patternProperties[pattern.source] = valueSchema;
	} else {
		if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") json.propertyNames = process(def.keyType, ctx, {
			...params,
			path: [...params.path, "propertyNames"]
		});
		json.additionalProperties = process(def.valueType, ctx, {
			...params,
			path: [...params.path, "additionalProperties"]
		});
	}
	const keyValues = keyType._zod.values;
	if (keyValues) {
		const validKeyValues = [...keyValues].filter((v) => typeof v === "string" || typeof v === "number");
		if (validKeyValues.length > 0) json.required = validKeyValues;
	}
};
const nullableProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const inner = process(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	if (ctx.target === "openapi-3.0") {
		seen.ref = def.innerType;
		json.nullable = true;
	} else json.anyOf = [inner, { type: "null" }];
};
const nonoptionalProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	process(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
};
const defaultProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	json.default = JSON.parse(JSON.stringify(def.defaultValue));
};
const prefaultProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	if (ctx.io === "input") json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
};
const catchProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	let catchValue;
	try {
		catchValue = def.catchValue(void 0);
	} catch {
		throw new Error("Dynamic catch values are not supported in JSON Schema");
	}
	json.default = catchValue;
};
const pipeProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	const innerType = ctx.io === "input" ? def.in._zod.def.type === "transform" ? def.out : def.in : def.out;
	process(innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = innerType;
};
const readonlyProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	json.readOnly = true;
};
const optionalProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	process(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
};

//#endregion
//#region ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/classic/iso.js
const ZodISODateTime = /* @__PURE__ */ $constructor("ZodISODateTime", (inst, def) => {
	$ZodISODateTime.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function datetime(params) {
	return _isoDateTime(ZodISODateTime, params);
}
const ZodISODate = /* @__PURE__ */ $constructor("ZodISODate", (inst, def) => {
	$ZodISODate.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function date(params) {
	return _isoDate(ZodISODate, params);
}
const ZodISOTime = /* @__PURE__ */ $constructor("ZodISOTime", (inst, def) => {
	$ZodISOTime.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function time(params) {
	return _isoTime(ZodISOTime, params);
}
const ZodISODuration = /* @__PURE__ */ $constructor("ZodISODuration", (inst, def) => {
	$ZodISODuration.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function duration(params) {
	return _isoDuration(ZodISODuration, params);
}

//#endregion
//#region ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/classic/errors.js
const initializer = (inst, issues) => {
	$ZodError.init(inst, issues);
	inst.name = "ZodError";
	Object.defineProperties(inst, {
		format: { value: (mapper) => formatError(inst, mapper) },
		flatten: { value: (mapper) => flattenError(inst, mapper) },
		addIssue: { value: (issue) => {
			inst.issues.push(issue);
			inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
		} },
		addIssues: { value: (issues) => {
			inst.issues.push(...issues);
			inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
		} },
		isEmpty: { get() {
			return inst.issues.length === 0;
		} }
	});
};
const ZodError = $constructor("ZodError", initializer);
const ZodRealError = $constructor("ZodError", initializer, { Parent: Error });

//#endregion
//#region ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/classic/parse.js
const parse = /* @__PURE__ */ _parse(ZodRealError);
const parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
const safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
const safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
const encode = /* @__PURE__ */ _encode(ZodRealError);
const decode = /* @__PURE__ */ _decode(ZodRealError);
const encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
const decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
const safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
const safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
const safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
const safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);

//#endregion
//#region ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/classic/schemas.js
const ZodType = /* @__PURE__ */ $constructor("ZodType", (inst, def) => {
	$ZodType.init(inst, def);
	Object.assign(inst["~standard"], { jsonSchema: {
		input: createStandardJSONSchemaMethod(inst, "input"),
		output: createStandardJSONSchemaMethod(inst, "output")
	} });
	inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
	inst.def = def;
	inst.type = def.type;
	Object.defineProperty(inst, "_def", { value: def });
	inst.check = (...checks) => {
		return inst.clone(mergeDefs(def, { checks: [...def.checks ?? [], ...checks.map((ch) => typeof ch === "function" ? { _zod: {
			check: ch,
			def: { check: "custom" },
			onattach: []
		} } : ch)] }), { parent: true });
	};
	inst.with = inst.check;
	inst.clone = (def, params) => clone(inst, def, params);
	inst.brand = () => inst;
	inst.register = ((reg, meta) => {
		reg.add(inst, meta);
		return inst;
	});
	inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
	inst.safeParse = (data, params) => safeParse(inst, data, params);
	inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
	inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
	inst.spa = inst.safeParseAsync;
	inst.encode = (data, params) => encode(inst, data, params);
	inst.decode = (data, params) => decode(inst, data, params);
	inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
	inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
	inst.safeEncode = (data, params) => safeEncode(inst, data, params);
	inst.safeDecode = (data, params) => safeDecode(inst, data, params);
	inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
	inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
	inst.refine = (check, params) => inst.check(refine(check, params));
	inst.superRefine = (refinement) => inst.check(superRefine(refinement));
	inst.overwrite = (fn) => inst.check(_overwrite(fn));
	inst.optional = () => optional(inst);
	inst.exactOptional = () => exactOptional(inst);
	inst.nullable = () => nullable(inst);
	inst.nullish = () => optional(nullable(inst));
	inst.nonoptional = (params) => nonoptional(inst, params);
	inst.array = () => array(inst);
	inst.or = (arg) => union([inst, arg]);
	inst.and = (arg) => intersection(inst, arg);
	inst.transform = (tx) => pipe(inst, transform(tx));
	inst.default = (def) => _default(inst, def);
	inst.prefault = (def) => prefault(inst, def);
	inst.catch = (params) => _catch(inst, params);
	inst.pipe = (target) => pipe(inst, target);
	inst.readonly = () => readonly(inst);
	inst.describe = (description) => {
		const cl = inst.clone();
		globalRegistry.add(cl, { description });
		return cl;
	};
	Object.defineProperty(inst, "description", {
		get() {
			return globalRegistry.get(inst)?.description;
		},
		configurable: true
	});
	inst.meta = (...args) => {
		if (args.length === 0) return globalRegistry.get(inst);
		const cl = inst.clone();
		globalRegistry.add(cl, args[0]);
		return cl;
	};
	inst.isOptional = () => inst.safeParse(void 0).success;
	inst.isNullable = () => inst.safeParse(null).success;
	inst.apply = (fn) => fn(inst);
	return inst;
});
/** @internal */
const _ZodString = /* @__PURE__ */ $constructor("_ZodString", (inst, def) => {
	$ZodString.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
	const bag = inst._zod.bag;
	inst.format = bag.format ?? null;
	inst.minLength = bag.minimum ?? null;
	inst.maxLength = bag.maximum ?? null;
	inst.regex = (...args) => inst.check(_regex(...args));
	inst.includes = (...args) => inst.check(_includes(...args));
	inst.startsWith = (...args) => inst.check(_startsWith(...args));
	inst.endsWith = (...args) => inst.check(_endsWith(...args));
	inst.min = (...args) => inst.check(_minLength(...args));
	inst.max = (...args) => inst.check(_maxLength(...args));
	inst.length = (...args) => inst.check(_length(...args));
	inst.nonempty = (...args) => inst.check(_minLength(1, ...args));
	inst.lowercase = (params) => inst.check(_lowercase(params));
	inst.uppercase = (params) => inst.check(_uppercase(params));
	inst.trim = () => inst.check(_trim());
	inst.normalize = (...args) => inst.check(_normalize(...args));
	inst.toLowerCase = () => inst.check(_toLowerCase());
	inst.toUpperCase = () => inst.check(_toUpperCase());
	inst.slugify = () => inst.check(_slugify());
});
const ZodString = /* @__PURE__ */ $constructor("ZodString", (inst, def) => {
	$ZodString.init(inst, def);
	_ZodString.init(inst, def);
	inst.email = (params) => inst.check(_email(ZodEmail, params));
	inst.url = (params) => inst.check(_url(ZodURL, params));
	inst.jwt = (params) => inst.check(_jwt(ZodJWT, params));
	inst.emoji = (params) => inst.check(_emoji(ZodEmoji, params));
	inst.guid = (params) => inst.check(_guid(ZodGUID, params));
	inst.uuid = (params) => inst.check(_uuid(ZodUUID, params));
	inst.uuidv4 = (params) => inst.check(_uuidv4(ZodUUID, params));
	inst.uuidv6 = (params) => inst.check(_uuidv6(ZodUUID, params));
	inst.uuidv7 = (params) => inst.check(_uuidv7(ZodUUID, params));
	inst.nanoid = (params) => inst.check(_nanoid(ZodNanoID, params));
	inst.guid = (params) => inst.check(_guid(ZodGUID, params));
	inst.cuid = (params) => inst.check(_cuid(ZodCUID, params));
	inst.cuid2 = (params) => inst.check(_cuid2(ZodCUID2, params));
	inst.ulid = (params) => inst.check(_ulid(ZodULID, params));
	inst.base64 = (params) => inst.check(_base64(ZodBase64, params));
	inst.base64url = (params) => inst.check(_base64url(ZodBase64URL, params));
	inst.xid = (params) => inst.check(_xid(ZodXID, params));
	inst.ksuid = (params) => inst.check(_ksuid(ZodKSUID, params));
	inst.ipv4 = (params) => inst.check(_ipv4(ZodIPv4, params));
	inst.ipv6 = (params) => inst.check(_ipv6(ZodIPv6, params));
	inst.cidrv4 = (params) => inst.check(_cidrv4(ZodCIDRv4, params));
	inst.cidrv6 = (params) => inst.check(_cidrv6(ZodCIDRv6, params));
	inst.e164 = (params) => inst.check(_e164(ZodE164, params));
	inst.datetime = (params) => inst.check(datetime(params));
	inst.date = (params) => inst.check(date(params));
	inst.time = (params) => inst.check(time(params));
	inst.duration = (params) => inst.check(duration(params));
});
function string(params) {
	return _string(ZodString, params);
}
const ZodStringFormat = /* @__PURE__ */ $constructor("ZodStringFormat", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	_ZodString.init(inst, def);
});
const ZodEmail = /* @__PURE__ */ $constructor("ZodEmail", (inst, def) => {
	$ZodEmail.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodGUID = /* @__PURE__ */ $constructor("ZodGUID", (inst, def) => {
	$ZodGUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodUUID = /* @__PURE__ */ $constructor("ZodUUID", (inst, def) => {
	$ZodUUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodURL = /* @__PURE__ */ $constructor("ZodURL", (inst, def) => {
	$ZodURL.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function url(params) {
	return _url(ZodURL, params);
}
const ZodEmoji = /* @__PURE__ */ $constructor("ZodEmoji", (inst, def) => {
	$ZodEmoji.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodNanoID = /* @__PURE__ */ $constructor("ZodNanoID", (inst, def) => {
	$ZodNanoID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodCUID = /* @__PURE__ */ $constructor("ZodCUID", (inst, def) => {
	$ZodCUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodCUID2 = /* @__PURE__ */ $constructor("ZodCUID2", (inst, def) => {
	$ZodCUID2.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodULID = /* @__PURE__ */ $constructor("ZodULID", (inst, def) => {
	$ZodULID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodXID = /* @__PURE__ */ $constructor("ZodXID", (inst, def) => {
	$ZodXID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodKSUID = /* @__PURE__ */ $constructor("ZodKSUID", (inst, def) => {
	$ZodKSUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodIPv4 = /* @__PURE__ */ $constructor("ZodIPv4", (inst, def) => {
	$ZodIPv4.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodIPv6 = /* @__PURE__ */ $constructor("ZodIPv6", (inst, def) => {
	$ZodIPv6.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodCIDRv4 = /* @__PURE__ */ $constructor("ZodCIDRv4", (inst, def) => {
	$ZodCIDRv4.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodCIDRv6 = /* @__PURE__ */ $constructor("ZodCIDRv6", (inst, def) => {
	$ZodCIDRv6.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodBase64 = /* @__PURE__ */ $constructor("ZodBase64", (inst, def) => {
	$ZodBase64.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodBase64URL = /* @__PURE__ */ $constructor("ZodBase64URL", (inst, def) => {
	$ZodBase64URL.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodE164 = /* @__PURE__ */ $constructor("ZodE164", (inst, def) => {
	$ZodE164.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodJWT = /* @__PURE__ */ $constructor("ZodJWT", (inst, def) => {
	$ZodJWT.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodNumber = /* @__PURE__ */ $constructor("ZodNumber", (inst, def) => {
	$ZodNumber.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
	inst.gt = (value, params) => inst.check(_gt(value, params));
	inst.gte = (value, params) => inst.check(_gte(value, params));
	inst.min = (value, params) => inst.check(_gte(value, params));
	inst.lt = (value, params) => inst.check(_lt(value, params));
	inst.lte = (value, params) => inst.check(_lte(value, params));
	inst.max = (value, params) => inst.check(_lte(value, params));
	inst.int = (params) => inst.check(int(params));
	inst.safe = (params) => inst.check(int(params));
	inst.positive = (params) => inst.check(_gt(0, params));
	inst.nonnegative = (params) => inst.check(_gte(0, params));
	inst.negative = (params) => inst.check(_lt(0, params));
	inst.nonpositive = (params) => inst.check(_lte(0, params));
	inst.multipleOf = (value, params) => inst.check(_multipleOf(value, params));
	inst.step = (value, params) => inst.check(_multipleOf(value, params));
	inst.finite = () => inst;
	const bag = inst._zod.bag;
	inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
	inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
	inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? .5);
	inst.isFinite = true;
	inst.format = bag.format ?? null;
});
function number$1(params) {
	return _number(ZodNumber, params);
}
const ZodNumberFormat = /* @__PURE__ */ $constructor("ZodNumberFormat", (inst, def) => {
	$ZodNumberFormat.init(inst, def);
	ZodNumber.init(inst, def);
});
function int(params) {
	return _int(ZodNumberFormat, params);
}
const ZodBoolean = /* @__PURE__ */ $constructor("ZodBoolean", (inst, def) => {
	$ZodBoolean.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
});
function boolean$1(params) {
	return _boolean(ZodBoolean, params);
}
const ZodUnknown = /* @__PURE__ */ $constructor("ZodUnknown", (inst, def) => {
	$ZodUnknown.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => unknownProcessor(inst, ctx, json, params);
});
function unknown() {
	return _unknown(ZodUnknown);
}
const ZodNever = /* @__PURE__ */ $constructor("ZodNever", (inst, def) => {
	$ZodNever.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
});
function never(params) {
	return _never(ZodNever, params);
}
const ZodArray = /* @__PURE__ */ $constructor("ZodArray", (inst, def) => {
	$ZodArray.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
	inst.element = def.element;
	inst.min = (minLength, params) => inst.check(_minLength(minLength, params));
	inst.nonempty = (params) => inst.check(_minLength(1, params));
	inst.max = (maxLength, params) => inst.check(_maxLength(maxLength, params));
	inst.length = (len, params) => inst.check(_length(len, params));
	inst.unwrap = () => inst.element;
});
function array(element, params) {
	return _array(ZodArray, element, params);
}
const ZodObject = /* @__PURE__ */ $constructor("ZodObject", (inst, def) => {
	$ZodObjectJIT.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
	defineLazy(inst, "shape", () => {
		return def.shape;
	});
	inst.keyof = () => _enum(Object.keys(inst._zod.def.shape));
	inst.catchall = (catchall) => inst.clone({
		...inst._zod.def,
		catchall
	});
	inst.passthrough = () => inst.clone({
		...inst._zod.def,
		catchall: unknown()
	});
	inst.loose = () => inst.clone({
		...inst._zod.def,
		catchall: unknown()
	});
	inst.strict = () => inst.clone({
		...inst._zod.def,
		catchall: never()
	});
	inst.strip = () => inst.clone({
		...inst._zod.def,
		catchall: void 0
	});
	inst.extend = (incoming) => {
		return extend(inst, incoming);
	};
	inst.safeExtend = (incoming) => {
		return safeExtend(inst, incoming);
	};
	inst.merge = (other) => merge(inst, other);
	inst.pick = (mask) => pick(inst, mask);
	inst.omit = (mask) => omit(inst, mask);
	inst.partial = (...args) => partial(ZodOptional, inst, args[0]);
	inst.required = (...args) => required(ZodNonOptional, inst, args[0]);
});
function object(shape, params) {
	return new ZodObject({
		type: "object",
		shape: shape ?? {},
		...normalizeParams(params)
	});
}
const ZodUnion = /* @__PURE__ */ $constructor("ZodUnion", (inst, def) => {
	$ZodUnion.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
	inst.options = def.options;
});
function union(options, params) {
	return new ZodUnion({
		type: "union",
		options,
		...normalizeParams(params)
	});
}
const ZodDiscriminatedUnion = /* @__PURE__ */ $constructor("ZodDiscriminatedUnion", (inst, def) => {
	ZodUnion.init(inst, def);
	$ZodDiscriminatedUnion.init(inst, def);
});
function discriminatedUnion(discriminator, options, params) {
	return new ZodDiscriminatedUnion({
		type: "union",
		options,
		discriminator,
		...normalizeParams(params)
	});
}
const ZodIntersection = /* @__PURE__ */ $constructor("ZodIntersection", (inst, def) => {
	$ZodIntersection.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
});
function intersection(left, right) {
	return new ZodIntersection({
		type: "intersection",
		left,
		right
	});
}
const ZodTuple = /* @__PURE__ */ $constructor("ZodTuple", (inst, def) => {
	$ZodTuple.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => tupleProcessor(inst, ctx, json, params);
	inst.rest = (rest) => inst.clone({
		...inst._zod.def,
		rest
	});
});
function tuple(items, _paramsOrRest, _params) {
	const hasRest = _paramsOrRest instanceof $ZodType;
	const params = hasRest ? _params : _paramsOrRest;
	return new ZodTuple({
		type: "tuple",
		items,
		rest: hasRest ? _paramsOrRest : null,
		...normalizeParams(params)
	});
}
const ZodRecord = /* @__PURE__ */ $constructor("ZodRecord", (inst, def) => {
	$ZodRecord.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => recordProcessor(inst, ctx, json, params);
	inst.keyType = def.keyType;
	inst.valueType = def.valueType;
});
function record(keyType, valueType, params) {
	return new ZodRecord({
		type: "record",
		keyType,
		valueType,
		...normalizeParams(params)
	});
}
const ZodEnum = /* @__PURE__ */ $constructor("ZodEnum", (inst, def) => {
	$ZodEnum.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
	inst.enum = def.entries;
	inst.options = Object.values(def.entries);
	const keys = new Set(Object.keys(def.entries));
	inst.extract = (values, params) => {
		const newEntries = {};
		for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
		else throw new Error(`Key ${value} not found in enum`);
		return new ZodEnum({
			...def,
			checks: [],
			...normalizeParams(params),
			entries: newEntries
		});
	};
	inst.exclude = (values, params) => {
		const newEntries = { ...def.entries };
		for (const value of values) if (keys.has(value)) delete newEntries[value];
		else throw new Error(`Key ${value} not found in enum`);
		return new ZodEnum({
			...def,
			checks: [],
			...normalizeParams(params),
			entries: newEntries
		});
	};
});
function _enum(values, params) {
	return new ZodEnum({
		type: "enum",
		entries: Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values,
		...normalizeParams(params)
	});
}
const ZodLiteral = /* @__PURE__ */ $constructor("ZodLiteral", (inst, def) => {
	$ZodLiteral.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
	inst.values = new Set(def.values);
	Object.defineProperty(inst, "value", { get() {
		if (def.values.length > 1) throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
		return def.values[0];
	} });
});
function literal(value, params) {
	return new ZodLiteral({
		type: "literal",
		values: Array.isArray(value) ? value : [value],
		...normalizeParams(params)
	});
}
const ZodTransform = /* @__PURE__ */ $constructor("ZodTransform", (inst, def) => {
	$ZodTransform.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
	inst._zod.parse = (payload, _ctx) => {
		if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
		payload.addIssue = (issue$1) => {
			if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, def));
			else {
				const _issue = issue$1;
				if (_issue.fatal) _issue.continue = false;
				_issue.code ?? (_issue.code = "custom");
				_issue.input ?? (_issue.input = payload.value);
				_issue.inst ?? (_issue.inst = inst);
				payload.issues.push(issue(_issue));
			}
		};
		const output = def.transform(payload.value, payload);
		if (output instanceof Promise) return output.then((output) => {
			payload.value = output;
			return payload;
		});
		payload.value = output;
		return payload;
	};
});
function transform(fn) {
	return new ZodTransform({
		type: "transform",
		transform: fn
	});
}
const ZodOptional = /* @__PURE__ */ $constructor("ZodOptional", (inst, def) => {
	$ZodOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
	return new ZodOptional({
		type: "optional",
		innerType
	});
}
const ZodExactOptional = /* @__PURE__ */ $constructor("ZodExactOptional", (inst, def) => {
	$ZodExactOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional(innerType) {
	return new ZodExactOptional({
		type: "optional",
		innerType
	});
}
const ZodNullable = /* @__PURE__ */ $constructor("ZodNullable", (inst, def) => {
	$ZodNullable.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
	return new ZodNullable({
		type: "nullable",
		innerType
	});
}
const ZodDefault = /* @__PURE__ */ $constructor("ZodDefault", (inst, def) => {
	$ZodDefault.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
	inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
	return new ZodDefault({
		type: "default",
		innerType,
		get defaultValue() {
			return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
		}
	});
}
const ZodPrefault = /* @__PURE__ */ $constructor("ZodPrefault", (inst, def) => {
	$ZodPrefault.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
	return new ZodPrefault({
		type: "prefault",
		innerType,
		get defaultValue() {
			return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
		}
	});
}
const ZodNonOptional = /* @__PURE__ */ $constructor("ZodNonOptional", (inst, def) => {
	$ZodNonOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
	return new ZodNonOptional({
		type: "nonoptional",
		innerType,
		...normalizeParams(params)
	});
}
const ZodCatch = /* @__PURE__ */ $constructor("ZodCatch", (inst, def) => {
	$ZodCatch.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
	inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
	return new ZodCatch({
		type: "catch",
		innerType,
		catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
	});
}
const ZodPipe = /* @__PURE__ */ $constructor("ZodPipe", (inst, def) => {
	$ZodPipe.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
	inst.in = def.in;
	inst.out = def.out;
});
function pipe(in_, out) {
	return new ZodPipe({
		type: "pipe",
		in: in_,
		out
	});
}
const ZodReadonly = /* @__PURE__ */ $constructor("ZodReadonly", (inst, def) => {
	$ZodReadonly.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
	return new ZodReadonly({
		type: "readonly",
		innerType
	});
}
const ZodCustom = /* @__PURE__ */ $constructor("ZodCustom", (inst, def) => {
	$ZodCustom.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
});
function refine(fn, _params = {}) {
	return _refine(ZodCustom, fn, _params);
}
function superRefine(fn) {
	return _superRefine(fn);
}
const describe = describe$1;
const meta = meta$1;

//#endregion
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
//#region ../contracts/dist/v1/entities.mjs
/**
* Entities module Zod schemas and types.
*
* Provides workspace-scoped labels for entities (speaker fingerprints).
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
//#region ../contracts/dist/v1/files.mjs
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
	if (!value.trim()) throw new InvalidSourceError("source.url must be a non-empty string", { code: "invalid_source" });
	let url;
	try {
		url = new URL(value);
	} catch {
		throw new InvalidSourceError("source.url must be a valid URL", { code: "invalid_source" });
	}
	if (url.protocol !== "http:" && url.protocol !== "https:") throw new InvalidSourceError("source.url must use http: or https:", { code: "invalid_source" });
	return url;
}
async function readPathSource(value, maxSourceBytes) {
	if (!value.trim()) throw new InvalidSourceError("source.path must be a non-empty string", { code: "invalid_source" });
	let fs;
	let p;
	try {
		fs = await import("node:fs/promises");
		p = await import("node:path");
	} catch (cause) {
		throw new UnsupportedRuntimeError("source.path is not supported in this runtime", {
			cause,
			code: "unsupported_runtime"
		});
	}
	const path = p.resolve(value);
	const stat = await fs.stat(path).catch((cause) => {
		throw new InvalidSourceError(`source.path could not be read: ${path}`, {
			cause,
			code: "invalid_source"
		});
	});
	if (stat.isDirectory()) throw new InvalidSourceError("source.path must point to a file", { code: "invalid_source" });
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
		if (!response.ok) throw new RemoteFetchError(`Failed to download source.url (status ${response.status})`, {
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
	throw new RemoteFetchError("Failed to download source.url", {
		code: "remote_fetch_failed",
		url: start.toString()
	});
}
function readRedirect(response, url, hops) {
	if (!REDIRECT_STATUSES.has(response.status)) return null;
	if (hops === 5) throw new RemoteFetchError("source.url exceeded the redirect limit", {
		code: "remote_fetch_redirect_limit",
		status: response.status,
		url: url.toString()
	});
	const next = response.headers.get("location");
	if (!next) throw new RemoteFetchError("source.url returned a redirect without a location header", {
		code: "remote_fetch_failed",
		status: response.status,
		url: url.toString()
	});
	return new URL(next, url);
}
async function fetchWithTimeout(url, opts) {
	const ctrl = new AbortController();
	const timeout = setTimeout(() => {
		ctrl.abort(new RemoteFetchTimeoutError("source.url timed out while downloading", {
			code: "remote_fetch_timeout",
			url: url.toString()
		}));
	}, opts.timeoutMs);
	if (opts.signal?.aborted) {
		clearTimeout(timeout);
		throw new RequestAbortedError("source.url download was aborted", { code: "request_aborted" });
	}
	opts.signal?.addEventListener("abort", () => ctrl.abort(new RequestAbortedError("source.url download was aborted", { code: "request_aborted" })), { once: true });
	try {
		return await opts.fetchImpl(url.toString(), {
			method: "GET",
			redirect: "manual",
			signal: ctrl.signal
		});
	} catch (cause) {
		if (ctrl.signal.aborted && ctrl.signal.reason instanceof Error) throw ctrl.signal.reason;
		throw new RemoteFetchError("Failed to download source.url", {
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
		if (typeof Response === "undefined") throw new UnsupportedRuntimeError("ReadableStream upload requires Response to convert stream to Blob", { code: "unsupported_runtime" });
		const blob = await new Response(file).blob();
		assertWithinLimit(blob.size, maxSourceBytes, { kind: "source.file" });
		return blob;
	}
	throw new InvalidSourceError("Unsupported file type for upload()", { code: "invalid_source" });
}
function assertWithinLimit(size, maxSourceBytes, opts) {
	if (size <= maxSourceBytes) return;
	throw new RemoteFetchTooLargeError(`${opts.kind} exceeds the supported upload limit of ${maxSourceBytes} bytes`, {
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
		this.timeoutMs = opts?.timeoutMs ?? 3e4;
		this.maxSourceBytes = opts?.maxSourceBytes ?? DEFAULT_MAX_SOURCE_BYTES;
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
//#region ../contracts/dist/v1/jobs.mjs
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
//#region src/utils/index.ts
function getHeader$1(headers, name) {
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
//#region ../contracts/dist/v1/reports.mjs
const targetSelector$1 = object({
	entity_id: string().min(1).max(256).trim().nullish(),
	hint: string().min(1).max(1024).trim().nullish(),
	on_miss: _enum(["fallback_dominant", "error"]).default("error"),
	strategy: _enum([
		"dominant",
		"timerange",
		"entity_id",
		"magic_hint"
	]),
	timerange: object({
		end_seconds: number$1().min(0).nullish(),
		start_seconds: number$1().min(0).nullish()
	}).nullish()
}).refine((data) => {
	if (data.strategy === "entity_id" && !data.entity_id) return false;
	if (data.strategy === "magic_hint" && (!data.hint || data.hint.trim() === "")) return false;
	return true;
}, { message: "entity_id is required for entity_id strategy, hint is required for magic_hint strategy" });
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
	output: object({ template: _enum(["sales_playbook", "general_report"]) }).strict()
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
//#region ../contracts/dist/matching-analysis-BU0fQbjl.mjs
const targetSelector = targetSelector$1;
const matchingContext = literal("hiring_team_fit");
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
		return {
			strategy: target.strategy,
			...target.onMiss ? { on_miss: target.onMiss } : {},
			hint: target.hint
		};
	}
};
function validateMatchingRequest(req) {
	if (req.context !== "hiring_team_fit") throw new ConduitError("context must be hiring_team_fit", { code: "invalid_request" });
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
	return {
		hint: selector.hint ?? "",
		onMiss: selector.on_miss,
		strategy: "magic_hint"
	};
}
function validateTarget$1(target) {
	if (target.strategy === "timerange") {
		if (!target.timeRange) throw new ConduitError("target.timeRange is required for timerange", { code: "invalid_request" });
		const start = target.timeRange.startSeconds;
		const end = target.timeRange.endSeconds;
		if (start === void 0 && end === void 0) throw new ConduitError("target.timeRange must include startSeconds or endSeconds", { code: "invalid_request" });
		if (start !== void 0 && end !== void 0 && !(start < end)) throw new ConduitError("target.timeRange.startSeconds must be less than endSeconds", { code: "invalid_request" });
		return;
	}
	if (target.strategy === "entity_id" && !target.entityId.trim()) throw new ConduitError("target.entityId is required for entity_id", { code: "invalid_request" });
	if (target.strategy === "magic_hint" && !target.hint.trim()) throw new ConduitError("target.hint is required for magic_hint", { code: "invalid_request" });
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
	return {
		strategy: target.strategy,
		...target.onMiss ? { on_miss: target.onMiss } : {},
		hint: target.hint
	};
}
function validateTarget(target) {
	if (target.strategy === "timerange") {
		if (!target.timeRange) throw new ConduitError("target.timeRange is required for timerange", { code: "invalid_request" });
		const start = target.timeRange.startSeconds;
		const end = target.timeRange.endSeconds;
		if (start === void 0 && end === void 0) throw new ConduitError("target.timeRange must include startSeconds or endSeconds", { code: "invalid_request" });
		if (start !== void 0 && end !== void 0 && !(start < end)) throw new ConduitError("target.timeRange.startSeconds must be less than endSeconds", { code: "invalid_request" });
		return;
	}
	if (target.strategy === "entity_id" && !target.entityId.trim()) throw new ConduitError("target.entityId is required for entity_id", { code: "invalid_request" });
	if (target.strategy === "magic_hint" && !target.hint.trim()) throw new ConduitError("target.hint is required for magic_hint", { code: "invalid_request" });
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
		output: {
			json: report.json ?? null,
			markdown: report.markdown ?? null,
			template: report.output.template
		}
	};
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
			"Mappa-Api-Key": this.opts.apiKey,
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
			"Mappa-Api-Key": this.opts.apiKey,
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
			const serverRequestId = getHeader$1(res.headers, "x-request-id") ?? opts.requestId;
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
		const timeoutMs = options.timeoutMs ?? 3e4;
		const maxRetries = options.maxRetries ?? 2;
		const maxSourceBytes = options.maxSourceBytes ?? DEFAULT_MAX_SOURCE_BYTES;
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
exports.ApiError = ApiError;
exports.AuthError = AuthError;
exports.Conduit = Conduit;
exports.ConduitError = ConduitError;
exports.InitializationError = InitializationError;
exports.InsufficientCreditsError = InsufficientCreditsError;
exports.InvalidSourceError = InvalidSourceError;
exports.JobCanceledError = JobCanceledError;
exports.JobFailedError = JobFailedError;
exports.RateLimitError = RateLimitError;
exports.RemoteFetchError = RemoteFetchError;
exports.RemoteFetchTimeoutError = RemoteFetchTimeoutError;
exports.RemoteFetchTooLargeError = RemoteFetchTooLargeError;
exports.RequestAbortedError = RequestAbortedError;
exports.SourceError = SourceError;
exports.StreamError = StreamError;
exports.TimeoutError = TimeoutError;
exports.UnsupportedRuntimeError = UnsupportedRuntimeError;
exports.ValidationError = ValidationError;
exports.WebhookVerificationError = WebhookVerificationError;
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