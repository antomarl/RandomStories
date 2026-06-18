import { getDifficoltaAttiva } from "./js/stato/difficoltaAttiva.js";
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



document.getElementById("contatoreParole").textContent = "Parole generate:" + numeroParole + "/" + getDifficoltaAttiva().paroleMassime;
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
setInterval(function() {
    salvaSessione ( pagine,paginaCorrente,paroleGenerate,numeroParole);
}, 2000);

const datiSessione = caricaSessione(); // ho cambiato nome poichè ho cambiato la funzione,ora sotto sistemo 

if(datiSessione) {
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

    MMR("Sessione ripristinata!")
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
avviaBootScreen();


textareaSx.addEventListener("input", function() {
    avviaTimerStats(pagine);
    aggiornaStatistiche(pagine);
});

textareaDx.addEventListener("input", function() {
    avviaTimerStats(pagine);
    aggiornaStatistiche(pagine);
});

aggiornaStatistiche(pagine);