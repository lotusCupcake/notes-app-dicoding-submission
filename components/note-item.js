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
            <style>
                note-item {
                    display: block;
                    background: #800000;
                    padding: 15px;
                    border-radius: 8px;
                }
                h3 { margin: 0 0 10px; }
                p { margin: 0; }
            </style>
            <div>
                <h3>${this.getAttribute("title")}</h3>
                <p>${this.getAttribute("body")}</p>
            </div>
        `;
  }
}

customElements.define("note-item", NoteItem);
