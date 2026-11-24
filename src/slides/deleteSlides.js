// src/slides/deleteSlides.js — Presentación DELETE, paso a paso
import { t, withPositions } from './shared';

export const meta = {
  id: 'delete',
  method: 'DELETE',
  accent: '#f85149',
  label: t('DELETE', 'DELETE'),
  sub: t('Eliminar un usuario', 'Delete a user'),
  example: 'DELETE /api/users/:id',
  summary: t(
    'Qué pasa al eliminar un usuario: el id va en la ruta, no hay body y la respuesta suele ser 204 (sin contenido).',
    'What happens when deleting a user: the id goes in the path, there is no body and the response is usually 204 (no content).'
  ),
};

export const outro = {
  title: t('Todo el recorrido de un DELETE', 'The whole DELETE route'),
  text: t(
    'El id va en la ruta y no hay body. Si sale bien, 204 sin contenido; si el id no existe, 404. Es idempotente: borrar algo ya borrado sigue dejando el mismo estado.',
    'The id goes in the path and there is no body. On success, 204 with no content; if the id does not exist, 404. It is idempotent: deleting something already deleted still leaves the same state.'
  ),
};

export const slides = withPositions([
  {
    id: 'what',
    slot: 'what',
    zone: 'client',
    title: t('¿Qué es DELETE?', 'What is DELETE?'),
    what: t(
      [
        'Es el método HTTP para **eliminar** un recurso.',
        'El **id** del recurso va en la ruta (`/api/users/:id`).',
        'No lleva body: todo lo necesario (el id) está en la URL.',
        'Si sale bien, la respuesta típica es **204 No Content** (sin body).',
      ],
      [
        'It is the HTTP method to **delete** a resource.',
        'The resource **id** goes in the path (`/api/users/:id`).',
        'It has no body: everything needed (the id) is in the URL.',
        'On success, the typical response is **204 No Content** (no body).',
      ]
    ),
    http: `DELETE /api/users/64f1a2b3 HTTP/1.1
Host: localhost:3000

(sin body)`,
    codeLang: 'javascript',
    code: t(
      `// Eliminar un usuario desde React:
await fetch(\`/api/users/\${id}\`, {
  method: 'DELETE',  // eliminar; sin headers ni body
});

// Conviene pedir confirmación antes de borrar:
if (!window.confirm('¿Eliminar este usuario?')) return;`,
      `// Delete a user from React:
await fetch(\`/api/users/\${id}\`, {
  method: 'DELETE',  // delete; no headers, no body
});

// It is good to ask for confirmation before deleting:
if (!window.confirm('Delete this user?')) return;`
    ),
  },
  {
    id: 'client-send',
    slot: 'client-send',
    zone: 'client',
    title: t('React pide eliminar', 'React asks to delete'),
    what: t(
      [
        'La persona hace clic en "Eliminar" y confirma.',
        'El handler arma la URL con el **id** del usuario.',
        'No hay body ni `Content-Type`: solo el método `DELETE`.',
        'Con `await`, el código espera la respuesta.',
      ],
      [
        'The person clicks "Delete" and confirms.',
        'The handler builds the URL with the user **id**.',
        'There is no body and no `Content-Type`: just the `DELETE` method.',
        'With `await`, the code waits for the response.',
      ]
    ),
    http: t(
      `(todavía no viajó nada)

Por enviar:
DELETE /api/users/64f1a2b3`,
      `(nothing has traveled yet)

About to send:
DELETE /api/users/64f1a2b3`
    ),
    codeLang: 'javascript',
    code: t(
      `const handleDelete = async (id) => {
  if (!window.confirm('¿Eliminar este usuario?')) return;

  const response = await fetch(\`/api/users/\${id}\`, {
    method: 'DELETE',
  });
  // ...sigue en "React usa la respuesta"
};

// El id identifica QUÉ usuario -> va en la URL
// No hace falta body: no se envían datos nuevos`,
      `const handleDelete = async (id) => {
  if (!window.confirm('Delete this user?')) return;

  const response = await fetch(\`/api/users/\${id}\`, {
    method: 'DELETE',
  });
  // ...continues in "React uses the response"
};

// The id identifies WHICH user -> goes in the URL
// No body needed: no new data is sent`
    ),
  },
  {
    id: 'request',
    slot: 'request',
    zone: 'network',
    title: t('La petición viaja', 'The request travels'),
    what: t(
      [
        'Viaja el DELETE como **texto**: el método, la ruta con el id y los headers.',
        'No hay `Content-Type` ni `Content-Length`: no se envía body.',
        'Termina con una línea vacía, sin nada después.',
        'Viaja por una conexión TCP; con `https` iría cifrada.',
      ],
      [
        'The DELETE travels as **text**: the method, the path with the id and the headers.',
        'There is no `Content-Type` or `Content-Length`: no body is sent.',
        'It ends with an empty line, with nothing after it.',
        'It travels over a TCP connection; with `https` it would be encrypted.',
      ]
    ),
    http: `DELETE /api/users/64f1a2b3 HTTP/1.1
Host: localhost:3000
Origin: http://localhost:5173
Accept: */*

`,
    codeLang: 'bash',
    code: t(
      `# El mismo DELETE desde la terminal:
curl -v -X DELETE localhost:3000/api/users/64f1a2b3

# -X DELETE -> el método
# No hace falta -d: DELETE no lleva body
# La respuesta esperada: HTTP/1.1 204 No Content`,
      `# The same DELETE from the terminal:
curl -v -X DELETE localhost:3000/api/users/64f1a2b3

# -X DELETE -> the method
# No -d needed: DELETE has no body
# The expected response: HTTP/1.1 204 No Content`
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
        'No hay body que parsear: `req.body` será `undefined`.',
        '`express.json()` no tendrá nada que hacer.',
      ],
      [
        'Node accepts the connection and Express builds `req` and `res`.',
        'The URL id will end up in `req.params.id` once the router resolves it.',
        'There is no body to parse: `req.body` will be `undefined`.',
        '`express.json()` will have nothing to do.',
      ]
    ),
    http: t(
      `Llegó al servidor:

DELETE /api/users/64f1a2b3 HTTP/1.1
Host: localhost:3000
Accept: */*`,
      `Arrived at the server:

DELETE /api/users/64f1a2b3 HTTP/1.1
Host: localhost:3000
Accept: */*`
    ),
    codeLang: 'javascript',
    code: t(
      `// Dentro de Express, para este pedido:
req.method;  // 'DELETE'
req.path;  // '/api/users/64f1a2b3'
req.body;  // undefined: DELETE no tiene body

// El id se leerá cuando coincida la ruta '/:id':
// req.params.id -> '64f1a2b3'`,
      `// Inside Express, for this request:
req.method;  // 'DELETE'
req.path;  // '/api/users/64f1a2b3'
req.body;  // undefined: DELETE has no body

// The id will be read when the '/:id' route matches:
// req.params.id -> '64f1a2b3'`
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
        '`express.json()`: no hace nada, porque no hay body.',
        'Cada uno llama a `next()` para pasar al siguiente.',
      ],
      [
        '`morgan`: logs the request in the terminal.',
        'cors(): adds the permission headers to the response.',
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
      `const app = express();

app.use(morgan('dev'));  // DELETE ... 204 7 ms
app.use(cors());
app.use(express.json());  // en un DELETE no hace nada

app.use('/api/users', usersRouter);`,
      `const app = express();

app.use(morgan('dev'));  // DELETE ... 204 7 ms
app.use(cors());
app.use(express.json());  // does nothing on a DELETE

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
        'Busca `DELETE` + `/api/users/:id`. El `:id` es un **parámetro de ruta**.',
        'Lo que esté en esa posición queda en `req.params.id`.',
        'Ejecuta el controlador `remove`.',
        'Si no hubiera una ruta DELETE, Express respondería `404`.',
      ],
      [
        'It looks for `DELETE` + `/api/users/:id`. The `:id` is a **route parameter**.',
        'Whatever is in that position ends up in `req.params.id`.',
        'It runs the `remove` controller.',
        'If there were no DELETE route, Express would respond `404`.',
      ]
    ),
    http: t(
      `DELETE /api/users/64f1a2b3
──────  ───────────┬──────
 │                 └── req.params.id = '64f1a2b3'
 └── método: DELETE`,
      `DELETE /api/users/64f1a2b3
──────  ───────────┬──────
 │                 └── req.params.id = '64f1a2b3'
 └── method: DELETE`
    ),
    codeLang: 'javascript',
    code: t(
      `// routes/users.routes.js
router.get('/:id', getOne);  // GET    /api/users/:id
router.put('/:id', update);  // PUT    /api/users/:id
router.delete('/:id', remove);  // <-- eliminar

// Las tres comparten la ruta '/:id', pero el MÉTODO
// manda cada una a un controlador distinto.`,
      `// routes/users.routes.js
router.get('/:id', getOne);  // GET    /api/users/:id
router.put('/:id', update);  // PUT    /api/users/:id
router.delete('/:id', remove);  // <-- delete

// The three share the '/:id' path, but the METHOD
// sends each to a different controller.`
    ),
  },
  {
    id: 'controller',
    slot: 'controller',
    zone: 'server',
    title: t('El controlador busca y elimina', 'The controller finds and deletes'),
    what: t(
      [
        'Toma el id de `req.params`.',
        '`findByIdAndDelete` busca por id y elimina en una sola operación.',
        'Si no existe, la base devuelve `null` → responde `404`.',
        'Si existe, lo borra y responde **204 No Content** (sin body).',
      ],
      [
        'Takes the id from `req.params`.',
        '`findByIdAndDelete` finds by id and deletes in one operation.',
        'If it does not exist, the database returns `null` → it responds `404`.',
        'If it exists, it deletes it and responds **204 No Content** (no body).',
      ]
    ),
    http: t(
      `DELETE /api/users/64f1a2b3   ⏳ pendiente

El navegador sigue esperando:
todavía no hay respuesta.`,
      `DELETE /api/users/64f1a2b3   ⏳ pending

The browser is still waiting:
there is no response yet.`
    ),
    codeLang: 'javascript',
    code: t(
      `export const remove = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404)
        .json({ message: 'Usuario no encontrado' });
    }

    res.status(204).end();  // 204: salió bien, sin contenido
  } catch (error) {
    console.error(error);
    res.status(500)
      .json({ message: 'Error del servidor' });
  }
};`,
      `export const remove = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404)
        .json({ message: 'User not found' });
    }

    res.status(204).end();  // 204: it worked, no content
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
    title: t('La base elimina el documento', 'The database deletes the document'),
    what: t(
      [
        'Mongoose traduce la llamada a una orden de MongoDB.',
        'MongoDB busca el documento por `_id` y lo borra de la colección `users`.',
        'Es una operación atómica.',
        'Devuelve el documento que borró (o `null` si ese id no existía).',
      ],
      [
        'Mongoose translates the call into a MongoDB command.',
        'MongoDB finds the document by `_id` and removes it from the `users` collection.',
        'It is an atomic operation.',
        'It returns the document it deleted (or `null` if that id did not exist).',
      ]
    ),
    http: t(
      `DELETE /api/users/64f1a2b3   ⏳ pendiente

(la conexión con el navegador
 sigue abierta, esperando)`,
      `DELETE /api/users/64f1a2b3   ⏳ pending

(the connection with the browser
 is still open, waiting)`
    ),
    codeLang: 'javascript',
    code: t(
      `// Lo que escribís en Node (Mongoose):
await User.findByIdAndDelete(id);

// Lo mismo en la consola de MongoDB (mongosh):
db.users.deleteOne({ _id: ObjectId('64f1a2b3') })

// Respuesta de MongoDB: { acknowledged: true, deletedCount: 1 }
// deletedCount: 0  ->  no había nada con ese id`,
      `// What you write in Node (Mongoose):
await User.findByIdAndDelete(id);

// The same in the MongoDB console (mongosh):
db.users.deleteOne({ _id: ObjectId('64f1a2b3') })

// MongoDB's answer: { acknowledged: true, deletedCount: 1 }
// deletedCount: 0  ->  there was nothing with that id`
    ),
  },
  {
    id: 'response',
    slot: 'response',
    zone: 'server',
    title: t('Express responde 204', 'Express responds 204'),
    what: t(
      [
        '`res.status(204).end()` responde **204 No Content**: salió bien y no hay nada que devolver.',
        'Un 204 **no lleva body**: por eso se usa `.end()` y no `.json()`.',
        'Otra opción válida es responder `200` con un `{ message: "Eliminado" }`.',
        '`morgan` escribe: `DELETE /api/users/64f1a2b3 204 7 ms`.',
      ],
      [
        '`res.status(204).end()` responds **204 No Content**: it worked and there is nothing to return.',
        'A 204 **has no body**: that is why `.end()` is used, not `.json()`.',
        'Another valid option is responding `200` with a `{ message: "Deleted" }`.',
        '`morgan` writes: `DELETE /api/users/64f1a2b3 204 7 ms`.',
      ]
    ),
    http: `HTTP/1.1 204 No Content
X-Powered-By: Express
Access-Control-Allow-Origin: *

(sin body)`,
    codeLang: 'javascript',
    code: t(
      `res.status(204).end();  // 204 No Content, sin body

// Alternativa, si preferís devolver algo:
// res.status(200).json({ message: 'Usuario eliminado', id });

// ¿Por qué no .json() con 204?
// Un 204 no debe tener body: el navegador lo ignoraría.`,
      `res.status(204).end();  // 204 No Content, no body

// Alternative, if you prefer to return something:
// res.status(200).json({ message: 'User deleted', id });

// Why not .json() with 204?
// A 204 must have no body: the browser would ignore it.`
    ),
  },
  {
    id: 'client-use',
    slot: 'client-use',
    zone: 'client',
    title: t('React usa la respuesta', 'React uses the response'),
    what: t(
      [
        '`response.ok` es true (204): salió bien.',
        '**No** se llama a `response.json()`: un 204 no tiene body.',
        'Se quita de la lista: `filter` deja fuera el del `_id` borrado.',
        'React redibuja y el usuario desaparece de la pantalla.',
      ],
      [
        '`response.ok` is true (204): it went well.',
        '`response.json()` is **not** called: a 204 has no body.',
        'It is removed from the list: `filter` leaves out the deleted `_id`.',
        'React redraws and the user disappears from the screen.',
      ]
    ),
    http: t(
      `Respuesta recibida:

HTTP/1.1 204 No Content

(no hay body que leer)`,
      `Response received:

HTTP/1.1 204 No Content

(there is no body to read)`
    ),
    codeLang: 'javascript',
    code: t(
      `  const response = await fetch(
    \`/api/users/\${id}\`, { method: 'DELETE' });

  if (!response.ok) {  // 404, 500...
    const data = await response.json();  // estos sí traen mensaje
    setError(data.message);
    return;
  }

  // 204: NO llamar a response.json() (no hay body)
  setUsers((prev) => prev.filter((u) => u._id !== id));`,
      `  const response = await fetch(
    \`/api/users/\${id}\`, { method: 'DELETE' });

  if (!response.ok) {  // 404, 500...
    const data = await response.json();  // these do carry a message
    setError(data.message);
    return;
  }

  // 204: do NOT call response.json() (no body)
  setUsers((prev) => prev.filter((u) => u._id !== id));`
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
        '`findByIdAndDelete` devuelve `null`: no se borró nada.',
        'El controlador responde **404 Not Found**.',
        'A diferencia del 204, este sí lleva un body con el mensaje.',
      ],
      [
        'The id has a valid format, but there is no user with that `_id`.',
        '`findByIdAndDelete` returns `null`: nothing was deleted.',
        'The controller responds **404 Not Found**.',
        'Unlike the 204, this one does carry a body with the message.',
      ]
    ),
    http: `DELETE /api/users/64f0000000 HTTP/1.1
Host: localhost:3000

HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8

{"message":"Usuario no encontrado"}`,
    codeLang: 'javascript',
    code: t(
      `const user = await User.findByIdAndDelete(req.params.id);

if (!user) {
  // La base devolvió null: no había nada con ese _id
  return res.status(404)
    .json({ message: 'Usuario no encontrado' });
}

// Nota: algunas APIs responden 204 igual, con la idea de que
// "el resultado final es el mismo: ese usuario no existe".`,
      `const user = await User.findByIdAndDelete(req.params.id);

if (!user) {
  // The database returned null: there was nothing with that _id
  return res.status(404)
    .json({ message: 'User not found' });
}

// Note: some APIs respond 204 anyway, with the idea that
// "the end result is the same: that user does not exist".`
    ),
  },
  {
    id: 'variant-400',
    slot: 'variant-b',
    zone: 'extra',
    title: t('Variante: id inválido (400)', 'Variation: invalid id (400)'),
    what: t(
      [
        'La URL lleva un id que no tiene formato de `ObjectId` (por ejemplo `"abc"`).',
        'Si se lo pasás a la base directo, Mongoose tira un `CastError` → 500.',
        'Mejor validarlo antes con `isValidObjectId` y responder **400 Bad Request**.',
        'Así distinguís "está mal escrito" (400) de "no existe" (404).',
      ],
      [
        'The URL carries an id that is not an `ObjectId` format (for example `"abc"`).',
        'If you pass it to the database directly, Mongoose throws a `CastError` → 500.',
        'Better to validate it first with `isValidObjectId` and respond **400 Bad Request**.',
        'That way you tell "badly written" (400) from "does not exist" (404).',
      ]
    ),
    http: `DELETE /api/users/abc HTTP/1.1
Host: localhost:3000

HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8

{"message":"Id inválido"}`,
    codeLang: 'javascript',
    code: t(
      `import mongoose from 'mongoose';

export const remove = async (req, res) => {
  const { id } = req.params;

  // Validar el formato ANTES de ir a la base
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400)
      .json({ message: 'Id inválido' });
  }

  const user = await User.findByIdAndDelete(id);
  if (!user) return res.status(404).json({ message: 'No encontrado' });
  res.status(204).end();
};`,
      `import mongoose from 'mongoose';

export const remove = async (req, res) => {
  const { id } = req.params;

  // Validate the format BEFORE touching the database
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400)
      .json({ message: 'Invalid id' });
  }

  const user = await User.findByIdAndDelete(id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.status(204).end();
};`
    ),
  },
]);
