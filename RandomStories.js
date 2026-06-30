import { getDifficoltaAttiva, getNomeDifficoltaAttiva } from "./js/stato/difficoltaAttiva.js";
import { setDifficoltaAttiva } from "./js/stato/difficoltaAttiva.js"
import { inizializzaSchermataDifficolta, mostraSchermataDifficolta, nascondiSchermataDifficolta } from "./js/ui/schermataDifficolta.js";
import { setAppState } from "./js/stato/statoApp.js"; // ho importato pure questo
import { mostraMessaggioPc, pulisciMessaggioPC } from "./js/ui/terminale.js"; // e siamo  a tre,lesgo
import { inizializzaTema, cambiaTema } from "./js/ui/tema.js";
import { chiudiIstruzioni, toggleIstruzioni } from "./js/ui/istruzioni.js";
import { mostraConferma } from "./js/ui/modali.js";
import { MMR } from "./js/ui/messaggi.js";
import { aggiornaStatistiche, avviaTimerStats, resetStatistiche} from "./js/ui/statistiche.js";
import { avviaBootScreen } from "./js/ui/bootScreen.js"
import { salvaSessione, caricaSessione} from "./js/sessione/salvataggio.js";
import { aggiornaContatoreRare } from "./js/parole/contatoreParole.js"
import { nuovaSessione } from "./js/sessione/nuovaSessione.js";
import { salvaStoria } from "./js/storia/salvaStoria.js";
import { cambiaPagina } from "./js/quaderno/cambiaPagina.js";
import { aggiornaIndicatorePagina } from "./js/quaderno/aggiornaIndicatorePagina.js";
import { salvaPaginaCorrente } from "./js/quaderno/salvaPaginaCorrente.js";
import { resetParole } from "./js/parole/resetParole.js";
import { validaStoria } from "./js/storia/validaStoria.js";
import { generaParola } from "./js/parole/generaParola.js";
import { aggiornaBadgeDifficolta } from "./js/ui/badgeDifficolta.js";
import { avviaTimerInferno, fermaTimerInferno, scatenaVittoria } from "./js/effetti/timerInferno.js";
import { inizializzaTextarea } from "./js/quaderno/gestioneTextarea.js";
import { inizializzaScorciatoie } from "./js/ui/gestioneScorciatoie.js";
import { inizializzaBottoniUI } from "./js/ui/gestioneBottoniUI.js";

let paroleGenerate = [] ;  // Array per memorizzare le parole generate

let parolerareTrovate = JSON.parse(localStorage.getItem("randomStories_rareTrovate") || "[]");
let contatoreRareTotale = parseInt(localStorage.getItem("randomStories_contatoreRare") || "0"); // cosi salva le parole trovate in localStorage,senno poi si perdevano

let numeroParole = 0; // Variabile per tenere traccia del numero di parole generate

let pagine = [{sx: "", dx: ""}] // array delle pagine,inizia con 1 vuot

let paginaCorrente = 0; // indice della pagina che si sta vedendo;
// devo modificare un po' di cose nella funzione generaparole
document.body.classList.add('state-generating');

//qua aggiungo una funzione per la validazione della storia
function gestisciValidazioneStoria() {
    return validaStoria(pagine, paginaCorrente, paroleGenerate);
}

// ora faccio in modo che quando clicco sul pulsante genera parole, venga chiamata la funzione GeneraParola
document.getElementById("btnGeneraParola").addEventListener("click", function() {
    setAppState('state-generating');
    gestisciGeneraParola();
});
// ora devo creare un altra funzione wrapper per generaParola(il modulo modifica i numeri che vivono nel main
//quuindi devo riassegnarli con quello che mi restituisce)
function gestisciGeneraParola() {
    const risultato = generaParola(paroleGenerate,numeroParole, parolerareTrovate, contatoreRareTotale,gestisciValidazioneStoria);
    if (risultato) {
        numeroParole = risultato.numeroParole;
        contatoreRareTotale = risultato.contatoreRareTotale;
    }
}
function gestisciResetParole() {
    const risultato = resetParole(paroleGenerate, getDifficoltaAttiva().paroleMassime, gestisciValidazioneStoria);

    if (risultato) {
        numeroParole = risultato.numeroParole;
    }
}

