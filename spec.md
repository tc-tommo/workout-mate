# Workout App Specification

## Overview
A React-based workout application that guides users through various workout routines in an interactive, story-like interface.


### Rationale
So the rationale for this is that we want it to be as familiar to as many users as possible. And obviously sort of piggybacking off of the UX design of Instagram or Snapchat, this is going to be very familiar to a lot of people. So that's the kind of reason that we'd want to lay it out this way.

## Data Structure
- Workout data stored in a tab-separated values (TSV) file: `workout.tsv`
- Hierarchical organization: Workout Categories → Exercises → Sets

## Main Features

### Home Screen
- [x] Grid layout of cards representing different workout categories
- [x] Categories in the example data include: Beginner, Intermediate, Advanced, Tumbler, Plyo, etc.
- [x] Each card displays the name of the workout category

### Workout View
- [x] Instagram/Snapchat story-style interface
- [x] Displays:
  - [x] Looping video of the current exercise
  - [x] Set number
  - [x] Rep count or timer

### Navigation
- [x] Tap right side of screen: Advance to next set or rest period
- [x] Tap left side of screen: Go to previous set or rest period
- [x] Swipe right to left: Move to next exercise
- [x] Swipe left to right: Move to previous exercise

### Exercise Types
- [x] Rep-based exercises: Display number of repetitions to complete
- [x] Time-based exercises: Display countdown timer (e.g., planks, isometric holds)
- [x] Stopwatch if its a rep based exercise
- [x] Countdown timer if its a time based exercise (automatic transition to next set when timer completes)

### Rest Periods
- [x] Timer displayed between sets
- [x] Automatic transition to next set when timer completes

## Extensions if there's time
- [ ] Progress tracking
    - [ ] Users can swipe up from the rest view to record metrics for their previous exercise, similar to adding a comment to a story but with a multi input form
    - [x] Metrics to track include:
      - [x] Number of reps completed
      - [x] Weight used
      - [ ] Other  exercise data for example bar velocity, etc.
    - [ ] All data will be stored locally on the user's device
    - [ ] Options to export data for:
      - [ ] Synchronization with other devices
      - [ ] Sharing with coaches or training partners
    - [ ] Primary use case is designed for mobile phone workouts
    - [ ] A key motivation for this design approach is ensuring users maintain complete control over their data and selection options, which is a priority for this redesign
- [ ] Social features (sharing, leaderboard)




# Structure

/my-workout-app
├── public
│   ├── index.html                 // HTML entry point for the React app
│   └── ...                        // Other static assets if needed
├── src
│   ├── index.tsx                   // Main entry point that bootstraps the app
│   ├── App.tsx                     // Root component, includes routes and global state
│   ├── components                 // Reusable UI components
│   │   ├── WorkoutCategoryCard.tsx // Card component for each workout category on the Home Screen
│   │   ├── VideoPlayer.tsx         // Component for looping exercise videos
│   │   ├── Timer.tsx               // Displays count-down or stopwatch
│   │   └── ExerciseInfo.tsx        // Renders set number, rep count or timer info
│   ├── views                      // Screen-level components (containers)
│   │   ├── HomeScreen.tsx          // Displays the grid of workout categories
│   │   └── WorkoutView.tsx         // Story-like interface for workouts
│   ├── data                       // Data files, including the TSV for workout routines
│   │   └── workout.tsv
│   ├── utils                      // Utility functions and helpers
│   │   └── dataParser.ts          // Functions to parse the TSV file into usable data structures
│   └── styles                     // CSS files or styled-components styling
│       └── main.css
├── notes
│   └── spec.md                    // Your project specification documentation
├── package.json                   // Project configuration and dependencies
└── README.md                      // Project overview/instructions


## Framework
- Astro
- TypeScript

