const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

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

// Route GET pour récupérer les étudiants
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
app.get('/etudiants/:id', (req, res) => {
const id = req.params.id;
const sql = 'SELECT id, nom FROM etudiant WHERE id = ?';
db.query(sql, [id], (err, result) => {
if (err)
return res.json({ error: 'Erreur serveur' });
if (result.length === 0)
return res.json({ message: 'Étudiant non trouvé' });
res.json(result[0]);
});
});

app.listen(port, () => {
  console.log(`Serveur Express en cours d'exécution sur le port ${port}`);
});