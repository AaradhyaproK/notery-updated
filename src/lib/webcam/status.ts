export type WebcamPreviewStatus = {
  stage: "idle" | "loading" | "success" | "error";
  message: string;
  details?: string;
};

export const WEBCAM_PREVIEW_TIMEOUT_MS = 15000;

export function buildWebcamSuccessStatus(deviceLabel?: string): WebcamPreviewStatus {
  const normalizedLabel = deviceLabel?.trim();

  return {
    stage: "success",
    message: "Live preview is visible. The video camera is working.",
    details: normalizedLabel ? `Connected device: ${normalizedLabel}` : "If you can see your live preview below, the selected camera is ready.",
  };
}

export function buildWebcamUnsupportedStatus(): WebcamPreviewStatus {
  return {
    stage: "error",
    message: "This browser session cannot access a webcam preview.",
    details: "The required navigator.mediaDevices camera APIs are not available in this environment.",
  };
}

export function buildWebcamAutoStopStatus(durationSeconds: number): WebcamPreviewStatus {
  return {
    stage: "idle",
    message: `Preview stopped automatically after ${durationSeconds} seconds.`,
    details: "The camera is ready. Start the preview again anytime if you want to recheck it.",
  };
}

export function buildWebcamErrorStatus(error: unknown): WebcamPreviewStatus {
  const errorName =
    typeof error === "object" && error !== null && "name" in error && typeof error.name === "string"
      ? error.name
      : "";

  if (errorName === "NotAllowedError") {
    return {
      stage: "error",
      message: "Camera access was blocked.",
      details: "Allow camera permission in the browser, then start the preview again.",
    };
  }

  if (errorName === "NotFoundError" || errorName === "DevicesNotFoundError") {
    return {
      stage: "error",
      message: "No video camera was found on this device.",
      details: "Connect a webcam or enable the built-in camera, then retry the preview.",
    };
  }

  if (errorName === "NotReadableError" || errorName === "TrackStartError") {
    return {
      stage: "error",
      message: "The video camera is busy or unavailable.",
      details: "Close any other app that is already using the webcam, then try again.",
    };
  }

  const fallbackDetails = error instanceof Error && error.message.trim() ? error.message : "The browser could not start a live webcam preview.";

  return {
    stage: "error",
    message: "Unable to start the webcam preview.",
    details: fallbackDetails,
  };
}
