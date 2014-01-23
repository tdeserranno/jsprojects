//^^^^BIRDY.JS^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//====GLOBALS===================================================================
var oFouten = {
  required : {
    //enkel voor input type "text" en "password"
    msg : 'verplicht veld',
    test : function (elem) {
      return elem.value != '';
    }
  },
  aantal : {
    msg : 'getal verwacht',
    test : function(elem) {
      //test enkel de inhoud als er een inhoud is
      if (elem.value != '') {
        return !isNaN(elem.value) && elem.value > 0;
      } else {
        return true;
      }
    }
  },
  datum : {
    msg : 'datum ongeldig (d/m/yyyy)',
    test : function(elem) {
      //dd/mm/yyyy
      var regExDatum = /^([0-9]|[0,1,2][0-9]|3[0,1])\/([\d]|1[0,1,2])\/\d{4}$/;
      if (elem.value !== '') {
        return regExDatum.test(elem.value);
      } else {
        return true;
      }
    }
  },
  aankomstL : {
    msg : 'aankomstluchthaven moet verschillen van vertrekluchthaven',
    test : function(elem) {
      //aankomstL moet verschillen van vertrekL
      if (elem.value !== '') {
        var aL = elem.value;
        var vL = document.frmVlucht.vertrekL.value;
        return !(aL === vL);
      } else {
        return true;
      }
    }
  },
  retourDatum : {
    msg : 'retourdatum &gt; vertrekdatum',
    test : function(elem) {
      //retourdatum minstens 1 dag na vertrekdatum
      if (elem.value !== '') {
        var aD = elem.value;
        var vD = document.frmVlucht.vertrekdatum.value;
        var dag = 24 * 60 * 60;
        //retourdatum
        var arrD1 = aD.split('/');
        var D1 = new Date(parseInt(arrD1[2]), parseInt(arrD1[1]) - 1, parseInt(arrD1[0]));
        //vertrekdatum
        var arrD2 = vD.split('/');
        var D2 = new Date(parseInt(arrD2[2]), parseInt(arrD2[1]) - 1, parseInt(arrD2[0]));
        var verschil = D1 - D2;
        return (verschil >= dag)
      } else {
        return true;
      }
    }
  }
};
//====WINDOW.ONLOAD=============================================================
window.onload = function() {
  //DOM references
  var eFrmVlucht = document.frmVlucht;
  var eRetour = document.frmVlucht.optRetour;
  var eEnkel = document.frmVlucht.optEnkel;
  var eVolw = document.frmVlucht.volwassenen;
  var eKind = document.frmVlucht.kinderen;
  var ePeut = document.frmVlucht.peuters;
  
  //custom form submit behavior
  eFrmVlucht.addEventListener('submit', function(event) {
    event.preventDefault();
//    console.log('wie is this?' + this.name);
    var bValid = validate(this);
    console.log('formulier ' + this.name + ' valideert als ' + bValid);    
    if (bValid === true) this.submit();
  });
  //event handlers for radio "Retour" en "Enkel"
  eRetour.addEventListener('click', function() {
    vluchtType(this.value);
  });
  eEnkel.addEventListener('click', function() {
    vluchtType(this.value);
  });
  //event handlers for passengernames
  eVolw.addEventListener('blur', passagierNamen);
  eKind.addEventListener('blur', passagierNamen);
  ePeut.addEventListener('blur', passagierNamen);
};
//====FUNCTIONS=================================================================
/**Doorloopt alle form elementen en valideert die met de functie validateField.
 * Als een van de elementen niet valideert dan wordt bValid op false gezet en
 * zal het formulier dus false valideren.
 * 
 * @param {type} frm
 * @returns {Boolean}
 */
function validate(frm) {
  var bValid = true;
  
  //cycle through form elements
  for (var i = 0; i < frm.elements.length; i++) {
    //hide previous errors
    hideErrors(frm.elements[i]);
    //validate field
    var bVeld = validateField(frm.elements[i]);
    console.log(
            'het element %s met name %s valideert als %s',
            frm.elements[i].nodeName,
            frm.elements[i].name,
            bVeld
            );
    if (bVeld === false) {
      bValid = false;
    }
  }
  return bValid;
}
/**Valideert een veld volgens zijn html class
 * 
 * @param {type} elem
 * @returns {undefined}
 */
