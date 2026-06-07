// qui dentrp metto le funzioni che gestiscono il terminale del pc(le scritte verdi)

// inserirò tre funzioni che lavorano togheter(mi fa pensare a backrooms escape togheter,sono pazzo :)
// premetto che tutto era in un unico file,quindi e come se stessi rispiegando tutto poiche la poi a  mano a mano cancellero le cose
//ma io la avevo gia spiegato tutto
// la priam funzione è typeWriter = fa apparire le lettere del pc una alla volta(che onestanìmente è una figata,tipo come se fosse una macchina da scrivere)
// la seconda è mostraMessaggioPc = mostra il messaggio sotto( sempre con typeWriter) quando viene aggiunta una parola/quando viene resettato tuttp/ qaundo  si arriva al masimo di parole generate
//il terso e pulisciMessaggioPC = cancella il messaggio attuale

let typingTimer = null; // serve a fermare il tipying che sta avvenendo se ne parte un altro,senno si sovrapponerebbero
// non lo esporto perche e una variabile privata del modulo

//effetto macchina da scrivere: scrive il testo lettera per lettera dentro l'ekemento html passato come parametro
// l'elemento è il nodo html in cui si scrive (es document.getElementbyId("messaggioPc"))
// il testo è la stringa da scrivere e la velocità è espressa in millisecondi tra una lettera è l'altra

export function typeWriter(elemento, testo, velocita) {
    //se la velocita non viene passata, uso 25 ms(mi sembra un buon equilibrio)
    if(!velocita) velocita = 25;

    // se c'è un typing in coorso e l'utente clicaa ancora,lo fermo,cosi non si sovrappone
    if (typingTimer) {
        clearInterval(typingTimer);
        typingTimer = null;
    }

    //svuoto l'elemento e ricomincio
    elemento.textContent = "";
    let i = 0

    // ad ogni velocità in millisecondi aggiungo una lettera
    typingTimer = setInterval(function() {
        elemento.textContent += testo.charAt(i);
        i++;
        //quando è stato scritto tutto,fermo l'intervallo

        if ( i >= testo.length) {
            clearInterval(typingTimer);
            typingTimer = null;
        }
    }, velocita);
}

//ora faccio la seconda funzione,quella che mostra il messaggio nel pc
// il tipo cambia il colore via css ( verde = lesgo, giallo = avviso, rosso = errore)
//il testo è la stringa da mostrare
// il tipo è quello che ho detto prima

export function mostraMessaggioPc(testo, tipo) {
    const msg = document.getElementById("messaggioPC");

    //eseguo un reset delle classi,prima rimuovo tutto.poi aggiungo solo quelle corrette

    msg.className = "messaggio";

    if (tipo === "successo") {
        msg.classList.add("successo");
    } else if (tipo === "avviso") {
        msg.classList.add("avviso");
    }

    // se tipo e qualsiasi altra cosa, resta solo "messaggio" e il css lo colora di rosso

    // ora scrivo il testo con effetto typewriter

    typeWriter(msg, testo, 30)
}

// questa funzione cancella il messaggio che vuiene mostrato nel terminale lasciando vuoto
export function pulisciMessaggioPC() {
    const msg = document.getElementById("messaggioPC");
    msg.textContent = "";
    msg.className = "messaggio";
}