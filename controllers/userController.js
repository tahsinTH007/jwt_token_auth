const { where, Op } = require("sequelize");
const jwt = require('jsonwebtoken');
const db = require("../models/index");

const User = db.users;

let RefreshTokens = []

const generateToken = (user) => {
    return jwt.sign({id: user.id, isAdmin: user.isAdmin},"mySecretKey",{expiresIn:"30s"});
}
const generateRefreshToken = (user) => {
    return jwt.sign({id: user.id, isAdmin: user.isAdmin},"myReFreshSecretKey");
}

// registerUser a user
const registerUser = async (req, res) => {
    try {
        console.log(req.body);
        let info = {
            username: req.body.username,
            password: req.body.password,
            isAdmin: req.body.isAdmin,
        }
        const user = await User.create(info);
        res.status(200).send(user)
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};

// create user and create a accessToken with jwt
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({
            where:{
                [Op.and]: [{ username: username }, { password: password }]
            }
        });
        
        if(user){
            const accessToken = generateToken(user);
            const refreshToken = generateRefreshToken(user);
            RefreshTokens.push(refreshToken)
            return res.status(200).json({
                username: user.username,
                isAdmin: user.isAdmin,
                accessToken,
                refreshToken,
            })
        }else{
           return res.status(404).json("user not found...")
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};


// delete a user
const deleteUser = async (req, res) => {
    const {id} = req.params;
    const tokenId = req.user.id;
    console.log(typeof(tokenId));
    console.log(typeof(id));

    if(tokenId === parseInt(id) || req.user.isAdmin){
        console.log("hi");
        try {
            await User.destroy({
                where:{
                    id: tokenId
                }
            })
            res.status(200).json("User has been deleted")
        } catch (error) {
            console.log(error);
        }
    }else{
        res.status(403).json("You're not allowd to delete the user")
    }
}

// refreash token
const ReFreshToken = async (req, res) => {
        const {token} = req.body;
        console.log(token);
        if(!token) return res.status(401).json("You're not authenticate...");
        console.log(RefreshTokens);
        if(!RefreshTokens.includes(token)) return res.status(403).json("Refresh token is not valied");

        jwt.verify(token, "myReFreshSecretKey", (err, user) => {
            if(err){
                console.log(err);
            }else{
                RefreshTokens = RefreshTokens.filter((tokens) => tokens != token);

                const newAccessToken = generateToken(user);
                const newRefreshToken = generateRefreshToken(user);

                RefreshTokens.push(newRefreshToken);

                res.status(200).json({
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                })
            }
        })
        
        
}

const logOut = async(req, res) => {
    const {token} = req.body;
    RefreshTokens = RefreshTokens.filter((Token) => Token != token);
    res.status(200).json("You logged out successfully...");
}

module.exports = {
    registerUser,
    loginUser,
    deleteUser,
    ReFreshToken,
    logOut,
}