# GlyceraCare Website

GlyceraCare is a modern web project that showcases the brand's commitment to natural skincare through an interactive and visually appealing online experience. The website features a 3D interactive background, an Instagram gallery, and an admin image manager.

## Technologies Used

<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" height="30" alt="html5 logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" height="30" alt="css3 logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="30" alt="javascript logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" height="30" alt="typescript logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="30" alt="react logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original-wordmark.svg" height="30" alt="tailwindcss logo"  />
</div>

## Live Link
https://aarav2002.github.io/Glyceracare/

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Copyright](#copyright)

## Overview

GlyceraCare was founded with a mission to create the finest natural soaps using traditional methods and sustainable ingredients. The website reflects this ethos with an engaging design that highlights the brand's values and products.

## Features

- **3D Interactive Background**: Provides an immersive experience using Spline.
- **Instagram Gallery**: Displays images dynamically fetched from the database.
- **Admin Image Manager**: Allows authorized users to manage gallery images.
- **Responsive Design**: Fully optimized for mobile and desktop devices.

## Technologies Used

- **React.js**: Core framework for building the website's UI.
- **Tailwind CSS**: For responsive and modern styling.
- **Spline Viewer**: Embeds a 3D interactive background.
- **Supabase**: Handles database operations for image management and admin authentication.
- **React Context API**: Manages authentication state.

## Installation

Follow these steps to set up the project locally:

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/glyceracare.git
   cd glyceraCare
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Supabase credentials:

   ```env
   REACT_APP_SUPABASE_URL=your-supabase-url
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Run the development server:

   ```sh
   npm run dev
   ```

5. Open your browser and visit `http://localhost:3000` to see the website.

## Usage

- Navigate through the website to explore products and brand values.
- Admin users can log in to access the image management dashboard.
- Interact with the 3D background for an engaging user experience.

## Project Structure

```
.
├── public
│   ├── index.html
│   ├── favicon.ico
├── src
│   ├── components
│   │   ├── admin
│   │   │   ├── ContactManager.tsx
│   │   │   ├── ImageManager.tsx
│   │   │   ├── ProductManager.tsx
│   │   ├── AuthModal.tsx
│   │   ├── CartModal.tsx
│   │   ├── CartPage.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── InstagramGallery.tsx
│   │   ├── Navbar.tsx
│   │   ├── Process.tsx
│   │   ├── ProductCard.tsx
│   │   ├── Products.tsx
│   │   ├── ProtectedAdminRoute.tsx
│   │   ├── ProtectedRoute.tsx
│   ├── context
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   ├── data
│   │   ├── products.ts
│   ├── lib
│   ├── pages
│   │   ├── AboutPage.tsx
│   │   ├── AdminPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── ProcessPage.tsx
│   │   ├── ProductsPage.tsx
│   ├── App.tsx
│   ├── index.tsx
│   ├── styles
│   │   └── globals.css
├── .env
├── package.json
├── README.md

```


## Copyright

© 2025 GlyceraCare. All rights reserved.