function validateField(elem) {
  var aFoutBoodschappen = [];
  var bValid = true;
  
  //verberg vorige errormsg
  hideErrors(elem);
  //valideer veld
  for (var fout in oFouten) {
    var regEx = new RegExp('(^|\\s)' + fout + '(\\s|$)'); //regex
    //fouten class aanwezig
    if (regEx.test(elem.className)) {
      var bTest = oFouten[fout].test(elem);
      console.log(
            'het element %s met name %s wordt gevalideerd voor %s: %s',
            elem.nodeName,
            elem.name,
            fout,
            bTest
            );
      if (bTest === false) {
        aFoutBoodschappen.push(oFouten[fout].msg);
      }
    }
  }
  if (aFoutBoodschappen.length > 0) {
    showErrors(elem, aFoutBoodschappen);
    bValid =  !(aFoutBoodschappen.length > 0);
  }
  return bValid;
}
/**Toon foutberichten
 * 
 * @param {type} elem
 * @param {type} errors
 * @returns {undefined}
 */
function showErrors(elem, aErrors) {
  var eSibling = elem.nextSibling;
  if (!eSibling || !(eSibling.nodeName == 'UL' && eSibling.className == 'fouten')) {
    eSibling = document.createElement('ul');
    eSibling.className = 'fouten';
    elem.parentNode.insertBefore(eSibling, elem.nextSibling);
  }
  //maak foutberichten als li elementen
  for (var i = 0; i < aErrors.length; i++) {
    var eLi = document.createElement('li');
    eLi.innerHTML = aErrors[i];
    eSibling.appendChild(eLi);
  }
}
/**Verbergt foutberichten
 * 
 * @param {type} elem
 * @returns {undefined}
 */
function hideErrors(elem) {
  var eSibling = elem.nextSibling;
  if (eSibling && eSibling.nodeName == 'UL' && eSibling.className == 'fouten') {
    elem.parentNode.removeChild(eSibling);
  }
}
/**Activeert of desactiveert de retour datum afhankelijk van vluchttype keuze
 * 
 * @param {type} sType
 * @returns {undefined}
 */
function vluchtType(sType) {
  var eRetourDatum = document.getElementById('retourdatum');
  var eLabelRetourDatum = document.getElementById('labelRetourdatum');
  
  if (sType === 'enkel') {
    //geen retour datum
    var sClass = eRetourDatum.className.replace('required', '');
    eRetourDatum.className = sClass;
    eRetourDatum.disabled = true;
    eRetourDatum.style.display = 'none';
    eLabelRetourDatum.style.display = 'none';
  } else {
    var sClass = eRetourDatum.className + ' required';
    eRetourDatum.className = sClass;
    eRetourDatum.disabled = false;
    eRetourDatum.style.display = 'inline';
    eLabelRetourDatum.style.display = 'inline';
  }
}
/**Controleert dynamisch het aantal passagiernamen
 * passagier 1 blijft steeds bestaan
 * 
 * Dependency : aanwezigheid van html element "span#extras"
 * 
 * @returns {undefined}
 */
function passagierNamen() {
  //aantallen velden
  var eVolw = document.frmVlucht.volwassenen;
  var eKind = document.frmVlucht.kinderen;
  var ePeut = document.frmVlucht.peuters;
  var eExtras = document.getElementById('extras');
  
  if (!validateField(eVolw) || !validateField(eKind) || !validateField(ePeut)) {
//    var bVolw = validateField(eVolw);
//    var bKind = validateField(eKind);
//    var bPeut = validateField(ePeut);
//    console.log('eVolw valid: %s, eKind valid: %s, ePeut valid: %s',
//                bVolw, bKind, bPeut);
    return;
  }
  
  //veld getalwaarden
  var nVolw = parseInt(eVolw.value);
  var nKind = (eKind.value === '') ? 0 : parseInt(eKind.value);
  var nPeut = (ePeut.value === '') ? 0 : parseInt(ePeut.value);
  var nPassagiers = nVolw + nKind + nPeut;
  var sInhoud = '';
  
  for (var i = 0; i < nPassagiers - 1; i++) {
    sInhoud += maakPassagier(i + 2);
  }
  eExtras.innerHTML = sInhoud;
}
/**Maak een label en input "text" voor passagiernaam
 *  * 
 * @param {type} i
 * @returns {string} , html string voor innerHTML
 */
function maakPassagier(i) {
  var str = '';
  str += '<label for="passagier' + i + '">Passagier ' + i + ': </label>\n';
  str += '<input type="text" name="passagier' + i + '" id="passagier' + i + 
          '" title="voor- en familienaam van de passagier"\n\ \n\
            class="extra_p text required">\n';
  str += '<br>\n';
  return str;
}