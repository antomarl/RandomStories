// questo modulo gestisce il comportamento della textarea: overflow del testo,salvataggio pagina,cambio pagina ecc

export function inizializzaTextarea(config) {
    const {
        textareaSx,
        textareaDx,
        pagine,
        getPaginaCorrente,
        setPaginaCorrente,
        salvaPaginaCorrente,
        aggiornaIndicatorePagina,
        gestisciValidazioneStoria,
    } = config;

    textareaSx.addEventListener("input", function() {
        if(this.scrollHeight > this.clientHeight) {
            let testoExtra = ""; // dato che potrebbero esserci frase lunghe,taglio così va a destra
            while(this.scrollHeight > this.clientHeight && this.value.length > 0) {
                testoExtra = this.value.charAt(this.value.length - 1) + testoExtra;
                this.value = this.value.substring(0, this.value.length - 1);
            }

            textareaDx.value = testoExtra + textareaDx.value;
            textareaDx.focus();
            textareaDx.setSelectionRange(testoExtra.length, testoExtra.length);
        }

        salvaPaginaCorrente(pagine, getPaginaCorrente());
        aggiornaIndicatorePagina(getPaginaCorrente(), pagine);
        gestisciValidazioneStoria();
    });
}
