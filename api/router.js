const {
    serverCheck,
    signup,
    signin,
    getusers,
    getuser
} = require("./controller");
const {
    allowifloggedin,
    grantAccess
} = require("./middleware");

const router = require("express").Router();

router.get("/check", serverCheck);

router.post("/signup", signup);

router.post("/signin", signin);

router.get("/getusers", allowifloggedin, grantAccess('readAny', 'profile'), getusers);

router.get("/getuser/:userId", allowifloggedin, getuser);


module.exports = router;