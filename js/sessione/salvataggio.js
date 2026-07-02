// questo modulo serve per il salvataggiop dei libro,cioè che quando esco o agggiorno la pagina rimane il testo che ho scrittop
//mettero la funzione SalvaSessione e caricaSessione()

import { difficolta } from "../config/difficolta.js";

export function salvaSessione(pagine,paginaCorrente,paroleGenerate,numeroParole,nomeDifficolta, datiTimerInferno = null)   {
    if(pagine[paginaCorrente]) {
        pagine[paginaCorrente].sx = document.getElementById("storyInputSx").value;
        pagine[paginaCorrente].dx = document.getElementById("storyInputDx").value;
     }

    const datiSessione = {
        pagine: pagine,
        paroleGenerate: paroleGenerate,
        numeroParole: numeroParole,
        paginaCorrente: paginaCorrente,
        difficolta: nomeDifficolta, // così sappiamo che modalita si stava giocando
        timestamp: Date.now() ,
        timerInferno : datiTimerInferno
    };
    localStorage.setItem("randomStories_sessione", JSON.stringify(datiSessione));
}

// CaricaSessione , rispetto all'originale,voglio renderla anche un po' più pulita,dove deve leggere,valutare e restistuire il contenuto
// voglio che recuperi solo dati e che non tocchi più il DOM

export function caricaSessione() {
    const salvataggio = localStorage.getItem("randomStories_sessione");

    if (!salvataggio) {
        return false;
    }

    try {

        const dati = JSON.parse(salvataggio);
        if(!dati.pagine || !Array.isArray(dati.pagine)) {
            return false;
        }

        return dati;
    } 
    
    catch (errore) {
        console.warn("errore durante il ripristino della sessione");

        return false;
    }

}