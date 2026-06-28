const Application = require('../models/Application');
const Certificate = require('../models/Certificate');
const User = require('../models/User');
const { validateApplicationData } = require('../services/smartValidationService');

// ─── Helper: build applicationNumber ─────────────────────────────────────────
const generateAppNumber = async () => {
  const year = new Date().getFullYear();
  const count = await Application.countDocuments();
  const seq = String(count + 1).padStart(6, '0');
  return `APP-${year}-${seq}`;
};

// ─── 1. POST /api/applications ────────────────────────────────────────────────
const createApplication = async (req, res, next) => {
  try {
    const { certificateType, priority, applicantDetails, smartFormData } = req.body;

    if (!certificateType) {
      return res.status(400).json({ success: false, message: 'Certificate type is required.' });
    }

    const applicationNumber = await generateAppNumber();

    // Set estimated completion (7 business days)
    const estimated = new Date();
    estimated.setDate(estimated.getDate() + 7);

    const application = await Application.create({
      applicationNumber,
      userId: req.user._id,
      certificateType,
      priority: priority || 'normal',
      status: 'pending',
      applicantDetails: applicantDetails || {},
      smartFormData: smartFormData || null,
      estimatedCompletionDate: estimated,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully.',
      data: { application },
    });
  } catch (error) {
    next(error);
  }
};

// ─── 2. GET /api/applications ─────────────────────────────────────────────────
const getUserApplications = async (req, res, next) => {
  try {
    const { status, certificateType, page = 1, limit = 10 } = req.query;

    const filter = { userId: req.user._id };
    if (status && status !== 'all') filter.status = status;
    if (certificateType && certificateType !== 'all') filter.certificateType = certificateType;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('reviewedBy', 'fullName'),
      Application.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        applications,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── 3. GET /api/applications/:id ────────────────────────────────────────────
const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('reviewedBy', 'fullName email');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    // Ownership check (admin bypasses)
    if (
      req.user.role !== 'admin' &&
      application.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.status(200).json({ success: true, data: { application } });
  } catch (error) {
    next(error);
  }
};

// ─── 4. PUT /api/applications/:id ────────────────────────────────────────────
const updateApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    if (application.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const editableStatuses = ['draft', 'rejected'];
    if (!editableStatuses.includes(application.status)) {
      return res.status(400).json({
        success: false,
        message: `Applications with status "${application.status}" cannot be edited.`,
      });
    }

    const { applicantDetails, priority, certificateType } = req.body;

    if (applicantDetails) {
      application.applicantDetails = { ...application.applicantDetails.toObject?.() ?? {}, ...applicantDetails };
    }
    if (priority) application.priority = priority;
    if (certificateType) application.certificateType = certificateType;

    // Resubmission from rejected state
    if (application.status === 'rejected') {
      application.status = 'pending';
      application.rejectionReason = undefined;
      application.reviewedBy = undefined;
      application.reviewedAt = undefined;

      const estimated = new Date();
      estimated.setDate(estimated.getDate() + 7);
      application.estimatedCompletionDate = estimated;
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: application.status === 'pending' ? 'Application resubmitted successfully.' : 'Application updated.',
      data: { application },
    });
  } catch (error) {
    next(error);
  }
};

