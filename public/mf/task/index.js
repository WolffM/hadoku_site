// Placeholder Task micro-app
export function mount(el, props) {
  el.innerHTML = `
    <div style="padding: 2rem; max-width: 800px; margin: 0 auto;">
      <h1>Task Manager</h1>
      <p>This is a placeholder for the Task micro-app.</p>
      <p>Basename: ${props.basename || '/task'}</p>
    </div>
  `;
  console.log('Task app mounted with props:', props);
}

export function unmount(el) {
  el.innerHTML = '';
  console.log('Task app unmounted');
}
