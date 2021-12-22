const APIRes = require('../helpers/result');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");
const nodemailer = require("nodemailer");
// const userModel = require('../models/user.model');
const ejs = require("ejs");
const Utils = require('../helpers/utils')
const { validationResult } = require('express-validator');
// const secret = config.jwtSecret;
// const { mailOptions, createToken, password } = require("../helpers/utils");
const bcryptService = require('../services/bcrypt.service');
const path = require('path');
const uniqid = require('uniqid');
const CryptoJS = require("crypto-js");

const authService = require('../services/auth.service');
const dotenv = require('dotenv');
dotenv.config();


const authController = () => {

  function mailOptions(mails, message, subject) {
 
    let smtpTransport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: true,
      service: 'gmail',
      host: "smtp.gmail.com",
      auth: {
        user: "dummymailaddresses@gmail.com",
        pass: "dummyMailAddresses"
      }, tls: {
        rejectUnauthorized: false
      }
    });

    let maillist = mails;
    let msg = {
      from: "dummymailaddresses@gmail.com",
      subject: subject,
      //text: message, 
      cc: "*******",
      html: message// html body
    }
    // maillist.forEach(function (to, i, array) {
    msg.to = maillist;
    smtpTransport.sendMail(msg, function (err) {
      if (err) {
        console.log(err);
        return;
      }

      transporter.close();
    });
    // });


  }

  const createUser = async (req, res) => {
    try {

      const hash = await bcrypt.hash(req.body.password, 10)
      req.body.password = hash;
      const userData = await userModel.create(req.body);
      const token = jwt.sign({ data: userData._id }, process.env.secret, { expiresIn: process.env.jwtTokenExpire });


      if (userData) {
        console.log(userData, "userData");
        let filedata = path.join(
          __dirname,
          "./views/home.ejs"
        );
        console.log(filedata, "fileData");
        console.log(userData.email, "email")
      const tokenVerify=  `http://localhost:5000/auth/userVerify/${token}`;
        ejs.renderFile(filedata, { username: userData.email, token: tokenVerify}, async function (err, str) {
          if (err) {
            console.log(err, "error")
            return (err);
          } else {

            const mailSent = await mailOptions(
              userData.email,
              str,
              "Please verify your mail",

            );
          }
        })
      }
      delete userData.password;
      return APIRes.getMessageResult(userData, "success", res);
    } catch (error) {
      console.log(error, "error-----")
      return APIRes.getErrorResult("Invalid credentials", res);
    }
  }

  const updateUser = async (req, res) => {
    try {
      let userInput = Utils.getReqValues(req);


      let whereCodn = {};
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw errors.array();
      }
      if (userInput._id) {
        whereCodn._id = userInput._id;
      }
      // const result=await userModel.findOne({_id:userInput._id});
      // console.log(result,'result----------------------');
      // // const data =await userModel.updateOne()
      // result.userInput.followers.forEach(e=>{
      //   console.log(e,"element----------------");
      //   data.followers.push(e);
      // });

      delete userInput._id;
      delete userInput['editHistory']
      // let editLog = {};
      // editLog.userId = userInput.userId;
      // editLog.editReason = userInput.editReason;
      // editLog.ediDate = new Date();
      let updateQuery = {
        $set: userInput

        // $push: { editHistory: editLog },
      };


      const editedData = await userModel.findOneAndUpdate(whereCodn, updateQuery, { upsert: true });

      if (editedData.isVerified === true) {
        console.log(editedData.email);
        const mailSent = await mailOptions(editedData.email, `
                   <p>verified successfully!</p> ,
                    <b>${editedData.firstName}</b>, 
                    \n <small>you can login </small>`, 'verify mail');
      }

      if (editedData) {
        return APIRes.getMessageResult(editedData, "success", res);
      } else {
        return APIRes.getErrorResult("Invalid employee", res);
      }


    } catch (err) {
      console.log("Error in editEmployee:", err);
      return APIRes.getErrorResult(err, res);
    }

  };


  const login = async (req, res) => {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw errors.array();
      }
      let payload = req.body;
      let query = {
        email: payload.email,
        isDeleted: false
      }
      let userData = await userModel.findOne(query).lean();
      console.log(userData)
      if (userData) {
       
        // if ( userData.userType !=="admin" && userData.isVerified === false) {
        //   return res.json("Sorry! Please contact Admin to activate your user");
        // }

        if(userData.isVerified !== true){
        
          return APIRes.getNotExistsResult("User not verified", res)
        }
      else if(bcryptService.comparePassword(payload.password, userData.password)) {
          userData.token = authService.issue(userData);
          delete userData.password;
          delete userData.rePassword;
          return APIRes.getMessageResult(userData, "success", res);
        } else {
          return APIRes.getErrorResult("Wrong Password", res);
        }
      }else{
        return APIRes.getNotExistsResult("User not found", res)

      }
      
      
    } catch (err) {
      console.log("errr===>", err);
      if (!err.statusCode) {
        err.statusCode = httpStatus.BAD_REQUEST;
      }
      return res.status(err.statusCode).json(err);
    }
  }


  const listUser = async (req, res) => {
    console.log('list api---')
    try {
      let userInput = Utils.getReqValues(req);
      let whereCodn = {};
      console.log(userInput, "input--------");
      if (userInput._id) {
        whereCodn._id = userInput._id;
      }
      whereCodn.isDeleted = false;

      if (userInput.isActive) {
        whereCodn.isActive = userInput.isActive;
      }

      if (userInput.isVerified) {
        whereCodn.isVerified = userInput.isVerified;
      }
      console.log(whereCodn, 'whereCodn-----------------------------------------')
      const listedData = await userModel
        .find(whereCodn)
        .populate('userId', null, 'userModel')
        .sort({ created: "DESC" });
      return APIRes.getMessageResult(listedData, "success", res);

    } catch (error) {
      console.log(error, "error----")
      return res.json(error);
    }
  };
  const userVerify = async(req,res,next)=>{
    try {
    
      const userId =req.params.id;
      console.log(userId);
      const result =await jwt.verify(userId,process.env.secret);
      console.log(result,"result");
      const findData = await userModel.findByIdAndUpdate({_id:result.data},{isVerified:true});
      let filedata = path.join(
        __dirname,
        "./views/template.ejs"
      );
      res.sendFile(path.join(__dirname,'/views/template.html'))
    
    } catch (error) {
      return res.json(error);
    }
  }
   const forgotPassword=async(req,res)=>{
      try {

        let errors = validationResult(req);
        if (!errors.isEmpty()) {
          throw errors.array();
        }
        let payload = req.body;
        let query = {
          email: payload.email,
          isDeleted: false
        }
        console.log(payload,"payload-----------------");
        let userData = await userModel.findOne(query).lean();
        console.log(userData,"userData");
        const token = jwt.sign({ data: userData._id }, process.env.secret, { expiresIn: process.env.jwtTokenExpire });
        if (userData) {
          console.log(userData, "userData");
          let filedata = path.join(
            __dirname,
            "./template/home.ejs"
          );
          console.log(filedata, "fileData");
          console.log(userData.email, "email")
        const tokenVerify=  `http://localhost:5000/auth/passwordVerify/${token}`;
          ejs.renderFile(filedata, { username: userData.email, token: tokenVerify}, async function (err, str) {
            if (err) {
              console.log(err, "error")
              return (err);
            } else {
  
              const mailSent = await mailOptions(
                userData.email,
                str,
                "Please check your mail",
  
              );
            }
          })
          return APIRes.getMessageResult(userData, "Please Check Your mail", res);
        }
        // if(userData){
        // if (userData.isVerified === false) {
        //   return res.status(httpStatus.UNAUTHORIZED).json({ status: httpStatus.UNAUTHORIZED, msg: "Sorry! Please contact Admin to activate your user" });
        // }
        // const token=createToken(userData);
          //     console.log(userData.email);
          //     const mailSent = await mailOptions(userData.email,
          //     ` <div>
          //     <p>To forgot your password. Don't worry, Click below to change your password(note: this link will expire in 1hr)</p>
          //     <a href="https://authentication-backend-nodejs.herokuapp.com/api/user/forgot/${token}">Click Here...</a>
          //     </div>
          //     `,
          //     'verify mail');  
          // }

         
         
            else {
              return APIRes.getErrorResult("Invalid user", res);
          }


        } catch (err) {
          console.log("Error in editEmployee:", err);
          return APIRes.getErrorResult(err, res);
        }

      }; 
      const passwordVerify = async (req,res)=>{
       
          try {
              //  res.json({message:'updated successfully'})
              const userToken = req.params.token;
              const data = await jwt.verify(userToken,process.env.secret)
            console.log(req,"req")
              // const hash = await bcrypt.hash(req.body.rePassword,10)
             const hash= bcrypt.hash(req.body.password, 10 , (err, hashPassword) => { if(err){
               console.log(err)
             } 
             else{
              req.body.password = hashPassword;
             }
            })
    console.log( req.body.password ,"ashPassword")
               const update = await userModel.findByIdAndUpdate({_id:data.data},{password:hash});
               console.log(update,"update");
               res.sendFile(path.join(__dirname,'/views/forget.html'))
               
          } catch (error) {
            console.log(error)
              res.json({message:error.message})
          }
          
      }


  const resetPassword = async (req, res) => {
    try {
      const userInput = req.body;
      console.log(userInput, "userInput in reset---")
      let whereCondn = {};
      whereCondn.encryptToken = userInput.encryptToken;
      let password = Utils.password(userInput.password)
      userInput.password = password
      await userModel.findOne(whereCondn).then(async resp => {
        if (resp) {
          const updatePassword = await userModel.updateOne(whereCondn, { $set: userInput });
          if (updatePassword) {
            return APIRes.getSuccessResult(
              "Password Changed Successfully",
              res
            );
          } else {
            return APIRes.getErrorResult(
              "Password Reset Failed",
              res
            );
          }
        } else {
          await userModel.findOne(whereCondn).then(async result => {
            if (result) {
              const updatePassword = await userModel.updateOne(whereCondn, { $set: userInput });
              if (updatePassword) {
                return APIRes.getSuccessResult(
                  "Password Changed Successfully",
                  res
                );
              } else {
                return APIRes.getErrorResult(
                  "Password Reset Failed",
                  res
                );
              }
            } else {
              return APIRes.getErrorResult(
                "User Not Found",
                res
              );
            }
          })
        }
      })
    } catch (err) {
      console.log(err, "errror0---")
      return APIRes.getErrorResult(err, res);
    }
  }



  return {
    login, createUser, listUser, updateUser, forgotPassword, resetPassword,userVerify,passwordVerify
  }

}

module.exports = authController();