function Exquisitioner(list){
    this.tries = 3;
    
    this.totalCount = 0;
    this.correctCount = 0;
    this.triesLeft = undefined;
    this.currentQIndex = undefined;
    this.list = {};
    this.ansField;
    this.dictList = $("#dictList");

    var that = this;

    // On dictionary list change, change the current dictionary.
    this.dictList.change(function() {
        that.loadList(that.dictList[0].value);
    });

    // Initialize the list, setting
    this.init = function(defaultList) {
        // Refresh the dict list
        $.ajax({
            url: 'api.php?do=getDicts',
            error: function(a, b) {
                console.log(a, b);
            },
            success: function(res) {
                var lists = $.parseJSON(res);
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
	this.getQuestion();
    };
    this.getQuestion = function () {
	this.triesLeft = this.tries;
	this.currentQIndex = Math.floor(Math.random()*this.list.length);
	
	$("#hint").html("&nbsp;");
	$("#answer").val("");
	$("#question").html(this.list[this.currentQIndex].q);

    };

    this.setAnsField = function(field) {
	this.ansField = field;
	this.ansField.keypress(function (e, ui) {
	    if(e.keyCode != 13)
		return;
	    
	    if(that.answer()){
		$("#question").removeClass("wrong");
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
	    if(this.triesLeft > 0)
		this.correctCount++;
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
	var stat = $("p#statistics");
	var perc = Math.round((this.correctCount / this.totalCount) * 10000) / 100;

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

	stat.find(".corrects").html(this.correctCount);
	stat.find(".totals").html(this.totalCount);
	stat.find(".percCorrect").html(perc);
	stat.find(".comment").html(comment);

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

