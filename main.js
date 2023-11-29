// Se define los productos existentes en la tienda virtual con sus respectivos atributos.
const productos = [
  {
    id: 1,
    nombre: "Leche",
    precio: 3900,
  },
  {
    id: 2,
    nombre: "Pan",
    precio: 3500,
  },
  {
    id: 3,
    nombre: "Jamon",
    precio: 2300,
  },
  {
    id: 4,
    nombre: "Galletas",
    precio: 5000,
  },
  {
    id: 5,
    nombre: "Yogurt",
    precio: 4000,
  },
  {
    id: 6,
    nombre: "Carton De Huevos",
    precio: 17000,
  },
  {
    id: 7,
    nombre: "Helado",
    precio: 13500,
  },
  {
    id: 8,
    nombre: "Café",
    precio: 12000,
  },
  {
    id: 9,
    nombre: "Queso",
    precio: 10000,
  },
  {
    id: 10,
    nombre: "Mantequilla",
    precio: 1300,
  },
];

//se crea una variable global para almacenar los productos adquiridos por el cliente
const productoFactura = [];
// se llama a la función para mostra los productos en la vista
listarProductos(productos);
// se agrega la fecha actual a la clave de fechaFactura
localStorage.setItem("fechaFactura", new Date().toLocaleDateString());

function listarProductos (productos){
  let div = document.getElementById("productosTienda");
  let body = '<table style="margin-left: 8px;" class="table table-striped table-bordered"><thead><tr><th scope="col">Nombre</th><th scope="col">Precio</th></tr></thead><tbody id="bodyproducto">';
  productos.forEach(producto =>{
      body += "<tr><td>" + producto.nombre + "</td>" +
      "<td>" + formatterPeso(producto.precio) + "</td>";
  });
  body+='</tbody></table>'
  div.innerHTML = body;
}

//Función para finalizar la compra y pedir los datos del usuario 
function finalizarCompra(){
  let cantidadP = localStorage.getItem("productos");
  if(cantidadP != null){
    let div = document.getElementById("datosFactura");
    let body = "<div class='col col-lg-10'><label class='form-label'>Nombre del Cliente</label>"+
    "<input type='text' class='form-control' id='nombre'></div><br></div>"+
    "<div class='col-lg-10'><label class='form-label'>Efectivo</label>"+
    "<input type='number' class='form-control' id='efectivo'></div><br>"+
    "<span> Valor de la factura <b>"+formatterPeso(localStorage.getItem("total"))+"</b></span> <br><br><button onclick='datosFactura()' type='button' class='btn btn-primary'>Generar Factura</button>"+
    ""
    ;
    div.innerHTML=body;
  }else{
    alert("Debe agregar los productos a comprar")
  }

}

//Función para formatear los valores numericos a peso Colombiano.
function formatterPeso(value) {
  const result = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
  return result;
}

//Función agregar producto//
function agregarProducto () {
  let nomproducto = document.getElementById("producto").value;
  let cantidad = document.getElementById("cantidad").value;

  if (nomproducto == "" || nomproducto == null) {
    alert("Debe ingresar un producto");
  }else if (cantidad == 0 || cantidad == "" || cantidad == null){
    alert("Debe ingresar un cantidad del producto a llevar");
  }else{
    let producto = productos.find((producto)=> producto.nombre.toLowerCase() == nomproducto.toLowerCase());
    if (producto == undefined) {
      alert("El nombre del producto ingresado no se encuentra registrado");
    } else {
        //se llama a la funcion y se le pasa el valor que selecciono el usuario
      //calcularProducto(sProducto);
      calcularValor(producto,cantidad);    
    }
  }
}

//Función para calcular el precio de los productos ingresados por el cliente y guardarlos en el storage
function calcularValor(producto,iCantidad){
  const precioProducto = producto.precio * iCantidad;
//Función para  agregar el iva a los productos
  let iva = precioProducto * 0.19;
  let iva19 = precioProducto - iva;
  let total = parseFloat(localStorage.getItem("total")) || 0;
  let totalIva = parseFloat(localStorage.getItem("totalIva")) || 0;

  total += precioProducto;
  totalIva += iva;

  //Agregar una nueva posicion al array
 productoFactura.push({
    nombre: producto.nombre,
    valor_Unitario: producto.precio,
    cantidad: iCantidad,
    precio_Total: precioProducto,
    valor_Iva: iva,
    precio_Sin_Iva: iva19,
  });
  // agregar los productos y los totales al storage
  localStorage.setItem("productos",JSON.stringify(productoFactura));
  localStorage.setItem('total', total);
  localStorage.setItem('totalIva',totalIva);
  alert("Producto Agregado exitosamente")
}

