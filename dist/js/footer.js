const footerTemplate = document.createElement('template');

footerTemplate.innerHTML = `
<link rel="stylesheet" href="dist/css/adminlte.css">

<style>
.main-footer {
  background-color: #fff;
  border-top: 1px solid #dee2e6;
  color: #869099;
  padding: 1rem;
}
</style>

<footer class="main-footer" style="margin-left: 76px;">
<strong>&copy; 2023 BNE CONSULTING Co.</strong>

</footer>
`;

class Footer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const fontAwesome = document.querySelector('link[href*="font-awesome"]');
    const shadowRoot = this.attachShadow({ mode: 'closed' });

    if (fontAwesome) {
      shadowRoot.appendChild(fontAwesome.cloneNode());
    }

    shadowRoot.appendChild(footerTemplate.content);
  }
}

customElements.define('footer-component', Footer);