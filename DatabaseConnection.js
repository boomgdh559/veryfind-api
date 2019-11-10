const mariadb = require('mariadb');
const dotenv = require('dotenv').config();

const dbconnect = async () => {
    var dbPool = await mariadb.createPool({
        host: process.env.DB_Host,
        port: process.env.DB_Port,
        user: process.env.DB_User,
        password: process.env.DB_Password,
        database: process.env.DB_Database,
        connectionLimit: process.env.DB_ConnectionLimit
    })
    return dbPool;
}


// userId = async() =>{
//     return await dbconnect.then((connect) => {
//         var result = connect.query("select userid from user").then((result) => {
//             data = result.map((data)=>data.userid);
//             return data;
//         })
//         return result;
//     })
// } 

// (async() => {
//     try{
//         const connect = await dbconnect();
//         var userId = await connect.query("select userid from user").then((result)=>{
//             var data = result.map((data)=>data.userid);
//             connect.end().then(()=>console.log("Close Connection"));
//             return data;
//         })
//         userId.map((data)=>{
//             console.log("User Id : ",data);
//         })
        
//     }catch(err){
//         console.error(err);
//     }
    
// })()





// getResult = (result) => {
//     console.log("Result : ",result);
// }

module.exports = { dbconnect }