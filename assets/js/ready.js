$(document).ready(function (){
    var quiz = new Exquisitioner();
    quiz.setAnsField($("#answer"));
    $.ajax({
	dataType: "html",
	url: "./list.lst",
	error: function (a,b) {
	    console.log(a,b);
	},
	isLocal: true,
	success: function (data){
	    var list = [];
	    data = data.split("\n");
	    for(d in data) {
		var t = data[d].split(":");
		list.push({"q": t[1], "a": t[0]});
	    }

	    quiz.loadList(list);
	    
	}
    });
});