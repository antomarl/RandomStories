// questa funzione serve a salvare il contenuto attuale della textarea nella pagina corrente dell'array pagine

export function salvaPaginaCorrente( pagine, paginaCorrente ) {
    pagine[paginaCorrente].sx = document.getElementById("storyInputSx").value;
    pagine[paginaCorrente].dx = document.getElementById("storyInputDx").value;
}