import { mostraConferma } from "../ui/modali.js";
import { MMR } from "../ui/messaggi.js";

 // ora devo fare una delle funzioni più difficili fatte finora, nuovaSessione,richiede
 // molte variabili da fuori,poi usa 2 funzioni gia scritte in altre zone e che ho dovuto imporatre
 //speriamo bene

export async function nuovaSessione ( paroleGenerate, numeroParole, pagine , paginaCorrente, paroleMassime, resetStatistiche, pulisciMessaggioPC) {
    const conferma = await mostraConferma("Nuova sessione","Sicuro di voler iniziare una nuova sessione? Perderai TUTTO il lavoro attuale!");

    if(!conferma) {
        return  null;
    }

    localStorage.removeItem("randomStories_sessione")

    paroleGenerate.length = 0;
    numeroParole = 0;
    
    pagine.length = 0;

    pagine.push({sx: "", dx:""});

    paginaCorrente = 0;

    document.getElementById("storyInputSx").value = "";
    document.getElementById("storyInputDx").value = "";
    document.getElementById("listaParole").innerHTML = "";
    document.getElementById("contatoreParole").textContent = "Parole generate: 0/" + paroleMassime;
    document.getElementById("indicatorePagina").textContent = "Pagina 1";
    document.getElementById("messaggioErrore").innerHTML = "";
    document.getElementById("btnSalva").disabled = true;

    pulisciMessaggioPC();

    MMR("nuova Sessione iniziata");

    resetStatistiche(pagine);

    return { numeroParole, paginaCorrente };
}