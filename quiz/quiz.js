//^^^^QUIZ.JS^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//====GLOBALS===================================================================
var oQuiz = {};
//====AUGMENTATION METHODS======================================================
//----DATE AUGMENTATION---------------------------------------------------------
Date.prototype.getWeek = function() {
  var janfirst = new Date(this.getFullYear(), 0, 1);
  return Math.ceil((((this - janfirst) / (24 * 60 * 60 * 1000)) + janfirst.getDay() + 1) / 7);
};
//====WINDOW.ONLOAD=============================================================
window.onload = function() {
  oQuiz = JSON.parse(jsonQuiz);
  oQuiz.score = [];
  console.log(oQuiz.vragen[0].vraag);
  
  var eQuiz = document.getElementById('quiz');
  eQuiz.appendChild(maakDfQuiz());
};
//====FUNCTIONS=================================================================
/**Maakt DOM document fragment voor alle vragen
 * 
 * @param {type} json
 * @returns {maakDfQuiz.dfQuiz|DocumentFragment}
 */
function maakDfQuiz(json) {
  var dfQuiz = document.createDocumentFragment();
  var aVragen = oQuiz.vragen;//aantal vragen in volledige quiz
  var nVragen = aVragen.length;
  //quiz titel
  var dDatum = new Date(oQuiz.datum);
  var sTitel = 'Quiz van week ' + dDatum.getWeek();//augmentation method, zelf schrijven
  var eTitel = document.createElement('h2');
  eTitel.appendChild(document.createTextNode(sTitel));
  dfQuiz.appendChild(eTitel);
  //quizvragen
  for (var i = 0; i < nVragen; i++) {
    //div container voor elke vraag
    var oVraag = aVragen[i];
    var eVraagContainer = document.createElement('div');
    eVraagContainer.setAttribute('class', 'vraag');
    eVraagContainer.setAttribute('data-index', i);
    eVraagContainer.setAttribute('id', 'vraag_' + i);
    if (i === 0) {
      eVraagContainer.style.zIndex = 10;
    }
    var eVraag = document.createElement('p');
    var sVraag = document.createTextNode(oVraag.vraag);
    eVraag.appendChild(sVraag);
    eVraagContainer.appendChild(eVraag);
    //eventuele images
    if (oVraag.media) {
      var eImage = document.createElement('img');
      eImage.src = '../images/' + oVraag.media;
      eVraagContainer.appendChild(eImage);
    }
    //antwoorden
    var eAntwoordenLijst = document.createElement('ul');
    var aAntwoorden = oVraag.antwoorden;
    var nAntwoorden = aAntwoorden.length;
    var nCorrect = oVraag.correct;
    
    for (var j = 0; j < nAntwoorden; j++) {
      var eAntwoord = document.createElement('li');
      var eLink = document.createElement('a');
      eLink.setAttribute('href', '#');
      eLink.setAttribute('data-index', j);
      var bCorrect = (j === nCorrect);
      eLink.setAttribute('data-correct', bCorrect);
      eLink.addEventListener('click', function(event) {
        evalVraag(event, this);
      });
      eLink.appendChild(document.createTextNode(aAntwoorden[j]));
      eAntwoord.appendChild(eLink);
      eAntwoordenLijst.appendChild(eAntwoord);
    }
    eVraagContainer.appendChild(eAntwoordenLijst);
    //navbalk naar vorige/volgende vraag
    eVraagContainer.appendChild(maakNav(i));
    //feedback
    var eFeedback = document.createElement('p');
    eFeedback.setAttribute('class', 'feedback');
    eFeedback.appendChild(document.createTextNode(oVraag.tekst));
    eVraagContainer.appendChild(eFeedback);
    
    dfQuiz.appendChild(eVraagContainer);
  }
  //extra container eindscore
  var eScoreContainer = document.createElement('div');
  eScoreContainer.setAttribute('class', 'vraag');
  eScoreContainer.setAttribute('id', 'score');
  dfQuiz.appendChild(eScoreContainer);
  
  return dfQuiz;
}
/**Evalueert antwoord op een vraag
 * 
 * @param {type} event
 * @param {type} link
 * @returns {undefined}
 */
