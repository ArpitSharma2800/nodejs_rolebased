const {
    serverCheck
} = require("./controller");

const router = require("express").Router();

router.get("/check", serverCheck);

module.exports = router;