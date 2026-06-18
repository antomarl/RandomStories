//questa credo sia una delle funzioni più importanti dell'intero file ,e proprio per questo l'ho lasciataa
// per ultima,ci vorra un po',lo so,e probabilmente ci saranno errori,ma non c'è sconfitta b nel cuori di chi lotta
//quan si vedrà la differenza tra gli uomini e i ragazzini
// btw quesa funzione genera una parola casuale(normale o rara),la aggiunge alla lista,aggiorna UI e cintatori,e gestisce gli effetti speciali
// vamos
import { getDifficoltaAttiva } from "../stato/difficoltaAttiva.js";
import {paroleDisponibili,paroleRare } from "./paroleLista.js";
import { mostraMessaggioPc } from "../ui/terminale.js";
import { scatenaEffettiRari } from "../effetti/flashRaro.js";
import { attivaGlitchPC } from "../effetti/glitch.js";
import { aggiornaListaParole } from "./listaParole.js";
import { aggiornaContatoreRare } from "./contatoreParole.js";

export function generaParola(paroleGenerate, numeroParole, parolerareTrovate,contatoreRareTotale, validaStoria) {
    // leggo la difficoltà messa ad ogni chiamata
    // in questo modo,se l'utente cambia modalità a metà partita,cambia instant(big brain)
    const { paroleMassime, probabilitaRara } = getDifficoltaAttiva();
    // intanto dobbiamo bloccare la generazione delle parole se si raggiunge il limite massimo(per ora 190)
    if (numeroParole >= paroleMassime) {
        mostraMessaggioPc("> Limite raggiunto: " + paroleMassime + "/" + paroleMassime + " parole generate,ora premi F3 per iniziare a scrivere!","avviso");
        return {numeroParole, contatoreRareTotale};
    }

    //ora si deve decidere se la parola che uscirà sarà rara o meno
    //tiro un numero da 0 a (probabilitaRara - 1)
    //ora se esce 0 sarà rara,in questo modo c'è una possibbilità su 20,

    const tiroRaro = Math.floor(Math.random()* probabilitaRara);
    const esceRara = (tiroRaro === 0);

    let parolaGenerata;
    let rara = false;

    if (esceRara) {
        //pesco una parola rara dalla lista speciale
        const indiceRaro = Math.floor(Math.random()* paroleRare.length);
        parolaGenerata = paroleRare[indiceRaro];
        rara = true;
    } else {
        // pesco una parola normale
        const indiceRandom = Math.floor(Math.random()*paroleDisponibili.length);
        parolaGenerata = paroleDisponibili[indiceRandom];
    }

    // se la parola è gia stata generata in questa sessione,eseguo una chiamata ricorsiva(la funzione richiama se stessa)
    if (paroleGenerate.includes(parolaGenerata)) {
        return generaParola(paroleGenerate, numeroParole, parolerareTrovate, contatoreRareTotale, validaStoria);
    }

    // ora aggiungo la parola alla lista( modifico array per riferimento,così il main lo vede)
    paroleGenerate.push(parolaGenerata);
    numeroParole++;

    //qua devo far scattare gli effetti per le parole rare
    if (rara) {
        scatenaEffettiRari(parolaGenerata);

        //inoltre se è la prima volta che esce questa parola rara,la salvo per sempre (serve per il contatore
        if (!parolerareTrovate.includes(parolaGenerata)) {
            parolerareTrovate.push(parolaGenerata);
            localStorage.setItem("randomStories_rareTrovate",JSON.stringify(parolerareTrovate));
        }
        // incremento il contatore di rare trovate totali
        contatoreRareTotale++;
        localStorage.setItem("randomStories_contatoreRare",contatoreRareTotale.toString());
        aggiornaContatoreRare(contatoreRareTotale);
    }

    //aggiorno la UI con la lista parole
    aggiornaListaParole(paroleGenerate, paroleRare);

    // aggiorno il contatore parole GEnerate
    document.getElementById("contatoreParole").textContent = "Parole generate: " + numeroParole + "/" + paroleMassime;
    //ora qua il messaggi nel terminale sarà diverso in base a se la parola è rara o meno
    if (rara) {
        mostraMessaggioPc("Parola rara sbloccata: \"" + parolaGenerata + "\" :)","successo");
    } else {
        mostraMessaggioPc("> Parola aggiunta: \"" + parolaGenerata + "\"","successo");
    }

    // ora easterEgg per il mio amico sebywlan/iano/l'elettriko di windows/sebbista
    if (parolaGenerata === "elektrowindows") {
        attivaGlitchPC();
    }

    // dopo aver aggiunto la parola,ovviamente bisogna essere di nuovo validata
    validaStoria();

    //restituisco i valori aggiornati(l'array no perchè si aggiorna da solo per riferimento)
    return { numeroParole, contatoreRareTotale};

}