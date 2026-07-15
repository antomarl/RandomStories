// questo modulo gestisce il cambio pagina del quaderno (con ctrl -  freccia destra/sinistra)
//sto impazzendoiooo
export function cambiaPagina(direzione,pagine,paginaCorrente) {
    const textareaSx = document.getElementById("storyInputSx");
    const textareaDx = document.getElementById("storyInputDx");
    const indicatorePagina = document.getElementById("indicatorePagina");

    //se per qualche motivo pagine non è un array,evito di sminchiare tutto
    if (!Array.isArray(pagine)) {
        console.error("ERRORE : pagine non è un array");
        return 0;
    }


    //se l'array è vuoto ,creo almeno pagina 1
    if (pagine.length === 0) {
        pagine.push[{ sx: "", dx: ""}];
        paginaCorrente = 0;
    }

    // se paginaCorrente punta ad una pagina inestistente la creo
    if (!pagine[paginaCorrente]) {
        pagine[paginaCorrente] = { sx: "", dx: ""}
    }

    //salvo la pagina attuale prima di cambiare
    pagine[paginaCorrente].sx = textareaSx.value;
    pagine[paginaCorrente].dx = textareaDx.value;

    if (direzione === "avanti") {
        paginaCorrente++;

        if(!pagine[paginaCorrente]) {
            pagine[paginaCorrente] = { sx: "", dx: ""};
        }
    } else if (direzione === "indietro") {
        if (paginaCorrente > 0) {
            paginaCorrente--;
        }
    }

    //mostro la nuova pagina
    textareaSx.value = pagine[paginaCorrente].sx || "";
    textareaDx.value = pagine[paginaCorrente].dx || "";

    indicatorePagina.textContent = "Pagina " + (paginaCorrente + 1) + " di " + pagine.length;
    indicatorePagina.style.color = "";

    textareaSx.focus();
    textareaSx.setSelectionRange(textareaSx.value.length, textareaSx.value.length);

    return paginaCorrente;   
}