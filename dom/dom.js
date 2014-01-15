window.onload = function() {
    
    //change title
    var title = document.getElementById('kop');
    title.innerHTML = 'De document tree';
    
    //change text of second <li>
    var allListItems = document.getElementsByTagName('li');
    var listItems = allListItems.length; //whats the point ???
    var secondItem = allListItems[1];//index starts at 0
    secondItem.removeChild(secondItem.childNodes[0]);
    var text = document.createTextNode('C#');
    secondItem.appendChild(text);
    
    //add new item to list
    var list = document.getElementsByTagName('ul')[0];
    var newItem = document.createElement('li');
    var text = document.createTextNode('Perl');
    newItem.appendChild(text);
    list.appendChild(newItem);
   
}
;