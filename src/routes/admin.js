const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, updateUser, deleteUser, toggleUserStatus,
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, getAllTestimonials,
  getFAQs, createFAQ, updateFAQ, deleteFAQ, getAllFAQs, getSettings, updateSettings,
  getPublicSettings,
  getTeam, getAllTeam, createTeamMember, updateTeamMember, deleteTeamMember,
  getMilestones, getAllMilestones, createMilestone, updateMilestone, deleteMilestone,
  getValues, getAllValues, createValue, updateValue, deleteValue,
  getConceptSteps, getAllConceptSteps, createConceptStep, updateConceptStep, deleteConceptStep,
  getConceptBenefits, getAllConceptBenefits, createConceptBenefit, updateConceptBenefit, deleteConceptBenefit,
  getPageContent, updatePageContent, uploadPhoto } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadAvatar } = require('../config/cloudinary');

// Public read endpoints — no auth required
router.get('/testimonials', getTestimonials);
router.get('/faqs', getFAQs);
router.get('/settings/public', getPublicSettings);
router.get('/team', getTeam);
router.get('/milestones', getMilestones);
router.get('/values', getValues);
router.get('/concept-steps', getConceptSteps);
router.get('/concept-benefits', getConceptBenefits);
router.get('/page-content/:page', getPageContent);

// All routes below require admin authentication
router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);

router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/toggle-status', toggleUserStatus);

router.get('/testimonials/all', getAllTestimonials);
router.post('/testimonials', createTestimonial);
router.put('/testimonials/:id', updateTestimonial);
router.delete('/testimonials/:id', deleteTestimonial);

router.get('/faqs/all', getAllFAQs);
router.post('/faqs', createFAQ);
router.put('/faqs/:id', updateFAQ);
router.delete('/faqs/:id', deleteFAQ);

router.get('/team/all', getAllTeam);
router.post('/team', createTeamMember);
router.put('/team/:id', updateTeamMember);
router.delete('/team/:id', deleteTeamMember);

router.get('/milestones/all', getAllMilestones);
router.post('/milestones', createMilestone);
router.put('/milestones/:id', updateMilestone);
router.delete('/milestones/:id', deleteMilestone);

router.get('/values/all', getAllValues);
router.post('/values', createValue);
router.put('/values/:id', updateValue);
router.delete('/values/:id', deleteValue);

router.get('/concept-steps/all', getAllConceptSteps);
router.post('/concept-steps', createConceptStep);
router.put('/concept-steps/:id', updateConceptStep);
router.delete('/concept-steps/:id', deleteConceptStep);

router.get('/concept-benefits/all', getAllConceptBenefits);
router.post('/concept-benefits', createConceptBenefit);
router.put('/concept-benefits/:id', updateConceptBenefit);
router.delete('/concept-benefits/:id', deleteConceptBenefit);

router.put('/page-content/:page', updatePageContent);

router.post('/upload/photo', uploadAvatar.single('photo'), uploadPhoto);

router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router;
