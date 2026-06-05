// ho creato delle parole speciali e voglio metterle rare

let paroleGenerate = [] ;  // Array per memorizzare le parole generate

let parolerareTrovate = JSON.parse(localStorage.getItem("randomStories_rareTrovate") || "[]");
let contatoreRareTotale = parseInt(localStorage.getItem("randomStories_contatoreRare") || "0"); // cosi salva le parole trovate in localStorage,senno poi si perdevano

const probabilita_rara = 20; // deve essere hard

let numeroParole = 0; // Variabile per tenere traccia del numero di parole generate

const ParoleMassime = 10; //numero massimo di parole da generare

let pagine = [{sx: "", dx: ""}] // array delle pagine,inizia con 1 vuoto

let paginaCorrente = 0; // indice della pagina che si sta vedendo;

function setAppState(state) {
    document.body.classList.remove('state-generating', 'state-writing');
    document.body.classList.add(state);
}
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
    if (numeroParole >= ParoleMassime) {
      /*leviamo l'alert di merda */
      mostraMessaggioPc (
        "> Limite raggiunto: " + ParoleMassime + "/" + ParoleMassime + "parole generate, ora premi F3 per iniziare a scrivere!", "avviso"
      );
      return;
    }
    // serve per decidere se esce una parola rara od una normale
    const tiroraro = Math.floor(Math.random() * probabilita_rara);
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

    aggiornaListaParole();

    document.getElementById("contatoreParole").textContent = "Parole generate: " + numeroParole + "/" + ParoleMassime;
    
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
    aggiornaListaParole();
    //voglio creare un easter egg per sebywlan aka sebylanza aka iano aka elektrowindows aka niente li ho finiti
    // aggiornamento,non capisco perche ma non sta andando più il glitch,che rottura di palle come roba
    if (parolaGenerata == "elektrowindows") {
        let pc = document.querySelector(".pc-wrapper");
        pc.classList.add("glitch-attivo");
        setTimeout(function() {
            pc.classList.remove("glitch-attivo");
        }, 1800);

    }
}
// sto creando la funzione per toglire l'alert 
function mostraMessaggioPc(testo, tipo) {
    let msg = document.getElementById("messaggioPC");
    msg.className = "messaggio";

    if(tipo === "successo") {
        msg.classList.add("successo");
    } else if (tipo === 'avviso') {
        msg.classList.add("avviso")
    }

    typeWriter(msg, testo, 30);
}

