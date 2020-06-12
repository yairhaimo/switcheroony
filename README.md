# Switcheroony

Easily switch between implementation, tests, styles and drivers.

### Commands

The extension has three commands:

- Switch to the Test File: `ctrl+opt+down`
- Switch to the Implementation File: `ctrl+opt+up`
- Switch to the Driver File: `ctrl+opt+right`
- Switch to the Style File: `ctrl+opt+left`

#### Logic

- Implementation File - looks for files with the name of the directory with an optional `.comp` keyword. If none is found, look for an `index` file
- Test File - looks for files containing the word `spec` or `test`
- Driver - looks for files with the word `driver`
- Style - looks for `sass`, `scss`, `css`, `less` files
