// qua dentro metterò la funzione salvaStoria,che se la storia è valida te lo 
//trasforma come un file .txt

export function salvaStoria( pagine,paginaCorrente, ValidaStoria , mostraMessaggioPc) {
    //intanto controlliamo se la storia è valida

    if(!ValidaStoria()) {
        return false;
    }

    //salva il testo della pagina attuale
    pagine[paginaCorrente].sx = document.getElementById("storyInputSx").value;
    pagine[paginaCorrente].dx = document.getElementById("storyInputDx").value;

    let storiaCompleta = "";

    //ora cpstruiamo il testo finale con tutte le pagine
    for (let i = 0; i < pagine.length; i++) {
        storiaCompleta += "=== Pagina " + (i+1) + "===\n";

        storiaCompleta += pagine[i].sx + " " + pagine[i].dx + "\n\n";
    }

    //ora devo impedire che si possa salvare una storia vuota

    if (storiaCompleta.trim() === "") {
        mostraMessaggioPc("> Errore: la storia è vuota!", "errore");

        return false;
    }

    //ora creiamo il file .txt (il blobazzo)
    const blob = new Blob([storiaCompleta], { type : "text/plain;charset=utf-8" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    link.download = "storia.txt";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    return true;
}

// MA CHE PALLE,se io aggiorno in teoria non dovrei vedere tesgto,perchè ho tolto 
//il salvataggio automatico,pero me lo salva comunque perchè firefox è una merda ed ha il  recovery!
//sto scrivendo qua perchè sono capitato qua lol
//ora provo a bloccarlo manualmente da html