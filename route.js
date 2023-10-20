const express = require("express");
const router = express.Router();
const { signup, signin, loadUserData, updateData, updatePassword, patientE, patientL, verifyToken } = require("./controllers/userController");

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/setting", loadUserData);
router.post("/updatedata", updateData);
router.post("/updatepw", updatePassword);
router.post("/patientexist", patientE);
router.post("/patientlist", patientL);
router.post("/verify", verifyToken);

module.exports = router;
