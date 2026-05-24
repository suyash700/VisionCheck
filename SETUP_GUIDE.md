# VisionCheck AI Setup Guide

## 1. Project Initialization Commands

```bash
mkdir visioncheck-ai
cd visioncheck-ai
mkdir backend frontend
```

## 2. Backend Setup Commands

```bash
cd backend
npm init -y
npm install express mongoose cors dotenv
npm install -D nodemon
```

## 3. Frontend Setup Commands

```bash
cd ../frontend
npm create vite@latest . -- --template react
npm install
npm install react-router-dom axios tailwindcss postcss autoprefixer react-pdf pdfjs-dist
npx tailwindcss init -p
```

## 4. MongoDB Atlas Setup

1. Create a MongoDB Atlas project.
2. Create a cluster.
3. Open `Database Access` and create an application user.
4. Open `Network Access` and allow your IP or `0.0.0.0/0` for deployment testing.
5. Copy the connection string.
6. Paste it into [backend/.env.example](/d:/college/sem-6/ty-peoject/work/visioncheck-ai/backend/.env.example:1) as `MONGODB_URI`.

## 5. Environment Files

Backend `.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/visioncheck_ai?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
```

Frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ISHIHARA_PDF_PATH=/ishihara-38-plates.pdf
VITE_ISHIHARA_PDF_PAGE_OFFSET=0
```

## 6. Ishihara PDF Placement

Place your Ishihara 38-Plate PDF at:

```text
frontend/public/ishihara-38-plates.pdf
```

If the first PDF page is not plate 1, change `VITE_ISHIHARA_PDF_PAGE_OFFSET`.

## 7. Run the Application

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

## 8. API Summary

- `POST /api/diagnose`
- `POST /api/save-results`
- `GET /api/results`

## 9. Vercel Frontend Deployment

1. Push `visioncheck-ai/frontend` to GitHub.
2. Import the frontend project into Vercel.
3. Set:

```env
VITE_API_BASE_URL=https://your-render-backend.onrender.com/api
VITE_ISHIHARA_PDF_PATH=/ishihara-38-plates.pdf
VITE_ISHIHARA_PDF_PAGE_OFFSET=0
```

4. Upload `ishihara-38-plates.pdf` into the frontend `public` folder before deployment.

## 10. Render Backend Deployment

1. Push `visioncheck-ai/backend` to GitHub.
2. Create a Render Web Service.
3. Use:
   Build Command: `npm install`
   Start Command: `npm start`
4. Set environment variables:

```env
PORT=10000
MONGODB_URI=your_mongodb_atlas_connection_string
CLIENT_URL=https://your-vercel-app.vercel.app
```

5. The included [render.yaml](/d:/college/sem-6/ty-peoject/work/visioncheck-ai/render.yaml:1) can also be used for blueprint deployment.
