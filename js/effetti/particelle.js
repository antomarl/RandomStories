// qua ci metto solo la funzione generaParticelle
// che sarebbe la funzione dove faccio comparire le particelle gialle quando compare una parola rara
// le particelle vengono generate casualmente

export function generaParticelle(quantita) {
    const contenitore = document.getElementById("particelleRare");

    for (let i = 0; i < quantita; i++) {
        const particella = document.createElement("div");

        particella.className = "particella";

        particella.style.left = Math.random() * 100 + "vw";
        particella.style.animationDelay = (Math.random() * 0.5) + "s";

      
        const dimensione = 4 + Math.random() * 8;

        particella.style.width = dimensione + "px";
        particella.style.height = dimensione + "px";

        contenitore.appendChild(particella);

        setTimeout(function() {
            particella.remove();
        }, 3000);
    }
        
}