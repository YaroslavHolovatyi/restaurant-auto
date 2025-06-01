# Restaurant Automation System

A modern web application for restaurant management, built with React, TypeScript, and Node.js.

## Features

### Menu Management
- Create, update, and delete menu items
- Upload and manage item images
- Categorize items (Burgers, Extras, Salads, Fries, Sauces, Drinks)
- Mark items as new or available/unavailable
- Set prices and descriptions
- Specify item weights

### User Management
- Role-based access control (Admin, Chef, Waiter)
- Secure authentication using JWT
- User profile management

### Order Management
- Real-time order tracking
- Table management
- Order status updates (Ordered, Cooking, Ready)
- Cart functionality

## Tech Stack

### Frontend
- React 19
- TypeScript
- Material-UI (MUI)
- Redux Toolkit for state management
- React Router for navigation
- i18next for internationalization
- Axios for API requests

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads

## Project Structure

```
restaurant-auto/
├── src/                    # Frontend source code
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── store/            # Redux store configuration
│   ├── schemas/          # TypeScript interfaces and types
│   ├── assets/           # Static assets
│   └── i18n/             # Internationalization files
│
├── backend/              # Backend source code
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── uploads/         # Uploaded files
│
└── public/              # Public static files
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd restaurant-auto
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Create a `.env` file in the backend directory:
```
MONGODB_URI=mongodb://localhost:27017/BoomerBurger
JWT_SECRET=your-secret-key
PORT=5000
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd ..
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Menu Items
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Create a new menu item
- `PUT /api/menu/:id` - Update a menu item
- `DELETE /api/menu/:id` - Delete a menu item

### Authentication
- `POST /api/staff/login` - Staff login
- `POST /api/staff/register` - Register new staff member

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id` - Update order status

## Security

- JWT-based authentication
- Role-based access control
- Secure file upload handling
- Input validation and sanitization

## File Upload

The system supports image uploads for menu items:
- Supported formats: JPG, JPEG, PNG
- Files are stored in `backend/uploads/menu`
- Maximum file size: 5MB
- Images are served statically from `/uploads/menu/[filename]`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
