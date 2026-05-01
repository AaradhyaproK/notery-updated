# Webcam Preview Timeout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Auto-stop the Settings webcam preview 15 seconds after the live stream starts, while keeping success and error messages visible on the same card.

**Architecture:** Keep the timeout behavior local to the Settings page because only that screen owns the preview stream and buttons. Add the user-facing timeout/status wording in the webcam helper module so the messages stay testable and consistent.

**Tech Stack:** React 19, TypeScript, Vite, `node:test`, `tsx`

---

### Task 1: Add Webcam Timeout Status Coverage

**Files:**
- Modify: `src/lib/webcam/status.test.ts`
- Modify: `src/lib/webcam/status.ts`

- [ ] **Step 1: Write the failing test**

```ts
test("webcam preview timeout uses a fixed 15 second window", () => {
  assert.equal(WEBCAM_PREVIEW_TIMEOUT_MS, 15000);
});

test("buildWebcamAutoStopStatus explains the automatic stop after the quick check", () => {
  const status = buildWebcamAutoStopStatus(15);

  assert.equal(status.stage, "idle");
  assert.equal(status.message, "Preview stopped automatically after 15 seconds.");
  assert.match(status.details ?? "", /camera is ready/i);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test src/lib/webcam/status.test.ts`
Expected: FAIL because `WEBCAM_PREVIEW_TIMEOUT_MS` and `buildWebcamAutoStopStatus` do not exist yet.

- [ ] **Step 3: Write minimal implementation**

```ts
export const WEBCAM_PREVIEW_TIMEOUT_MS = 15000;

export function buildWebcamAutoStopStatus(durationSeconds: number): WebcamPreviewStatus {
  return {
    stage: "idle",
    message: `Preview stopped automatically after ${durationSeconds} seconds.`,
    details: "The camera is ready. Start the preview again anytime if you want to recheck it.",
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx --test src/lib/webcam/status.test.ts`
Expected: PASS

### Task 2: Wire the 15-Second Auto-Stop Into Settings

**Files:**
- Modify: `src/pages/Settings.tsx`
- Test: `src/lib/webcam/status.test.ts`

- [ ] **Step 1: Extend the Settings preview flow**

```tsx
const webcamAutoStopTimeoutRef = useRef<number | null>(null);

const clearWebcamAutoStopTimeout = () => {
  if (webcamAutoStopTimeoutRef.current !== null) {
    window.clearTimeout(webcamAutoStopTimeoutRef.current);
    webcamAutoStopTimeoutRef.current = null;
  }
};

const handleStopWebcam = (reason: "manual" | "auto" = "manual") => {
  webcamRequestIdRef.current += 1;
  clearWebcamAutoStopTimeout();
  stopWebcamStream();
  setIsTestingWebcam(false);
  setIsWebcamPreviewActive(false);
  setWebcamStatus(
    reason === "auto"
      ? buildWebcamAutoStopStatus(WEBCAM_PREVIEW_TIMEOUT_MS / 1000)
      : {
          stage: "idle",
          message: "Preview stopped.",
          details: "Start the preview again whenever you want to confirm the camera is working.",
        },
  );
};
```

- [ ] **Step 2: Start the timer only after the live stream is active**

```tsx
setIsWebcamPreviewActive(true);
setWebcamStatus(buildWebcamSuccessStatus(stream.getVideoTracks()[0]?.label));
clearWebcamAutoStopTimeout();
webcamAutoStopTimeoutRef.current = window.setTimeout(() => {
  handleStopWebcam("auto");
}, WEBCAM_PREVIEW_TIMEOUT_MS);
```

- [ ] **Step 3: Clear the timer on every exit path**

```tsx
stopWebcamStream();
clearWebcamAutoStopTimeout();
```

- [ ] **Step 4: Run full verification**

Run: `npm test`
Expected: PASS

Run: `npm run lint`
Expected: PASS

Run: `npm run build`
Expected: PASS
