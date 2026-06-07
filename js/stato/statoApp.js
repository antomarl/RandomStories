// in questo file ci sarà invece il cambio di stato del sito,perchè praticamente ci sono duè modalita nel mio sito,
//la prima quando si generano le parole( e si vede il pc) e la seconda quando si scrive(e si vede il quaderno)
// lo stato viene memorizzato come classe CSS nel body della pagina,mentre tutto il resto reagisce a quella
//classe(infatti in base a cosa è in primo piano, l'altra torna indietro)

//intanto dsi cambia lo stato corrente dell'app,e riceve come parametro il nome dello stato
//per prima cosa rimuove entrambi gli statii, e poi aggiunge quello che viene richiesto

export function setAppState(state) {
    document.body.classList.remove('state-generating', 'state-writing');
    document.body.classList.add(state)
}