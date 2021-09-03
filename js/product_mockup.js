"use strict";
import { Product } from './product.js';

let naranja_params = {
    id: 'fruit00001',
    name: "Naranja de Ombligo",
    price: 60, 
    description: `Naranja de Ombligo, presentan unos gajos grandes y generosos en jugo, pero también en fibra insoluble, es decir carnosas, lo que las hace más aptas para naranja de mesa que para hacer zumos. También presentan la ventaja para este fin de que casi nunca tienen las incómodas pepitas que nos encontramos en otras variedades al morder.`,
    weight: 1, //kg
    discount: 0, //%
    kind: 'Frutas',
    stock: 5 //kg
}

let manzana_params = {
    id: 'fruit00002',
    name: "Manzana Gala",
    price: 90, 
    description: `Este tipo de manzana tiene una piel brillante a rayas o estrías rojas-anaranjadas sobre una base de color amarillenta.Se recomienda comer en crudo, pero también para cocer para hacer tartas y al horno.`,
    weight: 1,
    discount: 10,
    kind: 'Frutas',
    stock: 6 //kg
}

let pera_params = {
    id: 'fruit00003',
    name: "Pera Blanquilla",
    price: 85, 
    description: `También conocida como Blanca de Aranjuez, esta pera se caracteriza por tener un tamaño mediano, un color verde poco intenso y una piel lisa y brillante. Posee una carne jugosa y una semilla pequeña.`,
    weight: 1,
    discount: 5,
    kind: 'Frutas',
    stock: 100 //kg
}

let banana_params = {
    id: 'fruit00004',
    name: "Banana Cavendish",
    price: 120, 
    description: `La banana más exportada del mundo tiene una piel robusta y aguanta bien los viajes. Casi todas las bananas vendidas en Estados Unidos y Europa son de esta variedad.`,
    weight: 1,
    discount: 15,
    kind: 'Frutas',
    stock: 100 //kg
}

let frutilla_params = {
    id: 'fruit00005',
    name: "Frutilla Camarosa",
    price: 200, 
    description: `De origen californiano (EEUU), de frutos grandes y firmes, es la más consumida en Argentina. Se la considera como la variedad de fresón más cultivada en la actualidad.`,
    weight: 0.5,
    discount: 20,
    kind: 'Frutas',
    stock: 100 //kg
}

let berenjena_params = {
    id: 'veg00001',
    name: "Berenjena Negra",
    price: 140, 
    description: `Su textura aterciopelada y su sabor suavemente amargo y campestre conmueve a los paladares más exigentes. La berenjena negra es simplemente exquisita.`,
    weight: 1,
    discount: 20,
    kind: 'Vegetales',
    stock: 100 //kg
}

let brocoli_params = {
    id: 'veg00002',
    name: "Brócoli",
    price: 80, 
    description: `De color verde profundo e intenso, partiendo de un tallo firme y robusto hasta una particular e inconfundible forma irregular en su copa. El brócoli llega para regalarnos un suave pero distintivo sabor que oscila entre lo amargo y lo dulce.`,
    weight: 0.5,
    discount: 20,
    kind: 'Vegetales',
    stock: 100 //kg
}

let choclo_params = {
    id: 'veg00003',
    name: "Choclo Unidad",
    price: 80, 
    description: `Inconfundibles granos color amarillo oro. Crujientes por fuera pero suaves en su interior y, al morderlos, además nos inundan de todo su dulzor tan característico. El choclo es un vegetal tanto conocido como querido por todos.`,
    weight: 0.5,
    discount: 20,
    kind: 'Vegetales',
    stock: 100 //kg
}

let naranja = new Product(naranja_params);
let manzana = new Product(manzana_params);
let pera = new Product(pera_params);
let banana = new Product(banana_params);
let frutilla = new Product(frutilla_params);
let berenjena = new Product(berenjena_params);
let brocoli = new Product(brocoli_params);
let choclo = new Product(choclo_params);


let catalogue = [naranja, manzana, pera, banana, frutilla, berenjena, brocoli, choclo];

export { catalogue };
