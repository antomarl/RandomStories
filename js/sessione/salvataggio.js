// questo modulo serve per il salvataggiop dei libro,cioè che quando esco o agggiorno la pagina rimane il testo che ho scrittop
//mettero la funzione SalvaSessione e caricaSessione()

export function salvaSessione(pagine,paginaCorrente,paroleGenerate,numeroParole)   {
    if(pagine[paginaCorrente]) {
        pagine[paginaCorrente].sx = document.getElementById("storyInputSx").value;
        pagine[paginaCorrente].dx = document.getElementById("storyInputDx").value;
     }

    const datiSessione = {
        pagine: pagine,
        paroleGenerate: paroleGenerate,
        numeroParole: numeroParole,
        paginaCorrente: paginaCorrente,
        timestap: Date.now() 
    };
    localStorage.setItem("randomStories_sessione", JSON.stringify(datiSessione));
 }