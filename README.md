# 🏥 Clinimant — Sistema Web de Mantenimiento Clínico e Inventario

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite3](https://img.shields.io/badge/SQLite-3.x-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Tokens-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Bcrypt](https://img.shields.io/badge/Bcrypt-Encrypted-4A154B?style=for-the-badge)

Sistema Full Stack diseñado para la **gestión y control de mantenimiento de equipos biomédicos**, stock de repuestos, directorio de técnicos especializados, proveedores y órdenes de servicio técnico en entornos hospitalarios y clínicos.

---

## 📸 Vista Previa

<div align="center">
  <img src="public/logo.jpg" alt="Logo Clinimant" width="180" style="border-radius: 8px;" />
  <h3>Clinimant — Gestión Técnica Biomédica</h3>
</div>

---

## ✨ Características Principales

* 🩺 **Control de Equipos Biomédicos:** Registro detallado de equipos (código único, marca, modelo, ubicación física, estado operativo y fotografía técnica).
* ⚙️ **Inventario de Repuestos:** Control de stock, categorización de piezas de recambio y alertas de reposición.
* 👨‍🔧 **Directorio de Técnicos y Proveedores:** Gestión de personal técnico interno (disponibilidad y especialidad) y empresas proveedoras de soporte externo.
* 📋 **Órdenes de Trabajo y Mantenimiento:** Asignación de tareas correctivas y preventivas con seguimiento de estatus (`Pendiente`, `En progreso`, `Completado`).
* 🔒 **Seguridad y Autenticación:**
  * Autenticación con **JSON Web Tokens (JWT)** y hashing de contraseñas con **`bcryptjs`**.
  * Carga segura de imágenes técnicas con **`multer`**.
  * Protección de cabeceras HTTP mediante **`helmet`**.
  * Mitigación de ataques de fuerza bruta y abusos con **`express-rate-limit`**.
* 🗄️ **Base de Datos Relacional:** Estructuración relacional completa con claves foráneas e integridad referencial en **SQLite3**.

---

## 📁 Estructura del Proyecto

```text
clinimant/
├── public/                  # Interfaz de usuario (HTML5, CSS3, JS cliente)
│   ├── index.html           # Panel principal de gestión
│   ├── login.html           # Inicio de sesión seguro
│   ├── register.html        # Registro de usuarios
│   ├── logo.jpg             # Identidad gráfica
│   └── styles.css           # Estilos de la interfaz clínica
├── uploads/                 # Almacenamiento seguro de fotografías técnicas
├── clinimant.db             # Base de datos SQLite3
├── seed.js                  # Script para poblar datos de prueba
├── server.js                # Servidor Express, endpoints REST y middlewares
├── package.json
└── README.md
```

---

## 🚀 Instalación y Ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/ejcb11/clinimant.git
   cd clinimant
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor:**
   ```bash
   npm run dev
   # o bien:
   node server.js
   ```

4. **Acceder en el navegador:**
   ```text
   http://localhost:3000
   ```

---

## 👨‍💻 Autor

Desarrollado por **Eduardo José Contreras Borrero**  
* **LinkedIn:** [linkedin.com/in/eduardo-contreras-dev](https://www.linkedin.com/in/eduardo-contreras-dev/)  
* **GitHub:** [@ejcb11](https://github.com/ejcb11)  
* **Correo:** [ejcb2006@gmail.com](mailto:ejcb2006@gmail.com)
