// qua dentro ci va tutto il codice per la difficolta
import {difficolta} from "../config/difficolta.js";

//qua metto un flag(mi fa pensare a castorina ed assembly) che evita che si chiamo 2 volte la funzionw si aggainciano 2 volte i click e parte tutto doppio
let schermataInizializzata = false;

//questa funzione prende il nome e mi restituisce l'etichetta("facile " divemta "FACILE")
function getEtichettaDifficolta(nome) {
    return difficolta[nome]?.etichetta || nome.toUpperCase(); // il ? serve a evitare crach se non esiste
}

// qua si deve mettere òa scritta sotto al bottone cone le regole delle parole o del tempo per l'inferno
function getMetaDifficolta(config) {
    const pezzi = [
        `${config.paroleMassime} parole max`,
        `${config.probabilitaRara}% rare`
    ];

    //dato che solo l'inferno ha il timer,controllo prima
    if( config.timer ) {
        const minuti = Math.floor(config.timer / 60); // i secondi diventano minuti,più facile da leggere cosi
        pezzi.push(`${minuti} min`)
    }

    return pezzi.join(" · ") // li unisce cosi con un pallino in mezzo,ci sta dai
}

// ora si fa la funzione importante che fa il setup
//le 2 callback (onSelezioneDifficolta e onRiprendiSessione) le passa il main
export function inizializzaSchermataDifficolta(onSelezionaDifficolta, onRiprendiSessione) {
    // se ho già fatto il setup esco subito,sennò raddoppio i listener
    if(schermataInizializzata) return;

    //prendo tutti i bottoni con classe btn.difficolta e il bottone riprendi
    const bottoniDifficolta = document.querySelectorAll(".btn-difficolta");
    const btnRiprendiSessione = document.getElementById("btnRiprendiSessione");
    const bloccoTimerLibera = document.getElementById("bloccoTimerLibera");
    const inputTimerLibera = document.getElementById("inputTimerLibera");

    function mostraTimerLibera() {
        if (!bloccoTimerLibera) return;

        bloccoTimerLibera.classList.add("visibile");
    }

    function nascondiTimerLiberaSeVuoto() {
        if (!bloccoTimerLibera || !inputTimerLibera) return;

        //se l'utente ha scritto un timer,non lo nascondo
        if (inputTimerLibera.value.trim() !== "") {
            return;
        }

        bloccoTimerLibera.classList.remove("visibile");
    }

    // per ogni bottone leggo il nome dak data-difficolta e riempio il contenuto
    bottoniDifficolta.forEach(function(bottone) {

        const nome = bottone.dataset.difficolta;
        const config = difficolta[nome];

        //non succede,ma se succede che qualcuno dalla console o dall'html mette  metto un nome che non esiste,salto il bottone
        if (!config) return;
        const nomeElemento = bottone.querySelector(".nome-difficolta");
        const metaElemento = bottone.querySelector(".meta-difficolta");
    
        //riempio i 2 span dentro al bottone,così non lo scrivo a mano nell'html,e se
        if (nomeElemento) {
            nomeElemento.textContent = config.etichetta;
        }
        if(metaElemento) {
            metaElemento.textContent = getMetaDifficolta(config);
        }
        //se passo sopra sulla modalità libera, mostro il timer personalizzato
        if (nome === "libera") {
            bottone.addEventListener("mouseenter", mostraTimerLibera);
            bottone.addEventListener("focus", mostraTimerLibera);
        } else {
            bottone.addEventListener("mouseenter", nascondiTimerLiberaSeVuoto);
            bottone.addEventListener("focus", nascondiTimerLiberaSeVuoto);
        }
        //al click callo la callback del main passandogli il nome,poi il main fa il lavoro sporco tipo salvare , nascondere la schermata,ste robe così
        bottone.addEventListener("click", function() {
            onSelezionaDifficolta(nome);
        });
    });

    if (inputTimerLibera)  {
        inputTimerLibera.addEventListener("focus", mostraTimerLibera);

        inputTimerLibera.addEventListener.addEventListener("input", function () {
            if (inputTimerLibera.value.trim() !== "") {
                mostraTimerLibera();
            }
        });
    }
    // il bottone riprendi lo aggancio solo se esiste
    if (btnRiprendiSessione) {
        btnRiprendiSessione.addEventListener("click",function() {
            onRiprendiSessione();
        });
    }

    //questo e come segno che ho gia inizializzato,così la prossima volta esce subito da qua
    schermataInizializzata = true;
}

//ora manca la funzione che fa apparire la schermata
//i parametri hanno di default i default,se non glieli passi fa finta che non ci sia uan sessione
export function mostraSchermataDifficolta(haSessioneSalvata = false,nomeDifficoltaSessione = "normale") {
    const overlay = document.getElementById("overlaySchermataDifficolta");
    const bloccoRiprendi = document.getElementById("bloccoRiprendiSessione");
    const btnRiprendiSessione = document.getElementById("btnRiprendiSessione");

    // controllo difensivo ,se manca uno dei degli elemneti esco
    if (!overlay || !bloccoRiprendi || !btnRiprendiSessione) return;

    //cosa importante, se c'è una sessione vecchia salvata,faccio comparire il boottone riprendi,per continuare
    if(haSessioneSalvata) {
        bloccoRiprendi.classList.add("visibile");
        btnRiprendiSessione.textContent = `Riprendi sessione (${getEtichettaDifficolta(nomeDifficoltaSessione)})`;
    } else {
        //altrimenti lo nascondo e svuoto il testo
        bloccoRiprendi.classList.remove("visibile");
        btnRiprendiSessione.textContent = "";
    }
    overlay.classList.add("visibile");
}

//funzione gemella a quella sopra,pero questa la spegne
export function nascondiSchermataDifficolta() {
    const overlay = document.getElementById("overlaySchermataDifficolta");
    if(!overlay) return;
    overlay.classList.remove("visibile")
}