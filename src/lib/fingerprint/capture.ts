import { buildPidOptionsXml, parseLegacyPreviewResponse, parsePidCaptureResponse } from "./pid";
import { getRdServiceCandidates } from "./config";
import type { FingerprintConfig, FingerprintDeviceInfo, ParsedPidCaptureResponse } from "./types";

export type FingerprintCaptureStage =
  | "idle"
  | "checking-device"
  | "waiting-for-finger"
  | "submitting"
  | "success"
  | "error";

export interface FingerprintCaptureStatus {
  stage: FingerprintCaptureStage;
  message: string;
  details?: string;
}

export interface FingerprintCaptureResult {
  pidXml: string;
  parsedPid: ParsedPidCaptureResponse;
  thumbImageDataUrl: string | null;
  deviceInfo?: FingerprintDeviceInfo;
  serviceUrl: string;
  backendAccepted: boolean;
  backendMessage?: string;
}

interface DiscoverRdServiceResult {
  baseUrl: string;
  infoText: string;
}

interface CaptureFingerprintArgs {
  config: FingerprintConfig;
  personId: string;
  documentId?: string | null;
  onStatus?: (status: FingerprintCaptureStatus) => void;
}

function emitStatus(
  onStatus: CaptureFingerprintArgs["onStatus"],
  stage: FingerprintCaptureStage,
  message: string,
  details?: string,
) {
  onStatus?.({ stage, message, details });
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

function buildDeviceErrorMessage(error: unknown, attemptedUrl: string, config: FingerprintConfig) {
  const fallback = `Unable to reach the Mantra RD service at ${attemptedUrl}.`;

  if (!(error instanceof Error)) {
    return fallback;
  }

  const message = error.message || fallback;
  const looksLikeHttpsMixedContent =
    typeof window !== "undefined" &&
    window.location.protocol === "https:" &&
    attemptedUrl.startsWith("http://");

  if (looksLikeHttpsMixedContent) {
    return `${fallback} This app is running on HTTPS, so enable the official Mantra browser bridge/extension or switch the RD URL to secure localhost on this PC.`;
  }

  if (message.toLowerCase().includes("failed to fetch") && config.requireBrowserBridge) {
    return `${fallback} If the device is installed, confirm the Mantra RD background service is running and the browser bridge/extension is enabled.`;
  }

  return `${fallback} ${message}`;
}

async function tryDeviceInfo(url: string, config: FingerprintConfig) {
  const infoUrl = `${url}${config.rdInfoPath}`;
  const methods = ["GET", "DEVICEINFO"];

  let lastError: unknown;

  for (const method of methods) {
    try {
      const response = await fetchWithTimeout(
        infoUrl,
        {
          method,
          headers: {
            Accept: "application/xml, text/xml, text/plain, */*",
          },
        },
        3000,
      );

      if (!response.ok) {
        lastError = new Error(`Device info request failed with status ${response.status}.`);
        continue;
      }

      return await response.text();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error(`Unable to inspect RD service at ${infoUrl}.`);
}

export async function discoverRdService(config: FingerprintConfig): Promise<DiscoverRdServiceResult> {
  const candidates = getRdServiceCandidates(config);
  let lastError: unknown;

  for (const candidate of candidates) {
    try {
      const infoText = await tryDeviceInfo(candidate, config);
      return {
        baseUrl: candidate,
        infoText,
      };
    } catch (error) {
      lastError = error;
    }
  }

  const lastAttempt = candidates[candidates.length - 1] ?? config.rdBaseUrl;
  throw new Error(buildDeviceErrorMessage(lastError, lastAttempt, config));
}

async function capturePidData(baseUrl: string, config: FingerprintConfig) {
  const captureUrl = `${baseUrl}${config.rdCapturePath}`;
  const pidOptionsXml = buildPidOptionsXml(config);
  const methods = ["CAPTURE", "POST"];
  let lastError: unknown;

  for (const method of methods) {
    try {
      const response = await fetchWithTimeout(
        captureUrl,
        {
          method,
          headers: {
            Accept: "application/xml, text/xml, text/plain, */*",
            "Content-Type": "text/xml; charset=utf-8",
          },
          body: pidOptionsXml,
        },
        config.captureTimeoutMs + 5000,
      );

      if (!response.ok) {
        lastError = new Error(`Capture request failed with status ${response.status}.`);
        continue;
      }

      const responseText = await response.text();
      return parsePidCaptureResponse(responseText);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error(`Unable to capture PID data from ${captureUrl}.`);
}

async function bmpToPrintableDataUrl(bmpDataUrl: string) {
  return await new Promise<string>((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const maxDimension = 220;
      let width = image.width;
      let height = image.height;

      if (width > height && width > maxDimension) {
        height *= maxDimension / width;
        width = maxDimension;
      } else if (height >= width && height > maxDimension) {
        width *= maxDimension / height;
        height = maxDimension;
      }

      canvas.width = Math.max(1, Math.round(width));
      canvas.height = Math.max(1, Math.round(height));
      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Canvas context unavailable for fingerprint preview."));
        return;
      }

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };

    image.onerror = () => reject(new Error("Unable to convert the scanner preview image."));
    image.src = bmpDataUrl;
  });
}

async function captureLegacyPreview(config: FingerprintConfig) {
  if (!config.enablePreviewImage || config.previewStrategy !== "legacyMantra") {
    return null;
  }

  for (const port of config.legacyPreviewPorts) {
    for (const devicePath of config.legacyPreviewDevicePaths) {
      const baseUrl = `http://127.0.0.1:${port}/${devicePath}`;

      try {
        const infoResponse = await fetchWithTimeout(
          `${baseUrl}/info`,
          {
            method: "GET",
            headers: {
              Accept: "application/json, text/plain, */*",
            },
          },
          500,
        );

        if (!infoResponse.ok) {
          continue;
        }

        const captureResponse = await fetchWithTimeout(
          `${baseUrl}/capture`,
          {
            method: "POST",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Quality: 60,
              TimeOut: Math.max(10, Math.ceil(config.captureTimeoutMs / 1000)),
            }),
          },
          config.captureTimeoutMs + 2000,
        );

        if (!captureResponse.ok) {
          continue;
        }

        const previewPayload = (await captureResponse.json()) as Record<string, unknown>;
        const bmpDataUrl = parseLegacyPreviewResponse(previewPayload);
        if (!bmpDataUrl) {
          continue;
        }

        return await bmpToPrintableDataUrl(bmpDataUrl);
      } catch {
        // Continue through the candidate list until one preview endpoint responds.
      }
    }
  }

  return null;
}

async function submitPidToBackend(
  config: FingerprintConfig,
  payload: {
    personId: string;
    documentId?: string | null;
    pidXml: string;
    serviceUrl: string;
    deviceInfo?: FingerprintDeviceInfo;
  },
) {
  try {
    const response = await fetch(config.backendEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        capturedAt: new Date().toISOString(),
        deviceModel: config.deviceModel,
      }),
    });

    const responseJson = (await response.json().catch(() => null)) as
      | { message?: string; ok?: boolean }
      | null;

    if (!response.ok) {
      return {
        accepted: false,
        message: responseJson?.message ?? "Backend handoff failed.",
      };
    }

    return {
      accepted: true,
      message: responseJson?.message ?? "PID XML submitted to backend.",
    };
  } catch (error) {
    return {
      accepted: false,
      message:
        error instanceof Error && error.message
          ? error.message
          : "Backend handoff failed before the request completed.",
    };
  }
}

