import React from 'react';
import { decks, deckOrder } from '../../slides';
import styles from './Menu.module.css';

const TEXT = {
    es: {
        title: 'Presentaciones CRUD',
        subtitle: 'Cada método HTTP, paso a paso: el detalle de cada momento, el protocolo HTTP y el código. Hechas con impress.js.',
        toggle: 'EN',
        toggleTitle: 'Switch to English',
        steps: (n) => `${n} pasos`,
        footer: 'Elegí un método para ver su recorrido completo, de React a MongoDB y de vuelta.',
    },
    en: {
        title: 'CRUD presentations',
        subtitle: 'Each HTTP method, step by step: the detail of each moment, the HTTP protocol and the code. Built with impress.js.',
        toggle: 'ES',
        toggleTitle: 'Cambiar a español',
        steps: (n) => `${n} steps`,
        footer: 'Pick a method to see its full route, from React to MongoDB and back.',
    },
};

function Menu({ onSelect, language, toggleLanguage }) {
    const t = TEXT[language];

    return (
        <div className={styles.menu}>
            <button className={styles.toggle} onClick={toggleLanguage} title={t.toggleTitle}>
                {t.toggle}
            </button>

            <h1 className={styles.title}>{t.title}</h1>
            <p className={styles.subtitle}>{t.subtitle}</p>

            <div className={styles.grid}>
                {deckOrder.map((id) => {
                    const { meta, slides } = decks[id];
                    return (
                        <button
                            key={id}
                            className={styles.card}
                            style={{ '--accent': meta.accent }}
                            onClick={() => onSelect(id)}
                        >
                            <span className={styles.method}>{meta.method}</span>
                            <span className={styles.label}>{meta.label[language]}</span>
                            <span className={styles.sub}>{meta.sub[language]}</span>
                            <code className={styles.example}>{meta.example}</code>
                            <span className={styles.steps}>{t.steps(slides.length)}</span>
                        </button>
                    );
                })}
            </div>

            <p className={styles.footer}>{t.footer}</p>
        </div>
    );
}

export default Menu;
