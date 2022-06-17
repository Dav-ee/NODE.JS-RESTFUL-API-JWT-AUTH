const mongoose = require("mongoose");
const User = require("../models/user_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.create_user = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "E-Mail already exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hashed_pass) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email, //sanitize email
                            password: hashed_pass
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: "User created successfully"
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
}

exports.login_user = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed, email does not exits"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed, pwd comparison failed"
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_SECRET_KEY,
                        {
                            expiresIn: "2h"
                        }
                    );
                    return res.status(200).json({
                        message: "Auth successful, login successful",
                        token: token
                    });
                }
                res.status(401).json({
                    message: "Auth failed, JWT error"
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Auth initialization failed"
            });
        });
}

exports.delete_user = (req, res, next) => {
    User.deleteOne({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}