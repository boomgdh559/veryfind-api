const express = require("express");
const router = express.Router();
const fs = require("fs");
const Manage = require('../model/managetranscript');
const dataJSON = require('../../ExcelConnection');
const { RegistrarWeb3Provider } = require("../../Connection");
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
const checkAuthen = require('../middleware/authentication');

router.post("/transcripts", checkAuthen, upload.array('excelFile'), (req, res) => {

    const allFile = req.files;
    console.log("All File : ", allFile);
    if (req.files !== undefined) {

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
            var privateKey = await Manage.getPrivateKey(req.userData.userid);
            var registrarProvider = RegistrarWeb3Provider(privateKey);
            account = await registrarProvider.web3.eth.getAccounts();
            console.log("Account : ",account);
            try {
                return await registrarProvider.transcript.methods.addTranscript(id, name, degree, gpa, date, json).send({ from: account[0] }, (err, transactionHash) => {
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
                                    var uploadDatabase = await Manage.setUploadTranscript(allStudentUpload, req.userData.userid);
                                    var updateQRCode = await Manage.setQRCode(allStudentId);
                                    if (uploadDatabase && updateQRCode) {
                                        res.json({ percent: 100, status: "success", error: {} })
                                        console.log("100 percent success")
                                        allFile.map((file) => {
                                            deleteExcelFile(file);
                                        })
                                    } else {
                                        res.json({ percent: 100, status: "error", error: { status: 405, message: "Method Not Allowed" } })
                                    }
                                })()
                            } else {
                                res.json({ percent: 100, status: "error", error: { status: 500, message: "Internal Server Error" } })
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
                res.json({ uploadStatus: {}, error: { status: 405, message: "Method Not Allowed" } });
                allFile.map((file) => {
                    deleteExcelFile(file);
                })
            }
        })()



    } else {
        res.json({ uploadFile: {}, error: { status: 404, message: "Not Found" } })
    }

})

router.put("/transcripts/:studentId", checkAuthen, (req, res) => {

    var data = req.body.updateData;
    //console.log("Update Data : ",data);
    var id = parseInt(data.studentID);
    var name = data.name;
    var degree = data.degreeConferred;
    var gpa = `${data.totalGradGPA}`;
    var dateGrad = data.dateOfGraduation;
    //var jsonData = JSON.stringify(data);
    //console.log("Name : ",name+' '+degree+' '+gpa+' '+dateGrad,' \n',jsonData);
    // console.log("Params : ",req.params.studentId);
    //console.log("Id: "+id+" JSON : "+jsonData);
    addUniversityTranscript = (univertyShortName,transcriptData) => {
        var transcriptHeader = univertyShortName+"_Transcript_"+id;
        var allData = "{\""+transcriptHeader+"\":"+JSON.stringify(transcriptData)+"}";
        return allData;
    }

    (async () => {
        var getShortName = await Manage.getUniversityShortName(req.userData.userid);
        var searchtranscript = await Manage.searchTranscript(req.userData.userid,id);
        var searchStatus = searchtranscript.searchStatus;
        var transcriptData = addUniversityTranscript(getShortName,data);
        var privateKey = await Manage.getPrivateKey(req.userData.userid);
        var registrarProvider = RegistrarWeb3Provider(privateKey);
        updateTranscript = async (id, jsonData) => {
            if (searchStatus) {
                account = await registrarProvider.web3.eth.getAccounts();
                try {
                    await registrarProvider.transcript.methods.editJSONTranscript(id, name, degree, gpa, dateGrad, jsonData).send({ from: account[0] }, (err) => {
                        (async () => {
                            var updateDatabase = await Manage.setUpdateTranscript(id,req.userData.userid);
                            if (!err) {
                                if (updateDatabase) {
                                    res.json({ updateStatus: true, error: {} });
                                    console.log("success")
                                } else {
                                    res.json({ updateStatus: {}, error: { status: 405, message: "Method Not Allowed" } });
                                }

                            } else {
                                res.json({ updateStatus: {}, error: { status: 502, message: "Bad Gateway" } });
                            }
                        })()
                    })
                } catch (err) {
                    console.error(err);
                }
            } else {
                res.json({ updateStatus: {}, error: { status: 404, message: "Not Found" } });
            }
        }

        await updateTranscript(id, transcriptData);
    })()

})

router.get("/transcripts", checkAuthen, (req, res) => {

    //List Id from Database
    var studentId = req.query.searchId;
    
    (async () => {
        var searchtranscript = await Manage.searchTranscript(req.userData.userid, studentId);
        var searchStatus = searchtranscript.searchStatus;
        var searchData = searchtranscript.searchData;
        if (searchStatus) {
            res.json({ searchData: searchData, error: {} });
        } else {
            res.json({
                searchData: searchData, 
                error: {
                    status: 404,
                    message: "Not Found"
                }
            });
        }
    })()


})

router.get("/transcripts/:studentId", checkAuthen, (req, res) => {

    var studentId = req.params.studentId;
    (async () => {
        var transcriptData = await Manage.getDownloadTranscriptData(req.userData.userid, studentId);
        transcriptDownloadStatus = transcriptData.downloadStatus;
        qrAddress = transcriptData.qrCodeAddress;
        if (transcriptDownloadStatus) {
            res.json({ downloadData: transcriptData.downloadData, qrCodeAddress: qrAddress, error: {} });
        } else {
            res.json({ downloadData: false, error: { status: 404, message: "Not Found" } });
        }
    })()

})

router.get("/transcripts/fetchTranscript",checkAuthen, (req, res) => {
    var studentId = req.body.studentId;
    
    fetchTranscript = async (id) => {
        // var privateKey = await Manage.getPrivateKey("")
        var privateKey = await Manage.getPrivateKey(req.userData.userid);
        var registrarProvider = RegistrarWeb3Provider(privateKey);
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

    (async () => {
        const getShortName = await Manage.getUniversityShortName(req.userData.userid);
        const jsonData = await fetchTranscript(getShortName+studentId);
        if (jsonData !== '' || jsonData.length != 0) {
            res.json({ fetchResult: jsonData, error: {} });
        } else {
            res.json({ fetchResult: "failed", error: { status: 404, message: "Not Found" } })
        }

    })()

})


module.exports = router;