//questo modulo collega i bottoni dell'interfaccia alle loro funzioni
// los to facendo in modo da liberare il main da tutti questi pulsant

export function inizializzaBottoniUI(config) {
    const {
        btnIstruzioni,
        overlayIstruzioni,
        btnChiudiIstruzioni,
        coloreTema,
        badgeDifficolta,
        btnGameOverRicomincia,
        btnVittoriaRicomincia,
        btnVittoriaModalita,
        overlayVittoria,
        toggleIstruzioni,
        chiudiIstruzioni,
        cambiaTema,
        cambiaModalita,
        resetTotaleEApriSchermata,
        resetSessione,
        iniziaGioco
    } = config;

    // bottone con il punto interrogativo: apre e chiude le istruzioni
    btnIstruzioni.addEventListener("click",toggleIstruzioni);
    //se clicco fuori dal pannello iastruzioni,chiudo tutto
    overlayIstruzioni.addEventListener("click",chiudiIstruzioni);
    //se si clicca x si esce
    btnChiudiIstruzioni.addEventListener("click", chiudiIstruzioni);
    //bottone per cambiare tema(chiaro/scuro)
    coloreTema.addEventListener("click",cambiaTema);
    //bottone per cambiare la difficoltà
    badgeDifficolta.addEventListener("click", cambiaModalita);
    //bottone del game over che resetta tutto e torna alla scelta difficolta
    btnGameOverRicomincia.addEventListener("click",resetTotaleEApriSchermata);
    //bottone per la vittoria che ricomicnia con la stessa modalità,per ora solo inferno,in futuro chissaòà
    btnVittoriaRicomincia.addEventListener("click", function(){
        overlayVittoria.classList.remove("visibile");
        resetSessione();
        iniziaGioco();
    });
    //ora quello per cambiare modalità
    btnVittoriaModalita.addEventListener("click",function () {
        overlayVittoria.classList.remove("visibile");
        resetTotaleEApriSchermata();
    });

}