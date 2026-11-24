// src/slides/createSlides.js — Presentación CREATE (POST), paso a paso
import { t, withPositions } from './shared';

export const meta = {
  id: 'create',
  method: 'POST',
  accent: '#56d364',
  label: t('CREATE', 'CREATE'),
  sub: t('Crear un usuario', 'Create a user'),
  example: 'POST /api/users',
  summary: t(
    'Qué pasa desde que React envía un formulario hasta que el usuario queda guardado en la base.',
    'What happens from React submitting a form to the user being stored in the database.'
  ),
};

export const outro = {
  title: t('Todo el recorrido de un POST', 'The whole POST route'),
  text: t(
    'El cliente envía datos en el body, el servidor los valida y los guarda, y responde 201 con el recurso creado. POST no es idempotente: repetirlo crea otro usuario.',
    'The client sends data in the body, the server validates and stores it, and answers 201 with the created resource. POST is not idempotent: repeating it creates another user.'
  ),
};

export const slides = withPositions([
  {
    id: 'what',
    slot: 'what',
    zone: 'client',
    title: t('¿Qué es POST?', 'What is POST?'),
    what: t(
      [
        'Es el método HTTP para **crear**: manda datos nuevos al servidor.',
        'Lleva un **body**: los datos del recurso a crear, en JSON.',
        'No es *idempotente*: si lo repetís, creás otro usuario.',
        'Si sale bien, la respuesta esperada es **201 Created**.',
      ],
      [
        'It is the HTTP method to **create**: it sends new data to the server.',
        'It carries a **body**: the data of the resource to create, as JSON.',
        'It is not *idempotent*: repeating it creates another user.',
        'On success, the expected response is **201 Created**.',
      ]
    ),
    http: `POST /api/users HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{ "name": "Ana", "email": "ana@mail.com" }`,
    codeLang: 'javascript',
    code: t(
      `// Crear un usuario desde React con fetch:
await fetch('/api/users', {
  method: 'POST',  // crear
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({  // los datos, como texto
    name: 'Ana',
    email: 'ana@mail.com',
  }),
});

// Lo mismo con Axios (convierte el body y pone el header solo):
// axios.post('/api/users', { name: 'Ana', email: 'ana@mail.com' });`,
      `// Create a user from React with fetch:
await fetch('/api/users', {
  method: 'POST',  // create
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({  // the data, as text
    name: 'Ana',
    email: 'ana@mail.com',
  }),
});

// Same with Axios (sets the body and header by itself):
// axios.post('/api/users', { name: 'Ana', email: 'ana@mail.com' });`
    ),
  },
  {
    id: 'client-send',
    slot: 'client-send',
    zone: 'client',
    title: t('React envía el formulario', 'React submits the form'),
    what: t(
      [
        'La persona completa el formulario y hace clic en "Guardar".',
        'El handler `onSubmit` arma un objeto con los datos y llama a `fetch()`.',
        '`JSON.stringify()` convierte el objeto en **texto JSON**: por la red solo viaja texto.',
        'Con `await`, el código espera la respuesta sin congelar la pantalla.',
      ],
      [
        'The person fills in the form and clicks "Save".',
        'The `onSubmit` handler builds an object with the data and calls `fetch()`.',
        '`JSON.stringify()` turns the object into **JSON text**: only text travels over the network.',
        'With `await`, the code waits for the response without freezing the screen.',
      ]
    ),
    http: t(
      `(todavía no viajó nada)

Por enviar:
POST /api/users  +  body JSON`,
      `(nothing has traveled yet)

About to send:
POST /api/users  +  JSON body`
    ),
    codeLang: 'javascript',
    code: t(
      `const handleSubmit = async (event) => {
  event.preventDefault();  // no recargar la página

  const nuevoUsuario = {
    name: form.name,
    email: form.email,
  };

  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevoUsuario),
  });
  // ...sigue en "React usa la respuesta"
};`,
      `const handleSubmit = async (event) => {
  event.preventDefault();  // don't reload the page

  const newUser = {
    name: form.name,
    email: form.email,
  };

  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser),
  });
  // ...continues in "React uses the response"
};`
    ),
  },
  {
    id: 'request',
    slot: 'request',
    zone: 'network',
    title: t('La petición viaja', 'The request travels'),
    what: t(
      [
        'El POST viaja como **texto**: línea de inicio, headers, línea vacía y body.',
        '`Content-Type: application/json` le avisa al servidor cómo leer el body.',
        '`Content-Length` dice cuántos bytes ocupa el body.',
        'Viaja por una conexión TCP; con `https` además iría cifrado.',
      ],
      [
        'The POST travels as **text**: start line, headers, empty line and body.',
        '`Content-Type: application/json` tells the server how to read the body.',
        '`Content-Length` says how many bytes the body takes.',
        'It travels over a TCP connection; with `https` it would also be encrypted.',
      ]
    ),
    http: `POST /api/users HTTP/1.1
Host: localhost:3000
Origin: http://localhost:5173
Content-Type: application/json
Content-Length: 37
Accept: */*

{"name":"Ana","email":"ana@mail.com"}`,
    codeLang: 'bash',
    code: t(
      `# El mismo POST desde la terminal:
curl -v -X POST localhost:3000/api/users \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Ana","email":"ana@mail.com"}'

# -X POST  -> el método
# -H       -> un header
# -d       -> el body (curl pone Content-Type y Content-Length)`,
      `# The same POST from the terminal:
curl -v -X POST localhost:3000/api/users \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Ana","email":"ana@mail.com"}'

# -X POST  -> the method
# -H       -> a header
# -d       -> the body (curl sets Content-Type and Content-Length)`
    ),
  },
  {
    id: 'express-in',
    slot: 'express-in',
    zone: 'server',
    title: t('Express recibe el pedido', 'Express receives the request'),
    what: t(
      [
        'Node escucha en el puerto 3000 (`app.listen`) y acepta la conexión.',
        'Express arma `req` (lo que llegó) y `res` (para responder).',
        'El body **todavía no** está disponible: llega como un flujo de bytes que hay que leer y parsear.',
        'De eso se encarga el middleware `express.json()` en el paso siguiente.',
      ],
      [
        'Node listens on port 3000 (`app.listen`) and accepts the connection.',
        'Express builds `req` (what arrived) and `res` (to respond).',
        'The body is **not** available yet: it arrives as a stream of bytes to be read and parsed.',
        'The `express.json()` middleware handles that in the next step.',
      ]
    ),
    http: t(
      `Llegó al servidor:

POST /api/users HTTP/1.1
Content-Type: application/json
Content-Length: 37

{"name":"Ana","email":"ana@mail.com"}`,
      `Arrived at the server:

POST /api/users HTTP/1.1
Content-Type: application/json
Content-Length: 37

{"name":"Ana","email":"ana@mail.com"}`
    ),
    codeLang: 'javascript',
    code: t(
      `// server.js
import app from './app.js';

app.listen(3000, () => {
  console.log('API en http://localhost:3000');
});

// En este punto, dentro de Express:
//   req.method            -> 'POST'
//   req.path              -> '/api/users'
//   req.headers['content-type'] -> 'application/json'
//   req.body       -> undefined (sin parsear)`,
      `// server.js
import app from './app.js';

app.listen(3000, () => {
  console.log('API on http://localhost:3000');
});

// At this point, inside Express:
//   req.method            -> 'POST'
//   req.path              -> '/api/users'
//   req.headers['content-type'] -> 'application/json'
//   req.body       -> undefined (not parsed)`
    ),
  },
  {
    id: 'middlewares',
    slot: 'middlewares',
    zone: 'server',
    title: t('Pasa por los middlewares', 'It goes through the middlewares'),
    what: t(
      [
        '`morgan`: anota el pedido en la terminal.',
        'cors(): agrega `Access-Control-Allow-Origin` a la respuesta.',
        '**`express.json()`**: lee el body, lo parsea y lo deja en `req.body` como objeto.',
        'Sin `express.json()`, `req.body` sería `undefined`: es el error más común al crear.',
      ],
      [
        '`morgan`: logs the request in the terminal.',
        'cors(): adds `Access-Control-Allow-Origin` to the response.',
        '**`express.json()`**: reads the body, parses it and leaves it in `req.body` as an object.',
        'Without `express.json()`, `req.body` would be `undefined`: the most common create bug.',
      ]
    ),
    http: t(
      `El body deja de ser texto
y pasa a ser un objeto:

req.body = { name: 'Ana',
             email: 'ana@mail.com' }`,
      `The body stops being text
and becomes an object:

req.body = { name: 'Ana',
             email: 'ana@mail.com' }`
    ),
    codeLang: 'javascript',
    code: t(
      `// app.js — el orden importa: van ANTES de las rutas
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

app.use(morgan('dev'));  // POST /api/users 201 14 ms
app.use(cors());  // headers de permiso
app.use(express.json());  // <-- body JSON -> req.body

app.use('/api/users', usersRouter);`,
      `// app.js — order matters: they go BEFORE the routes
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

app.use(morgan('dev'));  // POST /api/users 201 14 ms
app.use(cors());  // permission headers
app.use(express.json());  // <-- JSON body -> req.body

app.use('/api/users', usersRouter);`
    ),
  },
  {
    id: 'router',
    slot: 'router',
    zone: 'server',
    title: t('El router elige la ruta', 'The router picks the route'),
    what: t(
      [
        'Busca una ruta con el mismo **método** y **ruta**: `POST` + `/api/users`.',
        'La misma dirección con `GET` va a otra función: el método forma parte de la ruta.',
        'Ejecuta el controlador `create`.',
        'Si no hubiera una ruta POST, Express respondería `404`.',
      ],
      [
        'It looks for a route with the same **method** and **path**: `POST` + `/api/users`.',
        'The same address with `GET` goes to another function: the method is part of the route.',
        'It runs the `create` controller.',
        'If there were no POST route, Express would respond `404`.',
      ]
    ),
    http: t(
      `POST /api/users
────  ──────────
 │        └── ruta:    /api/users
 └─────────── método:  POST

(el body ya está en req.body)`,
      `POST /api/users
────  ──────────
 │        └── path:    /api/users
 └─────────── method:  POST

(the body is already in req.body)`
    ),
    codeLang: 'javascript',
    code: t(
      `// routes/users.routes.js
import { Router } from 'express';
import { getAll, create } from '../controllers/users.js';

const router = Router();

router.get('/', getAll);  // GET  /api/users
router.post('/', create);     // <-- crear

export default router;

// app.js
app.use('/api/users', router);`,
      `// routes/users.routes.js
import { Router } from 'express';
import { getAll, create } from '../controllers/users.js';

const router = Router();

router.get('/', getAll);  // GET  /api/users
router.post('/', create);     // <-- create

export default router;

// app.js
app.use('/api/users', router);`
    ),
  },
  {
    id: 'controller',
    slot: 'controller',
    zone: 'server',
    title: t('El controlador valida y crea', 'The controller validates and creates'),
    what: t(
      [
        'Lee los datos de `req.body`.',
        'Valida: nunca confíes en lo que manda el cliente, aunque el formulario ya valide.',
        'Si falta algo, corta con `400` (y nunca toca la base).',
        'Si está completo, le pide a la base que guarde con `await`.',
      ],
      [
        'Reads the data from `req.body`.',
        'Validates: never trust what the client sends, even if the form already validates.',
        'If something is missing, it stops with `400` (and never touches the database).',
        'If complete, it asks the database to save, with `await`.',
      ]
    ),
    http: t(
      `POST /api/users   ⏳ pendiente

El navegador sigue esperando:
todavía no hay respuesta.`,
      `POST /api/users   ⏳ pending

The browser is still waiting:
there is no response yet.`
    ),
    codeLang: 'javascript',
    code: t(
      `// controllers/users.controller.js
export const create = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Validación básica
    if (!name || !email) {
      return res.status(400)
        .json({ message: 'Faltan name o email' });
    }

    const user = await User.create({ name, email });  // guardar
    res.status(201).json(user);  // creado
  } catch (error) {
    console.error(error);
    res.status(500)
      .json({ message: 'Error del servidor' });
  }
};`,
      `// controllers/users.controller.js
export const create = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Basic validation
    if (!name || !email) {
      return res.status(400)
        .json({ message: 'name or email missing' });
    }

    const user = await User.create({ name, email });  // save
    res.status(201).json(user);  // created
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};`
    ),
  },
  {
    id: 'db',
    slot: 'db',
    zone: 'data',
    title: t('La base guarda el documento', 'The database stores the document'),
    what: t(
      [
        'Mongoose valida contra el schema y le agrega un `_id` y las fechas (`timestamps`).',
        'Entre Node y MongoDB **no se usa HTTP**: hablan el protocolo propio de MongoDB.',
        'MongoDB inserta el documento en la colección `users`.',
        'Si un campo `unique` (como el email) se repite, falla con el error `E11000`.',
      ],
      [
        'Mongoose validates against the schema and adds an `_id` and dates (`timestamps`).',
        'Node and MongoDB **do not use HTTP**: they speak MongoDB\'s own protocol.',
        'MongoDB inserts the document into the `users` collection.',
        'If a `unique` field (like the email) repeats, it fails with the `E11000` error.',
      ]
    ),
    http: t(
      `POST /api/users   ⏳ pendiente

(la conexión con el navegador
 sigue abierta, esperando)`,
      `POST /api/users   ⏳ pending

(the connection with the browser
 is still open, waiting)`
    ),
    codeLang: 'javascript',
    code: t(
      `// models/User.js
const userSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  email: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.model('User', userSchema);

// En el controlador:
await User.create({ name: 'Ana', email: 'ana@mail.com' });

// El comando que recibe MongoDB:
// { insert: "users", documents: [ { _id: ObjectId(...),
//   name: "Ana", email: "ana@mail.com", createdAt, updatedAt } ] }`,
      `// models/User.js
const userSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  email: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.model('User', userSchema);

// In the controller:
await User.create({ name: 'Ana', email: 'ana@mail.com' });

// The command MongoDB receives:
// { insert: "users", documents: [ { _id: ObjectId(...),
//   name: "Ana", email: "ana@mail.com", createdAt, updatedAt } ] }`
    ),
  },
  {
    id: 'response',
    slot: 'response',
    zone: 'server',
    title: t('Express arma la respuesta 201', 'Express builds the 201 response'),
    what: t(
      [
        'La base confirma y `await` termina: ahora `user` tiene `_id` y fechas.',
        '`res.status(201).json(user)` convierte el documento en texto JSON.',
        '**201 Created** es el código estándar cuando se crea un recurso.',
        'Es buena práctica devolver el recurso creado (así el cliente ya tiene su `_id`).',
      ],
      [
        'The database confirms and `await` finishes: now `user` has `_id` and dates.',
        '`res.status(201).json(user)` turns the document into JSON text.',
        '**201 Created** is the standard code when a resource is created.',
        'It is good practice to return the created resource (so the client already has its `_id`).',
      ]
    ),
    http: `HTTP/1.1 201 Created
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 118

{"_id":"64f1a2...","name":"Ana",
 "email":"ana@mail.com","createdAt":"2026-..."}`,
    codeLang: 'javascript',
    code: t(
      `res.status(201).json(user);

// 'user' es el documento ya guardado:
// {
//   _id: '64f1a2b3c4d5e6f7a8b9c0d1',
//   name: 'Ana',
//   email: 'ana@mail.com',
//   createdAt: '2026-01-10T...',
//   updatedAt: '2026-01-10T...'
// }

// morgan escribe: POST /api/users 201 14.2 ms`,
      `res.status(201).json(user);

// 'user' is the already-saved document:
// {
//   _id: '64f1a2b3c4d5e6f7a8b9c0d1',
//   name: 'Ana',
//   email: 'ana@mail.com',
//   createdAt: '2026-01-10T...',
//   updatedAt: '2026-01-10T...'
// }

// morgan writes: POST /api/users 201 14.2 ms`
    ),
  },
  {
    id: 'client-use',
    slot: 'client-use',
    zone: 'client',
    title: t('React usa la respuesta', 'React uses the response'),
    what: t(
      [
        '`response.ok` es true (201): salió bien.',
        '`await response.json()` convierte el texto en el objeto del usuario creado.',
        'Se agrega al estado: `setUsers(prev => [...prev, nuevo])` y React redibuja la lista.',
        'Ojo: fetch **no** lanza error con 4xx/5xx. Por eso se revisa `response.ok`.',
      ],
      [
        '`response.ok` is true (201): it went well.',
        '`await response.json()` turns the text into the created user object.',
        'It is added to the state: `setUsers(prev => [...prev, created])` and React redraws the list.',
        'Careful: fetch does **not** throw on 4xx/5xx. That is why `response.ok` is checked.',
      ]
    ),
    http: t(
      `Body recibido (texto JSON):

{
  "_id": "64f1a2...",
  "name": "Ana",
  "email": "ana@mail.com"
}`,
      `Body received (JSON text):

{
  "_id": "64f1a2...",
  "name": "Ana",
  "email": "ana@mail.com"
}`
    ),
    codeLang: 'javascript',
    code: t(
      `  const response = await fetch('/api/users', { /* ...POST... */ });

  const data = await response.json();  // texto -> objeto

  if (!response.ok) {  // 400, 409, 500...
    setError(data.message);
    return;
  }

  setUsers((prev) => [...prev, data]);  // agregar a la lista
  setForm({ name: '', email: '' });  // limpiar form`,
      `  const response = await fetch('/api/users', { /* ...POST... */ });

  const data = await response.json();  // text -> object

  if (!response.ok) {  // 400, 409, 500...
    setError(data.message);
    return;
  }

  setUsers((prev) => [...prev, data]);  // add to the list
  setForm({ name: '', email: '' });  // clear form`
    ),
  },
  {
    id: 'variant-conflict',
    slot: 'variant-a',
    zone: 'extra',
    title: t('Variante: email repetido (409)', 'Variation: duplicate email (409)'),
    what: t(
      [
        'El email ya existe y el campo es `unique` en el schema.',
        'MongoDB rechaza el insert con el error `E11000`.',
        'El controlador lo detecta y responde **409 Conflict**.',
        '409 significa "choca con algo que ya existe", distinto de un 400 (datos mal escritos).',
      ],
      [
        'The email already exists and the field is `unique` in the schema.',
        'MongoDB rejects the insert with the `E11000` error.',
        'The controller detects it and responds **409 Conflict**.',
        '409 means "it clashes with something existing", unlike a 400 (badly written data).',
      ]
    ),
    http: `HTTP/1.1 409 Conflict
Content-Type: application/json; charset=utf-8

{"message":"El email ya está registrado"}`,
    codeLang: 'javascript',
    code: t(
      `export const create = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    // 11000 = violación de índice único (email repetido)
    if (error.code === 11000) {
      return res.status(409)
        .json({ message: 'Email ya registrado' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400)
        .json({ message: 'Datos inválidos' });
    }
    res.status(500)
      .json({ message: 'Error del servidor' });
  }
};`,
      `export const create = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    // 11000 = unique index violation (duplicate email)
    if (error.code === 11000) {
      return res.status(409)
        .json({ message: 'Email already registered' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400)
        .json({ message: 'Invalid data' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};`
    ),
  },
  {
    id: 'variant-400',
    slot: 'variant-b',
    zone: 'extra',
    title: t('Variante: faltan datos (400)', 'Variation: missing data (400)'),
    what: t(
      [
        'El body llega sin email: `{ name: "Ana" }`.',
        'El controlador valida y corta con **400 Bad Request** antes de tocar la base.',
        'La base de datos ni se entera: no se crea nada.',
        'El mensaje le dice al cliente qué corregir.',
      ],
      [
        'The body arrives without email: `{ name: "Ana" }`.',
        'The controller validates and stops with **400 Bad Request** before touching the database.',
        'The database never hears about it: nothing is created.',
        'The message tells the client what to fix.',
      ]
    ),
    http: `POST /api/users HTTP/1.1
Content-Type: application/json

{"name":"Ana"}

HTTP/1.1 400 Bad Request
{"message":"Faltan name o email"}`,
    codeLang: 'javascript',
    code: t(
      `const { name, email } = req.body;  // email es undefined

if (!name || !email) {
  return res.status(400)
    .json({ message: 'Faltan name o email' });
}
// nunca se llega a User.create(): la base no se toca

// En el cliente:
const data = await response.json();
if (!response.ok) setError(data.message);`,
      `const { name, email } = req.body;  // email is undefined

if (!name || !email) {
  return res.status(400)
    .json({ message: 'name or email missing' });
}
// User.create() is never reached: the database is untouched

// On the client:
const data = await response.json();
if (!response.ok) setError(data.message);`
    ),
  },
]);
