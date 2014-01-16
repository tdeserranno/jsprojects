/*  Image Gallery version 1 */
var version = ' versie 1.0';
window.onload = function() {
  //elements
  var eImg = document.getElementById('plaatshouder');
  
  //version
  var eKop = document.querySelector('h1');
  eKop.innerHTML = eKop.innerHTML + version;
  
  //eventhandler voor alle hyperlinks in de menubalk
//  var eSidebar = document.querySelector('aside');
//  var eLinks = eSidebar.getElementsByTagName('a');
  eLinks = document.querySelectorAll('aside a'); //wordt global var ???!!
  console.log('sidebarLinks %s', eLinks.length);
  
  for (var i = 0; i < eLinks.length; i++) {
    eLinks[i].addEventListener('click', function(e) {
      e.preventDefault();
      toonFoto(this, eImg);
    })
  }
};
function toonFoto(eLink, eImg) {
  /* wisselt de bron van het src attribuut van img#beeld
   * @eLink   hyperlink element
   * @eImg    plaatshouder img element
   */
  console.log(eLink.href);
  eImg.src = eLink.href;
  var sInfo = eLink.getAttribute('title');
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