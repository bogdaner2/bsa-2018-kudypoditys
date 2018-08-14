const express = require("express");
const authRouter = express.Router();
const userService = require("../services/user");
const jwtMiddleware = require("../middleware/jwt.middleware");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const settings = require("../../../config/settings");

authRouter.route("/login").post((req, res) => {
    const data = req.body;
    userService
        .login(data.email, data.password)
        .then(obj => {
            res.cookie("jwtToken", obj.token)
                .status(200)
                .send(obj);
        })
        .catch(err => {
            res.status(400).send(err.message);
        });
});

authRouter.route("/logout").get((req, res) => {
    res.clearCookie("jwtToken").send(true);
});

authRouter.route("/signup").post((req, res) => {
    const data = req.body;
    const hash = bcrypt.hashSync(data.password.trim(), 10);
    let avatar = data.avatar;
    if (avatar) avatar = avatar.trim();
    else avatar = "";
    const user = {
        fullName: data.fullName.trim(),
        password: hash,
        email: data.email.trim(),
        phoneNumber: data.phoneNumber.trim(),
        avatar: avatar
    };
    userService
        .addUser(user)
        .then(() => {
            userService.getUserByEmail(user.email).then(user => {
                let obj = {
                    expiresIn: userService.getExpiresDate()
                };
                obj.token = jwt.sign(
                    {
                        id: user.id,
                        fullName: user.fullName
                    },
                    settings.jwtPrivateKey
                );
                res.cookie("jwtToken", obj.token)
                    .status(200)
                    .send(obj);
            });
        })
        .catch(err => {
            res.status(400).send(err.message);
        });
});

module.exports = authRouter;