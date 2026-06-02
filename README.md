# Chama Tracker

A full stack web application for managing savings groups (chamas). Built to solve the problem of chamas being managed manually via WhatsApp or paper records.

## Live Demo
- Frontend: https://chama-tracker-bice.vercel.app
- Backend API: https://chama-tracker-gzv4.onrender.com

## Features
- User registration and login with JWT authentication
- Create and join savings groups
- Log and track contributions per member
- Auto-generated payout schedule based on join order
- Admin controls for managing groups

## Tech Stack
*Frontend*
- React (Vite)
- React Router
- Tailwind CSS
- Axios
- React Toastify

*Backend*
- Flask
- Flask SQLAlchemy
- Flask JWT Extended
- Flask Migrate
- SQLite

## Setup Instructions

### Backend
cd server
pipenv install
pipenv shell
flask --app app.py db upgrade
python seed.py
flask --app app.py run

### Frontend
cd client
npm install
npm run dev

Database Relationships
One-to-Many: One Chama has many Contributions
Many-to-Many: Many Users belong to many Chamas (via Membership table)

Author
Agnes Ng'ang'a
