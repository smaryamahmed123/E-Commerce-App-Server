// server/routes/admin.js
import express from 'express';
import User from '../models/User.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import { ApproveRequest, DenyRequest, GetRequestUser, PostRequestUser, Users } from '../controllers/adminController.js';
const router = express.Router();

router.get('/users', adminMiddleware, Users);
router.get('/request-admin', adminMiddleware, GetRequestUser);
router.post('/request-admin', PostRequestUser);
router.post('/approve-request', adminMiddleware, ApproveRequest);
router.post('/deny-request', adminMiddleware, DenyRequest);

export default router;

