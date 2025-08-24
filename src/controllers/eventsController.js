// src/controllers/eventsController.js
const { admin, db } = require("../config/firebaseAdmin");
const { Timestamp, FieldValue } = admin.firestore;
// ---------- helpers ----------
function mustStr(v, name, errors) {
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) errors.push(`${name} is required`);
  return s;
}
function optStr(v) {
  return typeof v === "string" ? v.trim() : "";
}
function num(v, name, errors) {
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) errors.push(`${name} must be a non-negative number`);
  return n;
}
function toTs(iso, name, errors) {
  if (iso == null) return null;
  const d = new Date(String(iso));
  if (isNaN(d)) {
    errors.push(`${name} must be ISO date e.g. 2025-08-25T14:00:00+03:00`);
    return null;
  }
  return Timestamp.fromDate(d);
}
// ---------- create ----------
exports.createEvent = async (req, res) => {
  const b = req.body;
  const errors = [];
  const title = mustStr(b.title, "title", errors);
  const type = mustStr(b.type, "type", errors);            // "Event" | "Trip" ...
  const location = mustStr(b.location, "location", errors);
  const overview = optStr(b.overview);
  // keeping your current key name to match existing docs:
  const discerption = optStr(b.discerption);
  const capacity = num(b.capacity, "capacity", errors);
  const memberPrice = num(b.memberPrice, "memberPrice", errors);
  const userPrice = num(b.userPrice, "userPrice", errors);
  const startsAt = toTs(b.startsAt, "startsAt", errors);
  const endsAt = toTs(b.endsAt, "endsAt", errors);
  const createdBy = optStr(b.createdBy) || "Admin";
  const status = (optStr(b.status) || "open").toLowerCase(); // open|closed|canceled
  if (startsAt && endsAt && endsAt.toMillis() <= startsAt.toMillis()) {
    errors.push("endsAt must be after startsAt");
  }
  if (errors.length) return res.status(400).json({ errors });
  try {
    const doc = {
      title, type, location, overview, discerption,
      capacity, memberPrice, userPrice,
      startsAt, endsAt,
      createdBy,
      createdAtServer: FieldValue.serverTimestamp(),
      attendeesCount: 0,
      status,
    };
    const ref = await db.collection("events").add(doc);
    const snap = await ref.get();
    return res.status(201).json({ id: ref.id, event: snap.data() });
  } catch (e) {
    return res.status(500).json({ error: "Failed to create event", details: e.message });
  }
};
// ---------- list ----------
exports.listEvents = async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    let q = db.collection("events").orderBy("startsAt", "asc").limit(Number(limit));
    if (status) q = q.where("status", "==", String(status).toLowerCase());
    const qs = await q.get();
    return res.json({ events: qs.docs.map(d => ({ id: d.id, ...d.data() })) });
  } catch (e) {
    return res.status(500).json({ error: "Failed to list events", details: e.message });
  }
};
// ---------- get one ----------
exports.getEvent = async (req, res) => {
  try {
    const snap = await db.collection("events").doc(req.params.eventId).get();
    if (!snap.exists) return res.status(404).json({ error: "Event not found" });
    return res.json({ id: snap.id, ...snap.data() });
  } catch (e) {
    return res.status(500).json({ error: "Failed to get event", details: e.message });
  }
};
// ---------- update (PATCH-style) ----------
exports.updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const b = req.body;
  const errors = [];
  // only allow updating known fields
  const update = {};
  if (b.title != null) update.title = optStr(b.title);
  if (b.type != null) update.type = optStr(b.type);
  if (b.location != null) update.location = optStr(b.location);
  if (b.overview != null) update.overview = optStr(b.overview);
  if (b.discerption != null) update.discerption = optStr(b.discerption);
  if (b.capacity != null) update.capacity = num(b.capacity, "capacity", errors);
  if (b.memberPrice != null) update.memberPrice = num(b.memberPrice, "memberPrice", errors);
  if (b.userPrice != null) update.userPrice = num(b.userPrice, "userPrice", errors);
  if (b.startsAt != null) update.startsAt = toTs(b.startsAt, "startsAt", errors);
  if (b.endsAt != null) update.endsAt = toTs(b.endsAt, "endsAt", errors);
  if (b.status != null) update.status = String(b.status).toLowerCase();
  if (update.startsAt && update.endsAt && update.endsAt.toMillis() <= update.startsAt.toMillis()) {
    errors.push("endsAt must be after startsAt");
  }
  if (errors.length) return res.status(400).json({ errors });
  try {
    const ref = db.collection("events").doc(eventId);
    const exist = await ref.get();
    if (!exist.exists) return res.status(404).json({ error: "Event not found" });
    await ref.update(update);
    const saved = await ref.get();
    return res.json({ id: saved.id, ...saved.data() });
  } catch (e) {
    return res.status(500).json({ error: "Failed to update event", details: e.message });
  }
};
// ---------- archive (soft delete) ----------
exports.archiveEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    const ref = db.collection("events").doc(eventId);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ error: "Event not found" });
    await ref.update({ status: "canceled" });
    const saved = await ref.get();
    return res.json({ id: saved.id, ...saved.data() });
  } catch (e) {
    return res.status(500).json({ error: "Failed to archive event", details: e.message });
  }
}