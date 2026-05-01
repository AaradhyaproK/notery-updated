import type { FingerprintConfig } from "./types";

export const FINGERPRINT_CONFIG_STORAGE_KEY = "noteryxpert:fingerprint-config";

const DEFAULT_FINGERPRINT_CONFIG: FingerprintConfig = {
  deviceModel: "MANTRA_MFS110",
  transport: "auto",
  rdBaseUrl: "http://127.0.0.1:11100",
  rdSecureBaseUrl: "https://127.0.0.1:11100",
  rdInfoPath: "/rd/info",
  rdCapturePath: "/rd/capture",
  captureTimeoutMs: 15000,
  env: "P",
  fingerCount: 1,
  fingerType: "FMR",
  dataType: "X",
  pidVersion: "2.0",
  wadh: "",
  clientKey: "",
  otp: "",
  backendEndpoint: "/api/fingerprint/capture",
  enablePreviewImage: true,
  previewStrategy: "legacyMantra",
  legacyPreviewHosts: ["127.0.0.1", "localhost"],
  legacyPreviewPorts: [8000, 8001, 8002, 8003, 8004, 8005],
  legacyPreviewDevicePaths: ["mfs100", "mfs110"],
  requireBrowserBridge: true,
};

export function buildFingerprintConfig(overrides: Partial<FingerprintConfig> = {}): FingerprintConfig {
  return {
    ...DEFAULT_FINGERPRINT_CONFIG,
    ...overrides,
    legacyPreviewHosts: overrides.legacyPreviewHosts ?? DEFAULT_FINGERPRINT_CONFIG.legacyPreviewHosts,
    legacyPreviewPorts: overrides.legacyPreviewPorts ?? DEFAULT_FINGERPRINT_CONFIG.legacyPreviewPorts,
    legacyPreviewDevicePaths:
      overrides.legacyPreviewDevicePaths ?? DEFAULT_FINGERPRINT_CONFIG.legacyPreviewDevicePaths,
  };
}

export function getRdServiceCandidates(config: FingerprintConfig): string[] {
  if (config.transport === "https") {
    return [config.rdSecureBaseUrl];
  }

  if (config.transport === "http") {
    return [config.rdBaseUrl];
  }

  return [config.rdSecureBaseUrl, config.rdBaseUrl];
}

export function getLegacyPreviewCandidates(config: FingerprintConfig): string[] {
  const protocols =
    config.transport === "https"
      ? ["https"]
      : config.transport === "http"
        ? ["http"]
        : ["https", "http"];

  const candidates: string[] = [];

  for (const protocol of protocols) {
    for (const port of config.legacyPreviewPorts) {
      for (const host of config.legacyPreviewHosts) {
        for (const devicePath of config.legacyPreviewDevicePaths) {
          candidates.push(`${protocol}://${host}:${port}/${devicePath}`);
        }
      }
    }
  }

  return candidates;
}

export function loadFingerprintConfig(): FingerprintConfig {
  if (typeof window === "undefined") {
    return buildFingerprintConfig();
  }

  const storedValue = window.localStorage.getItem(FINGERPRINT_CONFIG_STORAGE_KEY);
  if (!storedValue) {
    return buildFingerprintConfig();
  }

  try {
    const parsed = JSON.parse(storedValue) as Partial<FingerprintConfig>;
    return buildFingerprintConfig(parsed);
  } catch (error) {
    console.warn("Failed to parse saved fingerprint config. Falling back to defaults.", error);
    return buildFingerprintConfig();
  }
}

export function saveFingerprintConfig(config: FingerprintConfig) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(FINGERPRINT_CONFIG_STORAGE_KEY, JSON.stringify(config));
}
