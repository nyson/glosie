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
/* getDicts
   Returns an array of the names of all available dictionaries.
*/
case 'getDicts':
  $result = array();
  $dh = opendir(DICT_DIR);
  while($file = readdir($dh)) {
    if(substr($file, 0, 1) == "." || is_dir(DICT_DIR.$file))
      continue;
    $cat = "Uncategorised";
    $result[] = preg_replace('/^([a-zA-Z0-9\-_]+).*$/', '$1', $file);
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