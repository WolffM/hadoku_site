// Placeholder Home micro-app
export function mount(el, props) {
  el.innerHTML = `
    <div style="padding: 2rem; max-width: 800px; margin: 0 auto;">
      <h1>Welcome to Hadoku</h1>
      <p>This is a placeholder for the Home micro-app.</p>
      <p>Basename: ${props.basename || '/'}</p>
      <div style="margin-top: 2rem; padding: 1rem; background: #f0f0f0; border-radius: 4px;">
        <h3>Instructions for micro-app developers:</h3>
        <ul style="margin-left: 1.5rem;">
          <li>Implement a <code>mount(el, props)</code> function that renders your app into the provided element</li>
          <li>Optionally implement an <code>unmount(el)</code> function for cleanup</li>
          <li>Build your app as an ES module</li>
          <li>Deploy to the <code>/mf/[app-name]/</code> directory</li>
        </ul>
      </div>
    </div>
  `;
  console.log('Home app mounted with props:', props);
}

export function unmount(el) {
  el.innerHTML = '';
  console.log('Home app unmounted');
}
