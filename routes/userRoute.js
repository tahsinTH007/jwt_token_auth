const { registerUser, loginUser, deleteUser, ReFreshToken, logOut } = require("../controllers/userController");
const verifyJwt = require("../middleware/verifyJWT");

const router = require("express").Router();


router.post("/register",registerUser);
router.get("/login",loginUser);
router.delete("/delete/:id",verifyJwt,deleteUser);
router.post("/refresh",ReFreshToken);
router.post("/logout",verifyJwt,logOut);

module.exports = router;