const { dbconnect } = require("../../DatabaseConnection");


setHumanResourceUser = (firstname, surname, gender, dob, tel, email, password, dateRegister, companyid, position) => {

    // console.log("Staff Id : ",staffid);
    var getLastestSql = "SELECT userid FROM user ORDER BY userid DESC LIMIT 1";
    dbconnect.query(getLastestSql, (err, result) => {

        //Generate new Id
        if (!err) {
            var userId = result.map((data) => data.userid);
            var numberOrder = userId[0].substring(3);

            increaseId = (numberOrder) => {
                var index = "vf_";
                var numberInt = parseInt(numberOrder);
                //console.log("Number INT : ",numberInt+" "+numberOrder);
                return index + (++numberInt);
            }
            var newUserId = increaseId(numberOrder);
            //console.log("New User Id : ", newUserId)

            //Insert User in User and HumanResource
            var newUser = [[newUserId, firstname, surname, gender, dob, tel, email, password, dateRegister]]
            //console.log("New User : ",newUser);
            var newUserSql = "INSERT INTO user (userid,firstname,surname,gender,dob,tel,email,password,dateofregister) VALUES ?";
            dbconnect.query(newUserSql, [newUser], (err, result1) => {
                var newHRSql = "INSERT INTO humanresourcestaff (userid,companyid,position) VALUES ?"
                if (!err) {
                    console.log(result1.affectedRows + " User in created!");
                    var newHRUser = [[newUserId, companyid, position]];
                    //console.log("HR Data :",newHRUser);
                    dbconnect.query(newHRSql, [newHRUser], (err, result) => {
                        if (!err) {
                            console.log(result.affectedRows + " HR's User is insert");
                        }
                    })
                } else {
                    console.error(err);
                }

            })


        }
    })


}

setUniversityRegistrarUser = (firstname, surname, gender, dob, tel, email, password, dateRegister, universityid, staffid, position, privatekey) => {

    var getLastestSql = "SELECT userid FROM user ORDER BY userid DESC LIMIT 1";
    dbconnect.query(getLastestSql, (err, result) => {
        //Generate new Id
        if (!err) {
            var userId = result.map((data) => data.userid);
            //console.log(userId);
            var numberOrder = userId[0].substring(3);
            increaseId = (numberOrder) => {
                var index = "vf_";
                var numberInt = parseInt(numberOrder);
                //console.log("Number INT : ",numberInt+" "+numberOrder);
                return index + (++numberInt);
            }
            var newUserId = increaseId(numberOrder);
            //console.log("New User Id : ", newUserId)

            //Insert User in User and HumanResource
            var newUser = [[newUserId, firstname, surname, gender, dob, tel, email, password, dateRegister]]
            //console.log("New User : ",newUser);
            var newUserSql = "INSERT INTO user (userid,firstname,surname,gender,dob,tel,email,password,dateofregister) VALUES ?";
            dbconnect.query(newUserSql, [newUser], (err, result1) => {
                if (!err) {
                    console.log(result1.affectedRows + " User in created!");
                    var newRegistrarSql = "INSERT INTO universityregistrar (userid,universityid,staffid,position,privatekey) VALUES ?"
                    var newRegistrarUser = [[newUserId, universityid, staffid, position, privatekey]];
                    //console.log("Registrar Data :",newRegistrarUser);
                    dbconnect.query(newRegistrarSql, [newRegistrarUser], (err, result) => {
                        if (!err) {
                            console.log(result.affectedRows + " University Registrar's User is insert");
                        }
                    })
                }

            })
        }
    })
}

// setHumanResourceUser("Saknarong", "Pongthonglang", "Male", new Date(1997, 8, 12), "012-0345678", "saknarong@veryfind.com",
//     "letitgo123", new Date(), "101000", "Human Resource's Staff");


// setUniversityRegistrarUser("Sineenad", "Junmookda", "Female", new Date(1998, 5, 1), "012-0345678", "sineenad@veryfind.com",
//     "tanja", new Date(), "100000", "34567891231", "University Registrar's Staff", "0xB4F3e535D81e3dD7CEccDA0A626521D149E2b98d");

module.exports = {setHumanResourceUser,setUniversityRegistrarUser}