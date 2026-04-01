# White Board App

A React-based whiteboard application for freehand drawing, shapes, text, erasing, undo/redo, and image export.

## Features

- Draw with **Pen**
- Create **Line, Rectangle, Circle, Arrow**
- Add **Text** on canvas
- **Eraser** support (including pen strokes)
- **Stroke color**, **Fill color**, and **Size** controls
- **Undo / Redo** with history tracking
- Download canvas as **PNG**

## Tech Stack

- **React**
- **Context API + useReducer** (state management)
- **HTML5 Canvas API**
- **Rough.js** (hand-drawn style shapes)
- **CSS Modules**

## Project Structure

```text
src/
  components/
    Board/
    Toolbar/
    Toolbox/
    ui/
  store/
    BoardContext.jsx
    ToolboxContext.jsx
  utils/
    Element.js
    Math.js
    svgPathFromStroke.js
  Constants.js
  App.jsx
  main.jsx
```

## Getting Started

### 1) Clone the repository

```bash
git clone <your-repo-url>
cd "White Board App"
```

### 2) Install dependencies

```bash
npm install
```

### 3) Run development server

```bash
npm run dev
```

### 4) Build for production

```bash
npm run build
```

### 5) Preview production build

```bash
npm run preview
```

## Usage

- Select a tool from the toolbar.
- Customize stroke/fill/size from toolbox.
- Draw on canvas using mouse or trackpad.
- Use undo/redo for history navigation.
- Download the board as an image.

## Notes

- Text tool enters writing mode on click.
- Eraser uses near-element hit detection for all supported element types.
- Download export preserves canvas background by rendering to an export canvas first.

## License

This project is for learning and personal development use.
