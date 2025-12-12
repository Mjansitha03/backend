## Reset Password Flow - Backend

Simple Node.js backend for user authentication and password reset.

This API supports:
- Sign up and sign in
- JWT-based authentication
- Password reset via email with token + expiry
- MongoDB (Mongoose) data store


## Tech Stack

- Node.js, Express
- MongoDB, Mongoose
- JWT, bcrypt, nodemailer
- dotenv for configuration


## Repository Layout (backend)

```
backend/
├─ Controllers/
│  └─ authController.js      # signup, signin, forgot/reset 
├─ Models/
│  └─ userSchema.js          # user model
├─ Utils/
│  └─ mailer.js              # helper for sending emails
├─ Database/
│  └─ dbConfig.js            # mongoose connection
├─ Routes/
│  └─ authRoute.js           # auth endpoints
├─ index.js                  # server entrypoint
├─ package.json
└─ .env
```

---

## Repository

GitHub: https://github.com/<your-username>/Reset_Password_Flo


## Quick Start

Prerequisites:
- Node.js (16+)
- MongoDB or a connection string (Atlas or local)

Install and run:

```bash
cd backend
npm install

npm run dev
```

The API defaults to http://localhost:3000 unless you override PORT in .env.


## Environment Variables (.env)

Create a `.env` file at the root of `backend/` with these keys:

```
PORT=3000
MONGODB_URL=<your_mongo_connection_string>
JWT_SECRET=<your_jwt_secret>
PASS_MAIL=<your_gmail_email>
PASS_KEY=<your_gmail_app_password>
```

Notes:
- Use Gmail App Passwords (not your main account password) for `PASS_KEY`.
- Keep JWT_SECRET and DB credentials private.


## API Endpoints

Auth routes (prefix `/auth`):

- POST `/auth/sign-up` — Register a new user
	- Body: { name, email, password }
- POST `/auth/sign-in` — Login user
	- Body: { email, password }
- POST `/auth/forgot-password` — Send password reset link
	- Body: { email }
- POST `/auth/reset-password/:id/:token` — Reset password
	- Body: { password }

All endpoints return JSON with `message` and relevant data or errors.


## Reset Flow

1. User requests a password reset (`/auth/forgot-password`) with email.
2. Server generates a random token and expiry, stores it on the user.
3. Server sends email with a link: `/reset-password/:id/:token`.
4. User opens link, frontend validates token (`/auth/verify-reset/:id/:token`) (provided by your frontend), and submits new password to `reset-password`.

Security notes:
- Reset tokens are temporary and stored on the user record.
- Reset links are short-lived (configurable via `RESET_EXPIRY_MINUTES`).


## Using the Code

- `Controllers/authController.js` — main business logic.
- `Utils/mailer.js` — uses Nodemailer to send reset emails.
- `Models/userSchema.js` — user model contains fields for reset token and expiry.

Add tests or Postman collection as needed.


## Troubleshooting

- If mails fail, confirm `PASS_MAIL` and `PASS_KEY` are valid and Gmail is configured for app passwords.
- If DB fails, ensure `MONGODB_URL` is correct and reachable.


## License

MIT