function pulisciMessaggioPC () {
    
    document.getElementById("messaggioPC").textContent = "";
    document.getElementById("messaggioPC").className = "messaggio";
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
    document.getElementById("contatoreParole").textContent ="parole generate: 0/" + ParoleMassime; // resetta il contatore delle parole casuali
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



document.getElementById("contatoreParole").textContent = "Parole generate:" + numeroParole + "/" + ParoleMassime;
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
// se una persona mette modalità scura, poi esce e dopo rientra nel sito viene alluciato, ora invece localstorage salva i dati del sito anche se si esce e lo lascia nell'ultimo mdo in cui uno la tenutp
if (localStorage.getItem('tema') === 'scuro') {
    document.body.classList.add('tema-scuro');
    document.getElementById('coloreTema').textContent = 'Tema Chiaro';  //se è scuro il botttone dirà tema chiaro,cioè se uno clicca diventa tema chiaro
} else {
    document.getElementById('coloreTema').textContent = 'Tema Scuro';
}

document.getElementById("coloreTema").addEventListener("click", function () {
    const temaScuroAttivo = document.body.classList.toggle('tema-scuro') // toggle è una figata! praticamente aggiunge la classe se non c'è e la toglie se c'è,tipo il not che ci ha fatto fare Cavallaro e Lo Giudice

    if (temaScuroAttivo) {
        this.textContent = 'Tema Chiaro'; // this serve per rifersi allo stesso bottone di cui si parola,
        localStorage.setItem('tema', 'scuro');
    } else {
        this.textContent = 'Tema Scuro';
        localStorage.setItem('tema', 'chiaro');
    }
});

//il mio amico Costino mi ha detto di fare in modo che se esco per sbaglio dal sito mentre scrivo la stolria non perdo tutto ciò che avevo scritto,so let's do it!
//PS(IMPORTANTE): mi ha detto pure di spostare il la scritta centrale dei comandi e metterla di lato che compare se viene premjuto un tasto,magari un punto interrogativo
function salvaSessione(){
    //per rpima cosa devo aggiornare le pagine con il contenuto attuale delle textarea
    if (pagine[paginaCorrente]) {
        pagine[paginaCorrente].sx = document.getElementById("storyInputSx").value;
        pagine[paginaCorrente].dx = document.getElementById("storyInputDx").value;
    };

    const datiSessione = {
        pagine: pagine,
        paroleGenerate: paroleGenerate,
        numeroParole: numeroParole,
        paginaCorrente: paginaCorrente,
        timestamp: Date.now() // cosi l'utente sa quando viene salvato
    };

    localStorage.setItem("randomStories_sessione", JSON.stringify(datiSessione));
}

function caricaSessione() {
    const salvataggio = localStorage.getItem("randomStories_sessione");

    if (!salvataggio) {
        return false;
    }

    try {
        const dati= JSON.parse(salvataggio);
        if(!dati.pagine || !Array.isArray(dati.pagine)) {
            return false;
        }

        pagine = dati.pagine;
        paroleGenerate = dati.paroleGenerate || [];
        numeroParole = dati.numeroParole || 0;
        paginaCorrente = dati.paginaCorrente || 0;

        document.getElementById("storyInputSx").value = pagine[paginaCorrente].sx || "";
        document.getElementById("storyInputDx").value = pagine[paginaCorrente].dx || "";
        document.getElementById("listaParole").innerHTML = paroleGenerate.join(", ");
        document.getElementById("contatoreParole").textContent = "Parole generate: " + numeroParole + "/" + ParoleMassime;
        document.getElementById("indicatorePagina").textContent = "pagina " + (paginaCorrente + 1) + " di " + pagine.length;
        ValidaStoria()

        return true; // tutto ok

    }  catch (errore) {
        console.warn("errore durante il ripristino della sessione") // non si sa mai si corrompe il JSON

        return false;
    }  
        
}

async function MMR(testo) {  //(tipo abbreviazzione di mostra messaggio di ripristino) serve perchè bisogna chiedere cobnferna,senno e faclie elimare tutto per sbagglio
    const msg = document.getElementById("messaggioRipristino");
    msg.textContent = testo;
    msg.classList.add("visibile");

    //dopo 3 sec se ne va
    setTimeout(function() {
     msg.classList.remove("visibile");
    
    }, 3000);
} 

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
    document.getElementById("contatoreParole").textContent = "Parole generate: 0/" +  ParoleMassime
    document.getElementById("indicatorePagina").textContent = "Pagina 1";
    document.getElementById("messaggioErrore").innerHTML = "";
    document.getElementById("btnSalva").disabled = true;
    pulisciMessaggioPC();

    MMR("nuova sessione iniziata");
    resetStatistiche();
}

setInterval(salvaSessione, 2000); // avvio il salvataggio dell'intervallo ogni 2 secondi

const ripristinato = caricaSessione();
if (ripristinato) {
    MMR("sessione ripristinata!")
}

document.getElementById("btNuovaSessione").addEventListener("click", nuovaSessione);

//effetti per le parole rare:
function aggiornaListaParole() {
    const lista = document.getElementById("listaParole");

    const htmlParole = paroleGenerate.map(function(parola) {
        if(paroleRare.includes(parola)) {
            return "<span class='parola-rara'>" + parola + "</span>";
        } else {
            return parola;
        }
    });

    lista.innerHTML = htmlParole.join(", ");

}
// qua devo ammettere che mi sono fatto psiegare le cose da arena ia,però tutto è scritto a mano,al massimo ricopio guys
function scatenaEffettiRari(parola) {
    const flash = document.getElementById("flashRaro");
    flash.classList.remove("attivo");
    void flash.offsetWidth; // se escono 2 rare 2 volte di non si vedrebbe la animazione
    flash.classList.add("attivo");

    const pc = document.querySelector(".pc-wrapper");
    pc.classList.remove("shake-raro");
    void pc.offsetWidth;
    pc.classList.add("shake-raro");

    generaParticelle(30);

    //per gli smanettoni(come seby) faccio che se guardano f12 vedono la scritta gialla u easter egg
    console.log("%c Parola RARA: " + parola , "color: #ffd700; font-size: 20px; font-weigh: bold; text-shadow: 0 0 8px gold;");
}
//pure qua,thanks arena ia
function generaParticelle(quantita) {
    const contenitore = document.getElementById("particelleRare"); // crea delle particelle dorate che cadono randomicamente

    for(let i = 0; i< quantita; i++) {
        const particella = document.createElement("div");
        particella.className = "particella";

        particella.style.left = Math.random() * 100 + "vw"; // posizione orizzontale random sullo schermo
        particella.style.animationDelay = (Math.random() * 0.5) + "s";//delay random per non farle cadere insieme 
        // ora la dimenzione è leggermente variabile,perchè così è più figo
        const dimensione = 4 + Math.random() * 8;
        particella.style.width = dimensione + "px";
        particella.style.height = dimensione + "px";

        contenitore.appendChild(particella);

        //questa cosa finisce dopo 3 secondi senno diventa il meme "OH MY PC"
        setTimeout(function() {
            particella.remove();
        }, 3000);

    }

}

