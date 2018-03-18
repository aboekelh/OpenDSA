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
      stack.clear(); // clear numbers in the stack
    }
    if (userArr) {
      userArr.clear(); // clear the array
    }

	// re-enable the next and insert buttons
    document.getElementById("Next").disabled = false;
	document.getElementById("Insert").disabled = false;

    // generate the array with 3 values missing
    initialArray = JSAV.utils.rand.numKeys(0, 89, arraySize - 3, {sorted: true});
    // add the blank values
    for(var i = arraySize - 2; i < arraySize; i++)
    {
        initialArray[i] = "";
    }

    // create the stack with the values for the student to insert
    stack = av.ds.stack({center: true, xtransition: 5, ytransition: -3});
    stackArray = JSAV.utils.rand.numKeys(0, initialArray[arraySize - 4], 3);
    for(var i = 0; i < stackArray.length; i++){
      stack.addLast(stackArray[i]);
    }
    // highlight the top number of the stack
    stack.first().highlight();
    stack.layout();
	last_first = stack.first();
    // Create the array the user will intereact with
    userArr = av.ds.array(initialArray, {
      indexed: true,
      layout: arrayLayout.val()
    });
    // call the clickHandler
    userArr.click(clickHandler);
    return userArr;
  }

  function Stack()
  {
      this.stac=new Array();
      this.count = 0;
      this.pop=function(){
        if (this.count > 0)
        {
          this.count--;
        }
        return this.stac.pop();
    }
    this.push=function(item){
      this.count++;
      this.stac.push(item);
    }
    this.size=function() {
      return this.count;
    }
  }

  // Create the model solution used for grading the exercise
  function modelSolution(av) {
    modelStack = av.ds.stack({center: true, xtransition: 5, ytransition: -3});
    for(var i = 0; i < stackArray.length; i++){
      modelStack.addLast(stackArray[i]);
    }
    modelStack.layout();
    modelStack.first().highlight();
	
    var modelArr = av.ds.array(initialArray, {
      indexed: true,
      layout: arrayLayout.val()
    });


	var j;
	for (j = modelArr.size() - 2; (j >= 0 && (modelArr.value(j) > modelStack.first().value() || modelArr.value(j) == "")); j--)
	{
		modelArr.value(j + 1, modelArr.value(j));
		modelArr.value(j, "");
	}
	modelArr.highlight(j + 1);
	modelArr.value(j + 1, modelStack.first().value());
	modelStack.removeFirst();
	modelStack.first().highlight();

  // Initialize the display or else the model answer won't show up until
  // the second step of the slideshow
  av.displayInit();
	modelArr.unhighlight(j + 1);
	while (modelStack.first())
	{
		var i;
		for (i = modelArr.size() - 2; (i >= 0 && (modelArr.value(i) > modelStack.first().value() || modelArr.value(i) == "")); i--)
		{
			modelArr.value(i + 1, modelArr.value(i));
			modelArr.value(i, "");
			//av.step();
		}
		modelArr.highlight(i + 1);
		modelArr.value(i + 1, modelStack.first().value());
		modelStack.removeFirst();

		if (modelStack.first())
		{
			modelStack.first().highlight();
		}

		av.gradeableStep();
		modelArr.unhighlight(i + 1);
	}
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

  function emptyHighlight()
  {
    for (var i = 0; i < userArr.size(); i++)
    {
      if (userArr.isHighlight(i) && userArr.value(i) == "")
      {
        return true;
      }
    }
    return false;
  }

  // returns the index of the highlighted value if there is one
  function getHighlight(ar)
  {
    for (var i = 0; i < ar.size(); i++)
    {
      if (ar.isHighlight(i))
      {
        return i;
      }
    }
    return -1;
  }

  // returns the index of the first non-blank value, if it exists
  function lastValueIndex()
  {
    for (var i = userArr.size() - 1;  i > 0; i--)
    {
      if (userArr.value(i) != "")
      {
        return i;
      }
    }
  }

  function nextStepButton() {
	var hlPos = getHighlight(userArr);
	var moveArr = invisibleClone(userArr, av);
//	moveStack.push(moveArr);
	if (hlPos > -1) // if the array is being searched
	{
		if (userArr.value(hlPos) == "") // if we find an empty slot
		{
			if (hlPos >=1 )
			{
				userArr.highlight(hlPos - 1);
				userArr.unhighlight(hlPos);
				hlPos = getHighlight(userArr);
			} else
			{
				// we are at the beginning of the array, disable the 'next' button
				document.getElementById("Next").disabled = true;
			}
		} else // we have found a slot with a value in it
		{
			// make sure the value hasn't already been swapped and we don't expand the array
			if (userArr.value(hlPos - 1) != "" && hlPos < userArr.size() - 1)
			{
				userArr.value(hlPos + 1, userArr.value(hlPos));
				userArr.value(hlPos, "");
			} else {
				userArr.highlight(hlPos - 1);
				userArr.unhighlight(hlPos);
				hlPos = getHighlight(userArr);
			}
		}

	}
    else { // the array isn't being searched yet
      userArr.highlight(userArr.size() - 1);
      hlPos = getHighlight(userArr);
    }
  }

  function insertButton() {
	last_first = stack.first().value();
    var ind = getHighlight(userArr);
	var moveArr = invisibleClone(userArr, av);
	// moveStack.push(moveArr);
    if (ind > -1 && userArr.value(ind) == "") // if there is a highlighted blank value,
    {
      userArr.value(ind, stack.first().value());
      stack.removeFirst();

      userArr.unhighlight(ind);
	  //exercise.gradeableStep();
    }

  	// if the stack still has values in it, highlight the top value
  	if (stack.first())
  	{
  		stack.first().highlight();
  		userArr.unhighlight(getHighlight(userArr));
  	} else { // if the stack is empty, disable the buttons
  		document.getElementById("Insert").disabled = true;
  		document.getElementById("Next").disabled = true;
  	}

  }

  // attach the button handlers
  $('#Insert').click(insertButton);
  $('#Next').click(nextStepButton);

  var clickHandler = function (index) {

  };

  //////////////////////////////////////////////////////////////////
  // Start processing here
  //////////////////////////////////////////////////////////////////
  var arraySize = 13,
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
