let paroleGenerate = [] ;  // Array per memorizzare le parole generate

let numeroParole = 0; // Variabile per tenere traccia del numero di parole generate

const ParoleMassime = 10; //numero massimo di parole da generare

let pagine = [""]; // array delle pagine,inizia con 1 vuoto

let paginaCorrente = 0; // indice della pagina che si sta vedendo;

function setAppState(state) {
    document.body.classList.remove('state-generating', 'state-writing');
    document.body.classList.add(state);
}
function cambiaPagina(direzione) {
    pagine[paginaCorrente] = document.getElementById('storyInput').value;

    if (direzione === 'avanti') {
        paginaCorrente++;
        if (paginaCorrente >= pagine.length) {
            pagine.push("");
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

    document.getElementById("storyInput").value = pagine[paginaCorrente];
    document.getElementById("indicatorePagina").textContent =
        "Pagina " + (paginaCorrente + 1) + " di " + pagine.length;

    ValidaStoria();
}

function GeneraParola() {
    if (numeroParole >= ParoleMassime) {
      /*leviamo l'alert di merda */
      mostraMessaggioPc (
        "> Limite raggiunto: " + ParoleMassime + "/" + ParoleMassime + "parole generate, ora premi F3 per iniziare a scrivere!", "avviso"
      );
      return;
    }

    let indiceRandom = Math.floor(Math.random() * paroleDisponibili.length); // 
    let parolaGenerata = paroleDisponibili[indiceRandom];

    // Verifica se la parola è già stata generata
    if (!paroleGenerate.includes(parolaGenerata)) {
        paroleGenerate.push(parolaGenerata); // Aggiungi la parola all'array delle parole generate
        numeroParole++; // Incrementa il contatore delle parole generate
       document.getElementById("listaParole").innerHTML = paroleGenerate.join(", "); // Aggiorna la visualizzazione delle parole generate
       document.getElementById("contatoreParole").textContent = "Parole generate :" + numeroParole + "/" + ParoleMassime;
       mostraMessaggioPc(
        "> Parola aggiunta: \"" + parolaGenerata + "\"", "successo"
       );
       ValidaStoria(); // per vedere se la storia è ancora valida dopo aver generato la parola
    } else {
        // Se la parola è già stata generata, chiama ricorsivamente la funzione per generare una nuova parola
        GeneraParola();
    }
}
// sto creando la funzione per toglire l'alert 
function mostraMessaggioPc(testo, tipo) {
    let msg = document.getElementById("messaggioPC");
    msg.textContent = testo;
    msg.className = "messaggio";

    if (tipo === "successo") {
        msg.classList.add("successo");
    } else if (tipo === 'avviso') {
        msg.classList.add("avviso");
    }

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
    pagine = [""];
    paginaCorrente = 0;
    document.getElementById("storyInput").value = "";
    document.getElementById("listaParole").innerHTML = ""; // pulisce la visualizzazione delle parole generate
    document.getElementById("indicatorePagina").textContent = "Pagina 1";
    document.getElementById("contatoreParole").textContent ="parole generate: 0/" + ParoleMassime; // resetta il contatore delle parole casuali
    document.getElementById("messaggioErrore").innerHTML = ""; // pulisce eventuali errori di messaggi precedenti
    document.getElementById("btnSalva").disabled = true; // disabilita il pulsante per salvare la storia finchè non viene generata una nuova storia valida
    ValidaStoria(); // chiama la funzione ValidaStoria per aggiornare lo stato della storia dopo il reset delle parole generate
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
    pagine[paginaCorrente] = document.getElementById("storyInput").value; //prende il testo della storia e lo converte in minuscolo
    let storia = pagine.join(" ").toLowerCase();
    document.getElementById("messaggioErrore").innerHTML = ""; // serve a pulire eventuali errori di messaggi precedenti
    document.getElementById("messaggioErrore").style.color = "red"; // serve a impostare il colore del messaggio di errore in rosso

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

function salvaStoria() {
    if (!ValidaStoria()) {
        return;
    }
    // faccio in modo che si salvi anche la pagina corrente quando esporto
    pagine[paginaCorrente] = document.getElementById("storyInput").value;

    let storiaCompleta = "";

    for (let i = 0; i < pagine.length; i++) {
        storiaCompleta += "=== Pagina " + (i + 1) + "===\n";
        storiaCompleta += pagine[i] + "\n\n";
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

document.getElementById("storyInput").addEventListener("focus", function() {
    setAppState('state-writing');
});
document.getElementById("storyInput").addEventListener("input", function() {
    // controllo se il testo ha supertato la grandezza del libro senza la possibilità di usare la rotellina
    if (this.scrollHeight > this.clientHeight) {
        while (this.scrollHeight > this.clientHeight && this.value.length > 0) {
            this.value = this.value.substring(0, this.value.length - 1);
        }
       document.getElementById("indicatorePagina").textContent = "Pagina " + (paginaCorrente + 1 ) + " - Piena! Premi ctrl + freccia destra per continuare.";
       document.getElementById("indicatorePagina").style.color = "red";
    } else {
        document.getElementById("indicatorePagina").textContent = "Pagina " + (paginaCorrente + 1) + " di " + pagine.length;
        document.getElementById("indicatorePagina").style.color = "#6b4a2f";
    }

    
    pagine[paginaCorrente] = this.value;
    ValidaStoria(); // ogni volta che l'utente modifica il testo della storia, viene chiamata la funzione ValidaStoria per verificare se la storia e valida o meno,ed in caso di errori mostrare i messaggi di errore in tempo reale,oppure se la storia è ancora valida,mostrare il messaggio di successo e dare la possibilità di salvare la storia

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

