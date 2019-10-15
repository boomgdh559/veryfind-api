const { dbconnect } = require('../../DatabaseConnection');

setUploadTranscript = (userid, transid, manageStatus, manageDate) => {

    var getLastestSql = "SELECT manageid FROM managetranscript ORDER BY manageid DESC LIMIT 1";
    


}

setNewTranscript = (userid, transcriptFile, dateOfUpload) => {

    var getLastestSql = "SELECT transid FROM transcript ORDER BY transid DESC LIMIT 1";
    dbconnect.query(getLastestSql, (err1, result1) => {
        //console.log("Result : ", result1.length);
        if (!err1) {
            var getUniversityShortNameSql = "SELECT u.universityshortname FROM universityregistrar ur join university u ON ur.universityid = u.universityid where ur.userid like ?"
            dbconnect.query(getUniversityShortNameSql, [userid], (err2, result2) => {
                if (!err2) {
                    var shortUniName = result2[0].universityshortname;
                    var newTransId = shortUniName + "_Transcript_" + transcriptFile;
                    var insertNewTranscript = "INSERT INTO transcript (transid, dateOfUpload) VALUES ?"
                    var newTrascriptData = [[newTransId, dateOfUpload]];
                    dbconnect.query(insertNewTranscript, [newTrascriptData], (err3, result3) => {
                        if(!err3){
                            console.log(result3.affectedRows," Transcript is inserted!");
                        }else{
                            console.error(err3);
                        }
                    });
                }
                

            })



        }


    })

}

setNewManageTranscript = (userid, transid, manageStatus, manageDate) => {
    dbconnect.query(getLastestSql, (err, res) => {
        console.log("Result : ", res.length);
        var newManageId = "man_"
        if (res.length <= 0) {
            newManageId = newManageId + (++res.length);
        } else {
            // newManageId = 
        }


        var insertNewManage = "INSERT INTO (manageid,userid,transid,managestatus,managedate) VALUES ?"
        var newManageData = [[newManageId, userid, transid, manageStatus, manageDate]];
        dbconnect.query(insertNewManage, [newManageData], (err, res1) => {
            if (!err) {
                console.log(res1.affectedRows + " Upload Status is created");

            }
        })
    })
}

setUpdateTranscript = (userid, transid, manageStatus, managedate) => {




}

// setUploadTranscript("vf_5")
//setNewTranscript("vf_5", "59130500068")

module.exports = {setNewTranscript};