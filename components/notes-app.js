import { fetchNotes, saveNotes } from "../data/notes.js";

class NotesApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.loadNotes();
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
        
        <form id="note-form">
            <input type="text" id="title" placeholder="Judul Catatan" required>
            <textarea id="body" placeholder="Isi Catatan" required></textarea>
            <button type="submit">Tambah Catatan</button>
        </form>
        <div class="note-list"></div>
    `;

    this.shadowRoot
      .querySelector("#note-form")
      .addEventListener("submit", (event) => this.handleFormSubmit(event));
  }
}

customElements.define("notes-app", NotesApp);
