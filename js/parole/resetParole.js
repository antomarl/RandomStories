// qu3sta funzione serev a resettare le parole generate ma NON il quaderno,e non richiede conferma
// mentre vedevo ho notato che sono stupido,perchè nuovaSessione e resetParole fanno la stessa identica cosa,mi ricprdavo
//che reset parole non togliesse il testo,ma invece si,queindi adesso oltre la refactoring volgio sistemare quasta cosa
//cioè reset parole resetta solo le parole generate
import {pulisciMessaggioPC } from "../ui/terminale.js";

export function resetParole( paroleGenerate, paroleMassime, validaStoria) {
    //svuotiamo l'array delle parole generate
    paroleGenerate.length = 0;

    //puliamo la lista delle parole nel pannelloù
    document.getElementById("listaParole").innerHTML = "";

    // e resettiamo il contatore delle aprole generate
    document.getElementById("contatoreParole").textContent = "parole generate: 0/" + paroleMassime;

    //puliamo il terminale del pc
    pulisciMessaggioPC();

    //ora bisogna rivalidare la storia(perchè il testo rimane,ma ora non ha piu parole obbligatorie da contenetre)
    validaStoria();

    //restituiamo il nuovo numeroParole al mainframe

    return { numeroParole : 0 };
}