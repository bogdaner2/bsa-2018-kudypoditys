const Service = require("./generalService");
const userRepository = require("../repositories/userRepository");
const settings = require("../../../config/settings");
const { dateHelpers } = require("../helpers");
const bcrypt = require("bcrypt");
const userTokenService = require("./userToken");
const mailService = require("./mail");
const crypto = require("crypto");

require("dotenv").config();

class UserService extends Service {
    addUser(user) {
        const hash = bcrypt.hashSync(user.password.trim(), 10);
        const newUser = {
            fullName: user.fullName.trim(),
            password: hash,
            email: user.email.trim(),
            phoneNumber: user.phoneNumber.trim(),
        };
        return this.repository.getUserByEmail(newUser.email).then(data => {
            if (data)
                return Promise.reject(
                    new Error("user with this email already exists"),
                );
            else {
                return this.create(newUser).then(dbUser => {
                    if (dbUser) {
                        return this.getEmailVerifyLink(dbUser).then(
                            ({ error, data }) => {
                                if (!error) {
                                    return data;
                                } else {
                                    return Promise.reject(new Error(data));
                                }
                            },
                        );
                    } else {
                        return Promise.reject(new Error("Couldn't add user."));
                    }
                });
            }
        });
    }

    getUserByEmail(email) {
        return this.repository.getUserByEmail(email);
    }

    updateUser(id, user) {
        return userRepository.updateById(id, user);
    }

    deleteUser(id) {
        return userRepository.deleteById(id);
    }

    login(email, password) {
        return userRepository.getUserByEmail(email).then(user => {
            if (!user) {
                return Promise.reject(new Error("user was not found"));
            }

            if (!bcrypt.compareSync(password, user.password)) {
                return Promise.reject(new Error("password is invalid"));
            }
            return userTokenService
                .generateForUser(user.id)
                .then(refreshToken => {
                    return {
                        ...userTokenService.generateAccessToken(user.id),
                        refreshToken: refreshToken,
                    };
                });
        });
    }

    getEmailVerifyLink(user) {
        const verifyString = this.generateRandomString();
        const currentDate = dateHelpers.toUnixTimeSeconds(new Date());
        const action = "verifyemail";
        const mailOptionsParam = {
            subject: "Email Verification - Kudypoditys",
            message: "Verify your email for Kudypoditys",
            verifyStringParam: verifyString
        }

        return userRepository
            .updateById(user.id, {
                verifyEmailToken: verifyString,
                verifyEmailTokenTillDate:
                    currentDate + settings.verifyEmailTokenLife,
            })
            .then(data => {
                if (data) {
                    return userRepository.findById(user.id).then(user => {
                        mailService.sendMail(user, mailOptionsParam, action).then(() => true);
                        return { error: false, data: user };
                    });
                } else {
                    return {
                        error: true,
                        data: "Couldn't update user by email.",
                    };
                }
            });
    }

    getForgotPasswordLink(email) {
        const resetPasswordString = this.generateRandomString();
        const action = "resetpassword";
        const mailOptions = {
            subject: "KudyPoditys password reset",
            message: `You are receiving this because you (or someone else)
                      have requested the reset of the password for your account.
                      Please click on the following link, or paste this into your
                      browser to complete the process:`,
            verifyStringParam: resetPasswordString
        }

        return userRepository.getUserByEmail(email).then(user => {
            if (!user) {
                return Promise.reject(new Error('User with such email, does not exists'));
            }

            return user;
        }).then(user =>
            userRepository.updateById(user.id, {
                resetPasswordToken: resetPasswordString
            }).then(_ => user)
        ).then(user => {
            mailService.sendMail(user, mailOptions, action);
        }).then(_ => true);
    }

    verifyEmail(email, token) {
        const currentDate = dateHelpers.toUnixTimeSeconds(new Date());
        return userRepository.getUserByEmail(email).then(user => {
            if (user) {
                if (
                    user.verifyEmailToken === token &&
                    user.verifyEmailTokenTillDate > currentDate
                ) {
                    userRepository.updateById(user.id, {
                        verifyEmailToken: "verified",
                    });

                    return { verified: true };
                } else {
                    return Promise.reject(
                        new Error("VerifyEmailToken is out of date."),
                    );
                }
            } else {
                return Promise.reject(
                    new Error("Couldn't find user by this email."),
                );
            }
        });
    }

    resetPassword(email, token, newPassword) {
        return userRepository.getUserByEmail(email).then(user => {
            if (!user) {
                return Promise.reject(new Error('User with such email, does not exists'));
            }

            return user;
        }).then(user => {
            if (user.resetPasswordToken !== token) {
                return Promise.reject(new Error('Reset token is invalid'));
            }
            return userRepository.updateById(user.id, {
                resetPasswordToken: null,
                password: bcrypt.hashSync(newPassword, 10)
            });
        }).then(_ => true);
    }

    generateRandomString() {
        return crypto.randomBytes(64).toString("hex");
    }
}

module.exports = new UserService(userRepository);
