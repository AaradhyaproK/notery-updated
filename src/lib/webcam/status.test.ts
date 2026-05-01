import test from "node:test";
import assert from "node:assert/strict";

import {
  buildWebcamErrorStatus,
  buildWebcamSuccessStatus,
  buildWebcamUnsupportedStatus,
} from "./status";

test("buildWebcamSuccessStatus confirms the camera is working", () => {
  const status = buildWebcamSuccessStatus("Integrated Webcam");

  assert.equal(status.stage, "success");
  assert.equal(status.message, "Live preview is visible. The video camera is working.");
  assert.equal(status.details, "Connected device: Integrated Webcam");
});

test("buildWebcamUnsupportedStatus explains when browser camera APIs are unavailable", () => {
  const status = buildWebcamUnsupportedStatus();

  assert.equal(status.stage, "error");
  assert.equal(status.message, "This browser session cannot access a webcam preview.");
  assert.match(status.details ?? "", /mediaDevices/);
});

test("buildWebcamErrorStatus explains blocked camera permission", () => {
  const status = buildWebcamErrorStatus({
    name: "NotAllowedError",
  });

  assert.equal(status.stage, "error");
  assert.equal(status.message, "Camera access was blocked.");
  assert.match(status.details ?? "", /Allow camera permission/i);
});

test("buildWebcamErrorStatus explains when no camera is available", () => {
  const status = buildWebcamErrorStatus({
    name: "NotFoundError",
  });

  assert.equal(status.stage, "error");
  assert.equal(status.message, "No video camera was found on this device.");
});
