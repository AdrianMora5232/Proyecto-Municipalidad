const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'public', 'services', 'db.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const collections = ['reportes', 'servicios', 'usuarios', 'proyectos'];

const createInitialDb = () => ({
  reportes: [
    {
      id: 1,
      tipo: 'Bache',
      ubicacion: 'San Rafael, avenida central',
      estado: 'Pendiente',
      prioridad: 'Alta'

    }
  ],
  servicios: [
    {
      id: 1,
      tipo: 'Recolección de Residuos',
      descripcion: 'Recolección de basura ordinaria en zona norte',
      responsable: 'Gestión Ambiental',
      estado: 'Activo'
    }
  ],
  usuarios: [
    {
      id: 1,
      nombre: 'Administrador',
      email: 'admin@escazu.go.cr',
      password: 'admin', // Default password
      rol: 'Admin'
    }
  ],
  proyectos: [
    {
      id: 1,
      nombre: 'Recarpeteo Calle Vieja',
      descripcion: 'Mejora de la carpeta asfaltica en 2km',
      presupuesto: 15000000,
      fechaInicio: '2023-11-01',
      estado: 'En Progreso'
    }
  ]
});

const ensureDb = async () => {
  try {
    await fs.access(DB_PATH);
    const current = await readDb();
    let changed = false;

    for (const collection of collections) {
      if (!Array.isArray(current[collection])) {
        current[collection] = [];
        changed = true;
      }
    }

    if (changed) {
      await writeDb(current);
    }
  } catch {
    await writeDb(createInitialDb());
  }
};

const readDb = async () => {
  const raw = await fs.readFile(DB_PATH, 'utf-8');
  const data = raw.trim() ? JSON.parse(raw) : {};
  return data;
};

const writeDb = async (data) => {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

const validateCollection = (req, res, next) => {
  const { collection } = req.params;
  if (!collections.includes(collection)) {
    return res.status(404).json({ message: 'Coleccion no encontrada.' });
  }
  return next();
};

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'login.html'));
});

app.get('/api/:collection', validateCollection, async (req, res) => {
  const data = await readDb();
  res.json(data[req.params.collection]);
});

app.get('/api/:collection/:id', validateCollection, async (req, res) => {
  const id = Number(req.params.id);
  const data = await readDb();
  const items = data[req.params.collection];
  const item = items.find((entry) => entry.id === id);

  if (!item) {
    return res.status(404).json({ message: 'Registro no encontrado.' });
  }

  return res.json(item);
});

app.post('/api/:collection', validateCollection, async (req, res) => {
  const data = await readDb();
  const items = data[req.params.collection];
  const nextId = items.length > 0 ? Math.max(...items.map((entry) => entry.id)) + 1 : 1;

  const newItem = { id: nextId, ...req.body };
  items.push(newItem);

  await writeDb(data);
  res.status(201).json(newItem);
});

app.put('/api/:collection/:id', validateCollection, async (req, res) => {
  const id = Number(req.params.id);
  const data = await readDb();
  const items = data[req.params.collection];
  const index = items.findIndex((entry) => entry.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Registro no encontrado.' });
  }

  const updated = { ...items[index], ...req.body, id };
  items[index] = updated;

  await writeDb(data);
  return res.json(updated);
});

app.delete('/api/:collection/:id', validateCollection, async (req, res) => {
  const id = Number(req.params.id);
  const data = await readDb();
  const items = data[req.params.collection];
  const index = items.findIndex((entry) => entry.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Registro no encontrado.' });
  }

  const [removed] = items.splice(index, 1);
  await writeDb(data);

  return res.json(removed);
});

ensureDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor disponible en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('No fue posible inicializar db.json', error);
    process.exit(1);
  });
