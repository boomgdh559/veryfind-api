const { dbconnect } = require('../../DatabaseConnection');
const { web3, transcript } = require('../../Connection');

getUniversityShortName = async (userid) => {
    var connect = await dbconnect();
    var getUniversitySql = "SELECT u.universityshortname FROM university u JOIN universityregistrar ur on u.universityid = ur.universityid WHERE ur.userid = ?";
    return await connect.query(getUniversitySql, userid).then((result) => {
        var universityId = result.map((data) => data.universityshortname);
        //console.log("Result : ",result);
        connect.end().then(()=>console.log("Close Connection in University"));
        return universityId[0];
    })
}

checkExist = async (transcriptId) => {
    var connect = await dbconnect();
    var checkExistSql = "select count(transid) as countrow from transcript where transid like ?";
    var countDuplicateRow = 0;
    var checkExistStatus = transcriptId.map(async (idData,index) => {
        var allStatus = await connect.query(checkExistSql, "%" + idData).then((result) => {
            var countRow = result.map((data) => data.countrow);
            
            //console.log("Count Row : ",countRow);
            if (countRow[0] === 1) {
                return ++countDuplicateRow;
            }

            if(++index === transcriptId.length){
                connect.end().then(()=>console.log("Close Connection in Check"));
            }
        })

        return allStatus;
    });

    if (await checkExistStatus[checkExistStatus.length - 1] >= 1) {
        console.log(await checkExistStatus[checkExistStatus.length - 1])
        return false;
    } else {
        return true;
    }
    // return checkExistStatus;
}

setUploadTranscript = async (transcriptData, userid) => {

    var connect = await dbconnect();
    var universityShortName = await getUniversityShortName(userid);
    //console.log("Uni Short : ",universityShortName);


    var newTranscriptSql = "INSERT INTO transcript (transid,dateOfUpload) values (?,?)";
    //console.log(transcriptData);
    var allData = transcriptData.map((result) => {
        newId = universityShortName + result[0];
        date = result[1];
        return [newId, date];
    })
    var allId = allData.map((data) => {
        newId = data[0]
        return newId
    })

    var checkExistStatus = await checkExist(allId);
    console.log("Check Result : ", checkExistStatus);
    //console.log("All Data : ",allData)
    if (checkExistStatus) {
        var newUploadTranscriptStatus = allData.map(async (data,index) => {
            try {
                var allUploadStatus = await connect.query(newTranscriptSql, data).then((result) => {
                    if(++index !== allData.length){
                        if (result.affectedRows >= 1) {
                        
                            return true;
                        } else {
                            
                            return false;
                        }
                    }else{
                        console.log("In Here Upload");
                        connect.end().then(()=>console.log("Close Connection in Upload"));
                    } 
                })
                
                return allUploadStatus;
            } catch (error) {
                return false;
            }
        })
        //console.log("Data : ",newUpload);

        var newManageId = await getLastestId("manageid", "managetranscript");
        var currentManageId = parseInt(newManageId.substring(7));
        // console.log("Current : ",currentManageId)
        var allManageData = transcriptData.map((result) => {
            newId = universityShortName + result[0];
            return [("manage0" + currentManageId++), userid, newId, 'UPLOAD', new Date()];
        })

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
    } else {
        return { updateDuplicate: false };
    }


}

