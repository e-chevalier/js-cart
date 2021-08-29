"use strict";
import { catalogue } from './product_mockup.js';
import { Cart } from './cart.js';
import { Product } from './product.js';

let cart = null;

/**
 * ----------------------------------------
 * Método para ver contendido del carro en la consola.
 * ----------------------------------------
 */

const infoCart = (cart) => {

    const myShoopingList = cart.shoopingList;
    catalogue.forEach(art => {
        let qty = myShoopingList.filter(prod => prod.id === art.id).length;
        if (qty > 0) {
            console.log(`+ ${art.name} - ${qty}Kg -- $${qty * art.price} -`);
            console.log(`Stock actual: ` + art.stock);
        }
    });

    console.log("SUBTOTAL: " + cart.subtotal);
    console.log("TOTAL + ENVIO: " + cart.total);
    console.log("ENABLE: " + cart.enable);
    console.log("PROD EN CARRITO: " + cart.cartSize());
    console.log("------------------------------------------------");
}



/**
 * ----------------------------------------
 * Funcion que obtiene del localStorage el carro de compra.
 * Crea una nueva instancia de la clase carrito donde se copian los datos para se
 * manipulado en la sesion actual.
 * ----------------------------------------
 */

const getCartFromLocalStorage = () => {
    let localStorageCart = JSON.parse(localStorage.getItem('cart'));
    let newShoopoingList = localStorageCart.shoopingList.map(prod => new Product(prod));
    localStorageCart.shoopingList = newShoopoingList;
    let newcart = new Cart(localStorageCart);
    return newcart;
}

/**
 * ----------------------------------------
 * Funcion que actualiza el stock de los articulos del catalogo en relacion
 * a los articulos que tenemos en el carro actualmente.
 * ----------------------------------------
 */

const updateRemainingStock = () => {

    catalogue.forEach((prod, index) => {
        // Obtengo la cantidad de productos que tengo en el carro con un ID determinado.
        let qty = cart.shoopingList.filter(elem => elem.id === prod.id).length;
        catalogue[index].reduceStock(qty);
    })

}


/**
 * ----------------------------------------
 * Método para modificar el contador del carrito.
 * ----------------------------------------
 */
const setCartCounter = (value) => {
    document.getElementById('cartCounter').innerHTML = value;
}


/**
 * ----------------------------------------
 * Método para modificar el contador del stock
 * ----------------------------------------
 */
const setStockCounter = (prodId) => {
    let id = 'stock-' + prodId;
    let actualStock = catalogue.find(prod => prod.id == prodId).stock;
    document.getElementById(id).innerHTML = 'Stock ' + actualStock + ' Kg';
}

/**
 * ----------------------------------------
 * Inicializado del carro.
 * ----------------------------------------
 */

const initCart = () => {

    if (localStorage.getItem('cart')) { // Found in localStorage
        let mycart = JSON.parse(localStorage.getItem('cart'))
        cart = getCartFromLocalStorage();
        updateRemainingStock();
    } else { // Not Found in localStorage
        cart = new Cart({});
        localStorage.setItem('cart', JSON.stringify(cart.stringify()));
    }
    setCartCounter(cart.cartSize());
}

/**
 * ----------------------------------------
 * Método para agregar Producto al Carrito
 * ----------------------------------------
 */

window.addToCart = function addToCart(prodId) {

    cart.addItem(prodId);
    localStorage.setItem('cart', JSON.stringify(cart.stringify()));
    setCartCounter(cart.cartSize());
    setStockCounter(prodId);
    updateProdQty(prodId);
    makeCartContent();
    infoCart(cart);
}


/**
 * ----------------------------------------
 * Método para sacar Producto del Carrito
 * ----------------------------------------
 */

window.takeOutOfCart = function takeOutOfCart(prodId) {
    cart.dropItem(prodId);
    localStorage.setItem('cart', JSON.stringify(cart.stringify()));
    setCartCounter(cart.cartSize());
    setStockCounter(prodId);
    updateProdQty(prodId);
    makeCartContent();
    infoCart(cart);
}

/**
 * ----------------------------------------
 * Método para vaciar el carrito
 * ----------------------------------------
 */

window.emptyCart = function emptyCart() {
    cart.empty();
    localStorage.setItem('cart', JSON.stringify(cart.stringify()));
    setCartCounter(cart.cartSize());
    catalogue.forEach(prod => {
        setStockCounter(prod.id); 
        updateProdQty(prodId);
    });
    makeCartContent();
    infoCart(cart);
    
}

/**
 * ----------------------------------------
 * Método para solicitar la cantidad que desea comprar de un articulo un cliente.
 * El valor ingresado debe ser mayor o igual a 0.
 * ----------------------------------------
 */

const amountOf = (item, price, stock) => {

    let res = "NaN";

    while (res.toString() == "NaN" || res < 0 || res > stock) {
        res = Number(prompt(`Puede comprar ${item} a $${price} el kg. ¿Cuantos kilos desea? (Stock: ${stock})`));
        if (res.toString() !== "NaN" && res >= 0 && res <= stock) {
            break;
        } else {
            alert("El valor ingresado debe ser mayor o igual a 0. y menor al stock");
        }
    }

    return res;
}


/**
 * ----------------------------------------
 * Método que recoge todas las cantidades que desea el cliente de cada producto de catalogue.
 * Input - Array de productos.
 * El Método retorna un MAP de articulo cantidad que desea el cliente. (prod.id : qty)
 * ----------------------------------------
 */

