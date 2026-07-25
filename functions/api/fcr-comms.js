/**
 * FCR Capital Nexus — shared chat + file cabinet
 * GET  /api/fcr-comms          → { messages, files }
 * POST /api/fcr-comms          → send message or upload meta
 *   { action: "send", author, text, attachments? }
 *   { action: "upload", name, mime, size, data_base64? , url? }
 *   { action: "seed" }         → force re-seed welcome if empty
 */
import { cors, getVisitorKv, jsonError } from "../_shared/kv.js";

const MSG_KEY = "fcr:comms:messages";
const FILE_KEY = "fcr:comms:files";
const MAX_MESSAGES = 400;
const MAX_FILE_META = 200;
const MAX_INLINE_B64 = 900_000; // ~900KB safety under KV 25MB

const INVOICE = {
  id: "file_invoice_signed_2026",
  name: "Faber_Capital_Resources_Invoice_and_Connected_Build_Agreement_Signed.pdf",
  mime: "application/pdf",
  size: 261644,
  url: "/B-ATCAVE/fcr/invoice-signed.pdf",
  uploaded_by: "Richard",
  ts: Date.now(),
};

/** FCR New Hero Carousel — downloadable package for Bill's web vendor */
const HERO_CAROUSEL = {
  id: "file_fcr_new_hero_carousel",
  name: "FCR_New_Hero_Carousel.zip",
  mime: "application/zip",
  size: 4400,
  url: "/B-ATCAVE/fcr/files/FCR_New_Hero_Carousel.zip",
  uploaded_by: "Richard",
  ts: Date.now(),
  label: "FCR New Hero Carousel",
};

/** FCR Preliminary Website Build · Market Analysis & Handoff */
const PRELIM_HANDOFF = {
  id: "file_fcr_preliminary_website_build",
  name: "FCR_Preliminary_Website_Build_Market_Analysis_and_Handoff.pdf",
  mime: "application/pdf",
  size: 243145,
  url: "/B-ATCAVE/fcr/files/FCR_Preliminary_Website_Build_Market_Analysis_and_Handoff.pdf",
  uploaded_by: "Richard",
  ts: Date.now(),
  label: "FCR Preliminary Website Build · Market Analysis & Handoff",
};

function welcomeMessage(ts) {
  return {
    id: "msg_welcome_richard",
    author: "Richard",
    role: "richard",
    ts: ts || Date.now(),
    text:
      "Hey, welcome to the FCR Capital Nexus dashboard. In here you will find what I believe to be the setup we will be working in. I’m very happy to make changes; please suggest anything you feel will improve our communications, and I can build it for us.\n\n" +
      "In the top-right corner of the admin panel you’ll see a Help button. It has menu help descriptions for everything in this Nexus build — any relevant admin-panel information will be there when you need it.\n\n" +
      "I’ve set up notifications so I get a text whenever there’s a new communication here. I can also notify you when there are new messages for you.\n\n" +
      "We’re meeting this week to begin mapping your agency. While I have time today and tomorrow, here’s what I need to get started:\n\n" +
      "1) If you’re comfortable with me taking over the website without changing anything visual right now, I’d like to inject a set of trackers into the code so we get immediate analytics on all property/traffic data.\n\n" +
      "2) With your permission, I’d also like to start building the second site — the mock-up marketing site we discussed.\n\n" +
      "3) Please tell me who your web agency is that hosts the URL, or if you built it yourself, where the site is hosted, so I can change DNS to point to the website I’ll host.\n\n" +
      "I’ve also attached the PDF invoice / connected build agreement I’m sending you by email — you can download it from this chat and from the File Cabinet on the right.",
    attachments: [
      {
        id: INVOICE.id,
        name: INVOICE.name,
        mime: INVOICE.mime,
        url: INVOICE.url,
        size: INVOICE.size,
      },
    ],
  };
}

