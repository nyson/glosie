$(document).ready(function (){
    var quiz = new Exquisitioner();
    quiz.init('hiragana');
    quiz.setAnsField($("#answer"));
});