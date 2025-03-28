class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupValidation();
    this.setupSubmitListener();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="style.css">
      
      <form id="note-form">
        <input type="text" id="title" placeholder="Judul Catatan" required>
        <div id="title-error" class="error-message"></div>
        
        <textarea id="body" placeholder="Isi Catatan" required></textarea>
        <div id="body-error" class="error-message"></div>
        
        <button type="submit">Tambah Catatan</button>
      </form>
    `;
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

  setupSubmitListener() {
    const form = this.shadowRoot.querySelector("#note-form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const titleInput = this.shadowRoot.querySelector("#title");
      const bodyInput = this.shadowRoot.querySelector("#body");

      if (titleInput.value.length < 5 || bodyInput.value.length < 10) {
        alert("Judul minimal 5 karakter, isi minimal 10 karakter!");
        return;
      }

      const noteEvent = new CustomEvent("note-added", {
        detail: {
          title: titleInput.value,
          body: bodyInput.value,
        },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(noteEvent);

      titleInput.value = "";
      bodyInput.value = "";
    });
  }
}

customElements.define("note-form", NoteForm);
