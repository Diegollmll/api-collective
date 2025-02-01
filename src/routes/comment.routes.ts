import express from "express";
import {
    createComment,
    getComments,
    getCommentById,
    updateComment,
    deleteComment,
} from "../controllers/comment.controller";

const router = express.Router();

router.post("/", createComment);
router.get("/", getComments);
router.get("/:id", getCommentById);
router.put("/:id", updateComment);
router.patch("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;