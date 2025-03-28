import { fetchNotes, saveNotes } from "../data/notes.js";

class NoteList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.notes = [];
  }

  connectedCallback() {
    this.render();
    this.loadNotes();
    this.setupNoteAddedListener();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="style.css">
      <div class="note-list"></div>
    `;
  }

  setupNoteAddedListener() {
    document.addEventListener("note-added", (event) => {
      this.addNote(event.detail.title, event.detail.body);
    });
  }

  async loadNotes() {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    if (notes.length === 0) {
      notes = await fetchNotes();
      saveNotes(notes);
    }

    this.notes = notes;
    this.renderNotes();
  }

  addNote(title, body) {
    const newNote = {
      id: `notes-${Date.now()}`,
      title,
      body,
      createdAt: new Date().toISOString(),
      archived: false,
    };

    this.notes.push(newNote);
    saveNotes(this.notes);
    this.renderNotes();
  }

  renderNotes() {
    const listContainer = this.shadowRoot.querySelector(".note-list");
    listContainer.innerHTML = "";

    const sortedNotes = this.notes.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    sortedNotes.forEach((note) => {
      const noteItem = document.createElement("note-item");
      noteItem.setAttribute("title", note.title);
      noteItem.setAttribute("body", note.body);
      listContainer.appendChild(noteItem);
    });
  }
}

customElements.define("note-list", NoteList);
