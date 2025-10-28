# 📚 WebBookStore

A secure web application for managing and exploring books with user authentication.

## Features

- 🔐 User Authentication (Register/Login)
- 📖 Book Management System
- 🎨 Modern, Responsive UI
- 🔒 JWT-based Security
- 📱 Mobile-Friendly Design

## Tech Stack

- **Frontend:**
  - HTML5
  - CSS3 (with animations and responsive design)
  - JavaScript (Vanilla JS for API interactions)

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - JWT for authentication
  - bcrypt for password hashing

## API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /login` - User login

### Books
- `GET /books` - Get all books (protected)
- `GET /getbook` - Get specific book by title (protected)
- `POST /addbook` - Add new book (protected)
- `PUT /updatebook/:title` - Update book details (protected)
- `DELETE /deletebook` - Delete a book (protected)

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jaya-P280/WebBookStore.git
   cd WebBookStore
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   JWT_KEY=your_secret_key_here
   ```

4. Start MongoDB service on your machine:
   ```bash
   # Windows
   net start MongoDB

   # macOS/Linux
   sudo service mongod start
   ```

5. Run the application:
   ```bash
   npm start
   ```

6. Visit http://localhost:3000 in your browser

## Project Structure

```
├── public/                # Static files
│   ├── css/              # Stylesheets
│   │   ├── book.css      # Book listing styles
│   │   ├── login.css     # Login page styles
│   │   ├── register.css  # Registration page styles
│   │   └── style.css     # Common styles
│   ├── 401.html         # Unauthorized access page
│   ├── books.html       # Book listing page
│   ├── index.html       # Landing page
│   ├── login.html      # Login page
│   ├── register.html   # Registration page
│   └── script.js       # Client-side JavaScript
├── Server.js           # Express server and API routes
├── package.json        # Project dependencies
└── .gitignore         # Git ignore rules
```

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes
- Secure session management
- XSS protection through input sanitization

## License

This project is licensed under the ISC License.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request