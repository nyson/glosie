$(document).ready(function (){
    var quiz = new Exquisitioner();
    quiz.loadList('hiragana');
    quiz.refreshLists();
    quiz.setAnsField($("#answer"));
});