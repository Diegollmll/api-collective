import express from "express";
import { upload } from '../config/multer.config';
import {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
} from "../controllers/subscription.controller";
import { validateContentType } from '../middlewares/contentType.middleware';
import { CONTENT_TYPES } from '../config/contentTypes.config';

const router = express.Router();

router.post("/", 
  validateContentType([CONTENT_TYPES.JSON, CONTENT_TYPES.FORM_DATA]), 
  upload.none(),
  createSubscription
);
router.get("/", getSubscriptions);
router.get("/:id", getSubscriptionById);
router.put("/:id", 
  validateContentType([CONTENT_TYPES.JSON, CONTENT_TYPES.FORM_DATA]), 
  upload.none(),
  updateSubscription
);
router.patch("/:id", 
  validateContentType([CONTENT_TYPES.JSON, CONTENT_TYPES.FORM_DATA]), 
  upload.none(),
  updateSubscription
);
router.delete("/:id", deleteSubscription);

export default router;