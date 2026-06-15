// questa funzione aggiorna il testo sopra il quaderno che elenca le pagine,il contatore praticamente

export function aggiornaIndicatorePagina(paginaCorrente,pagine) {
    const indicatore = document.getElementById("indicatorePagina");

    indicatore.textContent = "pagina " + (paginaCorrente + 1 ) + " di " + pagine.length;
    indicatore.style.color = "#6b4a2f";
    
}