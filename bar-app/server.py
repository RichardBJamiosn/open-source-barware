"""
Bar Inventory Server — Open Source Barware
Flask app serving dashboard.html with JSON API and file-based persistence.
"""

import json, os, ssl, sys, uuid
from datetime import datetime, timezone
from flask import Flask, request, jsonify, send_from_directory

# ─────────────────────────────────────────────
# PATHS
# ─────────────────────────────────────────────
_DIR = os.path.dirname(os.path.abspath(__file__))
_BAR_FILE = os.path.join(_DIR, "bar_data.json")
_COUNT_FILE = os.path.join(_DIR, "count_history.json")

# ─────────────────────────────────────────────
# SSL — same macOS fix as the OVLP pop
# ─────────────────────────────────────────────
def _ssl():
    try:
        import certifi
        ctx = ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    try:
        ctx.maximum_version = ssl.TLSVersion.TLSv1_2
    except (AttributeError, ValueError):
        pass
    try:
        ctx.set_ciphers("DEFAULT:@SECLEVEL=1")
    except ssl.SSLError:
        pass
    return ctx

# ─────────────────────────────────────────────
# FLASK APP
# ─────────────────────────────────────────────
app = Flask(__name__, static_folder=".")


@app.after_request
def _cors(resp):
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
    resp.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    return resp


# ─────────────────────────────────────────────
# PERSISTENCE HELPERS
# ─────────────────────────────────────────────
def _now():
    return datetime.now(timezone.utc).isoformat()


def _uid(prefix=""):
    return f"{prefix}{uuid.uuid4().hex[:8]}"


def _load_bar():
    """Load bar_data.json or return empty scaffold."""
    if os.path.exists(_BAR_FILE):
        try:
            with open(_BAR_FILE) as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            pass
    return {"bar_name": "", "created": "", "stations": []}


def _save_bar(data):
    tmp = _BAR_FILE + ".tmp"
    with open(tmp, "w") as f:
        json.dump(data, f, indent=2)
    os.replace(tmp, _BAR_FILE)


def _load_counts():
    if os.path.exists(_COUNT_FILE):
        try:
            with open(_COUNT_FILE) as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            pass
    return []


def _save_counts(data):
    tmp = _COUNT_FILE + ".tmp"
    with open(tmp, "w") as f:
        json.dump(data, f, indent=2)
    os.replace(tmp, _COUNT_FILE)


def _find_station(bar, station_id):
    """Return (index, station_dict) or (None, None)."""
    for i, s in enumerate(bar.get("stations", [])):
        if s["id"] == station_id:
            return i, s
    return None, None


def _find_bottle(bar, bottle_id):
    """Return (station_dict, bottle_index, bottle_dict) or (None, None, None)."""
    for s in bar.get("stations", []):
        for j, b in enumerate(s.get("bottles", [])):
            if b["id"] == bottle_id:
                return s, j, b
    return None, None, None


def _all_bottles(bar):
    """Flat list of all bottles across all stations."""
    out = []
    for s in bar.get("stations", []):
        for b in s.get("bottles", []):
            out.append(b)
    return out


# ─────────────────────────────────────────────
# ROUTES — Dashboard
# ─────────────────────────────────────────────
@app.route("/")
def index():
    return send_from_directory(_DIR, "dashboard.html")


# ─────────────────────────────────────────────
# ROUTES — Bar Setup & Config
# ─────────────────────────────────────────────
@app.route("/api/bar", methods=["GET"])
def get_bar():
    return jsonify(_load_bar())


@app.route("/api/bar/setup", methods=["POST"])
def setup_bar():
    """Initial setup — bar name and optional starter stations."""
    body = request.get_json(force=True)
    bar = _load_bar()
    bar["bar_name"] = body.get("bar_name", bar.get("bar_name", "My Bar"))
    if not bar["created"]:
        bar["created"] = _now()

    # Accept optional stations array in setup
    for s in body.get("stations", []):
        station = {
            "id": s.get("id") or _uid("stn-"),
            "name": s.get("name", "Station"),
            "type": s.get("type", "well"),
            "position": s.get("position", len(bar["stations"])),
            "bottles": [],
        }
        bar["stations"].append(station)

    _save_bar(bar)
    print(f"[setup] bar configured: {bar['bar_name']}, {len(bar['stations'])} stations")
    return jsonify(bar), 200


