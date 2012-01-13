<?
require_once("./lib/Helpers.php");
class Dictionary {
  private $dict;
  /*
    public function __construct() {
    $this->dict = array();
    }
  
    private isLoaded(){
    return !empty($this->dict);
    }
  */
  public function load($dictionary) {
    $cat = "Non-categorised";
    $dictionary = explode("\n", $dictionary);
    $i = 0;
    foreach($dictionary as $d) {
      
      if(preg_mactch(".*:.*", $d) > 0) {
	$d = explode(":", $d);
	foreach($d as &$word)
	  $word = trim($word);
	$this->dict[] = array("native" => $d[0],
			      "foreign" => $d[1],
			      "category" => $cat);
      }	
      else if(preg_match("\[.*\]", $d))
	$cat = preg_replace("\[(.*)\]", "$1", $d);
      else if("" != trim($d))
	Helpers::log("line $i: '$d' was unrecognised");
    }
  }

  public function to_json() {

  }
}