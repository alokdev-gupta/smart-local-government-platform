const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');
const {
  createApplication,
  getUserApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  uploadDocument,
  validateApplication,
} = require('../controllers/applicationController');

// ── User Application Routes (parameterized - must come LAST) ────────────────
router.post('/',                protect, createApplication);
router.get('/',                 protect, getUserApplications);
router.post('/validate',        protect, validateApplication);
router.get('/:id',              protect, getApplicationById);
router.put('/:id',              protect, updateApplication);
router.delete('/:id',           protect, deleteApplication);
router.post('/:id/documents',   protect, uploadSingle, uploadDocument);

module.exports = router;
