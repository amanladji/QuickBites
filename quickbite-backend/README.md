# 🍔 QuickBite — Full-Stack Food Delivery Platform

**Frontend:** Vanilla HTML/CSS/JS  
**Backend:** Java 17 · Spring Boot 3.2 · MongoDB · JWT Auth  
**Deploy:** Render (free tier)

---

## 📁 Project Structure

```
quickbite/
├── quickbite-backend/      ← Spring Boot REST API
│   ├── pom.xml
│   ├── render.yaml
│   └── src/main/java/com/quickbite/
│       ├── controller/     ← REST controllers (MVC — C)
│       ├── service/        ← Business logic (MVC — M)
│       ├── repository/     ← MongoDB repositories
│       ├── model/          ← Document models (MVC — M)
│       ├── dto/            ← Request/Response objects
│       ├── config/         ← Security, JWT, Seeder, Mongo
│       └── exception/      ← Global error handling
│
└── quickbite-frontend/     ← Static website
    ├── index.html          ← Full UI (single page)
    ├── style.css
    ├── theme-switcher.js
    ├── animations.js
    ├── app.js              ← All API integrations
    └── render.yaml
```

---

## 🗃️ API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login → returns JWT |
| GET | `/api/restaurants` | Public | All open restaurants |
| GET | `/api/restaurants/{id}` | Public | Single restaurant |
| GET | `/api/restaurants/area/{area}` | Public | Filter by area |
| GET | `/api/restaurants/cuisine/{cuisine}` | Public | Filter by cuisine |
| GET | `/api/restaurants/night-owl` | Public | Late-night open restaurants |
| POST | `/api/restaurants` | Admin | Add restaurant |
| PUT | `/api/restaurants/{id}` | Admin | Update restaurant |
| GET | `/api/menu/trending` | Public | Top 8 trending dishes |
| GET | `/api/menu/restaurant/{id}` | Public | Full restaurant menu |
| GET | `/api/menu/category/{cat}` | Public | Menu items by category |
| POST | `/api/menu` | Admin | Add menu item |
| GET | `/api/search?q=keyword` | Public | Search restaurants + dishes |
| GET | `/api/offers` | Public | All active offers |
| POST | `/api/offers/validate` | Public | Validate coupon code |
| POST | `/api/orders` | JWT | Place an order |
| GET | `/api/orders/my` | JWT | My order history |
| GET | `/api/orders/{id}` | JWT | Single order |
| GET | `/api/orders/track/{trackingId}` | Public | Track by tracking ID |
| PATCH | `/api/orders/{id}/status` | Admin | Update order status |
| POST | `/api/newsletter/subscribe` | Public | Newsletter signup |
| POST | `/api/newsletter/unsubscribe` | Public | Unsubscribe |
| GET | `/api/reviews/featured` | Public | Homepage testimonials |
| GET | `/api/reviews/restaurant/{id}` | Public | Restaurant reviews |
| POST | `/api/reviews` | JWT | Submit a review |

---

## 🚀 Deploy to Render — Step by Step

### Step 1: MongoDB Atlas (Free Database)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → **Sign up free**
2. Create a **free M0 cluster** (any region)
3. Under **Database Access** → Add a user, e.g. `quickbite` with a strong password
4. Under **Network Access** → Add `0.0.0.0/0` (allow all IPs, needed for Render)
5. Click **Connect** → **Connect your application** → Copy the URI:
   ```
   mongodb+srv://quickbite:<password>@cluster0.xxxxx.mongodb.net/quickbite?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password. **Save this URI.**

---

### Step 2: Deploy the Backend on Render

1. Push the `quickbite-backend/` folder to a **GitHub repository** (public or private)
2. Go to [render.com](https://render.com) → **New → Web Service**
3. Connect your GitHub repo and select `quickbite-backend`
4. Fill in settings:
   - **Name:** `quickbite-backend`
   - **Runtime:** Java
   - **Build Command:** `mvn clean package -DskipTests`
   - **Start Command:** `java -jar target/quickbite-backend-1.0.0.jar`
   - **Instance Type:** Free
5. Under **Environment Variables**, add:
   | Key | Value |
   |-----|-------|
   | `MONGO_URI` | Your MongoDB Atlas URI from Step 1 |
   | `JWT_SECRET` | Any random 32+ character string |
   | `FRONTEND_URL` | (leave blank for now, fill in after Step 3) |
6. Click **Create Web Service** → Wait for build (~3-5 minutes)
7. Your backend URL will be: `https://quickbite-backend.onrender.com`

