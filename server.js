const { web3, transcript } = require('./connection')
const dataJSON = require('./excelConnection')
const express = require('express');
const app = express();
const multer = require('multer');
const cors = require('cors');
const fs = require("fs");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'ExcelFile/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
})

const upload = multer({ storage });
var bodyParser = require('body-parser');
app.options('*', cors()) // include before other routes
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw({ type: 'application/x-www-form-urlencoded' }))
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post("/api/search", (req, res) => {
  var id = req.body.stdId;
  searchTranscript = async (id) => {
    const data = await transcript.methods.showTranscript(id).call((err, res) => {
      if (!err) {
        return res;
      } else {
        console.log(err);
      }
    });
    return data;
  }

  (async () => {
    const data = await searchTranscript(id);
    //console.log("ID : "+data.id+" Name : "+data.name)
    res.json({stdId:data.id,stdName:data.name})
  })()

  //result={name:id}
  // res.json(jsonArray);


})
app.get("/api/showUpload", (req,res) => {
  // return res.json({data: []})
  // const data = [{id:57230500060,filename:"SIT-IT-Transcript.xlsx",percent:100,status:"success"},
  // {id:59230500045,filename:"SIT-IT-Transcript.xlsx",percent:100,status:"exception"},
  // {id:59230500068,filename:"SIT-IT-Transcript.xlsx",percent:100,status:"success"},
  // {id:59230500072,filename:"SIT-IT-Transcript.xlsx",percent:100,status:"exception"}]
  // res.json(data);
})


app.post("/api/upload",upload.array('excelFile'),(req,res) => {

  const allFile = req.files;

  if (req.files !== 'undefined') {

    var jsonData = []

    allFile.map((file,index)=> {
        //console.log(file)
      pathFile = file.path;
      jsonFile = dataJSON.convertToJSON(pathFile);
      jsonData.push(jsonFile)
      if(index > 0){
        jsonData = jsonData[index-1].concat(jsonData[index]);
      }

    })
    //console.log(jsonData)
    //console.log(jsonData.map((data,index)=>data[index].studentId))
    
    deleteExcelFile = (file) => {
      fs.unlink(file.path, (err) => {
        if (!err) {
          console.log('Delete '+file.originalname+' Successful');
        } else {
          console.log('Cannot Delete');
        }
      })
    }

    newTranscript = async (id, name, degree, gpa, date, json) => {
      account = await web3.eth.getAccounts();
      try {
        return await transcript.methods.addTranscript(id, name, degree, gpa, date, json).send({ from: account[0] }, (err, transactionHash) => {
          if (!err) {
            status = true;
            hash = transactionHash;

          } else {
            status = false;
            hash = "No Transaction Hash"
          }
          //console.log("Status : "+status)
          return {status : status,transactionHash:hash}
        });

      } catch (err) {
        console.log("" + err);
      }

    }

    addTranscript = (jsonData) => {
      //console.log("Here")
      jsonLength = jsonData.length;
      console.log("JSON Length : " + jsonLength)
      count = 0;
      allHash = [];
      jsonData.map((data) => {
        //console.log("Here 1")
        
        id = data.studentId;
        name = data.studentName;
        degree = data.studentDegree;
        gpa = data.studentGPA;
        date = data.studentDateGrad;
        jsonInput = data.studentJSONData;
        
        newTranscript(id, name, degree, gpa, date, jsonInput).then((result) => {
          allStatus = result.status;
          //console.log("Status : ",result.status);     
          try{
            count++;
            console.log("Count : "+count)
            if (count === jsonLength) {
              if(allStatus){
                res.json({percent:100,status:"success"})
                console.log("100 percent success")
                //console.log("All File : ",allFile)
                allFile.map((file)=>{
                    deleteExcelFile(file);
                })
              }else{
                res.json({percent:100,status:"error"})
              }
              
            }
          }catch(err){
            console.error(err);
          }
            
            // console.log("Count : "+count)
          
        })

        // newTranscript(id, name, degree, gpa, date, jsonInput).then((statusResult, err) => {
        //   console.log("Here 2")
        //   

        // });

      })
    }
    addTranscript(jsonData)

  }

})

app.listen(process.env.PORT || 6020, 'localhost', () => {
  //isConnectedBlockchain();
  console.log("Server Running at localhost:6020");
})