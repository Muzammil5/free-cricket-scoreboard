# Easy Cricket Scoreboard

A simple and intuitive cricket scoreboard maintenance application built with React and Vite.

## Features

- **Score Tracking**: Maintain runs, wickets, and extras
- **Over Management**: Automatic over progression (6 balls per over)
- **Easy Button Interface**: Click buttons for different cricket events:
  - Runs: 1, 2, 3, 4, 6
  - Extras: Wide, No Ball
  - Other: Wicket, Dot Ball
- **Reset Functionality**: Reset the entire match with one click
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd easy-cricket-scoreboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

- Click the run buttons (1, 2, 3, 4, 6) to add runs to the score
- Click "Wide" or "No Ball" to add extras (these don't count as balls)
- Click "Wicket" to add a wicket
- Click "Dot Ball" to record a dot ball
- Click "Reset Match" to start a new match

## Technologies Used

- React 19
- Vite
- CSS3 with modern styling
- Responsive design principles

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

This project is open source and available under the MIT License.
