# 🗓️ Wall Calendar — Interactive Premium UI Experience

A **modern, highly interactive Wall Calendar Web App** built using **React + TypeScript + Vite**, designed with a focus on **smooth UX, clean architecture, and scalable frontend engineering**.

This project showcases **real-world frontend skills**, including custom hooks, modular architecture, and state management.

---

## 🌐 Live Demo

🔗 https://calendar-eta-rosy.vercel.app/

--- 

## ✨ Features

### 📅 Calendar System
- Dynamic monthly calendar rendering  
- Accurate date calculations  
- Month navigation (previous / next)  
- Today highlighting  

---

### 🎯 Date Range Selection
- Select start and end dates  
- Smooth range highlighting  
- Clean interaction handling  

---

### 📝 Notes System
- Add notes to selected dates  
- Persistent storage using `localStorage`  
- Global state management  

---

### 🎨 UI & Experience
- Clean and minimal design  
- Responsive layout  
- Smooth interactions  
- Component-based structure  

---

### 🧠 Custom Hooks (Core Strength)

- `useCalendar` → Calendar logic  
- `useDateRange` → Date range handling  
- `useNotes` → Notes management  

---

### 🗂️ State Management

- Centralized store  
- `notesSlice` for notes handling  

---

### 📊 Data Layer

- `holidays.ts` → Holiday data  
- `monthThemes.ts` → Theme configuration  

---

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript  
- **Build Tool:** Vite  
- **Styling:** CSS  
- **State:** Custom store  
- **Persistence:** localStorage  

---

## 📂 Project Structure

```bash
calendar/
│
├── public/
│
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│
│   ├── components/
│   │   ├── Calendar/
│   │   ├── WallCalendar.tsx
│   │   └── WallCalendar.css
│
│   ├── data/
│   │   ├── holidays.ts
│   │   └── monthThemes.ts
│
│   ├── hooks/
│   │   ├── useCalendar.ts
│   │   ├── useDateRange.ts
│   │   └── useNotes.ts
│
│   ├── store/
│   │   ├── index.ts
│   │   └── notesSlice.ts
│
│   ├── App.tsx
│   ├── main.tsx
│   ├── App.css
│   └── index.css
│
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── netlify.toml
## ⚡ Getting Started

<details>
<summary>🚀 Click to expand setup instructions</summary>

<br/>

### 1. Clone the repository

```bash
git clone https://github.com/rithinreddy0/calendar.git
cd calendar
2. Install dependencies
Bash
npm install
3. Run the development server
Bash
npm run dev
4. Open in browser

http://localhost:5173/
5. Build for production
Bash
npm run build
6. Preview production build
Bash
npm run preview
�

📦 Requirements
Node.js >= 16
npm / yarn
