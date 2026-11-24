import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import http from 'react-syntax-highlighter/dist/esm/languages/prism/http';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { zones, introCommon } from '../../slides';
import styles from './Presentation.module.css';

SyntaxHighlighter.registerLanguage('javascript', jsx);
SyntaxHighlighter.registerLanguage('http', http);
SyntaxHighlighter.registerLanguage('bash', bash);

const TEXT = {
    es: {
        back: '← Menú',
        toggle: 'EN',
        toggleTitle: 'Switch to English',
        what: 'Qué pasa',
        http: 'Protocolo HTTP',
        code: 'Código',
        prev: '← Anterior',
        next: 'Siguiente →',
        overview: 'Ver todo',
        start: 'Empezar',
        close: 'Cerrar',
        steps: 'Pasos',
    },
    en: {
        back: '← Menu',
        toggle: 'ES',
        toggleTitle: 'Cambiar a español',
        what: 'What happens',
        http: 'HTTP protocol',
        code: 'Code',
        prev: '← Previous',
        next: 'Next →',
        overview: 'Overview',
        start: 'Start',
        close: 'Close',
        steps: 'Steps',
    },
};

const localize = (value, language) => (typeof value === 'string' ? value : value[language]);

const CODE_LINE_HEIGHT = 1.3;
const CHAR_EM = 0.6; // ancho de un carácter en Roboto Mono (fracción del font)

// Saca los renglones en blanco: el código queda denso, nada de "todo separado".
const compactCode = (code) => code.trim().replace(/\n[ \t]*(?=\n)/g, '');

// Tamaño del código EN PÍXELES REALES (no se escala con nada): crece hasta que la
// línea más larga llena el ancho del panel, o hasta que las líneas llenan el alto.
// `w` y `h` son el tamaño real del panel de código, medido en el navegador.
function codeFontSize(code, w, h) {
    const lines = compactCode(code).split('\n');
    const maxLen = Math.max(1, ...lines.map((line) => line.length));
    const pad = 44;
    const byWidth = (w - pad) / (CHAR_EM * maxLen);
    const byHeight = (h - 36) / (lines.length * CODE_LINE_HEIGHT);
    return Math.round(Math.min(46, Math.max(15, Math.min(byWidth, byHeight))));
}

const httpStyle = {
    margin: 0,
    padding: '10px 14px',
    borderRadius: '6px',
    fontSize: 'clamp(11px, 1.05vw, 17px)',
    lineHeight: 1.4,
    background: '#0b0f14',
    height: '100%',
    overflow: 'auto',
    boxSizing: 'border-box',
};

// Formato mínimo en los textos: `código`, **negrita** y *cursiva*
function Inline({ text }) {
    return text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
        if (part.startsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
        if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith('*') && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
        return part;
    });
}

// Portada del método
function IntroSlide({ meta, language }) {
    return (
        <div className={`${styles.slide} ${styles.introSlide}`} style={{ '--zone': meta.accent }}>
            <span className={styles.kicker}>{introCommon.kicker}</span>
            <h1>
                {meta.method} · {meta.label[language]}
            </h1>
            <p className={styles.introText}>{meta.summary[language]}</p>
            <code className={styles.introExample}>{meta.example}</code>
            <ol className={styles.introZones}>
                {introCommon.zoneOrder.map((z) => (
                    <li key={z} style={{ '--zone': zones[z].color }}>
                        {zones[z].label[language]}
                    </li>
                ))}
            </ol>
            <p className={styles.keys}>{introCommon.keys[language]}</p>
        </div>
    );
}

