$(document).ready(function (){
    var quiz = new Exquisitioner();
    quiz.loadList('hiragana');
    quiz.setAnsField($("#answer"));
});