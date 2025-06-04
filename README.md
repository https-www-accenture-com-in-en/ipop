# IPOP-Backend

Backend API for the IPOP application, built with Node.js, Express, and MongoDB.

## Features

- RESTful API for admin and user operations
- Modular route and controller structure
- MongoDB integration via Mongoose
- Request logging and error handling middleware
- CORS enabled for frontend integration

## Project Structure

```
.
├── .env.example           # Example environment variables
├── package.json           # Project metadata and scripts
├── db/
│   └── dbconfig.js        # Database connection config
└── src/
    ├── app.js             # Express app setup
    ├── index.js           # App entry point
    ├── controllers/       # Route controllers
    │   ├── admin/
    │   └── user/
    ├── models/            # Mongoose models
    ├── routes/            # API route definitions
    ├── seeders/           # Data seeding scripts
    └── utils/             # Middleware and config
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or remote)

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/https-www-accenture-com-in-en/IPOP-Backend.git
    cd IPOP-Backend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Copy `.env.example` to `.env` and fill in your environment variables:
    ```sh
    cp .env.example .env
    ```

4. Configure your MongoDB connection in `.env`.

### Running the App

Start the development server with nodemon:
```sh
npm run dev
```

The server will start on the port specified in your `.env` or default to 5000.

### API Endpoints

- All admin routes: `/v1/api/admin/*`
- (User routes can be enabled in `src/app.js`)

See the route files in [`src/routes/`](src/routes/) for details.

### Middleware

- Request logging
- Error handling
- Unknown endpoint handling
- CORS (configured for all origins by default)

### Seeding Data

To seed initial data, use the scripts in [`src/seeders/`](src/seeders/).

## Contributing

1. Clone the repo
2. Create your feature branch (`git checkout -b feature/foo`)
3. Commit your changes
4. Push to the branch
5. Open a pull request
