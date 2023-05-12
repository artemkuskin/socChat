const { model } = require("mongoose");

const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const router = new Router();
const { body } = require("express-validator");
const authMiddelware = require("../middelware/auth-middelware");

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 4, max: 10 }),
  userController.registartion
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refrash);
router.get("/users", authMiddelware, userController.getUser);

module.exports = router;