export async function testFingerprintConnection(
  config: FingerprintConfig,
  onStatus?: (status: FingerprintCaptureStatus) => void,
) {
  emitStatus(onStatus, "checking-device", "Checking fingerprint device connection...");
  const discovered = await discoverRdService(config);
  emitStatus(onStatus, "success", "Fingerprint device connection verified.", discovered.baseUrl);
  return discovered;
}

export async function captureFingerprintFromScanner({
  config,
  personId,
  documentId,
  onStatus,
}: CaptureFingerprintArgs): Promise<FingerprintCaptureResult> {
  emitStatus(onStatus, "checking-device", "Checking fingerprint device connection...");
  const discovered = await discoverRdService(config);

  emitStatus(
    onStatus,
    "waiting-for-finger",
    "Device found. Keep your finger on the scanner until capture completes.",
    discovered.baseUrl,
  );

  const parsedPid = await capturePidData(discovered.baseUrl, config);
  if (!parsedPid.ok) {
    throw new Error(parsedPid.errInfo || "Fingerprint capture failed.");
  }

  const thumbImageDataUrl = await captureLegacyPreview(config);

  emitStatus(onStatus, "submitting", "Fingerprint captured. Sending PID data to the app server...");
  const backendResult = await submitPidToBackend(config, {
    personId,
    documentId,
    pidXml: parsedPid.pidXml,
    serviceUrl: discovered.baseUrl,
    deviceInfo: parsedPid.deviceInfo,
  });

  emitStatus(
    onStatus,
    "success",
    thumbImageDataUrl
      ? "Fingerprint captured successfully."
      : "Fingerprint captured successfully. PID XML is ready, but printable thumb preview was not returned by the device.",
    backendResult.message,
  );

  return {
    pidXml: parsedPid.pidXml,
    parsedPid,
    thumbImageDataUrl,
    deviceInfo: parsedPid.deviceInfo,
    serviceUrl: discovered.baseUrl,
    backendAccepted: backendResult.accepted,
    backendMessage: backendResult.message,
  };
}
