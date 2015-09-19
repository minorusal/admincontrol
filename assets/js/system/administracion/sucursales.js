jQuery(document).ready(function(){
	jQuery('#search-query').focus();
	jQuery('#search-query').keypress(function(event){
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if(keycode == '13'){  
			buscar();
		} 
	});
})
function load_content(uri, id_content){
	jQuery('#ui-id-2').hide('slow');
	var filtro = jQuery('#search-query').val();
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
           		jQuery('#a-'+id_content).html(data);
           		var chosen  = 'jQuery(".chzn-select").chosen();';
           		jQuery('#a-'+id_content).html(data+include_script(chosen));
           }
        }
    });
}
function buscar(){
	var filtro = jQuery('#search-query').val();
	jQuery.ajax({
		type:"POST",
		url: path()+"administracion/sucursales/listado",
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

function detalle(id_sucursal){
	jQuery('#ui-id-2').click();
	jQuery.ajax({
        type: "POST",
        url: path()+"administracion/sucursales/detalle",
        dataType: 'json',
        data: {id_sucursal : id_sucursal},
        success: function(data){
        	var chosen = 'jQuery(".chzn-select").chosen();';
        	jQuery('#a-0').html('');
        	jQuery('#a-2').html(data);
        	jQuery('#a-2').html(data+include_script(chosen));
        	jQuery('#ui-id-2').show('slow');
        }
    });
}
function actualizar(){
	var progress = progress_initialized('update_loader');
	jQuery('#mensajes_update').hide();
	var btn          = jQuery("button[name='actualizar']");
	btn.attr('disabled','disabled');
	var btn_text     = btn.html();	
	var incomplete   = values_requeridos();
	var id_sucursal  = jQuery('#id_sucursal').val();
    var sucursal     = jQuery('#sucursal').val();
    var clave_corta  = jQuery('#clave_corta').val();
    var razon_social = jQuery('#razon_social').val();
    var rfc          = jQuery('#rfc').val();
    var email        = jQuery('#email').val();
    var encargado    = jQuery('#encargado').val();
    var telefono     = jQuery('#telefono').val();
    var id_entidad   = jQuery("select[name='lts_entidades'] option:selected").val();
    var direccion	 = jQuery("#direccion").val();
	jQuery.ajax({
		type:"POST",
		url: path()+"administracion/sucursales/actualizar",
		dataType: "json",
		data: {incomplete:incomplete, id_sucursal:id_sucursal, sucursal:sucursal,clave_corta:clave_corta,razon_social:razon_social,rfc:rfc, email:email, encargado:encargado, telefono:telefono, id_entidad:id_entidad,direccion:direccion},
		beforeSend : function(){
			btn.attr('disabled',true);
		},
		success : function(data){
			if(data.success == 'true' ){
				jgrowl(data.mensaje);
			}else{
				jQuery("#mensajes_update").html(data.mensaje).show('slow');	
			}
		}
	  }).error(function(){
	       		progress.progressTimer('error', {
		            errorText:'ERROR!',
		            onFinish:function(){
		            }
	            });
	           btn.attr('disabled',false);
	        }).done(function(){
		        progress.progressTimer('complete');
		        btn.attr('disabled',false);
	  });
}


function agregar(){
	var progress = progress_initialized('registro_loader');
	var btn          = jQuery("button[name='save_sucursal']");
	btn.attr('disabled','disabled');
	jQuery('#mensajes').hide();
	var incomplete   = values_requeridos();
	//var id_sucursal = jQuery('#id_sucursal').val();
    var sucursal     = jQuery('#sucursal').val();
    var clave_corta  = jQuery('#clave_corta').val();
    var razon_social = jQuery('#razon_social').val();
    var rfc          = jQuery('#rfc').val();
    var tel          = jQuery('#telefono').val();
    var email        = jQuery('#email').val();
    var encargado    = jQuery('#encargado').val();
    var id_region    = jQuery("select[name='lts_regiones'] option:selected").val();
    var id_entidad   = jQuery("select[name='lts_entidades'] option:selected").val();
    var direccion    =jQuery('#direccion').val();
	jQuery.ajax({
		type:"POST",
		url: path()+"administracion/sucursales/insert_sucursal",
		dataType: "json",
		data: {incomplete :incomplete ,sucursal:sucursal, clave_corta:clave_corta, razon_social:razon_social, rfc:rfc, tel:tel, email:email, encargado:encargado, id_region:id_region, id_entidad:id_entidad, direccion:direccion },
		beforeSend : function(){
			btn.attr('disabled',true);
		},
		success : function(data){
		    if(data.success == 'true' ){
				clean_formulario();
				jgrowl(data.mensaje);
			}else{
				jQuery("#mensajes").html(data.mensaje).show('slow');	
			} 
		}
	}).error(function(){
	       		progress.progressTimer('error', {
		            errorText:'ERROR!',
		            onFinish:function(){
		            }
	            });
	           btn.attr('disabled',false);
	        }).done(function(){
		        progress.progressTimer('complete');
		        btn.attr('disabled',false);
	  });
}




