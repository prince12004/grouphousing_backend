const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const generateRefreshToken = (id) => jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' });

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const generateResetToken = () => crypto.randomBytes(32).toString('hex');

const formatWhatsAppMessage = ({ projectName, name, phone }) =>
  encodeURIComponent(`Hello Team,\n\nI am interested in:\n\nProject: ${projectName}\n\nName: ${name}\n\nPhone: ${phone}\n\nPlease share complete details.`);

const paginate = (page = 1, limit = 10) => ({
  skip: (parseInt(page) - 1) * parseInt(limit),
  limit: parseInt(limit),
});

const formatCurrency = (amount, currency = 'INR') => {
  if (!amount) return '₹0';
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(2)} K`;
  return `₹${amount}`;
};

module.exports = { generateToken, generateRefreshToken, generateOTP, generateResetToken, formatWhatsAppMessage, paginate, formatCurrency };
