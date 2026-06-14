//questa funzione serve per vedere se un parola è presente nella storia
//è LETTERALMENTE una delle funzioni più importanti del file,perhce senno
//non avrebbe sensotutto il sito

export function contieneParola(testo, parola) {
    //converte tutto il testo in minuscolo,per renderlo case insensitive
    testo = testo.toLowerCase();
    const lettera = "\\p{L}";

    const regexEsatta = new RegExp("(^|[^" + lettera + "])" + parola.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?=[^" + lettera + "]|$)", "iu");

    if (regexEsatta.test(testo)) {
        return true;
    }

    const irregolari = {
        "essere" : ["sono", "sei", "è", "siamo", "siete", "sono", "stato", "stati", "stata", "state","eravamo","eravate","ero","eri","era","eravamo","eravate","erano","sarò","sarà","sarai","saremo","sarete","saranno","fui","fosti","fu","fummo","foste","furono"],
        "avere" : ["ho","hai","ha","abbiamo","avete","hanno","avevo","avevi","aveva","avevamo","avevate","avevano","ebbi","avesti","ebbe","avemmo","aveste","ebbero","avrò","avrai","avrà","avremo","avrete","avranno"],
        "andare" : ["vado","vai","va","andiamo","andate","vanno","andavo","andavi","andava","andavamo","andavate","andavano","andai","andasti","andò","andammo","andaste","andarono","andrò","andrai","andrà","andremo","andrete","andranno","andato","andati","andata"],
        "fare" : ["faccio","fai","fa","facciamo","fate","fanno","facevo","faceva","facevi","facevamo","facevate","facevano","feci","faceste","fece","facemmo","faceste","fecero","farò","farai","farà","faremo","farete","faranno","fatto"],
        "dire" : ["dico","dici","dice","diciamo","dite","dicono","dicevo","diceva","dicevi","dicevamo","dicevate","dicevano","dissi","dicesti","disse","dicemmo","diceste","dissero","dirò","dirai","dirà","diremo","direte","diranno","detto"],
        "venire" : ["vengo","vieni","viene","veniamo","venite","vengono","venivo","venivi","veniva","venivano","venivamo","venivate","venni","venisti", "venne", "venimmo","veniste","venerro","verrò","verrai","verrà","verremo","verrete","verranno"],
        "udire" : ["odo","odi","ode","udiamo","udite","odono","udivo","udivi","udiva","udivamo","udivate","udivano","udii","udisti","udì","udimmo","udiste","udirono","udrò","udirò","udrai","udirai","udrà","udirà","udremo","udiremo","udrete","udirete","udranno","udiranno","udito"],
        "stare" : ["sto","stai","sta","stiamo","state","stanno","stavo","stava","stavi","stavamo","stavate","stavano","stetti","stasti","stette","stammo","staste","stettero","starò","starai","starà","staremo","starete","staranno","stato","stati","stata"],
        "dare" : ["do","dai","dà","diamo","date","danno","davo","dava","davi","davamo","davate","davano","diedi","detti","dasti","deste","dette","dammo","daste","diedero","dettero","darò","darai","darà","daremo","darete","daranno","dato"],
        "potere" : ["posso","puoi","può","possiamo","potete","possono","potevo","potevi","poteva","potevamo","potevate","potevano","potei","potesti","potè","potemmo","poteste","poterono","potrò","potrai","potrà","potremo","potrete","potranno","potuto"]
    } // aver riscritoo questo a mano di nuovo è stata la cosa più rompipalle del mondo

    if(irregolari[parola]) {
        for (const forma of irregolari[parola]) {
            const regexVariante = new RegExp("(^|[^" + lettera + "])" + forma.replace(/[.*+?^${}()|[\]\\]/g,"\\$&") + "(?=[^" + lettera + "]|$)","iu");
            if (regexVariante.test(testo)) {
                return true;
            }
        }
    }

    let radice = parola;
    let isVerbo = false;

    if (parola.endsWith("are")) {
        radice = parola.slice(0, -3);
        isVerbo = true;
    }

    else if (parola.endsWith("ere")) {
        radice = parola.slice(0,-3);
        isVerbo = true;
    }

    else if (parola.endsWith("ire")) {
        radice = parola.slice(0, -3);
        isVerbo = true;
    }

    if (isVerbo && radice.length > 2) {
        // rettifico: questa sarà la cosa più pallosa da riscrivere di nuovo,pero voglio mettere il commento di prima,quella serà fu bellissima
        // sono uscito pazzo a scrivere questo a mano,ma la goduria di vedere che alle 21 di sera funzionava è impagabile,penso niente mi dara una felicità cosi genuina
        // ps: mi sono accorto che mancano un bel po' di desinenze e così e molto confusionario,ora per adesso lascio così,ma in futuro credo mi converra dividere le desinenze per coniugazioni
        // poichè ho pensato che tanto lo cambierò,ho copia incollato
        const varianti = [
            radice + "o", radice + "i", radice + "a", radice + "iamo", radice + "ate", radice + "ano",
            radice + "avo", radice + "ava", radice + "avi", radice + "avamo", radice + "avate", radice + "avano",
            radice + "erò", radice + "erai", radice + "erà", radice + "eremo", radice + "erete", radice + "eranno",
            radice + "ato", radice + "ata", radice + "ati", radice + "ate",
            radice + "ito", radice + "ita", radice + "iti",radice + "ite",
            radice + "uto", radice + "uta", radice + "uti", radice + "ute",
            radice + "ando",radice + "endo", radice + "ante",radice + "erei",
            radice + "eresti",radice + "eresi",radice + "eremmo",radice + "ereste",radice + "erebberro",
            radice + "irei",radice + "iresti",radice + "iremmo",radice + "ireste",radice + "irebbero",
            radice + "ai",radice + "asti",radice + "ò",radice + "ammo",radice + "aste",radice + "arono", radice + "assi", radice + "erei",radice + "eresti",radice + "essi",radice + "emmo",radice + "este",radice + "ebbero"
        ];

        for (let v of varianti) {
            const regexVariante = new RegExp("(^|[^" + lettera + "])" + v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?=[^" + lettera + "]|$)","iu");
            
            if (regexVariante.test(testo)) {
                return true;
            }
        }
    }

    return false;
    
}