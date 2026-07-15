// cambio tutto,ora la storia viene salvata come pdf e le parole generate saranno in grassetto
import { contieneParola } from "../parole/contieneParola.js";

function normalizzaParola(parola) { // questa funzione serve a pulire praticamente una parola ,renderla più facile da vedere alla validazione
    return String(parola)
        .toLowerCase() // tutto minuscolo
        .normalize("NFD") // separa le lettere e gli accenti
        .replace(/[\u0300-\u036f]/g, "") // rimuove gli accenti
        .replace(/[^a-z0-9\s]/g, " ") // toglie punteggiatura e simboli
        .replace(/\s+/g, " ") //se ci sono parole con più spazi di uno,ne lasci solo uno
        .trim(); //toglie gli spazi sia all'inizio che alla fine
}

function aggiungiNuovaPaginaSeServe(doc, y, altezzaPagina, margineBasso) {
    if (y > altezzaPagina - margineBasso) {
        doc.addPage();
        return 22;
    }

    return y;
}
//questa funzione serve per decidere quali pezzi del testo vanno evidenziati
//poichè il pdf viene scritto pèarola per parola,prima creo un set con gli indici dei token da colorare in grassetto

//inoltre ho importato pure contiene parola per riconoscere i verbi coniugati,ed ora devo fare in modo di fare evidenziare pure punto zero per esempio,che poichè sono due parole non lo colorava

function creaSetTokenEvidenziati(tokens, paroleGenerate) {
    const evidenziati = new Set();

    //qui salvo solo i token che sono paerole vere,ignorando gli spazi,però conservo puee lìindice originale, perchè poi devo evidenzire il token giusto quando stampo il pdf.
    const tokenParole = [];

    tokens.forEach(function (token,indiceToken) {
        //se il token è solo spazio,lo ignoro
        if (/^\s+$/.test(token)) {
            return;
        }

        const tokenPulito = normalizzaParola(token);

        //se dopo la pulizia non resta nulla,lo ignoro again
        if(tokenPulito === "") {
            return;
        }

        tokenParole.push({
            indiceToken: indiceToken,
            testoOriginale: token,
            testoPulito: tokenPulito
        });
    });

    //pulisco anche le le parole generate,così confronto roba puliziata con roba puliziata
    const parolePulite = paroleGenerate
        .map(function (parola) {
            return {
                originale: parola,
                pulita: normalizzaParola(parola) 
            };
        })

        .filter(function (parola) {
            return parola.pulita !== "";
        });
    
    //il primo caso sono le parole singole,quondi casa,albero,subwoofer ecc ecc
    //ora per qusto controllero ogni token del testo per vedere se corrisponde ad una parola generate
    //uso anche contieneParola() per i verbi coniugati,come ho detto prima
    tokenParole.forEach(function (tokenInfo) {
        for (const parola of parolePulite) {
            const pezziParola = parola.pulita.split(" ");

            // se la parola generata e composta,come punto zero,la salto e ci penso dopo
            if (pezziParola.length !== 1) {
                continue;
            }

            const matchEsatto = tokenInfo.testoPulito === parola.pulita;

            //questo serve per i verbi coniugati
            const matchConiugato = contieneParola(tokenInfo.testoPulito, parola.originale);
            if (matchEsatto || matchConiugato) {
                evidenziati.add(tokenInfo.indiceToken);
                break;
            }
        }
    });

    //il secondo caso e per le parole composte
    parolePulite.forEach(function (parola) {
        const pezziParola = parola.pulita.split(" ");

        //se non è composta,allora,l'ho gia sistemata soipra
        if (pezziParola.length <= 1) {
            return;
        }

        //scorro tutte le parole del testo e cerco una sequenza uguale
        for (let i = 0; i <= tokenParole.length -pezziParola.length; i ++) {
            let tuttiUguali = true;

            for (let j = 0; j < pezziParola.length;j++) {
                if (tokenParole[i + j].testoPulito !== pezziParola[j]) {
                    tuttiUguali = false;
                    break;
                }
            }
            //se ho trovato la rfrase completqa,evidenzio tutti i pezzi
            if(tuttiUguali) {
                for (let j = 0; j < pezziParola.length; j++) {
                    evidenziati.add(tokenParole[i + j].indiceToken);
                }
            }
        }
    });

    return evidenziati;
}
// questa funzione scrive la storia nel pdf, divide il testo in token,controlla quali deve evidenziare e scrive o le parole normalmente o le evidenzia
function scriviTestoEvidenziato(doc, testo, paroleGenerate, x, y, larghezzaMassima, altezzaPagina, margineBasso) {
    const altezzaRiga = 7;
    const paragrafi = testo.split(/\n+/);

    doc.setFontSize(12);

    paragrafi.forEach(function (paragrafo) {
        let xCorrente = x;

        const tokens = paragrafo
            .split(/(\s+)/)
            .filter(function (token) {
                return token.length > 0;
            });
        
        const tokenEvidenziati = creaSetTokenEvidenziati(tokens, paroleGenerate);

        tokens.forEach(function (token, indiceToken) {
            //se è solo spazio,avanzo un po'
            if (/^\s+$/.test(token)) {
                xCorrente += doc.getTextWidth(" ");
                return;
            }
            
            const evidenziata = tokenEvidenziati.has(indiceToken);

            if ( evidenziata ) {
                doc.setFont("times", "bold");
                doc.setTextColor(160,55,35);
            } else {
                doc.setFont("times", "normal");
                doc.setTextColor(44,24,16);
            }

            const larghezzaToken = doc.getTextWidth(token + " ");

            // se la parola non entra vado a caop
            if (xCorrente + larghezzaToken > x + larghezzaMassima) {
                y += altezzaRiga;
                y = aggiungiNuovaPaginaSeServe(doc, y, altezzaPagina, margineBasso);
                xCorrente = x;
            }

            doc.text(token, xCorrente, y);
            xCorrente += larghezzaToken;
        });

        //spazio tra paragrafi
        y += altezzaRiga;
        y = aggiungiNuovaPaginaSeServe(doc, y, altezzaPagina, margineBasso);
    });

    doc.setFont("times", "normal");
    doc.setTextColor(44, 24, 16);

    return y + 4;
}