// ─── 5. DELETE /api/applications/:id ─────────────────────────────────────────
const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    if (application.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    if (application.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Only draft applications can be deleted.',
      });
    }

    await application.deleteOne();

    res.status(200).json({ success: true, message: 'Application deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// ─── 6. POST /api/applications/:id/documents ─────────────────────────────────
const uploadDocument = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    if (application.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const { documentType } = req.body;
    if (!documentType) {
      return res.status(400).json({ success: false, message: 'documentType is required.' });
    }

    application.uploadedDocuments.push({
      documentType,
      cloudinaryUrl: req.file.path,
      publicId: req.file.filename,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      uploadedAt: new Date(),
    });

    await application.save();

    res.status(200).json({
      success: true,
      message: 'Document uploaded successfully.',
      data: { application },
    });
  } catch (error) {
    next(error);
  }
};

// ─── 7. POST /api/applications/validate ───────────────────────────────────────
const validateApplication = async (req, res, next) => {
  try {
    const { certificateType, applicantDetails, uploadedDocuments } = req.body;
    
    if (!certificateType || !applicantDetails) {
      return res.status(400).json({ success: false, message: 'Missing required data for validation.' });
    }

    const validationResult = validateApplicationData(certificateType, applicantDetails, uploadedDocuments || []);
    
    res.status(200).json({
      success: true,
      data: validationResult
    });
  } catch (error) {
    next(error);
  }
};

// ─── 8. GET /api/admin/applications ──────────────────────────────────────────
const getAllApplicationsAdmin = async (req, res, next) => {
  try {
    const { status, certificateType, priority, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (certificateType && certificateType !== 'all') filter.certificateType = certificateType;
    if (priority) filter.priority = priority;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .sort({ priority: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('userId', 'fullName email phone')
        .populate('reviewedBy', 'fullName email'),
      Application.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        applications,
        pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── 9. PUT /api/admin/applications/:id/approve ───────────────────────────────
const approveApplication = async (req, res, next) => {
  try {
    const { adminRemarks } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }
    if (!['pending', 'under_review'].includes(application.status)) {
      return res.status(400).json({ success: false, message: 'Application cannot be approved in its current state.' });
    }

    application.status = 'approved';
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();
    if (adminRemarks) application.adminRemarks = adminRemarks;
    await application.save();

    // Issue certificate
    const certificate = await Certificate.create({
      applicationId: application._id,
      userId: application.userId,
      certificateType: application.certificateType,
    });

    res.status(200).json({
      success: true,
      message: 'Application approved and certificate issued.',
      data: { application, certificate },
    });
  } catch (error) {
    next(error);
  }
};

// ─── 10. PUT /api/admin/applications/:id/reject ────────────────────────────────
const rejectApplication = async (req, res, next) => {
  try {
    const { rejectionReason, adminRemarks } = req.body;
    if (!rejectionReason) {
      return res.status(400).json({ success: false, message: 'Rejection reason is required.' });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    application.status = 'rejected';
    application.rejectionReason = rejectionReason;
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();
    if (adminRemarks) application.adminRemarks = adminRemarks;
    await application.save();

    res.status(200).json({ success: true, message: 'Application rejected.', data: { application } });
  } catch (error) {
    next(error);
  }
};

// ─── 11. GET /api/admin/stats ─────────────────────────────────────────────────
const getDashboardStats = async (req, res, next) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [total, pending, under_review, approved, rejected, thisMonth, totalUsers, totalCerts] =
      await Promise.all([
        Application.countDocuments(),
        Application.countDocuments({ status: 'pending' }),
        Application.countDocuments({ status: 'under_review' }),
        Application.countDocuments({ status: 'approved' }),
        Application.countDocuments({ status: 'rejected' }),
        Application.countDocuments({ createdAt: { $gte: startOfMonth } }),
        User.countDocuments({ role: 'user' }),
        Certificate.countDocuments({ isValid: true }),
      ]);

    res.status(200).json({
      success: true,
      data: { stats: { total, pending, under_review, approved, rejected, thisMonth }, totalUsers, totalCerts },
    });
  } catch (error) {
    next(error);
  }
};

// ─── 12. GET /api/admin/users ─────────────────────────────────────────────────
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role } = req.query;
    const filter = role ? { role } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      User.countDocuments(filter),
    ]);
    res.status(200).json({
      success: true,
      data: { users, pagination: { total, page: parseInt(page), limit: parseInt(limit) } },
    });
  } catch (error) {
    next(error);
  }
};

// ─── 13. GET /api/certificates/my ─────────────────────────────────────────────
const getMyCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('applicationId', 'applicationNumber certificateType applicantDetails');
    res.status(200).json({ success: true, data: { certificates } });
  } catch (error) {
    next(error);
  }
};

// ─── 14. GET /api/certificates/verify/:certNumber ─────────────────────────────
const verifyCertificate = async (req, res, next) => {
  try {
    const { certNumber } = req.params;
    const certificate = await Certificate.findOne({ certificateNumber: certNumber })
      .populate('userId', 'fullName email')
      .populate('applicationId', 'certificateType applicantDetails');

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found.' });
    }

    const isExpired = new Date() > certificate.expiryDate;
    res.status(200).json({
      success: true,
      data: {
        certificate,
        isExpired,
        status: !certificate.isValid ? 'revoked' : isExpired ? 'expired' : 'valid',
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createApplication,
  getUserApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  uploadDocument,
  validateApplication,
  getAllApplicationsAdmin,
  approveApplication,
  rejectApplication,
  getDashboardStats,
  getAllUsers,
  getMyCertificates,
  verifyCertificate,
};
