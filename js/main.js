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
   
    // stock badge is red and stock > 0
    if (actualStock > 0 && document.getElementById(id).classList.contains('bg-danger')) {
        document.getElementById(id).classList.replace('bg-danger', 'bg-secondary');
        document.getElementById('addButton-'+prodId).style.visibility = "visible";     
    }

    // stock is 0 and badge is gray 
    if (actualStock == 0 && document.getElementById(id).classList.contains('bg-secondary')) {
        document.getElementById(id).classList.replace('bg-secondary', 'bg-danger');
        document.getElementById('addButton-'+prodId).style.visibility = "hidden";
    } 
}

/**
 * ----------------------------------------
 * Método para modificar la visibilidad del boton add en el carrito.
 * ----------------------------------------
 */

const setAddButtonCardVisibility = (prodId) => {
    let id = 'addButtonCart-'+prodId;
    let actualStock = catalogue.find(prod => prod.id == prodId).stock;

    if (actualStock == 0 ){
        document.getElementById(id).style.visibility = "hidden";  
    } else {
        document.getElementById(id).style.visibility = "visible";
    }
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

    if( cart.addItem(prodId) ) { // there is stock
        localStorage.setItem('cart', JSON.stringify(cart.stringify()));
        setCartCounter(cart.cartSize());
        setStockCounter(prodId);
        updateProdQty(prodId);
        makeCartContent();
        infoCart(cart);
    } else {
        alert("NO HAY STOCK DE ESE PRODUCTO");  
    }
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
        updateProdQty(prod.id);
    });
    makeCartContent();
    infoCart(cart);
    
}


/**
 * ----------------------------------------
 * Método para actualizar el contador de KG que el usuario selecciono
 * en base a los productos que tiene en el carrito.
 * ----------------------------------------
 */

const updateProdQty = (prodId) => {

    const myShoopingList = cart.shoopingList;
    let qty = myShoopingList.filter(prod => prod.id === prodId).length;
    if (qty > 0) {
        document.getElementById('prodQty-'+prodId).innerHTML = qty + 'Kg';
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
                    <p class="fw-bold">$${prod.price}</p>
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
                        <button id="takeoutButton-${prod.id}" type="button" class="btn btn-outline-danger rounded-circle" onclick="takeOutOfCart('${prod.id}');return false;">
                            <i class="fas fa-minus"></i>
                        </button>
                        <div> <span id="prodQty-${prod.id}" class="badge bg-light text-success fs-6"></span> </div>
                        <button id="addButton-${prod.id}" type="button" class="btn btn-outline-success rounded-circle" onclick="addToCart('${prod.id}');return false;">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <span id="stock-${prod.id}" class="position-absolute top-0 start-50 translate-middle fs-6 badge rounded-pill bg-secondary"> Stock ${prod.stock} Kg</span>
            </div>
        </div>
        `;
        if ((i % 4) == 3) { // INSERT CARDDECK CLOSE
            cardContent += `</div>`;
        }
    });

    document.getElementById('cards').innerHTML = cardContent;

    catalogue.forEach((prod) => {
        updateProdQty(prod.id);
        setStockCounter(prod.id);
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
									<p>Precio por kg : $${prod.price}</p>
									<p>Cantidad solicitada: <span class="fw-bold">${qty} kg</span></p>
									<p><span class="fw-bold">Subtotal : $${qty * prod.price}</span></p>
								</p>
							</div>
						</div>
					</div>
					<div class="row g-0">
						<p class="card-text">
						<div class="d-flex flex-row justify-content-around align-items-center">
                            <button id="takeoutButtonCart-${prod.id}" type="button" class="btn btn-outline-danger rounded-circle" onclick="takeOutOfCart('${prod.id}');return false;">
                                <i class="fas fa-minus"></i>
                            </button>
							<div> <span class="badge bg-light text-success">Stock ${prod.stock} Kg</span>
							</div>
                            <button id="addButtonCart-${prod.id}" type="button" class="btn btn-outline-success rounded-circle" onclick="addToCart('${prod.id}');return false;">
								<i class="fas fa-plus"></i>
							</button>
						</div>
						</p>
					</div>
				</div>
            `;
        }
    });

    document.getElementById('cartContent').innerHTML = cartContent;

    catalogue.forEach((prod) => {
        setAddButtonCardVisibility(prod.id); 
    });
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
}

main();