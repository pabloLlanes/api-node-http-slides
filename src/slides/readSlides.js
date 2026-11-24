// src/slides/readSlides.js — Presentación READ (GET), paso a paso
import { t, withPositions } from './shared';

export const meta = {
  id: 'read',
  method: 'GET',
  accent: '#6bb6ff',
  label: t('READ', 'READ'),
  sub: t('Leer la lista', 'Read the list'),
  example: 'GET /api/users?page=1&limit=2',
  summary: t(
    'Qué pasa desde que React pide una lista de usuarios hasta que aparece en pantalla.',
    'What happens from React asking for a list of users to it showing up on screen.'
  ),
};

export const outro = {
  title: t('Todo el recorrido de un GET', 'The whole GET route'),
  text: t(
    'GET pide y no cambia nada, no lleva body, y su respuesta se puede guardar en caché. Los datos que no van en la ruta (filtros, paginación) viajan como query params.',
    'GET asks and changes nothing, has no body, and its response can be cached. Data that is not in the path (filters, pagination) travels as query params.'
  ),
};

export const slides = withPositions([
  {
    id: 'what',
    slot: 'what',
    zone: 'client',
    title: t('¿Qué es GET?', 'What is GET?'),
    what: t(
      [
        'Es el método HTTP para **leer**: pide datos y no cambia nada.',
        'No lleva body: todo va en la URL (ruta y query params).',
        'Es *idempotente*: repetirlo da el mismo resultado, por eso se puede cachear.',
        'Cada vez que escribís una dirección en el navegador, hacés un GET.',
      ],
      [
        'It is the HTTP method to **read**: it asks for data and changes nothing.',
        'It has no body: everything goes in the URL (path and query params).',
        'It is *idempotent*: repeating it gives the same result, so it can be cached.',
        'Every time you type an address in the browser, you make a GET.',
      ]
    ),
    http: t(
      `GET /api/users?page=1&limit=2 HTTP/1.1
Host: localhost:3000

(sin body)`,
      `GET /api/users?page=1&limit=2 HTTP/1.1
Host: localhost:3000

(no body)`
    ),
    codeLang: 'javascript',
    code: t(
      `// Tres formas de hacer el mismo GET:

// 1. En la barra del navegador:
//    localhost:3000/api/users?page=1

// 2. Desde JavaScript (React):
fetch('/api/users?page=1&limit=2');

// 3. Desde la terminal:
//    curl localhost:3000/api/users`,
      `// Three ways to make the same GET:

// 1. In the browser address bar:
//    localhost:3000/api/users?page=1

// 2. From JavaScript (React):
fetch('/api/users?page=1&limit=2');

// 3. From the terminal:
//    curl localhost:3000/api/users`
    ),
  },
  {
    id: 'client-send',
    slot: 'client-send',
    zone: 'client',
    title: t('React dispara el pedido', 'React fires the request'),
    what: t(
      [
        'El componente `UserList` aparece en pantalla.',
        '`useEffect` se ejecuta una sola vez y llama a `fetch()`.',
        'fetch devuelve una promesa: con `await` el código espera sin congelar la página.',
        'La query (`?page=1&limit=2`) agrega opciones: qué página y cuántos traer.',
      ],
      [
        'The `UserList` component appears on screen.',
        '`useEffect` runs once and calls `fetch()`.',
        'fetch returns a promise: with `await` the code waits without freezing the page.',
        'The query (`?page=1&limit=2`) adds options: which page and how many to bring.',
      ]
    ),
    http: t(
      `(todavía no viajó nada)

Por enviar:
GET /api/users?page=1&limit=2`,
      `(nothing has traveled yet)

About to send:
GET /api/users?page=1&limit=2`
    ),
    codeLang: 'javascript',
    code: t(
      `function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const load = async () => {
      const response = await fetch(
        '/api/users?page=1&limit=2'
      );
      // ...sigue en "React usa los datos"
    };
    load();
  }, []); // [] = solo al aparecer el componente

  return <ul>{/* ... */}</ul>;
}`,
      `function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const load = async () => {
      const response = await fetch(
        '/api/users?page=1&limit=2'
      );
      // ...continues in "React uses the data"
    };
    load();
  }, []); // [] = only when the component appears

  return <ul>{/* ... */}</ul>;
}`
    ),
  },
  {
    id: 'request',
    slot: 'request',
    zone: 'network',
    title: t('Se arma y viaja la petición', 'The request is built and travels'),
    what: t(
      [
        'El navegador escribe la petición como **texto**: línea de inicio y headers.',
        '`Accept` dice qué formatos acepta de vuelta; `Origin`, desde qué página sale.',
        'Un GET solo pide datos: viaja directo, sin pasos extra.',
        'Termina con una línea vacía y **sin body**.',
      ],
      [
        'The browser writes the request as **text**: start line and headers.',
        '`Accept` says which formats it accepts back; `Origin`, which page it comes from.',
        'A GET only asks for data: it goes straight, no extra steps.',
        'It ends with an empty line and **no body**.',
      ]
    ),
    http: `GET /api/users?page=1&limit=2 HTTP/1.1
Host: localhost:3000
Accept: */*
Origin: http://localhost:5173
Connection: keep-alive

`,
    codeLang: 'javascript',
    code: t(
      `// fetch(url) sin opciones equivale a:
fetch('/api/users?page=1&limit=2', {
  method: 'GET',  // el método por defecto
  headers: { Accept: '*/*' },
});

// La query se puede armar con URLSearchParams:
const params = new URLSearchParams({ page: 1, limit: 2 });
fetch('/api/users?' + params);  // /api/users?page=1&limit=2

// Un GET no puede llevar body:
// TypeError: Request with GET/HEAD method cannot have body.`,
      `// fetch(url) with no options is the same as:
fetch('/api/users?page=1&limit=2', {
  method: 'GET',  // the default method
  headers: { Accept: '*/*' },
});

// The query can be built with URLSearchParams:
const params = new URLSearchParams({ page: 1, limit: 2 });
fetch('/api/users?' + params);  // /api/users?page=1&limit=2

// A GET cannot carry a body:
// TypeError: Request with GET/HEAD method cannot have body.`
    ),
  },
  {
    id: 'express-in',
    slot: 'express-in',
    zone: 'server',
    title: t('Express recibe el pedido', 'Express receives the request'),
    what: t(
      [
        'Node escucha en el puerto 3000 y acepta la conexión.',
        'Express arma `req` y `res`.',
        'La query ya viene separada en un objeto: `req.query`.',
        'Ojo: sus valores son siempre **texto** (`"1"`, no `1`).',
      ],
      [
        'Node listens on port 3000 and accepts the connection.',
        'Express builds `req` and `res`.',
        'The query already comes split into an object: `req.query`.',
        'Careful: its values are always **strings** (`"1"`, not `1`).',
      ]
    ),
    http: t(
      `Llegó al servidor:

GET /api/users?page=1&limit=2 HTTP/1.1
Host: localhost:3000
Accept: */*`,
      `Arrived at the server:

GET /api/users?page=1&limit=2 HTTP/1.1
Host: localhost:3000
Accept: */*`
    ),
    codeLang: 'javascript',
    code: t(
      `// Dentro de Express, para este pedido:
req.method;  // 'GET'
req.path;  // '/api/users'
req.query;  // { page: '1', limit: '2' }  <- texto
req.query.page;  // '1'
req.body;  // undefined: un GET no tiene body

app.listen(3000);`,
      `// Inside Express, for this request:
req.method;  // 'GET'
req.path;  // '/api/users'
req.query;  // { page: '1', limit: '2' }  <- strings
req.query.page;  // '1'
req.body;  // undefined: a GET has no body

app.listen(3000);`
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
        'cors(): agrega `Access-Control-Allow-Origin` para que el navegador deje leer la respuesta.',
        '`express.json()`: no hace nada, porque no hay body.',
        'Cada uno llama a `next()` para pasar al siguiente.',
      ],
      [
        '`morgan`: logs the request in the terminal.',
        'cors(): adds `Access-Control-Allow-Origin` so the browser lets the response be read.',
        '`express.json()`: does nothing, because there is no body.',
        'Each one calls `next()` to move to the next.',
      ]
    ),
    http: t(
      `La respuesta todavía no salió,
pero ya tiene un header preparado:

Access-Control-Allow-Origin: *`,
      `The response has not left yet,
but it already has a header ready:

Access-Control-Allow-Origin: *`
    ),
    codeLang: 'javascript',
    code: t(
      `import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

// Se ejecutan EN ORDEN, para cada pedido:
app.use(morgan('dev'));  // GET ... 200 8 ms
app.use(cors());  // agrega Access-Control-Allow-Origin
app.use(express.json());  // en un GET no hace nada (no hay body)

app.use('/api/users', usersRouter);`,
      `import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

// They run IN ORDER, for every request:
app.use(morgan('dev'));  // GET ... 200 8 ms
app.use(cors());  // adds Access-Control-Allow-Origin
app.use(express.json());  // does nothing on a GET (no body)

app.use('/api/users', usersRouter);`
    ),
  },
  {
    id: 'router',
    slot: 'router',
    zone: 'server',
    title: t('El router encuentra la ruta', 'The router finds the route'),
    what: t(
      [
        'Busca una ruta con el mismo **método** y **ruta**: `GET` + `/api/users`.',
        'La query no cuenta para elegir: `/api/users?page=1` coincide con `/api/users`.',
        'Ejecuta el controlador `getAll`.',
        'Si nada coincidiera, Express respondería `404` ("Cannot GET /api/users").',
      ],
      [
        'It looks for a route with the same **method** and **path**: `GET` + `/api/users`.',
        'The query does not count when choosing: `/api/users?page=1` matches `/api/users`.',
        'It runs the `getAll` controller.',
        'If nothing matched, Express would respond `404` ("Cannot GET /api/users").',
      ]
    ),
    http: t(
      `GET /api/users?page=1&limit=2
───  ──────────
 │        └── ruta:    /api/users
 └─────────── método:  GET

?page=1&limit=2  -> queda en req.query`,
      `GET /api/users?page=1&limit=2
───  ──────────
 │        └── path:    /api/users
 └─────────── method:  GET

?page=1&limit=2  -> stays in req.query`
    ),
    codeLang: 'javascript',
    code: t(
      `// routes/users.routes.js
const router = Router();

router.get('/', getAll);      // <-- leer
router.get('/:id', getOne);  // GET /api/users/64f1...
router.post('/', create);  // POST /api/users

export default router;

// app.js
app.use('/api/users', router);`,
      `// routes/users.routes.js
const router = Router();

router.get('/', getAll);      // <-- read
router.get('/:id', getOne);  // GET /api/users/64f1...
router.post('/', create);  // POST /api/users

export default router;

// app.js
app.use('/api/users', router);`
    ),
  },
  {
    id: 'controller',
    slot: 'controller',
    zone: 'server',
    title: t('El controlador prepara la consulta', 'The controller prepares the query'),
    what: t(
      [
        'Lee la query y la convierte a números (`req.query` trae texto).',
        'Calcula cuántos saltear: `(page - 1) * limit` = 0.',
        'Le pide los datos a la base con `await`.',
        'Mientras espera, Node puede atender otros pedidos.',
      ],
      [
        'Reads the query and converts it to numbers (`req.query` holds strings).',
        'Computes how many to skip: `(page - 1) * limit` = 0.',
        'Asks the database for the data, with `await`.',
        'While waiting, Node can handle other requests.',
      ]
    ),
    http: t(
      `GET /api/users?page=1&limit=2   ⏳ pendiente

El navegador sigue esperando:
todavía no hay respuesta.`,
      `GET /api/users?page=1&limit=2   ⏳ pending

The browser is still waiting:
there is no response yet.`
    ),
    codeLang: 'javascript',
    code: t(
      `export const getAll = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;  // '1' -> 1
    const limit = Number(req.query.limit) || 10; // '2' -> 2

    const users = await User.find()
      .skip((page - 1) * limit)  // saltear 0
      .limit(limit);  // traer 2

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500)
      .json({ message: 'Error del servidor' });
  }
};`,
      `export const getAll = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;  // '1' -> 1
    const limit = Number(req.query.limit) || 10; // '2' -> 2

    const users = await User.find()
      .skip((page - 1) * limit)  // skip 0
      .limit(limit);  // take 2

    res.status(200).json(users);
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
    title: t('La base busca y devuelve', 'The database searches and returns'),
    what: t(
      [
        'Mongoose traduce la llamada a un comando `find` de MongoDB.',
        'Entre Node y MongoDB **no se usa HTTP**.',
        'MongoDB recorre la colección `users`, saltea 0 y toma 2.',
        'Si no hubiera ninguno, devolvería `[]`: sigue siendo un **200**, no un 404.',
      ],
      [
        'Mongoose translates the call into a MongoDB `find` command.',
        'Node and MongoDB **do not use HTTP**.',
        'MongoDB scans the `users` collection, skips 0 and takes 2.',
        'If there were none, it would return `[]`: still a **200**, not a 404.',
      ]
    ),
    http: t(
      `GET /api/users?page=1&limit=2   ⏳ pendiente

(la conexión con el navegador
 sigue abierta, esperando)`,
      `GET /api/users?page=1&limit=2   ⏳ pending

(the connection with the browser
 is still open, waiting)`
    ),
    codeLang: 'javascript',
    code: t(
      `// Lo que escribís en Node (Mongoose):
await User.find().skip(0).limit(2);

// Lo mismo en la consola de MongoDB (mongosh):
db.users.find({}).skip(0).limit(2)

// El resultado: un array de documentos
[
  { _id: ObjectId('64f1...'), name: 'Ana', ... },
  { _id: ObjectId('64f2...'), name: 'Beto', ... },
]`,
      `// What you write in Node (Mongoose):
await User.find().skip(0).limit(2);

// The same in the MongoDB console (mongosh):
db.users.find({}).skip(0).limit(2)

// The result: an array of documents
[
  { _id: ObjectId('64f1...'), name: 'Ana', ... },
  { _id: ObjectId('64f2...'), name: 'Beto', ... },
]`
    ),
  },
  {
    id: 'response',
    slot: 'response',
    zone: 'server',
    title: t('Express arma la respuesta 200', 'Express builds the 200 response'),
    what: t(
      [
        '`res.status(200).json(users)` convierte el array en texto JSON.',
        'Express agrega headers: `Content-Type`, `Content-Length` y un `ETag`.',
        'El `ETag` es una "huella" del contenido, que sirve para la caché.',
        '`morgan` escribe: `GET /api/users?page=1&limit=2 200 10 ms`.',
      ],
      [
        '`res.status(200).json(users)` turns the array into JSON text.',
        'Express adds headers: `Content-Type`, `Content-Length` and an `ETag`.',
        'The `ETag` is a "fingerprint" of the content, used for caching.',
        '`morgan` writes: `GET /api/users?page=1&limit=2 200 10 ms`.',
      ]
    ),
    http: `HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 124
ETag: W/"7c-Zr0qN3x..."

[{"_id":"64f1...","name":"Ana",...},
 {"_id":"64f2...","name":"Beto",...}]`,
    codeLang: 'javascript',
    code: t(
      `res.status(200).json(users);

// Por dentro, Express hace algo así:
const body = JSON.stringify(users);  // array -> texto
res.setHeader('Content-Type', 'application/json; charset=utf-8');
res.setHeader('Content-Length', Buffer.byteLength(body));
res.setHeader('ETag', huella(body));  // para la caché
res.end(body);  // ¡enviar!`,
      `res.status(200).json(users);

// Inside, Express does something like this:
const body = JSON.stringify(users);  // array -> text
res.setHeader('Content-Type', 'application/json; charset=utf-8');
res.setHeader('Content-Length', Buffer.byteLength(body));
res.setHeader('ETag', fingerprint(body));  // for caching
res.end(body);  // send!`
    ),
  },
  {
    id: 'client-use',
    slot: 'client-use',
    zone: 'client',
    title: t('React usa los datos', 'React uses the data'),
    what: t(
      [
        '`response.ok` es true (200): salió bien.',
        '`await response.json()` convierte el texto JSON en un array.',
        '`setUsers(data)` guarda el array en el estado y React redibuja la lista.',
        'Ojo: fetch **no** lanza error con 4xx/5xx. Por eso se revisa `response.ok`.',
      ],
      [
        '`response.ok` is true (200): it went well.',
        '`await response.json()` turns the JSON text into an array.',
        '`setUsers(data)` stores the array in state and React redraws the list.',
        'Careful: fetch does **not** throw on 4xx/5xx. That is why `response.ok` is checked.',
      ]
    ),
    http: t(
      `Body recibido (texto JSON):

[
  { "_id": "64f1...", "name": "Ana",  ... },
  { "_id": "64f2...", "name": "Beto", ... }
]`,
      `Body received (JSON text):

[
  { "_id": "64f1...", "name": "Ana",  ... },
  { "_id": "64f2...", "name": "Beto", ... }
]`
    ),
    codeLang: 'javascript',
    code: t(
      `const load = async () => {
  try {
    const response = await fetch(url);
    if (!response.ok) {  // 4xx o 5xx
      throw new Error('Error ' + response.status);
    }
    const data = await response.json();  // texto -> array
    setUsers(data);  // re-render
  } catch (error) {
    setError(error.message);
  }
};

// En pantalla: <li>Ana</li> <li>Beto</li>`,
      `const load = async () => {
  try {
    const response = await fetch(url);
    if (!response.ok) {  // 4xx or 5xx
      throw new Error('Error ' + response.status);
    }
    const data = await response.json();  // text -> array
    setUsers(data);  // re-render
  } catch (error) {
    setError(error.message);
  }
};

// On screen: <li>Ana</li> <li>Beto</li>`
    ),
  },
  {
    id: 'variant-404',
    slot: 'variant-a',
    zone: 'extra',
    title: t('Variante: pedir uno que no existe', 'Variation: ask for one that does not exist'),
    what: t(
      [
        'Para pedir **un** usuario, el id va en la ruta: `/api/users/:id` → `req.params.id`.',
        'Si la base devuelve `null`, el controlador responde **404 Not Found**.',
        'Para fetch es una respuesta normal: `response.ok` es false y hay que manejarlo.',
        'Un id con formato inválido daría un **400** antes de ir a la base.',
      ],
      [
        'To ask for **one** user, the id goes in the path: `/api/users/:id` → `req.params.id`.',
        'If the database returns `null`, the controller responds **404 Not Found**.',
        'For fetch it is a normal response: `response.ok` is false and you must handle it.',
        'An invalid id format would give a **400** before touching the database.',
      ]
    ),
    http: `GET /api/users/64f9abc... HTTP/1.1
Host: localhost:3000

HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8

{"message":"Usuario no encontrado"}`,
    codeLang: 'javascript',
    code: t(
      `export const getOne = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {  // formato inválido
    return res.status(400)
      .json({ message: 'Id inválido' });
  }

  const user = await User.findById(id);
  if (!user) {  // no existe
    return res.status(404)
      .json({ message: 'Usuario no encontrado' });
  }
  res.json(user);
};`,
      `export const getOne = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {  // invalid format
    return res.status(400)
      .json({ message: 'Invalid id' });
  }

  const user = await User.findById(id);
  if (!user) {  // does not exist
    return res.status(404)
      .json({ message: 'User not found' });
  }
  res.json(user);
};`
    ),
  },
  {
    id: 'variant-cache',
    slot: 'variant-b',
    zone: 'extra',
    title: t('Variante: el segundo GET (caché)', 'Variation: the second GET (cache)'),
    what: t(
      [
        'La primera respuesta trajo un `ETag`. El navegador lo guarda con los datos.',
        'Al repetir el GET, manda `If-None-Match` con ese ETag: "¿cambió algo?".',
        'Si no cambió, Express responde **304 Not Modified** sin body y se usa la copia.',
        'Por esto un GET nunca debe cambiar datos: el navegador puede repetirlo o no.',
      ],
      [
        'The first response carried an `ETag`. The browser stores it with the data.',
        'When the GET repeats, it sends `If-None-Match` with that ETag: "did anything change?".',
        'If not, Express responds **304 Not Modified** without a body and the copy is used.',
        'This is why a GET must never change data: the browser may repeat it or not.',
      ]
    ),
    http: `GET /api/users?page=1&limit=2 HTTP/1.1
If-None-Match: W/"7c-Zr0qN3x..."

HTTP/1.1 304 Not Modified
ETag: W/"7c-Zr0qN3x..."

(sin body: se usa la copia guardada)`,
    codeLang: 'javascript',
    code: t(
      `// Express agrega el ETag solo (viene activado por defecto).

// Para que una ruta NUNCA se cachee:
res.set('Cache-Control', 'no-store');

// Para que fetch pida siempre datos frescos:
fetch(url, { cache: 'no-store' });`,
      `// Express adds the ETag by itself (on by default).

// So a route is NEVER cached:
res.set('Cache-Control', 'no-store');

// So fetch always asks for fresh data:
fetch(url, { cache: 'no-store' });`
    ),
  },
]);
