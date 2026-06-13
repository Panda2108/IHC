// Lógica del Proyecto 1 insertada en el proyecto principal
function validarMayoriaEdad() {
    var edadInput = document.getElementById("edad").value;
    var resultadoBox = document.getElementById("resultado");
    
    if (edadInput === "") {
        resultadoBox.value = "Por favor ingrese un valor.";
        resultadoBox.style.color = "#d32f2f";
        return;
    }
    
    var edad = parseInt(edadInput);
    
    if (edad >= 18) {
        resultadoBox.value = "Es Mayor de Edad";
        resultadoBox.style.color = "#388e3c";
    } else {
        resultadoBox.value = "Es Menor de Edad";
        resultadoBox.style.color = "#f57c00";
    }
}
