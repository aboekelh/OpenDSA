"use strict";

$(document).ready(function() 
{

  // Process about button: Pop up a message with an Alert
  function about()
  {
    alert(ODSA.AV.aboutstring(interpret(".avTitle"), interpret("av_Authors")));
  }
  $('#about').click(about);

  // Processes the reset button
  function initialize()
  {
    if (stack)
	{
      stack.clear(); // clear numbers in the stack
    }
    if (userArr) 
	{
      userArr.clear(); // clear the array
    }

	  // re-enable the next and insert buttons
    //document.getElementById("Next").disabled = false;
	//document.getElementById("Insert").disabled = false;

    // generate the array with a value missing
    initialArray = JSAV.utils.rand.numKeys(0, 89, arraySize - 1, {sorted: true});
    // add the blank value
    initialArray[arraySize - 1] = "";

    // create the stack with the value for the student to insert
    stack = av.ds.stack({center: true, xtransition: 5, ytransition: -3});
    stackArray = JSAV.utils.rand.numKeys(0, initialArray[arraySize - 4], 1);
    stack.addLast(stackArray[0]);

    // highlight the value in the stack
    stack.first().highlight();
    stack.layout();
	  last_first = stack.first();
    // Create the array the user will intereact with
    userArr = av.ds.array(initialArray,
    {
      indexed: true,
      layout: arrayLayout.val()
    });
    
	  // hide the elements of the array
	  userArr.addClass([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], "hiddenEl")
    return userArr;
  }

  // Create the model solution used for grading the exercise
  function modelSolution(av)
  {
    modelStack = av.ds.stack({center: true, xtransition: 5, ytransition: -3});

     modelStack.addLast(stackArray[0]);

    modelStack.layout();
    modelStack.first().highlight();
	  var modelArr = av.ds.array(initialArray,
    {
      indexed: true,
      layout: arrayLayout.val()
    });
	  modelArr.addClass([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], "hiddenEl")

    // initialize the display
    av.displayInit();

    // highlight the first value
    modelArr.highlight(0);
    var hlPos = getHighlight(modelArr);
    modelArr.removeClass(hlPos, "hiddenEl");
    av.step();

    // search for the position to insert the value
    var current_pos = 1;
    while (modelArr.value(current_pos) <= modelStack.first().value())
    {
      modelArr.highlight(current_pos);
      modelArr.removeClass(current_pos - 1, "hiddenEl")
      modelArr.unhighlight(current_pos - 1)
      current_pos++;
      av.step();
    }
    // mark the position for insertion
    var hlPos = getHighlight(modelArr)
    modelArr.addClass(hlPos + 1, "insertIndex");
    modelArr.removeClass(hlPos, "hiddenEl")
    modelArr.unhighlight(hlPos);
    av.gradeableStep();

    // start from the end of the array to make room for the new value
    modelArr.highlight(modelArr.size() - 1);
    av.step();

    // move backwards in the array
    hlPos = getHighlight(modelArr)
    var insert_pos = getIndicesWithClass(modelArr, "insertIndex")[0];
    while (hlPos > insert_pos)
    {
      if (modelArr.value(hlPos) == "")
      {
        modelArr.highlight(hlPos - 1)
        modelArr.removeClass(hlPos, "hiddenEl")
        modelArr.unhighlight(hlPos)
        hlPos = getHighlight(modelArr)
      } else
      {
        if (modelArr.value(hlPos - 1) != "")
        {
          modelArr.value(hlPos + 1, modelArr.value(hlPos))
          modelArr.value(hlPos, "")
        } else
        {
          modelArr.highlight(hlPos - 1)
          modelArr.unhighlight(hlPos)
          hlPos = getHighlight(modelArr)
        }
      }
	  // if we've reached the position to insert the value
	  if (hlPos == insert_pos)
	  {
		modelArr.value(hlPos + 1, modelArr.value(hlPos))
		modelArr.value(hlPos, "")
	  }
      av.step()
    }
	var ind = hlPos;
	var val = stackArray[0];
	modelArr.value(ind, val);
	modelStack.removeFirst();
	modelArr.unhighlight(ind);
	av.gradeableStep()
  }

  // Fixstate function called if continuous feedback/fix mode is used
  function fixState(modelState)
  {
    var modelArray = modelState[0];

    // Get the raw array elements so we can access their list of class names
    var modArrElems = JSAV.utils._helpers.getIndices($(modelArray.element).find("li"));
    var userArrElems = JSAV.utils._helpers.getIndices($(userArr.element).find("li"));

    for (var i = 0; i < modelArray.size(); i++)
    {
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

  function nextStepButton()
  {
	   var hlPos = getHighlight(userArr);

     // if we've found the position in which to insert the value
	   if (countIndWithClass(userArr, "insertIndex") > 0)
	   {
       // there is a highlighted value in the array
		   if (hlPos > -1)
       {
         // if the highlighted value is blank
			   if (userArr.value(hlPos) == "")
			   {
				    userArr.highlight(hlPos - 1)
					  userArr.removeClass(hlPos, "hiddenEl")
					  userArr.unhighlight(hlPos)
				    // update the hlPos value
				    hlPos = getHighlight(userArr)

				    // if the highlighted position matches the insert position
				    //if (hlPos = getIndicesWithClass(userArr, "insertIndex")[0])
				   // {
					        // document.getElementById("Insert").disabled = false;
				   // }
        // a highlighted number
			  } else
        {
          // if the position just before hlPos contains a number
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
		} else
    {
			userArr.highlight(userArr.size() - 1);
		}
	}
  // there is already a highlighted position
	else if (hlPos > -1)
  {
		userArr.highlight(hlPos + 1)
		userArr.removeClass(hlPos, "hiddenEl")
		userArr.unhighlight(hlPos)
	}

  // the beginning of the exercise. Highlight the first value.
  else
  {
		 userArr.highlight(0);
	   userArr.removeClass(hlPos, "hiddenEl")
  }

	 hlPos = getHighlight(userArr);
  }

  function insertButton() 
  {

	// if we have found the location to insert the value
	if (countIndWithClass(userArr, "insertIndex") > 0)
	{
		//document.getElementById("Next").disabled = true;
		var ind = getIndicesWithClass(userArr, "insertIndex")[0];
		userArr.value(ind, stack.first().value());
		stack.removeFirst();
		userArr.unhighlight(ind);
	}
	else 
	{
		var hlPos = getHighlight(userArr);
		userArr.addClass(hlPos, "insertIndex");
		userArr.unhighlight(hlPos);
	}
	//document.getElementById("Insert").disabled = true;
	//exercise.gradeableStep();
  }

  // attach the button handlers
  $('#Insert').click(insertButton);
  $('#Next').click(nextStepButton);


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

    settings = config.getSettings(); // Settings for the AV
    var av = new JSAV($('.avcontainer'), {
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