---

### Step 3: Deploy the Frontend on Render

1. Push the `quickbite-frontend/` folder to a **separate GitHub repository**
2. Open `quickbite-frontend/index.html` and update:
   ```html
   <script>
     window.BACKEND_URL = 'https://quickbite-backend.onrender.com'; // ← your actual backend URL
   </script>
   ```
3. Go to Render → **New → Static Site**
4. Connect the frontend repo
5. Fill in settings:
   - **Name:** `quickbite-frontend`
   - **Publish Directory:** `.` (root)
   - **Build Command:** leave blank
6. Click **Create Static Site**
7. Your frontend URL will be: `https://quickbite-frontend.onrender.com`

---

### Step 4: Update CORS

Go back to your **backend** Render service → Environment → update `FRONTEND_URL`:
```
https://quickbite-frontend.onrender.com
```
Click **Save Changes** → backend will redeploy automatically.

---

## 🧪 Test Accounts (seeded automatically on first run)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@quickbite.in` | `Admin@123` |
| Customer | `priya@example.com` | `Test@123` |

---

## 🏃 Run Locally

### Backend
```bash
# Prerequisites: Java 17+, Maven 3.8+, MongoDB running locally
cd quickbite-backend

# Option A: local MongoDB
# (MongoDB must be running on localhost:27017)
mvn spring-boot:run

# Option B: use MongoDB Atlas
MONGO_URI="mongodb+srv://..." mvn spring-boot:run
```
Backend runs at `http://localhost:8080`

### Frontend
```bash
cd quickbite-frontend

# Open index.html — change BACKEND_URL to localhost first:
# window.BACKEND_URL = 'http://localhost:8080';

# Serve with any static server:
npx serve .
# or
python3 -m http.server 3000
```
Frontend runs at `http://localhost:3000`

---

## 🔑 JWT Auth Flow

```
1. User clicks "Sign In" → POST /api/auth/login { email, password }
2. Server validates, returns { token, userId, name, role, quickCoins }
3. Frontend stores token in localStorage
4. All protected requests include: Authorization: Bearer <token>
5. JwtAuthFilter validates token on every request
```

---

## 🏗️ MVC Architecture

```
Controller (C)   →  receives HTTP request, validates input
    ↓
Service (M)      →  business logic, rules, calculations
    ↓
Repository (M)   →  MongoDB query via Spring Data
    ↓
Model (M)        →  MongoDB document (@Document)
    ↓
DTO              →  clean request/response shapes
```

---

## 💡 Key Features

- **JWT Auth** — stateless authentication, BCrypt password hashing
- **Referral System** — earn QuickCoins when friends register with your code
- **Loyalty Tiers** — BRONZE → SILVER (15 orders) → GOLD (50 orders)
- **Coupon Validation** — FIRST50 (new users only), HAPPY20, FREEDEL
- **Order Tracking** — unique tracking ID per order
- **Auto-seeding** — DB seeded with restaurants, menus, offers, reviews on first run
- **CORS** — configurable per environment via `FRONTEND_URL` env var
- **Global error handling** — consistent `{ success, message, data }` response shape

---

## ⚠️ Important Notes for Production

1. Change `JWT_SECRET` to a strong random value (32+ chars) — never commit it
2. Restrict MongoDB Atlas IP to Render's IP range instead of `0.0.0.0/0`
3. Set `spring.jackson.serialization.indent-output=false` (already done)
4. Add rate limiting (Spring's `@RateLimiter` or a reverse proxy)
5. Render free tier **spins down after 15 min inactivity** — first request may take ~30s to wake up
