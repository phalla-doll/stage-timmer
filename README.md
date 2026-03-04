# Stage Timer

A professional, high-contrast stage control system designed for event operators to seamlessly signal speakers on stage. Built with real-time synchronization, it ensures the speaker's display is always perfectly in sync with the operator's controls.

## Features

- **Real-Time Synchronization**: Powered by WebSockets (`socket.io`), ensuring zero-delay updates between the operator and the stage display.
- **Multiple Timer Modes**:
  - **Countdown**: Standard countdown timer with a visual progress bar.
  - **Countup**: Stopwatch style countup.
  - **Clock**: Displays the current local time.
- **Operator Dashboard**:
  - Tailored for iPad and tablet usage with large, touch-friendly controls.
  - **Quick Signals**: Send pre-defined, color-coded alerts ("SPEED UP", "WRAP UP", "TIME'S UP").
  - **Custom Messages**: Type and send any custom text to the speaker instantly.
  - **Display Effects**: Trigger a "Flash" effect to grab attention or "Invert" colors for maximum contrast.
- **Speaker Display**:
  - Massive, highly legible typography using the **Satoshi** font.
  - Tabular numbers prevent layout shifting during countdowns.
  - Clean, distraction-free interface that scales to any screen size.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Real-time**: Socket.io & Express (Custom Node.js server)
- **Styling**: Tailwind CSS v4
- **Typography**: Satoshi (Fontshare)
- **Icons**: Lucide React
- **Language**: TypeScript

## How to Use

1. **Create a Session**: Open the app and click "Create New Session".
2. **Share the Display**: Click "Open Display" to launch the speaker's view in a new tab or window. Move this window to the stage monitor and make it full-screen.
3. **Control the Stage**: Use the Operator dashboard to start/pause the timer, adjust the time, or send signals to the speaker.
4. **Join Existing**: Other operators can join the same session by entering the 6-character room code on the home page.
