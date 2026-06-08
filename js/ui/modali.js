// qua dentro inserirò la funzione mostraConferma,che compare quando clicchi il bottone nuova sessione

export function mostraConferma(titolo, messaggio) {
    return new Promise(function(resolve) {
        const overlay = document.getElementById("overlayConferma");
        const modal = document.getElementById("modalConferma");
        const titoloEl = document.getElementById("modalConfermaTitolo");
        const messaggioEl = document.getElementById("modalConfermaMessaggio");
        const btnOk = document.getElementById("modalConfermaOk");
        const btnAnnulla = document.getElementById("modalConfermaAnnulla");

        titoloEl.textContent = titolo;
        messaggioEl.textContent = messaggio;

        overlay.classList.add("visibile");
        modal.classList.add("visibile");

        function chiudi(risposta) {
            overlay.classList.remove("visibile");
            modal.classList.remove("visibile");

            btnOk.removeEventListener("click", clickOk);
            btnAnnulla.removeEventListener("click", clickAnnulla);

            overlay.removeEventListener("click", clickAnnulla);

            document.removeEventListener("keydown", keydown);

            resolve(risposta)
        }

        function clickOk() {
            chiudi(true);
        }

        function clickAnnulla() {
            chiudi(false);
        }

        function keydown(e) {
            if (e.key === "Escape") {
                chiudi(false);
            }

            if (e.key === "Enter") {
                chiudi(true);
            }
        }

        btnOk.addEventListener("click", clickOk);
        btnAnnulla.addEventListener("click", clickAnnulla);
        overlay.addEventListener("click", clickAnnulla);
        document.addEventListener("keydown", keydown);
    });
}