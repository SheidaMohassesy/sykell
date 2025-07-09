# Sykell Web Crawler

This project consists of two main parts:

- **Frontend (web-crawler/):** A Next.js React application for submitting URLs and viewing crawl results.
- **Backend (go-crawler/):** A Go-based web crawler that analyzes web pages and provides structured data.

---

## Frontend: `web-crawler/`

### Features

- Submit a website URL for analysis.
- View page title, HTML version, link counts, heading structure, and more.
- Responsive UI (mobile and desktop views).

### Getting Started

1. **Install dependencies:**
   ```bash
   cd web-crawler
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. **Run tests:**
   ```bash
   npm run test
   ```

### Project Structure

- `src/components/UrlForm/` — URL submission form
- `src/components/UrlTable/` — Results table
- `src/hooks/` — Custom React hooks
- `public/` — Static assets

---

## Backend: `go-crawler/`

### Features

- Crawls a given URL and extracts:
  - Page title
  - HTML version
  - Internal/external/broken links
  - Heading counts (h1-h6)
  - Login form detection
- Exposes a simple API (customize as needed)

### Getting Started

1. **Install Go dependencies:**
   ```bash
   cd go-crawler
   go mod tidy
   ```
2. **Run the crawler:**
   ```bash
   go run main.go
   ```

### Project Structure

- `main.go` — Entry point
- `crawler.go` — Core crawling logic
- `go.mod`, `go.sum` — Go module files

---

## Integration

- The frontend can be configured to call the backend API for crawling and analysis.
- Update API endpoints in the frontend as needed to match your backend setup.

---