document.getElementById("btnResetParole").addEventListener("click",function() {
    setAppState('state-generating');
    gestisciResetParole();
})

document.getElementById("btnSalva").addEventListener("click", function() {
    // calcolo le stats prima del salvataggio,perchè dopo il reset si perdono
    const stats = calcolaStatistichePartita();

    //ora controllo che òa storia sià valida
    const eraValida= gestisciValidazioneStoria();

    //salvo la storia
    salvaStoria(pagine, paginaCorrente, gestisciValidazioneStoria, mostraMessaggioPc);

    // se siamo in modalità inferno e la storia e valida facciamo partire la vittoria
    //NOTA BENE, ora alle 23: 50 sto pensando che dopo potrei aggiungere la vittorio di defauklt in ogni modalità,solo che al posto di vittoria magari la chiamo "storia completate"
    //e metto le stesse statistiche di questo,tranne il tempo rimanente
    const difficoltaCorrente = getDifficoltaAttiva();
    if (difficoltaCorrente.timer && eraValida) {
        console.log("scateno vittoria!");
        scatenaVittoria(stats)
    } else {
        console.log("NON scateno vittoria. timer:",difficoltaCorrente.timer, "eraValida:",eraValida);
    }
});
// le due textarea le metto in 2 variabili perchè è più comodo 
const textareaSx = document.getElementById("storyInputSx");
const textareaDx = document.getElementById('storyInputDx');

const indicatorePagina = document.getElementById("indicatorePagina");

const btnIstruzioni = document.getElementById("btnIstruzioni");
const overlayIstruzioni = document.getElementById("overlayIstruzioni");
const btnChiudiIstruzioni = document.getElementById("btnChiudiIstruzioni");
const coloreTema = document.getElementById("coloreTema");
const badgeDifficolta = document.getElementById("badgeDifficolta");
const btnGameOverRicomincia = document.getElementById("btnGameOverRicomincia");
const btnVittoriaModalita = document.getElementById("btnVittoriaModalita");
const btnVittoriaRicomincia = document.getElementById("btnVittoriaRicomincia");
const overlayVittoria = document.getElementById("overlayVittoria");

inizializzaTextarea({
    textareaSx,
    textareaDx,pagine,
    indicatorePagina,
    getPaginaCorrente : () => paginaCorrente,
    setPaginaCorrente: (nuovaPagina) => { // questa è un arrow function,più pulito
        paginaCorrente = nuovaPagina;
    },

    salvaPaginaCorrente,
    aggiornaIndicatorePagina,
    gestisciValidazioneStoria
});
// funzione di reset che non apre la schermata di difficolta,per quando si clicca il bottone ricomincia inferno
function resetSessione() {
    fermaTimerInferno();

    paroleGenerate = [];
    numeroParole = 0;
    pagine = [{ sx: "", dx: ""}];
    paginaCorrente = 0;

    document.getElementById("storyInputSx").value = "";
    document.getElementById("storyInputDx").value = "";
    document.getElementById("listaParole").innerHTML = "";
    document.getElementById("indicatorePagina").textContent = "Pagina 1";

    localStorage.removeItem("randomStories_sessione");
}
gestisciValidazioneStoria();

document.getElementById("btnSalva").disabled = true; // disabilità il pulsante per salvare la storia finchè non viene genrata una nuova storia valida
inizializzaTema();
//il mio amico Costino mi ha detto di fare in modo che se esco per sbaglio dal sito mentre scrivo la stolria non perdo tutto ciò che avevo scritto,so let's do it!
//PS(IMPORTANTE): mi ha detto pure di spostare il la scritta centrale dei comandi e metterla di lato che compare se vieddddddddddddddddcswcscscscxssccsscsc
//l'autosave non parte più da solo come prima,lo faccio partire solo quando l'utenete ha scelto cosa fare nella schemrtaa difficolya
//altrimenti potrebbe sovraschivere la funzione vecchia con dati vuori :(

