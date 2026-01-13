# Art Gallery Data Table App

A professional React application built with Vite and TypeScript that displays artwork data from the Art Institute of Chicago API using PrimeReact DataTable. Features server-side pagination, persistent row selection, and a polished user interface.

## ✨ Features

- **Professional UI**: Clean, responsive design with PrimeReact components and dark mode toggle
- **Data Table**: Displays artwork information including title, place of origin, artist, inscriptions, and dates
- **Server-Side Pagination**: Fetches data per page from the API without prefetching
- **Row Selection**:
  - Checkboxes for individual selection/deselection
  - Select/deselect all on current page
  - Custom selection panel to select first N rows on current page
  - Selected count display with clear option
- **Persistent Selection**: Selected rows persist across page navigation using efficient ID tracking
- **Error Handling**: Graceful error handling with retry functionality
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **PrimeReact** for UI components
- **PrimeIcons** for icons

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd art-gallery-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📊 API Integration

- **Endpoint**: `https://api.artic.edu/api/v1/artworks?page=1`
- **Data Fields**: `title`, `place_of_origin`, `artist_display`, `inscriptions`, `date_start`, `date_end`
- **Pagination**: Server-side with 12 items per page

## 🎯 Key Implementation Details

- **No Prefetching**: Custom selection only operates on current page data
- **Memory Efficient**: Only stores selected IDs, not entire row objects
- **Persistent Selection**: Uses Set of IDs for cross-page selection tracking
- **Type Safe**: Full TypeScript implementation with proper interfaces

## 🌐 Deployment

Deploy the `dist/` folder to:
- ✅ **Netlify**
- ✅ **Cloudflare**
- ✅ **Any other static hosting provider**

**Note**: Do not deploy to Vercel as it requires login to access the dashboard.

## 📝 Assignment Compliance

This implementation fully meets all internship assignment requirements:
- ✅ Vite + TypeScript setup
- ✅ PrimeReact DataTable integration
- ✅ All required data fields displayed
- ✅ Server-side pagination
- ✅ Row selection with checkboxes
- ✅ Custom selection panel
- ✅ Persistent selection across pages
- ✅ No prefetching or storage of other page data
