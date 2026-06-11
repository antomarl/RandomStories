import { paroleMassime, probabilitaRara } from "./js/config/costanti.js"; // ho imporatto le due funzioni che avevo messo in config.js
import { setAppState } from "./js/stato/statoApp.js"; // ho importato pure questo
import { typeWriter, mostraMessaggioPc, pulisciMessaggioPC } from "./js/ui/terminale.js"; // e siamo  a tre,lesgo
import { inizializzaTema, cambiaTema } from "./js/ui/tema.js";
import { apriIstruzioni, chiudiIstruzioni, toggleIstruzioni } from "./js/ui/istruzioni.js";
import { mostraConferma } from "./js/ui/modali.js";
import { attivaGlitchPC } from "./js/effetti/glitch.js";
import { generaParticelle } from "./js/effetti/particelle.js";
import { scatenaEffettiRari } from "./js/effetti/flashRaro.js";
import { MMR } from "./js/ui/messaggi.js";
import { aggiornaStatistiche, avviaTimerStats, resetStatistiche} from "./js/ui/statistiche.js";
import { avviaBootScreen } from "./js/ui/bootScreen.js"
import { salvaSessione, caricaSessione} from "./js/sessione/salvataggio.js";
import { aggiornaListaParole } from "./js/parole/listaParole.js";
// ho creato delle parole speciali e voglio metterle rare

let paroleGenerate = [] ;  // Array per memorizzare le parole generate

let parolerareTrovate = JSON.parse(localStorage.getItem("randomStories_rareTrovate") || "[]");
let contatoreRareTotale = parseInt(localStorage.getItem("randomStories_contatoreRare") || "0"); // cosi salva le parole trovate in localStorage,senno poi si perdevano

// non serve più messa qua, rip

let numeroParole = 0; // Variabile per tenere traccia del numero di parole generate

// neanche questa

let pagine = [{sx: "", dx: ""}] // array delle pagine,inizia con 1 vuoto

let paginaCorrente = 0; // indice della pagina che si sta vedendo;

