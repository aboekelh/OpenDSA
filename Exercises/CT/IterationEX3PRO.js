/*
    global JSAV, window
    Written by Jieun Chon and Cliff Shaffer
*/

(function() {
  "use strict";

  var av, // The JSAV object
      array,
      box1,
      box2,
      box3,
      box4,
      box1b,
      box2b,
      box3b,
      box4b,
      currbox,
      labelLeft,
      arraySize, // array size
      arr, // JSAV array
      arrpos, // JSAVarray pos
      nextleft,
      nodegap,
      answerArr,
      correctAnswerArr;

  var iterationEX3PRO = {
    userInput: null, // Boolean: Tells us if user ever did anything

    clickbox: function(){
      var newLabelLeft = labelLeft;
        if(currbox != null){
          currbox.removeClass("redbox");
        }
        if(this == box1b){
          answerArr.push(1);
          currbox = box1;
        } else if(this == box2b){
          if(arrpos == -1){
            nextleft -= 120;
            arrpos = 0;
          } else {
            nextleft -= nodegap;
          }
          arr.css({left: nextleft});
          answerArr.push(2);
          currbox = box2;
        } else if(this == box3b){
          answerArr.push(3);
          currbox = box3;
        } else if(this == box4b){
          answerArr.push(4);
          currbox = box4;
        }

        // highlight button
        this.addClass("redboxh");
        this.removeClass("redboxh");

        //highlight box area
        currbox.addClass("redboxh");
        currbox.removeClass("redboxh");

        // make square
        currbox.addClass("redbox");
    },

    genAnswer: function(){
      correctAnswerArr = [];
      correctAnswerArr.push(1);
      for(var i = 0; i < arraySize; i++){
        correctAnswerArr.push(2);
        correctAnswerArr.push(3);
      }
      correctAnswerArr.push(2);
      correctAnswerArr.push(4);
    },


      // Reinitialize the exercise.
    reset: function() {
      // Reset the value of global variables.
      iterationEX3PRO.userInput = false;
      // Clear the old JSAV canvas.
      if ($("#IterationEX3PRO")) { $("#IterationEX3PRO").empty(); }
      // Set up the display
      av = new JSAV("IterationEX3PRO");


// --------------- Create random array ----------------

    //array size will be very from 3 to 5
      arraySize = Math.floor(Math.random() * 3) + 2;
      array = [];
      currbox = null;
      for(var i = 0; i < arraySize; i++){ // Give random numbers in range 1..20
          array[i] = Math.floor(Math.random() * 20) + 1;
      }

      iterationEX3PRO.genAnswer(); //generate answer array for answer check later
      answerArr = [];

      var leftMargin = 180,
          topMargin = 20,
          rect_left = leftMargin - 150,
          rect_top = topMargin + 40,
          topMargin = rect_top + 20;

      nodegap = 40;


      // blue boxes, floor 1
      var topblue = av.g.rect(rect_left, rect_top - 40, 280, 35, 10).addClass("bluebox");

      // floor 2
      av.g.rect(rect_left, rect_top, 250, 35, 10).addClass("box");
      av.g.rect(rect_left, rect_top + 20, 50, 15).addClass("box"); // for no-roung on the corner

      //floor 3 and the JSAV array contains array
      av.g.rect(rect_left, rect_top + 25, 30, 60, 10).addClass("box").css({opacity: 0.7});
      av.g.rect(rect_left + 73, rect_top + 25, 30, 60, 10).addClass("box").css({opacity: 0.9});
      arr = av.ds.array(array, {indexed: false, left: leftMargin, top: topMargin, position: "absolute"});

      //floor 4, long purple
      av.g.rect(rect_left, rect_top + 76, 300, 30, 10).addClass("box");

      //floor 5, left big purple box
      av.g.rect(rect_left, rect_top + 80, 110, 170, 10).addClass("box");
      av.g.rect(rect_left, rect_top + 76, 50, 15).addClass("box");

      //mid blue/calculate boxes ( and "set total = ..." blue box )
      var midblue1 = av.g.rect(rect_left + 130, rect_top + 120, 130, 66, 10).addClass("bluebox");
      var midblue2 = av.g.rect(rect_left + 205, rect_top + 139, 20, 32, 15).addClass("calbox");
      var midblue3 = av.g.rect(rect_left + 220, rect_top + 120, 100, 66, 10).addClass("calbox");

      // last purple floor
      av.g.rect(rect_left + 90, rect_top + 200, 240, 50, 10).addClass("box");

      // last blue box
      var botblue = av.g.rect(rect_left, rect_top - 40 + 295, 280, 35, 10).addClass("bluebox");


      // ------------------ labels ------------------------

        var initlabel = av.label("set total = 0", {left: rect_left + 5, top: rect_top - 58});
        initlabel.addClass("labels").addClass("midlabel");

        var label1 = av.label("for each item", {left: rect_left + 5, top: rect_top - 20});
        label1.addClass("labels");

        var label2 = av.label("price", {left: rect_left + 22, top: rect_top + 50});
        label2.addClass("labels");

        var label3 = av.label("do", {left: rect_left + 35, top: rect_top + 100});
        label3.addClass("labels");

        var pricelabel = av.label("set total = total + price", {left: rect_left + 140, top: rect_top + 123});
        pricelabel.addClass("labels");
        pricelabel.addClass("smalllabel");

        var lastlabel = av.label("print(total)", {left: rect_left + 5, top: rect_top + 238});
        lastlabel.addClass("labels").addClass("midlabel");;

      // ------------------ red boxes ------------------------
        box1 = av.g.rect(rect_left, rect_top - 40, 280, 35).addClass("cleanbox");
        box2 = av.g.rect(rect_left, rect_top, 350, 105).addClass("cleanbox");
        box3 = av.g.rect(rect_left, rect_top + 105, 333, 143).addClass("cleanbox");
        box4 = av.g.rect(rect_left, rect_top + 258, 280, 33).addClass("cleanbox");

        // ------------------ red boxes' buttons ------------------------
          box1b = av.g.rect(rect_left + 400, rect_top - 40, 30, 30).addClass("redboxbutton");
          box1b.click(iterationEX3PRO.clickbox);

          box2b = av.g.rect(rect_left + 400, rect_top, 30, 30).addClass("redboxbutton");
          box2b.click(iterationEX3PRO.clickbox);

          box3b = av.g.rect(rect_left + 400, rect_top + 105, 30, 30).addClass("redboxbutton");
          box3b.click(iterationEX3PRO.clickbox);

          box4b = av.g.rect(rect_left + 400, rect_top + 258, 30, 30).addClass("redboxbutton");
          box4b.click(iterationEX3PRO.clickbox);


// --------------- Move array to the right position
      arrpos = -1;
      nextleft = leftMargin; // 120 to the right

      arr.css({left: nextleft});
      av.displayInit();
      av.recorded();
    },

    // Initialise the exercise
    initJSAV: function() {
      iterationEX3PRO.reset();

      // Set up handler for reset button
      $("#reset").click(function() {
        iterationEX3PRO.reset();
      });
    },

    // Check user's answer for correctness: User's array must match answer
    checkAnswer: function() {
      if(answerArr.length !== correctAnswerArr.length){
        return false;
      }
      for(var i = 0; i < answerArr.length; i++){
        if(answerArr[i] !== correctAnswerArr[i]){
          return false;
        }
      }
      return true;
    },
  };

  window.iterationEX3PRO = window.iterationEX3PRO || iterationEX3PRO;
}());
