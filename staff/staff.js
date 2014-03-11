//===============GLOBALS======================================
//array van functies
var aFuncties	= ["instructeur","bediende","manager","arbeider"];
//array van personen, elke persoon is een object
var aoPersoneel = [
	{id:4678,naam:"Roger Mary", functie:"instructeur", leeftijd: 65, sexe:"m", gehuwd:true, kinderen:[{naam:"Liesbeth", leeftijd: 26, sexe:"v"}],vrienden:24},
	{naam:"Evelyn Van Welsenaers", leeftijd: 44, sexe:"v", gehuwd:true, kinderen:[{naam:"Patrick", leeftijd: 12, sexe:"m"},{naam:"Jonas", leeftijd: 14, sexe:"m"}], functie:"bediende",id:1025,vrienden:11},
	{leeftijd: 27, sexe:"v", gehuwd:false,id:9007,functie:"arbeider",naam:"Heidi Vercouteren",vrienden:6}
];

window.onload = function(){
  //=======DOM REFERENTIES=======================================
  //knoppen
  var eToevoegen 		= document.getElementById('toevoegen');
  var ePersoneelsLijst= document.getElementById('personeelsLijst');
  
  //invulvelden, keuzelijsten, etc...
  var eNaam 			= document.getElementById('naam');
  var eFunctie 		= document.getElementById('functie');
  var eSexe 			= document.frmPersoneelslid.sexe;
  var eLeeftijd 		= document.getElementById('leeftijd');
  var eGehuwd 		= document.getElementById('gehuwd');
  var eKind1			= document.getElementById('kind1');
  var eKind2			= document.getElementById('kind2');
  var eKind3			= document.getElementById('kind3');
  //andere
  var eOutput			= document.getElementById('output');
  var eTeller			= document.getElementById('teller');

  //=======KEUZELIJST OPVULLEN ===================================
  var eDF = document.createDocumentFragment();
  var eOption1 = document.createElement('option');
  var sValue1 = document.createTextNode('--- kies een functie ---');
  eOption1.appendChild(sValue1);
  eOption1.value = '';
  eDF.appendChild(eOption1);
  for (var i = 0; i < aFuncties.length; i++) {
    var eOption = document.createElement('option');
    var sValue = document.createTextNode(aFuncties[i]);
    eOption.appendChild(sValue);
    eDF.appendChild(eOption);
  }
  eFunctie.appendChild(eDF);
  
  //==========EVENT HANDLERS=======================================
  ePersoneelsLijst.addEventListener('click', function() {
    eOutput.innerHTML = fnToonPersoneelBlok(aoPersoneel);
    fnRegLikeKnoppen();
  });
  eToevoegen.addEventListener('click', function() {
    //formulierwaarden aflezen
    var sNaam = eNaam.value;            //string
    var nLeeftijd = eLeeftijd.value;    //string
    var sKind1 = eKind1.value;          //string
    var sKind2 = eKind2.value;          //string
    var sKind3 = eKind3.value;          //string
    var bGehuwd = eGehuwd.checked;      //boolean
    var sFunctie = eFunctie.value;      //string
    
    var sSexe = undefined;              //string || undefined
    //bepaal value sexe
    for (var i = 0; i < eSexe.length; i++) {
      if (eSexe[i].checked == true) {
        sSexe = eSexe[i].value;
      }
    }
    console.log(sNaam+nLeeftijd+sFunctie+sSexe+bGehuwd+sKind1+sKind2+sKind3);
    
    //eenvoudige validatie
    if (sNaam == '' || isNaN(nLeeftijd) || typeof(sSexe) == 'undefined' || sFunctie == '') {
      //niet goed
      console.log('validation failed');
      alert('Een of meer van de verplichte velden is niet ingevuld');
    } else {
      //ok
      console.log('validation sucessful');
      var aKidNames = [];
      if (sKind1 !== '') {
        aKidNames.push(sKind1);
      }
      if (sKind2 !== '') {
        aKidNames.push(sKind2);
      }
      if (sKind3 !== '') {
        aKidNames.push(sKind3);
      }
      fnPersoneelslidToevoegen(sNaam, nLeeftijd, bGehuwd, sFunctie, sSexe, aKidNames);
//      fnPersoneelslidToevoegen(sNaam, nLeeftijd, bGehuwd, sFunctie, sSexe, [sKind1, sKind2, sKind3]);
      //formulier reset voor volgende toevoeging
      document.frmPersoneelslid.reset()
      eNaam.focus();
    }
  });
};
//============FUNCTIONS=============================================
/**
 * return HTML string met UL lijst van properties en hun waarden van alle objecten in aoData
 * @param {type} aoData, array van objecten
 * @returns {undefined}, HTML string met UL
 */