function avviaAutoSalvataggio() {
    setInterval(function() {
        salvaSessione(pagine, paginaCorrente, paroleGenerate, numeroParole, getNomeDifficoltaAttiva());
    }, 2000);
}
function ripristinaSessione() {
    const datiSessione = caricaSessione(); // ho cambiato nome poichè ho cambiato la funzione,ora sotto sistemo 
    // stessa cosa di prima,non parte più sola,la chiam osolo quando l'utente clicca "ripderni Sessione"
    if(!datiSessione) return false;//se non c'è nulla salvato esco subito
    pagine = datiSessione.pagine;
    paroleGenerate = datiSessione.paroleGenerate || [];
    numeroParole = datiSessione.numeroParole || 0;
    paginaCorrente = datiSessione.paginaCorrente || 0;

    document.getElementById("storyInputSx").value = pagine[paginaCorrente].sx || "";
    document.getElementById("storyInputDx").value = pagine[paginaCorrente].dx || "";
    document.getElementById("listaParole").innerHTML = paroleGenerate.join(", ");
    document.getElementById("contatoreParole").textContent = "Parole generate: " + numeroParole + "/" + getDifficoltaAttiva().paroleMassime;
    document.getElementById("indicatorePagina").textContent = "pagina " + (paginaCorrente + 1) + " di " + pagine.length;

    gestisciValidazioneStoria();

    MMR("Sessione ripristinata!");
    return true; // così si sa se è andatoc tutto bene
}
// dopo la refactoring document....quell'evento non funzionava piu,perche rendeva parole,pagine tutti indefiniti,quidni devo creare una funzione wrapper
async function GestisciNuovaSessione() {
    const risultato = await nuovaSessione(paroleGenerate,numeroParole,pagine,paginaCorrente,getDifficoltaAttiva().paroleMassime,resetStatistiche,pulisciMessaggioPC);
    if (risultato) {
        numeroParole = risultato.numeroParole;
        paginaCorrente = risultato.paginaCorrente;
    }
}

inizializzaScorciatoie({
    pagine, getPaginaCorrente : () => paginaCorrente,
    setPaginaCorrente: (nuovaPagina) => {
        paginaCorrente = nuovaPagina;
    },
    cambiaPagina, gestisciValidazioneStoria,
    chiudiIstruzioni, toggleIstruzioni
});

document.getElementById("btNuovaSessione").addEventListener("click",GestisciNuovaSessione);
aggiornaContatoreRare(contatoreRareTotale);
// questa funzionje viene chiamata dopo che l'utente ha scelto cosa fare nella schermata difficolta
// si occupa di accendere autosave,aggiornare il contatore e nascondere la schermata
function iniziaGioco() {
    //nascondo la schermata difficolta
    nascondiSchermataDifficolta();

    //aggiorno il contatore parole con il limite della difficolta appena scelto+
    document.getElementById("contatoreParole").textContent = "Parole generate: " + numeroParole + "/" + getDifficoltaAttiva().paroleMassime;
    // aggiorno il badge con la modalità attuale
    aggiornaBadgeDifficolta();
    // accendo l'autosave ,e poi da qua in poi salva ogni 2 secondi
    avviaAutoSalvataggio();

    // ora,se la modalità è inferno,parte il timer con i secondi della config
    //altrimenti verifico che il timer sia spento
    const difficoltaCorrente = getDifficoltaAttiva();
    if(difficoltaCorrente.timer) {
        avviaTimerInferno(difficoltaCorrente.timer, function() {
            //blocchiamo la possibbilità di salvare la storia
            document.getElementById("btnSalva").disabled = true;
        },
        function () {
            
        }
    );
    } else {
        fermaTimerInferno();
    }
}

