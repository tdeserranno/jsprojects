//||||CALENDER.JS|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//====WINDOW.ONLOAD=============================================================
window.onload = function() {
  //DOM ELEMENTEN
  var divOutput = document.getElementById('output');
  var divKalender = document.getElementById('kalender');

  //leeg inhoud
  leegNode(divOutput);//functie uit nuttig_lib.js

  //plaats huidige datum-tijd in output element
  divOutput.innerHTML = getVandaagStr();
  //toon kalender
  divKalender.innerHTML = maakJaarKalender(huidigJaar);
  dagAanduiden(vandaag, 'vandaag');//huidige datum aanduiden
};
//====FUNCTIONS=================================================================
/**Dependency: nuttig_lib.js
 * @param {integer} kalenderJaar , 4 digit jaar
 * @param {integer} maandIndex , van 0-11
 * @returns {string} strMaandTabel , html string voor innerHTML,
 *            tabel met maandoverzicht
 */
function maakMaandTabel(kalenderJaar, maandIndex) {
  //controle argumenten
  if (isNaN(kalenderJaar) || (kalenderJaar.toString().length !== 4)) {
    return 'fout jaargetal';
  }
  if (isNaN(maandIndex) || maandIndex < 0 || maandIndex > 11) {
    return 'fout maandgetal';
  }
  //weekdag van de eerste dag van de maand
  var startDatum = new Date(kalenderJaar, maandIndex, 1);
  var startWeekdag = startDatum.getDay();
  //bepaal einddag voor die maand, mogelijke uitzondering februari van schrikkeljaar
  var eindDag = arrMaanden[maandIndex][1];
  if ((maandIndex === 1) && (isSchrikkeljaar(kalenderJaar))) {
    eindDag = 29;
  }
  //opbouw html string
  var strMaandTabel = '<table class="kalender">\n';
  //titel row
  strMaandTabel += '<tr><th colspan="7">' + arrMaanden[maandIndex][0] + ' ';
  strMaandTabel += kalenderJaar + '</th></tr>\n';
  //dagtitels
  strMaandTabel += '<tr>';
  for (var i = 0; i < 7; i++) {
    strMaandTabel += '<td>';
    strMaandTabel += arrWeekdagen[i].substr(0,2).toUpperCase();
    strMaandTabel += '</td>';
  }
  strMaandTabel += '</tr>\n';
  
  var dag = 1;//dagnnummer
  var teller = 0;//celnummer
  while(dag <= eindDag) {
    //weekrij
    strMaandTabel += '<tr>';
    for (var i = 0; i < 7; i++) {
      //teken cellen, met of zonder dag ingevuld
      var strId = '';//id samengesteld uit maandIndex en dagnummer
      var strDagNummer = '';//dag nummer
      //schrijf de dagen
      if ((teller >= startWeekdag) && (dag <= eindDag)) {
        strDagNummer = dag;
        strId = ' id="' + kalenderJaar + '_' + maandIndex + '_' + dag + '"';
        dag++;
      }
      //schrijf de cel
      strMaandTabel += '<td' + strId + '>';
      strMaandTabel += strDagNummer;
      strMaandTabel += '</td>';
      teller++;
    }
    strMaandTabel += '<tr>\n';
  }
  strMaandTabel += '</table>\n';
  return strMaandTabel;
}
/**Dependency : maakMaandTabel()
 * 
 * @param {integer} kalenderJaar , 4 digit jaar
 * @returns {string} strJaarKalender , html string voor innerHTML
 */
function maakJaarKalender(kalenderJaar) {
  var strJaarKalender = '';
  for(var i = 0; i < 12; i++) {
    strJaarKalender += '<div class="maandContainer">';
    strJaarKalender += maakMaandTabel(kalenderJaar, i);
    strJaarKalender += '</div>';
  }
  return strJaarKalender;
}