function cambiaPagina(direzione) {
    pagine[paginaCorrente].sx = document.getElementById('storyInputSx').value; // Rip Storyinput N2026 M2026
    pagine[paginaCorrente].dx = document.getElementById('storyInputDx').value;

    if (direzione === 'avanti') {
        paginaCorrente++;
        if (paginaCorrente >= pagine.length) {
            pagine.push({sx: "", dx: ""});
        }
    } else if (direzione === "indietro") {
        if (paginaCorrente > 0) {
            paginaCorrente--;
        } else {
            return;   // sei già a pagina 1, non andare oltre
        }
    } else {
        return;
    }

    document.getElementById("storyInputSx").value = pagine[paginaCorrente].sx;
    document.getElementById("storyInputDx").value = pagine[paginaCorrente].dx;
    document.getElementById("indicatorePagina").textContent = "Pagina " + (paginaCorrente + 1) + " di " + pagine.length;
    
    const textareaSx = document.getElementById("storyInputSx");
    textareaSx.focus();
    textareaSx.setSelectionRange(textareaSx.value.length, textareaSx.value.length);
   
    ValidaStoria();
}
// devo modificare un po' di cose nella funzione generaparole
function GeneraParola() {
    if (numeroParole >= paroleMassime) {
      /*leviamo l'alert di merda */
      mostraMessaggioPc (
        "> Limite raggiunto: " + paroleMassime + "/" + paroleMassime + "parole generate, ora premi F3 per iniziare a scrivere!", "avviso"
      );
      return;
    }
    // serve per decidere se esce una parola rara od una normale
    const tiroraro = Math.floor(Math.random() * probabilitaRara); // qua prima avevo scritto probabilita_rara, ma adesso per fare tutti nello stesso stile l'ho rinominata
    const escerara = (tiroraro === 0); //1 su 20 di possibilità

    let parolaGenerata;
    let rara = false;

    if(escerara) { //prova a generare una parola speciale che non è ancora uscita
        const indiceRaro = Math.floor(Math.random() * paroleRare.length);
        parolaGenerata = paroleRare[indiceRaro];
        rara = true;
    } else { // da una parola normale
        const indiceRandom = Math.floor(Math.random() * paroleDisponibili.length);
        parolaGenerata = paroleDisponibili[indiceRandom];
    }

    if (paroleGenerate.includes(parolaGenerata)) { // controlla se una parola non sia stata già generata
        GeneraParola();
        return;
    }

    paroleGenerate.push(parolaGenerata);
    numeroParole++;

    if (rara) {
        scatenaEffettiRari(parolaGenerata)
    
        //se è la first time,slava nella lista permanente le parole rare trovate
        if(!parolerareTrovate.includes(parolaGenerata)) {
            parolerareTrovate.push(parolaGenerata);
            localStorage.setItem("randomStories_rareTrovate",JSON.stringify(parolerareTrovate));
        }
        //incremento le parole rare trovate
        contatoreRareTotale++
        localStorage.setItem("randomStories_contatoreRare",contatoreRareTotale.toString())
        aggiornaContatoreRare();

    }

    aggiornaListaParole(paroleGenerate, paroleRare);

    document.getElementById("contatoreParole").textContent = "Parole generate: " + numeroParole + "/" + paroleMassime;
    
    //il messaggio nel terminale deve essere diverso tra rare e normali
    if (rara) {
        mostraMessaggioPc (
            "parola rara sbloccata: \"" + parolaGenerata + "\":)", "successo"
        );
    } else {
        mostraMessaggioPc(
            "> Parola aggiunta: \"" + parolaGenerata + "\"","successo"
        );
    }
    aggiornaListaParole(paroleGenerate, paroleRare );
    //voglio creare un easter egg per sebywlan aka sebylanza aka iano aka elektrowindows aka niente li ho finiti
    // aggiornamento,non capisco perche ma non sta andando più il glitch,che rottura di palle come roba
    if (parolaGenerata === "elektrowindows") { attivaGlitchPC() };
}
function contieneParola(testo,parola) {
    // converte la storia in minuscolo per una ricerca case-insensitive
    testo = testo.toLowerCase();

    const lettera = "\\p{L}"; 
    const regexEsatta = new RegExp (
        "(^|[^" + lettera + "])" +
        parola.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
        "(?=[^" + lettera + "]|$)",
        "iu"
    );

    if (regexEsatta.test(testo)) {
        return true; // se la parola esatta è presente nella storia,la funzione restituisce true e la storia è valida per quella parola
    }
    
    // dizionaro per tutti quei verdbi irregolari (che rottura)
    const irregolari = {
        "essere" :["sono","sei","è","siamo","siete","sono","stato","stata","stati","state","eravamo","ero","eri","era","eravamo","eravate","erano","fui","fosti","fu"],
        "avere" : ["ho","hai","ha","abbiamo","avete","hanno","avuto","avuta","avuti","avute"],
        "andare" :["vado","vai","va","andiamo","andate","vanno","andato","andata","andati","andate","andai","andò","andasti","vanno","andammo","andaste"],
        "fare" : ["faccio","fai","fa","facciamo","fate","fanno","fatto","fatta","fatti","fatte","feci","fece","faceste","facemmo","faceste","fecero","facevo","facevi","faceva","facevamo","facevate","facevamo"],
        "dire" : ["dico","dici","dice","diciamo","dite","dicono","detto","detta","detti","dette","disse","dissero","dicemmo","diceva","dicevo","dicevi","dicevamo","dicevate","dicevano"],
        "venire" : ["vengo","vieni","viene","veniamo","venite","vengono","venuto","venuta","venuti", "venute","venni","venne", "venivo", "veniva","venivamo","venivate","venivano","venivi"],
        "udire" : ["odo","udì","udiamo","udite","udirono","udite","udiamo","udirono","udii","udi","udivo","udiva","udivamo","udivate","udivano","udivi"],
        "stare" : ["sto","stai","sta","stiamo","state","stanno","stato","stata","stati","starà","staremo","starete","staranno","staremo","staremmo","starò","starai","stavo","stava","stavi","stavamo","stavate","stavano"],
        "dare" : ["do","dai","da","diamo","date","danno","dato","data","dati","daremo","diedi","darò","darai","darà","darete","daranno","diedi","diede","diedero","davo","davi","dava","davamo","davate","davano"],
        "potere" : ["posso","puoi","può","possiamo","potete","possono","potuto","potevo","potevi","poteva","potevamo","potevate"]
    };

    if (irregolari[parola]) {
        for (const forma of irregolari[parola]) {
            const regexVariante = new RegExp(
                "(^|[^" + lettera + "])" +
                forma.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
                "(?=[^" + lettera + "]|$)",
                "iu"
            );
            if (regexVariante.test(testo)) {
                return true;
            }    
        }
    }
    
    let radice = parola;
    let isVerbo = false;

    if (parola.endsWith("are"))  {
        radice = parola.slice(0, -3);
        isVerbo = true;
    }
    else if (parola.endsWith("ere")) {
        radice = parola.slice(0, -3);
        isVerbo = true;
    }
    else if (parola.endsWith("ire")) {
        radice = parola.slice(0, -3);
        isVerbo = true
    }

    if (isVerbo && radice.length > 2) {
        // sono uscito pazzo a scrivere questo a mano,ma la goduria di vedere che alle 21 di sera funzionava è impagabile,penso niente mi dara una felicità cosi genuina
        const varianti = [
            radice + "o", radice + "i", radice + "a", radice + "iamo", radice + "ate", radice + "ano",
            radice + "avo", radice + "ava", radice + "avi", radice + "avamo", radice + "avate", radice + "avano",
            radice + "erò", radice + "erai", radice + "erà", radice + "eremo", radice + "erete", radice + "eranno",
            radice + "ato", radice + "ata", radice + "ati", radice + "ate",
            radice + "ito", radice + "ita", radice + "iti",radice + "ite",
            radice + "uto", radice + "uta", radice + "uti", radice + "ute",
            radice + "ando",radice + "endo", radice + "ante",radice + "erei",
            radice + "eresti",radice + "eresi",radice + "eremmo",radice + "ereste",radice + "erebberro",
            radice + "irei",radice + "iresti",radice + "iremmo",radice + "ireste",radice + "irebbero",
            radice + "ai",radice + "asti",radice + "ò",radice + "ammo",radice + "aste",radice + "arono", radice + "assi", radice + "erei",radice + "eresti",radice + "essi",radice + "emmo",radice + "este",radice + "ebbero"
        ];

        for (let v of varianti) {
            const regexVariante = new RegExp(
                "(^|[^" + lettera + "])" +
                v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
                "(?=[^" + lettera + "]|$)",
                "iu"
            );
            if (regexVariante.test(testo)) {
                return true; // così se una delle varianti del verbo è presente nel testo la storia e valida comunque,speriamo che funziona ti prego
            }
        }
    }
    return false;
}

