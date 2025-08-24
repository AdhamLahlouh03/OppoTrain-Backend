const router = require("express").Router();
const requireAdmin = require("../middlewares/requireAdmin");
const events = require("../controllers/eventsController");
const attendees = require("../controllers/attendeesController");

// Events
router.post("/events", requireAdmin, events.createEvent);
router.get("/events", requireAdmin, events.listEvents);
router.get("/events/:eventId", requireAdmin, events.getEvent);

// Attendees (under an event)
router.post("/events/:eventId/attendees", requireAdmin, attendees.addAttendee);
router.get("/events/:eventId/attendees", requireAdmin, attendees.listAttendees);

module.exports = router;
