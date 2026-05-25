# Interview Question Generator

A full-stack application that generates role-specific interview questions using Google Gemini AI. Users can enter a job title and receive 3 thoughtful, practical interview questions tailored to that role.

## Technology Stack

**Frontend:**
- Angular 17+ (standalone component)
- TypeScript
- CSS3 (responsive design)

**Backend:**
- Node.js + Express
- Google Gemini API
- CORS enabled for local development

## Project Structure

```
interview-question-generator/
├── client/                 # Angular frontend
│   ├── src/
│   │   ├── app/           # Main component
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.css
│   ├── angular.json
│   ├── tsconfig.json
│   └── package.json
│
├── server/                 # Node.js/Express backend
│   ├── index.js           # Express server
│   ├── .env.example       # Environment variables template
│   └── package.json
│
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js 18+ (Node 20 LTS or Node 22 recommended)
- npm, yarn, or [Bun](https://bun.sh) as package manager
- Google Gemini API key (free from https://aistudio.google.com/app/apikey)

## Setup Instructions

### 1. Get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API key"
3. Copy your API key

### 2. Configure Backend Environment Variables

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_api_key_here
PORT=3000
```

### 3. Install Dependencies

**Backend:**
```bash
cd server
bun i
```

**Frontend:**
```bash
cd client
bun i
```

## Running Locally

### Start the Backend

```bash
cd server
bun run dev
```

The server will run on `http://localhost:3000`

Expected output:
```
Server running on http://localhost:3000
```

### Start the Frontend (in a new terminal)

```bash
cd client
bun start
```

The Angular app will available on `http://localhost:4200`

### Using the Application

1. Open [http://localhost:4200](http://localhost:4200) in your browser
2. Enter a job title (e.g., "Customer Success Manager", "Software Engineer", "Product Manager")
3. Click "Generate Questions"
4. View the 3 generated interview questions
5. Click "Reset" to try another job title

## API Endpoint

### POST /api/questions

Generates 3 interview questions for a specific job title.

**Request:**
```json
{
  "jobTitle": "Customer Success Manager"
}
```

**Response (Success):**
```json
{
  "questions": [
    "Question 1 text...",
    "Question 2 text...",
    "Question 3 text..."
  ]
}
```

**Response (Error):**
```json
{
  "error": "Error message describing what went wrong"
}
```

**Error Cases:**
- `400`: Missing or invalid jobTitle
- `500`: API key not configured or Gemini API error

## Features

✅ **Responsive Design** - Works on desktop and mobile devices  
✅ **Input Validation** - Prevents empty submissions  
✅ **Loading States** - Visual feedback while generating questions  
✅ **Error Handling** - Clear error messages for users  
✅ **API Security** - Gemini API key never exposed to frontend  
✅ **CORS Enabled** - Local development cross-origin requests work smoothly  
✅ **Clean Code** - Easy to read and understand  
✅ **TypeScript** - Type safety without complexity  

## Development Notes

### Frontend Architecture

- **Standalone Component**: The app uses a single standalone `AppComponent` with no modules needed
- **HttpClient**: Communicates with backend via Angular's HttpClient
- **Reactive Styling**: CSS handles loading and error states cleanly
- **Accessibility**: Semantic HTML and proper labeling

### Backend Architecture

- **Express Server**: Lightweight, simple setup
- **CORS Middleware**: Allows requests from frontend on different port
- **Question Parser**: Extracts numbered questions from Gemini's response
- **Error Handling**: Validates input and provides helpful error messages

## Deployment

### Backend (Node.js)

For production deployment:

1. Set environment variables on your server:
   ```
   GEMINI_API_KEY=your_key
   PORT=3000
   NODE_ENV=production
   ```

2. Install dependencies:
   ```bash
   # Using npm
   npm install --production

   # Or using Bun
   bun install --production
   ```

3. Start the server:
   ```bash
   # Using npm
   npm start

   # Or using Bun
   bun run start
   ```

Popbun install
   ```

3. Start the server:
   ```bash
   ```

2. Deploy the `dist/interview-question-generator` folder to:
   - Any static hosting service

3. Update the API URL in `src/app/app.component.ts` to point to your deployed backend

## Troubleshooting

### "Failed to generate questions. Please try again."

**Possible causes:**
- Gemini API key not set or invalid in `server/.env`
- Network connectivity issue
- Gemini API quota exceeded

**Solution:**
1. Verify API key is correct in `server/.env`
2. Restart the server
3. Check Google AI Studio dashboard for quota/errors

### CORS errors in browser console

**Possible cause:**
- Backend server not running on port 3000

**Solution:**
```bash
cd server
npm run dev
```

### "Port 3000 already in use"

**Solution:**
```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
bun

### Frontend not connecting to backend
bun
**Possible cause:**
- Backend URL in `app.component.ts` is incorrect

**Check:**
1. Backend is running on `http://localhost:3000`
2. URL in `app.component.ts` line with `http.post()` matches

## Environment Variables Reference

### Server (.env)

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key from https://aistudio.google.com/app/apikey |
| `PORT` | No | Server port (default: 3000) |

## Future Enhancements

- Save generated questions to a file
- History of generated questions
- Multiple questions per job title
- Difficulty level selection
- Export to PDF
- Share questions via URL

## License

MIT

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review error messages in the browser console and server terminal
3. Verify environment variables are set correctly
