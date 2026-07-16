# vanguard-campus-portal

A modern, responsive, and animated Campus Management System Frontend built using React.js (Vite), Tailwind CSS v4, Framer Motion, and Recharts.

## 🚀 Key Features

- **Role-Based Dynamic Dashboards**: Full custom portals with adaptive navigation for **Student**, **Faculty**, and **Admin**.
- **Modern UI & Dark/Light Mode**: Sleek dark and light styling with cached local theme selections.
- **Micro-Animations**: Custom scrollbars, glassmorphic grids, button triggers, and menu animations powered by Framer Motion.
- **Interactive Tables with Pagination**: Custom `<DataTable />` component providing live searches, status badge rendering, action columns, and paginated records.
- **Charts & Statistics Analytics**: Responsive Recharts Area, Bar, and Pie graphs representing GPA standings, attendance turnouts, and financial collection data.
- **Academic Timetables**: Grid timetable matrix rendering for students and interactive scheduling controls for admins.
- **Placements Cells Opportunities board**: Placements tracker showing recruiters details, package status, minimum GPA eligibility checkers, and apply sockets.
- **Grades & Marks Sheets Entries**: Interactive grading spreadsheets for faculty.
- **Fee Reconciliations & Payment Simulators**: Mock UPI payment gateways verifying transactions logs and updating invoices.

---

## 📁 Key File Structure

- `src/components/` - Reusable UI widgets (Navbar, Sidebar, DataTable, StatsCard, Modal, Loader, InputField).
- `src/layouts/` - Route security wrappers for Admin, Faculty, and Student layouts.
- `src/pages/` - Content pages (Dashboards, Attendance grids, Transcripts, Assignments entries, Placements células, circular notice streams, settings).
- `src/services/mockData.js` - Client-side mock database with localStorage caching.
- `src/hooks/useMockApi.js` - Asynchronous Promise resolving hooks simulating server response latency and spinner loaders.
- `src/context/` - AuthContext (handling role switches and session cache) & ThemeContext.

---

## 🛠️ Installation & Getting Started

1. Clone or download workspace files.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run local dev server:
   ```bash
   npm run dev
   ```
4. Build production static bundle:
   ```bash
   npm run build
   ```

---

## 💡 Testing Credentials Tip

On the login portal, selecting a role **autofills standard credentials**:
- **Student**: `student@campus.edu` / `student123`
- **Faculty**: `faculty@campus.edu` / `faculty123`
- **Admin**: `admin@campus.edu` / `admin123`