getLastestId = async (attribute, table) => {
    //Must be space in sql string
    var getLastestSql = "SELECT " + attribute + " FROM " + table + " ORDER BY " + attribute + " DESC LIMIT 1";
    var connect = await dbconnect();
    return connect.query(getLastestSql).then((result) => {
        data = result.map((data) => data.manageid);
        if (result.length <= 0) {
            connect.end();
            return "manage01";
        } else {
            //console.log("Id : ", result);
            connect.end();
            var numberOrder = data[0].substring(7);
            increaseId = (numberOrder) => {
                var index = "manage0";
                var numberInt = parseInt(numberOrder);
                //console.log("Number INT : ",numberInt+" "+numberOrder);
                return index + (++numberInt);
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
    var allManageStatus = data.map(async(allManageData,index) => {
        //console.log("Round : "+(++index));
        // console.log("Data : ",index);    
        try {
            var manageStatus = await connect.query(insertNewManage, allManageData).then(async (result) => {
                if(++index !== data.length){
                    if (result.affectedRows >= 1) {
                        //++countInsert;
                        return true;
                    } else {
                        //++countInsert;
                        return false;
                    }
                }else{
                    console.log("In here Manage");
                    connect.end().then(()=>console.log("Close Connection in Manage"));
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
    var newManageId = await getLastestId("manageid", "managetranscript");
    var newUploadData = [newManageId, userid, getShortName + transcriptid, 'UPDATE', new Date()];
    return await connect.query(insertNewManage, newUploadData).then((result) => {
        if (result.affectedRows >= 1) {
            console.log(result.affectedRows, " Update is insert");
            connect.end().then(()=>console.log("Close Connection"));
            return true
        } else {
            connect.end().then(()=>console.log("Close Connection"));
            return false;
        }
    })
}

searchTranscript = async (studentId) => {

    var connect = await dbconnect();
    var searchStudentId = "%" + studentId + "%";
    var searchTranscriptSql = "SELECT * FROM transcript where transid like ?";

    return await connect.query(searchTranscriptSql, searchStudentId).then((result) => {
        //console.log("Result : ", result);
        if (result.length >= 1) {
            var allData = result.map((data) => {
                return {
                    transid: data.transid,
                    dateOfUpload: data.dateOfUpload,
                    qrCode: data.qrcode
                }
            })
            connect.end().then(()=>console.log("Close Connection"));
            //console.log("All Data : ",allData);
            return { searchStatus: true, searchData: allData }

        } else {
            connect.end().then(()=>console.log("Close Connection"));
            return { searchStatus: false,searchData: {} }
        }
    })

}

setQRCode = async (transcriptData) => {

    var connect = await dbconnect();

    //console.log("Transcript Data : ",transcriptData);
    var allId = transcriptData.map((result) => {
        newId = result[0];
        return newId;
    })
    //console.log("ID Data : ",allId)
    var allQRCode = allId.map(async (transid) => {
        var addressData = await transcript.methods.showTranscript(transid).call((err, res) => {
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

    var updateQRSql = "UPDATE transcript SET qrcode = ? WHERE transid like ?";
    var updateQRStatus = allQRCode.map(async (data,index) => {
        var qrData = await data;
        return await connect.query(updateQRSql, qrData).then((result) => {
            if(++index !== allQRCode.length){
                if (result.affectedRows >= 1) {
                    
                    return true;
                } else {
                    
                    return false;
                }
            }else{
                connect.end().then(()=>console.log("Close Connection in Update"));
            }
            
        })
    })

    var allUpdateQRStatus = updateQRStatus.every(async (result) => {
        var status = await result;
        return status;
    })

    return allUpdateQRStatus;

}

getDownloadTranscriptData = async (userid, transcriptid) => {

    var getShortUniName = await getUniversityShortName(userid);
    const findData = await transcript.methods.showJSONTranscript(transcriptid).call((err, res) => {
        if (!err) {
            return res;
        }
    })
    var connect = await dbconnect();
    var qrCodeSql = "select qrcode from transcript where transid = ?"
    const qrCodeData = await connect.query(qrCodeSql, getShortUniName + transcriptid).then((result) => {
        var qrAddress = result.map((data)=>data.qrcode);
        if(result.length >= 1){
            connect.end().then(()=>console.log("Close Connection in Download"));
            return qrAddress[0];
        }else{
            connect.end().then(()=>console.log("Close Connection in Download"));
            return false;
        }
    })

    if (findData.length === 0) {
        return { downloadStatus: false, status: 'No ID that you insert' }

    } else {
        var transcriptJSONData = JSON.parse(findData);
        var pointer = getShortUniName + "_Transcript_" + transcriptid;
        var transcriptData = transcriptJSONData[pointer];
        return { downloadStatus: true, downloadData: transcriptData,qrCodeAddress:qrCodeData }
    }

}

(async () => {
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
    // var qrData = await setQRCode([[59130500045],[59130500068]]);
    // console.log("Result : ",await qrData);
    console.log("Download Result : ",await getDownloadTranscriptData("vf05", "59130500068"));
    //console.log("Search Result : ", await searchTranscript("59130500068"));
    //console.log(await getLastestId("manageid","managetranscript"));
    //console.log(await getLastestId("manageid","managetranscript"));
})()
// setUploadTranscript("vf_5")
//setNewTranscript("vf_5", "59130500068")

module.exports = { setUploadTranscript, setUpdateTranscript, searchTranscript, setQRCode, checkExist, getDownloadTranscriptData };