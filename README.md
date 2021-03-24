# // TODO 
Simple todo app without any runtime dependencies.

See demo at [todo.syrjala.fi](https://todo.syrjala.fi/)

## Features
- Add / edit todo items
- Arrange items
  - Uses [HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) which currently has limited browser support. However, works well on Chrome Mobile and most modern desktop browsers.
- Currenty items are stored in localStorage
- Import / Export items as JSON

## Future improvements
- Arrange items with keyboard and improve keyboard navigation in general
- Sync with a cloud platform e.g. Google Drive or DropBox
- ~~Convert to Progressive Web App~~
