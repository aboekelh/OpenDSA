"use strict";
/*global alert: true, BST, ODSA, PARAMS */
$(document).ready(function () {
  // Process about button: Pop up a message with an Alert
  function about() {
    alert(ODSA.AV.aboutstring(interpret(".avTitle"), interpret("av_Authors")));
  }

  // Set click handlers
  $("#about").click(about);

  $(document).on('click', '#RemoveNode', function() {
    if(currentNode.value() == stack.first().value()){
      highlightNext();
    }
    if (currentNode.value() == list.first().value()){
      list.removeFirst();
      list.layout();
      av.displayInit();
    }
    else{
      currentNode.value("");
      selectedNode = true;
      removeStyle(list.first());
    }
  });

  function initialize() {
    if (stack){
      stack.clear();
    }
    if (list){
      list.clear();
    }
    if (head){
      head.hide();
      av.displayInit();
    }
    if (current){
      current.target(list.get(0));
      av.displayInit();
    }

    function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
     }
     return a;
    }

    clicks = 0;

    var randInsert = JSAV.utils.rand.numKeys(10, 100, 6, {sorted: true});
    stack = av.ds.stack({center: true, xtransition: 5, ytransition: -3});
    var stackArray = JSAV.utils.rand.sample(randInsert);
    shuffle(stackArray);
    for(var i = 0; i < 4; i++){
      stack.addLast(stackArray[i]);
    }
    stack.first().highlight();
    stack.layout();


    list = av.ds.list({center: true, nodegap: 30});

    list.first("null");
    for (var i = 0; i < randInsert.length; i++){
      list.add(i, randInsert[i]);
      list.layout();
    }
    head = av.pointer("head", list.get(0));
    head.show();
    if (!current){
      current = av.pointer("current", list.get(0), {anchor: "top right"});
    }
    list.click(clickHandler);


    return list;
  }

  function modelSolution(av) {

  }

  function highlightNext() {
    stack.removeFirst();
    stack.layout();
    //higlight the next one
    if (stack.size()) {
      stack.first().highlight();
    }
  }
  function removeStyle(node){
    while(node.value() != "null"){
      node.unhighlight();
      node = node.next();
    }
  }
  function findDelete(node){
    index = 0;
    while(node.value() != ""){
      node = node.next();
      index++;
    }
    if(node.value() == "")
    return index;
  }


  var clickHandler = function () {
      if(currentNode != ""){
        current.target(this);
        this.highlight();
        av.displayInit();
        currentNode = this;
      }
      if(clicks == 1){
        findDelete(list.first());
        list.remove(index);
        previousNode.next(this);
        current.hide();
        current = av.pointer("current", list.get(0), {anchor: "top right"});
        current.show();
        list.layout();
        removeStyle(list.first());
        selectedNode = false;
        clicks = 0;
        currentNode = this;
        av.displayInit();
      }
      else if(selectedNode){
        previousNode = this;
        previousNode.highlight();
        clicks++;
      }
  };

  //////////////////////////////////////////////////////////////////
  // Start processing here
  //////////////////////////////////////////////////////////////////

  // AV variables
  var initialArray = [],
      deleteValues = [],
      selectedNode,
      previousNode,
      index,
      stack,
      list,
      head,
      clicks,
      newNode,
      currentNode,
      current,
      pseudo,

      // Load the configurations created by odsaAV.js
      config = ODSA.UTILS.loadConfig({default_code: "none"}),
      interpret = config.interpreter,

      // Settings for the AV
      settings = config.getSettings(),

      // Create a JSAV instance
      av = new JSAV($(".avcontainer"));

  av.recorded(); // we are not recording an AV with an algorithm


  var exercise = av.exercise(modelSolution, initialize,
                             {controls: $(".jsavexercisecontrols")});
  exercise.reset();
});
