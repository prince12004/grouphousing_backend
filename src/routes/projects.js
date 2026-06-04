const express = require('express');
const router = express.Router();
const { getProjects, getProject, getFeaturedProjects, getCities, getSimilarProjects, createProject, updateProject, deleteProject, approveProject, uploadImages, getAllProjectsAdmin } = require('../controllers/projectController');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getProjects);
router.get('/featured', getFeaturedProjects);
router.get('/cities', getCities);
router.get('/admin/all', protect, adminOnly, getAllProjectsAdmin);
router.get('/:slug', optionalAuth, getProject);
router.get('/:id/similar', getSimilarProjects);

router.post('/', protect, adminOnly, createProject);
router.put('/:id', protect, adminOnly, updateProject);
router.delete('/:id', protect, adminOnly, deleteProject);
router.patch('/:id/approve', protect, adminOnly, approveProject);
router.post('/:id/images', protect, adminOnly, upload.array('images', 10), uploadImages);

module.exports = router;
