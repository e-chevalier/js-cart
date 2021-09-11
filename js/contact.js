"use strict";

/**
 * Función que deternina si el email tiene un formato correcto. cadena1@cadena2.xx
 * @param {*} email 
 * @returns boolean
 */

const checkEmail = (email) => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


/**
 * Función para evaluar si todos los inputs y textarea tienen un estado válido.
 * @returns boolean
 */

const isValidForm = () => {
    let status = true;

    for (let i = 0; i < 5; i++) {

        let value = $('input, textarea')[i].value;
        let valid = $('input, textarea')[i].validity.valid;
        let id = $('input, textarea')[i].id;

        if( !(valid) || value == '' ) {
            status = false;
        }

        if ( id == 'email' &&  !checkEmail(value) ) {
            status = false;
        }

    }
    return status;
}


/**
 * Función para determinar si habilitar el boton de submit en base a si el form es válido.
 */

const enableButtonSubmit = () => {

    if( isValidForm() ) {
        $('#bsubmit').removeClass('btn-outline-success');
        $('#bsubmit').addClass('btn-success');
        $('#bsubmit').prop('disabled', false);
    } else {
        $('#bsubmit').removeClass('btn-success');
        $('#bsubmit').addClass('btn-outline-success');
        $('#bsubmit').prop('disabled', true);
    }
    
}


/**
 * Agregamos evento de onblur para todos los imputs y damos en respuesta
 * visual al usuario, borde rojo si algo esta mal, borde verde si esta correcto.
 */

$('input, textarea').on('blur', function (e) {
       
    if ($(this).val() == '') { // empty value => RED
        $(this).css('border','1px solid red');
    } else if( $(this )[0].id == 'email') { // case id=email AND not empty value
        checkEmail($(this).val()) ? $(this).css('border','1px solid green') :  $(this).css('border','1px solid red');
    } else { // other cases 
        $(this).css('border','1px solid green');
    }

    enableButtonSubmit();
});


/**
 * Función para iniciar un contador descendente que sera visible en el body del modal.
 * @param {*} time 
 */

const initCountDownTimer = (time) => {

    let timeleft = time;
    let downloadTimer = setInterval( () => {
        timeleft--;
        $('#countdowntimer').html(timeleft);
        if(timeleft <= 0) {
            clearInterval(downloadTimer);
            $(location).attr('href','home.html?filterValue=all');
        }
    },1000);
    
}

/**
 * Función para el evento submit del form.
 * @param {*} event 
 */

const checkForm = (event) => {

    event.preventDefault();
    let time = 5;

    let formData = new Map();

    $('input, textarea').each( (i, element) => {
        formData.set(element.id, element.value);
    });

    $('#form').trigger("reset");
    $('#minombre').html(formData.get('nombre'));
    $('#countdowntimer').html(time);

    initCountDownTimer(time);   
}

/**
 * Agregado del evento onsubmit en el form.
 */

$('#form').on('submit', checkForm);


