const { dbconnect } = require('../../DatabaseConnection');
const { RegistrarWeb3Provider } = require("../../Connection");


getUniversityShortName = async (userid) => {
    var connect = await dbconnect();
    var getUniversitySql = "SELECT u.universityshortname FROM university u JOIN universityregistrar ur on u.universityid = ur.universityid WHERE ur.userid = ?";
    return await connect.query(getUniversitySql, userid).then((result) => {
        var universityId = result.map((data) => data.universityshortname);
        //console.log("Result : ",result);
        connect.end().then(() => console.log("Close Connection in University"));
        return universityId[0];
    })
}

getPrivateKey = async (userid) => {
    var connect = await dbconnect();
    var getKeySql = "select privatekey from universityregistrar where userid = ?";
    return await connect.query(getKeySql, userid).then((result) => {
        if (result.length === 0) {
            connect.end().then(() => console.log("Close Connection in Get Private Key"));
            return false
        } else {
            var data = result[0].privatekey;
            connect.end().then(() => console.log("Close Connection in Get Private Key"));
            return data;
        }
    })
}

checkExist = async (transcriptId) => {
    var connect = await dbconnect();
    var checkExistSql = "select count(transid) as countrow from transcript where transid like ?";
    var countDuplicateRow = 0;
    var countDuplicateId = [];
    var countUploadId = [];
    var checkExistStatus = transcriptId.map(async (idData, index) => {
        var allStatus = await connect.query(checkExistSql, "%" + idData).then((result) => {
            var countRow = result.map((data) => data.countrow);
            //console.log("Result : ",result)
            //console.log("Count Row : ",countRow);
            if (countRow[0] >= 1) {
                countDuplicateId.push(idData);
                // connect.end().then(()=>console.log("Close Connection in Check"));
                return ++countDuplicateRow;
            } else {
                countUploadId.push(idData);
            }

            if (++index === transcriptId.length) {
                connect.end().then(() => console.log("Close Connection in Check"));
            }


        })

        return allStatus;
    });

    if (await checkExistStatus[checkExistStatus.length - 1] >= 1) {
        console.log(await checkExistStatus[checkExistStatus.length - 1])
        return { checkStatus: false, uploadId: countUploadId, duplicateId: countDuplicateId };
    } else {
        return { checkStatus: true, uploadId: countUploadId, duplicateId: countDuplicateId };
    }
    // return checkExistStatus;
}

setUploadTranscript = async (transcriptData, userid) => {

    var connect = await dbconnect();
    var universityShortName = await getUniversityShortName(userid);
    //console.log("Uni Short : ",universityShortName);


    var newTranscriptSql = "INSERT INTO transcript (transid,faculty,dateOfUpload) values (?,?,?)";
    //console.log(transcriptData);
    var allData = transcriptData.map((result) => {
        newId = universityShortName + result[0];
        date = result[1];
        faculty = result[2];
        return [newId, faculty, date];
    })
    var allId = allData.map((data) => {
        newId = data[0]
        return newId
    })

    // var checkExistStatus = await checkExist(allId);
    // var {uploadData} = checkExistStatus;
    // console.log("Check Status : ", checkExistStatus.checkStatus);
    // console.log("Check Duplicate Id : ", checkExistStatus.duplicateId);
    //console.log("All Data : ",allData)

    var newUploadTranscriptStatus = allData.map(async (data, index) => {
        try {
            var allUploadStatus = await connect.query(newTranscriptSql, data).then((result) => {
                if (++index !== allData.length) {
                    if (result.affectedRows >= 1) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    console.log("In Here Upload");
                    connect.end().then(() => console.log("Close Connection in Upload"));
                }
            })

            return allUploadStatus;
        } catch (error) {
            return false;
        }
    })
    //console.log("Data : ",newUpload);


    //var currentManageId = parseInt(newManageId.substring(6));
    var newManageId = await getLastestManageId("manageid", "managetranscript");
    var currentManageId = parseInt(newManageId.substring(6));

    generateManageId = (currentId, transcriptLength) => {
        var allManageId = [];
        for (i = 0; i < transcriptLength; i++) {
            if (currentId > 9) {
                newIndex = "manage";
            } else {
                newIndex = "manage0";
            }
            allManageId.push(newIndex + currentId);
            ++currentId
        }

        return allManageId;
    }

    var allManageData = transcriptData.map((result, index) => {
        newId = universityShortName + result[0];
        var newIndex = generateManageId(currentManageId, transcriptData.length);
        return [newIndex[index], userid, newId, 'UPLOAD', new Date()];
    })
    console.log("All Manage : ", allManageData);
    var newTranscriptStatus = newUploadTranscriptStatus.every(async (result) => {
        //console.log("Result : ", await result)
        return result;
    })

    //console.log("New Transcript Status : ", newTranscriptStatus);
    if (newTranscriptStatus) {
        var setManageStatus = await setNewManageTranscript(allManageData);
        var newManageStatus = setManageStatus.every(async (result) => {
            var status = await result;
            return status;
            //console.log("Result : ",await result)
        })
        //console.log("New Management Status : ", newManageStatus);
        return newManageStatus;
    } else {
        return false;
    }



}

