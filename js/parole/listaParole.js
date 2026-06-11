//questo modulo gestisce la visualizzazzione delle parole generate nel terminale,
//ed evidenzia le parole rare

export function aggiornaListaParole( paroleGenerate, paroleRare) {
    const lista = document.getElementById("listaParole");

    const htmlParole = paroleGenerate.map(function(parola) {
        if(paroleRare.includes(parola)) {
            return ("<span class='parola-rara'>" + parola + "</span>");
        } else {
            return parola;
        }
    });

    lista.innerHTML = htmlParole.join(", ");
}