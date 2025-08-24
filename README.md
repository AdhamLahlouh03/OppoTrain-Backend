# OppoTrain Backend - Resources Management API

A Node.js backend API for managing resources, built with Express.js and Firebase Firestore.

## 🚀 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** Firebase Firestore (NoSQL)
- **Authentication:** Firebase (ready for future implementation)
- **Validation:** Custom validation middleware
- **Error Handling:** Comprehensive error handling with proper HTTP status codes

## 📋 Features

- **CRUD Operations** for Resources
- **Data Validation** with custom middleware
- **Error Handling** with proper HTTP status codes
- **RESTful API** design
- **Firebase Integration** with Firestore
- **Health Check** endpoint

## 🏗️ Project Structure

```
src/
├── app.js                 # Main server file
├── config/
│   └── firebase.js       # Firebase configuration
├── controllers/
│   └── resourceController.js  # Resource HTTP handlers
├── middlewares/
│   └── validationMiddleware.js # Request validation
├── models/
│   └── Resource.js       # Resource data model
├── routes/
│   └── resourceRoutes.js # API routes
└── services/
    └── resourceService.js # Business logic & database operations
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project with Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd OppoTrain-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   NODE_ENV=development
   ```

4. **Firebase Configuration**
   The Firebase configuration is already set up in `src/config/firebase.js`

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Health Check
```
GET /health
```

### Resources Endpoints

#### 1. Get All Resources
```
GET /api/resources
```
**Response:**
```json
{
  "success": true,
  "message": "Resources retrieved successfully",
  "data": [...],
  "count": 5
}
```

#### 2. Get Resource by ID
```
GET /api/resources/:id
```
**Response:**
```json
{
  "success": true,
  "message": "Resource retrieved successfully",
  "data": {
    "id": "resource_id",
    "title": "Introduction to AI",
    "type": "Youtube Video",
    "description": "Learn the basics of AI",
    "guest": "John Doe",
    "websiteUrl": "https://youtube.com/watch?v=...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 3. Create New Resource
```
POST /api/resources
```
**Request Body:**
```json
{
  "title": "Introduction to AI",
  "type": "Youtube Video",
  "description": "Learn the basics of AI",
  "guest": "John Doe",
  "websiteUrl": "https://youtube.com/watch?v=..."
}
```
**Response:**
```json
{
  "success": true,
  "message": "Resource created successfully",
  "data": {
    "id": "generated_id",
    "title": "Introduction to AI",
    "type": "Youtube Video",
    "description": "Learn the basics of AI",
    "guest": "John Doe",
    "websiteUrl": "https://youtube.com/watch?v=...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 4. Update Resource
```
PUT /api/resources/:id
```
**Request Body:**
```json
{
  "title": "Updated AI Introduction",
  "description": "Updated description"
}
```

#### 5. Delete Resource
```
DELETE /api/resources/:id
```
**Response:**
```json
{
  "success": true,
  "message": "Resource deleted successfully"
}
```

#### 6. Get Resources by Type
```
GET /api/resources/type/:type
```
**Example:** `GET /api/resources/type/Youtube%20Video`

## 📊 Resource Model

### Required Fields
- **title** (string): Resource title
- **type** (string): Resource type (e.g., "Youtube Video", "Course", "Google Drive")
- **description** (string): Resource description
- **guest** (string): Speaker/author name

### Optional Fields
- **websiteUrl** (string): URL starting with "https://"

### Auto-generated Fields
- **createdAt** (timestamp): Creation date
- **updatedAt** (timestamp): Last update date
- **id** (string): Unique identifier

## 🔒 Validation Rules

- All required fields must be provided
- Website URL must start with "https://" if provided
- Title, type, description, and guest cannot be empty
- Resource ID must be valid for update/delete operations

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

### HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **404**: Not Found
- **500**: Internal Server Error

## 🧪 Testing the API

### Using cURL

1. **Get all resources:**
   ```bash
   curl http://localhost:3000/api/resources
   ```

2. **Create a resource:**
   ```bash
   curl -X POST http://localhost:3000/api/resources \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Test Resource",
       "type": "Course",
       "description": "Test description",
       "guest": "Test Guest"
     }'
   ```

3. **Update a resource:**
   ```bash
   curl -X PUT http://localhost:3000/api/resources/RESOURCE_ID \
     -H "Content-Type: application/json" \
     -d '{"title": "Updated Title"}'
   ```

4. **Delete a resource:**
   ```bash
   curl -X DELETE http://localhost:3000/api/resources/RESOURCE_ID
   ```

### Using Postman

Import the following collection structure:
- **GET** `/api/resources` - Get all resources
- **POST** `/api/resources` - Create resource
- **GET** `/api/resources/:id` - Get resource by ID
- **PUT** `/api/resources/:id` - Update resource
- **DELETE** `/api/resources/:id` - Delete resource
- **GET** `/api/resources/type/:type` - Get resources by type

## 🔮 Future Enhancements

- [ ] Authentication & Authorization
- [ ] File upload support
- [ ] Search and filtering
- [ ] Pagination
- [ ] Rate limiting
- [ ] Logging and monitoring
- [ ] Unit and integration tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.