// Un paso: header + franja (qué pasa | HTTP) + código grande (a todo el ancho)
function ContentSlide({ slide, meta, language }) {
    const t = TEXT[language];
    const zone = zones[slide.zone];
    const codeRef = useRef(null);
    const [box, setBox] = useState({ w: 1200, h: 520 });
    const code = compactCode(localize(slide.code, language));

    // Mide el panel de código real y recalcula al cambiar de tamaño de ventana
    useLayoutEffect(() => {
        const el = codeRef.current;
        if (!el) return undefined;
        const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const fontSize = codeFontSize(localize(slide.code, language), box.w, box.h);

    return (
        <div className={styles.slide} style={{ '--zone': zone.color }}>
            <header className={styles.slideHeader}>
                <span className={styles.zoneTag}>{zone.label[language]}</span>
                <h2>{slide.title[language]}</h2>
                <span className={styles.methodTag}>{meta.method}</span>
            </header>

            {/* Franja compacta arriba: qué pasa + protocolo HTTP */}
            <div className={styles.topStrip}>
                <section className={styles.whatBox}>
                    <h3>{t.what}</h3>
                    <ul>
                        {slide.what[language].map((item, i) => (
                            <li key={i}>
                                <Inline text={item} />
                            </li>
                        ))}
                    </ul>
                </section>
                <section className={styles.httpBox}>
                    <h3>{t.http}</h3>
                    <SyntaxHighlighter language="http" style={vscDarkPlus} customStyle={httpStyle} wrapLongLines>
                        {localize(slide.http, language)}
                    </SyntaxHighlighter>
                </section>
            </div>

            {/* El código, a todo el ancho y al tamaño real más grande posible */}
            <section className={styles.codeBox}>
                <h3>{t.code}</h3>
                <div className={styles.codeArea} ref={codeRef}>
                    <SyntaxHighlighter
                        language={slide.codeLang}
                        style={vscDarkPlus}
                        customStyle={{
                            margin: 0,
                            padding: '16px 22px',
                            borderRadius: '8px',
                            fontSize: `${fontSize}px`,
                            lineHeight: CODE_LINE_HEIGHT,
                            background: '#0b0f14',
                            minHeight: '100%',
                            boxSizing: 'border-box',
                        }}
                        wrapLongLines
                    >
                        {code}
                    </SyntaxHighlighter>
                </div>
            </section>
        </div>
    );
}

// "Ver todo": grilla de todos los pasos, clickeable
function Overview({ deck, language, onPick, onClose }) {
    const t = TEXT[language];
    const { meta, slides, outro } = deck;
    return (
        <div className={styles.overview}>
            <header className={styles.overviewHead}>
                <div>
                    <h2>{outro.title[language]}</h2>
                    <p>{outro.text[language]}</p>
                </div>
                <button className={styles.ghostBtn} onClick={onClose}>
                    {t.close} ✕
                </button>
            </header>
            <div className={styles.overviewGrid}>
                <button className={styles.ovCard} style={{ '--zone': meta.accent }} onClick={() => onPick(0)}>
                    <span className={styles.ovNum}>0</span>
                    <strong>
                        {meta.method} · {meta.label[language]}
                    </strong>
                </button>
                {slides.map((s, i) => (
                    <button
                        key={s.id}
                        className={styles.ovCard}
                        style={{ '--zone': zones[s.zone].color }}
                        onClick={() => onPick(i + 1)}
                    >
                        <span className={styles.ovNum}>{i + 1}</span>
                        <strong>{s.title[language]}</strong>
                        <span className={styles.ovZone}>{zones[s.zone].label[language]}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

function Presentation({ deck, onGoBack, language, toggleLanguage }) {
    const t = TEXT[language];
    const { meta, slides } = deck;
    const total = slides.length + 1; // intro + pasos
    const [step, setStep] = useState(0); // 0 = intro, 1..N = pasos
    const [overview, setOverview] = useState(false);

    const go = useCallback((n) => setStep(Math.min(Math.max(n, 0), total - 1)), [total]);

    // Teclado: flechas / barra para navegar, Esc para "ver todo"
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
                e.preventDefault();
                if (overview) setOverview(false);
                else go(step + 1);
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                e.preventDefault();
                if (!overview) go(step - 1);
            } else if (e.key === 'Escape') {
                setOverview((v) => !v);
            } else if (e.key === 'Home') {
                go(0);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [step, overview, go]);

    const progress = (step / (total - 1)) * 100;
    const caption =
        step === 0 ? `${meta.method} · ${meta.label[language]}` : (slides[step - 1]?.title[language] ?? '');

    return (
        <div className={styles.page} style={{ '--accent': meta.accent }}>
            <button className={styles.backButton} onClick={onGoBack}>
                {t.back}
            </button>
            <button className={styles.toggleButton} onClick={toggleLanguage} title={t.toggleTitle}>
                {t.toggle}
            </button>

            <div className={styles.viewport}>
                {overview ? (
                    <Overview
                        deck={deck}
                        language={language}
                        onPick={(n) => {
                            setStep(n);
                            setOverview(false);
                        }}
                        onClose={() => setOverview(false)}
                    />
                ) : (
                    // key: reinicia la animación de entrada al cambiar de paso o idioma
                    <div key={`${step}-${language}`} className={styles.fade}>
                        {step === 0 ? (
                            <IntroSlide meta={meta} language={language} />
                        ) : (
                            <ContentSlide slide={slides[step - 1]} meta={meta} language={language} />
                        )}
                    </div>
                )}
            </div>

            <nav className={styles.navBar}>
                <div className={styles.progress}>
                    <div style={{ width: `${progress}%` }} />
                </div>
                <div className={styles.navInner}>
                    <button onClick={() => go(step - 1)} disabled={overview || step === 0}>
                        {t.prev}
                    </button>
                    <div className={styles.caption}>
                        <span className={styles.counter}>
                            {step + 1} / {total}
                        </span>
                        <span className={styles.captionText}>{caption}</span>
                    </div>
                    <button className={styles.overviewButton} onClick={() => setOverview((v) => !v)}>
                        {t.overview}
                    </button>
                    <button
                        className={styles.nextButton}
                        onClick={() => {
                            if (overview) setOverview(false);
                            else go(step + 1);
                        }}
                        disabled={!overview && step === total - 1}
                    >
                        {step === 0 ? t.start + ' →' : t.next}
                    </button>
                </div>
            </nav>
        </div>
    );
}

export default Presentation;
