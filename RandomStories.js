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
import { avviaTimerInferno, fermaTimerInferno, scatenaVittoria, getSecondiRimanentiInferno } from "./js/effetti/timerInferno.js";
import { inizializzaTextarea } from "./js/quaderno/gestioneTextarea.js";
import { inizializzaScorciatoie } from "./js/ui/gestioneScorciatoie.js";
import { inizializzaBottoniUI } from "./js/ui/gestioneBottoniUI.js";
import { inizializzaStatisticheLive } from "./js/ui/statisticheLive.js";
import { inizializzaAzioniPartita } from "./js/sessione/gestioneAzioniPartita.js";

let paroleGenerate = [] ;  // Array per memorizzare le parole generate

let parolerareTrovate = JSON.parse(localStorage.getItem("randomStories_rareTrovate") || "[]");
let contatoreRareTotale = parseInt(localStorage.getItem("randomStories_contatoreRare") || "0"); // cosi salva le parole trovate in localStorage,senno poi si perdevano

let numeroParole = 0; // Variabile per tenere traccia del numero di parole generate

let pagine = [{sx: "", dx: ""}] // array delle pagine,inizia con 1 vuot

let paginaCorrente = 0; // indice della pagina che si sta vedendo;
let secondiTimerRipristinati = null;
let timerInfernoRipristinato = false; // questi servono quando riprendo una sessione inferno salvata,così il timer non riparte da capo 
let intervalloAutosave = null; // e per sicurezza,per non creare 300 autosave insieme
let timerLiberaPersonalizzato = null;
// devo modificare un po' di cose nella funzione generaparole
document.body.classList.add('state-generating');

//qua aggiungo una funzione per la validazione della storia
function gestisciValidazioneStoria() {
    return validaStoria(pagine, paginaCorrente, paroleGenerate);
}
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

const btnGeneraParola = document.getElementById("btnGeneraParola");
const btnResetParole = document.getElementById("btnResetParole");
const btnSalva = document.getElementById("btnSalva");
const btNuovaSessione = document.getElementById("btNuovaSessione");

const inputTimerLibera = document.getElementById("inputTimerLibera");

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
    // se c'è gia un autosave attivo,lo fermo prima,così evito di creare più setInterval insiemeù
    if (intervalloAutosave !== null){
        clearInterval(intervalloAutosave);
        intervalloAutosave = null;
    }
    intervalloAutosave = setInterval(function () {
        const difficoltaCorrente = getDifficoltaAttiva();

        // di default non salvo dati timer
        let datiTimerInferno = null;

        // se la modalità ha il timer, salvo anche secondi rimasti e orario reale
        if (difficoltaCorrente.timer) {
            datiTimerInferno = {
                secondiRimanenti: getSecondiRimanentiInferno(),
                salvatoAlle: Date.now()
            };
        }

        salvaSessione(
            pagine,
            paginaCorrente,
            paroleGenerate,
            numeroParole,
            getNomeDifficoltaAttiva(),
            datiTimerInferno
        );
    }, 2000);
}
function ripristinaSessione() {
    const datiSessione = caricaSessione(); // ho cambiato nome poichè ho cambiato la funzione,ora sotto sistemo 
    // stessa cosa di prima,non parte più sola,la chiam osolo quando l'utente clicca "ripderni Sessione"
    if(!datiSessione) return false;//se non c'è nulla salvato esco subito
    // quando riprendo una sessione,rimetto anche la difficolta salvata, altrimenti il giooco può partere con la difficoltà sabgaliata(non sta funzionando il timer
    if(datiSessione.difficolta) {
        setDifficoltaAttiva(datiSessione.difficolta)
    }
    pagine = datiSessione.pagine;
    paroleGenerate = datiSessione.paroleGenerate || [];
    numeroParole = datiSessione.numeroParole || 0;
    paginaCorrente = datiSessione.paginaCorrente || 0;

    secondiTimerRipristinati = null;
    timerInfernoRipristinato = false;

    //se nella sessione salvata c'erano i dati del timer inferno,li recupero
    if (datiSessione.timerInferno) {
        const secondiSalvati = datiSessione.timerInferno.secondiRimanenti;
        const salvatoAlle = datiSessione.timerInferno.salvatoAlle;

        //questpo è un conrollo per verificare che i dati siano numeri veri,non roba rotta
        if (typeof secondiSalvati === "number" && typeof salvatoAlle === "number") {
            const secondiPassati = Math.floor((Date.now() - salvatoAlle) / 1000);

            //voglio essere cattivo,voglio che il timer passi anche se l'utente esce o aggiorna la pagina
            secondiTimerRipristinati = Math.max(0, secondiSalvati - secondiPassati );
            timerInfernoRipristinato = true;

            mostraMessaggioPc("> Pnesavi fosse così semplice ingannare il timer? Ho contato anche il tempo fuori dalla pagina","avviso");
        }
    }


    document.getElementById("storyInputSx").value = pagine[paginaCorrente].sx || "";
    document.getElementById("storyInputDx").value = pagine[paginaCorrente].dx || "";
    document.getElementById("listaParole").innerHTML = paroleGenerate.join(", ");
    document.getElementById("contatoreParole").textContent = "Parole generate: " + numeroParole + "/" + getDifficoltaAttiva().paroleMassime;
    document.getElementById("indicatorePagina").textContent = "pagina " + (paginaCorrente + 1) + " di " + pagine.length;

    gestisciValidazioneStoria();

    MMR("Sessione ripristinata!");
    return true; // così si sa se è andatoc tutto bene
}

