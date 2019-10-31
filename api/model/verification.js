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

getLastestVerifyId = async (attribute, table) => {
    //Must be space in sql string
    var getLastestSql = "SELECT " + attribute + " FROM " + table + " ORDER BY " + attribute + " DESC LIMIT 1";
    var connect = await dbconnect();
    return connect.query(getLastestSql).then((result) => {
        data = result.map((data) => data.verifyid);
        if (result.length <= 0) {
            connect.end().then(() => console.log("Close Connection in VerifyId"));
            return "verify01";
        } else {
            //console.log("Id : ", result);
            connect.end().then(() => console.log("Close Connection in VerifyId"));
            var numberOrder = data[0].substring(6);
            //console.log("Number Order : ",data);
            increaseId = (numberOrder) => {
                var index1 = "verify0";
                var index2 = "verify";
                var returnId = "";
                var numberInt = parseInt(numberOrder);
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
        if(result.length === 0){
            connect.end().then(() => console.log("Close Connection in Find Header"))
            return false;
            
        }else{
            var data = result[0].transid;
            connect.end().then(() => console.log("Close Connection in Find Header"))
            var universityIndex = data.indexOf(transcriptId);
            var universityShortName = data.substring(0,universityIndex);
            return universityShortName;
        }
        
    })

}

(async () => {

    // var data = {studentId:59130500045,verifyDate:new Date()};
    //console.log("Result : ",await setNewVerification("vf04",data));
    //console.log(await findTranscriptHeader(5913050045));

})()

module.exports = { setNewVerification,findTranscriptHeader }