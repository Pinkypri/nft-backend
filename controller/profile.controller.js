const ProfileModel = require('../models/Profile.model');
const Utils = require('../helpers/utils')
const { validationResult } = require('express-validator');
const APIRes = require('../helpers/result')
const multer = require('multer');
const mkdirp = require('mkdirp');
var fs = require('fs')
let path = require('path');
const _ = require("lodash");

const ProfileController = () => {

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          let dir = `CoverPicImages`;
          // mkdirp(dir, err => cb(err, dir))
          const made = mkdirp.sync('CoverPicImages')
          cb(null, `CoverPicImages/`)
        },
        filename: function (req, file, cb) {
          let filename = file.originalname
          let name = filename.split('.');
          cb(null, name[0] + "~" + Date.now() + path.extname(file.originalname))
        }
      
      
      });
      
      var upload = multer({ storage: storage }).fields([{ name: 'Coverpicture', maxCount: 1 ,name:'Profilepicture',maxCount:1}]);
  const createProfile = async (req, res) => {
    try {
     upload(req, res, async function (err) {
         console.log(req.files);
      let userInput = Utils.getReqValues(req);
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw errors.array();
      }
  if(req.files.Coverpicture){
      userInput.Coverpicture === req.files.Coverpicture;
  }
      const createdData = await ProfileModel.create(userInput);
      return APIRes.getMessageResult(createdData, "success", res);
     })
    } catch (err) {
      console.log("Error in createRole:", err);
      return APIRes.getErrorResult(err, res);
    }

  };



  const editProfile = async (req, res) => {
    try {
        upload(req, res, async function (err) {
            console.log(req.files)
      let userInput = Utils.getReqValues(req);
      let whereCodn = {};
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw errors.array();
      }
      if (userInput._id) {
        whereCodn._id = userInput._id;
      }
      console.log(userInput);
      if(userInput.Coverpicture){
      whereCodn.Coverpicture = userInput.Coverpicture[0].filename;
      }
      if(userInput.Profilepicture){
      whereCodn.Profilepicture = userInput.Profilepicture[0].filename;
      }
      delete userInput._id;
      delete userInput['editHistory']
    //   let editLog = {};
    //  editLog.userId = userInput.userId;
    //   editLog.editReason = userInput.editReason;
    //   editLog.ediDate = new Date();
      let updateQuery = {
        $set: userInput,
        // $push: { followers: userInput.user },
      };

      const editedData = await ProfileModel.updateOne(whereCodn, updateQuery);

      if (editedData) {
        return APIRes.getMessageResult(editedData, "success", res);
      } else {
        return APIRes.getErrorResult("Invalid employee", res);
      }
    })
    } catch (err) {
      console.log("Error in editEmployee:", err);
      return APIRes.getErrorResult(err, res);
    }
  };

  const deleteProfile = async (req, res) => {
  
    let userInput = Utils.getReqValues(req);
    console.log(userInput,'-----userInput');
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    let whereCodn = {};
    if (userInput._id) {
      whereCodn._id = userInput._id;
    }
    whereCodn.isDeleted = false;
    try {
      const deleteData = await ProfileModel.updateOne(
        whereCodn,
        { $set: { isDeleted: true } },
        { new: true }
      );
      if (deleteData) {
        return APIRes.getSuccessResult("success", res);
      }
    } catch (err) {
      console.log('Error in deleteFollower:',err)
      return APIRes.getErrorResult(err, res);
    }
  };

  const listProfile = async (req, res) => {
    try {
      let userInput = Utils.getReqValues(req);  
      let whereCodn = {};
      // if (listConstant.modelName) {
      //   whereCodn.modelName= listConstant.modelName;
      // }
      if (userInput._id) {
        whereCodn._id = userInput._id;
      }
      whereCodn["isDeleted"] = false;
      whereCodn.isDeleted = false;
      const constantData = await ProfileModel.find(whereCodn).populate('Profile',null,'userModel');
      return APIRes.getMessageResult(constantData, "success", res);
    } catch (err) {
      console.log("Error in ListFollowers", err);
      return APIRes.getErrorResult(err, res);
    }
  };

  return {
    createProfile,
    editProfile,
    listProfile,
    deleteProfile,
  }
}

module.exports = ProfileController();