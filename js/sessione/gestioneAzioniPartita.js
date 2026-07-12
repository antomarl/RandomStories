// in questo modulo gestisce i bottoni principali della partita
// quindi considero genera parola, reset parole , salva storia e nuova sessione

import { setAppState } from "../stato/statoApp.js";
import { getDifficoltaAttiva, getNomeDifficoltaAttiva } from "../stato/difficoltaAttiva.js";

export function inizializzaAzioniPartita(config) {
    // utilizzo sempre config 
    const {
        btnGeneraParola,
        btnResetParole,
        btnSalva,
        btNuovaSessione,
        getPagine,
        getParoleGenerate,
        getPaginaCorrente,
        getNumeroParole,
        getParoleRareTrovate,
        getContatoreRareTotale,
        setNumeroParole,
        setContatoreRareTotale,
        setPaginaCorrente,
        gestisciValidazioneStoria,
        calcolaStatistichePartita,
        generaParola,
        resetParole,
        salvaStoria,
        nuovaSessione,
        mostraMessaggioPc,
        resetStatistiche,
        pulisciMessaggioPC,
        scatenaVittoria
    } = config;

    //bottone per generare una parola
    btnGeneraParola.addEventListener("click", function () {
        // quando genero parole ritorno alla schermata del pc
        setAppState("state-generating");
        
        const risultato = generaParola(
            getParoleGenerate(),
            getNumeroParole(),
            getParoleRareTrovate(),
            getContatoreRareTotale(),
            gestisciValidazioneStoria
        );

        // se il modulo generaParola mi restituisce dei dati nuovi,aggirono il main
        if (risultato) {
            setNumeroParole(risultato.numeroParole);
            setContatoreRareTotale(risultato.contatoreRareTotale);
        }
    });

    //ora il bottone reset parole,per resettare solamente le parole rìgenerate dalò pc
    btnResetParole.addEventListener("click", function () {
        //come priam ritorno allo stato di generazione
        setAppState("state-generating");

        const risultato = resetParole(
            getParoleGenerate(),
            getDifficoltaAttiva().paroleMassime,
            gestisciValidazioneStoria
        )
        //giustamente restituisce il nuvo numero di parole
        if ( risultato) {
            setNumeroParole(risultato.numeroParole);
        }
    });

    //ora il bottone per salvare la storia
    btnSalva.addEventListener("click", function() {
        const salvata = salvaStoria(
            getPagine(),
            getPaginaCorrente(),
            gestisciValidazioneStoria,
            mostraMessaggioPc,
            getParoleGenerate(),
            getNomeDifficoltaAttiva()
        );

        if (!salvata) {
            return;
        }

        const statistiche = calcolaStatistichePartita();

        if (getNomeDifficoltaAttiva() === "inferno") {
            scatenaVittoria(statistiche, "inferno superato")
        } else {
            scatenaVittoria(statistiche, "storia completata");
        }

        localStorage.removeItem("randomStories_sessione");
    });
        //bottone nuova sessione, anche se non so se tenerlo,perchè è molto simile a modlità,quindi vediamo,non so
    btNuovaSessione.addEventListener("click", async function () {
        const risultato = await nuovaSessione(
            getParoleGenerate(),
            getNumeroParole(),
            getPagine(),
            getPaginaCorrente(),
            getDifficoltaAttiva().paroleMassime,
            resetStatistiche,
            pulisciMessaggioPC
        );
        //aggiorno i valori nel main se nuovaSession ha restituito qualcosa
        if ( risultato) {
            setNumeroParole(risultato.numeroParole);
            setPaginaCorrente(risultato.paginaCorrente);
        }
    });
}