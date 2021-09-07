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
    stock: 66 //kg
}

let banana_params = {
    id: 'fruit00004',
    name: "Banana Cavendish",
    price: 120, 
    description: `La banana más exportada del mundo tiene una piel robusta y aguanta bien los viajes. Casi todas las bananas vendidas en Estados Unidos y Europa son de esta variedad.`,
    weight: 1,
    discount: 15,
    kind: 'Frutas',
    stock: 54 //kg
}

let frutilla_params = {
    id: 'fruit00005',
    name: "Frutilla Camarosa",
    price: 200, 
    description: `De origen californiano (EEUU), de frutos grandes y firmes, es la más consumida en Argentina. Se la considera como la variedad de fresón más cultivada en la actualidad.`,
    weight: 1,
    discount: 20,
    kind: 'Frutas',
    stock: 25 //kg
}

let berenjena_params = {
    id: 'veg00001',
    name: "Berenjena Negra",
    price: 140, 
    description: `Su textura aterciopelada y su sabor suavemente amargo y campestre conmueve a los paladares más exigentes. La berenjena negra es simplemente exquisita.`,
    weight: 1,
    discount: 20,
    kind: 'Verduras',
    stock: 57 //kg
}

let brocoli_params = {
    id: 'veg00002',
    name: "Brócoli",
    price: 80, 
    description: `De color verde profundo e intenso, partiendo de un tallo firme y robusto hasta una particular e inconfundible forma irregular en su copa. El brócoli llega para regalarnos un suave pero distintivo sabor que oscila entre lo amargo y lo dulce.`,
    weight: 1,
    discount: 20,
    kind: 'Verduras',
    stock: 92 //kg
}

let choclo_params = {
    id: 'veg00003',
    name: "Choclo Unidad",
    price: 80, 
    description: `Inconfundibles granos color amarillo oro. Crujientes por fuera pero suaves en su interior y, al morderlos, además nos inundan de todo su dulzor tan característico. El choclo es un vegetal tanto conocido como querido por todos.`,
    weight: 1,
    discount: 20,
    kind: 'Verduras',
    stock: 33 //kg
}

let almendra_params = {
    id: 'nuts00001',
    name: "Almendra",
    price: 2170, 
    description: `Caprichosas, rebeldes y suavemente crujientes, de interior blanco cremoso y un sabor dulce peculiar. Las almendras son célebres frutos secos, conocidos por todo tipo de paladares y preparaciones.`,
    weight: 1,
    discount: 20,
    kind: 'Frutos Secos',
    stock: 69 //kg
}

let castanacaju_params = {
    id: 'nuts00002',
    name: "Castaña de Cajú",
    price: 1800, 
    description: `Crujientes, gustosas y exquisitas para todo momento. Las castañas de cajú son un singular fruto seco que nos ofrecen una textura y sabor único.
    Sus usos son variados, podemos optar por consumirlas solas como un snack, combinada con otros frutos secos, o bien, utilizarla en diferentes preparaciones como panes, ensaladas, tortas o postres.`,
    weight: 1,
    discount: 20,
    kind: 'Frutos Secos',
    stock: 80 //kg
}

let manisaladopelado_params = {
    id: 'nuts00003',
    name: "Maní Pelado Salado",
    price: 490, 
    description: `El maní es el fruto seco más antojadizo, de un sabor cremoso neutro y textura crujiente pero suave. También es capaz de adoptar todo tipo de sabores que se le quiera arrojar.
    Entero para picar, acompañando una fría cerveza y haciendo una charla más llevadera, también mezclado con otros frutos secos e incluso en ensaladas o combinado con vegetales. Es tal vez uno de los alimentos más versátiles.`,
    weight: 1,
    discount: 20,
    kind: 'Frutos Secos',
    stock: 76 //kg
}

let canela_params = {
    id: 'spices00001',
    name: "Canela",
    price: 98, 
    description: `La canela es una especia muy recomendada para mejorar los problemas de circulación y muy beneficiosa para las personas con diabetes, ya que ayuda a controlar los niveles de glucosa en sangre.
    Sobre su origen existen algunos documentos chinos del año 2800 a.C. que ya hablan de la Cinnamomum Zeylanicum. Esta es una palabra de origen griego que significa madera dulce y Zeeylanicum proviene del nombre donde se cultivaba, Ceilán.`,
    weight: 0.1,
    discount: 20,
    kind: 'Hierbas y Especias',
    stock: 76 //kg
}

let albahaca_params = {
    id: 'spices00002',
    name: "Albahaca",
    price: 68, 
    description: `Dulce, fragante y aromática. El sabor de nuestra albahaca se asemeja a un ramo de flores con notas de menta y perfume. Una hierba que nos transmite toda la frescura del Mediterráneo y que no pasará desapercibida en nuestros platos.`,
    weight: 0.025,
    discount: 20,
    kind: 'Hierbas y Especias',
    stock: 76 //kg
}






let naranja = new Product(naranja_params);
let manzana = new Product(manzana_params);
let pera = new Product(pera_params);
let banana = new Product(banana_params);
let frutilla = new Product(frutilla_params);
let berenjena = new Product(berenjena_params);
let brocoli = new Product(brocoli_params);
let choclo = new Product(choclo_params);
let almendra = new Product(almendra_params);
let castanacaju = new Product(castanacaju_params);
let manisaladopelado =  new Product(manisaladopelado_params);
let canela = new Product(canela_params);
let albahaca =  new Product(albahaca_params);



let catalogue = [naranja, manzana, pera, banana, frutilla, berenjena, brocoli, choclo, almendra, castanacaju, manisaladopelado, canela, albahaca];

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
