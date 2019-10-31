const express = require("express");
const router = express.Router();
const { HRWeb3Provider } = require("../../Connection");
const hrProvider = HRWeb3Provider();
const Verify = require("../model/verification");
const checkAuthen = require('../middleware/authentication');

router.get("/verify/:verifyAddress", checkAuthen, (req, res) => {
    verifyTranscript = async (address) => {
        
        const data = await hrProvider.transcript.methods.verifyQRCode(address).call((err, res) => {
            var status = false
            if (!err) {
                //console.log(typeof res);
                status = true;
                return { data: res, status: status };
            } else {
                //status = false
                throw err;

                //console.log(err);
            }
        });
        return data;
    }



    (async () => {
        //console.log("Address : ",req.body.verifyAddress.toString())
        const jsonData = await verifyTranscript(req.params.verifyAddress.toString());
        findData = async (transcriptid) => {
            return await hrProvider.transcript.methods.showJSONTranscript(transcriptid).call((err, res) => {
                if (!err) {
                    return res;
                }
            })
        }

        //console.log("Json Data : "+jsonData)
        if (jsonData.name !== '' || jsonData.id !== "0") {
            const verifyData = { studentId: jsonData.id, verifyDate: new Date() };
            const getShortUniName = await Verify.findTranscriptHeader(jsonData.id);
            //console.log("ID : ", jsonData.id);
            const allData = await findData(jsonData.id);
            var transcriptJSONData = JSON.parse(allData);
            var pointer = getShortUniName + "_Transcript_" + jsonData.id;
            var transcriptData = transcriptJSONData[pointer];
            //console.log("Data : ",transcriptData);
             var newVerifyStatus = await Verify.setNewVerification(req.userData.userid,verifyData);
             if(newVerifyStatus){
                res.json({ verifyResult: transcriptData,error:{} });
            }else{
                res.json({ verifyResult :false ,error:{status:405,message:"Method Not Allowed"}});
            }

        } else {
            //res.json({ fetchResult: false,error:{status:404,message:"Not Found"} })
        }

    })()

})

module.exports = router;