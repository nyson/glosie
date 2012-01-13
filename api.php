<? 
define("DICT_DIR", "./dicts/");

function __autoload($c) {
  if(is_file("./lib/$c"))
    include "./lib/$c";
  else
    throw new Exception("Class $c is not implemented and cannot be called!");
}

$do = isset($_GET['do']) ? $_GET['do'] : "";
switch($do) {
case 'getDicts':
  $result = array();
  $dh = opendir(DICT_DIR);
  while($file = readdir($dh)) {
    if(substr($file, 0, 1) == "." || is_dir(DICT_DIR.$file))
      continue;
    $cat = "Uncategorised";
    $result[$file] = array();

    $fh = file(DICT_DIR.$file);
    while($row = array_shift($fh)) {
      if(preg_match("/#(.*)/", $row, $matches) > 0)
	$cat = trim($matches[1]);
      else if(preg_match("/([^:]*)\:([^:\n]*)/", $row, $matches) > 0){
	if(!isset($result[$file][$cat]))
	  $result[$file][$cat] = array();
	$result[$file][$cat][] = array("f" => $matches[2], "n" => $matches[1]);
      }
    }
    
    
  }
  echo json_encode($result);
  break;    
case 'get_all_lists':
  $d = new Directory();
  break;
case 'get_availiable_lists':
default: 
  echo "$do is not implemented!";

}