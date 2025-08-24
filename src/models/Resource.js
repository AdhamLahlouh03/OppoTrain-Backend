class Resource {
  constructor(data) {
    this.title = data.title;
    this.type = data.type;
    this.description = data.description;
    this.guest = data.guest;
    this.websiteUrl = data.websiteUrl || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Validate resource data
  static validate(data) {
    const errors = [];

    if (!data.title || data.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (!data.type || data.type.trim().length === 0) {
      errors.push('Type is required');
    }

    if (!data.description || data.description.trim().length === 0) {
      errors.push('Description is required');
    }

    if (!data.guest || data.guest.trim().length === 0) {
      errors.push('Guest is required');
    }

    // Validate website URL format if provided
    if (data.websiteUrl && data.websiteUrl.trim().length > 0) {
      const urlPattern = /^https:\/\/.+/;
      if (!urlPattern.test(data.websiteUrl)) {
        errors.push('Website URL must start with https://');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Convert to Firestore document
  toFirestore() {
    return {
      title: this.title.trim(),
      type: this.type.trim(),
      description: this.description.trim(),
      guest: this.guest.trim(),
      websiteUrl: this.websiteUrl.trim(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Create from Firestore document
  static fromFirestore(doc) {
    const data = doc.data();
    return new Resource({
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    });
  }
}

module.exports = Resource;
