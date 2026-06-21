import { getDifficoltaAttiva, getNomeDifficoltaAttiva } from "./js/stato/difficoltaAttiva.js";
import { setDifficoltaAttiva } from "./js/stato/difficoltaAttiva.js"
import { inizializzaSchermataDifficolta, mostraSchermataDifficolta, nascondiSchermataDifficolta } from "./js/ui/schermataDifficolta.js";
import { setAppState } from "./js/stato/statoApp.js"; // ho importato pure questo
import { typeWriter, mostraMessaggioPc, pulisciMessaggioPC } from "./js/ui/terminale.js"; // e siamo  a tre,lesgo
import { inizializzaTema, cambiaTema } from "./js/ui/tema.js";
import { apriIstruzioni, chiudiIstruzioni, toggleIstruzioni } from "./js/ui/istruzioni.js";
import { mostraConferma } from "./js/ui/modali.js";
import { generaParticelle } from "./js/effetti/particelle.js";
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
import { mostraParole } from "./js/parole/mostraParole.js";
import { resetParole } from "./js/parole/resetParole.js";
import { validaStoria } from "./js/storia/validaStoria.js";
import { generaParola } from "./js/parole/generaParola.js";
import { aggiornaBadgeDifficolta } from "./js/ui/badgeDifficolta.js";
console.log("difficolta caricata: ", getDifficoltaAttiva());
// ho creato delle parole speciali e voglio metterle rare;

let paroleGenerate = [] ;  // Array per memorizzare le parole generate

let parolerareTrovate = JSON.parse(localStorage.getItem("randomStories_rareTrovate") || "[]");
let contatoreRareTotale = parseInt(localStorage.getItem("randomStories_contatoreRare") || "0"); // cosi salva le parole trovate in localStorage,senno poi si perdevano

// non serve più messa qua, rip

let numeroParole = 0; // Variabile per tenere traccia del numero di parole generate

// neanche questa

let pagine = [{sx: "", dx: ""}] // array delle pagine,inizia con 1 vuoto
window.pagine = pagine;

setInterval(function() {
    console.log("snapshot pagine: ",JSON.parse(JSON.stringify(pagine)));
}, 10000);

let paginaCorrente = 0; // indice della pagina che si sta vedendo;
window.paginaCorrente = paginaCorrente;

// devo modificare un po' di cose nella funzione generaparole
document.body.classList.add('state-generating');

//qua aggiungo una funzione per la validazione della storia
function gestisciValidazioneStoria() {
    return validaStoria(pagine, paginaCorrente, paroleGenerate);
}

// ora faccio in modo che quando clicco sul pulsante genera parole, venga chiamata la funzione GeneraParola
document.getElementById("btnGeneraParola").addEventListener("click", function() {
    setAppState('state-generating');
    gestiscigeneraParola();
});
// ora devo creare un altra funzione wrapper per generaParola(il modulo modifica i numeri che vivono nel main
//quuindi devo riassegnarli con quello che mi restituisce)
function gestiscigeneraParola() {
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
    salvaStoria( pagine, paginaCorrente, gestisciValidazioneStoria , mostraMessaggioPc);
});
// le due textarea le metto in 2 variabili perchè è più comodo 
const textareaSx = document.getElementById("storyInputSx");
const textareaDx = document.getElementById('storyInputDx')

textareaSx.addEventListener("focus", function () {
    setAppState("state-writing");
});
   // o siamo a de3stra o sinistra comunque si mette in staste writing
textareaDx.addEventListener("focus", function () {
    setAppState('state-writing');
});

// ora sistemo la crittura sulla sinistra
textareaSx.addEventListener("input", function() {
    if(this.scrollHeight > this.clientHeight) {
        let testoExtra = ""; //dato che potrebbero esserci frasi lunghe,taglio,cosi va a destrsa

        while(this.scrollHeight > this.clientHeight && this.value.length > 0 ) {
            testoExtra = this.value.charAt ( this.value.length - 1) + testoExtra;
            this.value = this.value.substring(0, this.value.length - 1);
        }
        textareaDx.value = testoExtra + textareaDx.value;

        textareaDx.focus();
        textareaDx.setSelectionRange(testoExtra.length, testoExtra.length);
    }
    salvaPaginaCorrente(pagine, paginaCorrente);
    aggiornaIndicatorePagina(paginaCorrente, pagine);
    gestisciValidazioneStoria();
});

