const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 8080;

const CONTENT_PATH = path.join(__dirname, 'content.json');
const ADMIN_PASS = process.env.ADMIN_PASS || 'numbervi2024';

app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Ruta sin extensión para el panel admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Leer contenido
app.get('/api/content', (req, res) => {
  try {
    const data = fs.readFileSync(CONTENT_PATH, 'utf8');
    res.json(JSON.parse(data));
  } catch (e) {
    res.status(500).json({ error: 'No se pudo leer el contenido' });
  }
});

// Guardar contenido (protegido)
app.post('/api/content', (req, res) => {
  const { password, content } = req.body;
  if (password !== ADMIN_PASS) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }
  try {
    fs.writeFileSync(CONTENT_PATH, JSON.stringify(content, null, 2), 'utf8');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'No se pudo guardar' });
  }
});

// Verificar contraseña
app.post('/api/auth', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASS) {
    res.json({ ok: true });
  } else {
    res.status(401).json({ error: 'Contraseña incorrecta' });
  }
});

app.listen(PORT, () => {
  console.log(`NumberVi web corriendo en puerto ${PORT}`);
});
