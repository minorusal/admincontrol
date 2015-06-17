jQuery(document).ready(function(){
	var Buscar = jQuery('#search-query');
	Buscar.focus();
	Buscar.keyup(function(e) { if(e.which == 13) buscar(); });
});

function buscar(){
	var filtro = jQuery('#search-query').val();
	jQuery.ajax({
		type:"POST",
		url: path()+"compras/ordenes/listado",
		dataType: "json",
		data: {filtro : filtro},
		beforeSend : function(){
			jQuery("#loader").html('<img src="'+path()+'assets/images/loaders/loader.gif"/>');
		},
		success : function(data){
			var funcion = 'buscar';
        	jQuery("#loader").html('');
        	jQuery('#a-1').html(data+input_keypress('search-query', funcion));
			jQuery('#search-query').val(filtro).focus();
			tool_tips();
		}
	})
}
function load_content(uri, id_content){
	jQuery('#ui-id-2').hide('slow');
	jQuery('#ui-id-3').hide('slow');
	var filtro = jQuery('#search-query').val();
	var functions = [];
    jQuery.ajax({
        type: "POST",
        url: uri,
        dataType: 'json',
        data: {filtro : filtro, tabs:1},
        success: function(data){
           if(id_content==1){
           		var funcion = 'buscar';
           		jQuery('#a-1').html(data+input_keypress('search-query', funcion));
           		jQuery('#search-query').val(filtro).focus();
           		tool_tips();
           }else{
          	 	functions.push('jQuery(".chzn-select").chosen();');
          	 	functions.push('calendar_dual("orden_fecha","entrega_fecha")');
           		jQuery('#a-'+id_content).html(data+include_script(functions));
           }
        }
    });
}
function detalle(id_compras_orden){	
	var functions = [];
	jQuery.ajax({
        type: "POST",
        url: path()+"compras/ordenes/detalle",
        dataType: 'json',
        data: {id_compras_orden : id_compras_orden},
        success: function(data){
        	jQuery('#a-0').html('');
        	//var chosen = 'jQuery(".chzn-select").chosen();';
        	//var timepiker='jQuery(".fecha").datepicker();';
        	functions.push('jQuery(".chzn-select").chosen();');
          	functions.push('calendar_dual_detalle("orden_fecha","entrega_fecha")');
        	jQuery('#a-2').html(data+include_script(functions));
        	jQuery('#ui-id-2').show('slow');
        	jQuery('#ui-id-2').click();
        }
    });
}
function actualizar(){	
		jQuery('#mensajes_update').hide();		
		var btn          = jQuery("button[name='update']");
		btn.attr('disabled','disabled');
  		// Obtiene campos en formulario
  		var objData = formData('#formulario');
  		objData['incomplete'] = values_requeridos();
		jQuery.ajax({
			type:"POST",
			url: path()+"compras/ordenes/actualizar",
			dataType: "json",			
			data : objData,
			beforeSend : function(){
				imgLoader("#update_loader");
			},
			success : function(data){
				btn.removeAttr('disabled');
				// if(data.id==1){	}
				jQuery("#update_loader").html('');
			    jQuery("#mensajes_update").html(data.contenido).show('slow');
			}
		})
}
function eliminar(id){	
	id = (!id)?false:id;
	if(id)if(!confirm('Esta seguro de eliminar el registro: '+id)) return false; 
	jQuery('#mensajes_update').hide();		
	var btn = jQuery("button[name='eliminar']");
	btn.attr('disabled','disabled');
		// Obtiene campos en formulario
		var objData = formData('#formulario');
		objData['id_compras_orden'] = (!objData['id_compras_orden'])?id:objData['id_compras_orden'];
		objData['msj_grid'] = (id)?1:0;
	jQuery.ajax({
		type:"POST",
		url: path()+"compras/ordenes/eliminar",
		dataType: "json",			
		data : objData,
		beforeSend : function(){
			imgLoader("#update_loader");
		},
		success : function(data){
			if(data.msj_grid==1){
		    	jQuery("#mensajes_grid").html(data.contenido).show('slow');
		    	jQuery('#ico-eliminar_'+id).closest('tr').fadeOut(function(){
					jQuery(this).remove();
				});
			}else{
				jQuery("#update_loader").html('');				
			    jQuery("#mensajes_update").html(data.contenido).show('slow');
			}

		}
	});
}
function insert(){		
	var btn   = jQuery("button[name='save']");
	//btn.attr('disabled','disabled');
	jQuery('#mensajes').hide();	
	// Obtiene campos en formulario
  	var objData = formData('#formulario');
  	objData['incomplete'] = values_requeridos();
	jQuery.ajax({
		type:"POST",
		url: path()+"compras/ordenes/insert",
		dataType: "json",
		data : objData,
		beforeSend : function(){
			jQuery("#registro_loader").html('<img src="'+path()+'assets/images/loaders/loader.gif"/>');
		},
		success : function(data){
			btn.removeAttr('disabled');
			if(data.id==1){
				clean_formulario();
			}
			jQuery("#registro_loader").html('');
		    jQuery("#mensajes").html(data.contenido).show('slow');
			
		}
	});
}
function show_proveedor(id_tipo){
	if(id_tipo==1){
		jQuery('#proveedores').show('slow');
		jQuery('#prefactura').show('slow');
		jQuery('[name=id_proveedor]').addClass('requerido');
		jQuery('#prefactura_num').addClass('requerido');
	}else{
		jQuery('#proveedores').hide('slow');
		jQuery('#prefactura').hide('slow');
		jQuery('[name=id_proveedor]').removeClass('requerido');
		jQuery('#prefactura_num').removeClass('requerido');
	}
}
function show_direccion(id_sucursal){
	jQuery.ajax({
        type: "POST",
        url: path()+"compras/ordenes/show_direccion",
        dataType: 'json',
        data: {id_sucursal : id_sucursal},
        success: function(data){
          jQuery('#entrega_direccion').html(data);
        }
    });
}

