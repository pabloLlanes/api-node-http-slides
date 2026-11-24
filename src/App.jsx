import React, { useState } from 'react';
import Menu from './components/Menu/Menu';
import Presentation from './components/Presentation/Presentation';
import { decks } from './slides';

function App() {
    const [deckId, setDeckId] = useState(null); // null = menú
    const [language, setLanguage] = useState('es');

    const toggleLanguage = () => setLanguage((prev) => (prev === 'es' ? 'en' : 'es'));

    if (!deckId) {
        return <Menu onSelect={setDeckId} language={language} toggleLanguage={toggleLanguage} />;
    }

    return (
        <Presentation
            // key: al cambiar de método, se reinicia impress limpio
            key={deckId}
            deck={decks[deckId]}
            onGoBack={() => setDeckId(null)}
            language={language}
            toggleLanguage={toggleLanguage}
        />
    );
}

export default App;
