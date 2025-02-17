import express from "express";
import { upload } from '../config/multer.config';
import {
    createComment,
    getComments,
    getCommentById,
    updateComment,
    deleteComment,
    getCommentsByProject,
} from "../controllers/comment.controller";

const router = express.Router();

// Permitir múltiples archivos en el campo 'files'
router.post("/project/:projectId", upload.array('files', 5), createComment);
router.get("/", getComments);
router.get("/project/:projectId", getCommentsByProject);
router.get("/:id", getCommentById);
router.put("/:id", upload.array('files', 5), updateComment);
router.patch("/:id", upload.array('files', 5), updateComment);
router.delete("/:id", deleteComment);

export default router;