const router = require("express").Router();
router.use("/", require("./events"));
module.exports = router;
