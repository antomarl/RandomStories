// qua aggiungo l'easter egge per la parola elektrowindows(caro amico che saluto)
//quando compare la sua parola il pc si glitcha per un po'

export function attivaGlitchPC() {
    const pc = document.querySelector(".pc-wrapper");

    console.log("HAI SBLOCCATO IL SOMMO ELEKTROWINDOWS!!");
    console.log("come? non sai chi è?")
    console.log("E CHE ASPETTI?! VALLO A CERCARE SU YOUTUBE!!")

    if(!pc) {
        return;
    }

    pc.classList.add("glitch-attivo");

    setTimeout(function() {
        pc.classList.remove("glitch-attivo");
    }, 1800);
}