function evaluate(){
    /*evalueert of een student geslaagd is of niet*/
//    console.log('evaluate seems to be working');

    //input elements
    var inputWiskunde = document.getElementById('wiskunde');
    var inputBoekhouden = document.getElementById('boekhouden');
    var inputInformatica = document.getElementById('informatica');
    
    //output element
    var output = document.getElementById('output');
    
    //input values
    var wiskunde = parseInt(inputWiskunde.value);
    var boekhouden = parseInt(inputBoekhouden.value);
    var informatica = parseInt(inputInformatica.value);
    
    //function logic
    var totaal = wiskunde + boekhouden + informatica;
//    console.log('Totaal: ' + totaal);
    var avg = totaal/3;
    var msg = '';
    if((wiskunde >= 6) && ((boekhouden + informatica >= 12) || (informatica === 10))){
        msg = 'U bent geslaagd';
        if (avg >= 7) {
            msg += ' met onderscheiding';
        } else {
            msg += ' met voldoening';
        }
    } else {
        msg = 'U bent gebuisd';
    }
    output.innerHTML = msg;
}
window.onload = function(){
    var button = document.getElementById('goKnop');
    button.onclick = evaluate;
}
;