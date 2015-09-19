<?php
class users_model extends Base_Model{

	/**
    * Busca Usuario por usuario y password, funcion principla de login
    * @param string $user
    * @param string $pwd
    * @return array
    */
	public function search_user_for_login($user, $pwd){
		// DB Info
		$tbl    = $this->tbl;
		$query  = "	SELECT 
						U.id_usuario
						,P.id_personal
						,CONCAT_WS(' ', P.nombre, P.paterno ,P.materno) as name
						,P.telefono
						,P.mail
						,P.avatar as avatar_user
						,Pa.id_pais
						,Pa.pais
						,Pa.dominio
						,Pa.avatar as avatar_pais
						,Pa.moneda
						,E.id_empresa
						,E.empresa
						,S.id_sucursal
						,S.sucursal
						,N.id_perfil
						,N.perfil
						,U.id_sucursales as user_id_sucursales
						,N.id_menu_n1
						,N.id_menu_n2
						,N.id_menu_n3
						,U.id_menu_n1 as user_id_menu_n1
						,U.id_menu_n2 as user_id_menu_n2
						,U.id_menu_n3 as user_id_menu_n3
						,U.timestamp
						,U.activo
						,C.user
					FROM $tbl[usuarios] U
					left join $tbl[personales] P on U.id_personal = P.id_personal
					left join $tbl[claves]     C on U.id_clave    = C.id_clave
					left join $tbl[perfiles]   N on U.id_perfil  = N.id_perfil
					left join $tbl[paises]     Pa on U.id_pais    = Pa.id_pais
					left join $tbl[empresas]   E on U.id_empresa  = E.id_empresa
					left join $tbl[sucursales] S on U.id_sucursal = S.id_sucursal
					WHERE md5(C.user) = md5('$user') AND C.pwd = '$pwd' AND U.activo = 1
					ORDER BY 
						N.id_perfil;
				";
				//print_debug($query);
		$query = $this->db->query($query);
		if($query->num_rows >= 1){
			return $query->result_array();
		}		
	}
	/**
    * Busca Usuario por su id unico de registro
    * @param integer $id_user
    * @return array
    */
	public function search_user_for_id($id_user){
		
		$tbl    = $this->tbl;
		$query  = "	SELECT 
						U.id_usuario
						,P.id_personal
						,CONCAT_WS(' ', P.nombre, P.paterno ,P.materno) as name
						,P.nombre
						,P.paterno 
						,P.materno
						,P.telefono
						,P.mail
						,P.avatar as avatar_user
						,Pa.id_pais
						,Pa.pais
						,Pa.dominio
						,Pa.avatar as avatar_pais
						,Pa.moneda
						,E.id_empresa
						,E.empresa
						,S.id_sucursal
						,S.sucursal
						,N.id_perfil
						,N.perfil
						,U.id_sucursales as user_id_sucursales
						,N.id_menu_n1
						,N.id_menu_n2
						,N.id_menu_n3
						,U.id_menu_n1 as user_id_menu_n1
						,U.id_menu_n2 as user_id_menu_n2
						,U.id_menu_n3 as user_id_menu_n3
						,U.timestamp
						,U.activo
						,U.id_usuario_reg
						,C.user
					FROM $tbl[usuarios] U
					left join $tbl[personales] P on U.id_personal = P.id_personal
					left join $tbl[claves]     C on U.id_clave    = C.id_clave
					left join $tbl[perfiles]   N on U.id_perfil  = N.id_perfil
					left join $tbl[paises]     Pa on U.id_pais    = Pa.id_pais
					left join $tbl[empresas]   E on U.id_empresa  = E.id_empresa
					left join $tbl[sucursales] S on U.id_sucursal = S.id_sucursal
					WHERE U.id_usuario = $id_user  AND U.activo = 1;
				";
		$query = $this->db->query($query);
		if($query->num_rows >= 1){
			return $query->result_array();
		}		
	}
	/**
	* Consulta los modulos a los que tiene acceso el usuario de acuerdo a su perfil (tabla perfiles),
	* y de acuerdo a permisos especiales (tabla usuarios)
	* @param string $id_menu_n1
	* @param string $id_menu_n2
	* @param string $id_menu_n3
	* @param bool $root
	* @return array
	*/
	public function search_modules_for_user($id_menu_n1= '' , $id_menu_n2= '', $id_menu_n3= '', $root = false ){
		$id_menu_n1 = ($id_menu_n1 == '') ? '0' : $id_menu_n1;
		$id_menu_n2 = ($id_menu_n2 == '') ? '0' : $id_menu_n2;
		$id_menu_n3 = ($id_menu_n3 == '') ? '0' : $id_menu_n3;
		
		$tbl = $this->tbl;
		
		if($root){
			$sys_navigate_n1 = "n1.activo = 1";
			$sys_navigate_n2 = "SELECT * FROM $tbl[menu2] WHERE activo = 1";
			$sys_navigate_n3 = "SELECT * FROM $tbl[menu3] WHERE activo = 1";
		}else{
			$sys_navigate_n1 = "n1.id_menu_n1 IN ($id_menu_n1) AND n1.activo = 1";
			$sys_navigate_n2 = "SELECT * FROM $tbl[menu2] WHERE id_menu_n2 IN ($id_menu_n2) AND activo = 1";
			$sys_navigate_n3 = "SELECT * FROM $tbl[menu3] WHERE id_menu_n3 IN ($id_menu_n3) AND activo = 1";
		}
		$query = "	SELECT 
						n1.id_menu_n1
						,n1.menu_n1
						,n1.routes as menu_n1_routes
						,n1.icon as menu_n1_icon
						,n2.id_menu_n2
						,n2.menu_n2
						,n2.routes as menu_n2_routes
						,n2.icon as menu_n2_icon
						,n3.id_menu_n3
						,n3.menu_n3
						,n3.routes as menu_n3_routes
						,n3.icon as menu_n3_icon
					FROM $tbl[menu1] n1
					LEFT JOIN ($sys_navigate_n2 )  n2 ON n1.id_menu_n1 = n2.id_menu_n1
					LEFT JOIN ($sys_navigate_n3)  n3 ON n3.id_menu_n2 = n2.id_menu_n2
					WHERE
						$sys_navigate_n1
					ORDER BY 
						n1.order, n2.order,n3.order;
				";
		$query = $this->db->query($query);
		if($query->num_rows >= 1){
			return $query->result_array();
		}		
	}

