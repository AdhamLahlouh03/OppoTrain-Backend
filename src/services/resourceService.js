const { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp 
} = require('firebase/firestore');
const { db } = require('../config/firebase');
const Resource = require('../models/Resource');

class ResourceService {
  constructor() {
    this.collectionName = 'resources';
  }

  // Get all resources
  async getAllResources() {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const resources = [];
      
      querySnapshot.forEach((doc) => {
        const resource = Resource.fromFirestore(doc);
        resource.id = doc.id;
        resources.push(resource);
      });
      
      return {
        success: true,
        data: resources,
        count: resources.length
      };
    } catch (error) {
      console.error('Error getting resources:', error);
      throw new Error('Failed to fetch resources');
    }
  }

  // Get resource by ID
  async getResourceById(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Resource not found'
        };
      }
      
      const resource = Resource.fromFirestore(docSnap);
      resource.id = docSnap.id;
      
      return {
        success: true,
        data: resource
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
      
      // Add to Firestore
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...resource.toFirestore(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return {
        success: true,
        data: {
          id: docRef.id,
          ...resource.toFirestore()
        },
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

      // Update in Firestore
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      
      // Get updated resource
      const updatedResource = await this.getResourceById(id);
      
      return {
        success: true,
        data: updatedResource.data,
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

      // Delete from Firestore
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      
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
      const q = query(
        collection(db, this.collectionName),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const resources = [];
      
      querySnapshot.forEach((doc) => {
        const resource = Resource.fromFirestore(doc);
        if (resource.type.toLowerCase() === type.toLowerCase()) {
          resource.id = doc.id;
          resources.push(resource);
        }
      });
      
      return {
        success: true,
        data: resources,
        count: resources.length
      };
    } catch (error) {
      console.error('Error getting resources by type:', error);
      throw new Error('Failed to fetch resources by type');
    }
  }
}

module.exports = new ResourceService();
