"use strict";

$(document).ready(function() {

  // Process about button: Pop up a message with an Alert
  function about() {
    alert(ODSA.AV.aboutstring(interpret(".avTitle"), interpret("av_Authors")));
  }
  $('#about').click(about);

  // Processes the reset button
  function initialize() {

    //IGNORE
    if (stack){
      stack.clear(); // clear number in the stack
    }
    if (userArr) {
      userArr.clear(); // clear the array
    }

    // generate the array
    initialArray = JSAV.utils.rand.numKeys(0, 89, arraySize, {sorted: true});

    // create the stack with the values for the student to insert
    stack = av.ds.stack({center: true, xtransition: 5, ytransition: -3});
    stack.addLast(initialArray[Math.floor(Math.random()*initialArray.length)]);

    // highlight the top number of the stack
    stack.first().highlight();
    stack.layout();

    // Create the array the user will intereact with
    userArr = av.ds.array(initialArray, {
      indexed: false,
      layout: arrayLayout.val()
    });
    // call the clickHandler
    userArr.click(clickHandler);
    userArr.addClass([0,1,2,3,4,5,6,7,8], "hiddenEl");



    return userArr;
  }



  // Create the model solution used for grading the exercise
  function modelSolution(av) {

    var modelArr = av.ds.array(initialArray, {
      indexed: true,
      layout: arrayLayout.val()
    });

    // Initialize the display or else the model answer won't show up until
    // the second step of the slideshow
	var j;
	modelArr.highlight(j + 1);

    av.displayInit();
	modelArr.unhighlight(j + 1);
		av.gradeableStep();
    return modelArr;
  }

  // Fixstate function called if continuous feedback/fix mode is used
  function fixState(modelState) {
    var modelArray = modelState[0];

    // Get the raw array elements so we can access their list of class names
    var modArrElems = JSAV.utils._helpers.getIndices($(modelArray.element).find("li"));
    var userArrElems = JSAV.utils._helpers.getIndices($(userArr.element).find("li"));

    for (var i = 0; i < modelArray.size(); i++) {
      // Fix any incorrect values
      userArr.value(i, modelArray.value(i));

      // Ensure the classes of each element in the user array match those in the model solution
      userArrElems[i].className = modArrElems[i].className;
    }
  }

  var clickHandler = function (index) {
    if (countIndWithClass(this, "selectedHiLo") < 2)
    {
      this.addClass(index, "selectedHiLo");
    }
    if (countIndWithClass(this, "selectedHiLo") == 2)
    {
      var ind = getIndicesWithClass(this, "selectedHiLo");
      var med = Math.floor((ind[0] + ind[1])/2);
      var sel = getIndicesWithClass(this, "selectedMed");
    //  this.removeClass(sel[0], "selectedMed");
    //  this.addClass(sel[0], "searchedEl");
      this.addClass(med, "selectedMed");
      this.removeClass(ind[0], "selectedHiLo");
      this.removeClass(ind[1], "selectedHiLo");

      if (this.value(med) == stack.first())
      {

      }
    }
  };

  //////////////////////////////////////////////////////////////////
  // Start processing here
  //////////////////////////////////////////////////////////////////
  var arraySize = 9,
    initialArray = [],
    stack,
    modelStack,
    stackArray,
	last_first,


  // Load the config object with interpreter created by odsaUtils.js
    config = ODSA.UTILS.loadConfig(),
    interpret = config.interpreter, // get the interpreter
    code = config.code,
    codeOptions = {after: {element: $(".instructions")}, visible: true},

    settings = config.getSettings(), // Settings for the AV
    av = new JSAV($('.avcontainer'), {
      settings: settings
    });

    av.recorded(); // we are not recording an AV with an algorithm

    // show a JSAV code instance only if the code is defined in the parameter
    // and the parameter value is not "none"
    if (code) {
      pseudo = av.code($.extend(codeOptions, code));
    }

    var exercise = av.exercise(modelSolution, initialize,
                               {compare: {css: "background-color"},
                                controls: $(".jsavexercisecontrols")});

  // This needs to be here, but don't copy to other modules
  // add the layout setting prelow, high, valference
  var arrayLayout = settings.add("layout", {
    "type": "select",
    "options": {
      "bar": "Bar",
      "array": "Array"
    },
    "label": "Array layout: ",
    "value": "array"
  });

    exercise.reset();

  // Initialize userArr
  // This needs to be here, but don't copy to other modules
  var userArr; // JSAV array
});
