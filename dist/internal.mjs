import { A as JobCanceledError, B as UnsupportedRuntimeError, D as InitializationError, E as ConduitError, F as RemoteFetchTooLargeError, H as WebhookVerificationError, I as RequestAbortedError, L as SourceError, M as RateLimitError, N as RemoteFetchError, O as InsufficientCreditsError, P as RemoteFetchTimeoutError, R as StreamError, T as AuthError, V as ValidationError, a as parseRes, c as _enum, g as string, j as JobFailedError, k as InvalidSourceError, m as object, p as number, t as Transport, w as ApiError, x as datetime, z as TimeoutError } from "./transport-B3eMQvcw.mjs";

//#region ../contracts/dist/bin-score-Dl-oPeFK.mjs
const EDGE_MAP = {
	achievement: [
		0,
		.3,
		.5,
		.6,
		.8,
		1
	],
	agreeablenessFacet: [
		.020833333333333315,
		.4375,
		.5520833333333334,
		.625,
		.7291666666666667,
		1
	],
	agreeablenessFlexibility: [
		.08333333333333331,
		.41666666666666663,
		.5,
		.5833333333333334,
		.75,
		1
	],
	agreeablenessForgiveness: [
		0,
		.25,
		.5,
		.625,
		.75,
		1
	],
	agreeablenessGentleness: [
		0,
		.41666666666666663,
		.5833333333333334,
		.6666666666666666,
		.75,
		1
	],
	agreeablenessPatience: [
		0,
		.5,
		.625,
		.75,
		.875,
		1
	],
	aloofIntroverted: [
		0,
		.375,
		.5,
		.625,
		.8125,
		1
	],
	arrogantCalculating: [
		0,
		.125,
		.1875,
		.3125,
		.4375,
		.9375
	],
	basDrive: [
		0,
		.4166666666666667,
		.5,
		.6666666666666666,
		.75,
		1
	],
	basFunSeeking: [
		0,
		.4166666666666667,
		.5833333333333334,
		.6666666666666666,
		.75,
		1
	],
	basRewardResponsiveness: [
		.06666666666666665,
		.6666666666666666,
		.7999999999999999,
		.8666666666666667,
		.9333333333333332,
		1
	],
	benevolence: [
		0,
		.1,
		.2,
		.3,
		.9
	],
	bis: [
		0,
		.4761904761904761,
		.6190476190476191,
		.7619047619047619,
		.8571428571428572,
		1
	],
	caregiver: [
		0,
		.6151682633259641,
		.7040162122328667,
		.75,
		.8409604519774012,
		1
	],
	cognitiveReappraisal: [
		0,
		.6111111111111112,
		.6944444444444445,
		.8055555555555555,
		.8611111111111112,
		1
	],
	coldHearted: [
		0,
		.25,
		.3125,
		.4375,
		.5,
		.9375
	],
	conformity: [
		0,
		.2,
		.4,
		.5,
		.7,
		1
	],
	conscientiousnessDiligence: [
		.125,
		.625,
		.75,
		.875,
		1
	],
	conscientiousnessFacet: [
		.17708333333333337,
		.5750000000000001,
		.6770833333333333,
		.7291666666666667,
		.8229166666666665,
		1
	],
	conscientiousnessOrganization: [
		0,
		.5,
		.625,
		.75,
		.875,
		1
	],
	conscientiousnessPerfectionism: [
		.08333333333333331,
		.5833333333333334,
		.6666666666666666,
		.75,
		.8333333333333333,
		1
	],
	conscientiousnessPrudence: [
		0,
		.5,
		.6666666666666666,
		.75,
		.8333333333333333,
		1
	],
	conservation: [
		0,
		.2333333333333333,
		.3333333333333333,
		.4333333333333333,
		.5333333333333333,
		.8333333333333334
	],
	creator: [
		0,
		.5619415600096596,
		.6668075344119778,
		.75,
		.8669886500845206,
		1
	],
	crtScore: [
		0,
		.5,
		1
	],
	emotionalityAnxiety: [
		0,
		.5,
		.625,
		.75,
		.875,
		1
	],
	emotionalityDependence: [
		0,
		.25,
		.375,
		.5,
		.625,
		1
	],
	emotionalityFacet: [
		0,
		.42708333333333326,
		.5208333333333334,
		.6104166666666663,
		.7083333333333334,
		1
	],
	emotionalityFearfulness: [
		0,
		.33333333333333337,
		.5,
		.6333333333333305,
		.75,
		1
	],
	emotionalitySentimentality: [
		0,
		.41666666666666663,
		.5833333333333334,
		.6666666666666666,
		.75,
		1
	],
	expressiveSuppression: [
		0,
		.2916666666666667,
		.4166666666666667,
		.5833333333333334,
		.7083333333333334,
		1
	],
	extraversionFacet: [
		0,
		.33333333333333326,
		.44791666666666663,
		.5625,
		.6666666666666666,
		1
	],
	extraversionLiveliness: [
		0,
		.375,
		.5,
		.625,
		.75,
		1
	],
	extraversionSociability: [
		0,
		.125,
		.25,
		.5,
		.625,
		1
	],
	extraversionSocialBoldness: [
		0,
		.25,
		.41666666666666663,
		.5,
		.6666666666666666,
		1
	],
	extraversionSocialSelfEsteem: [
		0,
		.33333333333333337,
		.5833333333333334,
		.75,
		.8333333333333333,
		1
	],
	gregariousExtraverted: [
		0,
		.25,
		.375,
		.5625,
		.75,
		1
	],
	hedonism: [
		0,
		.2,
		.4,
		.5,
		.7,
		1
	],
	honestyHumilityFacet: [
		.020833333333333315,
		.5,
		.6041666666666666,
		.6770833333333333,
		.7708333333333333,
		1
	],
	honestyHumilityFairness: [
		0,
		.33333333333333337,
		.5833333333333334,
		.75,
		.9166666666666667,
		1
	],
	honestyHumilityGreedAvoidance: [
		0,
		.25,
		.5,
		.625,
		.75,
		1
	],
	honestyHumilityModesty: [
		0,
		.75,
		.875,
		1
	],
	honestyHumilitySincerity: [
		0,
		.41666666666666663,
		.5833333333333334,
		.6666666666666666,
		.75,
		1
	],
	idealist: [
		0,
		.416425702811245,
		.5423828647925033,
		.6306559571619812,
		.7481927710843375,
		1
	],
	jester: [
		.11320418350368427,
		.6507368671262183,
		.7450558592821489,
		.7951033990967435,
		.9189446161159971,
		1
	],
	lover: [
		.0395767066307805,
		.45814778566185455,
		.6234401761683385,
		.7354171764130165,
		.8271959872767309,
		.9999999999999998
	],
	machiavellianism: [
		0,
		.33333333333333337,
		.4444444444444444,
		.5277777777777778,
		.6388888888888888,
		1
	],
	magician: [
		0,
		.498103448275862,
		.6046551724137931,
		.6826508620689654,
		.7538793103448276,
		1
	],
	narcissism: [
		0,
		.25,
		.33333333333333337,
		.4444444444444444,
		.5555555555555556,
		.9166666666666667
	],
	opennessAestheticAppreciation: [
		0,
		.5,
		.625,
		.75,
		.875,
		1
	],
	opennessCreativity: [
		0,
		.5,
		.6666666666666666,
		.8333333333333333,
		.9166666666666667,
		1
	],
	opennessFacet: [
		.08333333333333331,
		.5520833333333333,
		.65625,
		.75,
		.84375,
		1
	],
	opennessInquisitiveness: [
		0,
		.5,
		.625,
		.75,
		.875,
		1
	],
	opennessToChange: [
		0,
		.23333333333333334,
		.33333333333333337,
		.4333333333333333,
		.5333333333333333,
		.9333333333333333
	],
	opennessUnconventionality: [
		0,
		.5,
		.6666666666666666,
		.75,
		.8333333333333333,
		1
	],
	power: [
		0,
		.4,
		.5,
		.7,
		.8,
		1
	],
	psychopathy: [
		0,
		.1388888888888889,
		.2222222222222222,
		.3055555555555556,
		.41666666666666663,
		.8611111111111112
	],
	realist: [
		.22719060523938572,
		.6131436314363145,
		.6911472448057815,
		.75,
		.8195121951219512,
		1
	],
	revolutionary: [
		.2256905032160424,
		.5361710177828225,
		.5933219825955354,
		.6597994702989027,
		.7186341278849793,
		1
	],
	ruler: [
		0,
		.33992048643592143,
		.45854770813844714,
		.553122076707203,
		.6802619270346117,
		1
	],
	sage: [
		0,
		.6692338072669826,
		.75,
		.7972617166929963,
		.914797261716693,
		.9999999999999998
	],
	security: [
		0,
		.1,
		.2,
		.4,
		.5,
		1
	],
	seeker: [
		.05172117039586921,
		.6065232358003442,
		.6982788296041308,
		.75,
		.8345955249569705,
		1
	],
	selfDirection: [
		0,
		.1,
		.2,
		.3,
		.4,
		.9
	],
	selfEnhancement: [
		0,
		.35,
		.55,
		.65,
		.8,
		1
	],
	selfMonitoring: [
		0,
		.28,
		.4,
		.48,
		.6,
		.96
	],
	selfTranscendence: [
		0,
		.08333333333333333,
		.16666666666666669,
		.25,
		.35,
		.8666666666666668
	],
	stimulation: [
		0,
		.2,
		.4,
		.6,
		.7,
		1
	],
	tradition: [
		0,
		.2,
		.3,
		.4,
		.5,
		1
	],
	unassumingIngenuous: [
		.1875,
		.5750000000000002,
		.6875,
		.75,
		.8125,
		1
	],
	unassuredSubmissive: [
		.0625,
		.5,
		.625,
		.75,
		.875,
		1
	],
	universalism: [
		0,
		.06666666666666665,
		.13333333333333336,
		.2666666666666667,
		.3333333333333333,
		.9333333333333333
	],
	warmAgreeable: [
		.125,
		.6875,
		.75,
		.8125,
		.9375,
		1
	],
	warrior: [
		.12321999418773605,
		.5305870386515547,
		.6384626562045916,
		.7083551293228711,
		.7947544318512061,
		.9999999999999998
	]
};
_enum([
	"very_low",
	"low",
	"medium",
	"high",
	"very_high"
]).describe("Binned score category, can be used for interpretation, this is derived from the normalized score and the population distribution");
/**
* Type guard to check if a number is a valid IntervalCount (2-5).
*/
function isValidIntervalCount(n) {
	return n >= 2 && n <= 5;
}
function binScore(name, normalized) {
	const edges = EDGE_MAP[name] ?? [
		0,
		.2,
		.4,
		.6,
		.8,
		1
	];
	const rawIntervals = edges.length - 1;
	if (!isValidIntervalCount(rawIntervals)) throw new Error(`Invalid number of edges for ${name}, must define between 3 and 6 edges to create 2 to 5 intervals.`);
	const intervals = rawIntervals;
	const labels = {
		2: ["low", "high"],
		3: [
			"low",
			"medium",
			"high"
		],
		4: [
			"very_low",
			"low",
			"high",
			"very_high"
		],
		5: [
			"very_low",
			"low",
			"medium",
			"high",
			"very_high"
		]
	}[intervals];
	const sorted = [...edges].sort((a, b) => a - b);
	const minEdge = sorted[0] ?? 0;
	const maxEdge = sorted.at(-1) ?? 1;
	const value = Math.min(Math.max(normalized, minEdge), maxEdge);
	let binned = labels.at(-1) ?? "high";
	for (let i = 0; i < intervals; i++) if (value <= (sorted[i + 1] ?? maxEdge)) {
		binned = labels[i] ?? binned;
		break;
	}
	return {
		binned,
		normalized
	};
}

