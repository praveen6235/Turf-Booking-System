
# Turf Booking System

A full-stack MERN web application designed to simplify discovering and reserving sports turfs. Users can browse facilities, view turf details, and book available slots, while administrators manage turfs, bookings, and registered users through a centralized dashboard.

## About the Project

The Turf Booking System digitizes the traditional turf reservation process through a responsive web application. It uses React.js for the frontend, Node.js and Express.js for backend APIs, and MongoDB for data storage.

The application includes authentication, role-based access control, and cloud-based image management. DevOps practices support source control, deployment, environment configuration, and application maintenance.

## Key Features

### User Module
- User registration and login
- Google OAuth sign-in
- JWT-based authentication
- Browse available turfs
- View turf details and amenities
- Book available time slots
- View booking history
- Update profile information
- Responsive user interface

### Admin Module
- Secure administrator access
- Add, update, and delete turf listings
- Upload and manage turf images
- Manage bookings
- Manage registered users
- Centralized management dashboard

### Security Features
- JWT authentication
- Google OAuth integration
- Password hashing with bcrypt
- Role-based authorization
- Protected API routes
- Input validation

### Image Management
- Multer handles image uploads.
- Cloudinary stores uploaded images.
- Image URLs are saved in MongoDB.
- Cloudinary supports optimized image delivery.

## Technology Stack

### Frontend
- React.js
- React Router
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication
- JSON Web Tokens (JWT)
- Google OAuth

### Image Storage
- Multer
- Cloudinary

### Deployment
- Vercel — frontend hosting
- Render — backend hosting
- MongoDB Atlas — database hosting

## DevOps and Deployment

DevOps practices help make application builds, deployments, and troubleshooting more consistent. The frontend, backend, database, and image storage are configured as separate components so each can be managed independently.

### Deployment Architecture

1. **Vercel:** Hosts the React frontend.
2. **Render:** Runs the Node.js and Express backend.
3. **MongoDB Atlas:** Stores application data.
4. **Cloudinary:** Stores uploaded turf images.

The frontend communicates with the backend through its configured API URL. The backend connects to MongoDB Atlas using environment variables and handles image uploads through Cloudinary.

### Git and GitHub

Git tracks source-code changes, while GitHub stores the repository and supports collaboration.

```bash
git clone https://github.com/praveen6235/Turf-Booking-System.git
cd Turf-Booking-System

git status
git switch -c feature/your-change
git add .
git commit -m "Update turf booking feature"
git push origin feature/your-change
```

Use feature branches to isolate changes and review them before merging into the main branch.

Never commit passwords, API keys, or populated `.env` files to GitHub.

### Environment Variables

Create a `.env` file inside the `server` directory and configure the variables required by the backend.

```env
PORT=
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Use actual values in your local environment or hosting dashboard. Do not commit these values to GitHub. Frontend variables bundled into the browser must not contain private credentials.

### Continuous Integration and Continuous Delivery

GitHub Actions can automate application validation whenever code is pushed or a pull request is opened.

A recommended pipeline includes:

1. Download the latest repository code.
2. Install dependencies.
3. Run available tests and lint checks.
4. Build the frontend.
5. Validate the backend.
6. Deploy after the required checks pass.

Example commands:

```bash
npm ci
npm test --if-present
npm run build --if-present
```

Run these commands from the appropriate `client` or `server` directory. They depend on the scripts defined in each `package.json`.

GitHub Actions can be configured to run these steps automatically. Vercel and Render can also be connected to GitHub for automated deployments. Treat this pipeline as a recommended setup until a workflow has been configured and verified.

### Docker and Containerization

Docker can package the frontend or backend with its runtime and dependencies, helping maintain consistent environments across development and deployment.

A Docker setup should include appropriate Dockerfiles and a `.dockerignore` file. Environment variables should be supplied at runtime rather than copied into container images.

If the project includes a Docker Compose configuration, these commands can be used to manage the local environment:

```bash
docker compose build
docker compose up -d
docker compose ps
docker compose logs -f
docker compose down
```

These commands require a valid `compose.yaml` or `docker-compose.yml` file.

### Monitoring and Troubleshooting

Useful operational checks include:

- Review Vercel build logs when the frontend build fails.
- Review Render logs when the backend fails to start.
- Check MongoDB Atlas access rules and connection strings when database connections fail.
- Verify the frontend API URL and backend CORS configuration when requests fail.
- Monitor HTTP errors, response times, and application availability.

Prometheus and Grafana can be added for metrics collection and dashboards if the application exposes suitable metrics and the monitoring configuration is implemented.

### Deployment Checklist

- [ ] Frontend builds successfully.
- [ ] Backend starts on the configured port.
- [ ] Environment variables are configured securely.
- [ ] MongoDB Atlas connection works.
- [ ] Google OAuth settings match the deployed domains.
- [ ] Cloudinary credentials remain on the backend.
- [ ] Frontend API URL points to the deployed backend.
- [ ] CORS allows the required frontend origin.
- [ ] User and administrator permissions are tested.
- [ ] Booking workflows are tested after deployment.
- [ ] Deployment logs are reviewed after each release.

## Project Structure

```text
Turf-Booking-System/
├── client/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── services/
│   └── assets/
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── utils/
└── README.md
```

The actual folder structure may differ depending on the current repository version.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/praveen6235/Turf-Booking-System.git
cd Turf-Booking-System
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

Create the backend `.env` file and configure the required variables.

### 3. Start the Backend

```bash
npm run dev
```

### 4. Install and Start the Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the local frontend URL shown in the terminal. Ensure the frontend API configuration points to the running backend.

## Future Enhancements

- Razorpay payment gateway integration
- Real-time slot availability
- Email and SMS notifications
- Ratings and reviews
- Google Maps integration
- Progressive Web App (PWA)
- Booking analytics dashboard
- Discount coupons and promo codes
- Automated CI/CD validation
- Monitoring and alerting
- Automated backup and recovery procedures

## Project Highlights

- Developed a full-stack MERN application using RESTful APIs.
- Implemented JWT authentication and Google OAuth sign-in.
- Designed role-based access control for users and administrators.
- Integrated Cloudinary for cloud-based image storage.
- Built a responsive frontend using React.js and Tailwind CSS.
- Developed APIs for authentication, turf management, bookings, and user operations.
- Deployed the frontend on Vercel and backend on Render, using MongoDB Atlas for data storage.

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a pull request.

## Author

**Praveen Bollam**

- GitHub: https://github.com/praveen6235
- LinkedIn: Add your LinkedIn profile URL

## Show Your Support

If you find this project useful, consider giving the repository a star on GitHub.
