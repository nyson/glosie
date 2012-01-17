var standardError =  function(xhr, status, thrown) {
    console.debug(xhr,
		  "Status: " + status
		  + "\nThrown Error: " + thrown)
}

function loadList() {
    this.showLoadableLists = function(data, name){
	var dict = $("#dictionaries");
	for(d in data) {
	    var file = $("<ul>");
	    dict.append("<li><input id='"+d+"' type='checkbox' name='dict' "
			+ "value='" +d+ "' />"
			+ "<label for='"+d+"'>"+d+"</label></li>");
	    dict.append(file);

	    for(f in data[d]) { 
		var i = 0;
		for(w in data[d][f]) {
		    i++;
		}
		file.append("<li><input class='loadableList' type='checkbox' id='"+f
			    +"' name='dict' " + "value='"+f+"'' />"
			    + "<label for='"+f+"'>" + f + " ("+i+")" + "</label></li>");
	    }
	}

	$("input").click(function(e, ui) {
	    var next = $(this).parent().next();
	    var checked = $(this).attr("checked") != undefined 
		? $(this).attr("checked") 
		: false;
	    if(next.length > 0 && next[0].nodeName.toLowerCase() == "ul") {
		next.find("li input:checkbox").each(function(){
		    $(this).attr("checked", checked);
		});
	    }

	    
	});
    };

    this.loadCheckedLists = function (){
	var lists = $("input.loadableList:checked").each(function (){
	    console.debug($(this).vala0());
	});
    }



    var that = this;
    $.ajax({
	dataType: "json",
	error: standardError,
	url: "api.php",
	data: {
	    "do": "getDicts"
	},
	success: function(data) {
	    console.log(data);
	    that.showLoadableLists(data);
	}	
    });
    
    $.ajax({
	dataType:"html",
	error: standardError,
	url: "./list.lst",
	isLocal: true,
	success: function(data) {
	    var list = [];
	    data = data.split("\n");
	    for(d in data) {
		var t = data[d].split(":");
		list.push({n: t[0],f: t[1]});
	    }

	    console.debug("data length: ", list.length);
	    $(document).data("dict", list);
	    getForeignToNativeQuestion();
	}
    });
}

var counter = {
    "totalCount": 0,
    "correctCount": 0,
    "put": function(){
	var stat = $("p#statistics");
	var perc = this.correctCount / this.totalCount;
	perc = Math.round(perc * 10000) / 100;

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
}
function getForeignToNativeQuestion() {
    var list = $(document).data("dict");
    var index = Math.floor(Math.random()*list.length);
    
    $("#hint").html("");
    $("#answer").val("");
    $("#answer").data("guessedWrong", false);
    $("#question").html(list[index].f);
    $("#question").data({
	"question": list[index].f,
	"answer": list[index].n,
	"index": index
    });
    
}

function logGuess(){
    if($("#log ul").length == 0)
	$("#log").append("<ul></ul>");
    var log = $("#log ul");
    var ans = $("#answer");
    var q = $("#question");

    log.append("<li class='"
	       + (ans.data("guessedWrong") ? "wrong" : "correct")
	       + "'><strong>" + q.data("question") +"</strong> is "
	       + "<strong>" + q.data("answer") +  "</strong>"
	       + "</li>");
}


function checkAnswer() {
    var q = $("#question");
    var ans = $("#answer");
    var list = $(document).data("dict");
    
    if(ans.val().trim() == q.data("answer")) {
	counter.totalCount++;
	if(!ans.data("guessedWrong"))
	    counter.correctCount++;
	counter.put();
	return true;
    }
    else {
	$("#hint").html(q.data("answer"));
	ans.val("");
	ans.focus();
	ans.data("guessedWrong", true);
	return false;
    }

}


$(document).ready(function() {
    var ll = new loadList();
    
    $("#loadCheckedLists").click(ll.loadCheckedLists);
    $("#answer").focus();
   
    $("#answer").keypress(function (e, ui) {
	if(e.keyCode != 13)
	    return;
	
	if(checkAnswer()){
	    $("#question").removeClass("wrong");
	    logGuess();
	    getForeignToNativeQuestion();
	}
	else {
	    $("#question").addClass("wrong");
	    $("#question").attr("disabled","disabled");
	}
    });
});