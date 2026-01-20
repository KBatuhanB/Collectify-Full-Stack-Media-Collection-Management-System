# Collectify: Full-Stack Media Collection Management System

<img width="1999" height="1116" alt="kapak2" src="https://github.com/user-attachments/assets/9c9babfa-6653-4c6a-9773-4c56fdb129f5" />
<img width="1829" height="1029" alt="moviepanel" src="https://github.com/user-attachments/assets/4b4dd9b8-ee0f-4646-8928-5d2922ee567d" />
<img width="1829" height="1029" alt="dashboard2" src="https://github.com/user-attachments/assets/ec242ded-cfc5-4a57-b5a9-b8addf924ed6" />
<img width="1829" height="1029" alt="dashboard" src="https://github.com/user-attachments/assets/d831162e-9b9a-4715-b792-b0013d5c3f37" />


**A comprehensive web application demonstrating modern full-stack development practices**

> **Computer Engineering Portfolio Project** - Showcasing proficiency in React.js, Node.js, MongoDB, and modern web development methodologies.

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.17.0-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 🎯 Project Overview

This project demonstrates advanced full-stack development skills through a comprehensive media collection management system. Built as part of my computer engineering studies, it showcases modern web development patterns, database design, API architecture, and user experience principles.

**Key Learning Objectives Achieved:**
- Full-stack application architecture and design patterns
- RESTful API development and database integration
- Modern React.js with hooks and context management
- Responsive UI/UX design with Material-UI
- Comprehensive testing strategies (Unit, Integration, E2E)
- Version control and project documentation

---

## 📋 Table of Contents

