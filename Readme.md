## Reset Password Flow — Backend

Repository: https://github.com/Mjansitha03/backend.git

Simple Node.js + Express backend providing user auth and a password reset flow.

Features:
- Sign up and sign in
- JWT-based authentication
- Password reset via email (token + expiry)
- MongoDB (Mongoose) data store

Tech stack:
- Node.js, Express
- MongoDB, Mongoose
- JWT, bcrypt, Nodemailer
- dotenv for configuration

Folder structure (backend):

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

Quick start
------------

Prerequisites:
- Node.js (v16+)
- MongoDB (local or Atlas)

Install and run:

```bash
cd backend
npm install
npm run dev
```

By default, the server listens on `PORT` from `.env` (set to `3000` or your choice).

Environment variables (`.env` in backend/):

```
PORT=3000
MONGODB_URL=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
PASS_MAIL=<your_gmail_email>
PASS_KEY=<your_gmail_app_password>
```

Notes:
- Use Gmail App Passwords for `PASS_KEY` instead of your main account password.
- Keep secrets private and don't commit `.env`.

API endpoints (prefix `/api/auth` as mounted in index.js):

- POST `/api/auth/sign-up` — Register a user
	- Body: { name, email, password }
- POST `/api/auth/sign-in` — Login and receive JWT
	- Body: { email, password }
- POST `/api/auth/forgot-password` — Request a password reset link
	- Body: { email }
- GET `/api/auth/verify-reset/:id/:token` — Verify reset token validity
- POST `/api/auth/reset-password/:id/:token` — Reset password
	- Body: { password }

Example cURL
------------

Create user:
```bash
curl -X POST http://localhost:3000/api/auth/sign-up \
	-H "Content-Type: application/json" \
	-d '{"name":"Jane","email":"jane@example.com","password":"pwd123"}'
```

Request password reset:
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
	-H "Content-Type: application/json" \
	-d '{"email":"jane@example.com"}'
```

Reset password (after verifying link):
```bash
curl -X POST http://localhost:3000/api/auth/reset-password/<USER_ID>/<TOKEN> \
	-H "Content-Type: application/json" \
	-d '{"password":"newPassword"}'
```

How the reset flow works
------------------------
1. Client calls `/api/auth/forgot-password` with the user's email.
2. Server generates a secure token and expiry, saves them to the user record.
3. Server sends an email with a reset link: `http://<frontend>/reset-password/:id/:token`.
4. Frontend verifies the token with `/api/auth/verify-reset/:id/:token`, then posts the new password to `/api/auth/reset-password/:id/:token`.

Implementation notes
--------------------
- `RESET_EXPIRY_MINUTES` in `Controllers/authController.js` defines how long a reset link is valid.
- `Utils/mailer.js` wraps Nodemailer and logs errors instead of throwing.
- `Database/dbConfig.js` expects `MONGODB_URL` in `.env`.

Troubleshooting
---------------
- Mails fail: verify `PASS_MAIL` and `PASS_KEY` (Gmail app password), and check that less secure app access isn't required for your account.
- DB connection fails: verify `MONGODB_URL` and that your MongoDB instance is reachable.

License
-------
MIT

Contributing
------------
Pull requests welcome. Please add tests and update the README if you change behavior.