getLastestManageId = async (attribute, table) => {
    //Must be space in sql string
    var getLastestSql = "SELECT " + attribute + " FROM " + table + " ORDER BY length(" + attribute + "), " + attribute;
    var connect = await dbconnect();
    return connect.query(getLastestSql).then((result) => {
        data = result.map((data) => data.manageid);
        //console.log("Number : ",data)
        if (result.length <= 0) {
            connect.end().then(() => console.log("Close Connection in ManageId"));
            return "manage01";
        } else {
            //console.log("Id : ", result);
            connect.end().then(() => console.log("Close Connection in ManageId"));
            var numberOrder = data[result.length - 1].substring(6);

            //console.log("Number Order : ",data);
            increaseId = (numberOrder) => {
                var index1 = "manage0";
                var index2 = "manage";
                var returnId = "";
                var numberInt = parseInt(numberOrder);
                //console.log("Number Int : ", numberOrder)
                //console.log("Number : ", result);
                if (numberInt >= 9) {
                    returnId = index2 + (++numberInt);
                } else {
                    returnId = index1 + (++numberInt);
                }
                return returnId;
                //console.log("Number INT : ",numberInt+" "+numberOrder);

            }
            var newUserId = increaseId(numberOrder);
            return newUserId;
        }
    })


}

setNewManageTranscript = async (data) => {

    var connect = await dbconnect();
    //console.log(data.length);
    var insertNewManage = "INSERT INTO managetranscript( manageid, userid, transid,managestatus,managedate) VALUES (?,?,?,?,?)";
    // var newManageId = await getLastestId("manageid", "managetranscript");
    //console.log("New Id 1 : ", newManageId);
    var allManageStatus = data.map(async (allManageData, index) => {
        //console.log("Round : "+(++index));
        // console.log("Data : ",index);    
        try {
            var manageStatus = await connect.query(insertNewManage, allManageData).then(async (result) => {
                if (++index !== data.length) {
                    if (result.affectedRows >= 1) {
                        //++countInsert;
                        return true;
                    } else {
                        //++countInsert;
                        return false;
                    }
                } else {
                    console.log("In here Manage");
                    connect.end().then(() => console.log("Close Connection in Manage"));
                }


            })

            return manageStatus;
        } catch (error) {
            console.error(error);
        }

    })

    return allManageStatus;


}

setUpdateTranscript = async (transcriptid, userid) => {

    var connect = await dbconnect();
    var insertNewManage = "INSERT INTO managetranscript( manageid, userid, transid,managestatus,managedate) VALUES (?,?,?,?,?)";
    var getShortName = await getUniversityShortName(userid);
    var newManageId = await getLastestManageId("manageid", "managetranscript");
    var newUploadData = [newManageId, userid, getShortName + transcriptid, 'UPDATE', new Date()];
    return await connect.query(insertNewManage, newUploadData).then((result) => {
        if (result.affectedRows >= 1) {
            console.log(result.affectedRows, " Update is insert");
            connect.end().then(() => console.log("Close Connection in Update Transcript"));
            return true
        } else {
            connect.end().then(() => console.log("Close Connection in Update Transcript"));
            return false;
        }
    })
}