// helper che calcola le statistiche della partita corrente
function calcolaStatistichePartita() {
    // unisco tutto il testo di tutte le pagine
    let testoTotale = "";
    pagine.forEach(function (pagina) {
        testoTotale += (pagina.sx || "") + " " + (pagina.dx || " ")+ " "
    });

    //  conto le parole (split su spazi., filtro le stringhe vuote)
    const paroleUsate = testoTotale.split(/\s+/).filter(p => p.length > 0).length;

    //conto le parole rare trovate in questa sessione,non in totale
    let rareTrovate = 0;
    paroleGenerate.forEach(function (parola) {
        if (parolerareTrovate.includes(parola)) {
            rareTrovate++;
        }
    });
    
    return {
        paroleUsate: paroleUsate,
        rareTrovate: rareTrovate,
        caratteri: testoTotale.length
    };
}
//ora il badge serve per quando l'utente vuole cambiare modalità
//come su nuova sessione deve mostrare una conferma,senno è troppo facile sbagliare
async function cambiaModalita() {
    const conferma = await mostraConferma("Cambiare modalità?", "le parole generate e la storia che stai scrivendo andranno perdute. Sei sicuro?");
    // se l'utente annulla,esco 
    if(!conferma) return;
    resetSessione();
    mostraSchermataDifficolta(false);
}
//questa è una versione forzata di cambia modalità,perchè mentre la chiede conferma
// se finisce il tempo hai gia perso,quindi non ti serve la possibilità di scegliere,quindi mi serve  un altra funzione
function resetTotaleEApriSchermata() {
    resetSessione();
    mostraSchermataDifficolta(false);
}
//ora serve una chiamata per quando l'utente clicca su una difficolta
function onSelezionaDifficolta(nomeDifficolta) {

    //salvo la difficolt6a scelta in localStorage,così resta tra le sessione 
    setDifficoltaAttiva(nomeDifficolta)
    //questa è una scelta " nuova partita", quindi cancello la sessione vecchia(se rimaneva,al prossimo refresh riprendi motrerebbe ancora la modalità sbaglia6a
    localStorage.removeItem("randomStories_sessione");

    iniziaGioco();
}
//chiamta per quando l'utente clicca su riprendi sessione
function onRiprendiSessione() {
    // ripristino i dati salvati nelle variabili e nel DOM
    ripristinaSessione();
    iniziaGioco();
}

//ora quando il boot screen finisce,parte la schermata difficoltà 
avviaBootScreen(function() {
    //prima controllo se c'è una sessione salvata da prima
    const sessioneSalvata = caricaSessione();

    //inizializzo la schermata (cioè riempio i bottoni e attaco i click)
    inizializzaSchermataDifficolta(onSelezionaDifficolta, onRiprendiSessione);
    // mostro la schermata,passandoglu info sulla sessione (se esuiste)
    if(sessioneSalvata) {
        mostraSchermataDifficolta(true,sessioneSalvata.difficolta || "normale");
    } else {
        mostraSchermataDifficolta(false);
    }
});


textareaSx.addEventListener("input", function() {
    avviaTimerStats(pagine);
    aggiornaStatistiche(pagine);
});

textareaDx.addEventListener("input", function() {
    avviaTimerStats(pagine);
    aggiornaStatistiche(pagine);
});

aggiornaStatistiche(pagine);
inizializzaBottoniUI({
    btnIstruzioni,overlayIstruzioni,btnChiudiIstruzioni,coloreTema,badgeDifficolta,btnGameOverRicomincia,
    btnVittoriaModalita,btnVittoriaRicomincia,overlayVittoria,toggleIstruzioni,
    chiudiIstruzioni,cambiaTema,cambiaModalita,resetTotaleEApriSchermata,resetSessione,iniziaGioco
});