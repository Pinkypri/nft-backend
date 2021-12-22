const _ = require('lodash');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
// const CONFIG = require('../config/config');
const saltRounds = 10;
const generator = require('generate-password');
const jwt = require('jsonwebtoken');
module.exports = {
    constructErrorMessage(error) {
        let errMessage = '';
        if (error.message) {
            errMessage = error.message;
        }
        if (error.errors && error.errors.length > 0) {
            errMessage = error.errors.map(function (err) {
                return err.message;
            }).join(',\n');
        }

        return errMessage;
    },
    getReqValues(req) {
        return _.pickBy(_.extend(req.body, req.params, req.query), _.identity);
    },
    generatePassword(length) {
        let password = generator.generate({
            length: length,
            numbers: true
        });
        return password;
    },
    password(pwd) {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(pwd, salt);
        return hash;
    },
    updatePassword(pass) {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(pass, salt);
        return hash;
    },
    comparePassword(pw, hash) {
        let pass = bcrypt.compareSync(pw, hash);
        return pass;
    },
    createToken(data) {
        let token = jwt.sign(data, CONFIG.JWT_SECRET, {
            expiresIn: CONFIG.JWT_TOKEN_EXPIRE
        });
        token = token.replace(/\./g, "ar4Jq1V");
        return token;
    },
    getUserIdFromToken(headers) {
        let token = headers['x-access-token'];
        return new Promise(function (resolve, reject) {
            jwt.verify(token, CONFIG.jwtSecret, function (err, result) {
                if (err) {
                    resolve(err)
                } else {
                    resolve(result)
                }
            });
        })
    },
    getBrandData(Model,ClientId){
        let whereCodn = {};
        whereCodn['ClientId'] = ClientId;
        whereCodn['isDeleted'] = false;
        return new Promise(function (resolve, reject) {
            Model.ClientMaster.findOne({where:whereCodn}).then(function(response){
                if(response){
                    resolve(response)
                }else{
                    resolve([])
                }

            })
        })
    },

    mailOptions: function (mails, message, subject) {
        let smtpTransport = nodemailer.createTransport({
            service: 'dummymailaddresses@gmail.com',
            host: "smtp.gmail.com",
            auth: {
                user: "dummy",
                pass: "dummyMailAddresses"
            }
        });

        let maillist = mails;
        let msg = {
            from: "******",
            subject: subject,
            //text: message, 
            cc: "*******",
            html: message // html body
        }
        maillist.forEach(function (to, i, array) {
            msg.to = to;
            smtpTransport.sendMail(msg, function (err) {
                if (err) {
                    console.log('Sending to ' + to + ' failed: ' + err);
                    return;
                } else {
                    console.log('Sent to ' + to);
                }
                if (i === maillist.length - 1) { msg.transport.close(); }
            });
        });
    }
};
