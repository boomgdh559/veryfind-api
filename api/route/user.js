const express = require("express");
const router = express.Router();
const User = require('../model/user');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const bcrypt = require('bcrypt');

router.post("/mobile/signup", (req, res) => {
    var firstname = req.body.firstname;
    var surname = req.body.surname;
    var gender = req.body.gender;
    var dob = req.body.dob;
    var tel = req.body.tel.toString();
    var email = req.body.email;
    var password = req.body.password;
    var dateRegister = req.body.dateRegister;
    var companyRegister = req.body.companyRegister;
    var position = req.body.position;

    

    if (firstname !== 'undefined' || surname !== 'undefined'
        || gender !== 'undefined' || dob !== 'undefined' || tel !== 'undefined'
        || email !== 'undefined' || password !== 'undefined' || dateRegister !== 'undefined') {
        (async () => {
            //console.log("Tel Info : ",tel.length);
            //res.json(req.body)

            const hashPassword = await bcrypt.hash(password,parseInt(process.env.SALT_ROUND));
            var checkUser = await User.checkUserExist(firstname, surname, email);
            var checkUserExistStatus = checkUser.checkUserExist;
            if (!checkUserExistStatus) {
                var setHRStatus = await User.setHumanResourceUser(firstname, surname, gender, dob, tel, email, hashPassword, dateRegister, companyRegister, position);
                if (setHRStatus) {
                    res.json({ regisHRStatus: true, error: {} });
                } else {
                    res.json({ regisHRStatus: false, error: { status: 405, message: "Method Not Allowed" } });
                }
            } else {
                res.json({ regisHRStatus: false, error: { status: 405, message: "Method Not Allowed" } });
            }

        })()
    }

})

router.post("/web/signup", (req, res) => {
    var firstname = req.body.firstname;
    var surname = req.body.surname;
    var gender = req.body.gender;
    var dob = req.body.dob;
    var tel = req.body.tel.toString();
    var email = req.body.email;
    var password = req.body.password;
    var dateRegister = req.body.dateRegister;
    var universityName = req.body.universityname;
    var staffid = req.body.staffid;
    var position = req.body.position;
    var privatekey = req.body.privatekey;

    if (firstname !== 'undefined' || surname !== 'undefined'
        || gender !== 'undefined' || dob !== 'undefined' || tel !== 'undefined'
        || email !== 'undefined' || password !== 'undefined' || dateRegister !== 'undefined') {
        (async () => {
            const hashPassword = await bcrypt.hash(password,parseInt(process.env.SALT_ROUND));
            var checkUser = await User.checkUserExist(firstname, surname, email);
            var checkUserExistStatus = checkUser.checkUserExist;
            if (!checkUserExistStatus) {
                var setRegistrarStatus = await User.setUniversityRegistrarUser(firstname, surname, gender, dob, tel, email, hashPassword, dateRegister, universityName, staffid, position, privatekey);
                if (setRegistrarStatus) {
                    res.json({ regisStatus: true, error: {} });
                } else {
                    res.json({ regisStatus: false, error: { status: 405, message: "Method Not Allowed" } });
                }
            } else {
                res.json({ regisStatus: false, error: { status: 405, message: "Method Not Allowed" } });
            }
        })()

    }

})

router.post('/web/login', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    (async () => {
        var authen = await User.authenticationExist(email, password);
        var authenStatus = authen.loginStatus;
        
        var authenRegistrar = await User.checkRegistrarUser(email);
        var authenRegistrarStatus = authenRegistrar.checkRegistrarStatus;

        if (authenRegistrarStatus) {
            if (authenStatus) {
                const token = jwt.sign(authen.loginData, process.env.SECRET_KEY, { expiresIn: "10h" })
                //console.log("Token : ",token);
                res.json({ authenData:{authenStatus:"Success",token:token}, error: {} });
                // res.json({userData:authen.loginData,error:{}});
            } else {
                res.json({authenData:{authenStatus:"Failed",token:{}}, error: { status: 401, message: "Unauthorized" } });
            }
        } else {
            res.json({authenData:{authenStatus:"Failed",token:{}}, error: { status: 401, message: "Unauthorized" } });
        }

    })()

})

router.post('/mobile/login', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    (async () => {
        var authen = await User.authenticationExist(email, password);
        var authenStatus = authen.loginStatus;
       // console.log("Authen : ",authen);
        var authenHR = await User.checkHRUser(email);
        var authenHRStatus = authenHR.checkHRStatus;
        console.log("Result : ",authenHRStatus)
        if (authenHRStatus) {
            if (authenStatus) {
                const token = jwt.sign(authen.loginData, process.env.SECRET_KEY, { expiresIn: "10h" })
                //console.log("Token : ",token);
                res.json({authenData:{authenStatus:"Success",token: token}, error: {} });
                // res.json({userData:authen.loginData,error:{}});
            } else {
                res.json({authenData:{authenStatus:"Failed",token: {}},error: { status: 401, message: "Unauthorized" } });
            }
        } else {
            res.json({ authenData:{authenStatus:"Failed",token: {}},error: { status: 401, message: "Unauthorized" } });
        }

    })()
})

module.exports = router;