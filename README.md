
# FullStack Media Collection Manager

**FullStack Media Collection Manager** is a scalable, modern full-stack web application for managing collections of **books, movies, and games**.  
The app allows users to add, edit, delete, and analyze their media assets with a clean interface and robust backend.  
It is designed with **modularity, testability, and best software development practices** in mind.

---

## 📑 Table of Contents
- [Features](#features)  
- [Technologies & Architecture](#technologies--architecture)  
- [Installation & Setup](#installation--setup)  
- [Usage](#usage)  
- [API Documentation](#api-documentation)  
- [Testing](#testing)  
---

## ✨ Features
- Manage separate collections for **books, movies, and games**.  
- Perform full **CRUD operations**: add, list, update, and delete media items.  
- **Image upload** support for media items (both base64 and file upload).  
- Interactive **dashboard with statistics** by category, genre, and status.  
- Comprehensive **test infrastructure** for both backend and frontend.  
- Responsive, modern **UI with real-time updates**.  
- RESTful API architecture.  
- Modular, easily extensible structure.  

---

## 🏗 Technologies & Architecture

### 🔹 Backend
- **Node.js** & **Express.js** → scalable server and REST API  
- **MongoDB** → flexible NoSQL storage  
- **dotenv** → environment variables  
- **CORS** → secure cross-origin requests  
- **Jest** → unit and integration testing  
- **Playwright** → end-to-end testing  

### 🔹 Frontend
- **React.js** (functional components + hooks)  
- **Context API** → global state management  
- **Chart.js** (or similar) → dynamic data visualization  
- **Axios** or **Fetch API** → API communication  
- **Jest** → frontend unit testing  
- **Playwright** → end-to-end UI testing  

---

## ⚙ Installation & Setup

### ✅ Requirements
- **Node.js** (v18 or higher)  
- **MongoDB** (local or cloud)  
- **npm** or **yarn**  

### 🔑 Environment Variables
Create a `.env` file in the project root:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017
```
### 🔹 Backend Setup

```bash
cd backend
npm install
npm start
```
- The backend API will be available at:http://localhost:5000

### 🔹 Frontend Setup

```bash
cd ..
npm install
npm start
```

## 🚀 Usage

- Select a collection (books, movies, or games) from the main menu.
- Use the Add button to create new media items.
- Edit or delete items with controls on each media card.
- View interactive charts & statistics on dashboard pages.
- Upload images for book covers, movie posters, or game artwork.
---
## 📡 API Documentation
### Main Endpoints
```http
GET    /api/books        → List all books
POST   /api/books        → Add a new book
PUT    /api/books/:id    → Update a book
DELETE /api/books/:id    → Delete a book
```
- The same structure applies to /api/movies and /api/games.

### Upload Endpoints
```http
POST /api/uploads
```
- Accepts images (base64 or file upload).
- Returns uploaded file path or encoded string.
- All endpoints use JSON format.
- For detailed request/response examples, check the backend route files.
---
## 🧪 Testing
- **Backend tests:** in /test, using Jest (unit + integration).
- **Frontend tests:** using Jest + Playwright.
- **End-to-End tests:** simulate real user scenarios.
- All tests are CI/CD ready for automated quality assurance.

Run tests:
```bash
npm test
```
Run Playwright E2E tests:
```bash
npx playwright test
```
