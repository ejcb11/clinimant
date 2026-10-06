const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "clinimant_secret_key_123";

const app = express();
const port = 3000;

app.use(helmet({ contentSecurityPolicy: false }));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde.'
});
app.use('/api/', apiLimiter);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, 'uploads/'); },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const db = new sqlite3.Database('./clinimant.db', (err) => {
    if (err) console.error(err.message);
    else {
        console.log('Conectado a la BD SQLite.');
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)`);
            db.run(`CREATE TABLE IF NOT EXISTS equipos (id INTEGER PRIMARY KEY AUTOINCREMENT, codigo TEXT UNIQUE, nombre TEXT, tipo TEXT, ubicacion TEXT, marca TEXT, estado TEXT DEFAULT 'Operativo', foto TEXT, cantidad INTEGER DEFAULT 1)`);
            db.run(`CREATE TABLE IF NOT EXISTS repuestos (id INTEGER PRIMARY KEY AUTOINCREMENT, codigo TEXT UNIQUE, descripcion TEXT, categoria TEXT, stock INTEGER, foto TEXT)`);
            db.run(`CREATE TABLE IF NOT EXISTS tecnicos (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, especialidad TEXT, estado TEXT DEFAULT 'Disponible', telefono TEXT, correo TEXT)`);
            db.run(`CREATE TABLE IF NOT EXISTS proveedores (id INTEGER PRIMARY KEY AUTOINCREMENT, empresa TEXT, servicio TEXT, telefono TEXT, correo TEXT)`);
            db.run(`CREATE TABLE IF NOT EXISTS ordenes (id INTEGER PRIMARY KEY AUTOINCREMENT, codigo TEXT, tipo TEXT, equipo TEXT, descripcion TEXT, asignado TEXT, estado TEXT DEFAULT 'Pendiente', fecha TEXT)`);
            db.run("ALTER TABLE equipos ADD COLUMN cantidad INTEGER DEFAULT 1", () => {});
            db.run("ALTER TABLE tecnicos ADD COLUMN telefono TEXT", () => {});
            db.run("ALTER TABLE tecnicos ADD COLUMN correo TEXT", () => {});
            db.run("ALTER TABLE proveedores ADD COLUMN telefono TEXT", () => {});
            db.run("ALTER TABLE proveedores ADD COLUMN correo TEXT", () => {});
        });
    }
});

// -- AUTH ENDPOINTS --
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if(!username || !password) return res.status(400).json({error: "Faltan datos"});
    const hash = bcrypt.hashSync(password, 8);
    db.run("INSERT INTO usuarios (username, password) VALUES (?, ?)", [username, hash], function(err) {
        if(err) return res.status(400).json({error: "Usuario ya existe"});
        res.json({success: true, message: "Administrador registrado"});
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM usuarios WHERE username = ?", [username], (err, user) => {
        if(err || !user) return res.status(401).json({error: "Credenciales inválidas"});
        if(!bcrypt.compareSync(password, user.password)) return res.status(401).json({error: "Credenciales inválidas"});
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '12h' });
        res.json({ success: true, token, username: user.username });
    });
});

// Middleware JWT
function verifyToken(req, res, next) {
    if(req.path === '/login' || req.path === '/register') return next(); 
    
    const bearerHeader = req.headers['authorization'];
    if(!bearerHeader) return res.status(403).json({error: "No autorizado. Token requerido."});
    
    const token = bearerHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if(err) return res.status(401).json({error: "Token expirado o inválido"});
        req.user = decoded;
        next();
    });
}

// Proteger todas las rutas /api/* debajo de esto
app.use('/api', verifyToken);

// --- EQUIPOS ---
app.get('/api/equipos', (req, res) => { db.all("SELECT * FROM equipos", [], (err, rows) => res.json(rows)); });
app.post('/api/equipos', upload.single('foto'), (req, res) => {
    const { codigo, nombre, tipo, ubicacion, marca, cantidad } = req.body;
    const foto = req.file ? `/uploads/${req.file.filename}` : null;
    db.run(`INSERT INTO equipos (codigo, nombre, tipo, ubicacion, marca, foto, cantidad) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
    [codigo, nombre, tipo, ubicacion, marca, foto, cantidad || 1], function(err) {
        if(err) return res.status(400).json({error: err.message}); res.json({ id: this.lastID });
    });
});
app.delete('/api/equipos/:id', (req, res) => { db.run("DELETE FROM equipos WHERE id=?", req.params.id, (err) => res.json({msg: 'OK'})); });

// --- REPUESTOS ---
app.get('/api/repuestos', (req, res) => { db.all("SELECT * FROM repuestos", [], (err, rows) => res.json(rows)); });
app.post('/api/repuestos', upload.single('foto'), (req, res) => {
    const { codigo, descripcion, categoria, stock } = req.body;
    const foto = req.file ? `/uploads/${req.file.filename}` : null;
    db.run(`INSERT INTO repuestos (codigo, descripcion, categoria, stock, foto) VALUES (?, ?, ?, ?, ?)`, [codigo, descripcion, categoria, stock, foto], function(err) {
        if(err) return res.status(400).json({error: err.message}); res.json({ id: this.lastID });
    });
});
app.delete('/api/repuestos/:id', (req, res) => { db.run("DELETE FROM repuestos WHERE id=?", req.params.id, (err) => res.json({msg: 'OK'})); });

