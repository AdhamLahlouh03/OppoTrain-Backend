const Resource = require('../models/Resource');

class ResourceServiceMock {
  constructor() {
    this.resources = [
      {
        id: '1',
        title: 'Introduction to AI',
        type: 'Youtube Video',
        description: 'Discover the basics of Artificial Intelligence, including key concepts, real-world applications, and how AI is shaping our future.',
        guest: 'Zahaa muhanna',
        websiteUrl: 'https://youtube.com/watch?v=test123',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '2',
        title: 'Python Programming',
        type: 'Course',
        description: 'Learn Python programming from basics to advanced concepts',
        guest: 'John Doe',
        websiteUrl: 'https://course.com/python',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02')
      },
      {
        id: '3',
        title: 'Data Science Fundamentals',
        type: 'Course',
        description: 'Introduction to data science and machine learning',
        guest: 'Jane Smith',
        websiteUrl: 'https://course.com/datascience',
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03')
      }
    ];
    this.nextId = 4;
  }

  // Get all resources
  async getAllResources() {
    try {
      return {
        success: true,
        data: this.resources.map(r => new Resource(r)),
        count: this.resources.length
      };
    } catch (error) {
      console.error('Error getting resources:', error);
      throw new Error('Failed to fetch resources');
    }
  }

  // Get resource by ID
  async getResourceById(id) {
    try {
      const resource = this.resources.find(r => r.id === id);
      
      if (!resource) {
        return {
          success: false,
          error: 'Resource not found'
        };
      }
      
      return {
        success: true,
        data: new Resource(resource)
      };
    } catch (error) {
      console.error('Error getting resource:', error);
      throw new Error('Failed to fetch resource');
    }
  }

  // Create new resource
  async createResource(resourceData) {
    try {
      // Validate the resource data
      const validation = Resource.validate(resourceData);
      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors
        };
      }

      // Create resource instance
      const resource = new Resource(resourceData);
      const newResource = {
        id: this.nextId.toString(),
        ...resource.toFirestore(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      this.resources.push(newResource);
      this.nextId++;
      
      return {
        success: true,
        data: newResource,
        message: 'Resource created successfully'
      };
    } catch (error) {
      console.error('Error creating resource:', error);
      throw new Error('Failed to create resource');
    }
  }

  // Update resource
  async updateResource(id, updateData) {
    try {
      // Check if resource exists
      const existingResource = await this.getResourceById(id);
      if (!existingResource.success) {
        return existingResource;
      }

      // Validate the update data
      const validation = Resource.validate({
        ...existingResource.data,
        ...updateData
      });
      
      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors
        };
      }

      // Update resource
      const resourceIndex = this.resources.findIndex(r => r.id === id);
      this.resources[resourceIndex] = {
        ...this.resources[resourceIndex],
        ...updateData,
        updatedAt: new Date()
      };
      
      return {
        success: true,
        data: new Resource(this.resources[resourceIndex]),
        message: 'Resource updated successfully'
      };
    } catch (error) {
      console.error('Error updating resource:', error);
      throw new Error('Failed to update resource');
    }
  }

  // Delete resource
  async deleteResource(id) {
    try {
      // Check if resource exists
      const existingResource = await this.getResourceById(id);
      if (!existingResource.success) {
        return existingResource;
      }

      // Delete resource
      this.resources = this.resources.filter(r => r.id !== id);
      
      return {
        success: true,
        message: 'Resource deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw new Error('Failed to delete resource');
    }
  }

  // Get resources by type
  async getResourcesByType(type) {
    try {
      const filteredResources = this.resources.filter(
        r => r.type.toLowerCase() === type.toLowerCase()
      );
      
      return {
        success: true,
        data: filteredResources.map(r => new Resource(r)),
        count: filteredResources.length
      };
    } catch (error) {
      console.error('Error getting resources by type:', error);
      throw new Error('Failed to fetch resources by type');
    }
  }
}

module.exports = new ResourceServiceMock();