- [Technical Architecture](#-technical-architecture)
- [Core Features](#-core-features)
- [Technology Stack](#-technology-stack)
- [Development Practices](#-development-practices)
- [Installation & Setup](#-installation--setup)
- [API Documentation](#-api-documentation)
- [Testing Strategy](#-testing-strategy)
- [Performance & Optimization](#-performance--optimization)
- [Learning Outcomes](#-learning-outcomes)

---

## 🏗️ Technical Architecture

### **System Design**
The application follows a **3-tier architecture** pattern with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │    │   Application   │    │   Data Layer    │
│     Layer       │    │     Layer       │    │                 │
│                 │    │                 │    │                 │
│  React.js +     │◄──►│  Node.js +      │◄──►│  MongoDB +      │
│  Material-UI    │    │  Express.js     │    │  Native Driver  │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Design Patterns Implemented**
- **Repository Pattern**: Abstracted data access layer
- **Context Provider Pattern**: Centralized state management
- **Component Composition**: Reusable UI components
- **RESTful API Design**: Standardized endpoint structure
- **MVC Architecture**: Model-View-Controller separation

---

## ✨ Core Features

### **Advanced Frontend Development**
- **Dynamic Theme System**: Custom Material-UI theming with dark/light mode
- **Responsive Design**: Mobile-first approach with breakpoint management
- **State Management**: React Context API for global state
- **Component Architecture**: Modular, reusable component library
- **Performance Optimization**: Lazy loading and memoization techniques

### **Backend Engineering**
- **RESTful API**: Complete CRUD operations with proper HTTP methods
- **Database Design**: Normalized MongoDB schema with efficient indexing
- **File Upload System**: Multer integration for image processing
- **Error Handling**: Comprehensive error middleware and validation
- **Security**: CORS implementation and input sanitization

### **Data Visualization & Analytics**
- **Interactive Charts**: Chart.js integration with real-time updates
- **Statistical Analysis**: Data aggregation and trend visualization
- **Dynamic Dashboards**: Responsive chart layouts with multiple chart types

### **Quality Assurance**
- **Unit Testing**: Jest-based component and function testing
- **Integration Testing**: API endpoint and database integration tests
- **E2E Testing**: Playwright automation for user workflow validation
- **Code Coverage**: Comprehensive test coverage reporting

---

## 🚀 Technology Stack

### **Frontend Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| React.js | 19.1.0 | Component-based UI framework |
| Material-UI | 7.2.0 | Design system and component library |
| Chart.js | 4.5.0 | Data visualization and analytics |
| Axios | 1.10.0 | HTTP client for API communication |
| React Hooks | - | Modern state and lifecycle management |

### **Backend Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | JavaScript runtime environment |
| Express.js | 4.18.2 | Web application framework |
| MongoDB | 6.17.0 | NoSQL database |
| Multer | 2.0.1 | File upload middleware |
| CORS | 2.8.5 | Cross-origin resource sharing |

### **Development & Testing Tools**
| Tool | Purpose |
|------|---------|
| Jest | Unit and integration testing |
| Playwright | End-to-end testing |
| Babel | JavaScript compilation |
| ESLint | Code quality and formatting |
| Nodemon | Development server auto-restart |

---

## 🛠️ Development Practices

### **Code Quality Standards**
- **ES6+ JavaScript**: Modern syntax and features
- **Component-Based Architecture**: Modular and reusable code structure
- **Clean Code Principles**: Readable, maintainable codebase
- **Error Boundary Implementation**: Graceful error handling
- **Performance Optimization**: Lazy loading and code splitting

### **Version Control & Documentation**
- **Git Workflow**: Feature branching and semantic commits
- **Code Documentation**: Comprehensive inline documentation
- **API Documentation**: Detailed endpoint specifications
- **README Standards**: Professional project documentation

### **Testing Methodology**
- **Test-Driven Development**: Tests written alongside features
- **Coverage Targets**: Minimum 80% code coverage
- **Automated Testing**: CI/CD integration ready
- **Cross-Browser Testing**: Multi-platform compatibility

---

## 🔹 Installation & Setup

### **Prerequisites**
- Node.js (v18.0.0 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager
- Git for version control

### **Environment Configuration**
Create a `.env` file in the project root:

```env
# Server Configuration
PORT=5000
MONGODB_URI=mongodb://localhost:27017

# Frontend Configuration  
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_API_TIMEOUT=10000
```

### **Quick Start Guide**

**1. Clone the Repository**
```bash
git clone https://github.com/KBatuhanB/Collectify-Books-Movies-Games-Collection-Manager-Full-Stack-.git
cd fullstack-app
```

**2. Backend Setup**
```bash
cd backend
npm install
npm start
# Backend API available at: http://localhost:5000
```

**3. Frontend Setup**
```bash
cd ..
npm install  
npm start
# Frontend app available at: http://localhost:3000
```

**4. Run Tests**
```bash
# Unit & Integration Tests
npm test

# End-to-End Tests  
npx playwright test

# Coverage Report
npm run test:coverage
```

---

## 📡 API Documentation

### **RESTful API Endpoints**

#### **Books Management**
```
GET    /api/books        # Retrieve all books
POST   /api/books        # Create new book
PUT    /api/books/:id    # Update existing book
DELETE /api/books/:id    # Delete book
```

#### **Movies/Series Management**
```
GET    /api/movies       # Retrieve all movies/series
POST   /api/movies       # Create new movie/series
PUT    /api/movies/:id   # Update existing movie/series
DELETE /api/movies/:id   # Delete movie/series
```

#### **Games Management**
```
GET    /api/games        # Retrieve all games
POST   /api/games        # Create new game
PUT    /api/games/:id    # Update existing game
DELETE /api/games/:id    # Delete game
```

#### **File Upload**
```
POST   /api/uploads      # Upload media files (images)
```

### **Request/Response Examples**

**Create Book Request:**
```json
{
  "title": "The Pragmatic Programmer",
  "author": "David Thomas",
  "genre": "Programming",
  "status": "reading",
  "rating": 5,
  "year": 1999,
  "comment": "Essential read for developers"
}
```

**API Response Format:**
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "title": "The Pragmatic Programmer", 
  "author": "David Thomas",
  "genre": "Programming",
  "status": "reading",
  "rating": 5,
  "year": 1999,
  "comment": "Essential read for developers",
  "createdAt": "2021-07-21T10:30:00.000Z",
  "updatedAt": "2021-07-21T10:30:00.000Z"
}
```

---

## 🧪 Testing Strategy

### **Multi-Level Testing Approach**

#### **Unit Testing (Jest)**
- **Component Testing**: Individual React component functionality
- **Function Testing**: Utility functions and business logic
- **API Testing**: Backend endpoint validation
- **Coverage Target**: 80%+ code coverage

#### **Integration Testing**
- **Database Integration**: MongoDB connection and CRUD operations
- **API Integration**: Frontend-backend communication
- **Component Integration**: React component interaction

#### **End-to-End Testing (Playwright)**
- **User Journey Testing**: Complete workflow simulation
- **Cross-Browser Testing**: Chrome, Firefox, Safari compatibility
- **Mobile Responsiveness**: Touch and mobile interaction testing

### **Test Execution Commands**
```bash
# Run all unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run all test suites
npm run test:all
```

---

## ⚡ Performance & Optimization

### **Frontend Optimizations**
- **Code Splitting**: Dynamic imports for reduced bundle size
- **Lazy Loading**: Component-level lazy loading
- **Memoization**: React.memo and useMemo implementations
- **Image Optimization**: Compressed image handling

### **Backend Optimizations**
- **Database Indexing**: Optimized MongoDB queries
- **Response Caching**: Efficient data retrieval
- **Error Handling**: Graceful error management
- **Request Validation**: Input sanitization and validation

### **Performance Metrics**
- **Bundle Size**: Optimized webpack builds
- **Load Time**: Fast initial page load
- **Runtime Performance**: Smooth user interactions
- **Memory Usage**: Efficient memory management

---

## 📚 Learning Outcomes

### **Technical Skills Demonstrated**
- **Full-Stack Development**: End-to-end application development
- **Modern JavaScript**: ES6+ features and best practices
- **React Ecosystem**: Hooks, Context, Component patterns
- **Backend Development**: RESTful API design and implementation
- **Database Management**: NoSQL database design and optimization
- **Testing Methodologies**: Comprehensive testing strategies

### **Software Engineering Principles**
- **Clean Code**: Readable and maintainable code structure
- **SOLID Principles**: Object-oriented design patterns
- **Agile Development**: Iterative development approach
- **Version Control**: Git workflow and collaboration
- **Documentation**: Technical writing and project documentation

### **Industry-Relevant Skills**
- **Problem Solving**: Complex technical challenge resolution
- **Code Review**: Peer review and quality assurance
- **Performance Optimization**: Application performance tuning
- **User Experience**: UI/UX design principles
- **Project Management**: Planning and execution of technical projects

---

##  🚀Developer Information

**Developed by**: Kelami Batuhan Bölükbaşı 
**Purpose**: Portfolio project demonstrating full-stack development expertise  

### **Connect & Collaborate**
- **GitHub**: [View Source Code](https://github.com/KBatuhanB/Collectify-Books-Movies-Games-Collection-Manager-Full-Stack-)
- **LinkedIn**: [Open to discussing technical implementation and career opportunities](https://www.linkedin.com/in/batuhan-b%C3%B6l%C3%BCkba%C5%9F%C4%B1-45b2b726b/)
- **Email**: batuhankelami@gmail.com

---


---

**Built with modern web technologies as a demonstration of full-stack development capabilities in computer engineering education.**
