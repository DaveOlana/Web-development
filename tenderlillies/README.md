# Tenderlillies School Website

## Project Overview

This repository contains the source code for the Tenderlillies static school website. The architecture prioritizes performance, security, and maintainability, utilizing a modern frontend stack without the overhead of a traditional backend or database.

### Tech Stack

*   **Markup:** HTML5
*   **Styling:** Tailwind CSS
*   **Interactivity:** Vanilla JavaScript
*   **Data Management (Notice Board):** JSON
*   **Hosting & Deployment:** Vercel

## Site Architecture

The application is structured into five primary pages:

1.  **Home:** Features a high-quality, full-width hero section with a dark overlay, prominent typography, and a clear call-to-action. Includes highlights of programs and facilities.
2.  **About:** Details the school's history, mission, vision, core values, and facilities.
3.  **Programs:** A responsive grid layout detailing the available academic programs (e.g., Nursery, Primary, Secondary).
4.  **Admissions:** Outlines the step-by-step admission process, requirements, and term dates.
5.  **Contact:** Provides essential contact information, including phone numbers, email, physical address, and an embedded map map.

### Global Components

*   **Navbar:** Sticky top navigation with brand logo, primary links, and a mobile-responsive hamburger menu.
*   **Footer:** Comprehensive footer section containing quick links, contact information, social media links, and copyright notices.

## Core Feature: Dynamic Notice Board Concept

The Notice Board operates as a dynamic system within the static site architecture, utilizing Vanilla JavaScript to fetch and render data from a structured JSON template.

*   **Behavior:** Renders as a centralized modal popup upon page load.
*   **UI/UX:** Utilizes a dark overlay, is dismissible via UI button or keyboard (`Esc`), and strictly maintains aspect ratios for media content.
*   **Data Handling:** Fetches entries from an external JSON file, sorts sequentially by date, and renders the latest entry.
*   **Content Support:** Dynamically renders plain text, lists, images, or mixed media based on the JSON `type` attribute.

## Design System

The UI is built on a consistent Tailwind CSS design system to ensure visual cohesion.

*   **Color Palette:** Primary Blue (`bg-blue-700`), Accent Yellow (`bg-yellow-400`), and Neutrals (white, grays).
*   **Typography:** Prominent headings (`text-3xl`, `md:text-5xl`) paired with standard legible body copy (`text-gray-600`).
*   **Layout:** Standardized section spacing (`py-16`, `px-4`, `md:px-12`) and responsive grid implementations (`max-w-7xl mx-auto`).
*   **Media:** Mobile-first image handling (`w-full`, `object-cover`) to prevent layout shifts or overflow, particularly within modals.

## Deployment Pipeline

The project utilizes a continuous deployment model:

1.  Local Development & Testing
2.  Version Control via GitHub
3.  Automated Deployment via Vercel
4.  Custom Domain Routing (`.com.ng`)

## Security Posture

As a static site, the application intrinsically mitigates standard backend vulnerabilities (e.g., SQL injection, exposed authentication endpoints). Security measures are strictly focused on infrastructure access controls, requiring robust password policies and 2FA across GitHub, Vercel, and the domain registrar.

## Future Roadmap

The architecture is designed to be extensible to accommodate future requirements:
*   Integration with a Headless CMS (e.g., Sanity, Netlify CMS)
*   Implementation of dynamic Blog/News routes
*   Dedicated Media/Gallery indexing
