// qui dentro si troverà tutta la logica per il cambio tema(chiaro/scuro)
//le due funzioni che prendo dal main sono :
// inizzializza tema : serve per lasciare il tema che aveva scelto l'utente anche se aggiorna o chiude la pagina
// lo chiamo una volta all'avvio del sito,poi legge da localStorage che tema aveva impostato l'utente e applica quella scelta
//Cambia tema: questo deve essere chiamato ogni volta che l'utente clicca il bottone, perche appunto serve per switchare da tema chiaro a tema scuroc  eviceversa, questo usando il togggle

export function inizializzaTema() {
    //questa funzione viene chiamata una volta sola all'avvio del sito,legge local storage e applica il giusto tema
    const bottone = document.getElementById("coloreTema");

    if (localStorage.getItem("tema") === "scuro") {
        // se l'utente l'ultima volta aveva scelto scuro applico la classe
        document.body.classList.add("tema-scuro");
        //e giustamente il bottone deve invitare a tornare al chiaro
        bottone.textContent = "Tema Chiaro";
    } else {
        // mettiamo di default il tema chiaro e il bottone invita ad andare sullo scuro
        bottone.textContent = "Tema Scuro"
    }
}

// la funzione sotto invece viene chiamata ogni volta che l'utente cambia tema
// fa il toggle del tema è salva l'etichetta

export function cambiaTema() {
    const bottone = document.getElementById("coloreTema");

    //il toggle aggiunge la classe se non c'è e la toglie se c'è(tipo la porta logica not(ci ho ho preso 9 e mezzo btw))
    const temaScuroAttivo = document.body.classList.toggle("tema-scuro");

    if (temaScuroAttivo) {
        // il tema scuro è attivo, in questo caso il bottone invita a tornare al chiaro
        bottone.textContent = "Tema Chiaro";
        localStorage.setItem("tema", "scuro");
    } else {
        //se il tema scuro è diusattivato,per la legge dei grandi numeri siamo in chiaro
        bottone.textContent = "Tema Scuro";
        localStorage.setItem("tema", "chiaro");
    }

}

//comunque le modifiche e quello che faccio lo scrivo pure su Diario_RS.txt,forse anche meglio la