/*  Image Gallery version 3 */
var version = ' versie 3.0';
window.onload = function() {
  //noscript verbergen
  var eNoScript = document.getElementById('noscript');
  eNoScript.style.display = 'none';
  
  //array geladen?
  if (typeof aModernArt == 'undefined') {
    throw new Error('array aModernArt niet gevonden');
  } else {
//    console.log(aModernArt[0][0]);
    //version
    var eKop = document.querySelector('h1');
    eKop.innerHTML = eKop.innerHTML + version;
    
    //img placeholder
    var eImg = document.getElementById('plaatshouder');
    
    //dynamic select list
    var eKeuzelijst = maakKeuzelijst(aModernArt);
    var eSidebar = document.querySelector('aside');
    eSidebar.appendChild(eKeuzelijst);
    //eventhandler
    eKeuzelijst.addEventListener('change', function(e) {
      var waarde = this.value;
      console.log(waarde);
      if (waarde !== '' && waarde !== null) {
        toonFoto(waarde, eImg);
      }
    })
  }
};
/**
 * 
 * @param {type} a, array van images
 * @returns {maakKeuzelijst.eSelect|Element}, SELECT element
 */
function maakKeuzelijst(a) {
  var nArt = a.length;
  var eSelect = document.createElement('select');
  eSelect.id = 'keuzelijst';
  
  //standaard OPTION element
  var eOption = document.createElement('option');
  eOption.innerHTML = 'Maak een keuze';
  eOption.setAttribute('value','');
  eSelect.appendChild(eOption);
  //OPTION elementen met artiesten
  for (var i = 0; i < nArt; i++) {
    var eOption = document.createElement('option');
    eOption.innerHTML = a[i][2];
    eOption.value = i;
    eSelect.appendChild(eOption);
  }
  return eSelect;
}
/**
 * 
 * @param {type} nIndex
 * @param {type} eImg
 * @returns {undefined}
 */
function toonFoto(nIndex, eImg) {
  var aArt = aModernArt[nIndex];
  var sPad = aArt[0];
  var sInfo = aArt[1];
  var sNaam = aArt[2];
  
  eImg.src = '../../images/art/' + sPad;
  var eInfo = document.getElementById('info');
  if (eInfo) {
    //eInfo bestaat al
    eInfo.innerHTML = sInfo;
  } else {
    var eInfo = document.createElement('p');
    eInfo.id = 'info';
    eInfo.innerHTML = sInfo;
    eImg.parentNode.insertBefore(eInfo, eImg.parentNode.firstChild);
  }
}