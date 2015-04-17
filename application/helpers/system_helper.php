<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
	
	if(!function_exists('array_2_string_format')){
		function array_2_string_format($input = array(), $glue = " ", $separator = "="){
			if(!empty($input)){
				$output = implode($glue, array_map(function ($v, $k) { return sprintf("%s$separator'%s'", $k, $v); }, $input, array_keys($input)));
			}else{
				$output = '';
			}
			return $output ;
		}
	}

    /**
	* imprime un arreglo formateado para debug
	* y detiene la ejecucion del script
	* @return array $array
	*/
	if(!function_exists('print_debug')){
		function print_debug($array){
			echo '<pre>';
			print_r($array);
			echo '</pre>';
			die();
		}
	}
?>