// --- TECNICOS ---
app.get('/api/tecnicos', (req, res) => { db.all("SELECT * FROM tecnicos", [], (err, rows) => res.json(rows)); });
app.post('/api/tecnicos', (req, res) => {
    const { nombre, especialidad, telefono, correo } = req.body;
    db.run(`INSERT INTO tecnicos (nombre, especialidad, telefono, correo) VALUES (?, ?, ?, ?)`, 
    [nombre, especialidad, telefono, correo], function(err) {
        if(err) return res.status(400).json({error: err.message}); res.json({ id: this.lastID });
    });
});
app.delete('/api/tecnicos/:id', (req, res) => { db.run("DELETE FROM tecnicos WHERE id=?", req.params.id, (err) => res.json({msg: 'OK'})); });

// --- PROVEEDORES ---
app.get('/api/proveedores', (req, res) => { db.all("SELECT * FROM proveedores", [], (err, rows) => res.json(rows)); });
app.post('/api/proveedores', (req, res) => {
    const { empresa, servicio, telefono, correo } = req.body;
    db.run(`INSERT INTO proveedores (empresa, servicio, telefono, correo) VALUES (?, ?, ?, ?)`, 
    [empresa, servicio, telefono, correo], function(err) {
        if(err) return res.status(400).json({error: err.message}); res.json({ id: this.lastID });
    });
});
app.delete('/api/proveedores/:id', (req, res) => { db.run("DELETE FROM proveedores WHERE id=?", req.params.id, (err) => res.json({msg: 'OK'})); });

// --- ORDENES DE TRABAJO ---
app.get('/api/ordenes', (req, res) => { db.all("SELECT * FROM ordenes ORDER BY id DESC", [], (err, rows) => res.json(rows)); });
app.post('/api/ordenes', (req, res) => {
    const { tipo, equipo, descripcion, asignado } = req.body;
    const codigo = 'OT-2026-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const fecha = new Date().toLocaleString('es-ES');
    
    db.serialize(() => {
        // Insertar OT
        db.run(`INSERT INTO ordenes (codigo, tipo, equipo, descripcion, asignado, fecha) VALUES (?, ?, ?, ?, ?, ?)`, 
        [codigo, tipo, equipo, descripcion, asignado || 'Sin asignar', fecha], function(err) {
            if(err) return res.status(400).json({error: err.message}); 
            const newId = this.lastID;
            
            // Actualizar el estado del equipo a "Mantenimiento" o "Falla" automáticamente
            if(equipo) {
                const nuevoEstado = (tipo.toLowerCase().includes('correctivo') || tipo.toLowerCase().includes('urgente')) 
                    ? 'Falla Reportada' : 'En Mantenimiento';
                db.run(`UPDATE equipos SET estado = ? WHERE codigo = ? OR nombre = ?`, [nuevoEstado, equipo, equipo]);
            }
            res.json({ id: newId, codigo });
        });
    });
});
app.put('/api/ordenes/:id/estado', (req, res) => {
    const { estado, equipo } = req.body;
    db.serialize(() => {
        db.run(`UPDATE ordenes SET estado = ? WHERE id = ?`, [estado, req.params.id], function(err) {
            if(err) return res.status(400).json({error: err.message});
            
            // Si la OT se completó, restaurar el estado del equipo a Operativo
            if(estado === 'Completado' && equipo) {
                db.run(`UPDATE equipos SET estado = 'Operativo' WHERE codigo = ? OR nombre = ?`, [equipo, equipo]);
            }
            res.json({ msg: 'Actualizado' });
        });
    });
});

app.put('/api/repuestos/:id', (req, res) => {
    const { descripcion, stock } = req.body;
    db.run(`UPDATE repuestos SET descripcion = ?, stock = ? WHERE id = ?`, [descripcion, stock, req.params.id], function(err) {
        if(err) return res.status(400).json({error: err.message}); res.json({ msg: 'Actualizado' });
    });
});

app.delete('/api/ordenes/:id', (req, res) => { 
    db.run("DELETE FROM ordenes WHERE id=?", req.params.id, (err) => res.json({msg: 'OK'})); 
});

// --- DASHBOARD STATS ---
app.get('/api/stats', (req, res) => {
    const stats = { totalEquipos: 0, preventivos: 0, fallas: 0, chartData: [0, 0] };
    db.serialize(() => {
        db.get("SELECT COUNT(*) as c FROM equipos", (err, row) => { if(row) stats.totalEquipos = row.c; });
        db.get("SELECT COUNT(*) as c FROM ordenes WHERE tipo LIKE '%Preventivo%' AND estado != 'Completado'", (err, row) => { if(row) stats.preventivos = row.c; });
        db.get("SELECT COUNT(*) as c FROM ordenes WHERE tipo LIKE '%Correctivo%' AND estado != 'Completado'", (err, row) => { if(row) stats.fallas = row.c; });
        db.get("SELECT COUNT(*) as prev FROM ordenes WHERE tipo LIKE '%Preventivo%'", (err, row) => { if(row) stats.chartData[0] = row.prev; });
        db.get("SELECT COUNT(*) as corr FROM ordenes WHERE tipo LIKE '%Correctivo%'", (err, row) => { 
            if(row) stats.chartData[1] = row.corr; 
            res.json(stats);
        });
    });
});

app.listen(port, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Sistema CLINIMANT iniciado correctamente!`);
    console.log(`🌐 Abre el siguiente enlace en tu navegador:`);
    console.log(`   http://localhost:${port}`);
    console.log(`======================================================\n`);
});
