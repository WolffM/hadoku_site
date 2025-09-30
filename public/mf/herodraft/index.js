// Placeholder Hero Draft micro-app
export function mount(el, props) {
  el.innerHTML = `
    <div style="padding: 2rem; max-width: 800px; margin: 0 auto;">
      <h1>Hero Draft</h1>
      <p>This is a placeholder for the Hero Draft micro-app.</p>
      <p>Basename: ${props.basename || '/herodraft'}</p>
    </div>
  `;
  console.log('Hero Draft app mounted with props:', props);
}

export function unmount(el) {
  el.innerHTML = '';
  console.log('Hero Draft app unmounted');
}
