import express from "express";
import {
    createContact,
    getContacts,
    getContactById,
    updateContact,
    deleteContact,
} from "../controllers/contact.controller";
import multer from 'multer';

const router = express.Router();
const upload = multer();

router.post("/", upload.none(), createContact);
router.get("/", getContacts);
router.get("/:id", getContactById);
router.put("/:id", updateContact);
router.patch("/:id", updateContact);
router.delete("/:id", deleteContact);

export default router;