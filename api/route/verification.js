const express = require("express");
const router = express.Router();
const { web3, transcript } = require("../../Connection");


router.post("/verifyQRCode", (req, res) => {
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

                console.log(err);
            }
        });
        return data;
    }

    (async () => {
        //console.log("Address : ",req.body.verifyAddress.toString())
        const jsonData = await verifyTranscript(req.body.verifyAddress.toString());
        //console.log("Json Data : "+jsonData)
        if (jsonData.name !== '' || jsonData.id !== "0") {
            res.json({ fetchResult: jsonData });
        } else {
            res.json({ fetchResult: false })
        }

    })()

})

module.exports = router;