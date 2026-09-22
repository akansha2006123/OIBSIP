# Worklist

A simple, attractive to-do list web app for organizing pending and completed tasks.

## Features

- Add new tasks
- Edit task names
- Mark tasks as completed or pending
- Delete tasks
- View pending and completed tasks on a separate page
- See task totals and status counts
- Track the time a task was completed
- Clear all completed tasks
- Light and dark mode
- Tasks persist in browser local storage
- Responsive layout for desktop and mobile

## Files

- `index.html` - Dashboard for adding tasks and viewing task statistics
- `tasks.html` - Separate page for pending and completed task lists
- `style.css` - Layout, responsive styles, themes, colors, and animations
- `script.js` - Task actions, local storage, theme switching, and rendering

## Run Locally

No build tools or dependencies are required.

1. Open `index.html` in a web browser.
2. Add a task using the input field.
3. Select `View task list` to manage pending and completed tasks.
4. Use the moon/sun button to switch between dark and light mode.

## Data Storage

Tasks and the selected theme are saved in the browser's `localStorage`. Data is stored only in the current browser and device.

## Browser Support

The app works in modern browsers with support for JavaScript and `localStorage`, including Chrome, Edge, Firefox, and Safari.
