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
  getAllApplicationsAdmin,
  approveApplication,
  rejectApplication,
  getDashboardStats,
  getAllUsers,
  getMyCertificates,
  verifyCertificate,
} = require('../controllers/applicationController');

// ── IMPORTANT: Static routes must come BEFORE parameterized /:id routes ───────

// ── Certificate Routes ─────────────────────────────────────────────────────
router.get('/certificates/my',                        protect, getMyCertificates);
router.get('/certificates/verify/:certNumber',        verifyCertificate);

// ── Admin Routes ───────────────────────────────────────────────────────────
router.get('/admin/stats',                            protect, adminOnly, getDashboardStats);
router.get('/admin/all-applications',                 protect, adminOnly, getAllApplicationsAdmin);
router.put('/admin/applications/:id/approve',         protect, adminOnly, approveApplication);
router.put('/admin/applications/:id/reject',          protect, adminOnly, rejectApplication);
router.get('/admin/users',                            protect, adminOnly, getAllUsers);

// ── User Application Routes (parameterized - must come LAST) ────────────────
router.post('/',                protect, createApplication);
router.get('/',                 protect, getUserApplications);
router.get('/:id',              protect, getApplicationById);
router.put('/:id',              protect, updateApplication);
router.delete('/:id',           protect, deleteApplication);
router.post('/:id/documents',   protect, uploadSingle, uploadDocument);

module.exports = router;