function aggiornaContatoreRare() {
    //aggiorna il contatore con il numero id rare trovate
    document.getElementById("contatoreRare").textContent = "Rare: " + contatoreRareTotale;
}

aggiornaContatoreRare();


//sempre costa mi ha consigliato di mettere le istruzioni di lato a comparsa,perche sono un po' brutte messe la statiche

function apriIstruzioni() {
    document.getElementById("pannelloIstruzioni").classList.add("aperto");
    document.getElementById("overlayIstruzioni").classList.add("aperto");
}

function chiudiIstruzioni() {
    document.getElementById("pannelloIstruzioni").classList.remove("aperto");
    document.getElementById("overlayIstruzioni").classList.remove("aperto");
}
//coosi l'utente puo aprre e chiudere le istruzioni
function toggleIstruzioni () { // se il pannello è aperto viene chiuso,senno si apre
    const pannello = document.getElementById("pannelloIstruzioni");
    if (pannello.classList.contains("aperto")) {
        chiudiIstruzioni();
    } else {
        apriIstruzioni();
    }
}

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
// voglio migliorare il pc per renderlo più terminale styles, così scrive uno ad uno le lettere,perche è gico cazzo
let typingTimer = null; //serve per tenere traccia del timer

function typeWriter(elemento, testo, velocita) {
    if (!velocita) velocita = 25; //così se manca la velocità uso un default veloce ma comunque legginile

    //per evitare sovrapposizioni di typing, se c'è gia un typing lo fermo
    if (typingTimer) {
        clearInterval(typingTimer);
        typingTimer = null;
    }

    elemento.textContent = ""; // parte vuoto
    let i = 0;

    typingTimer = setInterval(function() {
        elemento.textContent += testo.charAt(i);
        i++;
        if(i >= testo.length) {
            clearInterval(typingTimer);
            typingTimer = null;
        }
    }, velocita);
}

//voglio togliere quiella merda di alert
function mostraConferma(titolo, messaggio) {
    return new Promise(function(resolve) {
        const overlay = document.getElementById("overlayConferma");
        const modal = document.getElementById("modalConferma");
        const titoloEl = document.getElementById("modalConfermaTitolo");
        const messaggioEl = document.getElementById("modalConfermaMessaggio")
        const btnOk = document.getElementById("modalConfermaOk");
        const btnAnnulla = document.getElementById("modalConfermaAnnulla");

        titoloEl.textContent = titolo;
        messaggioEl.textContent = messaggio;

        overlay.classList.add("visibile");
        modal.classList.add("visibile");

        function chiudi(risposta) { // funzione per chiudere e risolvere la promise con true/false
            overlay.classList.remove("visibile");
            modal.classList.remove("visibile");
            
            //ora rimuovo i listener per evitare che si accumulino
            btnOk.removeEventListener("click", clickOk);
            btnAnnulla.removeEventListener("click", clickAnnulla);
            overlay.removeEventListener("click", clickAnnulla);
            document.removeEventListener("keydown", keydown);
            resolve(risposta);
        }

        function clickOk() { chiudi(true); }
        function clickAnnulla() { chiudi(false); }
        function keydown(e) {
            if (e.key === "Escape") chiudi(false);
            if (e.key === "Enter") chiudi(true);
        }

        btnOk.addEventListener("click", clickOk);
        btnAnnulla.addEventListener("click", clickAnnulla);
        overlay.addEventListener("click", clickAnnulla);
        document.addEventListener("keydown", keydown);

    });
}

//voglio creare una cosa che secondo me è tipo super spaziale,quando entro nel sito deve fare un effetto cose boot topo bios,se riesco è fighissimo
const righeBootScreen = [
    { testo: "> RANDOM_STORIES_OS v2.1.3", delay: 400},
    { testo: "(c) 2025 Antonino Marletta. All right reserved.", delay:600},
    { testo: "> ", delay: 200},
    { testo: "> Booting kernel....................  [OK]", delay:350},
    { testo: "> Loading word database (4352).  [OK]", delay:400},
    { testo: "> Initializing terminal....................  [OK]", delay: 350},
    { testo: "> Checking save state....................  [OK]", delay: 400},
    { testo: "> Loading rare words....................  [OK]", delay: 500},
    { testo: "> ", delay: 300},
    { testo: "> Welcome, user." , delay: 600},
    { testo: "> System ready.", delay:700},
    { testo: "> _", delay: 800 }
];

