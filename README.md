# Renewable Energy Dashboard

A complete, production-ready frontend for a Renewable Energy Dashboard built with React, Vite, Tailwind CSS, and Recharts.

## Features

- **Real-Time Data Simulation**: Periodically polls and generates real-time telemetry metrics with variations.
- **Robust Error Handling**: Complete error boundaries that prevent full app crashes.
- **Dynamic Charting**: Recharts-based visualizations over multiple dimensions (line, pie, bar).
- **Graceful Fallbacks**: Implements automatic fallback to mock data when API networks are unavailable or keys are omitted.
- **Theme & Persistence**: Dark mode and user-preferences serialized through robust LocalStorage integration.
- **Modular Frontend Architecture**: Composed using highly cohesive React contexts and functional React hooks.
- **Styling**: Tailored utility classes using TailwindCSS, guaranteeing rapid scalability.

## Installation

1. Clone or copy the downloaded project.
2. Ensure you have Node.js installed.
3. Move into the project directory.

\`\`\`bash
cd renewable-energy-dashboard
\`\`\`

4. Install Dependencies

\`\`\`bash
npm install
\`\`\`

5. (Optional) Provide API Keys.
   Copy the \`.env.example\` file to \`.env\` and add valid OpenWeather and NASA POWER credentials, OR leave blank to preview the automatic fallback mechanism.

\`\`\`bash
cp .env.example .env
\`\`\`

6. Run the Dev Server

\`\`\`bash
npm run dev
\`\`\`

7. Visit the indicated local URL (typically \`http://localhost:5173\`) in your web browser.

## Built With 🛠

- [React 18](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [Framer Motion](https://www.framer.com/motion/)
