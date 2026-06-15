//mostra nel terminale le parole generate oppure avvisa se non è stata generata nessuna parola
// mi sono appena reso conto che nel main non vien MAI chiamata,quiendi è inutile,codice morto,non so se tenerlo per farlo funzionare in futuro,vabbe ormai per ora lo lascio
import { mostraMessaggioPc } from "../ui/terminale.js";

export function mostraParole(paroleGenerate) {
    if (paroleGenerate.length === 0) {
        mostraMessaggioPc("Nessuna parola generate.." + "Clicca su 'genera parola' per iniziare!","avviso");
    } else {
        mostraMessaggioPc("> Parole generate: " + paroleGenerate.join(", "), "successo");
    }
}