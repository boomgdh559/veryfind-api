const Web3 = require('web3');
const HDWalletProvider = require("@truffle/hdwallet-provider");
const bip39 = require("bip39");

// const mnemonic = bip39.generateMnemonic();
// console.log("Word : ",mnemonic);

// console.log(bip39.mnemonicToSeedSync(mnemonic).toString('hex'))
// if (typeof web3 !== 'undefined') {
//     web3 = new Web3(web3.currentProvider);
//     console.log("existing web3: provider " + web3);
//     web3.eth.defaultAccount = web3.eth.accounts[0];
// }

// else {
//     web3 = new Web3(new Web3.providers.HttpProvider("http://54.255.146.166:8545"));
//     console.log("new provider " + typeof web3);
//     web3.eth.defaultAccount = web3.eth.accounts[0];
// }

// console.log("Account : ",web3.eth.accounts[0])

//const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
//const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/03a66aafd8f04156b8d48aac7060af71'));

const mnemonic = "shaft enough emerge shrug frame tuition winter wine slender short screen pulse";
const provider = new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/03a66aafd8f04156b8d48aac7060af71');
const web3 = new Web3(provider);

var transcriptAbi = [{"constant":false,"inputs":[{"name":"stdId","type":"uint256"},{"name":"stdName","type":"string"},{"name":"stdDegree","type":"string"},{"name":"stdGPA","type":"string"},{"name":"stdDateGrad","type":"string"},{"name":"json","type":"string"}],"name":"addTranscript","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"stdId","type":"uint256"},{"name":"name","type":"string"},{"name":"degree","type":"string"},{"name":"gpa","type":"string"},{"name":"dateGrad","type":"string"},{"name":"json","type":"string"}],"name":"editJSONTranscript","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"stdId","type":"uint256"}],"name":"showJSONTranscript","outputs":[{"name":"json","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"stdId","type":"uint256"}],"name":"showTranscript","outputs":[{"name":"id","type":"uint256"},{"name":"name","type":"string"},{"name":"degree","type":"string"},{"name":"gpa","type":"string"},{"name":"dateGrad","type":"string"},{"name":"pointer","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"ident","type":"bytes32"}],"name":"verifyQRCode","outputs":[{"name":"id","type":"uint256"},{"name":"name","type":"string"},{"name":"degree","type":"string"},{"name":"gpa","type":"string"},{"name":"dateGrad","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}];
var transcriptAddr = "0x48574412cE88767EA8276a65853Fb896De73d672";
var transcript = new web3.eth.Contract(transcriptAbi, transcriptAddr);
web3.eth.defaultAccount = '0x0A938C420478974a64FA392CD2a0BA6Ce3F73bc3';



// showAccount = async () => {
//     console.log("Account : " + await web3.eth.getAccounts());
// }

// showAccount();

// transcript.showTranscript(59130500068,(err,res)=> {
//     if(!err){
//         console.log("Name : "+res[1]);
//     }else{
//         console.log("Fail");
//     }
// })

// const searchTranscript = async (id) => {

//     const data = await transcript.methods.showTranscript(id).call((err,res)=> {
//         if(!err){
//             return res;
//         }else{
//             console.error(err);
//         }
//     });


//     return data;
    
//     // if (typeof data !== 'undefined') {
//     //     //   res.render('result', { transcriptData: { name: data[1], gpa: data[3], date: data[4] } });
//     //     console.log("Name : " + data[1]);
//     // } else {
//     //     console.log("Not found that name");
//     // }

// }
// (async() => {
//     try{
//         isExist = true
//         const name = await searchTranscript(59130500068);
//         console.log("Name : "+name.name)
//         if(name.name.length == 0){
//             isExist = false
//         }

//     }catch(err){
//         console.error(err);
//     }
    
    
// })()

// var date = new Date();
// var dateUnit = null;
// //date
// var day = date.getDate();
// var monthIndex = date.getMonth();
// var year = date.getFullYear()+543;
// //time
// var hours = date.getHours();
// var minutes = date.getMinutes();
// var seconds = date.getSeconds();

// if(hours >= 12){
//     dateUnit = 'P.M.'
// }else{
//     dateUnit = 'A.M.'
// }

// if(hours < 10){
//     hours = '0'+hours;
// }

// if(minutes < 10){
//     minutes = '0'+minutes;
// }

// console.log("Day : "+day+'/'+monthIndex+'/'+year+'\nTime : '+hours+':'+minutes+':'+seconds);
// transcript.setTranscript.sendTransaction(591068,"Boom","B.Sc.IT","3.54","11/6/2020","Test Boom JSON",(err,res)=>{
//     if(!err){
//         console.log("Success : "+res);
//     }else{
//         console.log("Fail : "+err);
//     }
// });

// getName = async(id) => {

//     const name = await transcript.methods.getTranscriptFromId(id).call();
//     console.log("Name : "+name[1]);

// }

// newTranscript = async(id,name,degree,gpa,date,json) => {
//     var account = await web3.eth.getAccounts();
//     await transcript.methods.addTranscript(id,name,degree,gpa,date,json).send({from : account[0]},(err,transactionHash) => {
//         if(!err){
//             console.log('Transaction Hash : '+transactionHash);
//         }else{
//             console.log(err);
//         }
//     });
//     //console.log("Success");
// }

//newTranscript(59130500066,"Phanupan Nokamdee","B.Sc.IT","3.45","June 13,2020",'{"KMUTT_Transcript_59130500045":{"studentID":59130500045,"name":"Ms.Budsagorn Pakdeewan","dob":"May 9,1997","previousCert_Degree":"Grade 12 Qualification","dateOfAdmission":"June 26, 2014","dateOfGraduation":"June 12, 2020","faculty":"School of Information Technology","fieldOfStudy":"Information technology","major":"-","degreeConferred":"Bachelor Of Science (Information Technology)","creditPrescribed":129,"creditsEarned":129,"totalGradGPA":3.34,"graduateHonors":"Second Class Honours","dateOfValidSeal":"August 1,2018","registrar":"Ms.Suwanna Jemkitjavarote","semester" : [{"semesterTitle":"semester_1/2014","semesterDetail" : {"totalCredit":16,"totalGPA":3.5,"cumGPA":3.5,"course" : [{"courseNo":"GEN101","courseTitle":"PHYSICAL EDUCATION","credits":1,"grades":"B+"},{"courseNo":"GEN121","courseTitle":"LEARNING AND PROBLEM SOLVING SKILLS","credits":3,"grades":"B+"},{"courseNo":"INT101","courseTitle":"INFORMATION TECHNOLOGY FUNDAMENTAL","credits":3,"grades":"A"},{"courseNo":"INT102","courseTitle":"COMPUTER PROGRAMMING I","credits":3,"grades":"B+"},{"courseNo":"INT104","courseTitle":"DISCRETE MATHEMATICS FOR INFORMATION TECHNOLOGY","credits":3,"grades":"B"},{"courseNo":"LNG102","courseTitle":"ENGLISH SKILLS AND STRATEGIES","credits":3,"grades":"B"}]}},{"semesterTitle":"semester_2/2014","semesterDetail" : {"totalCredit":18,"totalGPA":3.58,"cumGPA":3.35,"course" : [{"courseNo":"GEN111","courseTitle":"MAN AND ETHICS OF LIVING","credits":3,"grades":"C+"},{"courseNo":"INT105","courseTitle":"COMPUTER PROGRAMMING II","credits":3,"grades":"B+"},{"courseNo":"INT106","courseTitle":"WEB TECHNOLOGY","credits":3,"grades":"A"},{"courseNo":"INT107","courseTitle":"COMPUTING PLATFORM TECHNOLOGY","credits":3,"grades":"B"},{"courseNo":"LNG103","courseTitle":"ACADEMIC ENGLISH","credits":3,"grades":"B"},{"courseNo":"MTH111","courseTitle":"CALCULAS I","credits":3,"grades":"C"}]}},{"semesterTitle":"semester_1/2015","semesterDetail" : {"totalCredit":18,"totalGPA":3.33,"cumGPA":3.35,"course" : [{"courseNo":"GEN231","courseTitle":"MIRACLE OF THINKING","credits":3,"grades":"B+"},{"courseNo":"GEN241","courseTitle":"BEAUTY OF LIFE","credits":3,"grades":"B"},{"courseNo":"INT201","courseTitle":"NETWORK I","credits":3,"grades":"A"},{"courseNo":"INT203","courseTitle":"DATABASE MANAGEMENT SYSTEMS","credits":3,"grades":"B+"},{"courseNo":"INT303","courseTitle":"WEB PROGRAMMING","credits":3,"grades":"B+"},{"courseNo":"LNG221","courseTitle":"ORAL COMMUNICATION I","credits":3,"grades":"A"}]}},{"semesterTitle":"semester_2/2015","semesterDetail" : {"totalCredit":18,"totalGPA":3.33,"cumGPA":3.35,"course" : [{"courseNo":"INT204","courseTitle":"BUSINESS INFORMATION SYSTEMS","credits":3,"grades":"B+"},{"courseNo":"INT205","courseTitle":"NETWORK II","credits":3,"grades":"B"},{"courseNo":"INT207","courseTitle":"INFORMATION MANAGEMENT","credits":3,"grades":"B"},{"courseNo":"INT304","courseTitle":"STATISTICS FOR INFORMATION TECHNOLOGY","credits":3,"grades":"B+"},{"courseNo":"INT320","courseTitle":"DATA STRUCTURES AND ALGORITHMS","credits":3,"grades":"B"},{"courseNo":"LNG201","courseTitle":"CONTENT-BASED LANGUAGE LEARNING II","credits":3,"grades":"A"}]}},{"semesterTitle":"semester_1/2016","semesterDetail" : {"totalCredit":19,"totalGPA":3.42,"cumGPA":3.36,"course" : [{"courseNo":"GEN311","courseTitle":"ETHICS IN SCIENCE-BASES SOCIETY","credits":3,"grades":"A"},{"courseNo":"INT202","courseTitle":"SOFTWARE DEVELOPMENT PROCESS","credits":3,"grades":"B+"},{"courseNo":"INT301","courseTitle":"INFORMATION TECHNOLOGY INFRASTRUCTURE MANAGEMENT","credits":3,"grades":"B+"},{"courseNo":"INT302","courseTitle":"INFORMATION TECHNOLOGY SERVICES MANAGEMENT","credits":3,"grades":"C+"},{"courseNo":"INT305","courseTitle":"HUMAN COMPUTER INTERACTION","credits":3,"grades":"A"},{"courseNo":"INT351","courseTitle":"INFORMATION TECHNOLOGY SEMINAR","credits":1,"grades":"B+"},{"courseNo":"LNG410","courseTitle":"BUSINESS ENGLISH","credits":3,"grades":"B"}]}},{"semesterTitle":"semester_2/2016","semesterDetail" : {"totalCredit":14,"totalGPA":2.96,"cumGPA":3.31,"course" : [{"courseNo":"INT206","courseTitle":"SOFTWARE PROJECT MANAGEMENT","credits":3,"grades":"A"},{"courseNo":"INT306","courseTitle":"ELECTRONIC-BUSINESS","credits":3,"grades":"C"},{"courseNo":"INT307","courseTitle":"SOCIAL ISSUES AND ETHICS FOR IT PROFESSTIONAL","credits":3,"grades":"B"},{"courseNo":"INT353","courseTitle":"INFORMATION TECHNOLOGY PROJECT I","credits":2,"grades":"B+"},{"courseNo":"INT370","courseTitle":"INFORMATION TECHNOLOGY SYSTEM IMPLEMENTATION","credits":3,"grades":"C+"}]}},{"semesterTitle":"semester_1/2017","semesterDetail" : {"totalCredit":17,"totalGPA":3.47,"cumGPA":3.33,"course" : [{"courseNo":"INT401","courseTitle":"INFORMATION ASSURANCE AND SECURITY I","credits":3,"grades":"B"},{"courseNo":"INT402","courseTitle":"INFORMATION TECHNOLOGY PROFESSIONAL COMMUNICATION","credits":3,"grades":"A"},{"courseNo":"INT450","courseTitle":"INFORMATION TECHNOLOGY PROJECT II","credits":2,"grades":"A"},{"courseNo":"INT493","courseTitle":"SPECIAL TOPIC III : HYBRID MOBILE APPLICATION DEVELOPMENT WORKSHOP","credits":2,"grades":"B+"},{"courseNo":"LNG203","courseTitle":"BASIC GERMAN I","credits":3,"grades":"B"},{"courseNo":"SSC373","courseTitle":"MANAGEMENT FOR SMALL AND MEDIUM ENTERPRISE (SMES)","credits":3,"grades":"B+"}]}},{"semesterTitle":"semester_2/2017","semesterDetail" : {"totalCredit":9,"totalGPA":3.5,"cumGPA":3.34,"course" : [{"courseNo":"GEN351","courseTitle":"MODERN MANAGEMENT AND LEADERSHIP","credits":3,"grades":"B+"},{"courseNo":"GEN441","courseTitle":"CULTURE AND EXCURSION","credits":3,"grades":"A"},{"courseNo":"INT492","courseTitle":"SELECTED TOPIC IN INFORMATION TECHNOLOGY II : WEB AND MOBILE PRODUCTION","credits":3,"grades":"B"}]}}]}}');

//web3.eth.getGasPrice().then((result)=>console.log("Gas Price : ",result))
//plusNumber(-1,-2);
//getName(59130500068);

// module.exports.searchTranscript = async(id) => {
//     const data = await searchTranscriptById(id);
//     return data
// }

module.exports = { web3, transcript };
