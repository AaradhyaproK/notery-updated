export type FingerprintTransport = "auto" | "http" | "https";
export type FingerprintEnvironment = "P" | "PP" | "S";
export type FingerprintDataType = "X" | "P";
export type FingerprintType = "FMR" | "FIR" | "BOTH";
export type FingerprintPreviewStrategy = "legacyMantra" | "none";

export interface FingerprintConfig {
  deviceModel: "MANTRA_MFS110";
  transport: FingerprintTransport;
  rdBaseUrl: string;
  rdSecureBaseUrl: string;
  rdInfoPath: string;
  rdCapturePath: string;
  captureTimeoutMs: number;
  env: FingerprintEnvironment;
  fingerCount: number;
  fingerType: FingerprintType;
  dataType: FingerprintDataType;
  pidVersion: "2.0";
  wadh: string;
  clientKey: string;
  otp: string;
  backendEndpoint: string;
  enablePreviewImage: boolean;
  previewStrategy: FingerprintPreviewStrategy;
  legacyPreviewHosts: string[];
  legacyPreviewPorts: number[];
  legacyPreviewDevicePaths: string[];
  requireBrowserBridge: boolean;
}

export interface FingerprintDeviceInfo {
  deviceProvider?: string;
  model?: string;
  serialNumber?: string;
  deviceCode?: string;
  serviceId?: string;
  serviceVersion?: string;
}

export interface ParsedPidCaptureResponse {
  ok: boolean;
  errCode: string;
  errInfo: string;
  qScore?: string;
  pidXml: string;
  deviceInfo?: FingerprintDeviceInfo;
}
