/**
 * GET /api/fcr-comms-file?id=...&name=...
 * Serves base64 file blobs stored by fcr-comms upload.
 */
import { getVisitorKv, jsonError } from "../_shared/kv.js";

export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get("id") || "";
    const name = url.searchParams.get("name") || "download.bin";
    if (!id || !/^file_[\w-]+$/.test(id)) {
      return jsonError("invalid id", 400);
    }
    const kv = getVisitorKv(context.env);
    const b64 = await kv.get(`fcr:comms:blob:${id}`);
    if (!b64) return jsonError("file not found", 404);

    // decode base64 → binary
    const binary = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const mime = guessMime(name);
    return new Response(binary, {
      headers: {
        "Content-Type": mime,
        "Content-Disposition": `attachment; filename="${name.replace(/"/g, "")}"`,
        "Cache-Control": "private, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return jsonError(err.message || "file serve failed");
  }
}

function guessMime(name) {
  const n = name.toLowerCase();
  if (n.endsWith(".pdf")) return "application/pdf";
  if (n.endsWith(".png")) return "image/png";
  if (n.endsWith(".jpg") || n.endsWith(".jpeg")) return "image/jpeg";
  if (n.endsWith(".gif")) return "image/gif";
  if (n.endsWith(".webp")) return "image/webp";
  if (n.endsWith(".txt")) return "text/plain";
  if (n.endsWith(".csv")) return "text/csv";
  if (n.endsWith(".zip")) return "application/zip";
  if (n.endsWith(".doc") || n.endsWith(".docx")) return "application/msword";
  return "application/octet-stream";
}
