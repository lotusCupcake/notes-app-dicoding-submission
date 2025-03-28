class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["title", "body"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="style.css">
      <div>
        <h3>${this.getAttribute("title")}</h3>
        <p>${this.getAttribute("body")}</p>
      </div>
    `;
  }
}

customElements.define("note-item", NoteItem);
