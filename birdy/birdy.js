//^^^^BIRDY.JS^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//====GLOBALS===================================================================
var oFouten = {
  required : {
    //enkel voor input type "text" en "password"
    msg : 'verplicht veld',
    test : function (elem) {
      return elem.value !== '';
    }
  },
  aantal : {
    msg : 'getal verwacht',
    test : function(elem) {
      //test enkel de inhoud als er een inhoud is
      if (elem.value !== '') {
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
//    if (bValid === true) this.submit();
  });
  //event handlers for radio "Retour" en "Enkel"
  eRetour.addEventListener('click', function() {
    vluchtType(this.value);
  });
  eEnkel.addEventListener('click', function() {
    vluchtType(this.value);
  });
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
    return !(aFoutBoodschappen.length > 0);
  }
}
/**Toon foutberichten
 * 
 * @param {type} elem
 * @param {type} errors
 * @returns {undefined}
 */
function showErrors(elem, errors) {
  var eSibling = elem.nextSibling;
  if (!eSibling || !(eSibling.nodeName === 'UL' && eSibling.className === 'fouten')) {
    eSibling = document.createElement('ul');
    eSibling.className = 'fouten';
    elem.parentNode.insertBefore(eSibling, elem.nextSibling);
  }
  //maak foutberichten als li elementen
  for (var i = 0; i < errors.length; i++) {
    var eLi = document.createElement('li');
    eLi.innerHTML = errors[i];
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
  if (eSibling && eSibling.nodeName === 'UL' && eSibling.className === 'fouten') {
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