//#endregion
//#region ../contracts/dist/v1/layered-lenses/model.mjs
const InterpretableScoreSchema = object({
	binned: _enum([
		"very_low",
		"low",
		"medium",
		"high",
		"very_high"
	]).describe("Binned score category, can be used for interpretation, this is derived from the normalized score and the population distribution"),
	normalized: number().gte(0).lte(1).describe("Normalized score from 0 to 1").transform((n) => Math.round(n * 100) / 100)
});
const LayeredLenses = object({
	archetypal_story: object({ pmai: object({
		caregiver: InterpretableScoreSchema,
		creator: InterpretableScoreSchema,
		idealist: InterpretableScoreSchema,
		jester: InterpretableScoreSchema,
		lover: InterpretableScoreSchema,
		magician: InterpretableScoreSchema,
		realist: InterpretableScoreSchema,
		revolutionary: InterpretableScoreSchema,
		ruler: InterpretableScoreSchema,
		sage: InterpretableScoreSchema,
		seeker: InterpretableScoreSchema,
		warrior: InterpretableScoreSchema
	}) }),
	cognitive_override: object({ crt: object({ crt_score: InterpretableScoreSchema }) }),
	flexibility_mask: object({ sms: object({ self_monitoring: InterpretableScoreSchema }) }),
	interpersonal_stance: object({ ipip_ipc: object({
		aloof_introverted: InterpretableScoreSchema,
		arrogant_calculating: InterpretableScoreSchema,
		assured_dominant: InterpretableScoreSchema,
		cold_hearted: InterpretableScoreSchema,
		gregarious_extraverted: InterpretableScoreSchema,
		unassuming_ingenuous: InterpretableScoreSchema,
		unassured_submissive: InterpretableScoreSchema,
		warm_agreeable: InterpretableScoreSchema
	}) }),
	motivational_weights: object({ pvq: object({
		achievement: InterpretableScoreSchema,
		benevolence: InterpretableScoreSchema,
		conformity: InterpretableScoreSchema,
		conservation: InterpretableScoreSchema,
		hedonism: InterpretableScoreSchema,
		mrat: InterpretableScoreSchema,
		openness_to_change: InterpretableScoreSchema,
		power: InterpretableScoreSchema,
		security: InterpretableScoreSchema,
		self_direction: InterpretableScoreSchema,
		self_enhancement: InterpretableScoreSchema,
		self_transcendence: InterpretableScoreSchema,
		stimulation: InterpretableScoreSchema,
		tradition: InterpretableScoreSchema,
		universalism: InterpretableScoreSchema
	}) }),
	temperamental_reactivity: object({
		bis_bas: object({
			bas_drive: InterpretableScoreSchema,
			bas_fun_seeking: InterpretableScoreSchema,
			bas_reward_responsiveness: InterpretableScoreSchema,
			bis: InterpretableScoreSchema
		}),
		erq: object({
			cognitive_reappraisal: InterpretableScoreSchema,
			expressive_suppression: InterpretableScoreSchema
		})
	}),
	trait_baseline: object({
		hexaco: object({
			agreeableness: object({
				facet: InterpretableScoreSchema,
				factors: object({
					flexibility: InterpretableScoreSchema,
					forgiveness: InterpretableScoreSchema,
					gentleness: InterpretableScoreSchema,
					patience: InterpretableScoreSchema
				})
			}),
			conscientiousness: object({
				facet: InterpretableScoreSchema,
				factors: object({
					diligence: InterpretableScoreSchema,
					organization: InterpretableScoreSchema,
					perfectionism: InterpretableScoreSchema,
					prudence: InterpretableScoreSchema
				})
			}),
			emotionality: object({
				facet: InterpretableScoreSchema,
				factors: object({
					anxiety: InterpretableScoreSchema,
					dependence: InterpretableScoreSchema,
					fearfulness: InterpretableScoreSchema,
					sentimentality: InterpretableScoreSchema
				})
			}),
			extraversion: object({
				facet: InterpretableScoreSchema,
				factors: object({
					liveliness: InterpretableScoreSchema,
					sociability: InterpretableScoreSchema,
					social_boldness: InterpretableScoreSchema,
					social_self_esteem: InterpretableScoreSchema
				})
			}),
			honesty_humility: object({
				facet: InterpretableScoreSchema,
				factors: object({
					fairness: InterpretableScoreSchema,
					greed_avoidance: InterpretableScoreSchema,
					modesty: InterpretableScoreSchema,
					sincerity: InterpretableScoreSchema
				})
			}),
			openness_to_experience: object({
				facet: InterpretableScoreSchema,
				factors: object({
					aesthetic_appreciation: InterpretableScoreSchema,
					creativity: InterpretableScoreSchema,
					inquisitiveness: InterpretableScoreSchema,
					unconventionality: InterpretableScoreSchema
				})
			})
		}),
		sd3: object({
			machiavellianism: InterpretableScoreSchema,
			narcissism: InterpretableScoreSchema,
			psychopathy: InterpretableScoreSchema
		})
	})
}).describe("The layered lenses schema describe the final hashmap containing all layers values per individual.");
const normalizedScore = number().min(0).max(1);
const mappaToInterpretable = object({
	achievement: normalizedScore,
	agreeablenessFacet: normalizedScore,
	agreeablenessFlexibility: normalizedScore,
	agreeablenessForgiveness: normalizedScore,
	agreeablenessGentleness: normalizedScore,
	agreeablenessPatience: normalizedScore,
	aloofIntroverted: normalizedScore,
	arrogantCalculating: normalizedScore,
	assuredDominant: normalizedScore,
	basDrive: normalizedScore,
	basFunSeeking: normalizedScore,
	basRewardResponsiveness: normalizedScore,
	benevolence: normalizedScore,
	bis: normalizedScore,
	caregiver: normalizedScore,
	cognitiveReappraisal: normalizedScore,
	coldHearted: normalizedScore,
	conformity: normalizedScore,
	conscientiousnessDiligence: normalizedScore,
	conscientiousnessFacet: normalizedScore,
	conscientiousnessOrganization: normalizedScore,
	conscientiousnessPerfectionism: normalizedScore,
	conscientiousnessPrudence: normalizedScore,
	conservation: normalizedScore,
	creator: normalizedScore,
	crtScore: normalizedScore,
	emotionalityAnxiety: normalizedScore,
	emotionalityDependence: normalizedScore,
	emotionalityFacet: normalizedScore,
	emotionalityFearfulness: normalizedScore,
	emotionalitySentimentality: normalizedScore,
	expressiveSuppression: normalizedScore,
	extraversionFacet: normalizedScore,
	extraversionLiveliness: normalizedScore,
	extraversionSociability: normalizedScore,
	extraversionSocialBoldness: normalizedScore,
	extraversionSocialSelfEsteem: normalizedScore,
	gregariousExtraverted: normalizedScore,
	hedonism: normalizedScore,
	honestyHumilityFacet: normalizedScore,
	honestyHumilityFairness: normalizedScore,
	honestyHumilityGreedAvoidance: normalizedScore,
	honestyHumilityModesty: normalizedScore,
	honestyHumilitySincerity: normalizedScore,
	idealist: normalizedScore,
	jester: normalizedScore,
	lover: normalizedScore,
	machiavellianism: normalizedScore,
	magician: normalizedScore,
	narcissism: normalizedScore,
	opennessAestheticAppreciation: normalizedScore,
	opennessCreativity: normalizedScore,
	opennessFacet: normalizedScore,
	opennessInquisitiveness: normalizedScore,
	opennessToChange: normalizedScore,
	opennessUnconventionality: normalizedScore,
	power: normalizedScore,
	psychopathy: normalizedScore,
	realist: normalizedScore,
	revolutionary: normalizedScore,
	ruler: normalizedScore,
	sage: normalizedScore,
	security: normalizedScore,
	seeker: normalizedScore,
	selfDirection: normalizedScore,
	selfEnhancement: normalizedScore,
	selfMonitoring: normalizedScore,
	selfTranscendence: normalizedScore,
	stimulation: normalizedScore,
	tradition: normalizedScore,
	unassumingIngenuous: normalizedScore,
	unassuredSubmissive: normalizedScore,
	universalism: normalizedScore,
	warmAgreeable: normalizedScore,
	warrior: normalizedScore
}).transform((d) => ({
	archetypal_story: { pmai: {
		caregiver: binScore("caregiver", d.caregiver),
		creator: binScore("creator", d.creator),
		idealist: binScore("idealist", d.idealist),
		jester: binScore("jester", d.jester),
		lover: binScore("lover", d.lover),
		magician: binScore("magician", d.magician),
		realist: binScore("realist", d.realist),
		revolutionary: binScore("revolutionary", d.revolutionary),
		ruler: binScore("ruler", d.ruler),
		sage: binScore("sage", d.sage),
		seeker: binScore("seeker", d.seeker),
		warrior: binScore("warrior", d.warrior)
	} },
	cognitive_override: { crt: { crt_score: binScore("crtScore", d.crtScore) } },
	flexibility_mask: { sms: { self_monitoring: binScore("selfMonitoring", d.selfMonitoring) } },
	interpersonal_stance: { ipip_ipc: {
		aloof_introverted: binScore("aloofIntroverted", d.aloofIntroverted),
		arrogant_calculating: binScore("arrogantCalculating", d.arrogantCalculating),
		assured_dominant: binScore("assuredDominant", d.assuredDominant),
		cold_hearted: binScore("coldHearted", d.coldHearted),
		gregarious_extraverted: binScore("gregariousExtraverted", d.gregariousExtraverted),
		unassuming_ingenuous: binScore("unassumingIngenuous", d.unassumingIngenuous),
		unassured_submissive: binScore("unassuredSubmissive", d.unassuredSubmissive),
		warm_agreeable: binScore("warmAgreeable", d.warmAgreeable)
	} },
	motivational_weights: { pvq: (() => {
		const pvqScores = {
			achievement: binScore("achievement", d.achievement),
			benevolence: binScore("benevolence", d.benevolence),
			conformity: binScore("conformity", d.conformity),
			conservation: binScore("conservation", d.conservation),
			hedonism: binScore("hedonism", d.hedonism),
			openness_to_change: binScore("opennessToChange", d.opennessToChange),
			power: binScore("power", d.power),
			security: binScore("security", d.security),
			self_direction: binScore("selfDirection", d.selfDirection),
			self_enhancement: binScore("selfEnhancement", d.selfEnhancement),
			self_transcendence: binScore("selfTranscendence", d.selfTranscendence),
			stimulation: binScore("stimulation", d.stimulation),
			tradition: binScore("tradition", d.tradition),
			universalism: binScore("universalism", d.universalism)
		};
		const pvqValues = Object.values(pvqScores);
		const mrat = pvqValues.reduce((sum, value) => sum + value.normalized, 0) / pvqValues.length;
		return {
			...pvqScores,
			mrat: binScore("mrat", mrat)
		};
	})() },
	temperamental_reactivity: {
		bis_bas: {
			bas_drive: binScore("basDrive", d.basDrive),
			bas_fun_seeking: binScore("basFunSeeking", d.basFunSeeking),
			bas_reward_responsiveness: binScore("basRewardResponsiveness", d.basRewardResponsiveness),
			bis: binScore("bis", d.bis)
		},
		erq: {
			cognitive_reappraisal: binScore("cognitiveReappraisal", d.cognitiveReappraisal),
			expressive_suppression: binScore("expressiveSuppression", d.expressiveSuppression)
		}
	},
	trait_baseline: {
		hexaco: {
			agreeableness: {
				facet: binScore("agreeablenessFacet", d.agreeablenessFacet),
				factors: {
					flexibility: binScore("agreeablenessFlexibility", d.agreeablenessFlexibility),
					forgiveness: binScore("agreeablenessForgiveness", d.agreeablenessForgiveness),
					gentleness: binScore("agreeablenessGentleness", d.agreeablenessGentleness),
					patience: binScore("agreeablenessPatience", d.agreeablenessPatience)
				}
			},
			conscientiousness: {
				facet: binScore("conscientiousnessFacet", d.conscientiousnessFacet),
				factors: {
					diligence: binScore("conscientiousnessDiligence", d.conscientiousnessDiligence),
					organization: binScore("conscientiousnessOrganization", d.conscientiousnessOrganization),
					perfectionism: binScore("conscientiousnessPerfectionism", d.conscientiousnessPerfectionism),
					prudence: binScore("conscientiousnessPrudence", d.conscientiousnessPrudence)
				}
			},
			emotionality: {
				facet: binScore("emotionalityFacet", d.emotionalityFacet),
				factors: {
					anxiety: binScore("emotionalityAnxiety", d.emotionalityAnxiety),
					dependence: binScore("emotionalityDependence", d.emotionalityDependence),
					fearfulness: binScore("emotionalityFearfulness", d.emotionalityFearfulness),
					sentimentality: binScore("emotionalitySentimentality", d.emotionalitySentimentality)
				}
			},
			extraversion: {
				facet: binScore("extraversionFacet", d.extraversionFacet),
				factors: {
					liveliness: binScore("extraversionLiveliness", d.extraversionLiveliness),
					sociability: binScore("extraversionSociability", d.extraversionSociability),
					social_boldness: binScore("extraversionSocialBoldness", d.extraversionSocialBoldness),
					social_self_esteem: binScore("extraversionSocialSelfEsteem", d.extraversionSocialSelfEsteem)
				}
			},
			honesty_humility: {
				facet: binScore("honestyHumilityFacet", d.honestyHumilityFacet),
				factors: {
					fairness: binScore("honestyHumilityFairness", d.honestyHumilityFairness),
					greed_avoidance: binScore("honestyHumilityGreedAvoidance", d.honestyHumilityGreedAvoidance),
					modesty: binScore("honestyHumilityModesty", d.honestyHumilityModesty),
					sincerity: binScore("honestyHumilitySincerity", d.honestyHumilitySincerity)
				}
			},
			openness_to_experience: {
				facet: binScore("opennessFacet", d.opennessFacet),
				factors: {
					aesthetic_appreciation: binScore("opennessAestheticAppreciation", d.opennessAestheticAppreciation),
					creativity: binScore("opennessCreativity", d.opennessCreativity),
					inquisitiveness: binScore("opennessInquisitiveness", d.opennessInquisitiveness),
					unconventionality: binScore("opennessUnconventionality", d.opennessUnconventionality)
				}
			}
		},
		sd3: {
			machiavellianism: binScore("machiavellianism", d.machiavellianism),
			narcissism: binScore("narcissism", d.narcissism),
			psychopathy: binScore("psychopathy", d.psychopathy)
		}
	}
})).pipe(LayeredLenses);
const rawTraitMap = object({
	achievement: normalizedScore,
	agreeableness_facet: normalizedScore,
	agreeableness_flexibility: normalizedScore,
	agreeableness_forgiveness: normalizedScore,
	agreeableness_gentleness: normalizedScore,
	agreeableness_patience: normalizedScore,
	aloof_introverted: normalizedScore,
	arrogant_calculating: normalizedScore,
	assured_dominant: normalizedScore,
	bas_drive: normalizedScore,
	bas_fun_seeking: normalizedScore,
	bas_reward_responsiveness: normalizedScore,
	benevolence: normalizedScore,
	bis: normalizedScore,
	caregiver: normalizedScore,
	cognitive_reappraisal: normalizedScore,
	cold_hearted: normalizedScore,
	conformity: normalizedScore,
	conscientiousness_diligence: normalizedScore,
	conscientiousness_facet: normalizedScore,
	conscientiousness_organization: normalizedScore,
	conscientiousness_perfectionism: normalizedScore,
	conscientiousness_prudence: normalizedScore,
	conservation: normalizedScore,
	creator: normalizedScore,
	crt_score: normalizedScore,
	emotionality_anxiety: normalizedScore,
	emotionality_dependence: normalizedScore,
	emotionality_facet: normalizedScore,
	emotionality_fearfulness: normalizedScore,
	emotionality_sentimentality: normalizedScore,
	expressive_suppression: normalizedScore,
	extraversion_facet: normalizedScore,
	extraversion_liveliness: normalizedScore,
	extraversion_sociability: normalizedScore,
	extraversion_social_boldness: normalizedScore,
	extraversion_social_self_esteem: normalizedScore,
	gregarious_extraverted: normalizedScore,
	hedonism: normalizedScore,
	honesty_humility_facet: normalizedScore,
	honesty_humility_fairness: normalizedScore,
	honesty_humility_greed_avoidance: normalizedScore,
	honesty_humility_modesty: normalizedScore,
	honesty_humility_sincerity: normalizedScore,
	idealist: normalizedScore,
	jester: normalizedScore,
	lover: normalizedScore,
	machiavellianism: normalizedScore,
	magician: normalizedScore,
	narcissism: normalizedScore,
	openness_aesthetic_appreciation: normalizedScore,
	openness_creativity: normalizedScore,
	openness_facet: normalizedScore,
	openness_inquisitiveness: normalizedScore,
	openness_to_change: normalizedScore,
	openness_unconventionality: normalizedScore,
	power: normalizedScore,
	psychopathy: normalizedScore,
	realist: normalizedScore,
	revolutionary: normalizedScore,
	ruler: normalizedScore,
	sage: normalizedScore,
	security: normalizedScore,
	seeker: normalizedScore,
	self_direction: normalizedScore,
	self_enhancement: normalizedScore,
	self_monitoring: normalizedScore,
	self_transcendence: normalizedScore,
	stimulation: normalizedScore,
	tradition: normalizedScore,
	unassuming_ingenuous: normalizedScore,
	unassured_submissive: normalizedScore,
	universalism: normalizedScore,
	warm_agreeable: normalizedScore,
	warrior: normalizedScore
}).transform((v) => ({
	achievement: v.achievement,
	agreeablenessFacet: v.agreeableness_facet,
	agreeablenessFlexibility: v.agreeableness_flexibility,
	agreeablenessForgiveness: v.agreeableness_forgiveness,
	agreeablenessGentleness: v.agreeableness_gentleness,
	agreeablenessPatience: v.agreeableness_patience,
	aloofIntroverted: v.aloof_introverted,
	arrogantCalculating: v.arrogant_calculating,
	assuredDominant: v.assured_dominant,
	basDrive: v.bas_drive,
	basFunSeeking: v.bas_fun_seeking,
	basRewardResponsiveness: v.bas_reward_responsiveness,
	benevolence: v.benevolence,
	bis: v.bis,
	caregiver: v.caregiver,
	cognitiveReappraisal: v.cognitive_reappraisal,
	coldHearted: v.cold_hearted,
	conformity: v.conformity,
	conscientiousnessDiligence: v.conscientiousness_diligence,
	conscientiousnessFacet: v.conscientiousness_facet,
	conscientiousnessOrganization: v.conscientiousness_organization,
	conscientiousnessPerfectionism: v.conscientiousness_perfectionism,
	conscientiousnessPrudence: v.conscientiousness_prudence,
	conservation: v.conservation,
	creator: v.creator,
	crtScore: v.crt_score,
	emotionalityAnxiety: v.emotionality_anxiety,
	emotionalityDependence: v.emotionality_dependence,
	emotionalityFacet: v.emotionality_facet,
	emotionalityFearfulness: v.emotionality_fearfulness,
	emotionalitySentimentality: v.emotionality_sentimentality,
	expressiveSuppression: v.expressive_suppression,
	extraversionFacet: v.extraversion_facet,
	extraversionLiveliness: v.extraversion_liveliness,
	extraversionSociability: v.extraversion_sociability,
	extraversionSocialBoldness: v.extraversion_social_boldness,
	extraversionSocialSelfEsteem: v.extraversion_social_self_esteem,
	gregariousExtraverted: v.gregarious_extraverted,
	hedonism: v.hedonism,
	honestyHumilityFacet: v.honesty_humility_facet,
	honestyHumilityFairness: v.honesty_humility_fairness,
	honestyHumilityGreedAvoidance: v.honesty_humility_greed_avoidance,
	honestyHumilityModesty: v.honesty_humility_modesty,
	honestyHumilitySincerity: v.honesty_humility_sincerity,
	idealist: v.idealist,
	jester: v.jester,
	lover: v.lover,
	machiavellianism: v.machiavellianism,
	magician: v.magician,
	narcissism: v.narcissism,
	opennessAestheticAppreciation: v.openness_aesthetic_appreciation,
	opennessCreativity: v.openness_creativity,
	opennessFacet: v.openness_facet,
	opennessInquisitiveness: v.openness_inquisitiveness,
	opennessToChange: v.openness_to_change,
	opennessUnconventionality: v.openness_unconventionality,
	power: v.power,
	psychopathy: v.psychopathy,
	realist: v.realist,
	revolutionary: v.revolutionary,
	ruler: v.ruler,
	sage: v.sage,
	security: v.security,
	seeker: v.seeker,
	selfDirection: v.self_direction,
	selfEnhancement: v.self_enhancement,
	selfMonitoring: v.self_monitoring,
	selfTranscendence: v.self_transcendence,
	stimulation: v.stimulation,
	tradition: v.tradition,
	unassumingIngenuous: v.unassuming_ingenuous,
	unassuredSubmissive: v.unassured_submissive,
	universalism: v.universalism,
	warmAgreeable: v.warm_agreeable,
	warrior: v.warrior
}));
const layeredLensesResponse = object({
	model_info: object({ checkpoint: string() }),
	traits: rawTraitMap
});

