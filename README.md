<div align="center">
  <h1>🛒 CityCart E-Commerce Platform</h1>
  <p><strong>A Modern, High-Performance E-Commerce Solution</strong></p>
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](#)
  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](#)
  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](#)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](#)
</div>

<br />

## 🌟 Overview

CityCart is a full-stack, production-ready e-commerce platform built to deliver a seamless shopping experience. Designed with a mobile-first philosophy, it features a highly responsive UI modeled after industry leaders like Amazon, alongside a robust and scalable backend API.

## ✨ Key Features

- **Modern & Responsive UI**: Beautiful glassmorphism design, smooth micro-animations, and a fully mobile-optimized interface (sliding sidebars, touch-friendly product grids).
- **Secure Authentication**: Robust JWT-based authentication system with encrypted cookies and persistent sessions.
- **Product Discovery**: Dynamic product categorization, search functionality, and daily deals.
- **Shopping Mechanics**: Real-time cart management, persistent wishlists, and a seamless checkout flow.
- **Admin Capabilities**: Built-in authorization roles for inventory management and order tracking.

## 🛠️ Technology Stack

This project utilizes a modern monorepo architecture divided into scalable frontend and backend applications.

### Frontend (`apps/web`)
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Custom Design System)
- **State Management**: React Context API

### Backend (`apps/api`)
- **Framework**: Node.js & Express
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JSON Web Tokens (JWT) & bcrypt

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ecommerce-platform.git
   cd ecommerce-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory based on `.env.example`.
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"
   JWT_SECRET="your_super_secret_key"
   NEXT_PUBLIC_API_URL="http://localhost:4000"
   ```

4. **Initialize Database**
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```

5. **Start Development Servers**
   ```bash
   # Starts both frontend (port 3000) and backend API (port 4000)
   npm run dev
   ```

## 📦 Deployment Architecture

- **Frontend Hosting**: Optimized for [Vercel](https://vercel.com/)
- **Backend API**: Optimized for [Render](https://render.com/) or Railway
- **Database**: [Neon.tech](https://neon.tech/) Serverless Postgres

*(See environment templates `.env.staging` and `.env.production` in the root directory for cross-domain configurations).*