textareaDx.addEventListener("input", function() {
    //ora se si trabococca bisogna cangiari pagina
    if (this.scrollHeight > this.clientHeight) {
        while (this.scrollHeight > this.clientHeight && this.value.length > 0) {
            this.value = this.value.substring(0, this.value.length - 1);
        }
        document.getElementById("indicatorePagina").textContent =  "Pagina " + (paginaCorrente + 1) + " - Piena! Premi ctrl + freccia destra per continuare";
        document.getElementById("indicatorePagina").style.color = "red";
    } else {
        aggiornaIndicatorePagina(paginaCorrente,pagine);
    }

    salvaPaginaCorrente(pagine, paginaCorrente);
    gestisciValidazioneStoria();
}); // funzionaq cazzo si,ora pero devo fare in modo che se cnacello il contenuto a destra ritorno a sinistra, perchè mi rompo ad usare il moue
// ma quanto sono forti i negramaro,mi sto ascoltando attenta mentre ora scirvo quello che ho scritto sopra

// textareaDx.addEventListener("keydown", function(event) {
//    if (event.key === "Backspace" &&  this.value === "") {
//        event.preventDefault();
//       textareaSx.focus();
//        let lunghezza = textareaSx.value.length;
//        textareaSx.setSelectionRange(lunghezza, lunghezza); 
//    }
// }); , funziona, pero se per esempio il foglio destro a gia qualche scritta non torna indietro

textareaDx.addEventListener("keydown", function(event) {
    if (event.key === "Backspace" &&  this.selectionStart === 0 && this.selectionEnd === 0) {
        event.preventDefault();

        if (this.value.length > 0 ) {
            textareaSx.value =textareaSx.value + this.value;
            this.value = "";
            salvaPaginaCorrente(pagine, paginaCorrente);
        }
        textareaSx.focus();
        let lunghezza = textareaSx.value.length;
        textareaSx.setSelectionRange(lunghezza, lunghezza);

    }
});

gestisciValidazioneStoria();

document.getElementById("btnSalva").disabled = true; // disabilità il pulsante per salvare la storia finchè non viene genrata una nuova storia valida

document.addEventListener("keydown", function(event) {
    if (event.key === "F3")  {
        event.preventDefault();
        if (document.body.classList.contains("state-generating")) {
            setAppState("state-writing");
        } else {
            setAppState("state-generating");
        }
    }
    
    //ora devo fare le frecci per cambiare da una pagina all'altra
    if (document.body.classList.contains("state-writing")) {
        if (event.ctrlKey && event.key === "ArrowRight") {
                event.preventDefault();
                paginaCorrente = cambiaPagina("avanti",pagine,paginaCorrente);
                gestisciValidazioneStoria();
                
        } else if (event.ctrlKey && event.key === "ArrowLeft") {
                event.preventDefault();
                paginaCorrente = cambiaPagina("indietro",pagine,paginaCorrente);
                gestisciValidazioneStoria();
            
        }
    }

});
//all'avvio applioco il tema salvato dall'utente(se era gia entrato una volta)
inizializzaTema();
//e aggangio il cambio tema al click sul bottone
document.getElementById("coloreTema").addEventListener("click", cambiaTema)
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

document.getElementById("btNuovaSessione").addEventListener("click",GestisciNuovaSessione);
aggiornaContatoreRare(contatoreRareTotale);


//ora faccio il click per il pulasnte ?
document.getElementById("btnIstruzioni").addEventListener("click", toggleIstruzioni);


// se l'utennte clicca fuori dal pannelo si chiude
document.getElementById("overlayIstruzioni").addEventListener("click", chiudiIstruzioni);

//click sulla x
document.getElementById("btnChiudiIstruzioni").addEventListener("click", chiudiIstruzioni);

document.getElementById("badgeDifficolta").addEventListener("click", cambiaModalità);

//ora faccio che se si clicca H o ? si si entra,ed esc per chiudere
document.addEventListener("keydown", function(event) {
    if (event.key == "Escape") {
        chiudiIstruzioni();
        return;
    }

    //devo fare pero che se clicco H o ? mentre sto scrivendo non si apra il pannello,senno non potrei scfrivere molte parole

    const stoScrivendo = document.activeElement.tagName === "TEXTAREA";
    if (!stoScrivendo && (event.key === "h" || event.key === "H" || event.key === "?")) {
        event.preventDefault();
        toggleIstruzioni();
    }
});

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
}

//ora il badge serve per quando l'utente vuole cambiare modalità
//come su nuova sessione deve mostrare una conferma,senno è troppo facile sbagliare
async function cambiaModalità() {
    const conferma = await mostraConferma("Cambiare modalità?", "le parole generate e la storia che stai scrivendo andranno perdute. Sei sicuro?");
    // se l'utente annulla,esco 
    if(!conferma) return;

    //sennò,se clicca conferma resetto tutto tutto
    paroleGenerate = [];
    numeroParole = 0;
    pagine = [{ sx: "", dx: ""}];
    paginaCorrente = 0;

    document.getElementById("storyInputSx").value = "";
    document.getElementById("storyInputDx").value = "";
    document.getElementById("listaParole").innerHTML = "";
    document.getElementById("indicatorePagina").textConten = "Pagina 1";

    localStorage.removeItem("randomStories_sessione");

    //torno alla schermata iniziale passando false(cioè no sessione)
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