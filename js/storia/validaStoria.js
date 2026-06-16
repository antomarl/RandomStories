// questo modulo controlla se la storia srcitta contiene tutte le parole generate.se è valida da true,senno false

import { contieneParola } from "../parole/contieneParola.js";

export function validaStoria(pagine, paginaCorrente, paroleGenerate) {
    //prendo le due textarea sx e dx
    const inputSx = document.getElementById("storyInputSx");
    const inputDx = document.getElementById("storyInputDx");

    const messaggioErrore = document.getElementById("messaggioErrore");
    const btnSalva = document.getElementById("btnSalva");

    //salvo quello che c'è scritto nella textarea ndentro la pagina corrente,cosi non perdo niente quando cambio pagina o valido
    if (inputSx && inputDx && pagine[paginaCorrente]) {
        pagine[paginaCorrente].sx = inputSx.value;
        pagine[paginaCorrente].dx = inputDx.value;
    }

    //costruisco la storia completa usando tutte le pagine ed ogni foglio
    let storia = "";
    for (const pagina of pagine) {
        storia += pagina.sx + " " + pagina.dx + " ";
    }

    //metto tutto il testo in minuscolo così il confronto non è case sensitive
    storia = storia.toLowerCase();

    //puliosco il messaggio precedente e rimetto il colore rosso di default
    messaggioErrore.innerHTML = "";
    messaggioErrore.style.color = "red";

    //ora consideriamo tutti i casi
    // il primo è se nessuna parola è stata generata,allora non ha senso validare

    if (paroleGenerate.length === 0 ) {
        messaggioErrore.innerHTML = "Devi generare almeno una parola prima di validare la tua storia!";
        btnSalva.disabled = true;
        return false;
    }
    //cerco ora quali parole mancano nella storia
    const mancanti = [];

    for (const parola of paroleGenerate) {
        // uso contienePArola che gestisce anche gli accenti e gli unicode
        if (!contieneParola(storia, parola)) {
            mancanti.push(parola);
        }
    }

    // ora se ci sono parole mancanti la storia non può essere validata
    if (mancanti.length > 0) {
        messaggioErrore.innerHTML = "mancano: <br>" + mancanti.join(", ");
        btnSalva.disabled = true;
        return false;   
    }

    //l'ultimo caso e se tutte le parole sono presenti nella storia,allora la storia è valida e posso salvarla
    messaggioErrore.innerHTML = "la tua storia è valida, ora puoi salvarla cliccando su 'Salva Storia',oppure generare una nuova storia completamente da zero!";
    messaggioErrore.style.color = "green";
    btnSalva.disabled = false;
    return true;
}

