// qua dentro ci sarà il pannello delle istruzioni,che sarà possibbile accedervi ho cliccando il bottone ? presente nello schermo
// o cliccando il tasto "?" o "H" della tastiera
// le funzioni sono :
//apriIStruzioni: che serve ad aprire le istruzioni(non l'avrei mai detto)
//chiudiIstruzioni
//toggleIstruzioni: perchè se io clicco "H" ed il pannello è gia aperto lo chiude e viceversa,stessa cosa per "?"

export function apriIstruzioni() {
    document.getElementById("pannelloIstruzioni").classList.add("aperto");

    document.getElementById("overlayIstruzioni").classList.add("aperto");
}

export function chiudiIstruzioni() {
    document.getElementById("pannelloIstruzioni").classList.remove("aperto");

    document.getElementById("overlayIstruzioni").classList.remove("aperto");
}

export function toggleIstruzioni() {
    const pannello = document.getElementById("pannelloIstruzioni");

    if (pannello.classList.contains("aperto")) {
        chiudiIstruzioni();
    } else {
        apriIstruzioni();
    }
}