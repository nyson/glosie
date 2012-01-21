$(document).ready(function (){
    var b = new Behaviours();
    var quiz = new Exquisitioner();
    quiz.init('hiragana');
    quiz.setAnsField($("#answer"));

    $("li.expander").click(function (){
	$(this).next("ul.expandable").hide();
    });
});