class HadokuHeader extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	connectedCallback() {
		const currentPath = window.location.pathname;

		this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        nav {
          background-color: #1a1a2e;
          padding: 1rem 2rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        ul {
          list-style: none;
          display: flex;
          gap: 2rem;
          align-items: center;
          margin: 0;
          padding: 0;
        }
        li {
          display: inline;
        }
        a {
          color: #e0e0e0;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          transition: background-color 0.3s ease, color 0.3s ease;
          font-weight: 500;
        }
        a:hover {
          background-color: #16213e;
          color: #fff;
        }
        a.active {
          background-color: #0f3460;
          color: #fff;
        }
        .logo {
          font-weight: bold;
          font-size: 1.2rem;
          color: #4a9eff;
        }
      </style>
      <nav>
        <ul>
          <li><span class="logo">Hadoku</span></li>
          <li><a href="/" class="${currentPath === '/' ? 'active' : ''}">Home</a></li>
          <li><a href="/watchparty/" class="${currentPath.startsWith('/watchparty') ? 'active' : ''}">Watch Party</a></li>
          <li><a href="/task/" class="${currentPath.startsWith('/task') ? 'active' : ''}">Task</a></li>
          <li><a href="/contact/" class="${currentPath.startsWith('/contact') ? 'active' : ''}">Contact</a></li>
          <li><a href="/herodraft/" class="${currentPath.startsWith('/herodraft') ? 'active' : ''}">Hero Draft</a></li>
        </ul>
      </nav>
    `;
	}
}

if (!customElements.get('hadoku-header')) {
	customElements.define('hadoku-header', HadokuHeader);
}