getTotalDashboard = async () => {

    try {
        var connect = await dbconnect();
        var totalUploadSql = "SELECT count(manageid) as totalUpload FROM `managetranscript` WHERE managestatus = 'UPLOAD'";
        var totalUpload = await connect.query(totalUploadSql).then((result) => {
            var uploadData = result.map((data) => data.totalUpload);
            //connect.end().then(()=>console.log("Close Connection in Total Upload Transcript"));
            return uploadData[0];

        })

        var totalUpdateSql = "SELECT count(manageid) as totalUpdate FROM `managetranscript` WHERE managestatus = 'UPDATE'";
        var totalUpdate = await connect.query(totalUpdateSql).then((result) => {
            var uploadData = result.map((data) => data.totalUpdate);

            return uploadData[0];

        })
        connect.end().then(() => console.log("Close Connection in Total Update and Upload Transcript"));
        return { totalUpload: totalUpload, totalUpdate: totalUpdate }
    } catch (err) {
        console.error(err);
    }




}

searchTranscript = async (userid, studentId) => {

    var connect = await dbconnect();
    var getShortName = await getUniversityShortName(userid);
    var searchStudentId = getShortName + studentId + "%";

    //ALL TRANSCRIPT SQL
    //select m1.transid,m1.managestatus,m1.managedate from managetranscript m1 left join managetranscript m2 on (m1.transid = m2.transid and m1.manageid<m2.manageid) WHERE m2.manageid is null order by m1.transid

    //SOME TRANSCRIPT SQL
    //select m1.transid,m1.managestatus,m1.managedate from managetranscript m1 left join managetranscript m2 on (m1.transid = m2.transid and m1.manageid<m2.manageid) WHERE m1.transid like '%59130500102' and m2.manageid is null order by m1.transid


    var searchTranscriptSql = "select m1.transid,t.faculty,m1.managestatus,m1.managedate from transcript t join managetranscript m1 on t.transid = m1.transid left join managetranscript m2 on (m1.transid = m2.transid and m1.manageid<m2.manageid) WHERE m1.transid like ? and m2.manageid is null order by m1.transid"
    //SELECT * FROM managetranscript m where m.managestatus = 'UPLOAD' group by transid
    //SELECT * FROM managetranscript m where m.managestatus = 'UPDATE' group by transid desc
    return await connect.query(searchTranscriptSql, searchStudentId).then((result) => {
        //console.log("Result : ", result);
        if (result.length >= 1) {
            var data = result;
            //connect.release();
            connect.end().then(() => console.log("Close Connection in Search"));
            var allData = data.map((data) => {
                return {
                    transid: data.transid,
                    faculty: data.faculty,
                    manageStatus: data.managestatus,
                    manageDate: data.managedate
                }
            })

            //console.log("All Data : ",allData);
            return { searchStatus: true, searchData: allData }

        } else {
            connect.end().then(() => console.log("Close Connection in Search"));
            return { searchStatus: false, searchData: {} }
        }
    })

}

setQRCode = async (userid, transcriptData) => {

    var connect = await dbconnect();
    var privateKey = await getPrivateKey(userid);
    var registrarProvider = RegistrarWeb3Provider(privateKey);
    //console.log("Transcript Data : ",transcriptData);
    var allId = transcriptData.map((result) => {
        newId = result[0];
        return newId;
    })
    //console.log("ID Data : ",allId)
    var allQRCode = allId.map(async (transid) => {
        var addressData = await registrarProvider.transcript.methods.showTranscript(transid).call((err, res) => {
            if (!err) {
                return res;
            } else {
                console.log(err);
            }
        });
        if (addressData.id !== '0' || addressData.name !== '') {
            // console.log("Trans Id : ",transid);
            return [addressData.pointer, "%" + transid];
        }
    })
    console.log("QR Code : ", allQRCode);
    var updateQRSql = "UPDATE transcript SET qrcode = ? WHERE transid like ?";
    if(allQRCode.length === allId.length){
        var count = 0;
        var updateQRStatus = await Promise.all(allQRCode.map(async (data, index) => {
            //console.log("All QR Length : ",allQRCode.length);
            var qrData = await data;
            var allStatus = await connect.query(updateQRSql, qrData).then((result) => {
                //console.log("All QR Code : index"," = ",index,allQRCode.length);
                if (++count !== allQRCode.length) {
                    //console.log("Index : ",index);
                    if (result.affectedRows >= 1) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    connect.end().then(() => console.log("Close Connection in QR Update"));
                }
                ++count;
    
            })
            return allStatus
    
        }))
    
        // if(updateQRStatus.length === allQRCode.length){
        var allUpdateQRStatus = updateQRStatus.every(async (result) => {
            var status = await result;
            return status;
        })
        return allUpdateQRStatus;
    }


    //return allUpdateQRStatus;

}

