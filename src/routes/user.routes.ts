import { Router } from "express";
import { 
    createUser, 
    getUsers, 
    // getUserById, 
    getUsersByRole, 
    updateUser, 
    deleteUser 
} from "../controllers/user.controller";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);
// router.get("/:id", getUserById);
router.get("/role/:roleId", getUsersByRole);
router.put("/:id", updateUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