//Funcion para validar los datos del cliente y el efectivo
function datosFactura(){
  let nombre = document.getElementById("nombre").value;
  let efectivo = document.getElementById("efectivo").value;

  if(nombre =="" || nombre==null ){
    alert("Debe ingresar el nombre del cliente");
  }else if(efectivo==0 || efectivo == "" || efectivo ==null){
    alert("Debe ingresar el efectivo");
  }else{
      //VALIDAR EFECTIVO
      validarEfectivo(efectivo);
      localStorage.setItem("cliente",nombre);
  }

}

//Función de validación de efectivo ingresado por el cliente
function validarEfectivo(efectivo) {
  let total = parseFloat(localStorage.getItem("total"));
    if(efectivo < total){
        alert("Dinero insuficiente")
    }else{
        let cambio = efectivo-total;
        localStorage.setItem("efectivo",efectivo);
        localStorage.setItem("cambio",cambio);
        totalCompra();
    }
    
}

//Funcion para crear una tabla y llenarla con los porudctos adquiridos por el usuario
function totalCompra() {
  
  let factura = JSON.parse(localStorage.getItem("productos"));

  let div = document.getElementById("factura");
  let div2 = document.getElementById("Tablas");

  let item = '<br><h2>RESUMEN COMPRA</h2><div class="row"><div class="col-lg-6"><h5>Fecha : <b>'+localStorage.getItem("fechaFactura") +'</b></h5></div><div class="col-lg-6"><h5> Cliente: <b>'+localStorage.getItem("cliente") +'</b></h5></div></div><br><div class="row"><div class="col-lg-6"><h5>Efectivo : <b>'+formatterPeso(localStorage.getItem("efectivo")) +'</b></h5></div>'+
  '<div class="col-lg-6"><h5>Cambio : <b>'+formatterPeso(localStorage.getItem("cambio")) +'</b></h5></div></div> ';

  div.innerHTML = item;

  let itemTablas = '<table class="table table-striped table-bordered"><thead><tr><th>Producto</th><th>V/Unidad</th><th>Cantidad</th><th>Valor</th></tr></thead><tbody id="bodyFactura">';
  
  let body = "";
  let body2 = "";

  // se recorren lo diferentes productos para colocarlos en la tabla de productos e iva 

  factura.forEach(function (producto) {
    console.log(producto);
    body += "<tr><td>" + producto.nombre + "</td><td>" +
    formatterPeso(producto.valor_Unitario) +    "</td><td>" +
    producto.cantidad + "</td><td>" +
    formatterPeso(producto.precio_Total) +  "</td></tr>";

    body2 += "<tr><td>" +  producto.nombre + "</td><td>" + formatterPeso(producto.precio_Total) + "</td><td>" + formatterPeso(producto.precio_Sin_Iva) + "</td><td>" + formatterPeso(producto.valor_Iva) + "</td></tr>"; 

});

  itemTablas += body+'</tbody><tfoot><tr><th colspan="3" style="text-align: right;">TOTAL</th><td id="totalFactura">' + 
  formatterPeso(localStorage.getItem("total"))+"</td></tr></tfoot></table>";

  itemTablas +="<h2>RESUMEN IMPUESTOS</h2>" +
  '<table class="table table-striped table-bordered"><thead><tr><th>Producto</th><th>V/Total</th><th>Base</th><th>Iva</th></tr></thead><tbody id="bodyImpuestos">'+body2+'</tbody><tfoot><tr><th colspan="3" style="text-align: right;">TOTAL</th><td id="totalFactura">' + formatterPeso(localStorage.getItem("totalIva"))+ "</td></tr></tfoot></table>";

  div2.innerHTML = itemTablas;

}
