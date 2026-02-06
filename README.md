# Pomodoro Focus Timer

![HTML5 Badge](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3 Badge](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![TypeScript Badge](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS Badge](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite Badge](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Bun Badge](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)

A highly customizable productivity timer built to enforce effective study habits. It features strict timeboxing rules, immersive atmospheric effects, and full aesthetic control via TypeScript and Tailwind CSS.

## 🔗 Links

- **Live Demo Link:** https://e3prime.github.io/pomodoro

## ⏳ Pomodoro Focus Atmosphere Showcase

<img src="public/pomodoro.gif" width="400" alt="Pomodoro App Demo" />

_Features a calming particle atmosphere and a circular progress ring that visualizes time remaining._

## 🧐 About The Project

This application is a study companion designed to keep users in a state of flow. Built with **TypeScript**, it enforces specific "productivity rules" to ensure breaks don't turn into distractions.

Users can toggle between three modes, pause/reset the timer, and customize the look and feel of the application to match their personal aesthetic (Minimalist, Cyberpunk, or Classic).

### Key Features

- **Strict Timeboxing Logic:**
  - **Pomodoro:** Flexible focus time (1 - 99 minutes).
  - **Short Break:** Enforces a 15 - 30 minute window.
  - **Long Break:** Enforces a 30 - 60 minute window.
  - **Validation:** Prevents invalid inputs (blank, zero, out-of-bounds, or characters) with custom error messages.
- **Immersive Visuals:**
  - **Canvas Particles:** A background system of rotating, floating particles creates a "Focus/Chill" atmosphere.
  - **Circular Progress Bar:** A dynamic SVG ring depletes in real-time, pulsing and fading out when the timer hits zero.
- **Audio Feedback:** Plays a distinct sound effect upon completion to alert the user.
- **Full Customization (Settings Modal):**
  - **Fonts:** Select between 3 distinct typefaces (Modern, Futuristic, Fancy).
  - **Colors:** Choose a primary accent color that updates the progress bar and active UI elements instantly.
