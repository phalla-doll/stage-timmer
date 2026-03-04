# Stage Timer

A professional, high-contrast stage timer application designed for event operators to manage speakers' time and send real-time visual signals. Built for high legibility from a distance and instant real-time synchronization.

## Features

- **Real-Time Synchronization**: Instant, zero-latency updates between the Operator dashboard and the Speaker Display using Convex.
- **Multiple Timer Modes**: 
  - **Countdown**: Standard timer counting down to zero (with overtime tracking).
  - **Countup**: Stopwatch style counting up from zero.
  - **Clock**: Displays the current local time.
- **Visual Signals**: Send quick, color-coded signals to the speaker (e.g., "SPEED UP", "WRAP UP", "TIME'S UP").
- **Custom Messaging**: Type custom messages to display instantly on the screen.
- **Display Effects**:
  - **Flash**: Pulses the display to grab the speaker's attention.
  - **Invert**: Flips the display to a stark white background for maximum contrast.
  - **Animate**: Adds a subtle, breathing radial gradient background when a signal is sent.
- **Broadcast-Ready Typography**: Uses *Space Grotesk* for the UI and *IBM Plex Mono* for perfectly tabular, highly legible timer numbers.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19
- **Styling**: Tailwind CSS v4
- **Real-Time Backend & Database**: [Convex](https://convex.dev/)
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Space Grotesk, IBM Plex Mono)

## Getting Started

Because this project uses Convex for real-time state management, it is 100% Serverless-ready and can be hosted on platforms like Vercel.

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Convex (Backend)

Run the Convex development server. This will prompt you to log in (it's free), create a project, and it will automatically configure your `.env.local` file with the necessary `NEXT_PUBLIC_CONVEX_URL`.

```bash
npx convex dev
```

*Leave this terminal running in the background.*

### 3. Start the Next.js App

Open a new terminal window and start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment (Vercel)

This application is fully compatible with Vercel. To deploy:

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. In your Vercel project settings, add the following Environment Variables (you can find these in your local `.env.local` or Convex dashboard):
   - `NEXT_PUBLIC_CONVEX_URL`
   - `CONVEX_DEPLOYMENT`
4. **Important**: Update your Vercel Build Command to deploy the Convex functions alongside your Next.js app:
   ```bash
   npx convex deploy --cmd 'npm run build'
   ```
5. Deploy!

## Usage

1. **Create a Room**: Open the app and enter a custom 6-character Room Code (e.g., `MAIN01`) and click "Join Session".
2. **Open Display**: Click the "Open Display" button in the top right corner. Move this new window to your stage monitor/confidence monitor and make it fullscreen.
3. **Operate**: Use the Operator dashboard to start/pause the timer, change modes, and send signals to the display.