function aggiungiNumeriPagina(doc) {
    const totalePagine = doc.getNumberOfPages();
    const larghezzaPagine = doc.internal.pageSize.getWidth();
    const altezzaPagina = doc.internal.pageSize.getHeight();

    for (let i = 1; i <= totalePagine; i++) {
        doc.setPage(i);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(120, 100, 85);

        doc.text(
            "Random Stories · Pagina " + i + " / "  + totalePagine,
            larghezzaPagine - 18,
            altezzaPagina - 10,
            { align: "right" }
        );
    }
}

export function salvaStoria(
    pagine,
    paginaCorrente,
    validaStoria,
    mostraMessaggioPc,
    paroleGenerate = [],
    nomeDifficolta = "normale"
) {
    if (!validaStoria()) {
        return false;
    }

    // salvo prima la pagina attuale, così nel pdf c'è anche quello che stavi scrivendo ora
    pagine[paginaCorrente].sx = document.getElementById("storyInputSx").value;
    pagine[paginaCorrente].dx = document.getElementById("storyInputDx").value;

    let storiaCompleta = "";

    for (let i = 0; i < pagine.length; i++) {
        storiaCompleta += (pagine[i].sx || "") + " " + (pagine[i].dx || "") + "\n\n";
    }

    if (storiaCompleta.trim() === "") {
        mostraMessaggioPc("> Errore: la storia è vuota!", "errore");
        return false;
    }

    //controllo che il jspdf sia stato caricato dall'html
    if (!window.jspdf || !window.jspdf.jsPDF) {
        mostraMessaggioPc("> Errore: jsPDF non è stato caricato", "errore");
        return false;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    const larghezzaPagina = doc.internal.pageSize.getWidth();
    const altezzaPagina = doc.internal.pageSize.getHeight();

    const margineX = 18;
    const margineBasso = 18;
    const larghezzaTesto = larghezzaPagina - margineX * 2;

    let y = 22;

    // titolo
    doc.setFont("times","bold");
    doc.setFontSize(24);
    doc.setTextColor(44, 14, 16);
    doc.text("Random Stories", margineX, y);

    y += 10;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(95,75,60);

    const data = new Date().toLocaleDateString("it-IT");

    doc.text("Modalità: " + nomeDifficolta.toUpperCase(), margineX, y);
    y += 6;
    doc.text("Data: " + data, margineX, y);

    y += 12;

    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.setTextColor(44,24,16);
    doc.text("Parole generate", margineX, y);

    y += 7;

    doc.setFont("helvetica","normal");
    doc.setFontSize(10);
    doc.setTextColor(95,75,60);

    const testoParoleGenerate = paroleGenerate.length > 0
        ? paroleGenerate.join(", ")
        : "Nessuna parola generata";
    const righeParole = doc.splitTextToSize(testoParoleGenerate, larghezzaTesto);

    righeParole.forEach(function (riga) {
        y = aggiungiNuovaPaginaSeServe(doc, y, altezzaPagina, margineBasso);
        doc.text(riga, margineX, y);
        y += 5;
    });

    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(44,24,16)
    doc.text("Storia", margineX, y);

    y += 10;

    for (let i = 0; i < pagine.length; i++) {
        y = aggiungiNuovaPaginaSeServe(doc, y, altezzaPagina, margineBasso);

        doc.setFont("helvetica","bold");
        doc.setFontSize(11);
        doc.setTextColor(120,80,55);
        doc.text("Pagina " + (i + 1),margineX, y);
        y += 7;

        const testoPagina = ((pagine[i].sx || "") + " " + (pagine[i].dx || "")).trim();

        if (testoPagina !== "") {
            y = scriviTestoEvidenziato(doc,testoPagina,paroleGenerate,margineX,y,larghezzaTesto,altezzaPagina,margineBasso);

        } else {
            doc.setFont("times", "italic");
            doc.setFontSize(12);
            doc.setTextColor(140,120,100);
            doc.text("Pagina vuota", margineX , y);

            y += 8;
        }
    }

    // statistiche finali 
    y = aggiungiNuovaPaginaSeServe(doc, y + 6, altezzaPagina, margineBasso);

    doc.setFont("times","bold");
    doc.setFontSize(14);
    doc.setTextColor(44,24,16);
    doc.text("Riepilogo",margineX, y);
    
    y += 8;

    doc.setFont("helvetica","normal");
    doc.setFontSize(10);
    doc.setTextColor(95,75,60);
    doc.text("Pagine: " + pagine.length, margineX, y);
    y += 5;
    doc.text("Parole generate: " + paroleGenerate.length, margineX, y);

    aggiungiNumeriPagina(doc);

    const dataFile = new Date().toISOString().slice(0,10);
    doc.save("storia-random-stories-" + dataFile + ".pdf");

    return true;



}