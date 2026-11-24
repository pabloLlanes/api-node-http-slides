// src/slides/shared.js
//
// Piezas comunes a las 4 presentaciones CRUD.
// - `t(es, en)`: texto bilingüe.
// - `zones`: color y etiqueta de cada zona del recorrido.
// - `SLOT_POS`: ubicación de cada "estación" en el lienzo de impress, por nombre de slot.
//   Así las 4 presentaciones quedan alineadas y la vista general se ve pareja.
// - `zoneLabels`: carteles grandes que se ven al alejar la cámara.

export const t = (es, en) => ({ es, en });

export const zones = {
  client: { color: '#6bb6ff', label: t('CLIENTE · navegador', 'CLIENT · browser') },
  network: { color: '#00d8ff', label: t('RED · HTTP', 'NETWORK · HTTP') },
  server: { color: '#56d364', label: t('SERVIDOR · Node + Express', 'SERVER · Node + Express') },
  data: { color: '#00ff99', label: t('BASE DE DATOS · MongoDB', 'DATABASE · MongoDB') },
  extra: { color: '#d29922', label: t('VARIANTE', 'VARIATION') },
};

// Tamaño de la grilla del lienzo. `pos: [columna, fila]` se multiplica por esto.
export const GRID_X = 1750;
export const GRID_Y = 1300;

// Posición de cada estación según su "slot" (quedó del layout anterior;
// la presentación actual no la usa, pero no molesta).
export const SLOT_POS = {
  intro: [-1.6, 0.5],
  what: [0, 0],
  'client-send': [1, 0],
  request: [3, 0],
  'express-in': [4.3, 0],
  middlewares: [5.3, 0],
  router: [6.3, 0],
  controller: [7.3, 0],
  db: [8.6, 0],
  'db-result': [8.6, 1],
  response: [7.0, 1],
  'response-wire': [4.3, 1],
  'client-use': [1.5, 1],
  'variant-a': [3, 2.3],
  'variant-b': [6, 2.3],
  overview: [3.7, 1.05],
};

// Carteles de zona (grandes, al fondo). impress los saltea al navegar (clase "skip").
export const zoneLabels = [
  { zone: 'client', pos: [1, -0.95], text: t('CLIENTE', 'CLIENT') },
  { zone: 'network', pos: [3.5, -0.95], text: t('RED', 'NETWORK') },
  { zone: 'server', pos: [6.3, -0.95], text: t('SERVIDOR', 'SERVER') },
  { zone: 'data', pos: [8.6, -0.95], text: t('BASE', 'DATABASE') },
  { zone: 'extra', pos: [4.5, 2.75], text: t('VARIANTES', 'VARIATIONS') },
];

// Toma los slides de un método y les asigna la posición según su slot.
export function withPositions(slides) {
  return slides.map((s) => {
    const pos = SLOT_POS[s.slot];
    if (!pos) throw new Error(`Slot sin posición: ${s.slot}`);
    return { ...s, pos };
  });
}
