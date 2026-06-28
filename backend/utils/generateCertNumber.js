const Application = require('../models/Application');
const Certificate = require('../models/Certificate');

const typeAbbreviations = {
  birth: 'BIRTH',
  citizenship: 'CTZ',
  residence: 'RES',
  marriage: 'MARR',
  death: 'DEATH',
  income: 'INC',
  character: 'CHAR'
};

const generateCertificateNumber = async (type) => {
  const abbrev = typeAbbreviations[type] || 'CERT';
  const year = new Date().getFullYear();
  
  // Count existing certificates for this type to determine the next sequence number
  const count = await Certificate.countDocuments({ certificateType: type });
  
  const sequence = String(count + 1).padStart(6, '0');
  return `CERT-${abbrev}-${year}-${sequence}`;
};

const generateApplicationNumber = async () => {
  const year = new Date().getFullYear();
  
  // Count all applications to determine the next sequence number
  const count = await Application.countDocuments();
  
  const sequence = String(count + 1).padStart(6, '0');
  return `APP-${year}-${sequence}`;
};

module.exports = {
  generateCertificateNumber,
  generateApplicationNumber
};
