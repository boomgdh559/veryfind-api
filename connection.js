const Web3 = require('web3');
const HDWalletProvider = require("@truffle/hdwallet-provider");


// if (typeof web3 !== 'undefined') {
//     web3 = new Web3(web3.currentProvider);
//     console.log("existing web3: provider " + web3);
//     web3.eth.defaultAccount = web3.eth.accounts[0];
// }

// else {
//     web3 = new Web3(new Web3.providers.HttpProvider("http://34.87.112.238:8545"));
//     console.log("new provider " + typeof web3);
//     //web3.eth.defaultAccount = web3.eth.accounts[0];
// }

//const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
//const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/03a66aafd8f04156b8d48aac7060af71'));

const mnemonic = "shaft enough emerge shrug frame tuition winter wine slender short screen pulse";
const provider = new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/03a66aafd8f04156b8d48aac7060af71');
const web3 = new Web3(provider);

var transcriptAbi = [{"constant":false,"inputs":[{"name":"stdId","type":"uint256"},{"name":"stdName","type":"string"},{"name":"stdDegree","type":"string"},{"name":"stdGPA","type":"string"},{"name":"stdDateGrad","type":"string"},{"name":"json","type":"string"}],"name":"addTranscript","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"stdId","type":"uint256"},{"name":"name","type":"string"},{"name":"degree","type":"string"},{"name":"gpa","type":"string"},{"name":"dateGrad","type":"string"},{"name":"json","type":"string"}],"name":"editJSONTranscript","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"stdId","type":"uint256"}],"name":"showJSONTranscript","outputs":[{"name":"json","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"stdId","type":"uint256"}],"name":"showTranscript","outputs":[{"name":"id","type":"uint256"},{"name":"name","type":"string"},{"name":"degree","type":"string"},{"name":"gpa","type":"string"},{"name":"dateGrad","type":"string"},{"name":"pointer","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"ident","type":"bytes32"}],"name":"verifyQRCode","outputs":[{"name":"id","type":"uint256"},{"name":"name","type":"string"},{"name":"degree","type":"string"},{"name":"gpa","type":"string"},{"name":"dateGrad","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}];
var transcriptAddr = "0x5d1D3549B2036eFfB40f60f99dACd87A064A1cf2";
var transcript = new web3.eth.Contract(transcriptAbi, transcriptAddr);
//web3.eth.defaultAccount = '0x0A938C420478974a64FA392CD2a0BA6Ce3F73bc3';



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
//             console.log('Success New Transcript : '+transactionHash);
//         }else{
//             console.log(err);
//         }
//     });
//     //console.log("Success");
// }

// newTranscript(59130500068,"Purich Sangprasert","B.Sc.IT","3.45","June 13,2020","Test Boom JSON");

//plusNumber(-1,-2);
//getName(59130500068);

// module.exports.searchTranscript = async(id) => {
//     const data = await searchTranscriptById(id);
//     return data
// }

module.exports = { web3, transcript };