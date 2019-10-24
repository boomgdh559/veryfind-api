const { dbconnect } = require("../../DatabaseConnection");

getLastestId = async (attribute, table) => {
    //Must be space in sql string
    var getLastestSql = "SELECT " + attribute + " FROM " + table + " ORDER BY " + attribute + " DESC LIMIT 1";
    var connect = await dbconnect();
    return connect.query(getLastestSql).then((result) => {
        data = result.map((data) => data.userid);
        var numberOrder = data[0].substring(3);
        increaseId = (numberOrder) => {
            var index = "vf0";
            var numberInt = parseInt(numberOrder);
            //console.log("Number INT : ",numberInt+" "+numberOrder);
            return index + (++numberInt);
        }
        var newUserId = increaseId(numberOrder);
        connect.end().then(()=>console.log("Close Connection in Lastest Id"));
        return newUserId;
    })


}

checkUserExist = async(firstname,surname,email) =>{

    var connect = await dbconnect();
    var checkUserSql = "select firstname,surname,email from user where firstname like ? and surname like ? and email = ?"
    var checkUserData = [firstname,surname,email];
    return await connect.query(checkUserSql,checkUserData).then((result)=>{
        const data = result;
        var returnStatus = {};
        if(data.length >= 1){
            returnStatus = {checkUserExist:true};
        }else{
            returnStatus = {checkUserExist:false};
        }
        connect.end().then(()=>console.log("Close Connection in Check User Exist"));
        return returnStatus;
        
    })

} 

findCompanyIdByCompanyRegister = async (companyRegister) => {
    var connect = await dbconnect();
    var sql = "SELECT companyid FROM company WHERE companyregisnumber like ?";
    var companyId = await connect.query(sql, companyRegister).then((result) => {
        data = result.map((data) => data.companyid);
        connect.end().then(()=>console.log("Close Connection in Find Company"));
        //console.log("Data : ",result);
        return data[0];
    })
    return companyId;
}

findUniversityIdByUniversityName = async (universityName) => {
    var connect = await dbconnect();
    var sql = "SELECT universityid FROM university WHERE universityname like ?";
    var universityId = await connect.query(sql, universityName + "%").then((result) => {
        data = result.map((data) => data.universityid);
        connect.end().then(()=>console.log("Close Connection in University Id"));
        //console.log("Data : ",result);
        return data[0];
    })
    return universityId;
}

setHumanResourceUser = async (firstname, surname, gender, dob, tel, email, password, dateRegister, companyregisnumber, position) => {

    // console.log("Staff Id : ",staffid);


    var newUserId = await getLastestId("userid", "user");
    var companyid = await findCompanyIdByCompanyRegister(companyregisnumber);
    //var setUserStatus = false;
    //var setHRStatus = false;
    var connect = await dbconnect();
    var newUserSql = "INSERT INTO user (userid,firstname,surname,gender,dob,tel,email,password,dateofregister) VALUES (?,?,?,?,?,?,?,?,?)";
    var newUser = [newUserId, firstname, surname, gender, dob, tel, email, password, dateRegister]
    //var newHRUserSql = "INSERT INTO humanresourcestaff (userid,companyid,position) VALUES (?,?,?)"
    setUserStatus = await connect.query(newUserSql, newUser).then((result) => {
        if (result.affectedRows >= 1) {
            console.log(result.affectedRows + " User is created")
            connect.end().then(()=>console.log("Close Connection in User signup"));
            return true;
        } else {
            return false;
        }
    })

    if (setUserStatus) {
        var newHRSql = "INSERT INTO humanresourcestaff (userid,companyid,position) VALUES (?,?,?)";
        var newHRUser = [newUserId, companyid, position];
        setHRStatus = await connect.query(newHRSql, newHRUser).then((result) => {
            if (result.affectedRows >= 1) {
                console.log(result.affectedRows + " HR's user is created")
                connect.end().then(()=>console.log("Close Connection in HR signup"));
                return true;
            } else {
                return false;
            }
        })
        return setHRStatus;
    } else {
        return false
    }


}

