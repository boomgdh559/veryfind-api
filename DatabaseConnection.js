const mariadb = require('mariadb');


const dbconnect = async () => {
    return await mariadb.createConnection({
        host: '18.139.229.175',
        port: '3306',
        user: 'veryfind',
        password: 'Veryfind_026',
        database: 'veryfine'
    }).then((connect)=>{
        return connect
    })
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
//     const connect = await dbconnect();
//     connect.query("select userid from user").then((result)=>{
//         console.log(result.user)
//     })
// })()





// getResult = (result) => {
//     console.log("Result : ",result);
// }

module.exports = { dbconnect }