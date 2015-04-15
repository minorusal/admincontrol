<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Inicio extends Base_Controller {
	
	public function __construct(){
		parent::__construct();
		if(!$this->session->userdata('is_logged')){
			redirect('login');
		}
	}
	public function index(){
		$data['titulo']  = 'inicio';
		$data['mensaje'] = 'hola bienvenido';

		$this->load_view('inicio', $data);
	
	}
}