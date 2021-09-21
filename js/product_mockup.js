"use strict";
import { Product } from './product.js';

let catalogue = [];

await fetch('./js/products.json').then(
    response => response.json()
).then( 
    data => {
        data.products.forEach( e => {
            catalogue.push( new Product(e));
        } );
    }
);

/**
 * ----------------------------------------
 * Función que retorna un array con los valores de la propiedad
 * kind que tengo en mi catalogo.
 *  
 * ----------------------------------------
 */

const getKindsFromCatalogue = () => {

    let kinds = [];
    catalogue.forEach( prod => {
        kinds.find( e => e === prod.kind) ? true : kinds.push(prod.kind);
    });
    return kinds; 
}

export { catalogue, getKindsFromCatalogue };
