// src/slides/index.js — junta las 4 presentaciones CRUD
import * as create from './createSlides';
import * as read from './readSlides';
import * as update from './updateSlides';
import * as del from './deleteSlides';
import { t } from './shared';

export { zones, zoneLabels, GRID_X, GRID_Y, SLOT_POS } from './shared';

// Portada común a cualquier presentación (el título sale del método elegido)
export const introCommon = {
  kicker: 'HTTP · Node.js · Express · MongoDB',
  keys: t('Avanzá con → o la barra espaciadora. Volvé con ←.', 'Move forward with → or the space bar. Go back with ←.'),
  zoneOrder: ['client', 'network', 'server', 'data'],
};

// Cada deck: meta (para el menú y la portada), slides, outro.
export const decks = {
  create: { meta: create.meta, slides: create.slides, outro: create.outro },
  read: { meta: read.meta, slides: read.slides, outro: read.outro },
  update: { meta: update.meta, slides: update.slides, outro: update.outro },
  delete: { meta: del.meta, slides: del.slides, outro: del.outro },
};

// Orden en que aparecen en el menú
export const deckOrder = ['create', 'read', 'update', 'delete'];
