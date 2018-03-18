"use strict";
/*global alert: true, BST, ODSA, PARAMS */
$(document).ready(function () {
  // Process about button: Pop up a message with an Alert
  function about() {
    alert(ODSA.AV.aboutstring(interpret(".avTitle"), interpret("av_Authors")));
  }
  BST.turnAnimationOff();

  // Set click handlers
  $("#about").click(about);


  function initialize() {
     if(JSAV_EXERCISE_OPTIONS.code){
       av.clear();
       //var rand = [];
     }
     for (k = 0; k < 3; k++){
        rand[k] = Math.floor(Math.random() * ((4-2)+1) + 2);
     }
     k = 0;
     if (rand[k] == 2){
       JSAV_EXERCISE_OPTIONS.code = "processing";
       console.log("2")
       var config = ODSA.UTILS.loadConfig();
         //var interpret = config.interpreter;       // get the interpreter
       var code = config.code;                   // get the code object
       var pseudo = av.code(code[0]);
      }
     if (rand[k] == 3){
       JSAV_EXERCISE_OPTIONS.code = "java";
       console.log("3")
       var config = ODSA.UTILS.loadConfig();
       //var interpret = config.interpreter;       // get the interpreter
       var code = config.code;                   // get the code object
       var pseudo = av.code(code[0]);
     }
     if (rand[k] == 4){
       JSAV_EXERCISE_OPTIONS.code = "java_generic";
       console.log("4")
       var config = ODSA.UTILS.loadConfig();
       //var interpret = config.interpreter;       // get the interpreter
       var code = config.code;                   // get the code object
       var pseudo = av.code(code[0]);
     }

    av.umsg(interpret("av_postorder"));
    //pseudo.setCurrentLine("sig");
    av.displayInit();
    //av.recorded();

    BST.turnAnimationOff();

    function dataTest(array) {
      var bst = av.ds.binarytree();
      bst.insert(array);
      var result = bst.height() <= maxHeight;
      bst.clear();
      return result;
    }

    insertArray = JSAV.utils.rand.numKeys(10, 100, insertSize * 3, {test: dataTest, tries: 10});
    if (stack) {
      stack.clear();
    }
    stack = av.ds.stack({center: true, xtransition: 5, ytransition: -3});
    //pick the values to delete and push them in the stack
    for (var i = 0; i < insertSize *3; i++) {
      stack.addLast(insertArray[i]);
    }
    stack.first().highlight();
    stack.layout();

    if (jsavTree) {
      jsavTree.clear();
    }
    //generate random tree
    jsavTree = av.ds.binarytree({center: true, visible: true, nodegap: 25});
    do {
      initialArray = [];
      perfectBinTree(initialArray, 1, 10, 100, 3, 1);
      initialArray = initialArray.concat(JSAV.utils.rand.numKeys(10, 100, treeSize-7));
    } while (!dataTest(initialArray));
    jsavTree.insert(initialArray);
    jsavTree.click(clickHandler);
    jsavTree.layout();

    av.container.find(".jsavcanvas").css("min-height", 442);

    return jsavTree;
  }

  function modelSolution(av) {
    var i;
    av._undo = [];
    var modelStack = av.ds.stack({center: true});
    for (i = 0; i < insertSize * 3; i++) {
      modelStack.addLast(insertArray[i]);
    }
    modelStack.layout();
    modelStack.first().highlight();

    var modelTree = av.ds.binarytree({center: true, visible: true, nodegap: 20});
    modelTree.insert(initialArray);
    modelTree.layout();

    av.displayInit();
    var modelruns = 0;
    var stepcount = 0;
    var k = 0
     for(i = 0; i < insertSize * 3; i++){
       var val = insertArray[i];
       var node = modelTree.root();
       node.highlight();
       //var rand = Math.floor(Math.random() * ((4-2)+1) + 2);
       console.log(rand)
       if (rand[k] == 2){
         while(node.value() != ""){
             if (!node.left()){
               node.left("");
               modelTree.layout();
               av.step();
             }
             if (!node.right()){
               node.right("");
               modelTree.layout();
               av.step();
             }
           else if(val <= node.value()){
             node.left().highlight();
             node = node.left();
             node.edgeToParent().addClass("blueline");
             av.step();
           } else {
             node.right().highlight();
             node = node.right();
             node.edgeToParent().addClass("blueline");
             av.step();
           }
         }
      }
      if (rand[k] == 3){
        while(node.value() != ""){
            if (!node.left()){
              node.left("");
              modelTree.layout();
              av.step();
            }
            if (!node.right()){
              node.right("");
              modelTree.layout();
              av.step();
            }
          else if(val <= node.value()){
            node.left().highlight();
            node = node.left();
            node.edgeToParent().addClass("blueline");
            av.step();
          } else {
            node.left().highlight();
            node = node.left();
            node.edgeToParent().addClass("blueline");
            av.step();
          }
        }
     }
     if (rand[k] == 4){
       while(node.value() != ""){
           if (!node.left()){
             node.left("");
             modelTree.layout();
             av.step();
           }
           if (!node.right()){
             node.right("");
             modelTree.layout();
             av.step();
           }
         else if(val <= node.value()){
           node.right().highlight();
           node = node.right();
           node.edgeToParent().addClass("blueline");
           av.step();
         } else {
           node.right().highlight();
           node = node.right();
           node.edgeToParent().addClass("blueline");
           av.step();
         }
       }
    }
      node.value(val);
      stepcount++;
      removeStyle(node);
      node.left("");
      node.right("");
      removeEmpty(modelTree.root());
      modelTree.layout();
      modelStack.removeFirst();
      modelStack.layout();
      if (modelStack.first()) {
        modelStack.first().highlight();
      }

      if(stepcount == 2){
        k++
        console.log("randtemp "+ rand[k])
        stepcount = 0;
       }
       av.gradeableStep();
       av.step();
    }
    k=1;
    return modelTree;
}

  function removeStyle(node){
    if (node.edgeToParent()){
      node.unhighlight();
      node.edgeToParent().removeClass("blueline");
      node = node.parent();
      removeStyle(node);
    } else {
      node.unhighlight();
    }
  }

  function removeEmpty(node){
    if (node.value() == ""){
      node.remove();
    }
    if (node.left()){
      removeEmpty(node.left())
    }
    if (node.right()){
      removeEmpty(node.right())
    }
    if (!node.left() && !node.right()){
      return;
    }
  }

  var clickHandler = function () {
    BST.turnAnimationOff();
      if (stack.size()) {
        if (this.value() == jsavTree.root().value){
          this.highlight();
          this.addClass("thicknode");
        }
        if(this.left() || this.right()){
          this.highlight();
          this.edgeToParent().addClass("blueline");
        }
        if(!this.left()){
          this.edgeToParent().addClass("blueline");
          this.addChild("");
          this.highlight();
        }
        jsavTree.layout();
        if(!this.right()){
          this.edgeToParent().addClass("blueline");
          this.addChild("");
          this.highlight();
        }
        jsavTree.layout();
        if(this.value() == ""){
          this.value(stack.first().value());
          removeStyle(this);
          removeEmpty(jsavTree.root());
          stacksize = stacksize - 1;
          stack.removeFirst();
          stack.layout();
          exercise.gradeableStep();
        }
        if(stack.first()){
          stack.first().highlight();
        }
        jsavTree.layout();
      }
      if(stacksize == 0){
        console.log("in loop to change")
        if(JSAV_EXERCISE_OPTIONS.code){
          $('.jsavcode').hide();
        }
          if (rand[k+1] == 2){
              JSAV_EXERCISE_OPTIONS.code = "processing";
              console.log("2")
              var config = ODSA.UTILS.loadConfig();
              var interpret = config.interpreter;       // get the interpreter
              var code = config.code;                   // get the code object
              var pseudo = av.code(code[0]);
              console.log("here at 2")
          }
          if (rand[k+1] == 3){
              JSAV_EXERCISE_OPTIONS.code = "java";
              console.log("3")
              var config = ODSA.UTILS.loadConfig();
              var interpret = config.interpreter;       // get the interpreter
              var code = config.code;                   // get the code object
              var pseudo = av.code(code[0]);
              console.log("here at 3")
          }
          if (rand[k+1] == 4){
              JSAV_EXERCISE_OPTIONS.code = "java_generic";
              console.log("4")
              var config = ODSA.UTILS.loadConfig();
              var interpret = config.interpreter;       // get the interpreter
              var code = config.code;                   // get the code object
              var pseudo = av.code(code[0]);
              console.log("here at 4")
          }
          stack.first().highlight();
          stack.layout();
           function dataTest(array) {
             var bst = av.ds.binarytree();
             bst.insert(array);
             var result = bst.height() <= maxHeight;
             bst.clear();
             return result;
           }
          jsavTree.layout();
          //exercise.gradeableStep();
          $('.jsavcanvas').prepend($('.jsavcode'));
          stacksize = 2;
          k++
          runs += 1;
          console.log("value " + runs)
    }
};

  // helper function for creating a perfect binary tree

  function perfectBinTree(arr, level, min, max, levelsInTotal, arrayIndex) {
    var diff = max - min;
    var value = JSAV.utils.rand.numKey(min + Math.floor(diff / 3), max - Math.floor(diff / 3));
    arr[arrayIndex - 1] = value;
    if (level < levelsInTotal) {
      perfectBinTree(arr, level + 1, min, value - 1, levelsInTotal, 2 * arrayIndex);
      perfectBinTree(arr, level + 1, value + 1, max, levelsInTotal, 2 * arrayIndex + 1);
    }
  }

  //////////////////////////////////////////////////////////////////
  // Start processing here
  //////////////////////////////////////////////////////////////////

  // AV variables
  var initialArray = [],
      insertArray = [],
      jsavTree,
      stack,
      insertSize = 2,
      treeSize = 8,          //20 nodes
      maxHeight = 6,
      runs = 0,
      modelruns = 0,
      m = 1,
      stacksize = 2,
      k,
      j = 0,
      stepcount,
      rand = [],
      randtemp;

  var config = ODSA.UTILS.loadConfig();
  var interpret = config.interpreter;
  var code = config.code;

  //var settings = config.getSettings();
  var av = new JSAV($(".avcontainer"), {settings: settings});
  //var pseudo = av.code(code[0]);
  //var av2 = new JSAV($(".avcontainer"), {settings: settings});

  av.recorded();

  var exercise = av.exercise(modelSolution, initialize,
                              {controls: $(".jsavexercisecontrols")},
                              {feedback: "atend"}, {compare: $(".jsavtree")});

 // we are not recording an AV with an algorithm

  exercise.reset();

});
