# Negro Coffee ☕

A full-stack online coffee shop: customers browse and search the coffee catalog, filter by category and fill a shopping cart; admins manage the products (add, edit, delete, upload images).

Built with **Angular 17** (frontend), **Node.js + Express + TypeScript** (REST API) and **MongoDB** (Mongoose).

<!-- Screenshots: add images to docs/screenshots/ and uncomment
![Home page](docs/screenshots/home.png)
![Product list](docs/screenshots/products.png)
![Shopping cart](docs/screenshots/cart.png)
-->

## Features

- **Product catalog** – product list, product details, text search and category filtering
- **Shopping cart** – add products, change quantities (cart modal)
- **Authentication** – register / login with JWT, route guards, "my account" page
- **Admin product management** – add, edit and delete products, including image upload
- **Static pages** – about, testimonials, contact us
- **Security** – admin-only write routes (JWT signature verified), hashed passwords (HMAC-SHA512 with a secret salt), rate limiting on login/register, XSS tag stripping, secrets kept in a git-ignored `.env`

## Tech stack

| Layer    | Technologies |
|----------|--------------|
| Frontend | Angular 17 (standalone components), NGXS state management, RxJS, Bootstrap 5, Notyf |
| Backend  | Node.js, Express, TypeScript, Mongoose, JWT, Joi validation, express-rate-limit, express-fileupload |
| Database | MongoDB |

## Project structure

```
Backend/            Express REST API (TypeScript)
  src/1-assets/     product images
  src/2-utils/      config, DB connection, auth/crypto, validation
  src/3-models/     Mongoose models, errors, enums
  src/4-middleware/ security, logging, error handling
  src/5-services/   business logic
  src/6-controllers/ routes
Frontend/           Angular app
  src/app/components/  UI, grouped by area (products, auth, layout, ...)
  src/app/NgXs/        NGXS state, actions, selectors
  src/app/services/    HTTP services, auth guard
Database/           MongoDB JSON exports (sample data)
```

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally (or a MongoDB Atlas connection string)
- [MongoDB Database Tools](https://www.mongodb.com/try/download/database-tools) for `mongoimport` (to load the sample data)

### 1. Load the sample data

`Database/` holds two exports: use **`Database/02-2025/`** (current – 30 products, categories stored on each product).
The older export in `Database/` (21 products, categories in a separate `productCategoryRelations` file) is kept for history only.

```bash
cd Database/02-2025
mongoimport --db negro_coffee-db --collection categories --jsonArray --file negro_coffee-db.categories.json
mongoimport --db negro_coffee-db --collection products   --jsonArray --file negro_coffee-db.products.json
mongoimport --db negro_coffee-db --collection roles      --jsonArray --file negro_coffee-db.roles.json
```

### 2. Configure and run the backend

```bash
cd Backend
cp .env.example .env     # then edit .env: set JWT_SECRET_KEY and PASSWORD_SALT to long random strings
npm install
npm start                # http://localhost:4000
```

### 3. Run the frontend

```bash
cd Frontend
npm install
npm start                # opens http://localhost:4200
```

### 4. Create an admin user

Register a new user in the app, then promote it to admin (role `1`) in MongoDB:

```bash
mongosh negro_coffee-db --eval 'db.users.updateOne({ email: "you@example.com" }, { $set: { roleId: 1 } })'
```

Log out and in again — the admin product-management options will now be available.

## API overview

| Method | Route | Access |
|--------|-------|--------|
| GET    | `/api/products`, `/api/products/:id`, `/api/products/search/:text`, `/api/products/category/:categoryId` | public |
| GET    | `/api/categories` | public |
| GET    | `/api/products/images/:imageName` | public |
| POST   | `/api/register`, `/api/login` | public (rate limited) |
| POST   | `/api/products/new` | admin |
| PUT    | `/api/products/edit/:id` | admin |
| DELETE | `/api/products/:id` | admin |

## Author

**Yoad K.** – [GitHub](https://github.com/YoadK)
