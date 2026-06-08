// qua dentro inserirò la funzione mostraConferma,che compare quando clicchi il bottone nuova sessione

export function mostraConferma(titolo, messaggio) {
    return new Promise(function(resolve) {
        const overlay = document.getElementById("overlayConferma");
        const modal = document.getElementById("modalConferma");
        const titoloEl = document.getElementById("modalConfermasTitolo");
        const messaggioEl = document.getElementById("modalConfermaMessaggio");
        const btnOk = document.getElementById("modalConferma");
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

            document.getElementBy
        }
    })
}