let españolTrad = false;

function traducir() {
    const title = document.getElementById("titleText");
    const p1 = document.getElementById("p1");
    const p2 = document.getElementById("p2");
    
    if (!españolTrad) {
        title.innerHTML = "BIENVENIDO, A ASTRO-RIDE";
        p1.innerHTML = '¡No te pierdas nuestra <b>variedad de opciones</b> para el vehículo de tus sueños!';
        p2.innerHTML = 'Nos enorgullece ofrecer las mejores experiencias con los vehículos que siempre has querido del <i>Multiverso.</i>';
        españolTrad = true;
    }
    
    else {
        title.innerHTML = "WELCOME TO ASTRO-RIDE";
        p1.innerHTML = 'Don\'t miss out on our <b>variety of options</b> for your dream vehicle!';
        p2.innerHTML = 'We pride ourselves on providing the best experiences with the vehicles you\'ve always wanted from <i>the Multiverse.</i>';
        españolTrad = false;
    }
}



function changeBG() {
    document.body.classList.toggle("light");
    document.body.classList.toggle("dark");

}