function avviaBootScreen() {
    const boot = document.getElementById("bootScreen");
    const sezione = document.getElementById("sectionGeneraParole");

    if (!boot || !sezione) {
        console.error("Boot screen: elementi mancanti!"); // non funzionava un cazzo,almeno così capisco
        return;
    }

    const figli = sezione.children; //cosiora nascondo tutti i figli della sezione tranne il bootscreen
    for (let i = 0; i < figli.length; i++) {
        if (figli[i].id !== "bootScreen") {
            figli[i].style.display = "none";
        }
    }

    boot.style.display = "block";
    boot.innerHTML = "";
    let rigaCorrente = 0;

    function scriviProssimaRiga() {
        if (rigaCorrente >= righeBootScreen.length) {
            setTimeout(function() {
                boot.style.display = "none";
                //now rimostro i figli della sessione
                for (let i = 0; i < figli.length; i++) {
                    if (figli[i].id !== "bootScreen") {
                        figli[i].style.display = "";
                    }
                }
            }, 700);
            return;
        }

        const riga = righeBootScreen[rigaCorrente];
        const divRiga = document.createElement("div");
        divRiga.className = "riga-boot";
        boot.appendChild(divRiga);

        let i = 0;
        const intervalloLettere = setInterval(function() {
            divRiga.textContent += riga.testo.charAt(i);
            i++;
            if(i >= riga.testo.length) {
                clearInterval(intervalloLettere);
                rigaCorrente++;
                setTimeout(scriviProssimaRiga, riga.delay);
            }
        }, 15);
    }
    scriviProssimaRiga();

}

avviaBootScreen();

let tempoInizio = null; //serve per quando si inizia a scrivere il primo carattere
let timerStats = null; //aggiorna le stats ogni secondo

function calcolaStatistiche() {
    let testoCompleto = ""; //ora unisco il testo di tutte le pagine in una stringa unica
    for(let p of pagine) {
        testoCompleto += (p.sx || "") + " " + (p.dx || "") + " ";
    }

    testoCompleto = testoCompleto.trim();

    const caratteri = testoCompleto.length; // cosi conta i caratteri totali

    const parole = testoCompleto.length > 0
        ? testoCompleto.split(/\s+/).filter(function(p) { return p.length > 0; }).length
        : 0; // conta le parole splittandole per spazi e filtrando le stringhe vuote

    const numeroPagine = pagine.length; // numero di pagine usate

    let secondiTotali = 0; // calcolo il tempo trascorso mentre si scrive
    if ( tempoInizio !== null) {
        secondiTotali = Math.floor((Date.now() - tempoInizio) / 1000 )
    }

    let ppm = 0; // ppm(parole per minuto)
    if (secondiTotali > 0) {
        ppm = Math.round(parole / (secondiTotali / 60));
    }

    const minuti = Math.floor(secondiTotali / 60);
    const secondi = secondiTotali % 60;
    const tempoFormattato = String(minuti).padStart(2, "0") + ":" + String(secondi).padStart(2, "0");

    return { parole, caratteri, tempoFormattato, numeroPagine, ppm };
}

function aggiornaStatistiche() {
    const stats = calcolaStatistiche();
    document.getElementById("statsParole").textContent = stats.parole;
    document.getElementById("statsCaratteri").textContent = stats.caratteri;
    document.getElementById("statsTempo").textContent = stats.tempoFormattato;
    document.getElementById("statsPagine").textContent = stats.numeroPagine;
    document.getElementById("statsPpm").textContent = stats.ppm;
}

function avviaTimerStats() {
    if (timerStats !== null) return; //se è gia attivo non lo riavvio,per eviatre sovrapposizioni

    //ora segno l'inizio
    if (tempoInizio === null) {
        tempoInizio = Date.now();
    }

    timerStats = setInterval(aggiornaStatistiche, 1000); // aggiorno il timer ogni secondo
}

function resetStatistiche() {
    if ( timerStats !== null) {
        clearInterval(timerStats);
        timerStats = null;
    }

    tempoInizio = null;
    aggiornaStatistiche(); // azzera i numeri a schermo
}

textareaSx.addEventListener("input", function() {
    avviaTimerStats();
    aggiornaStatistiche();
});

textareaDx.addEventListener("input", function() {
    avviaTimerStats();
    aggiornaStatistiche();
});

aggiornaStatistiche();