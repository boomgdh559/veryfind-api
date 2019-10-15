const { web3, transcript } = require('./Connection')
const {dbconnect} = require('./DatabaseConnection');
const express = require('express');
const app = express();
const cors = require('cors');
const fs = require("fs");

var bodyParser = require('body-parser');
const userRoutes = require('./api/route/user.js');
const manageRoute = require("./api/route/managetranscript");

app.options('*', cors()) // include before other routes
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw({ type: 'application/x-www-form-urlencoded' }))
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use("/api/user",userRoutes);
app.use("/api/manage",manageRoute);

app.post("/api/searchTranscript", (req, res) => {
  var id = req.body.searchId;
  searchTranscript = async (id) => {
    const data = await transcript.methods.showTranscript(id).call((err, res) => {
      if (!err) {
        return res;
      } else {
        console.log(err);
      }
    });
    return data;
  }

  (async () => {
    const data = await searchTranscript(id);
    //console.log("ID : "+data.id+" Name : "+data.name)
    res.json({stdId:data.id,stdName:data.name})
  })()

  //result={name:id}
  // res.json(jsonArray);


})
app.get("/api/showUpload", (req,res) => {
  //return res.json({data: []})
  const data = [{id:57230500060,filename:"SIT-IT-Transcript.xlsx",percent:100,status:"success"},
  {id:59230500045,filename:"SIT-IT-Transcript.xlsx",percent:100,status:"exception"},
  {id:59230500068,filename:"SIT-IT-Transcript.xlsx",percent:100,status:"success"},
  {id:59230500072,filename:"SIT-IT-Transcript.xlsx",percent:100,status:"exception"}]
  res.json(data);
})

app.get("/api/mockupData",(req,res)=>{
  const transcriptData = {studentID:57130500060,name:'Mr.Puttipong Charoenyingsathaporn',dob:'Febuary 23, 1996',previousCert_Degree:'Grade 12 Qualification',dateOfAdmission:'June 26, 2014',dateOfGraduation:'June 13, 2018',faculty:'School of Information Technology',fieldOfStudy:'Information technology',degreeConferred:'Bachelor Of Science (Information Technology)',creditPrescribed:129,creditsEarned:129,totalGradGPA:3.34,graduateHonors:'Second Class Honours',dateOfValidSeal:'August 1,2018',registrar:'Ms.Suwanna Jemkitjavarote',semester:[{semesterTitle:'semester_1/2014',semesterDetail:{totalCredit:16,totalGPA:3.5,cumGPA:3.5,course:[{courseNo:'GEN101',courseTitle:'PHYSICAL EDUCATION',credits:1,grades:'B+'},{courseNo:'GEN121',courseTitle:'LEARNING AND PROBLEM SOLVING SKILLS',credits:3,grades:'B+'},{courseNo:'INT101',courseTitle:'INFORMATION TECHNOLOGY FUNDAMENTAL',credits:3,grades:'A'},{courseNo:'INT102',courseTitle:'COMPUTER PROGRAMMING I',credits:3,grades:'B+'},{courseNo:'INT104',courseTitle:'DISCRETE MATHEMATICS FOR INFORMATION TECHNOLOGY',credits:3,grades:'B'},{courseNo:'LNG102',courseTitle:'ENGLISH SKILLS AND STRATEGIES',credits:3,grades:'B'}]}},{semesterTitle:'semester_2/2014',semesterDetail:{totalCredit:18,totalGPA:3.58,cumGPA:3.35,course:[{courseNo:'GEN111',courseTitle:'MAN AND ETHICS OF LIVING',credits:3,grades:'C+'},{courseNo:'INT105',courseTitle:'COMPUTER PROGRAMMING II',credits:3,grades:'B+'},{courseNo:'INT106',courseTitle:'WEB TECHNOLOGY',credits:3,grades:'A'},{courseNo:'INT107',courseTitle:'COMPUTING PLATFORM TECHNOLOGY',credits:3,grades:'B'},{courseNo:'LNG103',courseTitle:'ACADEMIC ENGLISH',credits:3,grades:'B'},{courseNo:'MTH111',courseTitle:'CALCULAS I',credits:3,grades:'C'}]}},{semesterTitle:'semester_1/2015',semesterDetail:{totalCredit:18,totalGPA:3.33,cumGPA:3.35,course:[{courseNo:'GEN231',courseTitle:'MIRACLE OF THINKING',credits:3,grades:'B+'},{courseNo:'GEN241',courseTitle:'BEAUTY OF LIFE',credits:3,grades:'B'},{courseNo:'INT201',courseTitle:'NETWORK I',credits:3,grades:'A'},{courseNo:'INT203',courseTitle:'DATABASE MANAGEMENT SYSTEMS',credits:3,grades:'B+'},{courseNo:'INT303',courseTitle:'WEB PROGRAMMING',credits:3,grades:'B+'},{courseNo:'LNG221',courseTitle:'ORAL COMMUNICATION I',credits:3,grades:'A'}]}},{semesterTitle:'semester_2/2015',semesterDetail:{totalCredit:18,totalGPA:3.33,cumGPA:3.35,course:[{courseNo:'INT204',courseTitle:'BUSINESS INFORMATION SYSTEMS',credits:3,grades:'B+'},{courseNo:'INT205',courseTitle:'NETWORK II',credits:3,grades:'B'},{courseNo:'INT207',courseTitle:'INFORMATION MANAGEMENT',credits:3,grades:'B'},{courseNo:'INT304',courseTitle:'STATISTICS FOR INFORMATION TECHNOLOGY',credits:3,grades:'B+'},{courseNo:'INT320',courseTitle:'DATA STRUCTURES AND ALGORITHMS',credits:3,grades:'B'},{courseNo:'LNG201',courseTitle:'CONTENT-BASED LANGUAGE LEARNING II',credits:3,grades:'A'}]}},{semesterTitle:'semester_1/2016',semesterDetail:{totalCredit:19,totalGPA:3.42,cumGPA:3.36,course:[{courseNo:'GEN311',courseTitle:'ETHICS IN SCIENCE-BASES SOCIETY',credits:3,grades:'A'},{courseNo:'INT202',courseTitle:'SOFTWARE DEVELOPMENT PROCESS',credits:3,grades:'B+'},{courseNo:'INT301',courseTitle:'INFORMATION TECHNOLOGY INFRASTRUCTURE MANAGEMENT',credits:3,grades:'B+'},{courseNo:'INT302',courseTitle:'INFORMATION TECHNOLOGY SERVICES MANAGEMENT',credits:3,grades:'C+'},{courseNo:'INT305',courseTitle:'HUMAN COMPUTER INTERACTION',credits:3,grades:'A'},{courseNo:'INT351',courseTitle:'INFORMATION TECHNOLOGY SEMINAR',credits:1,grades:'B+'},{courseNo:'LNG410',courseTitle:'BUSINESS ENGLISH',credits:3,grades:'B'}]}},{semesterTitle:'semester_2/2016',semesterDetail:{totalCredit:14,totalGPA:2.96,cumGPA:3.31,course:[{courseNo:'INT206',courseTitle:'SOFTWARE PROJECT MANAGEMENT',credits:3,grades:'A'},{courseNo:'INT306',courseTitle:'ELECTRONIC-BUSINESS',credits:3,grades:'C'},{courseNo:'INT307',courseTitle:'SOCIAL ISSUES AND ETHICS FOR IT PROFESSTIONAL',credits:3,grades:'B'},{courseNo:'INT353',courseTitle:'INFORMATION TECHNOLOGY PROJECT I',credits:2,grades:'B+'},{courseNo:'INT370',courseTitle:'INFORMATION TECHNOLOGY SYSTEM IMPLEMENTATION',credits:3,grades:'C+'}]}},{semesterTitle:'semester_1/2017',semesterDetail:{totalCredit:17,totalGPA:3.47,cumGPA:3.33,course:[{courseNo:'INT401',courseTitle:'INFORMATION ASSURANCE AND SECURITY I',credits:3,grades:'B'},{courseNo:'INT402',courseTitle:'INFORMATION TECHNOLOGY PROFESSIONAL COMMUNICATION',credits:3,grades:'A'},{courseNo:'INT450',courseTitle:'INFORMATION TECHNOLOGY PROJECT II',credits:2,grades:'A'},{courseNo:'INT493',courseTitle:'SPECIAL TOPIC III : HYBRID MOBILE APPLICATION DEVELOPMENT WORKSHOP',credits:2,grades:'B+'},{courseNo:'LNG203',courseTitle:'BASIC GERMAN I',credits:3,grades:'B'},{courseNo:'SSC373',courseTitle:'MANAGEMENT FOR SMALL AND MEDIUM ENTERPRISE (SMES)',credits:3,grades:'B+'}]}},{semesterTitle:'semester_2/2017',semesterDetail:{totalCredit:9,totalGPA:3.5,cumGPA:3.34,course:[{courseNo:'GEN351',courseTitle:'MODERN MANAGEMENT AND LEADERSHIP',credits:3,grades:'B+'},{courseNo:'GEN441',courseTitle:'CULTURE AND EXCURSION',credits:3,grades:'A'},{courseNo:'INT492',courseTitle:'SELECTED TOPIC IN INFORMATION TECHNOLOGY II : WEB AND MOBILE PRODUCTION',credits:3,grades:'B'}]}}]};
  res.json({transcriptData,qrAddress:"0x4c62376dc8f61f99ADa489C467d0E015E68BfAf7"})
})

