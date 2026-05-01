import test from "node:test";
import assert from "node:assert/strict";

import {
  buildFingerprintConfig,
  getLegacyPreviewCandidates,
  getRdServiceCandidates,
} from "./config";

test("buildFingerprintConfig applies stable defaults for Mantra MFS110", () => {
  const config = buildFingerprintConfig();

  assert.equal(config.deviceModel, "MANTRA_MFS110");
  assert.equal(config.transport, "auto");
  assert.equal(config.rdBaseUrl, "http://127.0.0.1:11100");
  assert.equal(config.rdSecureBaseUrl, "https://127.0.0.1:11100");
  assert.equal(config.rdInfoPath, "/rd/info");
  assert.equal(config.rdCapturePath, "/rd/capture");
  assert.equal(config.captureTimeoutMs, 15000);
  assert.equal(config.env, "P");
  assert.equal(config.backendEndpoint, "/api/fingerprint/capture");
  assert.equal(config.enablePreviewImage, true);
  assert.deepEqual(config.legacyPreviewPorts, [8000, 8001, 8002, 8003, 8004, 8005]);
  assert.deepEqual(config.legacyPreviewDevicePaths, ["mfs100", "mfs110"]);
  assert.deepEqual(config.legacyPreviewHosts, ["127.0.0.1", "localhost"]);
});

test("buildFingerprintConfig preserves overrides without dropping defaults", () => {
  const config = buildFingerprintConfig({
    transport: "https",
    captureTimeoutMs: 30000,
    backendEndpoint: "/api/custom-fingerprint",
    enablePreviewImage: false,
  });

  assert.equal(config.transport, "https");
  assert.equal(config.captureTimeoutMs, 30000);
  assert.equal(config.backendEndpoint, "/api/custom-fingerprint");
  assert.equal(config.enablePreviewImage, false);
  assert.equal(config.rdCapturePath, "/rd/capture");
});

test("getRdServiceCandidates tries secure localhost first in auto mode", () => {
  const config = buildFingerprintConfig();

  assert.deepEqual(getRdServiceCandidates(config), [
    "https://127.0.0.1:11100",
    "http://127.0.0.1:11100",
  ]);
});

test("getRdServiceCandidates respects forced transport mode", () => {
  const secureOnly = buildFingerprintConfig({ transport: "https" });
  const httpOnly = buildFingerprintConfig({ transport: "http" });

  assert.deepEqual(getRdServiceCandidates(secureOnly), ["https://127.0.0.1:11100"]);
  assert.deepEqual(getRdServiceCandidates(httpOnly), ["http://127.0.0.1:11100"]);
});

test("getLegacyPreviewCandidates tries secure loopback endpoints first for hosted HTTPS apps", () => {
  const config = buildFingerprintConfig({
    legacyPreviewPorts: [8004],
    legacyPreviewDevicePaths: ["mfs100"],
  });

  assert.deepEqual(getLegacyPreviewCandidates(config), [
    "https://127.0.0.1:8004/mfs100",
    "https://localhost:8004/mfs100",
    "http://127.0.0.1:8004/mfs100",
    "http://localhost:8004/mfs100",
  ]);
});