function resetParole() {
    paroleGenerate = [];
    numeroParole = 0;
    pagine = [{sx: "", dx: "" }]; 
    paginaCorrente = 0;
    document.getElementById("storyInputSx").value = "";
    document.getElementById("storyInputDx").value = "";
    document.getElementById("listaParole").innerHTML = ""; // pulisce la visualizzazione delle parole generate
    document.getElementById("indicatorePagina").textContent = "Pagina 1";
    document.getElementById("contatoreParole").textContent ="parole generate: 0/" + paroleMassime; // resetta il contatore delle parole casuali
    document.getElementById("messaggioErrore").innerHTML = ""; // pulisce eventuali errori di messaggi precedenti
    document.getElementById("btnSalva").disabled = true; // disabilita il pulsante per salvare la storia finchè non viene generata una nuova storia valida
    pulisciMessaggioPC(); // cosi toglie la scritta sotto se si resetta 
    ValidaStoria(); // chiama la funzione ValidaStoria per aggiornare lo stato della storia dopo il reset delle parole generate
    resetStatistiche();
}

function mostraParole() {
    if (paroleGenerate.length === 0) {
        /* tolgo gli alert pure qua*/
        mostraMessaggioPc(
            "Nessuna parola generata. Clicca 'genera parola' per iniziare.","avviso"
        )
    }   else {
        mostraMessaggioPc (
            "> Parole generate: " + paroleGenerate.join(", "), "successo"
        );
    }
}

