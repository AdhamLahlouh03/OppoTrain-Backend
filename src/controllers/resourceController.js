// const resourceService = require('../services/resourceService'); // Commented out for testing
const resourceService = require('../services/resourceService');
class ResourceController {
  // Get all resources
  async getAllResources(req, res) {
    try {
      const result = await resourceService.getAllResources();
      
      if (result.success) {
        res.status(200).json({
          success: true,
          message: 'Resources retrieved successfully',
          data: result.data,
          count: result.count
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.error
        });
      }
    } catch (error) {
      console.error('Controller error - getAllResources:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get resource by ID
  async getResourceById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Resource ID is required'
        });
      }

      const result = await resourceService.getResourceById(id);
      
      if (result.success) {
        res.status(200).json({
          success: true,
          message: 'Resource retrieved successfully',
          data: result.data
        });
      } else {
        res.status(404).json({
          success: false,
          message: result.error
        });
      }
    } catch (error) {
      console.error('Controller error - getResourceById:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Create new resource
  async createResource(req, res) {
    try {
      const resourceData = req.body;
      
      if (!resourceData || Object.keys(resourceData).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Resource data is required'
        });
      }

      const result = await resourceService.createResource(resourceData);
      
      if (result.success) {
        res.status(201).json({
          success: true,
          message: result.message,
          data: result.data
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: result.errors
        });
      }
    } catch (error) {
      console.error('Controller error - createResource:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Update resource
  async updateResource(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Resource ID is required'
        });
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Update data is required'
        });
      }

      const result = await resourceService.updateResource(id, updateData);
      
      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message,
          data: result.data
        });
      } else {
        if (result.error === 'Resource not found') {
          res.status(404).json({
            success: false,
            message: result.error
          });
        } else {
          res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: result.errors
          });
        }
      }
    } catch (error) {
      console.error('Controller error - updateResource:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Delete resource
  async deleteResource(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Resource ID is required'
        });
      }

      const result = await resourceService.deleteResource(id);
      
      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message
        });
      } else {
        res.status(404).json({
          success: false,
          message: result.error
        });
      }
    } catch (error) {
      console.error('Controller error - deleteResource:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get resources by type
  async getResourcesByType(req, res) {
    try {
      const { type } = req.params;
      
      if (!type) {
        return res.status(400).json({
          success: false,
          message: 'Resource type is required'
        });
      }

      const result = await resourceService.getResourcesByType(type);
      
      if (result.success) {
        res.status(200).json({
          success: true,
          message: `Resources of type '${type}' retrieved successfully`,
          data: result.data,
          count: result.count
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.error
        });
      }
    } catch (error) {
      console.error('Controller error - getResourcesByType:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = new ResourceController();