// app.get("/api/getData",(req,res)=>{
//   var userid = req.body.userid;
//   // console.log("User ID : ",req.body.userid)
//   var sql = "select * from user where userid like ?";
//   dbconnect.query(sql,[userid],(err,result)=>{
//     if(err){
//       return res.json({status:"Query Error"});
//     }else{
//       if(result.length === 0){
//         return res.json({status:"No Data in uery"});
//       }
//       var data = result.map((data)=>data.firstname+" "+data.surname);
//       console.log("Data : ",result.length)
//       return res.json({status:"Can Get Data",data:result});
      
//     }

//   })

// })

app.post("/api/fetchTranscript",(req,res)=>{
  var id = req.body.searchId;
  fetchTranscript = async(id) => {
    const data = await transcript.methods.showJSONTranscript(id).call((err, res) => {
      if (!err) {
        //console.log(typeof res);
        return res;
      } else {
        console.log(err);
      }
    });
    return data;
  }

  (async() => {
    const jsonData = await fetchTranscript(id);
    if(jsonData !== '' || jsonData.length != 0){
      res.json({fetchResult:jsonData});
    }else{
      res.json({fetchResult:"failed"})
    }
    
  })()

})

app.post("/api/verifyQRCode",(req,res)=>{
  verifyTranscript = async(address) => {
    const data = await transcript.methods.verifyQRCode(address).call();
    return data;
  }

  (async() => {
    console.log("Address : ",req.body.verifyAddress.toString())
    const jsonData = await verifyTranscript(req.body.verifyAddress.toString());
    console.log("Json Data : "+jsonData)
    if(jsonData.name !== '' || jsonData.id !== "0"){
      res.json({fetchResult:jsonData});
    }else{
      res.json({fetchResult:false})
    }
    
  })()

})



app.listen(process.env.PORT || 6020, 'localhost' , () => {
  //isConnectedBlockchain();
  console.log("Server Running at localhost:6020");
})
