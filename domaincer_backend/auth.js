const JWT = require("jsonwebtoken");

const createJWT = async ({ user }) => { //create token
    return await JWT.sign({ user }, process.env.PRIVATEKEY, { expiresIn: "4h" })
}

const authenticate = async (req, res, next) => { //verify
    try {
        const bearer = req.headers["authorization"];
        if (!bearer) {
            return res.json({ message: "access failed due to null value of token" });
        } else {
            JWT.verify(bearer, process.env.PRIVATEKEY, (err, decode) => {
                // console.log(decode.user)
                if (decode) {
                    req.body.mail = decode.user.Email;
                    next();
                }
                else if (err) {
                    res.json({ err });
                }
            })
        }
    } catch (error) {
        console.log(error);
        return res.json({
            message: "something went wrong authentication"
        });
    }
}

module.exports = { createJWT, authenticate }