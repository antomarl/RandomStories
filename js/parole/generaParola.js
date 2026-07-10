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

//ora devo fare una cosa,voglio ottimizzare meglio la questione relativa alla generazione delle parole
//perchè,soprattuto nella modalità libera, c'è il rischio che si possa creare qualche bug,perchè
//ora come ora, pesca a caso,e se becca un doppione ritorna indietro(la funzione ricorsiva), e quindi può diventatre pesante poi se uno ne genera 100

function pescaParolaCasuale(lista) {
    const indice = Math.floor(Math.random() * lista.length);
    return lista[indice];
}

function filtraParoleNonGenerate(listaParole, paroleGenerate) {
    const paroleGiaGenerate = new Set(paroleGenerate);
    return listaParole.filter(function (parola) {
        return !paroleGiaGenerate.has(parola);
    });
}

export function generaParola(paroleGenerate, numeroParole, parolerareTrovate,contatoreRareTotale, validaStoriaCallback) {
    // leggo la difficoltà messa ad ogni chiamata
    // in questo modo,se l'utente cambia modalità a metà partita,cambia instant(big brain)
    const { paroleMassime, probabilitaRara } = getDifficoltaAttiva();

    contatoreRareTotale = Number(contatoreRareTotale);

    if (Number.isNaN(contatoreRareTotale)) {
        contatoreRareTotale = 0;
    }

    // intanto dobbiamo bloccare la generazione delle parole se si raggiunge il limite massimo(per ora 190)
    if (numeroParole >= paroleMassime) {
        mostraMessaggioPc("> Limite raggiunto: " + paroleMassime + "/" + paroleMassime + " parole generate,ora premi F3 per iniziare a scrivere!","avviso");
        return {numeroParole, contatoreRareTotale};
    }
    //preparo solo le parole che non sono anjcora uscite
    const paroleNormaliDisponibili = filtraParoleNonGenerate(paroleDisponibili, paroleGenerate);
    const paroleRareDisponibili = filtraParoleNonGenerate(paroleRare, paroleGenerate);

    //se non ci sono più pasrole disponibili mi fermo
    if (paroleNormaliDisponibili.length === 0 && paroleRareDisponibili.length === 0) {
        mostraMessaggioPc("> Non ci sono più parole disponibili da generare.","avviso");
        return {numeroParole,contatoreRareTotale};
    }

    // qua decido se provasre a fare uscire una rara
    const tiroRaro = Math.floor(Math.random() * probabilitaRara);
    const dovrebbeUscireRara = tiroRaro === 0;

    let parolaGenerata;
    let rara = false;

    //ora, se dovesse uscire rara E ci sono rare disponibili,ne pesca una rara
    if (dovrebbeUscireRara && paroleRareDisponibili.length > 0) {
        parolaGenerata = pescaParolaCasuale(paroleRareDisponibili);
        rara = true;
        // metre se dovessero essere finite la parole normali ma ne rimangoino rare,faccio uscire per forza una rara
    } else if (paroleNormaliDisponibili.length === 0 && paroleRareDisponibili.length > 0) {
        parolaGenerata = pescaParolaCasuale(paroleRareDisponibili);
        rara = true;

        //altrimenti,pesco una carta normale nel chill
    } else {
        parolaGenerata = pescaParolaCasuale(paroleNormaliDisponibili);
    }

    //cosi ora invece di prima le parole già usate vengono tolte,senza ricorsioni
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
    if (typeof validaStoriaCallback === "function") {
        validaStoriaCallback();
    }

    //restituisco i valori aggiornati(l'array no perchè si aggiorna da solo per riferimento)
    return { numeroParole, contatoreRareTotale};

}