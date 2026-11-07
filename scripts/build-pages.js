const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = path.join(ROOT, '_site');

// Limpa e recria _site
fs.rmSync(SITE, { recursive: true, force: true });
fs.mkdirSync(path.join(SITE, 'lib'), { recursive: true });

// Copia src/public/* para _site/
fs.cpSync(path.join(ROOT, 'src', 'public'), SITE, { recursive: true });

// Copia utils, services, storage, api, demo para _site/lib/
for (const dir of ['utils', 'services', 'storage', 'api', 'demo']) {
  const srcDir = path.join(ROOT, 'src', dir);
  if (fs.existsSync(srcDir)) {
    fs.cpSync(srcDir, path.join(SITE, 'lib', dir), { recursive: true });
  }
}

// Copia package.json para _site/lib/package.json
fs.copyFileSync(path.join(ROOT, 'package.json'), path.join(SITE, 'lib', 'package.json'));

// Injeta o banner de demonstração e o script de boot no index.html
const banner = '<div class="demo-banner">Modo demonstração: os dados ficam salvos só neste navegador. Para rodar com a API Node, veja o <a href="https://github.com/gabresantts/habitflow#readme">README</a>.</div>';

let html = fs.readFileSync(path.join(SITE, 'index.html'), 'utf-8');
html = html.replace('<body>', `<body>\n  ${banner}`);
html = html.replace(
  '<script src="app.client.js"></script>',
  '<script src="lib/demo/boot.js"></script>\n  <script src="app.client.js"></script>'
);

fs.writeFileSync(path.join(SITE, 'index.html'), html, 'utf-8');
console.log('GitHub Pages build concluído com sucesso em _site/');
