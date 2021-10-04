"use strict";

const COSTOENVIO = { "title": "Envio",
                     "description": "Costo del envio",
                     "picture_url": '',
                     "category_id": 'Envio',
                     "quantity": 1,
                     "currency_id": "ARS",
                     "unit_price": 300};

const cartToMP = (shoopingList) => {

    return shoopingList.map( prod => {
        return {
            "title": prod.name,
            "description": prod.name,
            "picture_url": 'https://jscart-echevalier.herokuapp.com/assets/img/product/'+prod.id+'.jpg',
            "category_id": prod.kind,
            "quantity": prod.qty,
            "currency_id": "ARS",
            "unit_price": prod.price
        } 
    });
}


//URLBASE
const URLBASE = 'https://api.mercadopago.com';
const ENDPOINT_CHECKOUT = '/checkout/preferences';

const URL = URLBASE + ENDPOINT_CHECKOUT;

const MYHEADERS = new Headers(
    {
        'Authorization': 'Bearer TEST-6751559386427657-091922-f671ce5d4bb109b9f2e27dd89459895b-827238650',
        'Content-Type': 'application/json'
    }
);



/**
 * FUNCION PARA REALIZAR EL CHECKOUT CON MERCADOPAGO
 * @param {*} shoopingList 
 */

const makeCheckOut = async (shoopingList) => {

    let prodsMercadoPago = cartToMP(shoopingList);

    prodsMercadoPago.push( COSTOENVIO );

    let data = { "items": prodsMercadoPago };

    let myInit = { method: 'POST',
               headers: MYHEADERS,
               body: JSON.stringify(data)
    };

    let myRequest = new Request(URL, myInit);

    fetch(myRequest).then( 
        response => response.json()
    ).then(
        data => window.location.assign(data.init_point)
    );
}

export { makeCheckOut };