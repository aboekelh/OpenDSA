"use strict";
/*global alert: true, BST, ODSA, PARAMS */
$(document).ready(function () {
  // Process about button: Pop up a message with an Alert
  function about() {
    alert(ODSA.AV.aboutstring(interpret(".avTitle"), interpret("av_Authors")));
  }

  // Set click handlers
  $("#about").click(about);

  function removeStyle(node){
    if (node.edgeToParent()){
      node.unhighlight();
      node = node.parent();
      removeStyle(node);
    } else {
      node.unhighlight();
    }
  }

  function hideValues(node){
    if(!node){
      return;
    }
    node.value("");
    if (node.left()){
      hideValues(node.left());
    }
    if (node.right()){
      hideValues(node.right());
    }
  }

  function getIndex(node, root) {
    if (node === root) {
      return 0;
    }

    if (node.parent().left() === node) {
      return (getIndex(node.parent(), root) + 1) * 2 - 1;
    } else {
      return (getIndex(node.parent(), root) + 1) * 2;
    }
  }

  function calculateInitialData(level, min, max, levelsInTotal, arrayIndex) {
    var diff = max - min;
    var value = JSAV.utils.rand.numKey(min + Math.floor(diff / 3),
                                       max - Math.floor(diff / 3));
    initialData[arrayIndex - 1] = value;
    if (level < levelsInTotal) {
      calculateInitialData(level + 1, min, value - 1,
                           levelsInTotal, 2 * arrayIndex);
      calculateInitialData(level + 1, value + 1,
                           max, levelsInTotal, 2 * arrayIndex + 1);
    }
  }

  function initialize() {
    av._undo = [];

    BST.turnAnimationOff();

    if (jsavTree) {
      jsavTree.clear();
    }
    //generate random tree
    jsavTree = av.ds.binarytree({center: true, visible: true, nodegap: 15});
    jsavTree.click(clickHandler);


    calculateInitialData(1, 100, 1000, levels, 1);
    jsavTree.insert(initialData);
    hideValues(jsavTree.root());
    jsavTree.layout();
    keyToFind = initialData[JSAV.utils.rand.numKey(Math.floor(nodeNum / 2), nodeNum)];
    console.log(keyToFind)
    $key.html("<li>" + keyToFind + "</li>");
    av.ds.array($key, {indexed: false}).css(0, {"background-color": "#ddf"}).toggleArrow(0);

    av.container.find(".jsavcanvas").css("min-height", 442);
    console.log(keyToFind);
    return jsavTree;
  }



  function modelSolution(av) {
    var stackIndex = 0;

    modelKeyToFind = initialData[JSAV.utils.rand.numKey(Math.floor(nodeNum / 2), nodeNum)];

    var modelStack = av.ds.stack({center: true, xtransition: 5, ytransition: -1});
    //pick the values to delete and push them in the stack
    modelStack.addLast(initialData[stackIndex]);
    modelStack.first().highlight();
    modelStack.layout();


    modelTree = av.ds.binarytree({center: true, visible: true, nodegap: 15});

    modelTree.insert(initialData);
    hideValues(modelTree.root());
    modelTree.layout();

    av.container.find(".jsavcanvas").css("min-height", 442);
    console.log(initialData);
    av.displayInit();

    return modelTree;
  }



  var clickHandler = function () {
    if (!this.isHighlight()) {
      var index = getIndex(this, jsavTree.root());
      this.value(initialData[index]);
      this.highlight();
      jsavTree.layout();
      if(this.value() == keyToFind){
        var count = 1;
        while(count > 0){
          count = 0;
          keyToFind = initialData[JSAV.utils.rand.numKey(Math.floor(nodeNum / 2), nodeNum)];
          for (var i = 0; i < alreadyUsed.length; i++ ){
            if (keyToFind == alreadyUsed[i]){
              count += 1;
            }
          }
        }
        alreadyUsed[i] = keyToFind;
        console.log(keyToFind)
        $key.html("<li>" + keyToFind + "</li>");
        av.ds.array($key, {indexed: false}).css(0, {"background-color": "#ddf"}).toggleArrow(0);
      }
      exercise.gradeableStep();
    }
  };


  //////////////////////////////////////////////////////////////////
  // Start processing here
  //////////////////////////////////////////////////////////////////

  // AV variables
  var initialData = [],
      alreadyUsed = [],
      levels = 5,
      modelTree,
      modelKeyToFind,
      nodeNum = Math.pow(2, levels) - 1,
      jsavTree,
      keyToFind,
      match,
      $key = $('#keyToFind'),
      pseudo;


      // Load the configurations created by odsaAV.js
      var config = ODSA.UTILS.loadConfig();
      var interpret = config.interpreter;
      var code = config.code;

      // Create a JSAV instance
      var av = new JSAV($(".avcontainer"), {settings: settings}, {animationMode: "none"});

  av.recorded(); // we are not recording an AV with an algorithm

  var exercise = av.exercise(modelSolution, initialize,
                              {controls: $(".jsavexercisecontrols")});
  exercise.reset();
});
