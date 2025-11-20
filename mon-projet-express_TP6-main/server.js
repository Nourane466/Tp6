const express = require('express');
const app = express();
const PORT = 3000;

// Middlewares de base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configurer EJS comme moteur de template
app.set('view engine', 'ejs');

// Données temporaires pour les tâches
let tasks = [
  { id: 1, title: 'Apprendre Express', done: false },
  { id: 2, title: 'Créer une application', done: false },
];

// Routes de base
app.get('/', (req, res) => {
  res.render('index', { user: 'Votre Nom' });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

// Route pour les tâches
app.get('/tasks', (req, res) => {
  res.render('tasks', { tasks });
});

// Route About
app.get('/about', (req, res) => {
  res.render('about', { 
    title: 'À propos',
    description: 'Ceci est une application de démonstration Express.js + EJS créée pour apprendre le développement backend.'
  });
});

// Route Contact
app.get('/contact', (req, res) => {
  res.render('contact', {
    email: 'votre.email@example.com'
  });
});


// API - GET toutes les tâches
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// API - POST nouvelle tâche
app.post('/api/tasks', (req, res) => {
  // Validation
  if (!req.body.title || req.body.title.trim() === '') {
    return res.status(400).json({ error: 'Le titre est obligatoire' });
  }
  
  const newTask = {
    id: tasks.length + 1,
    title: req.body.title.trim(),
    done: false
  };
  
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// API - PUT mettre à jour une tâche
app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    return res.status(404).json({ error: 'Tâche non trouvée' });
  }
  
  task.done = req.body.done !== undefined ? req.body.done : task.done;
  task.title = req.body.title || task.title;
  
  res.json(task);
});

// API - DELETE supprimer une tâche
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Tâche non trouvée' });
  }
  
  tasks.splice(taskIndex, 1);
  res.status(204).send();
});