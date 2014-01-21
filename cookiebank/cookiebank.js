//^^^^COOKIEBANK.JS^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//====WINDOW.ONLOAD=============================================================
window.onload = function() {
  //DOM ELEMENTEN
  var eOutput = document.getElementById('output');
  var eKnopKrediet = document.getElementById('krediet');
  var eKnopDebiet = document.getElementById('debiet');
  //STANDAARD WAARDEN
  var sMsg = '';//bericht aan gebruiker
  var sNaam = 'nieuwe klant';
  var nSaldo = 0;
  //TEST COOKIE
  if (getCookie('klantnaam')) {
    sNaam = getCookie('klantnaam');
    nSaldo = parseFloat(getCookie('saldo')).toFixed(2);
    //bericht
    sMsg += 'Welkom ' + sNaam + ',';
    sMsg += 'uw saldo bedraagt ' + nSaldo + ' Euro';
    //knop sluit rekening
    var eKnop = maakKnop('Sluit rekening');
    eKnop.addEventListener('click', rekeningSluiten);
  } else {
    //bericht
    sMsg += 'Welkom beste bezoeker. ';
    sMsg += 'Als u bij ons een nieuwe rekening opent ontvangt u een startsaldo van 100 Euro!';
    //knop open rekening
    var eKnop = maakKnop('Open rekening');
    eKnop.addEventListener('click', rekeningOpenen);
  }
  
  //GENERISCHE DOM ELEMENTEN
  var dfBericht = document.createDocumentFragment();
  var eNl = document.createElement('br');
  //OPBOUW DOCUMENT FRAGMENT
  var tNode = document.createTextNode(sMsg);
  dfBericht.appendChild(tNode);
  dfBericht.appendChild(eNl.cloneNode(false));
  dfBericht.appendChild(eNl.cloneNode(false));
  dfBericht.appendChild(eKnop);
  eOutput.appendChild(dfBericht);
  
  //EVENT HANDLERS VOOR KREDIET EN DEBIET
  eKnopKrediet.addEventListener('click', function() {
    berekenen('+');
  });
  eKnopDebiet.addEventListener('click', function() {
    berekenen('-');
  });
};
//====FUNCTIONS=================================================================
/**Maakt een DOM button element
 * 
 * @param {type} tekst , tekst voor knop
 * @returns {element} knop element
 */
function maakKnop(tekst) {
  var eKnop = document.createElement('button');
  var sTekst = document.createTextNode(tekst);
  eKnop.appendChild(sTekst);
  eKnop.setAttribute('type', 'button');
  return eKnop;
}
/**Vraagt klantnaam via prompt en maakt cookies voor klantnaam en saldo en
 * ververst de pagina
 */
function rekeningOpenen() {
  var sNaam = window.prompt('Uw naam ?','');
  if (sNaam !== '' && sNaam !== null) {
    setCookie('klantnaam', sNaam, 100);
    setCookie('saldo', 100, 100);
  }
  window.history.go(0);
}
/**Wist cookies klantnaam en saldo en vervest de pagina
 */
function rekeningSluiten() {
  clearCookie('klantnaam');
  clearCookie('saldo');
  window.history.go(0);
}
/**geld storting of afhaling
 * 
 * @param {type} bewerking , '+' of '-' teken
 * @returns {undefined}
 */
function berekenen(bewerking) {
  var nNieuwSaldo = 0;
  var eBedrag = document.getElementById('bedrag');
  var sBedrag = eBedrag.value;
  var sSaldo = getCookie('saldo');
  var sBericht = '';
  var regEx = /,/;
  sBedrag = sBedrag.replace(regEx, '.');
  
  if (sSaldo !== null && sSaldo !== '' && !isNaN(sSaldo)) {
    if (sBedrag !== '' && !isNaN(sBedrag)) {
      var nSaldo = parseFloat(sSaldo);
      var nBedrag = parseFloat(sBedrag);
      switch (bewerking) {
        case '+':
          nNieuwSaldo = nSaldo + nBedrag;
          break;
        case '-':
          nNieuwSaldo = nSaldo - nBedrag;
          break;
      }
      if (nNieuwSaldo <= 0) {
        var nMax = nSaldo - 1;
        sBericht += 'Uw saldo is onvoldoende om dit bedrag af te halen. ';
        sBericht += 'U kunt maximaal ' + nMax + ' Euro afhalen.';
        eBedrag.value = nMax;
        eBedrag.focus();
        toonWaarschuwing(sBericht);
      } else {
        setCookie('saldo', nNieuwSaldo, 100);
        window.history.go(0);
        eBedrag.value = '';
      }
    } else {
      alert('U moet een correct bedrag ingeven');
    }
  } else {
    //geen saldo = geen rekening
    var bOpenen = window.confirm('U heeft nog geen rekening geopend, wenst u een rekening te openen?');
    if (bOpenen === true) {
      rekeningOpenen();
    }
  }
}
/**Toont waarschuwingstekst in divWarning
 * 
 * @param {type} msg , bericht
 */
function toonWaarschuwing(msg) {
  var eWarning = document.querySelector('.waarschuwing');
  eWarning.innerHTML = msg;
  eWarning.style.display = 'block';
}