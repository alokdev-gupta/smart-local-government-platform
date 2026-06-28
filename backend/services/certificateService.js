const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const Certificate = require('../models/Certificate');
const { uploadToCloudinary } = require('../config/cloudinary');

// ─── Type Abbreviation Map ─────────────────────────────────────────────────────
const TYPE_ABBREV = {
  birth: 'BIRTH',
  citizenship: 'CTZ',
  residence: 'RES',
  marriage: 'MARR',
  death: 'DEATH',
  income: 'INC',
  character: 'CHAR',
};

// ─── Type Display Names ────────────────────────────────────────────────────────
const TYPE_DISPLAY = {
  birth: 'BIRTH CERTIFICATE / जन्म दर्ता प्रमाणपत्र',
  citizenship: 'CITIZENSHIP CERTIFICATE / नागरिकता प्रमाणपत्र',
  residence: 'RESIDENCE CERTIFICATE / बसोबास प्रमाणपत्र',
  marriage: 'MARRIAGE CERTIFICATE / विवाह दर्ता प्रमाणपत्र',
  death: 'DEATH CERTIFICATE / मृत्यु दर्ता प्रमाणपत्र',
  income: 'INCOME CERTIFICATE / आय प्रमाणपत्र',
  character: 'CHARACTER CERTIFICATE / चरित्र प्रमाणपत्र',
};

/**
 * Generate a PDF certificate buffer using PDFKit
 */
