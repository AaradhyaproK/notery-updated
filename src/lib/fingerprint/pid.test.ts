import test from "node:test";
import assert from "node:assert/strict";

import { buildFingerprintConfig } from "./config";
import {
  buildPidOptionsXml,
  parsePidCaptureResponse,
  parseLegacyPreviewResponse,
} from "./pid";

test("buildPidOptionsXml serializes configured RD capture options", () => {
  const config = buildFingerprintConfig({
    captureTimeoutMs: 20000,
    env: "PP",
    dataType: "P",
    fingerType: "FIR",
    wadh: "sample-wadh",
  });

  const pidOptions = buildPidOptionsXml(config);

  assert.match(pidOptions, /<PidOptions/);
  assert.match(pidOptions, /env="PP"/);
  assert.match(pidOptions, /fCount="1"/);
  assert.match(pidOptions, /fType="FIR"/);
  assert.match(pidOptions, /format="P"/);
  assert.match(pidOptions, /pidVer="2\.0"/);
  assert.match(pidOptions, /timeout="20000"/);
  assert.match(pidOptions, /wadh="sample-wadh"/);
});

test("parsePidCaptureResponse returns success details for valid PID XML", () => {
  const pidXml = [
    "<PidData>",
    '<Resp errCode="0" errInfo="Success" fCount="1" fType="0" nmPoints="32" qScore="72" />',
    '<DeviceInfo dpId="MANTRA" rdsId="MANTRA.RD" rdsVer="1.0.0" mi="MFS110" dc="abc123" mc="xyz789" srno="8530147" />',
    "<Skey ci=\"20260501\">encrypted-key</Skey>",
    "<Hmac>signed-hmac</Hmac>",
    '<Data type="X">encrypted-pid-block</Data>',
    "</PidData>",
  ].join("");

  const parsed = parsePidCaptureResponse(pidXml);

  assert.equal(parsed.ok, true);
  assert.equal(parsed.errCode, "0");
  assert.equal(parsed.errInfo, "Success");
  assert.equal(parsed.qScore, "72");
  assert.equal(parsed.deviceInfo?.model, "MFS110");
  assert.equal(parsed.deviceInfo?.serialNumber, "8530147");
  assert.equal(parsed.pidXml, pidXml);
});

test("parsePidCaptureResponse returns failure details for RD errors", () => {
  const pidXml = [
    "<PidData>",
    '<Resp errCode="720" errInfo="Device not ready" fCount="0" qScore="0" />',
    "</PidData>",
  ].join("");

  const parsed = parsePidCaptureResponse(pidXml);

  assert.equal(parsed.ok, false);
  assert.equal(parsed.errCode, "720");
  assert.equal(parsed.errInfo, "Device not ready");
});

test("parseLegacyPreviewResponse creates a printable data URL for BMP payloads", () => {
  const preview = parseLegacyPreviewResponse({
    Base64BMP: "Qk0xMjM0",
  });

  assert.equal(preview, "data:image/bmp;base64,Qk0xMjM0");
});

test("parseLegacyPreviewResponse ignores empty preview payloads", () => {
  assert.equal(parseLegacyPreviewResponse({}), null);
});