async function readJson(kv, key, fallback) {
  const raw = await kv.get(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function ensureSeed(kv) {
  let messages = await readJson(kv, MSG_KEY, null);
  let files = await readJson(kv, FILE_KEY, null);
  let seeded = false;

  if (!Array.isArray(messages) || messages.length === 0) {
    const ts = Date.now();
    messages = [welcomeMessage(ts)];
    await kv.put(MSG_KEY, JSON.stringify(messages));
    seeded = true;
  }

  if (!Array.isArray(files) || files.length === 0) {
    files = [
      { ...PRELIM_HANDOFF, ts: Date.now() },
      { ...HERO_CAROUSEL, ts: Date.now() },
      { ...INVOICE, ts: Date.now() },
    ];
    await kv.put(FILE_KEY, JSON.stringify(files));
    seeded = true;
  } else {
    let changed = false;
    if (!files.some((f) => f.id === INVOICE.id || f.name === INVOICE.name)) {
      files.unshift({ ...INVOICE, ts: Date.now() });
      changed = true;
    }
    if (!files.some((f) => f.id === HERO_CAROUSEL.id || f.name === HERO_CAROUSEL.name)) {
      files.unshift({ ...HERO_CAROUSEL, ts: Date.now() });
      changed = true;
    }
    if (!files.some((f) => f.id === PRELIM_HANDOFF.id || f.name === PRELIM_HANDOFF.name)) {
      files.unshift({ ...PRELIM_HANDOFF, ts: Date.now() });
      changed = true;
    }
    if (changed) {
      if (files.length > MAX_FILE_META) files = files.slice(0, MAX_FILE_META);
      await kv.put(FILE_KEY, JSON.stringify(files));
      seeded = true;
    }
  }

  return { messages, files, seeded };
}

export async function onRequestGet(context) {
  try {
    const kv = getVisitorKv(context.env);
    const data = await ensureSeed(kv);
    return new Response(
      JSON.stringify({
        ok: true,
        messages: data.messages,
        files: data.files,
        seeded: data.seeded,
      }),
      { headers: { ...cors("GET, POST, OPTIONS"), "Cache-Control": "no-store" } }
    );
  } catch (err) {
    return jsonError(err.message || "fcr-comms get failed");
  }
}

export async function onRequestPost(context) {
  try {
    const kv = getVisitorKv(context.env);
    let body = {};
    try {
      body = await context.request.json();
    } catch {
      body = {};
    }

    const action = String(body.action || "send");
    await ensureSeed(kv);

    if (action === "send") {
      const author = String(body.author || "Guest").slice(0, 40);
      const role =
        body.role === "richard" || /richard/i.test(author) ? "richard" : "fcr";
      const text = String(body.text || "").trim().slice(0, 8000);
      const attachments = Array.isArray(body.attachments)
        ? body.attachments.slice(0, 8).map((a) => ({
            id: String(a.id || "").slice(0, 80),
            name: String(a.name || "file").slice(0, 200),
            mime: String(a.mime || "application/octet-stream").slice(0, 100),
            url: String(a.url || "").slice(0, 500),
            size: Number(a.size) || 0,
          }))
        : [];

      if (!text && !attachments.length) {
        return jsonError("empty message", 400);
      }

      const messages = await readJson(kv, MSG_KEY, []);
      const msg = {
        id: "msg_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
        author,
        role,
        ts: Date.now(),
        text,
        attachments,
      };
      messages.push(msg);
      while (messages.length > MAX_MESSAGES) messages.shift();
      await kv.put(MSG_KEY, JSON.stringify(messages));

      // lightweight notify flag for Richard (dashboard / future SMS hook)
      await kv.put(
        "fcr:comms:last_notify",
        JSON.stringify({
          ts: Date.now(),
          author,
          preview: text.slice(0, 160),
          has_files: attachments.length > 0,
        })
      );

      return new Response(JSON.stringify({ ok: true, message: msg }), {
        headers: cors("GET, POST, OPTIONS"),
      });
    }

    // Operator cleanup: drop probe/test messages; keep real conversation
    if (action === "prune_test") {
      const messages = await readJson(kv, MSG_KEY, []);
      const kept = messages.filter((m) => {
        const t = String(m.text || "");
        if (/^m+$/.test(t)) return false;
        if (/^test short message/i.test(t)) return false;
        if (/^x+$/i.test(t)) return false;
        return true;
      });
      await kv.put(MSG_KEY, JSON.stringify(kept));
      return new Response(
        JSON.stringify({ ok: true, before: messages.length, after: kept.length }),
        { headers: cors("GET, POST, OPTIONS") }
      );
    }

    if (action === "upload") {
      const name = String(body.name || "upload.bin").slice(0, 200);
      const mime = String(body.mime || "application/octet-stream").slice(0, 100);
      const size = Number(body.size) || 0;
      const author = String(body.author || "Guest").slice(0, 40);
      let url = String(body.url || "").slice(0, 500);
      const b64 = body.data_base64 ? String(body.data_base64) : "";

      if (b64) {
        if (b64.length > MAX_INLINE_B64) {
          return jsonError(
            "File too large for inline storage (max ~650KB). Use a smaller file or we can wire R2 later.",
            413
          );
        }
        const id = "file_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
        await kv.put(`fcr:comms:blob:${id}`, b64, { expirationTtl: 60 * 60 * 24 * 90 });
        url = `/api/fcr-comms-file?id=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}`;
        const files = await readJson(kv, FILE_KEY, []);
        const meta = {
          id,
          name,
          mime,
          size: size || Math.round((b64.length * 3) / 4),
          url,
          uploaded_by: author,
          ts: Date.now(),
          storage: "kv",
        };
        files.unshift(meta);
        while (files.length > MAX_FILE_META) files.pop();
        await kv.put(FILE_KEY, JSON.stringify(files));
        return new Response(JSON.stringify({ ok: true, file: meta }), {
          headers: cors("GET, POST, OPTIONS"),
        });
      }

      if (!url) return jsonError("upload requires data_base64 or url", 400);
      const files = await readJson(kv, FILE_KEY, []);
      const meta = {
        id: "file_" + Date.now(),
        name,
        mime,
        size,
        url,
        uploaded_by: author,
        ts: Date.now(),
        storage: "url",
      };
      files.unshift(meta);
      while (files.length > MAX_FILE_META) files.pop();
      await kv.put(FILE_KEY, JSON.stringify(files));
      return new Response(JSON.stringify({ ok: true, file: meta }), {
        headers: cors("GET, POST, OPTIONS"),
      });
    }

    return jsonError("unknown action", 400);
  } catch (err) {
    return jsonError(err.message || "fcr-comms post failed");
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: cors("GET, POST, OPTIONS") });
}