	/**
	* Consulta los usuarios para mostrarlos en lista y hacer busquedas,
	* @param array $data
	* @return array
	*/
	public function get_users($data = array()){
		// DB Info		
		$tbl = $this->tbl;
		// Query
		$aplicar_user   = (isset($data['user']))?$data['user']:false;
		$filtro         = (isset($data['buscar']))?$data['buscar']:false;
		$limit 			= (isset($data['limit']))?$data['limit']:0;
		$offset 		= (isset($data['offset']))?$data['offset']:0;
		$aplicar_limit 	= (isset($data['aplicar_limit']))?true:false;
		//$user           = ($aplicar_user)?"AND u.id_usuario <> $aplicar_user AND pe.id_perfil <> 1" : "";
		$filtro = ($filtro) ? "AND (u.id_usuario = '$filtro' OR
									pe.nombre like '%$filtro%' OR
									pe.paterno like '%$filtro%' OR
									pe.materno like '%$filtro%' OR
									p.perfil like '%$filtro%' OR
									a.area like '%$filtro%' OR
									pu.puesto like '%$filtro%' OR
									c.user like '%$filtro%')" : "";
		$limit 			= ($aplicar_limit) ? "LIMIT $offset ,$limit" : "";
		//Query
		$query = "	SELECT
						 u.id_usuario 
						,pe.id_personal
						,CONCAT_WS(' ',pe.nombre, pe.paterno, pe.materno) as name
						,pe.nombre as nom
						,pe.paterno
						,pe.materno
						,pe.telefono
						,pe.mail
						,a.id_administracion_areas
						,pu.id_administracion_puestos
						,u.id_perfil
						,c.user
						,p.perfil
						,a.area
						,pu.puesto
						,pe.edit_id_usuario
						,pe.edit_timestamp
						,pe.timestamp
					FROM $tbl[usuarios] u
					LEFT JOIN $tbl[personales] pe on pe.id_personal = u.id_personal
					LEFT JOIN $tbl[claves] c on c.id_clave = u.id_clave
					LEFT JOIN $tbl[perfiles] p on p.id_perfil = u.id_perfil
					LEFT JOIN $tbl[administracion_puestos] pu on pu.id_administracion_puestos = u.id_puesto
					LEFT JOIN $tbl[administracion_areas] a on a.id_administracion_areas = u.id_area
					WHERE u.activo = 1 AND pe.id_personal <> 1  $filtro
					ORDER BY pe.id_personal ASC
					$limit
					";
					//print_debug($query);
      	$query = $this->db->query($query);
		if($query->num_rows >= 1){
			return $query->result_array();
		}	
	}

	/**
	* Consulta usuario por id_personal de la tabla personales,
	* @param int $id_personal
	* @return array 
	*/
	public function get_user_detalle($id_personal){
		// DB Info		
		$tbl = $this->tbl;
		//Query
		$query = "	SELECT
						u.id_usuario 
						,u.id_personal
						,pe.nombre
						,pe.paterno
						,pe.materno
						,pe.telefono
						,pe.mail
						,u.id_puesto
						,u.id_area
						,u.id_perfil
						,u.timestamp
						,u.edit_id_usuario
						,u.edit_timestamp
					FROM $tbl[usuarios] u
					LEFT JOIN $tbl[personales] pe on pe.id_personal = u.id_personal
					WHERE u.id_personal = $id_personal";
		$query = $this->db->query($query);
		if($query->num_rows >= 1){
			return $query->result_array();
		}	
	}

	/**
	* Consulta usuario por nombre de usuario,
	* @param string $user
	* @return boolean
	*/
	public function get_user_by_userName($user){
		// DB Info		
		$tbl = $this->tbl;
		// Query
		$query = "SELECT c.user
				  FROM $tbl[claves] c
				  WHERE c.user = '$user'";
		$query = $this->db->query($query);
		if($query->num_rows >= 1){
			return true;
		}else{
			return false;
		}	
	}

	/**
	* Inserta los datos personales del usuario en la base de datos,
	* @param array $data
	* @return boolean
	* @return int id_row
	*/
	public function db_insert_personal($data = array()){
		// DB Info
		$tbl = $this->tbl;
		// Query
		$insert = $this->insert_item($tbl['personales'], $data, true);
		if($insert){
			return $insert;
		}else{
			return false;
		}
	}

	/**
	* Actualiza los datos personales del usuario en la base de datos,
	* @param array $data
	* @return boolean
	* @return int id_row
	*/
	public function db_update_personal($data = array()){
		// DB Info
		$tbl = $this->tbl;
		$condicion = array('id_personal ='=> $data['id_personal']);
		// Query
		$insert = $this->update_item($tbl['personales'], $data,'id_personal', $condicion);
		if($insert){
			return $insert;
		}else{
			return false;
		}
	}

	/**
	* Actualiza los id's del usuario en la base de datos,
	* @param array $data
	* @return boolean
	* @return int id_row
	*/
	public function db_update_usuarios($data = array()){
		// DB Info
		$tbl = $this->tbl;
		$condicion = array('id_personal ='=> $data['id_personal']);
		// Query
		$insert = $this->update_item($tbl['usuarios'], $data,'id_personal', $condicion);
		if($insert){
			return $insert;
		}else{
			return false;
		}
	}

	/* */
	/**
	* Inserta el nombre de usuario y password del usuario en la base de datos,
	* @param array $data
	* @return boolean
	* @return int id_row
	*/
	public function db_insert_claves($data = array()){
		// DB Info
		$tbl = $this->tbl;
		// Query
		$insert = $this->insert_item($tbl['claves'], $data, true);
		if($insert){
			return $insert;
		}else{
			return false;
		}
	}

	/**
	* Inserta elementos de usuario en la base de datos,
	* @param array $data
	* @return boolean
	*/
	public function db_insert_usuarios($data = array()){
		// DB Info
		$tbl = $this->tbl;
		// Query
		$insert = $this->insert_item($tbl['usuarios'], $data, true);
		if($insert){
			return $insert;
		}else{
			return false;
		}
	}

	/**
	* Consulta los perfiles asignados de una persona
	* @param string $id_personal
	* @return array
	*/
	public function search_data_perfil($id_personal){
		// DB Info
		$tbl = $this->tbl;
		$query = "SELECT u.id_perfil
						,p.clave_corta
						,p.perfil
			      FROM $tbl[perfiles] p
			      LEFT JOIN $tbl[usuarios] u on u.id_perfil = p.id_perfil
			      WHERE u.id_personal = $id_personal";
		$query = $this->db->query($query);
		if($query->num_rows >= 1){
			return $query->result_array();
		}else{
			return false;
		}	
	}

	/**
	* Consulta la info de un perfil en especifico
	* y de acuerdo a permisos especiales (tabla usuarios)
	* @param string $id_usuario
	* @return array
	*/
	public function search_data_perfil_usuario($id_personal,$id_perfil){
		// DB Info
		$tbl = $this->tbl;
		$query = "SELECT * FROM $tbl[usuarios] WHERE id_personal = $id_personal AND id_perfil = $id_perfil";
		print_debug($query);
		$query = $this->db->query($query);
		return $query->result_array();
	}

	public function search_data_perfil_personal($id_personal){
		// DB Info
		$tbl = $this->tbl;
		$query = "SELECT * FROM $tbl[usuarios] WHERE id_personal = $id_personal";
		print_debug($query);
		$query = $this->db->query($query);
		return $query->result_array();
	}

	/**
	*Inserta los privilegios en la tabla usuarios
	* @param array $data
	* @param bool
	*/
	public function insert_perfiles_usuario($data = array()){
		print_debug($data);
		// DB Info
		$tbl = $this->tbl;
		
		$condicion = array('id_personal ='=> $data['id_personal'],'id_perfil = '=>$data['id_perfil_tabla']);
		$update = $this->update_item($tbl['usuarios'],$data,'id_personal',$condicion);
		if($update){
			return $update;
		}else{
			return false;
		}
	}

	/**
	*Limpia los privilegios en la tabla usuarios
	* @param array $data
	* @param bool
	*/
	public function clean_perfiles_usuario($data = array()){
		// DB Info
		$tbl = $this->tbl;
		$condicion = array('id_personal ='=> $data['id_personal'],'id_perfil = '=>$data['id_perfil']);
		$clean = $this->update_item($tbl['usuarios'],$data,'id_personal',$condicion);
		if($clean){
			return $clean;
		}else{
			return false;
		}
	}

	/**
	*Busca perfiles en la tabla de usuartios
	* @param int $id_personal
	* @param int $id_perfil
	* @param array
	*/
	public function get_perfiles_usuarios($id_personal,$id_perfil){
		// DB Info
		$tbl = $this->tbl;
		//Query
		$query = "SELECT * FROM $tbl[usuarios] WHERE id_personal = $id_personal AND id_perfil = $id_perfil";
		$query = $this->db->query($query);
		if($query->num_rows >= 1){
			return $query->result_array();
		}	
	}
}
?>