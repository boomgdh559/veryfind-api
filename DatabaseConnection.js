const mariadb = require('mysql');

const dbconnect = mariadb.createConnection({
    host: '18.139.229.175',
    port:'3306',
    user: 'veryfind',
    password: 'Veryfind_026',
    database:'veryfine'
});

// dbconnect.query("select userid from user",(err,res)=>{
//     var data = res.map((data)=>data.userid);
//     getResult(data);
// })

// getResult = (result) => {
//     console.log("Result : ",result);
// }

module.exports = {dbconnect}