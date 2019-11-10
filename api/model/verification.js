const { dbconnect } = require("../../DatabaseConnection");

setNewVerification = async (userid, transcriptData) => {

    var connect = await dbconnect();
    var studentId = transcriptData.studentId;
    var verifyDate = transcriptData.verifyDate;
    var newVerifySql = "INSERT INTO verification (verifyid,transid,userid,verifydate,verifystatus) VALUES (?,?,?,?,?)";
    var transcriptId = await getTransId(studentId);
    var newVerifyId = await getLastestVerifyId("verifyid", "verification");
    var newVerifyData = [newVerifyId, transcriptId, userid, verifyDate, 'SUCCESS'];
    var verifyStatus = await connect.query(newVerifySql, newVerifyData).then((result) => {
        if (result.affectedRows >= 1) {
            connect.end().then(() => console.log("Close Connection in Verify"));
            return true;
        } else {
            connect.end().then(() => console.log("Close Connection in Verify"));
            return false;
        }

    })


    return verifyStatus;

}

getTransId = async (transcriptId) => {
    var connect = await dbconnect();
    var getTransIdSql = "SELECT transid FROM transcript WHERE transid like ?";
    return await connect.query(getTransIdSql, "%" + transcriptId).then((result) => {
        var transId = result.map((data) => data.transid);
        //console.log("Result : ",result);
        connect.end().then(() => console.log("Close Connection in TransId"));
        return transId[0];
    })
}
getAllCompany = async() => {
    var connect = await dbconnect();
    var getAllCompanySql = "SELECT companyname FROM company";
    const getAllCompany = await connect.query(getAllCompanySql).then((result) => {
        const allCompany = result.map((data)=>data.companyname);
        connect.end().then(() => console.log("Close Connection in All Company"));
        return allCompany;
        
    })
    return getAllCompany;
}

getAllVerifyTranscript = async (userid) => {
    var connect = await dbconnect();
    var getTransIdSql = "select transid from verification where userid = ? GROUP by (transid)";
    var getVerifyTranscript = await connect.query(getTransIdSql, userid).then((result) => {
        if (result.length >= 0) {
            var allTranscriptId = result.map((data) => data.transid);
            connect.end().then(() => console.log("Close Connection in All Verify Transcript"));
            //console.log("All Id : ",allTranscriptId);
            return allTranscriptId;
        } else {
            connect.end().then(() => console.log("Close Connection in All Verify Transcript"));
            return [];
        }
    });
    return getVerifyTranscript;
}

getVerifyHistory = async (userid) => {
    var connect = await dbconnect();
    var getAllTranscript = await getAllVerifyTranscript(userid);
    var getVerifyHistorySql = "SELECT verifyid,transid,userid,verifydate FROM `verification` where userid = ? and transid like ? order by length(verifyid),verifyid";
    if (getAllTranscript.length >= 1) {
        var allHistoryData = [];
        var allVerifyHistory = getAllTranscript.map(async (data, index) => {
            try {
                var allHistory = await connect.query(getVerifyHistorySql, [userid, data]).then((result) => {
                    if (result.length >= 1) {
                        allHistoryData.push(result[result.length - 1]);
                        if (++index === getAllTranscript.length) {
                            connect.end().then(() => console.log("Close Connection in All Verify History"));
                        }
                        //console.log("All History Length : ",allHistoryData.length);
                        return allHistoryData;
                    }


                })

                return allHistory;
            } catch (err) {
                console.error(err)
            }


        })
        //console.log("All History Length : ", allVerifyHistory.length);
        return allVerifyHistory;


    } else {
        connect.end().then(() => console.log("Close Connection in All Verify History"));
        return [];
    }
    //return await connect.query(getVerifyHistorySql,)
}

getLastestVerifyId = async (attribute, table) => {
    //Must be space in sql string
    var getLastestSql = "SELECT " + attribute + " FROM " + table + " ORDER BY length(" + attribute + "), " + attribute;
    var connect = await dbconnect();
    return connect.query(getLastestSql).then((result) => {
        data = result.map((data) => data.verifyid);
        //console.log("Number : ",data)
        if (result.length <= 0) {
            connect.end().then(() => console.log("Close Connection in VerifyId"));
            return "verify01";
        } else {
            //console.log("Id : ", result);
            connect.end().then(() => console.log("Close Connection in VerifyId"));
            var numberOrder = data[result.length - 1].substring(6);

            //console.log("Number Order : ",data);
            increaseId = (numberOrder) => {
                var index1 = "verify0";
                var index2 = "verify";
                var returnId = "";
                var numberInt = parseInt(numberOrder);
                console.log("Number Int : ", numberOrder)
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

findTranscriptHeader = async (transcriptId) => {

    var connect = await dbconnect();
    var getHeaderSql = "select transid from transcript where transid like ?"
    return await connect.query(getHeaderSql, "%" + transcriptId).then((result) => {
        // console.log("Result : ",data);
        if (result.length === 0) {
            connect.end().then(() => console.log("Close Connection in Find Header"))
            return false;

        } else {
            var data = result[0].transid;
            connect.end().then(() => console.log("Close Connection in Find Header"))
            var universityIndex = data.indexOf(transcriptId);
            var universityShortName = data.substring(0, universityIndex);
            return universityShortName;
        }

    })

}

(async () => {
    //console.log("All Result : ", await getVerifyHistory("vf04"))
    //var data = await getVerifyHistory("vf05");
    // data.map(async (result) => {
    //     console.log("All Result : ", await result.length);
    // })


    // var data = await getAllVerifyTranscript("vf05")
     //console.log("Result : ",data.length)


    // var data = {studentId:59130500045,verifyDate:new Date()};
    //console.log("Result : ",await setNewVerification("vf04",data));
    //console.log(await findTranscriptHeader(5913050045));
    //console.log(await getLastestVerifyId("verifyid", "verification"));
})()

module.exports = { setNewVerification, findTranscriptHeader,getVerifyHistory,getAllCompany }