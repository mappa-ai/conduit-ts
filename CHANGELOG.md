# Changelog

## [0.2.1](https://github.com/mappa-ai/behavioral-engine/releases/tag/v0.2.1) (2026-03-23)

### Notes

- Shared release alignment only; no TypeScript SDK surface changes.

## [0.2.0](https://github.com/mappa-ai/behavioral-engine/releases/tag/v0.2.0) (2026-03-22)

### Features

- Return report `provenance` metadata with `behaviorMapId` and `baselineSampleIds` on SDK report objects.

## [0.1.15](https://github.com/mappa-ai/behavioral-engine/releases/tag/v0.1.15) (2026-03-22)

### Features

- Add the `internal` entrypoint with `InternalConduit` and `behaviorMaps.get(...)` for trusted internal consumers.
- Add `hasReports` to `MediaFile`.

### Changes

- Remove the public `feedback` and `health` resource surfaces from the package entrypoint.
- Allow the transport layer to use `x-internal-key` auth for the internal client.

## [0.1.14](https://github.com/mappa-ai/behavioral-engine/releases/tag/v0.1.14) (2026-03-17)

### Notes

- Shared release alignment only; no TypeScript SDK surface changes.

## [0.1.13](https://github.com/mappa-ai/behavioral-engine/releases/tag/v0.1.13) (2026-03-17)

### Fixes

- Restore the default client and file upload timeout to `300000ms`.

## [0.1.12](https://github.com/mappa-ai/behavioral-engine/releases/tag/v0.1.12) (2026-03-17)

### Features

- Add `speaker_index` targeting for report creation and matching analysis jobs.

### Fixes

- Tighten timerange target validation before requests are sent.

## [0.1.11](https://github.com/mappa-ai/behavioral-engine/releases/tag/v0.1.11) (2026-03-16)

### Fixes

- Increase the default client and file upload timeout to `300000ms` for longer jobs and uploads.

## [0.1.10](https://github.com/mappa-ai/behavioral-engine/releases/tag/v0.1.10) (2026-03-16)

### Docs

- Point SDK help links at `https://docs.conduit.mappa.ai`.

## [0.1.9](https://github.com/mappa-ai/behavioral-engine/releases/tag/v0.1.9) (2026-03-15)

### Notes

- Shared release alignment only; no TypeScript SDK surface changes.

## [0.1.8](https://github.com/mappa-ai/behavioral-engine/releases/tag/v0.1.8) (2026-03-15)

### Notes

- Shared release alignment only; no TypeScript SDK surface changes.

## [0.1.7](https://github.com/mappa-ai/behavioral-engine/releases/tag/v0.1.7) (2026-03-15)

### Notes

- Shared release alignment only; no TypeScript SDK surface changes.

## [0.1.6](https://github.com/mappa-ai/behavioral-engine/releases/tag/v0.1.6) (2026-03-15)

### Notes

- Shared release alignment only; no TypeScript SDK surface changes.

## [0.1.5](https://github.com/mappa-ai/behavioral-engine/releases/tag/v0.1.5) (2026-03-15)

### Notes

- Shared release alignment only; no TypeScript SDK surface changes.

## [0.1.4](https://github.com/mappa-ai/behavioral-engine/releases/tag/v0.1.4) (2026-03-15)

### Notes

- Shared release alignment only; no TypeScript SDK surface changes.

## [0.1.3](https://github.com/mappa-ai/behavioral-engine/releases/tag/v0.1.3) (2026-03-15)

### Notes

- Shared release alignment only; no TypeScript SDK surface changes.

## [0.1.2](https://github.com/mappa-ai/behavioral-engine/releases/tag/v0.1.2) (2026-03-15)

### Fixes

- Rename the Python and Rust public package names to avoid collisions with existing registry packages.

## [0.1.1](https://github.com/mappa-ai/behavioral-engine/releases/tag/v0.1.1) (2026-03-15)

### Fixes

- Carry the validated TypeScript build artifact across release jobs before mirroring.

## [0.1.0](https://github.com/mappa-ai/behavioral-engine/releases/tag/v0.1.0) (2026-03-15)

### Initial release

- First public SDK release from the shared mirror-based publish flow.
