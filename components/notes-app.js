class NotesApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="style.css">
      
      <h1 class="app-title">My Notes</h1>
      
      <div class="notes-container">
        <note-form></note-form>
        <note-list></note-list>
      </div>
    `;
  }
}

customElements.define("notes-app", NotesApp);
