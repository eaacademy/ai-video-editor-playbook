import { open, stat } from "node:fs/promises";
import path from "node:path";
import { currentUser } from "@clerk/nextjs/server";
import { hasPlaybookAccess } from "@/lib/access";
import { resolveByteRange } from "@/lib/byte-range";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Only these files can be served. Anything else is a 404.
const FILES: Record<string, string> = {
  "welcome.mp4": "video/mp4",
  "ending.mp4": "video/mp4",
  "welcome-poster.jpg": "image/jpeg",
  "ending-poster.jpg": "image/jpeg",
  "sample.mp4": "video/mp4",
  "sample-poster.jpg": "image/jpeg",
};

// Serverless responses have a size cap, so video is sent in pieces the browser asks for in turn.
const MAX_CHUNK = 3 * 1024 * 1024;

export async function GET(request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const type = FILES[file];
  if (!type) return new Response("Not found", { status: 404 });

  const user = await currentUser();
  if (!user || !hasPlaybookAccess(user)) {
    return new Response("Sign in to watch this video.", { status: 401 });
  }

  const filePath = path.join(process.cwd(), "content", "videos", file);
  const { size } = await stat(filePath);
  const range = resolveByteRange(request.headers.get("range"), size, MAX_CHUNK);
  if (!range.ok) {
    return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
  }

  const { start, end, partial } = range;
  const length = end - start + 1;
  const handle = await open(filePath, "r");
  try {
    const buffer = Buffer.alloc(length);
    await handle.read(buffer, 0, length, start);
    const headers: Record<string, string> = {
      "Content-Type": type,
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, max-age=3600",
      "Content-Length": String(length),
    };
    if (partial) headers["Content-Range"] = `bytes ${start}-${end}/${size}`;
    return new Response(buffer, { status: partial ? 206 : 200, headers });
  } finally {
    await handle.close();
  }
}
