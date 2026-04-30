let paroleDisponibili = [
    "gatto","cane","albero","tempesta","piede","asino","bue",
    "mattone","lupo","cielo","mare","sole","luna","stella","nuvola",
    "laguna","alce","cervo","volpe","tigre","leone","elefante","giraffa",
    "casa","scuola","lavoro","strada","città","paese","montagna",
    "fiume","lago","foresta","deserto","isola","oceano",
    "amico","nemico","famiglia","cuore","mente","anima",
    "sogno","realtà","avventura","mistero","magia",
    "tempo","spazio","universo"
] ;

let paroleGenerate = [] ;  // Array per memorizzare le parole generate

let numeroParole = 0; // Variabile per tenere traccia del numero di parole generate

const ParoleMassime = 10; //numero massimo di parole da generare

function GeneraParola() {
    if (numeroParole >= ParoleMassime) {
        alert("Sei giunto alla fine delle parole da generare,ora inizia a scrivere la tua storia!");
        return;
    }

    let indiceRandom = Math.floor(Math.random() * paroleDisponibili.length);
    let parolaGenerata = paroleDisponibili[indiceRandom];

    // Verifica se la parola è già stata generata
    if (!paroleGenerate.includes(parolaGenerata)) {
        paroleGenerate.push(parolaGenerata); // Aggiungi la parola all'array delle parole generate
        numeroParole++; // Incrementa il contatore delle parole generate
       document.getElementById("listaParole").innerHTML = paroleGenerate.join(", "); // Aggiorna la visualizzazione delle parole generate
       document.getElementById("contatoreParole").textContent = "Parole generate :" + numeroParole + "/" + ParoleMassime;
    } else {
        // Se la parola è già stata generata, chiama ricorsivamente la funzione per generare una nuova parola
        GeneraParola();
    }
}    

function resetParole() {
    paroleGenerate = [];
    numeroParole = 0;
    document.getElementById("listaParole").innerHTML = ""; // pulisce la visualizzazione delle parole generate
    document.getElementById("contatoreParole").textContent ="paroleGenerate: 0/" + ParoleMassime; // resetta il contatore delle parole casuali
    document.getElementById("messaggioErrore").innerHTML = ""; // pulisce eventuali errori di messaggi precedenti
    document.getElementById("btnSalva").disabled = true; // disabilita il pulsante per salvare la storia finchè non viene generata una nuova storia valida
}

function mostraParole() {
    if (paroleGenerate.length === 0) {
        alert("non hai ancora generato parole,clicca su 'Genera parole' per iniziare!");
        return;
    }   else {
        alert("Parole generate finora: " + paroleGenerate.join(", "));
    }
}

function ValidaStoria() {
    let storia = document.getElementById("storyInput").value.toLowerCase(); // Prende il testo della storia e lo converte in minuscolo

    document.getElementById("messaggioErrore").innerHTML = ""; // serve a pulire eventuali errori di messaggi precedenti
    document.getElementById("messaggioErrore").style.color = "red"; // serve a impostare il colore del messaggio di errore in rosso

    if (paroleGenerate.length === 0) {
        document.getElementById("messaggioErrore").innerHTML = "devi generare almeno una parola prima di validitare la tua storia!";
        document.getElementById("btnSalva").disabled = true; // disabilità il pulsante per salvare la storia se non sono state generate parole
        return false; // se non è stata generata alcuna parola,la storia non è valida e la funzione termina qui
    }

    let tuttoValido= true

    for (let parola of paroleGenerate) {
        if (!storia.includes(parola)) {
            document.getElementById("messaggioErrore").innerHTML += "La parola '" + parola + "' è mancante nella tua storia.<br>";
            tuttoValido = false; // se anche solo una parola manca, la storia diventa automaticamente non valida
        }   
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
        alert("la tua storia non è valida,assicurati di includere tutte le parole generate prima di salvarla!");
        return;
    }

    let storia = document.getElementById("storyInput").value; // serve a prendere il testo della storia

    if (storia.trim() === "") {
        alert("La storia è vuota, inserisci del testo prima di salvarla!");
        return;
    }

    let blob = new Blob([storia], {type: "text/plain;charset=utf-8"});  //crea un file blob virtuale con il contenuto della storia

    //creo il link per scaricare il file
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "storia.txt"; // questyo è il nome del file che verrà scaricato

    URL.revokeObjectURL(link.href); //serve a liberare la memoria dopo che la storia è stata scaricata
    //creo il link per scaricare il file
}

// ora faccio in modo che quando clicco sul pulsante genera parole, venga chiamata la funzione GeneraParola
document.getElementById("btnGeneraParola").addEventListener("click", function() {
    GeneraParola();
});

document.getElementById("btnSalva").addEventListener("click", function() {
    salvaStoria();
});



