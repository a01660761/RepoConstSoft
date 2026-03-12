$(document).ready(function () {

    $("#suma").click(function () {
        console.log("suma")
        let first = 0;
        let second = 0;
        let resultado = 0;
        first = parseInt($("#fnumber").val())
        second = parseInt($("#snumber").val());
        resultado = first + second;
        $("#result").html(resultado);
    });

    $("#resta").click(function () {
        console.log("resta")
        let first = 0;
        let second = 0;
        let resultado = 0;
        first = parseInt($("#fnumber").val())
        second = parseInt($("#snumber").val());
        resultado = first - second;
        $("#result").html(resultado);
    });

    $("#multiplicacion").click(function () {
        console.log("multiplicacion")
        let first = 0;
        let second = 0;
        let resultado = 0;
        first = parseInt($("#fnumber").val())
        second = parseInt($("#snumber").val());
        resultado = first * second;
        $("#result").html(resultado);
    });

    $("#division").click(function () {
        console.log("division")
        let first = 0;
        let second = 0;
        let resultado = 0;
        first = parseInt($("#fnumber").val())
        second = parseInt($("#snumber").val());
        resultado = first / second;
        $("#result").html(resultado);
    });


});