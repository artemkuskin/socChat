import { Router } from "express";
import { UserController } from "../controllers/user.controller";
const userController = new UserController();
export const router: Router = Router();

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.get("/activate/:link", userController.activate);
router.delete("/logout", userController.logout);
router.get("/users", userController.checkAuth, userController.getUsers);
router.get("/refresh", userController.refresh);

// module.exports = router;
