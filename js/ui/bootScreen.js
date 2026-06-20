// questo modulo gestisce la schermata di avvio del pc,che si avv9ia come se fosse un bios (ì,stile molto tipo kali linux+
// mostra delle righe come vero terminale ,dura tipo 10 secondi

const righeBootScreen = [
    { testo: "> RANDOM_STORIES_OS v3.7.5", delay: 400},
    { testo: "(c) 2026 Antonino Marletta. All right reserved. ", delay: 600},
    { testo: "> ", delay: 200},
    { testo: "> Booting kernel..................[OK]", delay:350},
    { testo: "> Loading word database(4372)...[OK]", delay:400},
    { testo: "> Initializing terminal....................[OK]", delay:350},
    { testo: "> Cheking save state.....................[OK]", delay: 500},
    { testo: "> ", delay:300},
    { testo: "> Welcome, user.", delay:600},
    { testo: "> System ready.", delay: 700},
    { testo: "> Starting...",delay: 800}, // ho fatto una modifica qua perchè mi piaceva di più così
];

export function avviaBootScreen(onBootFinito) {
    const boot = document.getElementById("bootScreen");
    const sezione = document.getElementById("sectionGeneraParole");
    const figli = sezione.children;

    for (let i = 0; i < figli.length; i++) {
        if (figli[i].id !== "bootScreen") {
            figli[i].style.display = "none";
        }
    }

    boot.style.display = "block";
    boot.innerHTML = "";

    let rigaCorrente = 0;

    function scriviProssimaRiga() {
        if (rigaCorrente >= righeBootScreen.length) {
            setTimeout(function() {
                boot.style.display = "none";

                for (let i = 0; i < figli.length; i++) {
                    if (figli[i].id !== "bootScreen") {
                        figli[i].style.display = "";
                    }
                }
                //avvisa ora il mai che ha finito
                if(typeof onBootFinito === "function") {
                    onBootFinito();
                }
            }, 700);

            return;
        }

        const riga = righeBootScreen[rigaCorrente];
        const divRiga = document.createElement("div");

        divRiga.className = "riga-boot";

        boot.appendChild(divRiga);

        let i = 0;

        const intervalloLettere = setInterval(function() {
            divRiga.textContent += riga.testo.charAt(i);
            i++;
            if(i >= riga.testo.length) {
                clearInterval(intervalloLettere);
                rigaCorrente++;
                setTimeout(scriviProssimaRiga, riga.delay);
            }
        }, 15);
    }
    scriviProssimaRiga();

}
