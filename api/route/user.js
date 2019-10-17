const express = require("express");
const router = express.Router();
const {setUniversityRegistrarUser,setHumanResourceUser,authenticationExist} = require('../model/user');


router.post("/hr/signup",(req,res) =>{
    var firstname = req.body.firstname;
    var surname = req.body.surname;
    var gender = req.body.gender;
    var dob = req.body.dob;
    var tel = req.body.tel;
    var email = req.body.email;
    var password = req.body.password;
    var dateRegister = req.body.dateRegister;
    var companyName = req.body.companyname;
    var position = req.body.position;

    if(firstname !== 'undefined' || surname !== 'undefined' 
    || gender !== 'undefined' || dob !== 'undefined' || tel !== 'undefined' 
    || email !== 'undefined' || password !== 'undefined' || dateRegister !== 'undefined'){
        (async()=>{
            var setHRStatus = await setHumanResourceUser(firstname,surname,gender,dob,tel,email,password,dateRegister,companyName,position);
            if(setHRStatus){
                res.status(200).json({regisHRStatus:true,error:{}});
            }else{
                res.status(200).json({regisHRStatus:false,error:{status:405,message:"Method Not Allowed"}});
            }
        })()
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
    var universityName = req.body.universityname;
    var staffid = req.body.staffid;
    var position = req.body.position;
    var privatekey = req.body.privatekey;

    if(firstname !== 'undefined' || surname !== 'undefined' 
    || gender !== 'undefined' || dob !== 'undefined' || tel !== 'undefined' 
    || email !== 'undefined' || password !== 'undefined' || dateRegister !== 'undefined'){
        (async()=>{
            var setRegistrarStatus = await setUniversityRegistrarUser(firstname,surname,gender,dob,tel,email,password,dateRegister,universityName,staffid,position,privatekey);
            if(setRegistrarStatus){
                res.json({regisStatus:true,error:{}});
            }else{
                res.json({regisStatus:false,error:{status:405,message:"Method Not Allowed"}});
            }
        })()
        
    }
    
})

router.post('/login',(req,res)=>{
    var email = req.body.email;
    var password = req.body.password;
    (async()=>{
        var authen = await authenticationExist(email,password);
        var authenStatus = authen.loginStatus;
        if(authenStatus){
            res.json({userData:authen.loginData,error:{}});
        }else{
            res.json({userData:false,error:{status:401,message:"Unauthorized"}});
        }
    })()
    
})

module.exports = router;