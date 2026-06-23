// questo modulo gestisce il cambio pagina del quaderno (con ctrl -  freccia destra/sinistra)
//sto impazzendoiooo
export function cambiaPagina(direzione,pagine,paginaCorrente) {
    // prima di tutto salviamo il contenuto attuale della pagina prima di cambiarla
    pagine[paginaCorrente].sx = document.getElementById("storyInputSx").value;
    pagine[paginaCorrente].dx = document.getElementById("storyInputDx").value;

    //qua sotto c'è tutta la logica della navigazione
    if (direzione === "avanti") {
        paginaCorrente++;

        //se non esiste,crea una nuova pagina vuota
        if (paginaCorrente >= pagine.length) {
            pagine.push({sx : "", dx : ""});
        }
    } else if (direzione === "indietro") {
        if (paginaCorrente > 0) {
            paginaCorrente--;
        } else {
            //allora siamo già a pagina 1
            return paginaCorrente;
        }
    }


    //mostra il contenuto della nuova pagina
    document.getElementById("storyInputSx").value = pagine[paginaCorrente].sx;
    document.getElementById("storyInputDx").value = pagine[paginaCorrente].dx;

    document.getElementById("indicatorePagina").textContent = "Pagina " + (paginaCorrente + 1) + " di " + pagine.length;

    //mettiamo il focus sulla textarea di sinistra
    const textareaSx = document.getElementById("storyInputSx");
    textareaSx.focus();

    textareaSx.setSelectionRange(textareaSx.value.length, textareaSx.value.length);
    //rivalida la storia

    //ritorna la nuova pagina corrente
    return paginaCorrente;
}