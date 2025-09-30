// Placeholder Watch Party micro-app
export function mount(el, props) {
  el.innerHTML = `
    <div style="padding: 2rem; max-width: 800px; margin: 0 auto;">
      <h1>Watch Party</h1>
      <p>This is a placeholder for the Watch Party micro-app.</p>
      <p>Basename: ${props.basename || '/watchparty'}</p>
    </div>
  `;
  console.log('Watch Party app mounted with props:', props);
}

export function unmount(el) {
  el.innerHTML = '';
  console.log('Watch Party app unmounted');
}