getAllUniversity = async () => {
    var connect = await dbconnect();
    var getAllUniversitySql = "SELECT universityname FROM university";
    const getAllUniversity = await connect.query(getAllUniversitySql).then((result) => {
        const allUniversity = result.map((data) => data.universityname);
        connect.end().then(() => console.log("Close Connection in All University"));
        return allUniversity;

    })
    return getAllUniversity;
}


getDownloadTranscriptData = async (userid, transcriptid) => {

    var getShortUniName = await getUniversityShortName(userid);
    var privateKey = await getPrivateKey(userid);
    var registrarProvider = RegistrarWeb3Provider(privateKey);
    const findData = await registrarProvider.transcript.methods.showJSONTranscript(transcriptid).call((err, res) => {
        if (!err) {
            return res;
        }
    })
    var connect = await dbconnect();
    var qrCodeSql = "select qrcode from transcript where transid = ?"
    const qrCodeData = await connect.query(qrCodeSql, getShortUniName + transcriptid).then((result) => {
        var qrAddress = result.map((data) => data.qrcode);
        if (result.length >= 1) {
            connect.end().then(() => console.log("Close Connection in Download"));
            return qrAddress[0];
        } else {
            connect.end().then(() => console.log("Close Connection in Download"));
            return false;
        }
    })

    if (findData.length === 0) {
        return { downloadStatus: false, status: 'No ID that you insert' }
    } else {
        var transcriptJSONData = JSON.parse(findData);
        var pointer = getShortUniName + "_Transcript_" + transcriptid;
        var transcriptData = transcriptJSONData[pointer];
        return { downloadStatus: true, downloadData: transcriptData, qrCodeAddress: qrCodeData }
    }

}

(async () => {
    //console.log("ENV : ",process.env);
    //console.log(await getAllUniversity());
    //console.log("Dashboard : ", await getTotalDashboard());
    //var data =  [[59130500055, new Date(),"IT"], [59130500032, new Date(),"IT"],[59130500011, new Date(),"IT"]];
    //console.log("Upload Result : ",await setUploadTranscript(data,"vf05"))
    //console.log(await getUniversityShortName("vf05"));
    //var data = [[59130500045, new Date()], [59130500068, new Date()]]
    //var data1 = [[59130500066, new Date()], [59130500024, new Date()]]
    // var data2 = [[59130500065, new Date()], [59130500023, new Date()]]
    //var status = await setUploadTranscript(data1, "vf05");
    //console.log("Status : ", await status);
    // status.map(async (result) => {
    //     console.log("All Result : ", await result);
    // })

    //console.log("Update Result : ", await setUpdateTranscript(59130500024,"vf05"));
    //var numberOfTrue = newTranscript.length;

    // var allStatus = newTranscript.every(async(result)=>{
    //     var status = await result;
    //     return status;
    //     //console.log("Result : ",await result)
    // })
    //console.log("Private Key : ",await getPrivateKey("vf05"));
    // var qrData = await setQRCode([[59130500045],[59130500068]]);
    // console.log("Result : ",await qrData);
    //console.log("Download Result : ",await getDownloadTranscriptData("vf05", "59130500068"));
    //console.log("Search Result : ", await searchTranscript("59130500068"));
    //console.log(await getLastestManageId("manageid","managetranscript"));
    //console.log(await getLastestId("manageid","managetranscript"));
    //console.log("Check Exist : ",await checkExist([59130500066,59130500094]));
    //console.log("Upload : ",await setUploadTranscript([59130500066,59130500094],"vf05"))
})()
// setUploadTranscript("vf_5")
//setNewTranscript("vf_5", "59130500068")

module.exports = { setUploadTranscript, setUpdateTranscript, searchTranscript, setQRCode, getUniversityShortName, checkExist, getDownloadTranscriptData, getPrivateKey, getTotalDashboard, getAllUniversity };