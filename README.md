# Restaurant Automation System

A comprehensive restaurant management application with role-based access control, real-time order tracking, and complete workflow management. Built with React, TypeScript, Node.js, and MongoDB.

## 🌟 Key Features

### 👥 Role-Based Management System
- **Admin**: Full system access, user management, table status control
- **Waiter**: Order creation, cart management, table status updates, order viewing
- **Cook**: Order status management (ordered → cooking → ready), kitchen workflow

### 🍽️ Advanced Menu Management
- Create, update, and delete menu items with rich details
- Image upload and management for menu items
- Category organization (Burgers, Extras, Salads, Fries, Sauces, Drinks)
- Real-time availability status
- Price and weight specifications
- Multi-language support (English/Ukrainian)

### 📋 Comprehensive Order Management
- **Order Creation**: Waiters can create orders with table selection
- **Status Tracking**: Real-time order status updates through the workflow
- **Kitchen Integration**: Cooks manage order progression
- **Order History**: Complete order tracking and management

### 🏠 Table Management
- 20 tables with configurable status (free, occupied, booked)
- Visual table status indicators
- Admin and waiter table status control
- Real-time table availability tracking

### 🛒 Smart Cart System
- Role-based cart functionality (waiters only)
- Table selection for order placement
- Quantity management and item removal
- Order completion workflow

## 🚀 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Material-UI (MUI)** for modern UI components
- **Redux Toolkit** for state management
- **React Router** for navigation
- **i18next** for internationalization
- **CSS3** with responsive design

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** authentication and authorization
- **Multer** for file uploads
- **CORS** enabled for cross-origin requests

## 🏗️ System Architecture

### Database Models

#### Staff Model
```javascript
{
  name: String,
  username: String (unique),
  password: String (hashed),
  role: String (admin|waiter|cook),
  createdAt: Date
}
```

#### Table Model
```javascript
{
  number: Number (unique),
  seats: Number,
  status: String (free|occupied|booked)
}
```

#### Order Model
```javascript
{
  tableNumber: Number,
  items: [{
    name: String,
    price: Number,
    quantity: Number
  }],
  waiterId: String,
  status: String (ordered|cooking|ready),
  createdAt: Date
}
```

#### Dish Model
```javascript
{
  name: String,
  weight: String,
  price: Number,
  currency: String,
  category: String,
  available: Boolean,
  isNew: Boolean,
  image_url: String,
  description: String
}
```

### Order Workflow

1. **Order Creation** (Waiter Role)
   - Add items to cart from menu
   - Select target table
   - Complete order placement
   - Status: `ordered`

2. **Kitchen Processing** (Cook Role)
   - View incoming orders
   - Start cooking: `ordered` → `cooking`
   - Complete cooking: `cooking` → `ready`

3. **Order Completion**
   - Ready orders available for pickup
   - Order history maintained

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Environment Setup

1. **Clone the repository**
```bash
git clone [repository-url]
cd restaurant-auto
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create .env file
echo "MONGODB_URI=mongodb://localhost:27017/BoomerBurger
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000" > .env
```

3. **Frontend Setup**
```bash
cd ..
npm install
```

4. **Database Initialization**
```bash
cd backend

# Seed initial data
node seedStaff.js      # Creates default staff users
node createAdminUser.js # Creates admin user
```

### Running the Application

#### Development Mode

1. **Start Backend Server**
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

2. **Start Frontend Development Server**
```bash
cd ..
npm run dev
# Application runs on http://localhost:5173
```

#### Production Mode
```bash
# Build frontend
npm run build

# Serve built files (configure your web server)
```

## 🔐 Authentication & Authorization

### Default Users
After running the seed scripts:

- **Admin**: `admin` / `admin123`
- **Waiter**: `waiter1` / `waiter123`
- **Cook**: `cook1` / `cook123`

### Role Permissions

| Feature | Admin | Waiter | Cook |
|---------|-------|--------|------|
| View Menu | ✅ | ✅ | ✅ |
| Add to Cart | ❌ | ✅ | ❌ |
| Place Orders | ❌ | ✅ | ❌ |
| Change Order Status | ❌ | ❌ | ✅ |
| Manage Tables | ✅ | ✅ | ❌ |
| View Orders | ✅ | ✅ | ✅ |
| User Management | ✅ | ❌ | ❌ |
| Menu Management | ✅ | ❌ | ❌ |

## 🌐 API Documentation

### Authentication Endpoints
```http
POST /api/staff/login
POST /api/staff/register (Admin only)
```

### Menu Management
```http
GET    /api/menu              # Get all menu items
POST   /api/menu              # Create menu item (Admin)
PUT    /api/menu/:id          # Update menu item (Admin)
DELETE /api/menu/:id          # Delete menu item (Admin)
```

### Order Management
```http
GET    /api/orders            # Get all orders
POST   /api/orders            # Create new order (Waiter)
PUT    /api/orders/:id        # Update order status (Cook)
DELETE /api/orders/:id        # Delete order (Admin)
```

### Table Management
```http
GET    /api/tables            # Get all tables
PUT    /api/tables/:id        # Update table status (Admin/Waiter)
```

### File Upload
```http
POST   /api/menu/upload       # Upload menu item image
```

## 📱 User Interface

### Navigation Structure
- **Main Page**: Restaurant overview and featured items
- **Menu Page**: Complete menu with filtering and cart functionality
- **Tables Page**: Table management and order status tracking
- **Orders Page**: Complete order management dashboard
- **Profile Page**: User account management

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Accessible design patterns

## 🔧 Development Guidelines

### Code Structure
```
src/
├── components/           # Reusable UI components
│   ├── Auth/            # Authentication components
│   ├── Cart/            # Shopping cart functionality
│   ├── Navbar/          # Navigation components
│   └── SideMenu/        # Side navigation
├── pages/               # Page-level components
├── store/               # Redux store and slices
├── schemas/             # TypeScript type definitions
├── assets/              # Static assets
└── utils/               # Utility functions
```

### Best Practices
- TypeScript for type safety
- Redux Toolkit for state management
- Material-UI for consistent design
- Error handling and validation
- Responsive design principles

## 🧪 Testing

### Manual Testing Workflow

1. **Authentication Testing**
   - Login with different roles
   - Verify role-based access restrictions

2. **Order Management Testing**
   - Create orders as waiter
   - Update order status as cook
   - Verify order tracking

3. **Table Management Testing**
   - Update table statuses
   - Verify status persistence

## 🚀 Deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] Database connection secured
- [ ] JWT secrets updated
- [ ] File upload permissions set
- [ ] CORS origins configured
- [ ] Build frontend for production
- [ ] Configure reverse proxy (nginx/Apache)
- [ ] SSL certificate installed

### Environment Variables
```bash
# Backend .env
MONGODB_URI=mongodb://your-mongo-uri
JWT_SECRET=your-production-jwt-secret
PORT=5000
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Setup for Contributors
```bash
# Install dependencies
npm install
cd backend && npm install

# Run in development mode
npm run dev          # Frontend
npm run dev:backend  # Backend with nodemon
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Review the troubleshooting guide below

### Common Issues

**Login Issues**
- Verify database connection
- Check if user exists in database
- Ensure JWT secret is configured

**Order Not Updating**
- Verify user role permissions
- Check network requests in browser dev tools
- Confirm backend server is running

**File Upload Problems**
- Check file size limits (5MB max)
- Verify supported formats (JPG, JPEG, PNG)
- Ensure uploads directory exists and is writable

---

Built with ❤️ for modern restaurant management
