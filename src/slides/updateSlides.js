// src/slides/updateSlides.js — Presentación UPDATE (PUT), paso a paso
import { t, withPositions } from './shared';

export const meta = {
  id: 'update',
  method: 'PUT',
  accent: '#d29922',
  label: t('UPDATE', 'UPDATE'),
  sub: t('Modificar un usuario', 'Update a user'),
  example: 'PUT /api/users/:id',
  summary: t(
    'Qué pasa al modificar un usuario: el id va en la ruta y los datos nuevos, en el body.',
    'What happens when updating a user: the id goes in the path and the new data in the body.'
  ),
};

export const outro = {
  title: t('Todo el recorrido de un PUT', 'The whole PUT route'),
  text: t(
    'QUÉ usuario se modifica va en la ruta (params); QUÉ cambia, en el body. Si el id no existe, es un 404. PUT es idempotente: repetirlo deja el mismo resultado.',
    'WHICH user is updated goes in the path (params); WHAT changes, in the body. If the id does not exist, it is a 404. PUT is idempotent: repeating it leaves the same result.'
  ),
};

export const slides = withPositions([
  {
    id: 'what',
    slot: 'what',
    zone: 'client',
    title: t('¿Qué es PUT?', 'What is PUT?'),
    what: t(
      [
        'Es el método HTTP para **modificar** un recurso que ya existe.',
        'El **id** del recurso va en la ruta (`/api/users/:id`).',
        'Los **datos nuevos** van en el body, como en un POST.',
        'Es *idempotente*: mandarlo una o diez veces deja el mismo resultado.',
      ],
      [
        'It is the HTTP method to **update** a resource that already exists.',
        'The resource **id** goes in the path (`/api/users/:id`).',
        'The **new data** goes in the body, like in a POST.',
        'It is *idempotent*: sending it once or ten times leaves the same result.',
      ]
    ),
    http: `PUT /api/users/64f1a2b3 HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{ "name": "Ana María" }`,
    codeLang: 'javascript',
    code: t(
      `// Modificar un usuario desde React:
await fetch(\`/api/users/\${id}\`, {
  method: 'PUT',  // modificar
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Ana María' }),  // lo que cambia
});

// PUT vs PATCH:
// PUT   -> reemplaza el recurso entero
// PATCH -> cambia solo algunos campos
// Muchas APIs usan PUT para las dos cosas.`,
      `// Update a user from React:
await fetch(\`/api/users/\${id}\`, {
  method: 'PUT',  // update
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Ana María' }),  // what changes
});

// PUT vs PATCH:
// PUT   -> replaces the whole resource
// PATCH -> changes only some fields
// Many APIs use PUT for both.`
    ),
  },
  {
    id: 'client-send',
    slot: 'client-send',
    zone: 'client',
    title: t('React envía los cambios', 'React sends the changes'),
    what: t(
      [
        'La persona edita el formulario y hace clic en "Guardar cambios".',
        'El handler arma la URL con el **id** del usuario y el body con los datos nuevos.',
        '`JSON.stringify()` convierte el objeto en texto JSON.',
        'Con `await`, el código espera la respuesta.',
      ],
      [
        'The person edits the form and clicks "Save changes".',
        'The handler builds the URL with the user **id** and the body with the new data.',
        '`JSON.stringify()` turns the object into JSON text.',
        'With `await`, the code waits for the response.',
      ]
    ),
    http: t(
      `(todavía no viajó nada)

Por enviar:
PUT /api/users/64f1a2b3  +  body JSON`,
      `(nothing has traveled yet)

About to send:
PUT /api/users/64f1a2b3  +  JSON body`
    ),
    codeLang: 'javascript',
    code: t(
      `const handleUpdate = async (id) => {
  const response = await fetch(\`/api/users/\${id}\`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: form.name }),
  });
  // ...sigue en "React usa la respuesta"
};

// El id identifica QUÉ usuario -> va en la URL
// El body dice QUÉ cambia      -> va en el body`,
      `const handleUpdate = async (id) => {
  const response = await fetch(\`/api/users/\${id}\`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: form.name }),
  });
  // ...continues in "React uses the response"
};

// The id identifies WHICH user -> goes in the URL
// The body says WHAT changes    -> goes in the body`
    ),
  },
  {
    id: 'request',
    slot: 'request',
    zone: 'network',
    title: t('La petición viaja', 'The request travels'),
    what: t(
      [
        'Viaja el PUT como **texto**: la ruta lleva el id y el body, los datos nuevos.',
        '`Content-Type: application/json` indica cómo leer el body.',
        'Viaja por una conexión TCP; con `https` iría cifrada.',
        'En producción, por `https`, todo esto iría cifrado.',
      ],
      [
        'The PUT travels as **text**: the path carries the id and the body, the new data.',
        '`Content-Type: application/json` says how to read the body.',
        'It travels over a TCP connection; with `https` it would be encrypted.',
        'In production, over `https`, all of this would be encrypted.',
      ]
    ),
    http: `PUT /api/users/64f1a2b3 HTTP/1.1
Host: localhost:3000
Origin: http://localhost:5173
Content-Type: application/json
Content-Length: 21

{"name":"Ana María"}`,
    codeLang: 'bash',
    code: t(
      `# El mismo PUT desde la terminal:
curl -v -X PUT localhost:3000/api/users/64f1a2b3 \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Ana María"}'

# El id va en la URL; los datos, en -d (el body).`,
      `# The same PUT from the terminal:
curl -v -X PUT localhost:3000/api/users/64f1a2b3 \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Ana María"}'

# The id goes in the URL; the data, in -d (the body).`
    ),
  },
  {
    id: 'express-in',
    slot: 'express-in',
    zone: 'server',
    title: t('Express recibe el pedido', 'Express receives the request'),
    what: t(
      [
        'Node acepta la conexión y Express arma `req` y `res`.',
        'El id de la URL quedará en `req.params.id` cuando el router lo resuelva.',
        'El body todavía es un flujo de bytes: falta parsearlo.',
        'De eso se encarga `express.json()` en el paso siguiente.',
      ],
      [
        'Node accepts the connection and Express builds `req` and `res`.',
        'The URL id will end up in `req.params.id` once the router resolves it.',
        'The body is still a stream of bytes: it needs parsing.',
        '`express.json()` handles that in the next step.',
      ]
    ),
    http: t(
      `Llegó al servidor:

PUT /api/users/64f1a2b3 HTTP/1.1
Content-Type: application/json

{"name":"Ana María"}`,
      `Arrived at the server:

PUT /api/users/64f1a2b3 HTTP/1.1
Content-Type: application/json

{"name":"Ana María"}`
    ),
    codeLang: 'javascript',
    code: t(
      `// Dentro de Express, para este pedido:
req.method;  // 'PUT'
req.path;  // '/api/users/64f1a2b3'
req.body;  // undefined todavía (falta express.json)

// El id se leerá cuando coincida la ruta '/:id':
// req.params.id -> '64f1a2b3'

app.listen(3000);`,
      `// Inside Express, for this request:
req.method;  // 'PUT'
req.path;  // '/api/users/64f1a2b3'
req.body;  // still undefined (express.json pending)

// The id will be read when the '/:id' route matches:
// req.params.id -> '64f1a2b3'

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
        'cors(): agrega los headers de permiso a la respuesta.',
        '**`express.json()`**: parsea el body y lo deja en `req.body`.',
        'El id de la URL todavía no se tocó: eso lo hace el router.',
      ],
      [
        '`morgan`: logs the request in the terminal.',
        'cors(): adds the permission headers to the response.',
        '**`express.json()`**: parses the body and leaves it in `req.body`.',
        'The URL id is not touched yet: the router does that.',
      ]
    ),
    http: t(
      `El body pasa a ser un objeto:

req.body = { name: 'Ana María' }`,
      `The body becomes an object:

req.body = { name: 'Ana María' }`
    ),
    codeLang: 'javascript',
    code: t(
      `const app = express();

app.use(morgan('dev'));  // PUT ... 200 11 ms
app.use(cors());
app.use(express.json());  // <-- body JSON -> req.body

app.use('/api/users', usersRouter);`,
      `const app = express();

app.use(morgan('dev'));  // PUT ... 200 11 ms
app.use(cors());
app.use(express.json());  // <-- JSON body -> req.body

app.use('/api/users', usersRouter);`
    ),
  },
  {
    id: 'router',
    slot: 'router',
    zone: 'server',
    title: t('El router captura el id', 'The router captures the id'),
    what: t(
      [
        'Busca `PUT` + `/api/users/:id`. El `:id` es un **parámetro de ruta**.',
        'Lo que esté en esa posición queda en `req.params.id`.',
        'Ejecuta el controlador `update`.',
        'Con `GET /api/users/:id` iría a otra función: el método decide.',
      ],
      [
        'It looks for `PUT` + `/api/users/:id`. The `:id` is a **route parameter**.',
        'Whatever is in that position ends up in `req.params.id`.',
        'It runs the `update` controller.',
        'With `GET /api/users/:id` it would go to another function: the method decides.',
      ]
    ),
    http: t(
      `PUT /api/users/64f1a2b3
────  ───────────┬──────
 │               └── req.params.id = '64f1a2b3'
 └── método: PUT

(el body ya está en req.body)`,
      `PUT /api/users/64f1a2b3
────  ───────────┬──────
 │               └── req.params.id = '64f1a2b3'
 └── method: PUT

(the body is already in req.body)`
    ),
    codeLang: 'javascript',
    code: t(
      `// routes/users.routes.js
router.get('/:id', getOne);  // GET    /api/users/:id
router.put('/:id', update);     // <-- modificar
router.delete('/:id', remove);  // DELETE /api/users/:id

// ':id' es un comodín: captura cualquier valor en esa posición
// y lo guarda en req.params.id`,
      `// routes/users.routes.js
router.get('/:id', getOne);  // GET    /api/users/:id
router.put('/:id', update);     // <-- update
router.delete('/:id', remove);  // DELETE /api/users/:id

// ':id' is a wildcard: it captures any value in that position
// and stores it in req.params.id`
    ),
  },
  {
    id: 'controller',
    slot: 'controller',
    zone: 'server',
    title: t('El controlador busca y actualiza', 'The controller finds and updates'),
    what: t(
      [
        'Toma el id de `req.params` y los datos de `req.body`.',
        '`findByIdAndUpdate` busca por id y aplica los cambios en una sola operación.',
        '`{ new: true }` pide que devuelva el documento **ya modificado**.',
        'Si el id no existe, la base devuelve `null` (lo vemos en la variante).',
      ],
      [
        'Takes the id from `req.params` and the data from `req.body`.',
        '`findByIdAndUpdate` finds by id and applies the changes in one operation.',
        '`{ new: true }` asks it to return the **already updated** document.',
        'If the id does not exist, the database returns `null` (see the variant).',
      ]
    ),
    http: t(
      `PUT /api/users/64f1a2b3   ⏳ pendiente

El navegador sigue esperando:
todavía no hay respuesta.`,
      `PUT /api/users/64f1a2b3   ⏳ pending

The browser is still waiting:
there is no response yet.`
    ),
    codeLang: 'javascript',
    code: t(
      `export const update = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,  // QUÉ usuario
      req.body,  // QUÉ cambia
      { new: true,  // devolver el documento ya modificado
        runValidators: true } // aplicar las reglas del schema
    );
    if (!user) {
      return res.status(404)
        .json({ message: 'Usuario no encontrado' });
    }
    res.json(user);  // 200
  } catch (error) {
    console.error(error);
    res.status(500)
      .json({ message: 'Error del servidor' });
  }
};`,
      `export const update = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,  // WHICH user
      req.body,  // WHAT changes
      { new: true,  // return the already updated document
        runValidators: true } // apply the schema rules
    );
    if (!user) {
      return res.status(404)
        .json({ message: 'User not found' });
    }
    res.json(user);  // 200
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
    title: t('La base busca y modifica', 'The database finds and modifies'),
    what: t(
      [
        'Mongoose traduce la llamada a una orden de MongoDB (`findAndModify`).',
        'MongoDB busca el documento por `_id` y cambia solo los campos indicados.',
        'Es una operación atómica: nadie ve el dato "a medio cambiar".',
        'Devuelve el documento ya modificado (o `null` si ese id no existe).',
      ],
      [
        'Mongoose translates the call into a MongoDB command (`findAndModify`).',
        'MongoDB finds the document by `_id` and changes only the given fields.',
        'It is an atomic operation: nobody sees the data "half changed".',
        'It returns the already modified document (or `null` if that id does not exist).',
      ]
    ),
    http: t(
      `PUT /api/users/64f1a2b3   ⏳ pendiente

(la conexión con el navegador
 sigue abierta, esperando)`,
      `PUT /api/users/64f1a2b3   ⏳ pending

(the connection with the browser
 is still open, waiting)`
    ),
    codeLang: 'javascript',
    code: t(
      `// Lo que escribís en Node (Mongoose):
await User.findByIdAndUpdate(
  id, { name: 'Ana María' }, { new: true });

// Lo mismo en la consola de MongoDB (mongosh):
db.users.updateOne(
  { _id: ObjectId('64f1a2b3') },  // a quién
  { $set: { name: 'Ana María' } }  // qué cambiar
)

// Resultado (con new: true): el documento ya actualizado
// { _id: '64f1a2b3', name: 'Ana María', email: 'ana@mail.com' }`,
      `// What you write in Node (Mongoose):
await User.findByIdAndUpdate(
  id, { name: 'Ana María' }, { new: true });

// The same in the MongoDB console (mongosh):
db.users.updateOne(
  { _id: ObjectId('64f1a2b3') },  // who
  { $set: { name: 'Ana María' } }  // what to change
)

// Result (with new: true): the already updated document
// { _id: '64f1a2b3', name: 'Ana María', email: 'ana@mail.com' }`
    ),
  },
  {
    id: 'response',
    slot: 'response',
    zone: 'server',
    title: t('Express arma la respuesta 200', 'Express builds the 200 response'),
    what: t(
      [
        '`await` termina con el documento ya modificado.',
        '`res.json(user)` responde **200 OK** con el recurso actualizado.',
        'Devolver el recurso le confirma al cliente cómo quedó.',
        '`morgan` escribe: `PUT /api/users/64f1a2b3 200 11 ms`.',
      ],
      [
        '`await` finishes with the already modified document.',
        '`res.json(user)` responds **200 OK** with the updated resource.',
        'Returning the resource confirms to the client how it ended up.',
        '`morgan` writes: `PUT /api/users/64f1a2b3 200 11 ms`.',
      ]
    ),
    http: `HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8

{"_id":"64f1a2b3","name":"Ana María",
 "email":"ana@mail.com","updatedAt":"2026-..."}`,
    codeLang: 'javascript',
    code: t(
      `res.json(user);  // status 200 por defecto

// 'user' es el documento ya modificado:
// {
//   _id: '64f1a2b3',
//   name: 'Ana María',        <- el cambio
//   email: 'ana@mail.com',
//   updatedAt: '2026-01-10T...'  <- se actualizó solo
// }`,
      `res.json(user);  // status 200 by default

// 'user' is the already modified document:
// {
//   _id: '64f1a2b3',
//   name: 'Ana María',        <- the change
//   email: 'ana@mail.com',
//   updatedAt: '2026-01-10T...'  <- updated automatically
// }`
    ),
  },
  {
    id: 'client-use',
    slot: 'client-use',
    zone: 'client',
    title: t('React usa la respuesta', 'React uses the response'),
    what: t(
      [
        '`response.ok` es true (200): salió bien.',
        '`await response.json()` da el usuario ya actualizado.',
        'Se reemplaza en la lista: `map` cambia solo el que coincide por `_id`.',
        'React redibuja y la pantalla muestra el nombre nuevo.',
      ],
      [
        '`response.ok` is true (200): it went well.',
        '`await response.json()` gives the already updated user.',
        'It is replaced in the list: `map` changes only the one matching by `_id`.',
        'React redraws and the screen shows the new name.',
      ]
    ),
    http: t(
      `Body recibido (texto JSON):

{
  "_id": "64f1a2b3",
  "name": "Ana María",
  "email": "ana@mail.com"
}`,
      `Body received (JSON text):

{
  "_id": "64f1a2b3",
  "name": "Ana María",
  "email": "ana@mail.com"
}`
    ),
    codeLang: 'javascript',
    code: t(
      `  const response = await fetch(
    \`/api/users/\${id}\`, opciones);
  const data = await response.json();

  if (!response.ok) {
    setError(data.message);
    return;
  }

  // Reemplazar solo el usuario modificado
  setUsers((prev) =>
    prev.map((u) => (u._id === data._id ? data : u))
  );`,
      `  const response = await fetch(
    \`/api/users/\${id}\`, opciones);
  const data = await response.json();

  if (!response.ok) {
    setError(data.message);
    return;
  }

  // Replace only the updated user
  setUsers((prev) =>
    prev.map((u) => (u._id === data._id ? data : u))
  );`
    ),
  },
  {
    id: 'variant-404',
    slot: 'variant-a',
    zone: 'extra',
    title: t('Variante: el usuario no existe (404)', 'Variation: the user does not exist (404)'),
    what: t(
      [
        'El id tiene formato válido, pero no hay ningún usuario con ese `_id`.',
        '`findByIdAndUpdate` devuelve `null`: no se modificó nada.',
        'El controlador responde **404 Not Found**.',
        'Conviene volver a pedir la lista: tu pantalla podía tener datos viejos.',
      ],
      [
        'The id has a valid format, but there is no user with that `_id`.',
        '`findByIdAndUpdate` returns `null`: nothing was modified.',
        'The controller responds **404 Not Found**.',
        'It is worth re-fetching the list: your screen may have had stale data.',
      ]
    ),
    http: `PUT /api/users/64f0000000 HTTP/1.1
Content-Type: application/json

{"name":"Ana María"}

HTTP/1.1 404 Not Found
{"message":"Usuario no encontrado"}`,
    codeLang: 'javascript',
    code: t(
      `const user = await User.findByIdAndUpdate(
  id, req.body, { new: true });

if (!user) {
  // La base devolvió null: ese _id no existe
  return res.status(404)
    .json({ message: 'Usuario no encontrado' });
}

// En el cliente:
if (response.status === 404) {
  setError('Ese usuario ya no existe');
  recargarLista();  // la pantalla tenía datos viejos
}`,
      `const user = await User.findByIdAndUpdate(
  id, req.body, { new: true });

if (!user) {
  // The database returned null: that _id does not exist
  return res.status(404)
    .json({ message: 'User not found' });
}

// On the client:
if (response.status === 404) {
  setError('That user no longer exists');
  reloadList();  // the screen had stale data
}`
    ),
  },
  {
    id: 'variant-patch',
    slot: 'variant-b',
    zone: 'extra',
    title: t('Variante: PUT vs PATCH', 'Variation: PUT vs PATCH'),
    what: t(
      [
        '**PUT** reemplaza el recurso entero: lo que no mandes podría borrarse.',
        '**PATCH** cambia solo los campos que enviás.',
        'En Mongoose, `$set` (que usa `findByIdAndUpdate`) actúa como un PATCH.',
        'Lo importante: que el frontend y el backend usen el mismo método.',
      ],
      [
        '**PUT** replaces the whole resource: what you don\'t send could be removed.',
        '**PATCH** changes only the fields you send.',
        'In Mongoose, `$set` (used by `findByIdAndUpdate`) behaves like a PATCH.',
        'The key thing: frontend and backend must use the same method.',
      ]
    ),
    http: `PATCH /api/users/64f1a2b3 HTTP/1.1
Content-Type: application/json

{"email":"nuevo@mail.com"}

HTTP/1.1 200 OK
(solo cambió el email; el resto queda igual)`,
    codeLang: 'javascript',
    code: t(
      `// La ruta puede aceptar los dos métodos con el mismo controlador:
router.put('/:id', update);
router.patch('/:id', update);

// findByIdAndUpdate con $set cambia SOLO los campos enviados,
// así que en la práctica se comporta como PATCH:
await User.findByIdAndUpdate(id, { email: 'nuevo@mail.com' });
// -> name y los demás campos quedan intactos`,
      `// The route can accept both methods with the same controller:
router.put('/:id', update);
router.patch('/:id', update);

// findByIdAndUpdate with $set changes ONLY the sent fields,
// so in practice it behaves like PATCH:
await User.findByIdAndUpdate(id, { email: 'new@mail.com' });
// -> name and the other fields stay intact`
    ),
  },
]);