function ValidaStoria() {
    // ora salvo il contenuto delle 2 aree nella pagina corrente

    let inputSx = document.getElementById("storyInputSx");
    let inputDx = document.getElementById("storyInputDx");   //salviamo i valori di entrambe le textarea, rimpiango storyInput nelc prime
    if (inputSx && inputDx) {
        pagine[paginaCorrente].sx = inputSx.value;
        pagine[paginaCorrente].dx = inputDx.value;
    }

    let storia = "";
    for(let p of pagine) {
        storia += p.sx + " " + p.dx + " ";
    }

    storia = storia.toLocaleLowerCase();
    document.getElementById("messaggioErrore").innerHTML = " ";
    document.getElementById("messaggioErrore").style.color = "red";

    if (paroleGenerate.length === 0) {
        document.getElementById("messaggioErrore").innerHTML = "devi generare almeno una parola prima di validitare la tua storia!";
        document.getElementById("btnSalva").disabled = true; // disabilità il pulsante per salvare la storia se non sono state generate parole
        return false; // se non è stata generata alcuna parola,la storia non è valida e la funzione termina qui
    }

    let tuttoValido= true

    let mancanti = [];

    for (let parola of paroleGenerate) {
        if (!contieneParola(storia, parola)) {
            mancanti.push(parola);
            tuttoValido = false;
        }
    }

    if (mancanti.length > 0) {
        document.getElementById("messaggioErrore").innerHTML = "Mancano: <br>" + mancanti.join(", ");
    }
    // se è tutto apposto,il messaggio di sucesso viene mostrato e diamo la possibilità di salvare la storia
    if (tuttoValido) {
        document.getElementById("messaggioErrore").innerHTML = "La tua storia è valida,ora puoi salvarla  cliccando su  'Salva Storia',oppure genera una nuova storia completamente da zero!";
        document.getElementById("messaggioErrore").style.color = "green"; // cambia il colore del messaggio di errore in verde 
        document.getElementById("btnSalva").disabled = false; // abilia il pulsante per salvare la storia solo se la storia è valida
        return true; // se tutte le parole sono presenti, la storia è valida e la funzione restituisce true
    }
    
    document.getElementById("btnSalva").disabled = true; // disabilità il pulsante per salvare la storia se la storia non è valida
    return false; // se anche solo una parola manca, la storia non è valida e la funzione restituisce false
}

function salvaPaginaCorrente() { // scrivo 2 funzioni cosi scrivo il codice una volta sola,il codice si capisce megli o e si accorcia, a quanto pare si chiama principio DRY
    pagine[paginaCorrente].sx = textareaSx.value;
    pagine[paginaCorrente].dx = textareaDx.value;   
}

function aggiornaIndicatorePagina() {
    document.getElementById("indicatorePagina").textContent = "pagina " + (paginaCorrente + 1) + " di " + pagine.length;
    document.getElementById("indicatorePagina").style.color = "#6b4a2f";
}

function salvaStoria() {
    if (!ValidaStoria()) {
        return;
    }
    // faccio in modo che si salvi anche la pagina corrente quando esporto(edit: stessa cosa per entrambe le textarea)
    pagine[paginaCorrente].sx = document.getElementById("storyInputSx").value;
    pagine[paginaCorrente].dx = document.getElementById("storyInputDx").value;

    let storiaCompleta = "";

    for (let i = 0; i < pagine.length; i++) {
        storiaCompleta += "=== Pagina " + (i + 1) + "===\n";
        storiaCompleta += pagine[i].sx +" " + pagine[i].dx + "\n\n";
    }

    if (storiaCompleta.trim() === "") {
        mostraMessaggioPc("> Errore: la storia è vuota!", "errore");
        return;
    }

    let blob = new Blob([storiaCompleta], {type: "text/plain;charset=utf-8"});
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "storia.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href); 

}

