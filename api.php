<? 

function __autoload($c) {
  if(is_file("./lib/$c"))
    include "./lib/$c";
  else
    throw new Exception("Class $c is not implemented and cannot be called!");
}

$do = isset($_GET['do']) ? $_GET['do'] : 0;
switch($do) {
case 'get_all_lists':
  $d = new Directory();
case 'get_availiable_lists':
default: 
  echo "$do is not implemented!";

}