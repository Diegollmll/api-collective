import { Router } from "express";
import { upload } from '../config/multer.config';
import {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    getMembers
} from "../controllers/project.controller";

const router = Router();

router.get("/", getProjects);
router.post("/", upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'logo', maxCount: 1 }
]), createProject);
router.get("/:id", getProjectById);
router.put("/:id", upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'logo', maxCount: 1 }
]), updateProject);
router.patch("/:id", upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'logo', maxCount: 1 }
]), updateProject);
router.delete("/:id", deleteProject);
router.get("/members/", getMembers);

export default router;