@app.route("/api/bar/station", methods=["POST"])
def add_station():
    body = request.get_json(force=True)
    bar = _load_bar()
    station = {
        "id": body.get("id") or _uid("stn-"),
        "name": body.get("name", "Station"),
        "type": body.get("type", "well"),
        "position": body.get("position", len(bar["stations"])),
        "bottles": [],
    }
    bar["stations"].append(station)
    _save_bar(bar)
    print(f"[station] added: {station['name']} ({station['id']})")
    return jsonify(station), 201


@app.route("/api/bar/station/<station_id>", methods=["PUT"])
def update_station(station_id):
    body = request.get_json(force=True)
    bar = _load_bar()
    idx, station = _find_station(bar, station_id)
    if station is None:
        return jsonify({"error": "station not found"}), 404
    for key in ("name", "type", "position"):
        if key in body:
            station[key] = body[key]
    bar["stations"][idx] = station
    _save_bar(bar)
    print(f"[station] updated: {station['name']} ({station_id})")
    return jsonify(station), 200


@app.route("/api/bar/station/<station_id>", methods=["DELETE"])
def delete_station(station_id):
    bar = _load_bar()
    idx, station = _find_station(bar, station_id)
    if station is None:
        return jsonify({"error": "station not found"}), 404
    bar["stations"].pop(idx)
    _save_bar(bar)
    print(f"[station] deleted: {station_id}")
    return jsonify({"deleted": station_id}), 200


# ─────────────────────────────────────────────
# ROUTES — Bottles
# ─────────────────────────────────────────────
@app.route("/api/bottle", methods=["POST"])
def add_bottle():
    body = request.get_json(force=True)
    bar = _load_bar()
    sid = body.get("station_id")
    if not sid:
        return jsonify({"error": "station_id required"}), 400
    idx, station = _find_station(bar, sid)
    if station is None:
        return jsonify({"error": "station not found"}), 404

    bottle = {
        "id": _uid("bot-"),
        "name": body.get("name", "Unknown"),
        "category": body.get("category", "spirits"),
        "size": body.get("size", "750ml"),
        "par_level": float(body.get("par_level", 1.0)),
        "current_level": float(body.get("current_level", 1.0)),
        "cost": float(body.get("cost", 0.0)),
        "last_counted": "",
    }
    station["bottles"].append(bottle)
    _save_bar(bar)
    print(f"[bottle] added: {bottle['name']} -> {station['name']}")
    return jsonify(bottle), 201


@app.route("/api/bottle/<bottle_id>", methods=["PUT"])
def update_bottle(bottle_id):
    body = request.get_json(force=True)
    bar = _load_bar()
    station, bidx, bottle = _find_bottle(bar, bottle_id)
    if bottle is None:
        return jsonify({"error": "bottle not found"}), 404
    for key in ("name", "category", "size", "par_level", "current_level", "cost"):
        if key in body:
            if key in ("par_level", "current_level", "cost"):
                bottle[key] = float(body[key])
            else:
                bottle[key] = body[key]
    if "current_level" in body:
        bottle["last_counted"] = _now()
    station["bottles"][bidx] = bottle
    _save_bar(bar)
    print(f"[bottle] updated: {bottle['name']} ({bottle_id})")
    return jsonify(bottle), 200


@app.route("/api/bottle/<bottle_id>", methods=["DELETE"])
def delete_bottle(bottle_id):
    bar = _load_bar()
    station, bidx, bottle = _find_bottle(bar, bottle_id)
    if bottle is None:
        return jsonify({"error": "bottle not found"}), 404
    station["bottles"].pop(bidx)
    _save_bar(bar)
    print(f"[bottle] deleted: {bottle_id}")
    return jsonify({"deleted": bottle_id}), 200


@app.route("/api/bottles/bulk", methods=["POST"])
def bulk_add_bottles():
    """Add multiple bottles at once (setup wizard). Body: {station_id, bottles: [...]}"""
    body = request.get_json(force=True)
    bar = _load_bar()
    sid = body.get("station_id")
    if not sid:
        return jsonify({"error": "station_id required"}), 400
    idx, station = _find_station(bar, sid)
    if station is None:
        return jsonify({"error": "station not found"}), 404

    added = []
    for b in body.get("bottles", []):
        bottle = {
            "id": _uid("bot-"),
            "name": b.get("name", "Unknown"),
            "category": b.get("category", "spirits"),
            "size": b.get("size", "750ml"),
            "par_level": float(b.get("par_level", 1.0)),
            "current_level": float(b.get("current_level", 1.0)),
            "cost": float(b.get("cost", 0.0)),
            "last_counted": "",
        }
        station["bottles"].append(bottle)
        added.append(bottle)

    _save_bar(bar)
    print(f"[bulk] added {len(added)} bottles to {station['name']}")
    return jsonify({"added": len(added), "bottles": added}), 201


