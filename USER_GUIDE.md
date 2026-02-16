There are 3 .env files, one for each app(backend, dashboard, public-verifier)
Paste respective .env files app.

after pasting the .env files, we are good to go

(Process----------)
from project root(ProductCodeScanner) navigate to cd backend:
cd backend (now in: ProductCodeScanner/backend)
1. install node module and run application in backend directory/ . 
npm i
npm run dev 

______-------------________________
**do same for other apps.

# 🛡️ GuardHub: User & Setup Guide

Welcome to **GuardHub**! This guide will help you understand what this application is, what tools it uses, and how to get it running on your computer—even if you're not a "techy" person.

---




## 🌟 What is GuardHub?

GuardHub is a high-security system designed to prevent counterfeit products. 
- **The Dashboard**: A command center for brand owners to register products and track "Hotspots" (where scans are happening).
- **The Public Verifier**: A web portal for customers to scan QR codes or enter codes to check if a product is genuine.

---

## 🧰 The Tool Kit (Tech Stack)

We used modern, industry-standard tools to build this:

1.  **Frontend (The Visuals)**: 
    - **React & Vite**: The "engine" that makes the website fast and interactive.
    - **Tailwind CSS**: A styling tool that gives the dashboard its bold, industrial "Brutalist" look and the verifier its sleek dark mode.
    - **Lucide React**: A collection of beautiful, sharp icons used throughout the app.
    - **Recharts**: Used to create those cool data graphs on your overview page.

2.  **Backend (The Brain)**:
    - **Node.js & Express**: This is the "brain" that lives on the server. it handles all the logic, like checking if a code is valid.

3.  **Database (The Filing Cabinet)**:
    - **PostgreSQL**: A professional-grade database where all your product information and scan history are safely stored.
    - **Prisma**: A tool that helps the "brain" talk to the "filing cabinet" easily.

4.  **Third-Party Magic (APIs)**:
    - **Google Maps Platform**: We used the Google Maps API to power the "Hotspots" map, showing you exactly where your products are being scanned globally.
    - **HTML5-QRCode**: The specialized tool that allows your phone or laptop camera to read QR codes directly in the browser.

---

## 🚀 How to Run the Application

Follow these steps to get everything started:

### 1. The Essentials (Prerequisites)
Make sure you have these installed on your computer:
- **Node.js**: [Download it here](https://nodejs.org/). This allows your computer to run the JavaScript code.
- **PostgreSQL**: You'll need a database running. You can use a tool like **pgAdmin** or a cloud database.

### 2. Setting the "Secret Keys" (Setup)
You'll see files named `.env.example` in the folders. You need to create a new file named `.env` in the following folders:
- `backend/`
- `dashboard/`
- `public-verifier/`

In these files, you'll put your database connection link and your Google Maps API key (we'll provide a template).

### 3. "Cooking" the App (Installation)
Open your terminal (Command Prompt or PowerShell) and for each of the 3 folders (`backend`, `dashboard`, `public-verifier`), type:
```bash
npm install
```
This downloads all the "ingredients" needed for that part of the app.

### 4. Serving it Up (Running)
In your terminal, go into each folder and run:
```bash
npm run dev
```

- your **Backend** will live at `http://localhost:5000`
- your **Admin Dashboard** will be at `http://localhost:5173`
- your **Public Verifier** will be at `http://localhost:5174` (or similar)

---

## 🎯 Quick Start Summary
- **Admin**: Go to the Dashboard to add products manually or via Bulk Upload (CSV).
- **Public**: Use the Verifier portal to scan a code. If the scan is genuine, you'll see a big green checkmark!
- **Track**: Check the "Hotspots" page to see a world map of where your products are being scanned.

**Stay Secure!** 🛡️



