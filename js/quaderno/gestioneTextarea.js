// questo modulo gestisce il comportamento della textarea: overflow del testo,salvataggio pagina,cambio pagina ecc

import { setAppState } from "../stato/statoApp.js";

export function inizializzaTextarea(config) {
    const {
        textareaSx,
        textareaDx,
        pagine,
        indicatorePagina,
        getPaginaCorrente,
        setPaginaCorrente,
        salvaPaginaCorrente,
        aggiornaIndicatorePagina,
        gestisciValidazioneStoria,
    } = config;

    //quando clicco nella textarea di sinistra, l'app capisce che sto scrivendo
    textareaSx.addEventListener("focus", function() {
        setAppState("state-writing");
    });

    textareaDx.addEventListener("focus",function() {
        setAppState("state-writing");
    });

    textareaSx.addEventListener("input", function() {
        if(this.scrollHeight > this.clientHeight) {
            let testoExtra = ""; // dato che potrebbero esserci frase lunghe,taglio così va a destra
            while(this.scrollHeight > this.clientHeight && this.value.length > 0) {
                testoExtra = this.value.charAt(this.value.length - 1) + testoExtra;
                this.value = this.value.substring(0, this.value.length - 1);
            }

            // il testo che non entra a sinistra viene messo all'inizio della textarea di destra
            textareaDx.value = testoExtra + textareaDx.value;
            // e sposto il focus a destra
            textareaDx.focus();
            textareaDx.setSelectionRange(testoExtra.length, testoExtra.length);
        }
        //salvo la pagina corrente
        salvaPaginaCorrente(pagine, getPaginaCorrente());
        //aggiorno la scritta delle pagine
        aggiornaIndicatorePagina(getPaginaCorrente(), pagine);
        //e controllo se la storia è valida
        gestisciValidazioneStoria();
    });

    //ora devo gestire la textarea di destr<
    textareaDx.addEventListener("input", function () {
        //se anche la parte destra è piena,fermo il testo e avviso di cliccare ctrl + freccia per cambauire pagina
        if(this.scrollHeight > this.clientHeight) {
            while (this.scrollHeight > this.clientHeight && this.value.length > 0) {
                this.value = this.value.substring(0, this.value.length - 1);
            }

            //quì, a differenza di prima non uso getElementByID perc hè l'elemento me lo passa il main
            indicatorePagina.textContent = "pagina " + (getPaginaCorrente() + 1) + " - Piena! Premi ctrl + freccia destra per continuare";
            indicatorePagina.style.color = "red";
        } else {
            // se invece non è piena,agggiorno normalmente l'indicatore
            aggiornaIndicatorePagina(getPaginaCorrente(), pagine);
        }
        //salvo sempre dopo ogni partita
        salvaPaginaCorrente(pagine, getPaginaCorrente());

        // ricontrollo la validità della storia
        gestisciValidazioneStoria();
    });

    //qua ora devo inserire il backspace nella testarea di destra,ovvero, se cancello a destra tutto mi riporta a sinistra pure
    textareaDx.addEventListener("keydown", function (event) {
        if(event.key === "Backspace" && this.selectionStart === 0 && this.selectionEnd === 0) {
            event.preventDefault();

            //se a destra c'è testo,lo riattacco alla fine della pagina sinistra
            if(this.value.length > 0) {
                textareaSx.value = textareaSx.value + this.value;
                this.value = "";

                //e salvo,perchè qua sto modificando entrambe le textarea
                salvaPaginaCorrente(pagine, getPaginaCorrente());
            }

            //riporto il focus a sinistra
            textareaSx.focus();

            //metto il cursore alla fine del testo sinistroù
            const lunghezza = textareaSx.value.length;
            textareaSx.setSelectionRange(lunghezza, lunghezza)
        }
    });
}
