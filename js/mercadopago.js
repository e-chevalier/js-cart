"use strict";

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

    let data = { "items": prodsMercadoPago,
                "payer": {
                    "name": "Esteban",
                    "surname": "Chevalier",
                    "email": "esteban@gmail.com",
                    "phone": {"area_code": "351",
                              "number": "2412907"},
                    "identification": {},
                    "address": {"zip_code": 5000,
                    "street_name": "FRANCISCO QUEVEDO",
                    "street_number": 1000
                    }
                }
            };

    let myInit = { method: 'POST',
               headers: MYHEADERS,
               body: JSON.stringify(data)
    };

    let myRequest = new Request(URL, myInit);

    fetch(myRequest).then( 
        response => response.json()
    ).then(
        //data => console.log(data.init_point)
        data => window.location.replace(data.init_point)
    );
}

export { makeCheckOut };