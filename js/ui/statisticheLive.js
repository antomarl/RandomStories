// questo modulo aggiorna le statistiche mentre l'utente scrive nel quaderno
export function inizializzaStatisticheLive(config) {
    //dal config prendo la textarea,le pagine e le funzioni delle statistiche
    const {
        textareaSx,
        textareaDx,
        pagine,
        avviaTimerStats,
        aggiornaStatistiche
    } = config;

    //quando scivo nella pagina sinistra,aggiorno il timer e le statistiche
    textareaDx.addEventListener("input", function () {
        avviaTimerStats(pagine);
        aggiornaStatistiche(pagine);
    });

    //same a destra
    textareaDx.addEventListener("input", function () {
        avviaTimerStats(pagine);
        aggiornaStatistiche(pagine);
    });

    //aggiorno subito le statisctiche all'avvio,così non ne rimangono vecchuie o vuote
    aggiornaStatistiche(pagine);
}