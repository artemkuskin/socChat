const Router = require("express");
const userController = require("../controllers/user.controller");
const router = new Router();

router.post("/user", userController.registration);
router.get("/users", userController.getUsers);
router.put("/user", userController.updateUser);
router.get("/user/:id", userController.getOneUser);
router.delete("/user/:id", userController.deleteUser);

module.exports = router;
