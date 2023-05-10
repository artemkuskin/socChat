const { model } = require("mongoose");

const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const router = new Router();

router.post("/registration", userController.registartion);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refrash);
router.get("/users", userController.getUser);

module.exports = router;
