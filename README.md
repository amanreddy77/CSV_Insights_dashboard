# About Me

## Personal Information

**Name:** [AMAN REDDY PUNDRU]
**Email:** [reddyaman77.ar@gmail.com]
**LinkedIn:** [https://www.linkedin.com/in/aman-reddy-pundru-272b53221]
**GitHub:** [github.com/amanreddy77]
**Portfolio:** [https://portfolio-aman-gamma.vercel.app/]


## Technical Skills

### Languages
- JavaScript/TypeScript
- Python



### Frontend
- React / Vue / Angular
- Tailwind CSS / Material-UI
- HTML5 / CSS3


### Backend
- Node.js / Express
- FAST API

### Databases
- PostgreSQL / MySQL
- MongoDB
- SQLite
- Redis


### Tools & Technologies
- Git / GitHub
- Docker / Kubernetes
- AWS / GCP / Azure
- CI/CD (GitHub Actions, Jenkins, etc.)


### AI/ML (if applicable)
- OpenAI API / Anthropic Claude
- Groq / LLaMA
- LangChain




## Project

### CSV Insights Dashboard (This Project)
- Built a full-stack web application for CSV analysis with AI-powered insights
- Technologies: React, Node.js, Express, SQLite, Groq LLaMA
- Features: File upload, data visualization, AI insights, report management


## Resume

For a detailed resume, please visit: [https://drive.google.com/file/d/1qPCUoKkoPPmCDzfsivKvq6PaTH5tHAvH/view?usp=sharing]

---

*Last Updated: [sun, 15 Feb 2026]*


# CSV Insights Dashboard

A professional web application for analyzing CSV files with AI-powered insights, visualizations, and report management.

## Features

### Core Features
- **CSV Upload & Analysis**: Upload CSV files and get instant AI-powered insights
- **Data Preview**: Interactive table view with column selection
- **AI Insights**: GPT-4 powered analysis including trends, outliers, and recommendations
- **Visualizations**: Automatic chart generation (line and bar charts)
- **Report Management**: Save and view your last 5 reports
- **Export Options**: Copy to clipboard or download reports as text files
- **Follow-up Questions**: Ask AI questions about your data
- **System Status**: Monitor backend, database, and LLM health

### Technical Features
- Responsive, professional UI with Tailwind CSS
- Real-time data analysis
- SQLite database for report persistence
- RESTful API architecture
- Comprehensive error handling
- Docker support for easy deployment

## Tech Stack

### Frontend
- React 18 with Vite
- React Router for navigation
- Tailwind CSS for styling
- Recharts for data visualization
- Axios for API communication
- Lucide React for icons
- PapaParse for CSV parsing

### Backend
- Node.js with Express
- SQLite with better-sqlite3
- Groq API with LLaMA 3.3 70B for insights
- Multer for file uploads
- CORS enabled

## Prerequisites

- Node.js 18+ (recommended: 20+)
- npm or yarn
- Groq API key (get one free at https://console.groq.com/keys)

## Installation & Setup

### Option 1: Manual Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "CSV Insights Dashboard"
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install

   # Create .env file
   cp .env.example .env

   # Edit .env and add your Groq API key
   # GROQ_API_KEY=your_actual_key_here
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install

   # Create .env file (optional, defaults to localhost:5000)
   cp .env.example .env
   ```

4. **Start the Application**

   In separate terminals:

   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   ```

   ```bash
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Option 2: Docker Setup

1. **Build and run with Docker Compose**
   ```bash
   # Create .env file in backend directory first
   cd backend
   cp .env.example .env
   # Add your GROQ_API_KEY

   cd ..
   docker-compose up --build
   ```

2. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Usage Guide

### 1. Upload a CSV File
- Click "Choose File" on the home page
- Select a CSV file from your computer
- Click "Analyze" to process the file

### 2. Review Insights
- View the AI-generated insights including:
  - Data summary
  - Key trends
  - Outliers and anomalies
  - Recommendations

### 3. Explore Visualizations
- Automatic charts are generated for numeric and categorical data
- Line charts for trends
- Bar charts for distributions

### 4. Customize View
- Select which columns to display in the data preview
- All columns are included in the analysis

### 5. Ask Follow-up Questions
- Type questions about your data in the follow-up section
- Example: "What's the average value in the sales column?"
- Get AI-powered answers based on your data

### 6. Save & Export
- **Save Report**: Store the report in the database (last 5 reports are kept)
- **Copy to Clipboard**: Copy the insights to your clipboard
- **Download**: Save the report as a text file

### 7. View Past Reports
- Navigate to "Reports" to see your last 5 saved reports
- Click on any report to view full details

### 8. Check System Status
- Navigate to "Status" to monitor:
  - Backend server health
  - Database connection
  - LLM API status

## API Endpoints

### Health Check
- `GET /api/health` - Check system health status

### CSV Operations
- `POST /api/upload` - Upload and analyze CSV file
- `POST /api/followup` - Ask follow-up questions about data

### Report Management
- `GET /api/reports` - Get last 5 reports
- `GET /api/reports/:id` - Get specific report
- `POST /api/reports` - Save a new report

## Project Structure

```
CSV Insights Dashboard/
├── backend/
│   ├── server.js          # Express server
│   ├── db.js              # Database operations
│   ├── package.json
│   ├── .env.example
│   └── uploads/           # Temporary file storage
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Main upload & analysis page
│   │   │   ├── Status.jsx      # System status page
│   │   │   ├── Reports.jsx     # Reports list page
│   │   │   └── ReportView.jsx  # Individual report view
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── docker-compose.yml
├── Dockerfile.frontend
├── Dockerfile.backend
├── .gitignore
├── README.md
├── AI_NOTES.md
├── ABOUTME.md
└── PROMPTS_USED.md
```

## What's Done

- ✅ CSV file upload and parsing
- ✅ AI-powered insights generation using Groq LLaMA 3.3 70B
- ✅ Interactive data preview with column selection
- ✅ Automatic chart generation (line and bar charts)
- ✅ Report saving to SQLite database
- ✅ View last 5 saved reports
- ✅ Export reports (copy/download)
- ✅ Follow-up questions feature
- ✅ System status monitoring page
- ✅ Professional, responsive UI
- ✅ Comprehensive error handling
- ✅ Docker support
- ✅ Environment variable configuration



## Environment Variables

### Backend (.env)
```
PORT=5001
GROQ_API_KEY=your_groq_api_key_here
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5001
```

## Troubleshooting

### Backend won't start
- Ensure Node.js 18+ is installed
- Check that port 5001 is not in use (macOS uses 5000 for AirPlay)
- Verify Groq API key is set in backend/.env

### Frontend won't start
- Ensure Node.js 18+ is installed
- Check that port 3000 is not in use
- Run `npm install` again if dependencies are missing

### Groq API errors
- Verify your API key is valid (Groq offers free tier)
- Check internet connection
- Review API usage at console.groq.com

### File upload fails
- Ensure file is a valid CSV
- Check file size (large files may take longer)
- Verify backend uploads/ directory exists

## Contributing

This is a demonstration project created for a job application. For questions or issues, please refer to ABOUTME.md for contact information.

## License

This project is created as part of a job application assessment.

## Credits

Built by [Your Name] as part of a software development assessment.
For more information, see ABOUTME.md.
