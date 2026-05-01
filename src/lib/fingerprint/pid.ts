import type { FingerprintConfig, FingerprintDeviceInfo, ParsedPidCaptureResponse } from "./types";

function escapeXmlAttribute(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function readTagAttributes(xml: string, tagName: string) {
  const match = xml.match(new RegExp(`<${tagName}\\b([^>]*)\\/?>`, "i"));
  if (!match?.[1]) {
    return {};
  }

  const attributes: Record<string, string> = {};
  const attrPattern = /([A-Za-z0-9:_-]+)="([^"]*)"/g;

  for (const attrMatch of match[1].matchAll(attrPattern)) {
    attributes[attrMatch[1]] = attrMatch[2];
  }

  return attributes;
}

export function buildPidOptionsXml(config: FingerprintConfig) {
  const options = {
    env: config.env,
    fCount: String(config.fingerCount),
    fType: config.fingerType,
    format: config.dataType,
    pidVer: config.pidVersion,
    timeout: String(config.captureTimeoutMs),
    wadh: config.wadh,
    otp: config.otp,
    posh: "UNKNOWN",
  };

  const optionAttributes = Object.entries(options)
    .map(([key, value]) => `${key}="${escapeXmlAttribute(value)}"`)
    .join(" ");

  const customOpts = config.clientKey
    ? `<CustOpts><Param name="ClientKey" value="${escapeXmlAttribute(config.clientKey)}" /></CustOpts>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?><PidOptions ver="1.0"><Opts ${optionAttributes} />${customOpts}</PidOptions>`;
}

export function parsePidCaptureResponse(pidXml: string): ParsedPidCaptureResponse {
  const respAttributes = readTagAttributes(pidXml, "Resp");
  const deviceAttributes = readTagAttributes(pidXml, "DeviceInfo");

  const errCode = respAttributes.errCode ?? "999";
  const errInfo = respAttributes.errInfo ?? "Unknown RD capture response";
  const qScore = respAttributes.qScore;

  let deviceInfo: FingerprintDeviceInfo | undefined;
  if (Object.keys(deviceAttributes).length > 0) {
    deviceInfo = {
      deviceProvider: deviceAttributes.dpId,
      model: deviceAttributes.mi,
      serialNumber: deviceAttributes.srno,
      deviceCode: deviceAttributes.dc,
      serviceId: deviceAttributes.rdsId,
      serviceVersion: deviceAttributes.rdsVer,
    };
  }

  return {
    ok: errCode === "0",
    errCode,
    errInfo,
    qScore,
    pidXml,
    deviceInfo,
  };
}

export function parseLegacyPreviewResponse(payload: Record<string, unknown>) {
  const base64Bmp = typeof payload.Base64BMP === "string" ? payload.Base64BMP.trim() : "";

  if (!base64Bmp) {
    return null;
  }

  return `data:image/bmp;base64,${base64Bmp}`;
}
