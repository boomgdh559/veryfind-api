const {dbconnect} = require("../../DatabaseConnection");

setNewVerification = async(userid,transcriptData) => {

    var connect = await dbconnect();
    var studentId = transcriptData.studentId;
    var verifyDate = transcriptData.verifyDate;
    var newVerifySql = "INSERT INTO verification (verifyid,transid,userid,verifydate,verifystatus) VALUES (?,?,?,?,?)";
    var transcriptId = await getTransId(studentId);
    var newVerifyId = await getLastestVerifyId("verifyid","verification");
    var newVerifyData = [newVerifyId,transcriptId,userid,verifyDate,'SUCCESS'];
    var verifyStatus = await connect.query(newVerifySql,newVerifyData).then((result)=>{
        if (result.affectedRows >= 1) {
            return true;
        } else {
            return false;
        }
    })

    return verifyStatus;

}

getTransId = async (transcriptId) => {
    var connect = await dbconnect();
    var getTransIdSql = "SELECT transid FROM transcript WHERE transid like ?";
    return await connect.query(getTransIdSql,"%"+transcriptId).then((result) => {
        var transId = result.map((data) => data.transid);
        //console.log("Result : ",result);
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
            return "verify01";
        } else {
            //console.log("Id : ", result);
            var numberOrder = data[0].substring(7);
            increaseId = (numberOrder) => {
                var index = "verify0";
                var numberInt = parseInt(numberOrder);
                //console.log("Number INT : ",numberInt+" "+numberOrder);
                return index + (++numberInt);
            }
            var newUserId = increaseId(numberOrder);
            return newUserId;
        }
    })


}

(async()=>{

    // var data = {studentId:59130500045,verifyDate:new Date()};
    // console.log("Result : ",await setNewVerification("vf04",data));


})()

module.exports = {setNewVerification}