// questo modulo serve a gestire il badge in alto che mostra la difficolra a corrente e si aggiorna ad ogni cambio di difficolta,in futuro devo renderlo un cliccabbile per poter cambiare modalita anchè senza dover aggiornare la pagina
import { getDifficoltaAttiva } from "../stato/difficoltaAttiva.js";

export function aggiornaBadgeDifficolta() {
    const badge = document.getElementById("badgeDifficolta");

    //leggo l'ggetto della difficolta attuale e prendo l'etichetta
    const difficolta = getDifficoltaAttiva();
    badge.textContent = `Modalità: ${difficolta.etichetta}`;
}