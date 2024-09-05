const jwt = require('jsonwebtoken');

const verifyJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if(authHeader){
        const token = authHeader.split(" ")[1];

        jwt.verify(token,"mySecretKey", (err, user) => {
            if(err){
                return res.status(403).json("Token is no valid");
            }
            req.user = user;
            next();
        })
    }else{
        return res.status(401).json("You're not authenticated...");
    }
}

module.exports = verifyJwt;