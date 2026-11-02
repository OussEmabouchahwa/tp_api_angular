const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Configuration de la base de données
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test'
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à MySQL:', err);
    return;
  }
  console.log('Connecté à la base de données MySQL');
});

// GET : Récupérer tous les étudiants
app.get('/etudiants', (req, res) => {
  const sql = 'SELECT * FROM etudiant';
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json(result);
  });
});

// GET : Récupérer un étudiant par son ID
app.get('/etudiants/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM etudiant WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    if (result.length === 0) return res.status(404).json({ message: 'Étudiant non trouvé' });
    res.json(result[0]);
  });
});

// POST : Ajouter un étudiant (nom + ville)
app.post('/ajouter', (req, res) => {
  const { nom, ville } = req.body;
  const sql = 'INSERT INTO etudiant (nom, ville) VALUES (?, ?)';
  db.query(sql, [nom, ville], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    res.json({ message: 'Étudiant ajouté', id: result.insertId });
  });
});

// PUT : Modifier un étudiant (nom + ville)
app.put('/modifier/:id', (req, res) => {
  const id = req.params.id;
  const { nom, ville } = req.body;
  const sql = 'UPDATE etudiant SET nom = ?, ville = ? WHERE id = ?';
  db.query(sql, [nom, ville, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Étudiant non trouvé' });
    res.json({ message: 'Étudiant modifié' });
  });
});

// DELETE : Supprimer un étudiant
app.delete('/supprimer/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM etudiant WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Étudiant non trouvé' });
    res.json({ message: 'Étudiant supprimé' });
  });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur Express en cours d'exécution sur le port ${port}`);
});