// questa non fa parte della refactoring,quella l'ho finita mi sa,ora voglko aggiungere delle modalità
// facile,normale,inferno(un altro modo per dire difficile) e infinita
//facile max 5 parole
// normale max 10
// inferno max 20 parole e 5 minuti di tempo massimi
// infinita puoi mettere tutte le parole che vuoi e senza tempo

export const difficolta = {
    facile: {
        paroleMassime : 5,
        probabilitaRara:10, // 1 su 10 rare,cosi è più probabile
        timer: null,
        etichetta: "FACILE"
    },

    normale: {
        paroleMassime: 10,
        probabilitaRara: 20, // 1 su 20,come è sempre stato,per quasto si chiama normale,in nome dell'OG
        timer: null,
        etichetta: "NORMALE"
    },

    inferno: {
        paroleMassime: 20,
        probabilitaRara: 30, //poichè le parole massime da generare,anche le rare devono essere più difficili da trovare,cioè secondo me sono bilanciatee
        timer: 10, // 5 minuti
        etichetta: "INFERNO"
    },

    libera: {
        paroleMassime: 1000, // è ovvio che non sono davvero infinite,però sono tutte le parole che si possono generare,così evito un potenziale stack overflow
        probabilitaRara: 20, //lasciamo normale qua
        timer: null,
        etichetta: "LIBERA"
    }
};