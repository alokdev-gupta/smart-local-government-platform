const Certificate = require('../models/Certificate');

// ─── 1. GET /api/certificates/my ─────────────────────────────────────────────
const getUserCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ userId: req.user._id })
      .sort({ issuedDate: -1 })
      .populate('applicationId', 'certificateType applicantDetails.fullName');
      
    res.status(200).json({ success: true, data: { certificates } });
  } catch (error) {
    next(error);
  }
};

// ─── 2. GET /api/certificates/:id/download ────────────────────────────────────
const downloadCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found.' });
    }

    if (certificate.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    if (!certificate.pdfUrl) {
      return res.status(400).json({ success: false, message: 'PDF document not generated for this certificate yet.' });
    }

    certificate.downloadCount += 1;
    await certificate.save();

    res.status(200).json({
      success: true,
      data: {
        pdfUrl: certificate.pdfUrl,
        certificateNumber: certificate.certificateNumber,
      }
    });
  } catch (error) {
    next(error);
  }
};

// ─── 3. GET /api/certificates/verify/:certNumber (PUBLIC) ─────────────────────
const verifyCertificate = async (req, res, next) => {
  try {
    const { certNumber } = req.params;
    
    const certificate = await Certificate.findOne({ certificateNumber: certNumber })
      .populate('userId', 'fullName email')
      .populate('applicationId', 'certificateType applicantDetails');

    if (!certificate) {
      return res.status(404).json({ 
        success: false, 
        data: { isValid: false, message: 'Certificate not found' }
      });
    }

    if (!certificate.isValid) {
      return res.status(200).json({
        success: true,
        data: { 
          isValid: false, 
          message: 'Certificate revoked', 
          revokedReason: certificate.revokedReason 
        }
      });
    }

    const isExpired = new Date() > certificate.expiryDate;
    if (isExpired) {
      return res.status(200).json({
        success: true,
        data: {
          isValid: false,
          message: 'Certificate has expired'
        }
      });
    }

    const application = certificate.applicationId || {};
    const applicantDetails = application.applicantDetails || {};

    res.status(200).json({
      success: true,
      data: {
        isValid: true,
        certificateNumber: certificate.certificateNumber,
        holderName: applicantDetails.fullName || (certificate.userId ? certificate.userId.fullName : 'Unknown'),
        certificateType: certificate.certificateType,
        issuedDate: certificate.issuedDate,
        expiryDate: certificate.expiryDate,
        issuedBy: 'Local Government Office',
        verifiedAt: new Date()
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserCertificates,
  downloadCertificate,
  verifyCertificate,
};
