const Router = require("express");
const userController = require("../controllers/user.controller");
const router = new Router();

router.post("/registration", userController.registration);
router.get("/users", userController.getUsers);
router.put("/user", userController.updateUser);
router.get("/login", userController.login);
router.delete("/user/:id", userController.deleteUser);
router.get("/activate/:link", userController.activate);

module.exports = router;