const generatePDF = async (application, certificate, qrCodeBuffer) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });

    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const pageWidth = doc.page.width - 100; // account for margins
    const certType = application.certificateType;
    const ad = application.applicantDetails || {};

    // ── Outer Border ──────────────────────────────────────────────────────────
    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
      .lineWidth(3)
      .strokeColor('#1e3a5f')
      .stroke();

    doc.rect(36, 36, doc.page.width - 72, doc.page.height - 72)
      .lineWidth(1)
      .strokeColor('#2563eb')
      .stroke();

    // ── Header Section ────────────────────────────────────────────────────────
    doc.moveDown(0.5);

    // Nepal flag emoji alternative (red stripe block)
    doc.rect(50, 55, pageWidth, 5)
      .fillColor('#DC143C')
      .fill();

    doc.moveDown(1);

    // Government of Nepal (Devanagari)
    doc.font('Helvetica-Bold')
      .fontSize(16)
      .fillColor('#1e3a5f')
      .text('नेपाल सरकार / GOVERNMENT OF NEPAL', 50, 80, { align: 'center', width: pageWidth });

    doc.font('Helvetica')
      .fontSize(12)
      .fillColor('#374151')
      .text('स्थानीय सरकार कार्यालय / LOCAL GOVERNMENT OFFICE', 50, 102, { align: 'center', width: pageWidth });

    doc.font('Helvetica')
      .fontSize(10)
      .fillColor('#6b7280')
      .text('Smart Gov Platform, Nepal', 50, 120, { align: 'center', width: pageWidth });

    // Separator line
    doc.moveTo(50, 140).lineTo(doc.page.width - 50, 140)
      .lineWidth(2)
      .strokeColor('#2563eb')
      .stroke();

    doc.moveTo(50, 143).lineTo(doc.page.width - 50, 143)
      .lineWidth(0.5)
      .strokeColor('#93c5fd')
      .stroke();

    // Certificate Type Title
    doc.font('Helvetica-Bold')
      .fontSize(14)
      .fillColor('#1e3a5f')
      .text(TYPE_DISPLAY[certType] || certType.toUpperCase(), 50, 155, {
        align: 'center',
        width: pageWidth,
      });

    // ── Certificate Number & Date (right-aligned) ─────────────────────────────
    const certInfoY = 195;
    doc.font('Helvetica')
      .fontSize(9)
      .fillColor('#6b7280')
      .text(`Certificate No: `, 50, certInfoY)
      .font('Helvetica-Bold')
      .fillColor('#1d4ed8')
      .text(certificate.certificateNumber, 130, certInfoY);

    doc.font('Helvetica')
      .fontSize(9)
      .fillColor('#6b7280')
      .text(`Issue Date: ${new Date(certificate.issuedDate || Date.now()).toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric' })}`,
        50, certInfoY + 14, { align: 'right', width: pageWidth });

    doc.font('Helvetica')
      .fontSize(9)
      .fillColor('#6b7280')
      .text(`Valid Until: ${new Date(certificate.expiryDate).toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric' })}`,
        50, certInfoY + 28, { align: 'right', width: pageWidth });

    // ── Certification Preamble ─────────────────────────────────────────────────
    doc.font('Helvetica')
      .fontSize(10)
      .fillColor('#374151')
      .text('This is to certify that the following individual has been duly registered with this office:', 50, 240, {
        align: 'center',
        width: pageWidth,
      });

    // ── Applicant Details Section ──────────────────────────────────────────────
    const detailsStartY = 270;
    doc.rect(50, detailsStartY, pageWidth, 18)
      .fillColor('#1e3a5f')
      .fill();

    doc.font('Helvetica-Bold')
      .fontSize(10)
      .fillColor('#ffffff')
      .text('APPLICANT INFORMATION / व्यक्तिगत विवरण', 55, detailsStartY + 4);

    // Build fields array
    const fields = [
      { label: 'Full Name / पूरा नाम', value: ad.fullName || '—' },
      { label: 'Date of Birth / जन्म मिति', value: ad.dateOfBirth ? new Date(ad.dateOfBirth).toLocaleDateString('en-NP') : '—' },
      { label: 'Gender / लिङ्ग', value: ad.gender ? ad.gender.charAt(0).toUpperCase() + ad.gender.slice(1) : '—' },
      { label: 'Father\'s Name / बाबुको नाम', value: ad.fatherName || '—' },
      { label: 'Mother\'s Name / आमाको नाम', value: ad.motherName || '—' },
      { label: 'Grandfather\'s Name / हजुरबाको नाम', value: ad.grandfatherName || '—' },
      { label: 'Permanent Address / स्थायी ठेगाना', value: ad.permanentAddress || '—' },
      { label: 'Ward Number / वडा नम्बर', value: ad.wardNumber || '—' },
      { label: 'Municipality / नगरपालिका', value: ad.municipalityName || '—' },
      { label: 'District / जिल्ला', value: ad.districtName || '—' },
      { label: 'Province / प्रदेश', value: ad.province || '—' },
    ];

    // 2-column layout
    let fieldY = detailsStartY + 26;
    const col1X = 55;
    const col2X = doc.page.width / 2 + 5;
    const colWidth = (pageWidth - 20) / 2;
    const rowHeight = 26;

    fields.forEach((field, idx) => {
      const isFullWidth = field.label.includes('Permanent Address');
      const xPos = isFullWidth ? col1X : (idx % 2 === 0 ? col1X : col2X);
      const fieldWidth = isFullWidth ? pageWidth - 10 : colWidth;

      // Row background
      if (Math.floor(idx / 2) % 2 === 0 && !isFullWidth) {
        doc.rect(50, fieldY, pageWidth, rowHeight).fillColor('#f8fafc').fill();
      } else if (isFullWidth && idx % 2 === 0) {
        doc.rect(50, fieldY, pageWidth, rowHeight).fillColor('#f8fafc').fill();
      }

      // Only advance Y after every 2 fields (or 1 for full-width)
      if (isFullWidth || idx % 2 === 0) {
        // Draw label
        doc.font('Helvetica-Bold')
          .fontSize(8)
          .fillColor('#4b5563')
          .text(field.label + ':', xPos, fieldY + 4, { width: fieldWidth, lineBreak: false });

        doc.font('Helvetica')
          .fontSize(9)
          .fillColor('#111827')
          .text(field.value, xPos, fieldY + 14, { width: fieldWidth, lineBreak: false });
      } else {
        // Right column
        doc.font('Helvetica-Bold')
          .fontSize(8)
          .fillColor('#4b5563')
          .text(field.label + ':', xPos, fieldY + 4, { width: fieldWidth, lineBreak: false });

        doc.font('Helvetica')
          .fontSize(9)
          .fillColor('#111827')
          .text(field.value, xPos, fieldY + 14, { width: fieldWidth, lineBreak: false });

        // Advance Y after right column
        fieldY += rowHeight;
      }

      if (isFullWidth) fieldY += rowHeight;
    });

    // Advance past fields
    fieldY += 20;

    // ── Application Reference ─────────────────────────────────────────────────
    doc.font('Helvetica')
      .fontSize(9)
      .fillColor('#6b7280')
      .text(`Application Reference: ${application.applicationNumber}`, 55, fieldY);

    fieldY += 20;

    // ── Footer Section ────────────────────────────────────────────────────────
    const footerY = doc.page.height - 160;

    // Separator
    doc.moveTo(50, footerY).lineTo(doc.page.width - 50, footerY)
      .lineWidth(1)
      .strokeColor('#e5e7eb')
      .stroke();

    // Footer note (left)
    doc.font('Helvetica')
      .fontSize(8)
      .fillColor('#6b7280')
      .text('यो प्रमाणपत्र सरकारी कार्यालयद्वारा जारी गरिएको हो।', 55, footerY + 10, { width: 250 });

    doc.font('Helvetica')
      .fontSize(7)
      .fillColor('#9ca3af')
      .text('This certificate is issued by the Local Government Office.', 55, footerY + 23, { width: 250 });

    doc.font('Helvetica')
      .fontSize(7)
      .fillColor('#9ca3af')
      .text('Verify authenticity at: smartgov.nepal.gov.np/verify', 55, footerY + 34, { width: 250 });

    // QR Code (right side of footer)
    if (qrCodeBuffer) {
      doc.image(qrCodeBuffer, doc.page.width - 135, footerY + 5, { width: 80, height: 80 });
      doc.font('Helvetica')
        .fontSize(7)
        .fillColor('#6b7280')
        .text('Scan to verify / स्क्यान गर्नुहोस्', doc.page.width - 140, footerY + 88, { width: 90, align: 'center' });
    }

    // Signature area
    const sigY = footerY + 50;
    doc.moveTo(55, sigY + 30).lineTo(200, sigY + 30)
      .lineWidth(1)
      .strokeColor('#374151')
      .stroke();

    doc.font('Helvetica-Bold')
      .fontSize(9)
      .fillColor('#374151')
      .text('अधिकृत हस्ताक्षर', 55, sigY + 34);

    doc.font('Helvetica')
      .fontSize(8)
      .fillColor('#6b7280')
      .text('Authorized Signature', 55, sigY + 46);

    // Official Stamp Placeholder Box
    doc.rect(220, sigY, 90, 60)
      .lineWidth(1.5)
      .strokeColor('#94a3b8')
      .dash(4, { space: 3 })
      .stroke();

    doc.font('Helvetica')
      .fontSize(7)
      .fillColor('#94a3b8')
      .text('OFFICIAL\nSTAMP', 235, sigY + 22, { align: 'center', width: 60 });

    // Bottom legal text
    doc.font('Helvetica')
      .fontSize(7)
      .fillColor('#9ca3af')
      .text('This is a digitally generated certificate. For verification, scan the QR code or visit the official portal.', 50, doc.page.height - 45, {
        align: 'center',
        width: pageWidth,
      });

    doc.end();
  });
};

