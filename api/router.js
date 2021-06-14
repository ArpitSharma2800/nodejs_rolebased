const {
    serverCheck,
    signup,
    signin
} = require("./controller");

const router = require("express").Router();

router.get("/check", serverCheck);

router.post("/signup", signup);

router.post("/signin", signin);

module.exports = router;