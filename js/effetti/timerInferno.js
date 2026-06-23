//modulo  del timer per la modalità inferno, gestisce countdown.colori di pericolo timer e game over

let intervalloTimer = null; // id dell'intervallo, serve per fermarlo dopo
let secondiRimanenti = 0;
let gameOverAttivo = false;
let callbackGameOver = null; // funzione che serve a chiamare il main quando finisce il tempo

// intanto formattiamo i secondi in mm:ss

function formattaTempo(secondi) {
    const minuti= Math.floor(secondi / 60);
    const sec = secondi % 60;
    // padStart mette un zero davanti al secondo o minuto se serve(per adesso non servirebbe sui minuti,però lo metto perchè ho un idea in futuro)
    return `${String(minuti).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

//questa funzione serve invece ad aggiornare l'ui: testo,colare in base al testo rimasto
function aggiornaUI() {
    const timer = document.getElementById("timerInferno");
    if (!timer) return;

    timer.textContent = `${formattaTempo(secondiRimanenti)}`;

    //pulisco le classi vecchio e metto quelle giuste in base al tempo
    timer.classList.remove("allarme","critico");

    if(secondiRimanenti <= 10) {
        timer.classList.add("critico"); // metto il rosso lampeggiante
    } else if (secondiRimanenti <= 60) {
        timer.classList.add("allarme"); // qua il oclore giallo
    }
}

//questa funzione invece deve avviare il cuountdown , prendere i secomndi totali e callback per il game over
export function avviaTimerInferno(secondiTotali, onGameOver) {
    //metto una console log anche qua per un bug
    console.log("avviatimerInferno chiamat con ", secondiTotali, " secondi");
    //se ci dovesse essere gia un timer attivo,lo spengo prima per evitare duplicati(la funzione sua la mettero dopo,però intanto gli do un nome originale)
    fermaTimerInferno();

    secondiRimanenti = secondiTotali;
    callbackGameOver = onGameOver;
    gameOverAttivo = false;

    const timer = document.getElementById("timerInferno");
    if(!timer) return;

    timer.classList.add("visibile");
    aggiornaUI();

    //qua parte il countdown,ogni secondo decremento e aggiorno
    intervalloTimer = setInterval(function() {
        secondiRimanenti--;
        aggiornaUI();

        //se arriviamo a 0, game over :)
        if (secondiRimanenti <= 0) {
            scatenaGameOver();
        }
    }, 1000);
}

// ora creo la funzione che ho nominato prima,per fermare il timer e nascondere l'ui,quando per eeempio cambi modalita
export function fermaTimerInferno() {
    if( intervalloTimer !== null) {
        clearInterval(intervalloTimer);
        intervalloTimer = null;
    }

    const timer = document.getElementById("timerInferno");
    if(timer) {
        timer.classList.remove("visibile","allarme","critico");
        timer.textContent = "00:00";
    }

    secondiRimanenti = 0;
    gameOverAttivo = false;
    document.body.classList.remove("game-over");

    //nascondo anche l'overlay che era visibile
    const overlay = document.getElementById("overlayGameOver");
    if(overlay) overlay.classList.remove("visibile");
}

//ora devo fare la funzione che scatena gli effetti del gameOverù
function scatenaGameOver() {
    if(gameOverAttivo) return; //evitiamo doppi triggger
    gameOverAttivo = true;

    //fermo il countdown per non andare sotto 0
    clearInterval(intervalloTimer);
    intervalloTimer = null;

    //attivo il blocco della textarea
    document.body.classList.add("game-over");

    //ora metto gli effetti glitch e flash sullo shcermo,quelli che avevo gia usato in pratica
    document.body.classList.add("glitch-attivo");
    setTimeout(function() {
        document.body.classList.remove("glitch-attivo");
    }, 1800);

    const flash = document.getElementById("flashRaro");
    if (flash) {
        //svuoto e riapplico la classe per far ripartire l'animazione
        flash.style.background = "radial-gradient(circle, rgba(255, 0, 0, 0.6), transparent 70%)";
        flash.classList.add("attivo");
        setTimeout(function() {
            flash.classList.remove("attivo");
            flash.style.background = ""; // ripristino default per il prossimo flash raro
        }, 800);
    }

    //ora mostro l'overlay del game over dopo un po' di ritardo dal glith, così l'utente lo vede
    setTimeout(function() {
        const overlay = document.getElementById("overlayGameOver");
        if (overlay) overlay.classList.add("visibile");
    }, 600);

    //ora avviso il main che è finita,così può fare pulire tutoo e salvare
    if (typeof callbackGameOver === "function") {
        callbackGameOver();
    }
}

// questo serve ad evitare di salvare la sessione durante il game over
export function isGameOver() {
    return gameOverAttivo;
}