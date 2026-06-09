// qua metto i messaggi temporanei che compaiono in alto al sito,per adesso c'è solo quello 
// che mostra se la sessione viene repristinata o se se ne crea una nuova sessione

export function MMR(testo) {
    const msg = document.getElementById("messaggioRipristino");

    msg.textContent = testo;

    msg.classList.add("visibile")

    setTimeout(function() {
        msg.classList.remove("visibile");
    }, 3000);
}