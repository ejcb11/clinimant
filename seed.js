const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./clinimant.db');

const equipos = [
    { codigo: 'AIRE-001', nombre: 'Aire Acondicionado Split 12000 BTU', tipo: 'Aire Acondicionado', ubicacion: 'Piso 1 - Consultorio 1', marca: 'LG', cantidad: 1, foto: 'https://images.unsplash.com/photo-1621252171050-48e028b185ee?w=100&h=100&fit=crop' },
    { codigo: 'AIRE-002', nombre: 'Aire Acondicionado Central 5 Ton', tipo: 'Aire Acondicionado', ubicacion: 'Techo Principal', marca: 'Carrier', cantidad: 1, foto: 'https://images.unsplash.com/photo-1545657512-3b020294fcbf?w=100&h=100&fit=crop' },
    { codigo: 'AIRE-003', nombre: 'Aire Acondicionado Split 18000 BTU', tipo: 'Aire Acondicionado', ubicacion: 'Piso 2 - Quirófano', marca: 'Samsung', cantidad: 2, foto: 'https://images.unsplash.com/photo-1621252171050-48e028b185ee?w=100&h=100&fit=crop' },
    { codigo: 'ASC-001', nombre: 'Ascensor de Pasajeros 8 Personas', tipo: 'Ascensor', ubicacion: 'Torre A - Principal', marca: 'Otis', cantidad: 1, foto: 'https://images.unsplash.com/photo-1579308253684-257a07fc261e?w=100&h=100&fit=crop' },
    { codigo: 'ASC-002', nombre: 'Ascensor de Carga', tipo: 'Ascensor', ubicacion: 'Torre B - Servicio', marca: 'Schindler', cantidad: 1, foto: 'https://images.unsplash.com/photo-1582234372722-50d7ccaafeb3?w=100&h=100&fit=crop' },
    { codigo: 'PLNT-001', nombre: 'Planta Eléctrica 500kVA', tipo: 'Planta Eléctrica', ubicacion: 'Sótano 1 - Cuarto de Máquinas', marca: 'Caterpillar', cantidad: 1, foto: 'https://images.unsplash.com/photo-1517594422361-5e18d414a3bf?w=100&h=100&fit=crop' },
    { codigo: 'PLNT-002', nombre: 'Planta Eléctrica 250kVA Emergencia', tipo: 'Planta Eléctrica', ubicacion: 'Sótano 2', marca: 'Cummins', cantidad: 1, foto: 'https://images.unsplash.com/photo-1517594422361-5e18d414a3bf?w=100&h=100&fit=crop' },
    { codigo: 'COMP-001', nombre: 'Computador All-in-One 24"', tipo: 'Computador', ubicacion: 'Recepción Principal', marca: 'HP', cantidad: 3, foto: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=100&h=100&fit=crop' },
    { codigo: 'COMP-002', nombre: 'Computador Desktop OptiPlex', tipo: 'Computador', ubicacion: 'Administración', marca: 'Dell', cantidad: 5, foto: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=100&h=100&fit=crop' },
    { codigo: 'COMP-003', nombre: 'Laptop ThinkPad T14', tipo: 'Computador', ubicacion: 'Jefatura Médica', marca: 'Lenovo', cantidad: 2, foto: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop' }
];

const repuestos = [
    { codigo: 'FIL-HVAC-01', descripcion: 'Filtro de Aire HEPA Quirófano', categoria: 'Climatización', stock: 15, foto: 'https://images.unsplash.com/photo-1621252171050-48e028b185ee?w=100&h=100&fit=crop' },
    { codigo: 'GAS-R410A', descripcion: 'Gas Refrigerante R-410A (Cilindro)', categoria: 'Climatización', stock: 5, foto: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=100&h=100&fit=crop' },
    { codigo: 'CAP-45UF', descripcion: 'Capacitor Dual 45+5 uF 440V', categoria: 'Climatización', stock: 30, foto: 'https://images.unsplash.com/photo-1580983546522-83494b598d1a?w=100&h=100&fit=crop' },
    { codigo: 'ACE-15W40', descripcion: 'Aceite para Motor Diesel 15W40 (Paila)', categoria: 'Planta Eléctrica', stock: 4, foto: 'https://images.unsplash.com/photo-1615554865064-a69c84e1b7de?w=100&h=100&fit=crop' },
    { codigo: 'FIL-AC-PLNT', descripcion: 'Filtro de Aceite para CAT 500kVA', categoria: 'Planta Eléctrica', stock: 8, foto: 'https://images.unsplash.com/photo-1635830605634-11000bb7ab57?w=100&h=100&fit=crop' },
    { codigo: 'BAT-12V100', descripcion: 'Batería 12V 100Ah Libre Mantenimiento', categoria: 'Planta Eléctrica', stock: 6, foto: 'https://images.unsplash.com/photo-1596733221971-4770e28f11ec?w=100&h=100&fit=crop' },
    { codigo: 'PCB-ASC-01', descripcion: 'Tarjeta Electrónica de Control Principal', categoria: 'Ascensor', stock: 2, foto: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop' },
    { codigo: 'BTN-ASC-01', descripcion: 'Botonera de Cabina (Pisos 1-5)', categoria: 'Ascensor', stock: 4, foto: 'https://images.unsplash.com/photo-1592188289892-0b73e54b6ce5?w=100&h=100&fit=crop' },
    { codigo: 'RAM-8GB', descripcion: 'Memoria RAM 8GB DDR4 2666MHz', categoria: 'Computador', stock: 10, foto: 'https://images.unsplash.com/photo-1562976540-1502f714426d?w=100&h=100&fit=crop' },
    { codigo: 'SSD-500GB', descripcion: 'Disco Duro SSD 500GB SATA3', categoria: 'Computador', stock: 12, foto: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=100&h=100&fit=crop' }
];

db.serialize(() => {
    equipos.forEach(eq => {
        db.run(`INSERT OR IGNORE INTO equipos (codigo, nombre, tipo, ubicacion, marca, foto, cantidad) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
        [eq.codigo, eq.nombre, eq.tipo, eq.ubicacion, eq.marca, eq.foto, eq.cantidad]);
    });

    repuestos.forEach(rp => {
        db.run(`INSERT OR IGNORE INTO repuestos (codigo, descripcion, categoria, stock, foto) VALUES (?, ?, ?, ?, ?)`, 
        [rp.codigo, rp.descripcion, rp.categoria, rp.stock, rp.foto]);
    });
});

console.log('Seed insertado correctamente.');
db.close();