setUniversityRegistrarUser = async (firstname, surname, gender, dob, tel, email, password, dateRegister, universityName, staffid, position, privatekey) => {

    //     var getLastestSql = "SELECT userid FROM user ORDER BY userid DESC LIMIT 1";
    var connect = await dbconnect();
    var newUserId = await getLastestId("userid", "user");
    var newUserSql = "INSERT INTO user (userid,firstname,surname,gender,dob,tel,email,password,dateofregister) VALUES (?,?,?,?,?,?,?,?,?)";
    var newUser = [newUserId, firstname, surname, gender, dob, tel, email, password, dateRegister]
    //var newHRUserSql = "INSERT INTO humanresourcestaff (userid,companyid,position) VALUES (?,?,?)"
    setUserStatus = await connect.query(newUserSql, newUser).then((result) => {
        if (result.affectedRows >= 1) {
            console.log(result.affectedRows + " User is created")
            connect.end().then(()=>console.log("Close Connection in User signup"));
            return true;
        } else {
            return false;
        }
    })

    if (setUserStatus) {
        var newRegistrarSql = "INSERT INTO universityregistrar (userid,universityid,staffid,position,privatekey) VALUES (?,?,?,?,?)"
        var universityid = await findUniversityIdByUniversityName(universityName);
        var newRegistrarUser = [newUserId, universityid, staffid, position, privatekey];
        setRegistrarStatus = await connect.query(newRegistrarSql, newRegistrarUser).then((result) => {
            if (result.affectedRows >= 1) {
                connect.end().then(()=>console.log("Close Connection in Registrar signup"));
                return true;
            } else {
                return false;
            }
        })
        return true;
    } else {
        return false
    }
}

authenticationExist = async (email, password) => {

    var connect = await dbconnect();
    var sql = "select * from user where email = ? and password = ?"
    var loginData = [email, password];
    var loginStatus = await connect.query(sql, loginData).then((result) => {
        if(result.length !== 0){
            //console.log("Result : ", result);
            var data = result[0];
            connect.end().then(()=>console.log("Close Connection in Login"));
            return {loginStatus:true,loginData:{
                userid:data.userid,
                firstname:data.firstname,
                surname:data.surname,
                gender:data.gender,
                dob:data.dob,
                tel:data.tel
            }}
        }else{
            connect.end().then(()=>console.log("Close Connection in Login"));
            return {loginStatus:false};
        }
        
    })
    return loginStatus

}

checkHRUser = async(email,password) => {
    var connect = await dbconnect();
    var checkHRSql = "SELECT hr.userid FROM user u join humanresourcestaff hr on u.userid = hr.userid WHERE u.email = ? and u.password = ?";
    var checkHRData = [email,password];
    return await connect.query(checkHRSql,checkHRData).then((result)=>{
        var data = result;
        var resultStatus = {};
        if(data.length >= 1){
            resultStatus = {checkHRStatus:true}
        }else{
            resultStatus = {checkHRStatus:false}
        }
        connect.end().then(()=>console.log("Close Connection in Check HR User"));
        return resultStatus;
    })
}

checkRegistrarUser = async(email,password) => {
    var connect = await dbconnect();
    var checkHRSql = "SELECT r.userid FROM user u join universityregistrar r on u.userid = r.userid WHERE u.email = ? and u.password = ?";
    var checkHRData = [email,password];
    return await connect.query(checkHRSql,checkHRData).then((result)=>{
        var data = result;
        var resultStatus = {};
        if(data.length >= 1){
            resultStatus = {checkRegistrarStatus:true}
        }else{
            resultStatus = {checkRegistrarStatus:false}
        }
        connect.end().then(()=>console.log("Close Connection in Check Registrar User"));
        return resultStatus;
    })
}

(async () => {
    //console.log(await checkHRUser("saknarong@veryfine.com","letitgo123"));
    //console.log(await checkRegistrarUser("sineenad@veryfind.com","tanja"));
    //console.log(await checkUserExist("jurich","Sangprasert","purich@veryfine.com"));
    //console.log("Userid : ", await getLastestId("userid", "user"));
    // console.log("HR Result : ",await setHumanResourceUser("Saknarong", "Pongthonglang", "Male", new Date(1997, 8, 12), "012-0345678", "saknarong@veryfind.com",
    // "letitgo123", new Date(), "0105558193432", "Human Resource's Staff"));

    // console.log("Registrar Result : ",await setUniversityRegistrarUser("Sineenad", "Junmookda", "Female", new Date(1998, 5, 1), "012-0345678", "sineenad@veryfind.com",
    // "tanja", new Date(), "King", "34567891231", "University Registrar's Staff", "0xB4F3e535D81e3dD7CEccDA0A626521D149E2b98d"));
    //console.log(await findUniversityIdByUniversityName("King"));
    //console.log("Login : ", await authenticationExist("purich@veryfine.com","boomgdh559"));

})()
module.exports = { setHumanResourceUser, setUniversityRegistrarUser,authenticationExist,checkUserExist,checkHRUser,checkRegistrarUser }