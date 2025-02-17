import { Router } from "express";
import { createUser, getUsers, getUserById, getUsersByRole, updateUser, deleteUser } from "../controllers/user.controller";
import { upload, handleMulterError } from '../config/multer.config';

const router = Router();

router.post("/", upload.single('avatar'), handleMulterError, createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.get("/role/:roleId", getUsersByRole);
router.put("/:id", upload.single('avatar'), handleMulterError, updateUser);
router.patch("/:id", upload.single('avatar'), handleMulterError, updateUser);
router.delete("/:id", deleteUser);

export default router;
