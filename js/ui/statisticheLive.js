// questo modulo aggiorna le statistiche mentre l'utente scrive nel quaderno
export function inizializzaStatisticheLive(config) {
    //dal config prendo la textarea,le pagine e le funzioni delle statistiche
    const {
        textareaSx,
        textareaDx,
        getPagine,
        getPaginaCorrente,
        avviaTimerStats,
        aggiornaStatistiche
    } = config;

    function aggiornaLive() {
        const pagine = getPagine();
        const paginaCorrente = getPaginaCorrente();

        // ora salvo quello che l'utente sta scrivendo nella pagina corrente
        if (pagine[paginaCorrente]) {
            pagine[paginaCorrente].sx = textareaSx.value;
            pagine[paginaCorrente].dx = textareaDx.value;
        }

        avviaTimerStats(pagine);
        aggiornaStatistiche(pagine);
    }

    textareaSx.addEventListener("input", aggiornaLive);
    textareaDx.addEventListener("input", aggiornaLive);

    aggiornaLive();
}