import { generaParticelle } from "./particelle.js";

//gestisce gli effetti che vengono generati quando viene trovata una parola rara

export function scatenaEffettiRari(parola) {
    const flash = document.getElementById("flashRaro");

    flash.classList.remove("attivo");

    void flash.offsetWidth;

    flash.classList.add("attivo");

    const pc = document.querySelector(".pc-wrapper");

    pc.classList.remove("shake-raro");

    generaParticelle(30);

    console.log("%c Parola RARA! : " + parola + "--Ma sei un grande!","color: #ffd700; font-size: 20px; font-weight: bold;");
}