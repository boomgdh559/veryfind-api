const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token,'VeryFine System');
        req.userData = decoded;
        next();

    }catch(error){
        return res.json({error:{status:401,message:"Unauthorized"}})
    }
}