# ─────────────────────────────────────────────
# ROUTES — Counting
# ─────────────────────────────────────────────
@app.route("/api/count", methods=["POST"])
def save_count():
    """Save a count session. Body: {entries: [{bottle_id, level, notes}, ...]}"""
    body = request.get_json(force=True)
    entries = body.get("entries", [])
    if not entries:
        return jsonify({"error": "entries required"}), 400

    bar = _load_bar()

    # Update current_level on each bottle
    below_par = 0
    for entry in entries:
        station, bidx, bottle = _find_bottle(bar, entry.get("bottle_id", ""))
        if bottle:
            bottle["current_level"] = float(entry.get("level", bottle["current_level"]))
            bottle["last_counted"] = _now()
            station["bottles"][bidx] = bottle
            if bottle["current_level"] < bottle["par_level"]:
                below_par += 1

    _save_bar(bar)

    # Save count record
    counts = _load_counts()
    record = {
        "id": _uid("cnt-"),
        "date": _now(),
        "entries": entries,
        "summary": {
            "total_counted": len(entries),
            "below_par": below_par,
        },
    }
    counts.append(record)
    _save_counts(counts)
    print(f"[count] saved: {len(entries)} entries, {below_par} below par")
    return jsonify(record), 201


@app.route("/api/counts", methods=["GET"])
def get_counts():
    return jsonify(_load_counts())


@app.route("/api/count/<count_id>", methods=["GET"])
def get_count(count_id):
    for c in _load_counts():
        if c["id"] == count_id:
            return jsonify(c)
    return jsonify({"error": "count not found"}), 404


# ─────────────────────────────────────────────
# ROUTES — Voice/Text Parser
# ─────────────────────────────────────────────

# Level keywords → float value
_LEVEL_MAP = {
    "full": 1.0, "new": 1.0, "sealed": 1.0, "unopened": 1.0,
    "three quarters": 0.75, "three fourths": 0.75, "three-quarters": 0.75,
    "half": 0.5, "half bottle": 0.5,
    "quarter": 0.25, "one quarter": 0.25,
    "empty": 0.0, "done": 0.0, "dead": 0.0, "86": 0.0,
    "eighty-six": 0.0, "eighty six": 0.0,
}

# Common words to strip for fuzzy matching
_STRIP_WORDS = {
    "vodka", "gin", "rum", "tequila", "whiskey", "whisky", "bourbon",
    "scotch", "brandy", "cognac", "liqueur", "wine", "beer", "ale",
    "lager", "ipa", "stout", "porter", "cider", "seltzer", "mixer",
    "bottle", "bottles", "the", "a", "an", "of",
}


def _normalize(name):
    """Lowercase, strip punctuation + common category words, collapse whitespace."""
    import re
    n = re.sub(r"[''`\-.,!?]", "", name.lower().strip())
    words = [w for w in n.split() if w not in _STRIP_WORDS]
    return " ".join(words) if words else n.lower().strip()


def _fuzzy_match(text, bottles):
    """Try to match text against bottle names. Return (bottle, confidence) or (None, None)."""
    text_norm = _normalize(text)
    if not text_norm:
        return None, None

    # Exact match on normalized name
    for b in bottles:
        if _normalize(b["name"]) == text_norm:
            return b, "high"

    # Substring match — text is contained in bottle name or vice versa
    for b in bottles:
        bn = _normalize(b["name"])
        if text_norm in bn or bn in text_norm:
            return b, "medium"

    # Partial word overlap
    text_words = set(text_norm.split())
    best = None
    best_score = 0
    for b in bottles:
        bn_words = set(_normalize(b["name"]).split())
        overlap = len(text_words & bn_words)
        if overlap > best_score and overlap > 0:
            best = b
            best_score = overlap

    if best and best_score >= 1:
        return best, "low"

    return None, None


