const jwt = require("jsonwebtoken");
const {
    roles
} = require('./roles')

exports.allowifloggedin = async (req, res, next) => {
    if (typeof req.headers.authorization !== "undefined") {
        let token = req.headers.authorization.split(" ")[1];
        // console.log(token);
        if (!token) return res.status(401).send("Access Denied");
        jwt.verify(
            token,
            process.env.JWT_SECRET, {
                algorithm: "HS256"
            },
            (err, user) => {
                if (err) {
                    console.log(err);
                    return res.status(401).json({
                        error: "You need to be logged in to access this route"
                    });
                } else {
                    // console.log(user);
                    //transferring user details for futher user
                    req.user = user;
                    next();
                }
            }
        );
    } else {
        return res.status(401).json({
            error: "You need to be logged in to access this route"
        });
    }
};


exports.grantAccess = function (action, resource) {
    return async (req, res, next) => {
        console.log(req.user);
        try {
            const permission = roles.can(req.user.role)[action](resource);
            if (!permission.granted) {
                return res.status(401).json({
                    error: "You don't have enough permission to perform this action"
                });
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}