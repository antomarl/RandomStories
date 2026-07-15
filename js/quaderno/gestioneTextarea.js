// questo modulo gestisce il comportamento della textarea: overflow del testo,salvataggio pagina,cambio pagina ecc

import { setAppState } from "../stato/statoApp.js";

export function inizializzaTextarea(config) {
    const {
        textareaSx,
        textareaDx,
        getPagine,
        indicatorePagina,
        getPaginaCorrente,
        aggiornaIndicatorePagina,
        gestisciValidazioneStoria,
    } = config;

    function aggiornaPaginaCorrente() {
        const pagine = getPagine();
        const paginaCorrente = getPaginaCorrente();
        if (pagine.length === 0) {
            pagine.push({ sx: "", dx: ""});
        }

        if (!pagine[paginaCorrente]) {
            pagine[paginaCorrente] = { sx: "", dx: ""};
        }

        // ora qui salvo subito  quello che c'è nella textarea dentro l'array pagine
        pagine[paginaCorrente].sx = textareaSx.value;
        pagine[paginaCorrente].dx = textareaDx.value;

        aggiornaIndicatorePagina(paginaCorrente, pagine);
        gestisciValidazioneStoria();
    }

    // quandp clicco nella textarea di sinistra,l'appdeve capire che sto sciverno,ed anche per ola destra
    textareaSx.addEventListener("focus", function () {
        setAppState("state-writing");
    });

    textareaDx.addEventListener("focus", function () {
        setAppState("state-writing");
    });

    textareaSx.addEventListener("input", function () {
        if (this.scrollHeight > this.clientHeight) {
            let testoExtra = "";

            while (this.scrollHeight > this.clientHeight && this.value.length > 0) {
                testoExtra = this.value.charAt(this.value.length - 1) + testoExtra;
                this.value = this.value.substring(0, this.value.length - 1);
            }

            textareaDx.value = testoExtra + textareaDx.value;
            textareaDx.focus();
            textareaDx.setSelectionRange(testoExtra.length, testoExtra.length);
        }

        aggiornaPaginaCorrente();
    });
    textareaDx.addEventListener("input", function () {
        if (this.scrollHeight > this.clientHeight) {
            while (this.scrollHeight > this.clientHeight && this.value.length > 0) {
                this.value = this.value.substring(0, this.value.length - 1);
            }

            indicatorePagina.textContent = "Pagina " + (getPaginaCorrente() + 1) + "piena!  premi ctrl + freccia destra per continuare";
            indicatorePagina.style.color = "red";
        } else {
            aggiornaPaginaCorrente();
            return;
        }

        aggiornaPaginaCorrente();

    });

    textareaDx.addEventListener("keydown", function (event) {
        if (event.key === "Backspace" && this.selectionStar === 0 && this.selectionEnd === 0) {
            event.preventDefault();

            if(this.value.length > 0) {
                textareaSx.value = textareaSx.value + this.value;
                this.value = "";

                aggiornaPaginaCorrente();
            }

            textareaSx.focus();

            const lunghezza = textareaSx.value.length;
            textareaSx.setSelectionRange(lunghezza, lunghezza);
        }
    });
}