//#endregion
//#region src/internal-resources/behavior-maps.ts
const behaviorMapExportResponse = object({
	behaviorMap: LayeredLenses,
	createdAt: datetime(),
	entityId: string().min(1),
	mapId: string().min(1),
	modelCheckpoint: string().min(1)
});
var InternalBehaviorMapsResource = class {
	transport;
	constructor(transport) {
		this.transport = transport;
	}
	async get(entityId, opts) {
		if (!entityId) throw new ConduitError("entityId must be a non-empty string", { code: "invalid_request" });
		return parseRes(behaviorMapExportResponse, (await this.transport.request({
			method: "GET",
			path: `/internal/behavior-maps/${encodeURIComponent(entityId)}`,
			requestId: opts?.requestId,
			retryable: true,
			signal: opts?.signal
		})).data, "internal.behaviorMaps.get");
	}
};

//#endregion
//#region src/InternalConduit.ts
var InternalConduit = class {
	behaviorMaps;
	constructor(options) {
		if (!options.internalApiKey) throw new InitializationError("internalApiKey is required", { code: "config_error" });
		if (isBrowserRuntime() && !options.dangerouslyAllowBrowser) throw new InitializationError("Conduit internal SDK cannot run in browser environments by default because internal API keys are secret. Use a server/edge proxy or pass dangerouslyAllowBrowser: true only if you understand the risk.", { code: "unsupported_runtime" });
		const baseUrl = options.baseUrl ?? "https://api.mappa.ai";
		if (!isValidUrl(baseUrl)) throw new InitializationError("baseUrl must be a valid URL", { code: "config_error" });
		const behaviorMaps = new InternalBehaviorMapsResource(new Transport({
			apiKey: options.internalApiKey,
			authHeaderName: "x-internal-key",
			baseUrl,
			defaultHeaders: options.defaultHeaders,
			fetch: options.fetch,
			maxRetries: options.maxRetries ?? 2,
			telemetry: options.telemetry,
			timeoutMs: options.timeoutMs ?? 3e5,
			userAgent: options.userAgent
		}));
		this.behaviorMaps = { get: behaviorMaps.get.bind(behaviorMaps) };
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
export { ApiError, AuthError, ConduitError, InitializationError, InsufficientCreditsError, InternalConduit, InvalidSourceError, JobCanceledError, JobFailedError, RateLimitError, RemoteFetchError, RemoteFetchTimeoutError, RemoteFetchTooLargeError, RequestAbortedError, SourceError, StreamError, TimeoutError, UnsupportedRuntimeError, ValidationError, WebhookVerificationError };
//# sourceMappingURL=internal.mjs.map