def _parse_level(text):
    """Extract a level float from text. Return (level, remainder) or (None, text)."""
    t = text.lower().strip()

    # Check multi-word keywords first (longest match first)
    for phrase in sorted(_LEVEL_MAP.keys(), key=len, reverse=True):
        if phrase in t:
            remainder = t.replace(phrase, "", 1).strip()
            return _LEVEL_MAP[phrase], remainder

    # "point X" or "point four" etc.
    import re
    m = re.search(r'point\s+(\d)', t)
    if m:
        val = int(m.group(1)) / 10.0
        remainder = t[:m.start()] + t[m.end():]
        return val, remainder.strip()

    # Word-form "point four", "point seven" etc.
    _word_digits = {
        "zero": 0, "one": 1, "two": 2, "three": 3, "four": 4,
        "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9,
    }
    m = re.search(r'point\s+(' + '|'.join(_word_digits.keys()) + r')', t)
    if m:
        val = _word_digits[m.group(1)] / 10.0
        remainder = t[:m.start()] + t[m.end():]
        return val, remainder.strip()

    # Decimal like "0.4" or ".6"
    m = re.search(r'(\d*\.\d+)', t)
    if m:
        val = float(m.group(1))
        if val > 1.0:
            val = val  # could be case count, leave as-is
        remainder = t[:m.start()] + t[m.end():]
        return val, remainder.strip()

    # Storage: "X cases Y bottles" or "X case" or "X bottles"
    m = re.search(r'(\d+)\s*cases?\s*(?:(\d+)\s*bottles?)?', t)
    if m:
        cases = int(m.group(1))
        extra = int(m.group(2)) if m.group(2) else 0
        # A case is typically 12 bottles; represent as full bottle count
        total = cases * 12 + extra
        remainder = t[:m.start()] + t[m.end():]
        return float(total), remainder.strip()

    m = re.search(r'(\d+)\s*bottles?', t)
    if m:
        remainder = t[:m.start()] + t[m.end():]
        return float(int(m.group(1))), remainder.strip()

    # Bare integer or float
    m = re.search(r'\b(\d+)\b', t)
    if m:
        val = int(m.group(1))
        # Single digit 1-9 alone — likely a tenths level (e.g., "3" = 0.3)
        # But could also be a count. Context-dependent; default to tenths if <=9
        remainder = t[:m.start()] + t[m.end():]
        if 1 <= val <= 9:
            return val / 10.0, remainder.strip()
        return float(val), remainder.strip()

    return None, t


@app.route("/api/parse-notes", methods=["POST"])
def parse_notes():
    """Parse voice/text notes into structured bottle entries.

    Body: {text: "Well one titos half stoli point two tanqueray empty"}
    Returns: {matched: [...], unmatched: [...]}
    """
    body = request.get_json(force=True)
    raw = body.get("text", "").strip()
    if not raw:
        return jsonify({"error": "text required"}), 400

    bar = _load_bar()
    all_bottles = _all_bottles(bar)
    station_names = {s["name"].lower(): s for s in bar.get("stations", [])}

    # Split by station markers if present
    import re
    segments = []
    station_pattern = "|".join(re.escape(n) for n in station_names.keys()) if station_names else None

    if station_pattern:
        parts = re.split(f"({station_pattern})", raw.lower())
        current_station = None
        for part in parts:
            part = part.strip()
            if not part:
                continue
            if part in station_names:
                current_station = station_names[part]
            else:
                segments.append((current_station, part))
    else:
        segments = [(None, raw.lower())]

    matched = []
    unmatched = []

    for station_ctx, segment in segments:
        # Determine which bottles to search in
        if station_ctx:
            search_bottles = station_ctx.get("bottles", [])
        else:
            search_bottles = all_bottles

        # Tokenize: try to find bottle-name + level pairs
        # Strategy: walk through words, accumulate until we find a level or bottle match
        words = segment.split()
        i = 0
        while i < len(words):
            # Try increasingly long spans for bottle name matching
            best_match = None
            best_confidence = None
            best_end = i
            best_level = None

            for end in range(i + 1, min(i + 6, len(words) + 1)):
                candidate = " ".join(words[i:end])

                bottle, confidence = _fuzzy_match(candidate, search_bottles)
                if bottle:
                    best_match = bottle
                    best_confidence = confidence
                    best_end = end

                    # Look for level after the name
                    remaining = " ".join(words[end:end + 4])
                    level, _ = _parse_level(remaining)
                    if level is not None:
                        best_level = level
                        # Count how many words the level consumed
                        level_text_len = len(remaining) - len(_.strip()) if _ else len(remaining)
                        # Rough word count consumed by level
                        level_words = len(remaining[:level_text_len].split()) if level_text_len > 0 else 0
                        best_end = end + max(level_words, 1)

            if best_match:
                entry = {
                    "bottle_id": best_match["id"],
                    "bottle_name": best_match["name"],
                    "level": best_level if best_level is not None else best_match.get("current_level", 1.0),
                    "confidence": best_confidence if best_level is not None else "low",
                    "notes": "",
                }
                if best_level is not None and best_confidence == "high":
                    entry["confidence"] = "high"
                matched.append(entry)
                i = best_end
            else:
                # Check if this word alone is a level with no bottle context
                level, remainder = _parse_level(words[i])
                if level is not None:
                    unmatched.append({
                        "text": words[i],
                        "parsed_level": level,
                        "reason": "no bottle match",
                    })
                else:
                    # Accumulate as unmatched text
                    unmatched.append({
                        "text": words[i],
                        "parsed_level": None,
                        "reason": "unrecognized",
                    })
                i += 1

    print(f"[parse] {len(matched)} matched, {len(unmatched)} unmatched from {len(raw)} chars")
    return jsonify({"matched": matched, "unmatched": unmatched}), 200