document.body.classList.add('state-generating');

// ora faccio in modo che quando clicco sul pulsante genera parole, venga chiamata la funzione GeneraParola
document.getElementById("btnGeneraParola").addEventListener("click", function() {
    setAppState('state-generating');
    GeneraParola();
});

document.getElementById("btnResetParole").addEventListener("click", function() {
    setAppState('state-generating');
    resetParole();
});

document.getElementById("btnSalva").addEventListener("click", function() {
    salvaStoria();
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
    salvaPaginaCorrente();
    aggiornaIndicatorePagina();
    ValidaStoria();
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
        aggiornaIndicatorePagina();
    }

    salvaPaginaCorrente();
    ValidaStoria()
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
            salvaPaginaCorrente();
        }
        textareaSx.focus();
        let lunghezza = textareaSx.value.length;
        textareaSx.setSelectionRange(lunghezza, lunghezza);

    }
});



document.getElementById("contatoreParole").textContent = "Parole generate:" + numeroParole + "/" + paroleMassime;
ValidaStoria();

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
                cambiaPagina("avanti");
                
        } else if (event.ctrlKey && event.key === "ArrowLeft") {
                event.preventDefault();
                cambiaPagina("indietro")
            
        }
    }

});
//all'avvio applioco il tema salvato dall'utente(se era gia entrato una volta)
inizializzaTema();
//e aggangio il cambio tema al click sul bottone
document.getElementById("coloreTema").addEventListener("click", cambiaTema)
//il mio amico Costino mi ha detto di fare in modo che se esco per sbaglio dal sito mentre scrivo la stolria non perdo tutto ciò che avevo scritto,so let's do it!
//PS(IMPORTANTE): mi ha detto pure di spostare il la scritta centrale dei comandi e metterla di lato che compare se viene premjuto un tasto,magari un punto interrogativo

async function nuovaSessione() {
    const conferma = await mostraConferma(
        "Nuova Sessione",
        "Sicuro di voler iniziare una nuova sessione? Perderai TUTTO il lavoro attuale!"
    );

    if (!conferma) {
        return;
    }
    localStorage.removeItem("randomStories_sessione"); //serve a rimuovere local storage

    //resettiamo le varbiabili

    paroleGenerate = [];
    numeroParole = 0;
    pagine = [{sx: "", dx: ""}];
    paginaCorrente = 0;

    document.getElementById("storyInputSx").value = "";
    document.getElementById("storyInputDx").value = "";
    document.getElementById("listaParole").innerHTML = "";
    document.getElementById("contatoreParole").textContent = "Parole generate: 0/" +  paroleMassime
    document.getElementById("indicatorePagina").textContent = "Pagina 1";
    document.getElementById("messaggioErrore").innerHTML = "";
    document.getElementById("btnSalva").disabled = true;
    pulisciMessaggioPC();

    MMR("Nuova sessione iniziata!");
    resetStatistiche();
}

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
    document.getElementById("contatoreParole").textContent = "Parole generate: " + numeroParole + "/" + paroleMassime;
    document.getElementById("indicatorePagina").textContent = "pagina " + (paginaCorrente + 1) + " di " + pagine.length;

    ValidaStoria();

    MMR("Sessione ripristinata!")
}

document.getElementById("btNuovaSessione").addEventListener("click", nuovaSessione);
function aggiornaContatoreRare() {
    //aggiorna il contatore con il numero id rare trovate
    document.getElementById("contatoreRare").textContent = "Rare: " + contatoreRareTotale;
}

aggiornaContatoreRare();


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