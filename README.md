# VisionCheck AI

VisionCheck AI is a final-year MERN project for rule-based Color Vision Deficiency screening using Ishihara plates. The system is explainable end to end and does not use machine learning, deep learning, neural networks, TensorFlow, or OpenCV-based diagnosis.

## Highlights

- Image-based Ishihara plate delivery for plates 1-38
- Rule-based expert-system diagnosis
- Screening outcomes:
  - Normal Color Vision
  - Protanopia
  - Protanomaly
  - Deuteranopia
  - Deuteranomaly
  - Borderline / Inconclusive Screening
- Tracing plate capture with Base64 storage for physician review
- MongoDB Atlas result storage
- Admin dashboard with search, sorting, pagination, and stats

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Tailwind CSS
- Backend: Node.js, Express.js, Mongoose
- Database: MongoDB Atlas

## Project Structure

```text
visioncheck-ai/
|-- frontend/
|   |-- public/
|   |   `-- plates/
|   |       |-- 1.png
|   |       |-- ...
|   |       `-- 38.png
|   `-- src/
|-- backend/
`-- render.yaml
```

## Clinical Workflow

1. Calibration screen verifies brightness, display settings, and viewing distance.
2. Number test presents Ishihara plates 1-25 sequentially.
3. User answers are stored as:

```json
[
  {
    "plate": 1,
    "answer": "12"
  }
]
```

4. A rule-based diagnosis is generated from the Ishihara rules.
5. Tracing plates 26-38 are drawn on canvas and stored as Base64 for review.
6. Final results are saved in MongoDB.

## Final Result Schema

```json
{
  "answers": [
    {
      "plate": 1,
      "answer": "12"
    }
  ],
  "numberScore": 18,
  "diagnosis": "Normal Color Vision",
  "tracingImageBase64": "data:image/png;base64,...",
  "date": "2026-05-25T00:00:00.000Z"
}
```

## Local Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Backend `.env`:

```env
PORT=5001
MONGODB_URI=your_mongodb_atlas_connection_string
CLIENT_URL=http://localhost:5173
```

Frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:5001/api
```

## Notes

- Plate images are served from `frontend/public/plates/`.
- The diagnosis logic is explainable and implemented as hardcoded clinical rules.
- Tracing plates are stored for physician review and are not auto-graded.
