// qua vanno tutte le statistiche del quadreno, ovvero parole scritte;
// caratteri
// tempo trascoro a scrivewre
//pagine usate
// parole per minuto

let tempoInizio = null;
let timerStats = null;

function calcolaStatistiche(pagine) {
    // se per errore non arrivano pagine valide,
    // creo almeno una pagina vuota così non esplode tutto
    if (!Array.isArray(pagine) || pagine.length === 0) {
        pagine = [{ sx: "", dx: "" }];
    }
    
    let testoCompleto = ""; // unisco il testo di entrambe le peganie in una stringa unica
    for(let p of pagine) {
        testoCompleto += (p.sx || "") + "" + (p.dx || "") + " ";
    }

    testoCompleto = testoCompleto.trim();
    const caratteri = testoCompleto.length;

    const parole = testoCompleto.length >  0 ? testoCompleto.split(/\s+/).filter(function(p) { return p.length > 0; }).length : 0 ; // conta le parole splittandole per spazi e contando le stringhe vuote

    const numeroPagine = pagine.length; // numero di pagine usate

    let secondiTotali = 0; //calcola il tempo trascoro mentre si scrive
    if ( tempoInizio !== null) {
        secondiTotali = Math.floor((Date.now() - tempoInizio) / 1000 )
    }

    let ppm = 0;
    if (secondiTotali > 0) {
        ppm = Math.round(parole / (secondiTotali / 60));
    }

    const minuti = Math.floor(secondiTotali / 60);
    const secondi = secondiTotali % 60;
    const tempoFormattato = String(minuti).padStart(2, "0" ) + ":" + String(secondi).padStart(2, "0");

    return { parole, caratteri, tempoFormattato, numeroPagine, ppm };

}

//quasta funzione serve ad aggiornare visivamente i numeri mostrati dall'interfaccia

export function aggiornaStatistiche(pagine) {
    const stats = calcolaStatistiche(pagine);

    document.getElementById("statsParole").textContent = stats.parole;
    document.getElementById("statsCaratteri").textContent = stats.caratteri;
    document.getElementById("statsTempo").textContent = stats.tempoFormattato;
    document.getElementById("statsPagine").textContent = stats.numeroPagine;
    document.getElementById("statsPpm").textContent = stats.ppm;
}

//questa funzione serve ad avviare il timer delle statistiche

export function avviaTimerStats(pagine) {
    if (timerStats !== null) {
        return;
    }

    if (tempoInizio === null) {
        tempoInizio = Date.now();
    }

    timerStats = setInterval(function() {
        aggiornaStatistiche(pagine);
    }, 1000);
}

//questa per resettare tutte le statistiche(che sia per reset o per nuovaSessione)

export function resetStatistiche(pagine = [{ sx: "", dx: "" }]) {
    if (timerStats !== null) {
        clearInterval(timerStats);
        timerStats = null;
    }

    tempoInizio = null;

    aggiornaStatistiche(pagine);
}

