import { fetchNotes, saveNotes } from "../data/notes.js";

class NotesApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.loadNotes();
    this.setupValidation();
  }

  setupValidation() {
    const titleInput = this.shadowRoot.querySelector("#title");
    const bodyInput = this.shadowRoot.querySelector("#body");
    const titleError = this.shadowRoot.querySelector("#title-error");
    const bodyError = this.shadowRoot.querySelector("#body-error");

    const validateInput = (input, errorElement, minLength) => {
      input.addEventListener("input", () => {
        if (input.value.length < minLength) {
          input.classList.add("error");
          errorElement.classList.add("show");
          errorElement.textContent = `Minimal ${minLength} karakter`;
        } else {
          input.classList.remove("error");
          errorElement.classList.remove("show");
        }
      });
    };

    validateInput(titleInput, titleError, 5);
    validateInput(bodyInput, bodyError, 10);
  }

  async loadNotes() {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    if (notes.length === 0) {
      notes = await fetchNotes();
      saveNotes(notes);
    }

    this.renderNotes(notes);
  }

  renderNotes(notes) {
    const listContainer = this.shadowRoot.querySelector(".note-list");
    listContainer.innerHTML = "";

    notes.forEach((note) => {
      const noteItem = document.createElement("note-item");
      noteItem.setAttribute("title", note.title);
      noteItem.setAttribute("body", note.body);
      listContainer.appendChild(noteItem);
    });
  }

  addNote(title, body) {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const newNote = {
      id: `notes-${Date.now()}`,
      title,
      body,
      createdAt: new Date().toISOString(),
      archived: false,
    };

    notes.push(newNote);
    saveNotes(notes);
    this.renderNotes(notes);
  }

  handleFormSubmit(event) {
    event.preventDefault();
    const titleInput = this.shadowRoot.querySelector("#title");
    const bodyInput = this.shadowRoot.querySelector("#body");

    if (titleInput.value.length < 5 || bodyInput.value.length < 10) {
      alert("Judul minimal 5 karakter, isi minimal 10 karakter!");
      return;
    }

    this.addNote(titleInput.value, bodyInput.value);
    titleInput.value = "";
    bodyInput.value = "";
  }

  render() {
    this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="style.css">
        
        <h1 class="app-title">My Notes</h1>
        
        <div class="notes-container">
          <form id="note-form">
              <input type="text" id="title" placeholder="Judul Catatan" required>
              <div id="title-error" class="error-message"></div>
              
              <textarea id="body" placeholder="Isi Catatan" required></textarea>
              <div id="body-error" class="error-message"></div>
              
              <button type="submit">Tambah Catatan</button>
          </form>
          
          <div class="note-list"></div>
        </div>
    `;

    this.shadowRoot
      .querySelector("#note-form")
      .addEventListener("submit", (event) => this.handleFormSubmit(event));
  }
}

customElements.define("notes-app", NotesApp);
