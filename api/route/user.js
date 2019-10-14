const express = require("express");
const router = express.Router();
const User = require('../model/user');


router.post("/hr/signup",(req,res) =>{
    var firstname = req.body.firstname;
    var surname = req.body.surname;
    var gender = req.body.gender;
    var dob = req.body.dob;
    var tel = req.body.tel;
    var email = req.body.email;
    var password = req.body.password;
    var dateRegister = req.body.dateRegister;
    var companyid = req.body.companyid;
    var position = req.body.position;

    if(firstname !== 'undefined' || surname !== 'undefined' 
    || gender !== 'undefined' || dob !== 'undefined' || tel !== 'undefined' 
    || email !== 'undefined' || password !== 'undefined' || dateRegister !== 'undefined'){
        User.setHumanResourceUser(firstname, surname, gender, dob, tel, email, password, dateRegister, companyid, position);
        return res.json({newHrStatus : true});
    }

})

router.post("/registrar/signup",(req,res) =>{
    var firstname = req.body.firstname;
    var surname = req.body.surname;
    var gender = req.body.gender;
    var dob = req.body.dob;
    var tel = req.body.tel;
    var email = req.body.email;
    var password = req.body.password;
    var dateRegister = req.body.dateRegister;
    var universityid = req.body.universityid;
    var staffid = req.body.staffid;
    var position = req.body.position;
    var privatekey = req.body.privatekey;

    if(firstname !== 'undefined' || surname !== 'undefined' 
    || gender !== 'undefined' || dob !== 'undefined' || tel !== 'undefined' 
    || email !== 'undefined' || password !== 'undefined' || dateRegister !== 'undefined'){
        User.setUniversityRegistrarUser(firstname, surname, gender, dob, tel, email, password, dateRegister, universityid, staffid, position, privatekey);
        return res.json({newRegistrarStatus : true});
    }
    
})

module.exports = router;