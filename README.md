#  E-commerce Backend API

Sistema backend completo para e-commerce con gestión de productos y carritos de compra, construido con Node.js, Express y MongoDB.

##  Características

- ✅ API RESTful completa para productos y carritos
- ✅ Base de datos MongoDB con Mongoose
- ✅ Paginación, filtros y ordenamiento de productos
- ✅ Gestión completa de carritos de compra
- ✅ Vistas web con Handlebars


##  Inicio Rápido

### Prerrequisitos

- Node.js (v14 o superior)
- MongoDB instalado y ejecutándose en `localhost:27017`
- npm o yarn

### Instalación

1. Clona el repositorio
```bash
git clone <url-del-repositorio>
```

2. Instala las dependencias
```bash
npm install
```

3. Inicia MongoDB
```bash
Configura tu archivo `.env` con la variable `MONGO_URL`
```

4. Inicia el servidor
```bash
npm start
```

El servidor estará disponible en `http://localhost:8080`.

##  Documentación de la API

### Productos

| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| `GET` | `/api/products` | Lista productos con paginación | `limit`, `page`, `sort`, `query`, `category` |
| `GET` | `/api/products/:pid` | Obtiene un producto específico | `pid` (ID del producto) |
| `GET` | `/products/views` | Vista web de productos | - |
| `GET` | `/products/views/:pid` | Vista web de detalle de producto | `pid` (ID del producto) |

#### Ejemplo de uso
```bash
# Listar productos (10 por página, ordenados por precio)
GET /api/products?limit=10&page=1&sort=price

# Filtrar por categoría
GET /api/products?category=electronics
```

### Carritos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/carts` | Crear nuevo carrito vacío |
| `GET` | `/api/carts` | Listar todos los carritos |
| `GET` | `/api/carts/:cid` | Obtener carrito específico |
| `POST` | `/api/carts/:cid/product/:pid` | Agregar producto al carrito |
| `PUT` | `/api/carts/:cid/product/:pid` | Actualizar cantidad de producto |
| `DELETE` | `/api/carts/:cid/product/:pid` | Eliminar producto del carrito |
| `DELETE` | `/api/carts/:cid` | Vaciar carrito completo |
| `GET` | `/carts/views` | Vista web del carrito |

#### Ejemplo de uso
```bash
# Crear un carrito nuevo
POST /api/carts

# Agregar producto al carrito
POST /api/carts/abc123/product/xyz789
Content-Type: application/json
{
  "quantity": 2
}
```




##  Estructura del Proyecto
```
proyecto/
├── src/
│   ├── models/           # Modelos Mongoose (Product, Cart)
│   ├── routes/           # Rutas de la API
│   │   ├── products.js
│   │   └── carts.js
│   ├── views/  
│   │   ├──layouts/
│   │   │   └──  main.hbs # Plantillas Handlebars          
│   │   ├── products.hbs  # Plantillas Handlebars
│   │   ├── productDetail.hbs
│   │   └── cart.hbs
│   └── public/           # Archivos estáticos (CSS, JS)
│       └── styles.css
├── server.js                # Punto de entrada
├── package.json
└── README.md
```

##  Testing

El proyecto ha sido probado exhaustivamente con Postman:

- ✅ CRUD completo de carritos
- ✅ Agregado y eliminación de productos
- ✅ Paginación y filtros funcionando correctamente
- ✅ Ordenamiento por diferentes criterios
- ✅ Vistas web renderizando correctamente



### Base de Datos

La aplicación utiliza MongoDB Atlas. Asegúrate de configurar la variable MONGO_URL en tu archivo .env

