const express = require("express");
const router = express.Router();
const { web3, transcript } = require("../../Connection");
const Verify = require("../model/verification");

router.get("/verify/:verifyAddress", (req, res) => {
    verifyTranscript = async (address) => {
        const data = await transcript.methods.verifyQRCode(address).call((err, res) => {
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

        //console.log("Json Data : "+jsonData)
        if (jsonData.name !== '' || jsonData.id !== "0") {
            const verifyData = { studentId: jsonData.id, verifyDate: new Date() };
            var newVerifyStatus = await Verify.setNewVerification("vf04",verifyData);
            if(newVerifyStatus){
                res.json({ fetchResult: jsonData,error:{} });
            }else{
                res.json({ fetchResult :false ,error:{status:405,message:"Method Not Allowed"}});
            }
            
        } else {
            res.json({ fetchResult: false,error:{status:404,message:"Not Found"} })
        }

    })()

})

module.exports = router;