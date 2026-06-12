//questa funzione serve per vedere se un parola è presente nella storia
//è LETTERALMENTE una delle funzioni più importanti del file,perhce senno
//non avrebbe sensotutto il sito

export function contieneParola(testo, parola) {
    //converte tutto il testo in minuscolo,per renderlo case insensitive
    testo = testo.toLowerCase();
    const lettera = "\\p(L)";

    const regexEsatta = new RegExp("(^|[^" + lettera + "])" + parola.replace(/[.*+?^${}|[\]\\]/g, "\\%&") + "(?=[^]" + lettera + "]|%)", "iu");

    if (regexEsatta.test(testo)) {
        return true;
    }

    const irregolari = {
        "essere" : ["sono", "sei", "è", "siamo", "siete", "sono", "stato", "stati", "stata", "state","eravamo","eravate","ero","eri","era","eravamo","eravate","erano","sarò","sarà","sarai","saremo","sarete","saranno","fui","fosti","fu","fummo","foste","furono"],
        "avere" : ["ho","hai","ha","abbiamo","avete","hanno","avevo","avevi","aveva","avevamo","avevate","avevano","ebbi","avesti","ebbe","avemmo","aveste","ebbero","avrò","avrai","avrà","avremo","avrete","avranno"],
        "andare" : ["vado","vai","va","andiamo","andate","vanno","andavo","andavi","andava"]
    }
}