# ─────────────────────────────────────────────
# ROUTES — Stats & Variance
# ─────────────────────────────────────────────
@app.route("/api/stats", methods=["GET"])
def get_stats():
    bar = _load_bar()
    bottles = _all_bottles(bar)
    counts = _load_counts()

    total_products = len(bottles)
    total_value = sum(b.get("cost", 0) * b.get("current_level", 0) for b in bottles)
    below_par = sum(1 for b in bottles if b.get("current_level", 0) < b.get("par_level", 1))
    last_count = counts[-1]["date"] if counts else None

    return jsonify({
        "total_products": total_products,
        "total_value": round(total_value, 2),
        "below_par": below_par,
        "last_count_date": last_count,
        "total_counts": len(counts),
        "station_count": len(bar.get("stations", [])),
        "bar_name": bar.get("bar_name", ""),
    })


@app.route("/api/variance", methods=["GET"])
def get_variance():
    """Compare last two counts and return variance per bottle."""
    counts = _load_counts()
    if len(counts) < 2:
        return jsonify({"error": "need at least 2 counts for variance", "variance": []}), 200

    current = counts[-1]
    previous = counts[-2]

    # Build lookup: bottle_id -> level for each count
    cur_levels = {e["bottle_id"]: e["level"] for e in current.get("entries", [])}
    prev_levels = {e["bottle_id"]: e["level"] for e in previous.get("entries", [])}

    bar = _load_bar()
    variance = []
    for bottle in _all_bottles(bar):
        bid = bottle["id"]
        if bid in cur_levels and bid in prev_levels:
            cur = float(cur_levels[bid])
            prev = float(prev_levels[bid])
            diff = cur - prev
            variance.append({
                "bottle_id": bid,
                "bottle_name": bottle["name"],
                "previous_level": prev,
                "current_level": cur,
                "variance": round(diff, 3),
                "cost_impact": round(diff * bottle.get("cost", 0), 2),
            })

    # Sort by variance (biggest drops first)
    variance.sort(key=lambda v: v["variance"])

    return jsonify({
        "current_count": current["id"],
        "current_date": current["date"],
        "previous_count": previous["id"],
        "previous_date": previous["date"],
        "variance": variance,
    })


# ─────────────────────────────────────────────
# ROUTES — Utility
# ─────────────────────────────────────────────
@app.route("/ping")
def ping():
    return jsonify({"status": "ok", "app": "bar-inventory", "port": 5051})


# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────
if __name__ == "__main__":
    # Init data files if missing
    if not os.path.exists(_BAR_FILE):
        _save_bar({"bar_name": "", "created": "", "stations": []})
        print(f"[init] created {_BAR_FILE}")
    if not os.path.exists(_COUNT_FILE):
        _save_counts([])
        print(f"[init] created {_COUNT_FILE}")

    print("\n  Bar Inventory — Open Source Barware")
    print("  ──────────────────────────────────────────────────────")
    print(f"  Dashboard:  http://localhost:5051/")
    print(f"  API:        http://localhost:5051/api/bar")
    print(f"  Stats:      http://localhost:5051/api/stats")
    print(f"  Ping:       http://localhost:5051/ping")
    print(f"  ──────────────────────────────────────────────────────")
    print(f"  Data:       {_BAR_FILE}")
    print(f"  Counts:     {_COUNT_FILE}")

    # SSL — same pattern as OVLP pop
    cert = os.path.join(_DIR, "localhost+1.pem")
    key = os.path.join(_DIR, "localhost+1-key.pem")
    ssl_ctx = (cert, key) if os.path.exists(cert) else None
    if ssl_ctx:
        print("  HTTPS: using mkcert cert (trusted by Chrome)\n")
    else:
        print("  Running HTTP (no cert found)\n")

    app.run(host="0.0.0.0", port=5051, debug=False, threaded=True, ssl_context=ssl_ctx)