inizializzaScorciatoie({
    pagine, getPaginaCorrente : () => paginaCorrente,
    setPaginaCorrente: (nuovaPagina) => {
        paginaCorrente = nuovaPagina;
    },
    cambiaPagina, gestisciValidazioneStoria,
    chiudiIstruzioni, toggleIstruzioni
});
function leggiTimerLibera() {
    //se l'input non esiste non faccio nulla
    // c'èra qualche errore,quindi facciamo una modifica,ora lo cerco solo nel  mome ento esatto in cui si cliccha il tasto libera
    const input = document.getElementById("inputTimerLibera");

    console.log("debug inpuit trovato al click:",input);
    if(!input) {
        console.warn("timer libera NON trovato nel dom,probabilmente l'html non salvato o pagina non ricaricata");
        return null;
    }

    console.log("debug valore input timer libera:",input.value);

    const minuti = Number(input.value);

    if (!minuti || minuti <= 0) {
        console.log("timer libera vuoto/non valido, quindi niente timer");
        return null;
    }

    const minutiLimitati = Math.min(minuti, 60);
    const secondi = minutiLimitati * 60;

    console.log("timer libera scelto:", minutiLimitati, "minuti =", secondi, "secondi");

    return secondi;
}
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

const difficoltaCorrente = getDifficoltaAttiva();
console.log("DEBUG difficoltaCorrente:" , difficoltaCorrente);
console.log("DEBUG timerLiberaPersonalizzato dentro iniziaGioco:", timerLiberaPersonalizzato);

// di base non c'è nessun timer
let secondiTimerTotali = null;

// se la difficoltà ha già un timer suo, tipo Inferno, uso quello
if (difficoltaCorrente.timer) {
    secondiTimerTotali = difficoltaCorrente.timer;
}

// se invece sono in Libera e l'utente ha scritto un timer, uso quello
if (!difficoltaCorrente.timer && timerLiberaPersonalizzato !== null) {
    secondiTimerTotali = timerLiberaPersonalizzato;
}
console.log("DEBUG secodniTimerTotali:", secondiTimerTotali);
// se ho un timer valido, lo avvio
if (secondiTimerTotali !== null) {

    // normalmente parto dal tempo totale
    let secondiDiPartenza = secondiTimerTotali;

    // se sto riprendendo una sessione Inferno, parto dai secondi rimasti veri
    if (timerInfernoRipristinato && secondiTimerRipristinati !== null) {
        secondiDiPartenza = secondiTimerRipristinati;

        // resetto subito, così non influenza le prossime partite
        timerInfernoRipristinato = false;
        secondiTimerRipristinati = null;
    }

    avviaTimerInferno(
        secondiTimerTotali,
        function () {
            document.getElementById("btnSalva").disabled = true;
        },
        function () {

        },
        secondiDiPartenza
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
inizializzaAzioniPartita({
    btnGeneraParola,
    btnResetParole,
    btnSalva,
    btNuovaSessione,
    getPagine: () => pagine,
    getPaginaCorrente: () => paginaCorrente,
    getParoleGenerate: () => paroleGenerate,
    getNumeroParole: () => numeroParole,
    getParoleRareTrovate: () => parolerareTrovate,
    getContatoreRareTotale: () => contatoreRareTotale,

    setNumeroParole: (nuovoNumero) => {
        numeroParole = nuovoNumero;
    },

    setContatoreRareTotale: (nuovoTotale) => {
        contatoreRareTotale = nuovoTotale;
    },

    setPaginaCorrente: (nuovaPagina) => {
        paginaCorrente = nuovaPagina;
    },

    gestisciValidazioneStoria,
    calcolaStatistichePartita,

    generaParola,
    resetParole,
    salvaStoria,
    nuovaSessione,
    mostraMessaggioPc,
    resetStatistiche,
    pulisciMessaggioPC,
    scatenaVittoria,
});
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
    console.log("debug difficolta cliccata: ", nomeDifficolta);
    //salvo la difficolt6a scelta in localStorage,così resta tra le sessione 
    setDifficoltaAttiva(nomeDifficolta)

    const numePulito = String(nomeDifficolta).toLowerCase().trim();

    console.log("debug nome difficolta pulito:", numePulito);
    // se sto scegliendo la modalità libera, leggo il timer scritto dall'utente
    if (nomeDifficolta === "libera") {
        timerLiberaPersonalizzato = leggiTimerLibera();
    } else {
        timerLiberaPersonalizzato = null;
    }
    console.log("debug timerLiberaPersonalizzato:", timerLiberaPersonalizzato);
    //questa è una nuova partita, quindi cancello la sessione vecchia
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
inizializzaStatisticheLive({
    textareaSx,
    textareaDx,
    pagine,
    avviaTimerStats,
    aggiornaStatistiche
});
aggiornaStatistiche(pagine);
inizializzaBottoniUI({
    btnIstruzioni,overlayIstruzioni,btnChiudiIstruzioni,coloreTema,badgeDifficolta,btnGameOverRicomincia,
    btnVittoriaModalita,btnVittoriaRicomincia,overlayVittoria,toggleIstruzioni,
    chiudiIstruzioni,cambiaTema,cambiaModalita,resetTotaleEApriSchermata,resetSessione,iniziaGioco
});