/**
 * Main export: generateCertificate(application)
 * Creates QR, PDF, uploads both to Cloudinary, saves Certificate doc
 */
const generateCertificate = async (application) => {
  try {
    // ── Step 1: Pre-generate the certificate number ───────────────────────────
    const year = new Date().getFullYear();
    const abbrev = TYPE_ABBREV[application.certificateType] || 'CERT';
    const count = await Certificate.countDocuments();
    const sequence = String(count + 1).padStart(6, '0');
    const certificateNumber = `CERT-${abbrev}-${year}-${sequence}`;

    // ── Step 2: Generate QR Code ──────────────────────────────────────────────
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const qrCodeData = `${frontendUrl}/verify/${certificateNumber}`;
    const qrCodeBuffer = await QRCode.toBuffer(qrCodeData, {
      width: 200,
      margin: 1,
      color: { dark: '#1e3a5f', light: '#ffffff' },
      errorCorrectionLevel: 'H',
    });

    // ── Step 3: Set expiry date ───────────────────────────────────────────────
    const issuedDate = new Date();
    const expiryDate = new Date(issuedDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 5);

    // Create a temporary certificate object for PDF generation
    const tempCert = {
      certificateNumber,
      issuedDate,
      expiryDate,
    };

    // ── Step 4: Generate PDF ──────────────────────────────────────────────────
    const pdfBuffer = await generatePDF(application, tempCert, qrCodeBuffer);

    // ── Step 5: Upload PDF to Cloudinary ──────────────────────────────────────
    let pdfUrl = null;
    let qrCodeUrl = null;
    try {
      const pdfUpload = await uploadToCloudinary(pdfBuffer, {
        resource_type: 'raw',
        folder: 'smartgov/certificates',
        public_id: certificateNumber,
        format: 'pdf',
      });
      pdfUrl = pdfUpload.secure_url;
    } catch (uploadErr) {
      console.warn('PDF upload to Cloudinary failed (non-fatal):', uploadErr.message);
    }

    // ── Step 6: Upload QR Code to Cloudinary ──────────────────────────────────
    try {
      const qrUpload = await uploadToCloudinary(qrCodeBuffer, {
        resource_type: 'image',
        folder: 'smartgov/qrcodes',
        public_id: `QR-${certificateNumber}`,
        format: 'png',
      });
      qrCodeUrl = qrUpload.secure_url;
    } catch (uploadErr) {
      console.warn('QR upload to Cloudinary failed (non-fatal):', uploadErr.message);
    }

    // ── Step 7: Save Certificate to MongoDB ───────────────────────────────────
    const certificate = await Certificate.create({
      certificateNumber,
      applicationId: application._id,
      userId: application.userId,
      certificateType: application.certificateType,
      issuedDate,
      expiryDate,
      pdfUrl,
      qrCodeUrl,
      qrCodeData,
      isValid: true,
    });

    return { certificate, pdfUrl, qrCodeUrl };
  } catch (error) {
    console.error('Certificate generation failed:', error);
    throw error;
  }
};

module.exports = { generateCertificate };
