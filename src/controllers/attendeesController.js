// src/controllers/attendeesController.js
const { admin, db } = require("../config/firebaseAdmin");
const { FieldValue } = admin.firestore;
/**
 * Add attendee to /events/{eventId}/attendees/{userId}
 * Enforces: event exists, status=open, capacity, no duplicates.
 */
exports.addAttendee = async (req, res) => {
  const { eventId } = req.params;
  const { userId, fullName, email, ticketType = "guest", pricePaid = 0 } = req.body;
  if (!userId) return res.status(400).json({ error: "userId is required" });
  const eventRef = db.collection("events").doc(eventId);
  const attendeeRef = eventRef.collection("attendees").doc(userId);
  try {
    await db.runTransaction(async (tx) => {
      const es = await tx.get(eventRef);
      if (!es.exists) throw new Error("Event not found");
      const ev = es.data();
      if ((ev.status || "open") !== "open") throw new Error(`Event not open (status=${ev.status})`);
      if ((ev.attendeesCount || 0) >= ev.capacity) throw new Error("Event is full");
      const as = await tx.get(attendeeRef);
      if (as.exists) throw new Error("User already registered");
      tx.set(attendeeRef, {
        userId,
        displayName: (fullName || "").trim(),
        email: (email || "").trim(),
        role: "attendee",
        ticketType: ticketType === "member" ? "member" : "guest",
        pricePaid: Number(pricePaid) || 0,
        status: "registered",
        registeredAt: FieldValue.serverTimestamp(),
        checkedInAt: null
      });
      tx.update(eventRef, { attendeesCount: FieldValue.increment(1) });
    });
    return res.status(201).json({ message: "Attendee added" });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};
/** List attendees of an event */
exports.listAttendees = async (req, res) => {
  const { eventId } = req.params;
  try {
    const qs = await db.collection("events").doc(eventId)
      .collection("attendees")
      .orderBy("registeredAt", "desc")
      .get();
    return res.json({ attendees: qs.docs.map(d => ({ id: d.id, ...d.data() })) });
  } catch (e) {
    return res.status(500).json({ error: "Failed to list attendees", details: e.message });
  }
};
/** Check-in attendee (set status + timestamp) */
exports.checkInAttendee = async (req, res) => {
  const { eventId, userId } = req.params;
  try {
    const ref = db.collection("events").doc(eventId).collection("attendees").doc(userId);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ error: "Attendee not found" });
    await ref.update({
      status: "checked_in",
      checkedInAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const saved = await ref.get();
    return res.json({ id: saved.id, ...saved.data() });
  } catch (e) {
    return res.status(500).json({ error: "Failed to check in", details: e.message });
  }
};
/** Cancel attendee (and decrement count if was registered) */
exports.cancelAttendee = async (req, res) => {
  const { eventId, userId } = req.params;
  const eventRef = db.collection("events").doc(eventId);
  const attendeeRef = eventRef.collection("attendees").doc(userId);
  try {
    await db.runTransaction(async (tx) => {
      const as = await tx.get(attendeeRef);
      if (!as.exists) throw new Error("Attendee not found");
      const attendee = as.data();
      // only decrement if they were occupying a seat
      const shouldDecrement = attendee.status === "registered";
      tx.update(attendeeRef, { status: "canceled" });
      if (shouldDecrement) {
        tx.update(eventRef, { attendeesCount: FieldValue.increment(-1) });
      }
    });
    return res.json({ message: "Attendee canceled" });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};
/** Remove attendee document (optionally decrement if registered) */
exports.removeAttendee = async (req, res) => {
  const { eventId, userId } = req.params;
  const eventRef = db.collection("events").doc(eventId);
  const attendeeRef = eventRef.collection("attendees").doc(userId);
  try {
    await db.runTransaction(async (tx) => {
      const as = await tx.get(attendeeRef);
      if (!as.exists) throw new Error("Attendee not found");
      const attendee = as.data();
      const wasRegistered = attendee.status === "registered";
      tx.delete(attendeeRef);
      if (wasRegistered) {
        tx.update(eventRef, { attendeesCount: FieldValue.increment(-1) });
      }
    });
    return res.json({ message: "Attendee removed" });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};