function fnToonPersoneel(aoData) {
  var sLijst = '';
  //test if data array is not empty
  if (aoData.length > 0) {
    //overloop array van objecten
    for (var i = 0; i < aoData.length; i++) {
      sLijst += '<ul>';
      var oPersoon = aoData[i];
      //overloop alle properties van object
      for (var key in oPersoon) {
        var propWaarde = oPersoon[key];
        if (Array.isArray(propWaarde)) {
          sLijst += '<li>' + key + ' : ' + fnToonPersoneel(propWaarde) + '</li>';
        } else {
          sLijst += '<li>' + key + ' : ' + propWaarde + '</li>';
        }
      }
      sLijst += '</ul>';
    }
  }
  return sLijst;
}
function fnToonPersoneelBlok(aoData) {
  var sLijst = '';
  //test if data array is not empty
  if (aoData.length > 0) {
    //overloop array van objecten
    for (var i = 0; i < aoData.length; i++) {
      //overloop alle properties van object
      var oPersoon = aoData[i];
      sLijst += '<div class="persoon"' + 
              'id="pers_' + oPersoon.id + '"' +
              'title="personeelsnummer: ' + oPersoon.id + '"' +
              'data-vrienden=' + oPersoon.vrienden + '"' +
              '>';
      for (var key in oPersoon) {
        var propWaarde = oPersoon[key];
        if (key != 'id' && key != 'vrienden') {
          if (Array.isArray(propWaarde)) {
            sLijst += '<span class="prop">' + key + '</span><span class="val">' + fnToonPersoneel(propWaarde) + '</span>';
          } else {
            sLijst += '<span class="prop">' + key + '</span><span class="val">' + propWaarde + '</span>';
          }
        }
      }
      if (typeof oPersoon.vrienden !== 'undefined') {
        sLijst += '<button class="like" title="voeg een vriendje toe">Like</button>';
      }
      sLijst += '</div>';
    }
  }
  return sLijst;
}
/**Maakt een personeelslid object en voegt deze toe aan aoPersoneel
 * 
 * @param {type} naam
 * @param {type} leeftijd
 * @param {type} gehuwd
 * @param {type} functie
 * @param {type} sexe
 * @param {type} aKindnamen
 * @returns {undefined}
 */
function fnPersoneelslidToevoegen(naam, leeftijd, gehuwd, functie, sexe, aKindnamen) {
  var persoon = new Object();
  persoon.naam = naam;
  persoon.leeftijd = leeftijd;
  persoon.functie = functie;
  persoon.gehuwd = gehuwd;
  persoon.sexe = sexe;
  persoon.vrienden = 0;
  persoon.id = parseInt((Math.random() * 10000) + 1);
  var aKindNamen = aKindnamen || []; //optioneel argument opvangen
  var aantalKinderen = aKindNamen.length;
  if (aantalKinderen > 0) {
    persoon.kinderen = []; //maak property
    for (var i = 0; i < aantalKinderen; i++) {
      if (aKindNamen[i] !== '') {
        var kind = new Object();
        kind.naam = aKindNamen[i];
        persoon.kinderen.push(kind);
      }
    }
  }
  aoPersoneel.push(persoon);
  fnUpdateTeller(1);
  //console.log(aoPersoneel);
}
/**update de teller in de span#teller
 * 
 * @param {type} n, increment/verhoging
 * @returns {undefined}
 */
function fnUpdateTeller(n) {
  var eTeller = document.getElementById('teller');
  var nTeller = parseInt(eTeller.innerHTML);
  nTeller += n;
  eTeller.innerHTML = nTeller;
}
/**event registratie voor de like knoppen
 * kan in JS enkel NA het aanmaken van de knop
 * 
 * @returns {undefined}
 */
function fnRegLikeKnoppen() {
  var eLikes = document.querySelectorAll('.like');
  for (var i = 0; i < eLikes.length; i++) {
    eLikes[i].addEventListener('click', function() {
      var ePersoon = this.parentNode;
      var nVriendjes = parseInt(ePersoon.dataset['vrienden']) + 1;
      ePersoon.dataset['vrienden'] = nVriendjes;
      alert('Deze persoon heeft er een vriendje bij: ' + nVriendjes);
    });
  }
}