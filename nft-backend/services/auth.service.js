const jsonwebtoken = require("jsonwebtoken");

// const CONFIG  = require("../config/config");

// // console.log("AUTH----->", config);

// const secret = CONFIG.jwtSecret;
const dotenv = require('dotenv');
dotenv.config();

const authService = () => {
    const issue = payload => jsonwebtoken.sign({ data: payload }, process.env.secret, { expiresIn: process.env.jwtTokenExpire });

    const verify = (token, cb) => jsonwebtoken.verify(token, secret, cb);

    const decode = token => jsonwebtoken.decode(token);

    return {
        issue,
        verify,
        decode
    };
};

module.exports = authService();
