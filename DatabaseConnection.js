const mariadb = require('mariadb');


const dbconnect = async () => {
    var dbPool = await mariadb.createPool({
        host: '18.139.229.175',
        port: '3306',
        user: 'veryfind',
        password: 'Veryfind_026',
        database: 'veryfine',
        connectionLimit: 200
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