const makeShoppingList = catalogue => {
    const shoppingMap = new Map();

    catalogue.forEach(prod => shoppingMap.set(prod.id, amountOf(prod.name, prod.price, prod.stock)));

    return shoppingMap;
}



const addProd2Cart = shoppingMap => {
    for (const [prodId, qty] of shoppingMap.entries()) {
        for (let i = 0; i < qty; i++) {
            cart.addItem(prodId);
        }
    }
}


const updateProdQty = (prodId) => {

    const myShoopingList = cart.shoopingList;
    let qty = myShoopingList.filter(prod => prod.id === prodId).length;
    if (qty > 0) {
        document.getElementById('prodQty-'+prodId).innerHTML = qty;
        document.getElementById('prodQty-'+prodId).style.visibility = "visible";
    } else {
        document.getElementById('prodQty-'+prodId).style.visibility = "hidden";
    }

}




/**
 * ----------------------------------------
 * Método para Crear los CARDDECK de manera dinamica.
 *  
 * ----------------------------------------
 */

const makeCardDeck = () => {
    let cardContent = ``;

    

    catalogue.forEach((prod, i) => {

        if ((i % 4) == 0) { // INSERT CARDDECK INIT
            cardContent += `<div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">`;
        }
        cardContent += `
        <div class="col">
            <div class="card border-0 m-3 position-relative">
                <img class="card-img-top" src="/assets/img/product/${prod.id}.jpg" alt="">
                <div class="card-body font-black">
                    <h4 class="card-title">${prod.name}</h4>
                    <p class="card-text">Contenido: ${prod.weight} Kg</p>
                    <p class="">$${prod.price}</p>
                    <p>
                        <button class="btn btn-light text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${i}" aria-expanded="false" aria-controls="collapse-${i}">
                            Mas información
                        </button>
                    </p>
                    <div>
                        <div class="collapse" id="collapse-${i}">
                            <div class="card-text">
                            ${prod.description}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="d-flex flex-row justify-content-around align-items-center">
                        <button type="button" class="btn btn-outline-success rounded-circle" onclick="addToCart('${prod.id}');return false;">
                            <i class="fas fa-plus"></i>
                        </button>
                        <div> <span id="stock-${prod.id}" class="badge bg-light text-success">Stock ${prod.stock} Kg</span> </div>
                        <button type="button" class="btn btn-outline-danger rounded-circle" onclick="takeOutOfCart('${prod.id}');return false;">
                            <i class="fas fa-minus"></i>
                        </button>
                    </div>
                </div>
                <span id="prodQty-${prod.id}" class="position-absolute top-0 start-100 translate-middle fs-6 badge rounded-pill bg-success">+99</span>
            </div>
        </div>
        `;
        if ((i % 4) == 3) { // INSERT CARDDECK CLOSE
            cardContent += `</div>`;
        }
    });

    document.getElementById('cards').innerHTML = cardContent;

    catalogue.forEach((prod, i) => {
        updateProdQty(prod.id);
    });
}






const makeCartContent = () => {
    let cartContent = ``;
    const myShoopingList = cart.shoopingList;

    document.getElementById('total').innerHTML = "TOTAL $"+ cart.total;
    document.getElementById('subtotal').innerHTML = "Subtotal: $" + cart.subtotal;
    document.getElementById('envio').innerHTML = "Envio   : $" + cart.shipping;

    catalogue.forEach((prod, i) => {

        let qty = myShoopingList.filter(art => art.id === prod.id).length;
        if (qty > 0) {
            cartContent += `
                <div class="card mb-3">
					<div class="row g-0">
						<div class="col-4">
							<img src="./assets/img/product/${prod.id}.jpg" class="img-fluid rounded-start" alt="${prod.id}">
						</div>
						<div class="col-8">
							<div class="card-body">
								<h5 class="card-title">${prod.name}</h5>
								<p class="card-text">
									<p>Precio por kg : $${prod.price}<br>
									Cantidad solicitada: ${qty} kg <br>
									<span class="fw-normal">Subtotal : $${qty * prod.price}</span> <br>
								</p>
							</div>
						</div>
					</div>
					<div class="row g-0">
						<p class="card-text">
						<div class="d-flex flex-row justify-content-around align-items-center">
							<button type="button" class="btn btn-outline-success rounded-circle"
								onclick="addToCart('${prod.id}');return false;">
								<i class="fas fa-plus"></i>
							</button>
							<div> <span id="stock-${prod.id}" class="badge bg-light text-success">Stock ${prod.stock} Kg</span>
							</div>
							<button type="button" class="btn btn-outline-danger rounded-circle"
								onclick="takeOutOfCart('${prod.id}');return false;">
								<i class="fas fa-minus"></i>
							</button>
						</div>
						</p>
					</div>
				</div>
            `;
        }
    });

    document.getElementById('cartContent').innerHTML = cartContent;

}

window.makeCartContent = () => makeCartContent();

/**
 * ----------------------------------------
 * Método Main - Realizar compra.
 * ----------------------------------------
 */

const main = () => {
    initCart();
    makeCardDeck();
    makeCartContent();
    /*const list = makeShoppingList(catalogue);
    console.log(list);
    addProd2Cart(list);
    infoCart(cart);*/
}

main();