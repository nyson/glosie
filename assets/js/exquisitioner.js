
function Exquisitioner(list){
    // amount of avaliable tries
    this.tries = 3;
    
    this.totalCount = 0;
    this.correctCount = 0;
    this.triesLeft = undefined;
    this.currentQIndex = undefined;
    this.list = {};
    this.ansField;
    this.dictList = $("#dictList");

    this.shuffle = function(){
	var newList = [];
	
	while(this.list.length > 0)
	    newList.push(this.list.splice(
		Math.floor(Math.random() * this.list.length),
		1
	    )[0]);

	
	this.list = newList;
    }


    // this will cause problem if we need Exquisitioner in a later state than when constructed
    var that = this;

    // On dictionary list change, change the current dictionary.
    this.dictList.change(function() {
        that.loadList(that.dictList[0].value);
    });

    // Initialize the list, setting
    this.init = function(defaultList) {
        // Refresh the dict list
        $.ajax({
	    dataType:"json",
            url: 'api.php?do=getDicts',
            error: function(a, b) {
                console.log(a, b);
            },
            success: function(lists) {
                that.dictList.empty();
                for(var i in lists) {
                    var v = lists[i];
                    var elem = $('<option value="'+v+'">'+v+'</option>');
                    that.dictList.append(elem);
                }

                // Load the default dictionary
                var ll = ListLoader.getSingleton();
                ll.load(defaultList, false, function() {
                    that.loadList(defaultList);
                });
            }
        });
    }

    // Attempt to get a list of questions from the list loader.
    // If the attempt fails, the active list remains unchanged.
    this.loadList = function (listName) {
        var ll = ListLoader.getSingleton();
        var that = this;
        ll.load(listName, false, function() {
            var list = this.list = ll.get(listName);
            if(list) {
                that.dictList.val(listName);
	        that.list = list;
	        that.startup();
            } else {
                console.log('Exquisitioner failed to load dict ' + listName);
            }
        });
    };
    this.startup = function (){

	this.score = 0;
	this.totalCount = 0;
	this.correctCount = 0;
	this.currentQIndex = undefined;
	this.triesLeft = 0;
	this.writeStatus();
	$("#log ul").empty();
	$("#question").removeClass("wrong");
	this.shuffle();
	this.newGameStart = true;
	this.getQuestion();
    };
    
    this.endGame = function (){
	var perc = Math.round(10000*(this.score / this.totalCount))/100;
	alert("You've done EVERY OBJECT! You should be proud.\n"
	      + "You have a total score of "+this.score+"/"+this.list.length+" ("+perc+"%)\nI'm resetting myself now!");
	this.startup();
    };


    this.getQuestion = function () {
	if(this.newGameStart){
	    this.newGameStart = false;
	    this.currentQIndex = 0;
	} else
	    this.currentQIndex++;
	
	if(this.currentQIndex >= this.list.length){
	    return this.endGame();
	}
	this.triesLeft = this.tries;

	
	$("#hint").html("&nbsp;");
	$("#answer").val("");
	$("#question").html(this.list[this.currentQIndex].q);

    };

    this.setAnsField = function(field) {
	this.ansField = field;
	var that = this;
	this.ansField.focus();
	this.ansField.keypress(function (e, ui) {
	    if(e.keyCode != 13)
		return;
	    
	    if(that.answer()){
		$("#question").removeClass("wrong");
		if(this.triesLeft != this.tries)
		    that.logGuess();
		that.getQuestion();
	    }
	    else {
		$("#question").addClass("wrong");
		$("#question").attr("disabled","disabled");
	    }
	});
    }

    this.answer = function () {
	var q = $("#question");
	var ans = this.ansField;
	
	if(ans.val().trim() == this.list[this.currentQIndex].a) {	    
	    this.totalCount++;
	    if(this.triesLeft != this.tries)
		this.logGuess();
	    if(this.triesLeft > 0){
		this.correctCount++;
		this.score += this.tries == this.triesLeft 
		    ? 1
		    : Math.round(this.triesLeft/this.tries/0.02)/100;
	    }
	
	    this.writeStatus();

	    return true;
	    
	}
	else if(this.triesLeft > 0){
	    this.triesLeft--;
	    if(this.triesLeft == 0)
		$("#hint").html(this.list[this.currentQIndex].a);
	    else
		$("#hint").html(this.triesLeft + " tries left!");
	    ans.val("");
	    ans.focus();
	    return false;
	}

    };

    this.logGuess = function (){

 	if($("#log ul").length == 0)
	    $("#log").append("<ul></ul>");
	var log = $("#log ul");
	var ans = this.ansField;
	var q = $("#question");

	log.prepend("<li class='"
		    + this.getCorrectnessClass()
		    + "'><strong>" + this.list[this.currentQIndex].q +"</strong> is "
		    + "<strong>" + this.list[this.currentQIndex].a +  "</strong>"
		    + "</li>");
    };

    this.writeStatus = function(){
	var stat = $("p#statistics")
	var perc = Math.round(10000*(this.score / this.totalCount))/100;

	if(this.totalCount < 5)
	    var comment = "You should probably answer "
	    + "some more questions.";
	else if(perc <= 33)
	    var comment = "You can do better! Gambattene!";
	else if(perc <= 66)
	    var comment = "You're doing good! Fight harder!";
	else if(perc <= 99)
	    var comment = "You're doing awesome! Stay cool!";
	else if(perc <= 100)
	    var comment = "You're PERFECT! You're my hero!";

	
	stat.html("You've done " + this.totalCount + " of " + this.list.length + "."
		  + "Your current score is " + this.score + "<br />"
		  + comment + "<br />"
		  + "You seem to have some trouble with the questions below: ");
    }

    this.getCorrectnessClass = function (){
	if(this.triesLeft == this.tries)
	    return "correct";
	else if(this.triesLeft == 0)
	    return "wrong";
	else
	    return "correctAfterFirstGuess";
    }
    
    if(list !== undefined)
	this.loadList(list);
}

