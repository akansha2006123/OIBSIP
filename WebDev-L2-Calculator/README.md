# Vanilla JavaScript Calculator

A browser-based calculator built with HTML, CSS, and vanilla JavaScript. It supports arithmetic expressions, operator chaining, decimal values, keyboard input, and a display that shows the full expression while it is being entered.

## Features

- Addition, subtraction, multiplication, division, and remainder operations
- Operator chaining, such as `2 + 3 * 4`
- Standard operator precedence: multiplication, division, and remainder are evaluated before addition and subtraction
- Full expression display, including entered operators
- Decimal number input
- `DEL` button and Backspace support
- `AC` button and Escape key to reset the calculator
- Enter key and `=` key to calculate the result
- Division-by-zero error handling
- Responsive calculator layout

## Project Files

| File | Description |
| --- | --- |
| `index.html` | Calculator markup, display, and buttons |
| `style.css` | Calculator layout and visual styling |
| `script.js` | Input handling, expression evaluation, chaining, and keyboard support |

## Run the Project

No installation or dependencies are required.

1. Open the project folder.
2. Open `index.html` in a modern web browser.
3. Use the buttons or your keyboard to perform calculations.

You can also open the project in VS Code and use a local server extension such as Live Server.

## Controls

| Control | Action |
| --- | --- |
| `AC` | Clear the calculator |
| `DEL` | Delete the last entered digit or operator |
| `%` | Calculate the remainder |
| `/`, `*`, `-`, `+` | Select an arithmetic operator |
| `.` | Enter a decimal point |
| `=` | Calculate the expression |
| `Backspace` | Delete the last input |
| `Escape` | Clear the calculator |
| `Enter` | Calculate the expression |

## Example

Entering the following sequence:

```text
2 + 3 * 4 =
```

produces:

```text
14
```

The calculator keeps the full expression visible while it is being entered and evaluates it when `=` or Enter is pressed.
