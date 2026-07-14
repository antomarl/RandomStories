// cambio tutto,ora la storia viene salvata come pdf e le parole generate saranno in grassetto

function normalizzaParola(parola) {
    return parola
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[.,!?;:()"«»'’]/g, "")
        .trim();
}

function aggiungiNuovaPaginaSeServe(doc, y, altezzaPagina, margineBasso) {
    if (y > altezzaPagina - margineBasso) {
        doc.addPage();
        return 22;
    }

    return y;
}

function scriviTestoEvidenziato(doc, testo, paroleGenerate, x, y, larghezzaMassima, altezzaPagina, margineBasso) {
    const paroleDaEvidenziare = new Set(
        paroleGenerate.map(function (parola) {
            return normalizzaParola(parola);
        })
    );

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

        tokens.forEach(function (token) {
            //se è solo spazio,avanzo un po'
            if (/^\s+$/.test(token)) {
                xCorrente += doc.getTextWidth(" ");
                return;
            }

            const parolaPulita = normalizzaParola(token);
            const evidenziata = paroleDaEvidenziare.has(parolaPulita);

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
        doc.setPage(1);
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