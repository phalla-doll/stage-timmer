![Screenshot Preview](https://github.com/phalla-doll/stage-timmer/blob/main/public/og-image-main.png)

# Stage Timer

A professional, high-contrast stage timer application designed for event operators to manage speakers' time and send real-time visual signals. Built for high legibility from a distance and instant real-time synchronization.

## Features

- **Real-Time Synchronization**: Instant, zero-latency updates between the Operator dashboard and the Speaker Display using Convex.
- **Multiple Timer Modes**: 
  - **Countdown**: Standard timer counting down to zero (with overtime tracking).
  - **Countup**: Stopwatch style counting up from zero.
  - **Clock**: Displays the current local time.
- **Visual Signals**: Send quick, color-coded signals to the speaker (e.g., "SPEED UP", "WRAP UP", "TIME'S UP"). Signal colors can be customized via a toggleable settings menu.
- **Custom Messaging & Presets**: 
  - Type custom messages to display instantly on the screen.
  - Save frequently used messages as presets for one-click sending.
  - Presets are saved locally to your browser for future sessions.
- **Display Effects**:
  - **Flash**: Pulses the display to grab the speaker's attention.
  - **Invert**: Flips the display to a stark white background for maximum contrast.
  - **Animate**: Adds a subtle, breathing radial gradient background when a signal is sent.
- **Easy Sharing**: Built-in Share modal with a scannable QR code and one-click copyable link to instantly open the display on iPads, smart TVs, or other monitors.
- **Broadcast-Ready Typography & Layout**: 
  - Uses *Space Grotesk* for the UI and *Plus Jakarta Sans* for perfectly tabular, highly legible timer numbers and messages.
  - Mathematically centered flex layout ensures the timer and messages are always perfectly balanced on the Y-axis.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19
- **Styling**: Tailwind CSS v4
- **Real-Time Backend & Database**: [Convex](https://convex.dev/)
- **QR Codes**: react-qr-code
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Space Grotesk, Plus Jakarta Sans)

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
2. **Open Display**: Click the "Share" button in the top right corner to scan the QR code on a tablet, or copy the link to open it on a stage monitor. Make the display window fullscreen.
3. **Operate**: Use the Operator dashboard to start/pause the timer, change modes, send signals, and trigger custom message presets.
