// Placeholder Contact micro-app
export function mount(el, props) {
  el.innerHTML = `
    <div style="padding: 2rem; max-width: 800px; margin: 0 auto;">
      <h1>Contact</h1>
      <p>This is a placeholder for the Contact micro-app.</p>
      <p>Basename: ${props.basename || '/contact'}</p>
    </div>
  `;
  console.log('Contact app mounted with props:', props);
}

export function unmount(el) {
  el.innerHTML = '';
  console.log('Contact app unmounted');
}