function articulos(id_compras_orden){	
	var functions=[];
	jQuery.ajax({
        type: "POST",
        url: path()+"compras/ordenes/articulos",
        dataType: 'json',
        data: {id_compras_orden : id_compras_orden},
        success: function(data){
        	jQuery('#a-0').html('');
        	functions.push('jQuery(".chzn-select").chosen();');
          	functions.push('calendar_dual_detalle("orden_fecha","entrega_fecha")');
        	jQuery('#a-3').html(data+include_script(functions));
        	jQuery('#ui-id-3').show('slow');
        	jQuery('#ui-id-3').click();
        }
    });
}
function agregar_articulos(){
	var btn   = jQuery("button[name='save']");
	//btn.attr('disabled','disabled');
	jQuery('#mensajes').hide();	
	// Obtiene campos en formulario
  	var objData = formData('#formulario');
  	objData['incomplete'] = values_requeridos();
	jQuery.ajax({
		type:"POST",
		url: path()+"compras/ordenes/registrar_articulos",
		dataType: "json",
		data : objData,
		beforeSend : function(){
			jQuery("#registro_loader").html('<img src="'+path()+'assets/images/loaders/loader.gif"/>');
		},
		success : function(data){
			btn.removeAttr('disabled');
			if(data.id==1){
				clean_formulario();
			}
			jQuery("#registro_loader").html('');
		    jQuery("#mensajes").html(data.contenido).show('slow');
			
		}
	});
}
function get_orden_listado_articulo(id_compras_articulo_precios){
	id_dentificador=jQuery('#idarticuloprecios_'+id_compras_articulo_precios).val();
	if(typeof  id_dentificador =="undefined"){
		id_dentificador=0;
	}else{
		id_dentificador=id_dentificador.split('_');
	}
	if(id_dentificador==id_compras_articulo_precios){
		//jQuery("#"+id_compras_articulo_precios).remove();
	}
	else{
		jQuery.ajax({
			type:"POST",
			url: path()+"compras/ordenes/get_data_articulo",
			dataType: "json",
			data : {id_compras_articulo_precios:id_compras_articulo_precios},
			beforeSend : function(){
				jQuery("#registro_loader").html('<img src="'+path()+'assets/images/loaders/loader.gif"/>');
			},
			success : function(data){
					var validar_data = validar_exist_listado(id_compras_articulo_precios);
					if(validar_data.id==1){
						//jQuery("#mensajes_update").html(validar_data.contenido).show('slow');
					}else{
						jQuery('#dyntable2').show('slow');
						jQuery("#mensajes_update").html('').hide('slow');
						jQuery("#dyntable2 > tbody").append(data);
						//insert_orden_listado_articulo(id_compras_articulo_precios);
					}					
			}
		});
	}
}
function validar_exist_listado(id){
	var id_compras_orden = jQuery('#id_compras_orden').val();
	var validar;
	jQuery.ajax({
			type:"POST",
			url: path()+"compras/ordenes/validar_exist_listado",
			dataType: "json",
			async:false,
			data : {id_compras_articulo_precios:id,id_compras_orden:id_compras_orden},
			beforeSend : function(){
				jQuery("#registro_loader").html('<img src="'+path()+'assets/images/loaders/loader.gif"/>');
			},
			success : function(data){
					 validar= data;
			}
		});
	return validar;
}
function insert_orden_listado_articulo(id_compras_articulo_precios){
	var btn   = jQuery("button[name='save']");
	var id_compras_orden = jQuery('#id_compras_orden').val();
	//btn.attr('disabled','disabled');
	jQuery('#mensajes').hide();	
	// Obtiene campos en formulario
  	var objData = formData('#formulario');
  	objData['incomplete'] = values_requeridos();
	jQuery.ajax({
		type:"POST",
		url: path()+"compras/ordenes/insert_orden_listado_articulos",
		dataType: "json",
		data : {id_compras_articulo_precios:id_compras_articulo_precios,id_compras_orden:id_compras_orden},
		beforeSend : function(){
			jQuery("#registro_loader").html('<img src="'+path()+'assets/images/loaders/loader.gif"/>');
		},
		success : function(data){
			btn.removeAttr('disabled');
			if(data.id==1){
				clean_formulario();
			}
			jQuery("#registro_loader").html('');
		    jQuery("#mensajes").html(data.contenido).show('slow');
			
		}
	});
}
function calcula_costo2(id_compras_articulo_precios){
	var costo_sin_impuesto = parseFloat(jQuery('#costo_sin_impuesto_'+id_compras_articulo_precios).val());
	var cantidad = parseFloat(jQuery('#cantidad_'+id_compras_articulo_precios).val());
	var costo_x_cantidad=costo_sin_impuesto*cantidad;
	jQuery('#costo_x_cantidad'+id_compras_articulo_precios).html(costo_x_cantidad);
	jQuery('#costo_x_cantidad_hidden'+id_compras_articulo_precios).val(costo_x_cantidad);
	calcula_subtotal(id_compras_articulo_precios);
	update_orden_listado();
}
function calcula_subtotal(id){
	var	valor_hidden_impuesto;
	var valor_1;
	var valor_2;
	var valor_impuesto;	
	var total;
	var costo_x_cantidad_hidden = parseFloat(jQuery('#costo_x_cantidad_hidden'+id).val());
	var descuento_hidden;
	var descuento = parseFloat(jQuery('#descuento_'+id).val());
	var impuesto = parseFloat(jQuery('#impuesto_'+id).val());
	/*alert(descuento);
	if(isNaN(descuento)){
		descuento=parseFloat(jQuery('#descuento_hidden_'+id).html());
		jQuery('#descuento_hidden_'+id).val(descuento);
	}	
	alert(descuento);*/
	//SE CALCULA SUBTOTAL
	var subtotal=costo_x_cantidad_hidden-descuento;
	jQuery('#subtotal_'+id).html(subtotal);
	jQuery('#subtotal__hidden'+id).val(subtotal);
	// SE CALCULA EL VALOR DEL IMPUESTO
	valor_1=((subtotal*impuesto)/100);
	valor_impuesto = parseFloat(valor_1.toFixed(3));
	jQuery('#valor_hidden_impuesto_'+id).val(valor_impuesto);
	jQuery('#valor_impuesto_'+id).html(valor_impuesto);
	// SE CALCULA EL TOTAL
	valor_2 = subtotal+valor_impuesto;
	total = parseFloat(valor_2.toFixed(3));
	jQuery('#total_hidden_'+id).val(total);
	jQuery('#total_'+id).html(total);
	update_orden_listado();
}
function update_orden_listado(){
	var btn   = jQuery("button[name='save']");
	//btn.attr('disabled','disabled');
	jQuery('#mensajes').hide();	
	// Obtiene campos en formulario
  	var objData = formData('#formulario');
  	objData['incomplete'] = values_requeridos();
	jQuery.ajax({
		type:"POST",
		url: path()+"compras/ordenes/update_orden_listado_precios",
		dataType: "json",
		data : objData,
		beforeSend : function(){
			jQuery("#registro_loader").html('<img src="'+path()+'assets/images/loaders/loader.gif"/>');
		},
		success : function(data){
			btn.removeAttr('disabled');
			/*if(data.id==1){
				clean_formulario();
			}*/
			//jQuery("#registro_loader").html('');
		   // jQuery("#mensajes").html(data.contenido).show('slow');
			
		}
	});
}
function deshabilitar_orden_lisatdo(id){
	var id_compras_orden = jQuery('#id_compras_orden').val();
	jQuery.ajax({
        type: "POST",
        url: path()+"compras/ordenes/deshabilitar_orden_lisatdo",
        dataType: 'json',
        data: {id_compras_orden:id_compras_orden,id_compras_articulo_precios : id},
        success: function(data){
        	jQuery('#a-0').html('');
        	jQuery('#ui-id-3').show('slow');
        	jQuery('#ui-id-3').click();
        }
    });
}