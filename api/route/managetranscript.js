const express = require("express");
const router = express.Router();
const Manage = require('../model/managetranscript');
const dataJSON = require('../../ExcelConnection');
const {dbconnect} = require('../../DatabaseConnection');
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
        var jsonId = [];
        allFile.map((file, index) => {
            //console.log(file)
            pathFile = file.path;
            console.log("Path File : ", pathFile);
            jsonFile = dataJSON.convertToJSON(pathFile, "KMUTT");
            jsonData.push(jsonFile)
            // if(index > 0){
            //   jsonData = jsonData[index-1].concat(jsonData[index]);
            // }

        })
        console.log(jsonData)
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
                                res.json({ percent: 100, status: "success" })
                                console.log("100 percent success")
                                //console.log("All File : ",allFile)
                                allFile.map((file) => {
                                    deleteExcelFile(file);
                                })
                            } else {
                                res.json({ percent: 100, status: "error" })
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
        //addTranscript(jsonData)

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
    updateTranscript = async (id, jsonData) => {
        account = await web3.eth.getAccounts();
        try {
            await transcript.methods.editJSONTranscript(id, name, degree, gpa, dateGrad, jsonData).send({ from: account[0] }, (err) => {
                if (!err) {
                    res.json({ updateStatus: true });
                    console.log("success")
                } else {
                    res.json({ updateStatus: false });
                }
            })
        } catch (err) {
            console.log(err);
        }
    }
    updateTranscript(id, jsonData);
})

router.get("/searchtranscript",(req,res)=>{

    //List Id from Database
    var studentId = req.body.studentId;

})


module.exports = router;