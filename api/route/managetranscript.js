const express = require("express");
const router = express.Router();
const fs = require("fs");
const Manage = require('../model/managetranscript');
const dataJSON = require('../../ExcelConnection');
const { web3, transcript } = require("../../Connection");
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'ExcelFile/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer({ storage });


router.post("/upload", upload.array('excelFile'), (req, res) => {

    const allFile = req.files;

    console.log("All File : ", allFile);
    if (req.files !== 'undefined') {

        var jsonData = []
        var allStudentUpload = [];
        var allStudentId = [];
        var checkDuplicateRowId = [];
        allFile.map((file, index) => {
            //console.log(file)
            pathFile = file.path;
            console.log("Path File : ", pathFile);
            jsonFile = dataJSON.convertToJSON(pathFile, "KMUTT");
            jsonData.push(jsonFile)
            allStudentUpload.push([jsonFile.studentId, new Date()]);
            allStudentId.push([jsonFile.studentId]);
            checkDuplicateRowId.push(jsonFile.studentId);
            // if(index > 0){
            //   jsonData = jsonData[index-1].concat(jsonData[index]);
            // }

        })
        console.log("All Student Id : ", allStudentId)

        // console.log(jsonData.map((data,index)=>data.studentId))

        deleteExcelFile = (file) => {
            fs.unlink(file.path, (err) => {
                if (!err) {
                    console.log('Delete ' + file.originalname + ' Successful');
                } else {
                    console.log('Cannot Delete');
                }
            })
        }

        newTranscript = async (id, name, degree, gpa, date, json) => {
            account = await web3.eth.getAccounts();
            try {
                return await transcript.methods.addTranscript(id, name, degree, gpa, date, json).send({ from: account[0] }, (err, transactionHash) => {
                    if (!err) {
                        status = true;
                        hash = transactionHash;

                    } else {
                        status = false;
                        hash = "No Transaction Hash"
                    }
                    //console.log("Status : "+status)
                    return { status: status, transactionHash: hash }
                });

            } catch (err) {
                console.log("" + err);
            }

        }

        addTranscript = (jsonData) => {
            //console.log("Here")
            jsonLength = jsonData.length;
            console.log("JSON Length : " + jsonLength)
            count = 0;
            allHash = [];
            jsonData.map((data) => {
                //console.log("Here 1")

                id = data.studentId;
                name = data.studentName;
                degree = data.studentDegree;
                gpa = data.studentGPA;
                date = data.studentDateGrad;
                jsonInput = data.studentJSONData;

                newTranscript(id, name, degree, gpa, date, jsonInput).then((result) => {
                    allStatus = result.status;
                    //console.log("Status : ",result.status);     
                    try {
                        count++;
                        console.log("Count : " + count)
                        if (count === jsonLength) {
                            if (allStatus) {
                                (async () => {
                                    var uploadDatabase = await Manage.setUploadTranscript(allStudentUpload, "vf05");
                                    var updateQRCode = await Manage.setQRCode(allStudentId);
                                    if (uploadDatabase && updateQRCode) {
                                        res.json({ percent: 100, status: "success",error:{} })
                                        console.log("100 percent success")
                                        allFile.map((file) => {
                                            deleteExcelFile(file);
                                        })
                                    } else {
                                        res.json({ percent: 100, status: "error",error:{status:405,message:"Method Not Allowed"} })
                                    }
                                })()
                            } else {
                                res.json({ percent: 100, status: "error",error:{status:500,message:"Internal Server Error"} })
                            }

                        }
                    } catch (err) {
                        console.error(err);
                    }

                    // console.log("Count : "+count)

                })

                // newTranscript(id, name, degree, gpa, date, jsonInput).then((statusResult, err) => {
                //   console.log("Here 2")
                //   

                // });

            })
        }
        deleteExcelFile = (file) => {
            fs.unlink(file.path, (err) => {
                if (!err) {
                    console.log('Delete ' + file.originalname + ' Successful');
                } else {
                    console.log('Cannot Delete');
                }
            })
        }
        
        (async () => {
            var checkDuplicateStatus = await Manage.checkExist(checkDuplicateRowId);
            if (checkDuplicateStatus) {
                addTranscript(jsonData)
            } else {
                res.json({ percent: 100, duplicate: true,error:{status:405,message:"Method Not Allowed"} });
                allFile.map((file)=>{
                    deleteExcelFile(file);
                })
            }
        })()



    }

})

router.post("/update", (req, res) => {
    var id = parseInt(req.body.id);
    var name = req.body.name;
    var degree = req.body.degree;
    var gpa = req.body.gpa;
    var dateGrad = req.body.dateGrad;
    var jsonData = req.body.jsonData;
    //console.log("Name : ",name+' '+degree+' '+gpa+' '+dateGrad);
    //console.log("Id: "+id+" JSON : "+jsonData)
    (async () => {
        var searchtranscript = await Manage.searchTranscript(id);
        var searchStatus = searchtranscript.searchStatus;
        updateTranscript = async (id, jsonData) => {
            if (searchStatus) {
                account = await web3.eth.getAccounts();
                try {
                    await transcript.methods.editJSONTranscript(id, name, degree, gpa, dateGrad, jsonData).send({ from: account[0] }, (err) => {
                        (async () => {
                            var updateDatabase = await Manage.setUpdateTranscript(id, "vf05");
                            if (!err) {
                                if (updateDatabase) {
                                    res.json({ updateStatus: true,error:{} });
                                    console.log("success")
                                } else {
                                    res.json({ updateStatus: false,error:{status:405,message:"Method Not Allowed"} });
                                }

                            } else {
                                res.json({ updateStatus: false,error:{status:502,message:"Bad Gateway"} });
                            }
                        })()
                    })
                } catch (err) {
                    console.log(err);
                }
            } else {
                res.json({ updateStatus: false });
            }
        }

        await updateTranscript(id, jsonData);
    })()

})

router.get("/searchtranscript", (req, res) => {

    //List Id from Database
    var studentId = req.body.studentId;
    (async () => {
        var searchtranscript = await Manage.searchTranscript(studentId);
        var searchStatus = searchtranscript.searchStatus;
        var searchData = searchtranscript.searchData;
        if (searchStatus) {
            res.json({searchData:searchData,error:{}});
        } else {
            res.json({searchData:searchData,error:{
                status:404,
                message:"Not Found"
            }});
        }
    })()


})

router.get("/downloadtranscript",(req,res)=>{

    var studentId = req.body.studentId;
    (async()=>{
        var transcriptData = await Manage.getDownloadTranscriptData("vf05",studentId);
        transcriptDownloadStatus = transcriptData.downloadStatus;
        qrAddress = transcriptData.qrCodeAddress;
        if(transcriptDownloadStatus){
            res.json({downloadData:transcriptData.downloadData,qrCodeAddress:qrAddress,error:{}});
        }else{
            res.json({downloadData:false,error:{status:404,message:"Not Found"}});
        }
    })()

})

router.get("/fetchTranscript",(req,res)=>{
    var studentId = req.body.studentId;
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
      const jsonData = await fetchTranscript(studentId);
      if(jsonData !== '' || jsonData.length != 0){
        res.json({fetchResult:jsonData,error:{}});
      }else{
        res.json({fetchResult:"failed",error:{status:404,message:"Not Found"}})
      }
      
    })()
  
  })


module.exports = router;