function evalVraag(event, link) {
  event.preventDefault();
//  console.log(link.dataset['correct']);
  //zoek parent Vraagcontainer van de link
  var eVraag = function(node) {
    while(node.parentNode) {
      if (node.parentNode.className === 'vraag') {
        return node.parentNode;
      }
      node = node.parentNode;
    }
  }(link);
  var nVraag = parseInt(eVraag.dataset['index']);
  var nAntwoord = parseInt(link.dataset['index']);
  var sCorrect = link.dataset['correct'];
  var bJuist = (sCorrect === 'true');
  var sJuist = bJuist ? 'correct' : 'fout';
  oQuiz.score[nVraag] = bJuist;
  console.log(oQuiz.score);
  var eFeedback = eVraag.querySelector('p.feedback');
  var eCorrect = eFeedback.querySelector('span.correct');
  var sResultaat = 'antwoord ' + ++nAntwoord + ' was ' + sJuist;
  
  if (eCorrect) {
    eCorrect.innerHTML = sResultaat;//er was al een span
  } else {
    eFeedback.innerHTML = '<span class="correct">' + sResultaat + '</span><br>' + eFeedback.innerHTML;
  }
  eFeedback.style.display = 'block';
  eindScore();
}
/**Bepaalt eindscore en toon die in score container
 * 
 * @returns {undefined}
 */
function eindScore() {
  var nVragen = oQuiz.vragen.length;
  var nBeantwoord = 0;
  var nJuist = 0;
  var eScore = document.querySelector('#score');
  
  for (var i = 0; i < oQuiz.score.length; i++) {
    if (typeof(oQuiz.score[i]) != 'undefined') {
      ++nBeantwoord;
      if (oQuiz.score[i] === true) {
        ++nJuist;
      }
    }
  }
  var sScore = '<p class="score">Uw score is ' + nJuist + '/' + nVragen + 
          '<br>(' + nBeantwoord + ' beantwoord)</p>';
  eScore.innerHTML = sScore;
}
/**Genereert navbalk voor navigatie tussen quizvragen
 * 
 * @param {type} index
 * @returns {undefined}
 */
function maakNav(index) {
  var nMaxIndex = oQuiz.vragen.length;
  var nVorigeIndex = index - 1;
  var nVolgendeIndex = index + 1;
  
  var eNav = document.createElement('div');
  eNav.setAttribute('class', 'nav');
  
  //bij eerste vraag, geen vorige
  if (index > 0) {
    var eVorige = document.createElement('a');
    eVorige.setAttribute('href', '#');
    eVorige.setAttribute('title', 'Vorige vraag: ' + nVorigeIndex);
    eVorige.innerHTML = '&lt;&lt;';
    eVorige.addEventListener('click', function(event) {
      toonVraag(nVorigeIndex);
    });
    eNav.appendChild(eVorige);
  }
  if (index <= nMaxIndex) {
    var eVolgende = document.createElement('a');
    eVolgende.setAttribute('href', '#');
    eVolgende.setAttribute('title', 'Volgende vraag: ' + nVolgendeIndex);
    eVolgende.innerHTML = '&gt;&gt;';
    eVolgende.addEventListener('click', function(event) {
      toonVraag(nVolgendeIndex);
    });
    eNav.appendChild(eVolgende);
  }
  return eNav;
}
/**Toont vraag door z-index hoger te zetten dan de vorige vraag
 * 
 * @param {type} index
 * @returns {undefined}
 */
function toonVraag(index) {
  var eVragen = document.querySelectorAll('.vraag');
  
  for (var i = 0; i < eVragen.length; i++) {
    console.log(eVragen[i].dataset['index']);
    if (i === index) {
      eVragen[i].style.zIndex = 10;
    } else {
      eVragen[i].style.zIndex = 0;
    }
  }
}