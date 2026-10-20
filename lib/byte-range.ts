export type ByteRange =
  | { ok: true; start: number; end: number; partial: boolean }
  | { ok: false };

/**
 * Work out which bytes of a file to send for a request.
 * - No Range header: the whole file (capped below).
 * - "bytes=a-b", "bytes=a-", "bytes=-n" are supported; anything else is unsatisfiable.
 * - Responses larger than maxChunk are cut to maxChunk and sent as a partial (206) response,
 *   which browsers handle by asking for the next piece.
 */
export function resolveByteRange(
  rangeHeader: string | null,
  size: number,
  maxChunk: number,
): ByteRange {
  let start = 0;
  let end = size - 1;
  let partial = false;

  if (rangeHeader) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());
    if (!match || (match[1] === "" && match[2] === "")) return { ok: false };
    if (match[1] === "") {
      start = Math.max(0, size - Number(match[2]));
    } else {
      start = Number(match[1]);
      if (match[2] !== "") end = Math.min(Number(match[2]), size - 1);
    }
    if (start >= size || start > end) return { ok: false };
    partial = true;
  }

  if (end - start + 1 > maxChunk) {
    end = start + maxChunk - 1;
    partial = true;
  }
  return { ok: true, start, end, partial };
}
