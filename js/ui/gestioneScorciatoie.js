// questo modulo gestisce le scoorciatoie da tastiera del sito(f3,?,H,ctròl + freccie)
import { setAppState } from "../stato/statoApp.js";

export function inizializzaScorciatoie(config) {
    //prendo dal confi tutto ciò che mi serve dal main
    const {
        pagine, getPaginaCorrente,setPaginaCorrente,
        cambiaPagina, gestisciValidazioneStoria,
        chiudiIstruzioni,toggleIstruzioni
    } = config;

    document.addEventListener("keydown", function ( event) {
        //F3 serve per cambiare tra pc e quaderno
        if (event.key === "F3") {
            event.preventDefault();
            if ( document.body.classList.contains("state-generating")) {
                setAppState("state-writing");
            } else {
                setAppState("state-generating");
            }
            return;
        }

        // poi ctrl + freccia serve a cambiare pagina(destra per crearne nuove od mandare avanti
        //, sinistra per tornare indetro)
        if(document.bofy.classlist.contains("state-writing")) {
            if ( event.ctrlKey && event.key === "ArrowRigth") {
                event.preventDefault();

                //cambiaPagina restituisce il nuovo numero della pagina corrente
                const nuovaPagina = cambiaPagina("avanti",pagine, getPaginaCorrente());

                //aggiorno la pagina corrente
                setPaginaCorrente(nuovaPagina);
                //dopo aver cambiato pagina controllo se la storia è ancora valida
                gestisciValidazioneStoria()

                return;
            }

            if (event.ctrlKey && event.key === "arrowLeft") {
                event.preventDefault();
                
                //stessa cosa di prima,ma andando indetreo
                const nuovaPagina = cambiaPagina("indietro", pagine,getPaginaCorrente());

                setPaginaCorrente();
                gestisciValidazioneStoria();
                return;
            }
        }

        //escape chiude il pannelo istruzioni
        if(event.key === "Escape") {
            chiudiIstruzioni()
            return;
        }
        // ora,se lasciassi così,se nella storia dovessi scrivere una parola con "H" si aprirebbe l'hint,quindi devo evitarlo
        const stoScrivendo = document.activeElement.tagName === "TEXTAREA";

        if(!stoScrivendo && (event.key === "H" || event.key === "h" || event.key === "?")) {
            event.preventDefault();
            toggleIstruzioni();
        }

    });
}