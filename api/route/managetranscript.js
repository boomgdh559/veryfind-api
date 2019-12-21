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

router.post("/transcripts", checkAuthen, upload.array('excelFile'), (req, res, next) => {

    var allFile = req.files;
    //console.log("All File : ", allFile);
    if (req.files !== undefined) {

        var jsonData = []
        var allStudentUpload = [];
        var allStudentId = [];
        var checkDuplicateRowId = [];
        generateAllFile = (allFile) => {
            //console.log("In func All File : ",allFile);
            return allFile.map((file, index) => {
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

        }

        //console.log("All Student Id : ", allStudentId)

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

        newTranscript = async (registrarProvider, id, name, degree, gpa, date, json) => {

            var account = await registrarProvider.web3.eth.getAccounts();
            //var balance = await registrarProvider.web3.eth.getBalance(account[0]);
            //var firstNoune = registrarProvider.web3.eth.getTransactionCount(account[0]);
            //console.log("Account : ", account);
            //console.log("Nounce : ", await firstNoune);
            try {

                return await registrarProvider.transcript.methods.addTranscript(id, name, degree, gpa, date, json).send({ from: account[0] }).then((receipt) => {
                    console.log("Receipt : ", receipt.status);
                    if (receipt.status) {
                        status = true;
                        //hash = transactionHash;
                    } else {
                        status = true;
                        //hash = transactionHash;
                    }
                    return { status: status }
                    // if (!err) {
                    //     status = true;
                    //     hash = transactionHash;

                    // } else {
                    //     status = false;
                    //     hash = "No Transaction Hash"
                    // }
                    // //console.log("Status : "+status)



                })

            } catch (err) {
                console.error("" + err);
            }

        }

        addTranscript = async (jsonData, uploadId, duplicateId) => {
            //console.log("Here")
            jsonLength = jsonData.length;
            console.log("JSON Length : " + jsonLength)
            count = 0;
            allHash = [];
            var privateKey = await Manage.getPrivateKey(req.userData.userid);
            var registrarProvider = RegistrarWeb3Provider(privateKey);
            //var account = await registrarProvider.eth.getAccounts();
            //var balance = await registrarProvider.eth.getBalance(account[0]);
            jsonData.map(async (data, index) => {
                //console.log("Here 1")

                id = data.studentId;
                name = data.studentName;
                degree = data.studentDegree;
                gpa = data.studentGPA;
                date = data.studentDateGrad;
                faculty = data.studentFaculty;
                jsonInput = data.studentJSONData;
                allStudentUpload[index].push(faculty);
                //console.log("All Json Upload : index = "+index," : ",allStudentUpload);
                newTranscript(registrarProvider, id, name, degree, gpa, date, jsonInput).then(async (result) => {
                    allStatus = await result.status;
                    console.log("Status 1 : " + id + " : ", result.status);
                    try {
                        count++;
                        console.log("Count : " + count)
                        if (count === jsonLength) {
                            if (allStatus) {
                                (async () => {
                                    var uploadDatabase = await Manage.setUploadTranscript(allStudentUpload, req.userData.userid);
                                    var updateQRCode = await Manage.setQRCode(req.userData.userid, allStudentId);
                                    if (uploadDatabase && updateQRCode) {
                                        if (duplicateId.length !== 0) {
                                            res.json({ percent: 100, status: "success", uploadId: uploadId, duplicateId: duplicateId, error: { status: 405, message: "Method Not Allowed" } });
                                        } else {
                                            res.json({ percent: 100, status: "success", uploadId: uploadId, duplicateId: duplicateId, error: {} })
                                        }
                                        console.log("100 percent success")
                                        allFile.map((file) => {
                                            deleteExcelFile(file);
                                        })
                                    } else {
                                        res.json({ percent: 100, status: "error", uploadId: uploadId, duplicateId: duplicateId, error: { status: 405, message: "Method Not Allowed", } })
                                    }
                                })()
                            } else {
                                res.json({ percent: 100, status: "error", uploadId: uploadId, error: { status: 500, message: "Internal Server Error" } })
                            }

                        }
                    } catch (err) {
                        console.error(err);
                    }

                    // console.log("Count : "+count)

                })

                // newTranscript(id, name, degree, gpa, date, jsonInput).then((statusResult, err) => {
                //   console.log("Here 2")


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

        deleteDuplicateExcelFile = (duplicatePath) => {
            fs.unlink(duplicatePath, (err) => {
                if (!err) {
                    console.log('Delete ' + duplicatePath + ' Successful');
                } else {
                    console.log('Cannot Delete');
                }
            })
        }

        findAndRemoveAllFile = (duplicateId) => {
            const upload = allFile.filter((obj) => {
                return !duplicateId.includes(parseInt(obj.originalname.replace(".xlsx")));
            });

            const deleteDuplicate = allFile.filter((obj) => {
                return duplicateId.includes(parseInt(obj.originalname.replace(".xlsx")));
            });
            //console.log("Delete : ",deleteDuplicate);
            //const deleteId = deleteDuplicate.map((val)=>val.originalname);
            // console.log("Delete : ",deleteId);
            deleteDuplicate.map((val) => {
                deleteDuplicateExcelFile(val.path);
            })

            return upload
        }

        (async () => {
            //generateAllFile(allFile);
            var allId = allFile.map((val) => parseInt(val.originalname.replace(".xlsx", "")));
            console.log("All Id : ", allId);
            //console.log("Check Duplicate : ",checkDuplicateRowId)
            var checkDuplicateStatus = await Manage.checkExist(allId);
            var { uploadId, duplicateId } = checkDuplicateStatus;
            console.log("Upload : ", uploadId, "\nDuplicate : ", duplicateId);
            if (allId.length !== 0) {
                if (uploadId.length === 0 && duplicateId.length === 0) {
                    generateAllFile(allFile);
                    addTranscript(jsonData, uploadId, duplicateId);
                }
                else if (uploadId.length >= 1) {
                    allFile = findAndRemoveAllFile(duplicateId);
                    generateAllFile(allFile);
                    addTranscript(jsonData, uploadId, duplicateId);
                    // jsonData = findAndRemoveAllFile(duplicateId);
                    // console.log("All File : ",allFile);
                    // console.log("All Upload : ",allStudentUpload);
                    // addTranscript(jsonData,duplicateId);
                    //console.log("JSON Data : ",jsonData);
                } else {
                    res.json({ uploadStatus: {}, uploadId: uploadId, duplicateId: duplicateId, error: { status: 405, message: "Method Not Allowed" } });
                    allFile.map((file) => {
                        deleteExcelFile(file);
                    })
                }
            } else {
                res.json({ uploadFile: {}, error: { status: 404, message: "Not Found" } })
            }

            // if (checkDuplicateStatus.checkStatus) {
            //     addTranscript(jsonData)
            // } else {
            //     res.json({ uploadStatus: {}, error: { status: 405, message: "Method Not Allowed",duplicateId:checkDuplicateStatus.duplicateId } });
            //     allFile.map((file) => {
            //         deleteExcelFile(file);
            //     })
            // }

        })()



    } else {
        res.json({ uploadFile: {}, error: { status: 404, message: "Not Found" } })
    }

})

router.get('/dashboard', checkAuthen, (req, res, next) => {
    (async () => {
        var allDashboardData = await Manage.getTotalDashboard();
        res.json({ totalUpload: allDashboardData.totalUpload, totalUpdate: allDashboardData.totalUpdate, error: {} });
    })()

})

router.get('/balance', checkAuthen, (req, res) => {
    //console.log("Balance")
    (async () => {
        console.log("Balance")
        var privateKey = await Manage.getPrivateKey(req.userData.userid);
        var registrarProvider = RegistrarWeb3Provider(privateKey);
        var account = await registrarProvider.web3.eth.getAccounts();
        var balance = await registrarProvider.web3.eth.getBalance(account[0]);
        if (balance > 3000000000000000000) {
            res.json({ balanceStatus: true, error: {} });
        } else {
            res.json({ balanceStatus: false, error: { status: "405", message: "Balance is not enough!" } });
        }
    })()
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
    addUniversityTranscript = (univertyShortName, transcriptData) => {
        var transcriptHeader = univertyShortName + "_Transcript_" + id;
        var allData = "{\"" + transcriptHeader + "\":" + JSON.stringify(transcriptData) + "}";
        return allData;
    }

    (async () => {
        var getShortName = await Manage.getUniversityShortName(req.userData.userid);
        var searchtranscript = await Manage.searchTranscript(req.userData.userid, id);
        var searchStatus = searchtranscript.searchStatus;
        var transcriptData = addUniversityTranscript(getShortName, data);
        var privateKey = await Manage.getPrivateKey(req.userData.userid);
        var registrarProvider = RegistrarWeb3Provider(privateKey);
        updateTranscript = async (id, jsonData) => {
            if (searchStatus) {
                account = await registrarProvider.web3.eth.getAccounts();
                try {
                    await registrarProvider.transcript.methods.editJSONTranscript(id, name, degree, gpa, dateGrad, jsonData).send({ from: account[0] }).then((receipt) => {
                        (async () => {
                            var updateDatabase = await Manage.setUpdateTranscript(id, req.userData.userid);

                            if (receipt.status) {
                                if (updateDatabase) {
                                    res.json({ updateStatus: true, error: {} });
                                    console.log("success")
                                } else {
                                    res.json({ updateStatus: {}, error: { status: 405, message: "Method Not Allowed" } });
                                }
                            } else {
                                res.json({ updateStatus: {}, error: { status: 502, message: "Bad Gateway" } });
                            }

                            // res.json({ updateStatus: {}, error: { status: 502, message: "Bad Gateway" } });

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

// router.get("/duplicate",checkAuthen,(req,res)=>{

//     (async()=>{
//         var checkExist = await Manage.checkExist([59130500024,59130500045,59130500078]);
//         res.json({duplicate:checkExist});
//         console.log("Check Exist : ",checkExist);
//     })()

// })

router.get("/transcripts", checkAuthen, (req, res) => {

    //List Id from Database
    var studentId = req.query.searchId;
    var checkNumberEmpty = (studentId) => {
        return !isNaN(studentId);
    }
    (async () => {
        //console.log(`${studentId} : `+checkNumberEmpty(studentId));
        if (checkNumberEmpty(studentId)) {
            var searchtranscript = await Manage.searchTranscript(req.userData.userid, studentId);
            var getShortName = await Manage.getUniversityShortName(req.userData.userid);
            var searchStatus = searchtranscript.searchStatus;
            var searchData = searchtranscript.searchData;

            if (searchStatus) {
                res.json({ searchData: searchData, uniShortName: getShortName, error: {} });
            } else {
                res.json({
                    searchData: searchData,
                    uniShortName: {},
                    error: {
                        status: 404,
                        message: "Not Found"
                    }
                });
            }
        } else {
            res.json({
                searchData: searchData,
                uniShortName: {},
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

router.get("/university", (req, res) => {
    (async () => {
        var allUniversity = await Manage.getAllUniversity();
        var {fullNameUni,shortNameUni} = allUniversity;
        //console.log(allUniversity)
        universityForm = fullNameUni.map((fullName,index) =>{
            return {value:fullName,label:`${shortNameUni[index]} (${fullName})`}
        })
        res.json({allUniversity: universityForm, error: {} });
    })()

})
router.get("/transcripts/fetchTranscript", checkAuthen, (req, res) => {
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
        const jsonData = await fetchTranscript(getShortName + studentId);
        if (jsonData !== '' || jsonData.length != 0) {
            res.json({ fetchResult: jsonData, error: {} });
        } else {
            res.json({ fetchResult: "failed", error: { status: 404, message: "Not Found" } })
        }

    })()

})


module.exports = router;