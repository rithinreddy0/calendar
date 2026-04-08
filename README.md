# 🗓️ Wall Calendar — Interactive Premium UI Experience

A **modern, highly interactive Wall Calendar Web App** built using **React + TypeScript + Vite**, designed with a focus on **smooth UX, clean architecture, and scalable frontend engineering**.

This project showcases **real-world frontend skills**, including custom hooks, modular architecture, and state management.

---

## 🌐 Live Demo

🔗 https://calendar-eta-rosy.vercel.app/

---

## 📸 Preview

> Add GIF or screenshots here (very important for recruiters)

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
