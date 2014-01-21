//====JAVASCRIPT LIBRARY========================================================
/*****DOM FUNCTIES*************************************************************/
/**
 * verwijdert alle inhoud/children van een Node
 * @param {type} objNode , node, veplicht, de node die geleegd wordt
 * @returns {undefined}
 */
function leegNode(objNode) {
  while(objNode.hasChildNodes()) {
    objNode.removeChild(objNode.firstChild);
  }
}
/*****DATUM/TIJD FUNCTIES******************************************************/
//globale datum objecten
var vandaag = new Date();
var huidigeDag = vandaag.getDate();
var huidigeWeekdag = vandaag.getDay();
var huidigeMaand = vandaag.getMonth();
var huidigJaar = vandaag.getFullYear();
////globale datum arrays
//dagen volgens getDay() volgorde
var arrWeekdagen = [
  'zondag',
  'maandag',
  'dinsdag',
  'woensdag',
  'donderdag',
  'vrijdag',
  'zaterdag'
];
//maanden met aantal dagen, pas dagen februari aan indien schrikkeljaar
var arrMaanden = [
  ['januari', 31],
  ['februari', 28],
  ['maart', 31],
  ['april', 30],
  ['mei', 31],
  ['juni', 30],
  ['juli', 31],
  ['augustus', 31],
  ['september', 30],
  ['oktober', 31],
  ['november', 30],
  ['december', 31]
];
//FUNCTIONS
/**
 * Geef string met huidige datum en tijd
 * @returns {String}
 */
function getVandaagStr() {
  var strNu = 'Momenteel: ' + vandaag.toLocaleDateString() + ', ';
  strNu += vandaag.toLocaleTimeString();
  return strNu;
}

/**
 * test als gegeven jaar een schrikkeljaar is
 * @param {type} jaar
 * @returns {Boolean}
 */
function isSchrikkeljaar(jaar) {
  var result = false;
  if (!isNaN(jaar)) {
    if (jaar % 4 === 0) {
      result = true;
      if (jaar % 100 === 0) {
        result = false;
        if (jaar % 400 === 0) {
          result = true;
        }
      }
    }
  }
  return result;
}
/**
 * Dependency : css class in stylesheet
 *              id in element
 * @param {type} oDatum , datum object van aan te duiden dag
 * @param {type} cssClass , css class voor aan te duiden dag
 */
function dagAanduiden(oDatum, cssClass) {
  //splits datum object
  var dDag = oDatum.getDate();
  var dMaand = oDatum.getMonth();
  var dJaar = oDatum.getFullYear();
  
  //construeer id voor cel
  var strId = dJaar + '_' + dMaand + '_' + dDag;
  var dCel = document.getElementById(strId);
  if (dCel) {
    dCel.className = cssClass;
  }
}
