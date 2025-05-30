# First Reference API

This is the backend API for the First Reference website, handling user authentication and order management.

## Setup Instructions

1. Create a virtual environment:

```bash
python -m venv venv
```

2. Activate the virtual environment:

- Windows:

```bash
venv\Scripts\activate
```

- Unix/MacOS:

```bash
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the api directory with the following content:

```
JWT_SECRET_KEY=your-super-secret-key-change-this-in-production
FLASK_ENV=development
FLASK_APP=app.py
```

5. Run the application:

```bash
flask run
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication

- POST `/api/register` - Register a new user
- POST `/api/login` - Login user
- GET `/api/user` - Get user profile (requires authentication)

### Orders

- POST `/api/orders` - Create a new order (requires authentication)
- GET `/api/orders` - Get all orders for the authenticated user
- GET `/api/orders/<order_id>` - Get specific order details (requires authentication)

## Database

The application uses SQLite as the database. The database file will be created automatically when you first run the application.

## Security Notes

1. Change the `JWT_SECRET_KEY` in production
2. Use HTTPS in production
3. Implement rate limiting
4. Add input validation
5. Add proper error handling
6. Implement CSRF protection
