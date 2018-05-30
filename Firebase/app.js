$(function() {

    $('#login-form-link').click(function(e){
        $("#login-form").delay(100).fadeIn(100);
        $("#register-form").fadeOut(100);
        $('#register-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });
    $('#register-form-link').click(function(e){
        $("#register-form").delay(100).fadeIn(100);
        $("#login-form").fadeOut(100);
        $('#login-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });

    $('.fblogo').click(fbLogin);
});




var sendEmail = function(){
    var user = firebase.auth().currentUser;

    user.sendEmailVerification()
    .then(function(){
        console.log('El correo se envió');
    },function(error){
        console.log(error)
    })
}


// Crear Usuario
var createUser = function(){
    var email = $('#email-new').val();
    var password = $('#password-new').val();

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(data){
        console.log(data)
       
        sendEmail();
    })
    .catch(function(error){
        console.log(error)
    })
    getUser();
    return false;
}

var getUser = function(){
    firebase.auth().onAuthStateChanged(function(user){
        if (user) {
            console.log(user)
            $('.saludo').html('Tu usuario es: <b>' + user.email + '</b>');
            $('#access').hide();
            $('#logged').show();
        } else {
            $('#logged').show();
            $('#access').hide();
        }
    })
}




var login = function(){
    // id de los input para 
    var email = $('#email').val();
    var password = $('#password').val();

    firebase.auth().signInWithEmailAndPassword(email,password)
    .catch(function(error){
        console.log(error)
    })
  getUser();
}
//Método para salir
var logout = function() {
    firebase.auth().signOut()
    .then(function(){
        console.log('Ya termino la sesion')
       
    }, function(error){
       console.log(error);
    })   
   
   }
//Método para recuperar contraseña
 var recoverPass = function(){
     var auth = firebase.auth();
     var emailAddress = $('#email').val();

     auth.sendPasswordResetEmail(emailAddress).then(function(){
        alert('Se ha enviado un correo a su cuenta. Por favor siga los pasos indicados.');
     }, function (error){
        console.log(error)
     })
 }  

 //Método para entrar con facebook

 var fbLogin = function(){
    
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then(function(result){
        console.log(result)
    }, function(error){
        console.log(error)
    })
 }




 /*********************************/
 /***SECCION DE LA BASE DE DATOS***/
 /*********************************/

 

var db2 = firebase.database().ref('/cliente/');
var db3 = firebase.database().ref('/prestamo/');
var db4 = firebase.database().ref('/empleado/');
var db5 = firebase.database().ref('/pago/'); //pagos de los clientes

//Método para consultar Clientes//
/*******************************/
db2.on('value',function(snapshot){

    var clientes = snapshot.val();
    $("#clientesTable tbody").empty();
    var row = "";
    for(cliente in clientes){
        row += '<tr id="'+ cliente +'">' +
        '<td class="IdCliente">'+ clientes[cliente].IdCliente +'</td>'+
        '<td class="Nombre">'+ clientes[cliente].Nombre +'</td>'+
        '<td class="Primer_Apellido">'+ clientes[cliente].Primer_Apellido +'</td>'+
        '<td class="Segundo_Apellido">'+ clientes[cliente].Segundo_Apellido +'</td>'+
        '<td class="Domicilio">'+ clientes[cliente].Domicilio +'</td>'+
        '<td class="Email">'+ clientes[cliente].Email +'</td>'+
        '<td class="Telefono">'+ clientes[cliente].Telefono +'</td>'+
        '<td><div class="btnEditar btn btn-warning glyphicon glyphicon-edit">Modificar</div></td>'+
        '<td><div class="btnDelete btn btn-danger glyphicon glyphicon-remove">Eliminar</div></td>'+
        '</tr>'
    }
    $("#clientesTable tbody").append(row);
    row="";
     
    // $("#btnGuardarCliente").click(guardarCliente);
    //Método para Eliminar

    $("btnDelete").click(function(){
        var clientesID = $(this).closest('tr').attr('id');
        db2.child(clientesID).remove();

    })

    
    //Método para Editar a los clientes
    $(".btnEditar").click(function(){
        var clientesID = $(this).closest('tr').attr('id');

        $("#Nombre").val($('#'+clientesID).find(".Nombre").text());
        $("#Primer_Apellido").val($('#'+clientesID).find(".Primer_Apellido").text());
        $("#Segundo_Apellido").val($('#'+clientesID).find(".Segundo_Apellido").text());
        $("#Domicilio").val($('#'+clientesID).find(".Domicilio").text());
        $("#Email").val($('#'+clientesID).find(".Email").text());
        $("#Telefono").val($('#'+clientesID).find(".Telefono").text());

        //Metodo para que actualizar los datos
        $("#btnGuardarCliente").text("Actualizar").removeClass("btn-primary").addClass("btn-warning").unbind("click").click(function(){
            db2.child(clientesID).update({

                Nombre: $("#Nombre").val(),
                Primer_Apellido: $("#Primer_Apellido").val(),
                Segundo_Apellido: $("#Segundo_Apellido").val(),
                Domicilio: $("#Domicilio").val(),
                Email: $("#Email").val(),
                Telefono: $("#Telefono").text(),
                

            }, function(){
                $("#Nombre").val(""),
                $("#Primer_Apellido").val(""),
                $("#Segundo_Apellido").val(""),
                $("#Domicilio").val(""),
                $("#Email").val(""),
                $("#Telefono").val(""),
                $("btnGuardarCliente").text("Enviar").removeClass("btn-warning").addClass("btn-primary").unbind("click").click(guardarCliente);

            })
        })
    })


},function(errorObject){
 console.log("The read failed" + errorObject.code);
})

//Método para guardar Clientes//
/******************************/
 var guardarCliente = function(){
    var Id_cliente = $("#IdCliente").val();

     var dataCliente = {
         IdCliente: Id_cliente,
         Nombre:$("#Nombre").val(),
         Primer_Apellido:$("#Primer_Apellido").val(),
         Segundo_Apellido:$("#Segundo_Apellido").val(),
         Domicilio:$("#Domicilio").val(),
         Email:$("#Email").val(),
         Telefono:$("#Telefono").val()
     }


     //Método para no repetir el mismo IdCliente
       db2.orderByChild('IdCliente')
       .equalTo(Id_cliente)
       .once('value',function(snapshot){
          if(snapshot.hasChildren()){
              $('#myModal').modal('show');
          }else{
               db2.push().set(dataCliente)
               location.reload();
          }
      })
    
 }
 
$("#btnGuardarCliente").click(guardarCliente);

//Método para consultar prestamos
 db3.on('value',function(snapshot){

    var prestamos = snapshot.val();
    $("#prestamosTable tbody").empty();
    var row = "";
    for(prestamo in prestamos){
        row += '<tr id="'+ prestamo +'">' +
        '<td class="IdPrestamos">'+ prestamos[prestamo].IdPrestamos +'</td>'+
        '<td class="IdCliente">'+ prestamos[prestamo].IdCliente +'</td>'+
        '<td class="IdEmpleado">'+ prestamos[prestamo].IdEmpleado +'</td>'+
        '<td class="Monto">'+ prestamos[prestamo].Monto +'</td>'+
        '<td class="Plazo">'+ prestamos[prestamo].Plazo +'</td>'+
        '<td class="Intereses">'+ prestamos[prestamo].Intereses +'</td>'+
        '<td class="Fecha">'+ prestamos[prestamo].Fecha +'</td>'+
        '<td class="Hora">'+ prestamos[prestamo].Hora +'</td>'+
        '<td><div class="btnEdit btn btn-warning glyphicon glyphicon-edit">Modificar</div></td>'+
        '<td><div class="btnDelete btn btn-danger glyphicon glyphicon-remove">Eliminar</div></td>'+
        '</tr>'
    }
    $("#prestamosTable tbody").append(row);
    row="";
},function(errorObject){
 console.log("The read failed" + errorObject.code);
})


 //Método para guardar Prestamos//
 /******************************/
 var guardarPrestamos = function(){
    var dataPrestamos = {
        IdPrestamos:$("#IdPrestamos").val(),
        IdCliente:$("#IdCliente").val(),
        IdEmpleado:$("#IdEmpleado").val(),
        Monto:$("#Monto").val(),
        Plazo:$("#Plazo").val(),
        Intereses:$("#Intereses").val(),
        Fecha:$("#Fecha").val(),
        Hora:$("#Hora").val()
    }
    db3.push().set(dataPrestamos);
    location.reload();
}
$("#btnGuardarPrestamos").click(guardarPrestamos);
 
//Método para consultar emppleados
db4.on('value',function(snapshot){

    var empleados = snapshot.val();
    $("#empleadosTable tbody").empty();
    var row = "";
    for(empleado in empleados){
        row += '<tr id="'+ empleado +'">' +
        '<td class="IdEmpleado">'+ empleados[empleado].IdEmpleado +'</td>'+
        '<td class="TipoEmp">'+ empleados[empleado].Tipo +'</td>'+
        '<td class="NombreEmp">'+ empleados[empleado].Nombre +'</td>'+
        '<td class="apaternoEmp">'+ empleados[empleado].Primer_Apellido +'</td>'+
        '<td class="amaternoEmp">'+ empleados[empleado].Segundo_Apellido +'</td>'+
        '<td class="telefonoEmp">'+ empleados[empleado].Telefono +'</td>'+
        '<td class="domicilioEmp">'+ empleados[empleado].Domicilio +'</td>'+
        '<td class="emailEmp">'+ empleados[empleado].Correo_Electronico +'</td>'+
        '<td class="cuentaEmp">'+ empleados[empleado].N_de_Cuenta +'</td>'+
        '<td><div class="btnEdit btn btn-warning glyphicon glyphicon-edit">Modificar</div></td>'+
        '<td><div class="btnDelete btn btn-danger glyphicon glyphicon-remove">Eliminar</div></td>'+
        '</tr>'
    }
    $("#empleadosTable tbody").append(row);
    row="";
},function(errorObject){
 console.log("The read failed" + errorObject.code);
})

//Método para Guardar Empleados//
/******************************/
var guardarEmpleados = function(){
    var dataEmpleados = {
        IdEmpleado:$("#IdEmpleado").val(),
        Tipo:$("#TipoEmp").val(),
        Nombre:$("#NombreEmp").val(),
        Primer_Apellido:$("#apaternoEmp").val(),
        Segundo_Apellido:$("#amaternoEmp").val(),
        Telefono:$("#telefonoEmp").val(),
        Domicilio:$("#domicilioEmp").val(),
        Correo_Electronico:$("#emailEmp").val(),
        N_de_Cuenta:$("#cuentaEmp").val(),
        
    }
    db4.push().set(dataEmpleados);
    location.reload();
}
$("#btnGuardarEmpleados").click(guardarEmpleados);


//Método para consultar Pagos de los Clientes
db5.on('value',function(snapshot){

    var pagos = snapshot.val();
    $("#pagosTable tbody").empty();
    var row = "";
    for(pago in pagos){
        row += '<tr id="'+ pago +'">' +
        '<td class="IdPago">'+ pagos[pago].IdPago +'</td>'+
        '<td class="IdCliente">'+ pagos[pago].IdCliente +'</td>'+
        '<td class="IdPrestamo">'+ pagos[pago].IdPrestamo +'</td>'+
        '<td class="IdEmpleado">'+ pagos[pago].IdEmpleado +'</td>'+
        '<td class="montoPago">'+ pagos[pago].Monto_a_Pagar +'</td>'+
        '<td class="adeudoPago">'+ pagos[pago].Adeudo +'</td>'+
        '<td class="fechaPago">'+ pagos[pago].Fecha +'</td>'+
        '<td class="horaPago">'+ pagos[pago].Hora +'</td>'+
        '<td><div class="btnEdit btn btn-warning glyphicon glyphicon-edit">Modificar</div></td>'+
        '<td><div class="btnDelete btn btn-danger glyphicon glyphicon-remove">Eliminar</div></td>'+
        '</tr>'
    }
    $("#pagosTable tbody").append(row);
    row="";
},function(errorObject){
 console.log("The read failed" + errorObject.code);
})
//Método para  pagos de clientes//
/*******************************/
var guardarPagosYCobros = function(){
    var dataPagos = {
        IdPago:$("#IdPago").val(),
        IdCliente:$("#IdCliente").val(),
        IdPrestamo:$("#IdPrestamo").val(),
        IdEmpleadod:$("#IdEmpleado").val(),
        Monto_a_Pagar:$("#montoPago").val(),
        Adeudo:$("#adeudoPago").val(),
        Fecha:$("#fechaPago").val(),
        Hora:$("#horaPago").val(),
        
        
    }
    db5.push().set(dataPagos);
    location.reload();
}
$("#btnGuardarPagos").click(guardarPagosYCobros);
 