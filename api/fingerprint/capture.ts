export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({
      ok: false,
      message: "Only POST is supported for fingerprint capture handoff.",
    });
    return;
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const pidXml = typeof body?.pidXml === "string" ? body.pidXml.trim() : "";
  const personId = typeof body?.personId === "string" ? body.personId.trim() : "";

  if (!pidXml || !pidXml.includes("<PidData")) {
    res.status(400).json({
      ok: false,
      message: "Missing or invalid PID XML payload.",
    });
    return;
  }

  if (!personId) {
    res.status(400).json({
      ok: false,
      message: "Missing person identifier for fingerprint handoff.",
    });
    return;
  }

  const requestId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `fingerprint-${Date.now()}`;

  res.status(200).json({
    ok: true,
    requestId,
    message: "PID XML accepted by backend.",
    summary: {
      personId,
      documentId: body?.documentId ?? null,
      deviceModel: body?.deviceModel ?? null,
      capturedAt: body?.capturedAt ?? null,
      serviceUrl: body?.serviceUrl ?? null,
      pidSize: pidXml.length,
    },
  });
}
