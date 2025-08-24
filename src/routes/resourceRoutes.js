const express = require('express');
const resourceController = require('../controllers/resourceController');

const router = express.Router();

// GET /api/resources - Get all resources
router.get('/', resourceController.getAllResources);

// POST /api/resources - Create new resource
router.post('/', resourceController.createResource);

// GET /api/resources/type/:type - Get resources by type (specific route first)
router.get('/type/:type', resourceController.getResourcesByType);

// GET /api/resources/:id - Get resource by ID (generic route last)
router.get('/:id', resourceController.getResourceById);

// PUT /api/resources/:id - Update resource
router.put('/:id', resourceController.updateResource);

// DELETE /api/resources/:id - Delete resource
router.delete('/:id', resourceController.deleteResource);

module.exports = router;
