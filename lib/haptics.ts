// navigator.vibrate exists on Android Chrome; on iPhone (WebKit) it is missing and this no-ops.
export function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

export const haptics = {
  threshold: () => vibrate(10),
  roundEnd: () => vibrate([60, 80, 60]),
};
