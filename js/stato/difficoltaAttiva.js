// questo modulo tiene traccia di quale difficolta sta usando l'utemte in questo momento
// e la salva in localStorage così resta tra una sessione e l'altra

import { difficolta } from "../config/difficolta.js";

// creo la chiave usata per il localStorage(la metto come costante)
const chiaveStorage = "randomStories_difficolta";

// come difficlota di default mettiamo normale,se l'utenet non l'ha mai scelta
const difficoltaDefault = "normale";

// restituisco il nome della difficoltà attiva
// se non c'è ne ,allora quella di default
export function getNomeDifficoltaAttiva() {
    const salvata = localStorage.getItem(chiaveStorage);

    //controllo che esiste e che sia una difficoltàb valida
    if (salvata && difficolta[salvata]) {
        return salvata;
    }

    return difficoltaDefault;
}
// restituisco l'oggetto completo della difficoltà attiva
export function getDifficoltaAttiva() {
    const nome = getNomeDifficoltaAttiva();
    return difficolta[nome];
}

// questa cambia la difficolta attiva e la salva in local storage
// restituisce true se è andato bene,false se il nome mnon è validao
export function  setDifficoltaAttiva(nome) {
    if (!difficolta[nome]) {
        console.warn("difficolta NON valida: ", nome);
        return false;
    }

    localStorage.setItem(chiaveStorage, nome);
    return true;
}