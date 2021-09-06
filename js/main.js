"use strict";
import { catalogue, getKindsFromCatalogue } from './product_mockup.js';
import { Cart } from './cart.js';
import { Product } from './product.js';
import { 
    makeCardContentTemplate, 
    makeCartContentTemplate, 
    makeDropDownList, 
    createNavLink, 
    createCarouselHomeItems,
    createCarouselCatagoriesItems  } from './templates.js';

let cart = null;

/**
 * ----------------------------------------
 * Función para ver contendido del carro en la consola.
 * ----------------------------------------
 */

const infoCart = () => {

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
 * Funcion que actualiza el stock de los articulos del catalogo en relación
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
 * Función para modificar el contador de productos en el carrito.
 * ----------------------------------------
 */
const setCartCounter = () => {
    document.getElementById('cartCounter').innerHTML = cart.cartSize();
}


/**
 * ----------------------------------------
 * Función para modificar el contador del stock
 * ----------------------------------------
 */
const setStockCounter = (prodId) => {
    
    let id = 'stock-' + prodId;
    let actualStock = catalogue.find(prod => prod.id == prodId).stock;
    if( document.getElementById(id) ) {  // DOM ELEMENT IS PRESENT
        document.getElementById(id).innerHTML = 'Stock ' + actualStock + ' Kg';
    
        // stock badge is red and stock > 0
        if (actualStock > 0 && document.getElementById(id).classList.contains('bg-red')) {
            document.getElementById(id).classList.replace('bg-red', 'bg-green');
            document.getElementById('addButton-'+prodId).style.visibility = "visible";     
        }

        // stock is 0 and badge is gray 
        if (actualStock == 0 && document.getElementById(id).classList.contains('bg-green')) {
            document.getElementById(id).classList.replace('bg-green', 'bg-red');
            document.getElementById('addButton-'+prodId).style.visibility = "hidden";
        }
    }
}

/**
 * ----------------------------------------
 * Función para modificar la visibilidad del boton add en el carrito.
 * ----------------------------------------
 */

const setAddButtonCardVisibility = (prodId) => {
    let id = 'addButtonCart-'+prodId;
    let actualStock = catalogue.find(prod => prod.id == prodId).stock;

    if (actualStock == 0 && document.getElementById(id)){
        document.getElementById(id).style.visibility = "hidden";  
    }
    if (actualStock > 0 && document.getElementById(id)){
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
    setCartCounter();
}

/**
 * ----------------------------------------
 * Función para agregar Producto al Carrito
 * ----------------------------------------
 */

window.addToCart = function addToCart(prodId) {

    if( cart.addItem(prodId) ) { // there is stock
        localStorage.setItem('cart', JSON.stringify(cart.stringify()));
        setCartCounter();
        setStockCounter(prodId);
        updateProdQty(prodId);
        setAutoOpenCart(prodId);
        makeCartContent();
        infoCart();
    } else {
        alert("NO HAY STOCK DE ESE PRODUCTO");  
    }
}


/**
 * ----------------------------------------
 * Función para sacar Producto del Carrito
 * ----------------------------------------
 */

window.takeOutOfCart = function takeOutOfCart(prodId) {
    cart.dropItem(prodId);
    localStorage.setItem('cart', JSON.stringify(cart.stringify()));
    setCartCounter();
    setStockCounter(prodId);
    updateProdQty(prodId);
    setAutoOpenCart(prodId);
    makeCartContent();
    infoCart();
}

/**
 * ----------------------------------------
 * Función para vaciar el carrito
 * ----------------------------------------
 */

window.emptyCart = function emptyCart() {
    cart.empty();
    localStorage.setItem('cart', JSON.stringify(cart.stringify()));
    setCartCounter();
    catalogue.forEach(prod => {
        setStockCounter(prod.id); 
        updateProdQty(prod.id);
        setAutoOpenCart(prod.id);
    });
    makeCartContent();
    infoCart();
    
}


/**
 * ----------------------------------------
 * Función para actualizar el contador de KG que el usuario seleccionó
 * en base a los productos que tiene en el carrito.
 * ----------------------------------------
 */

const updateProdQty = (prodId) => {

    let id = 'prodQty-'+prodId;

    if( document.getElementById(id) ) {  // DOM ELEMENT IS PRESENT
        const myShoopingList = cart.shoopingList;
        let qty = myShoopingList.filter(prod => prod.id === prodId).length;
        if (qty > 0) {
            document.getElementById(id).innerHTML = qty + 'Kg';
            document.getElementById(id).style.visibility = "visible";
        } else {
            document.getElementById(id).style.visibility = "hidden";
        }
    }

}

/**
 * ----------------------------------------
 * Función para ir al carro si es la primera vez que se da el boton agregar al carrito
 * para ese artículo. Para las posteriores ya no se abre de manera automática el carrito.
 * ----------------------------------------
 */


const setAutoOpenCart = (prodId) => {

    let id = 'addButton-'+prodId;

    if( document.getElementById(id) ) {  // DOM ELEMENT IS PRESENT

        const myShoopingList = cart.shoopingList;
        let qty = myShoopingList.filter(prod => prod.id === prodId).length;
        if (qty == 0) { // IS NOT ON THE CART
            document.getElementById(id).setAttribute('data-bs-toggle','offcanvas');
            document.getElementById(id).setAttribute('href','#offcanvasCart');
        } else { // PRESENT ON THE CART
            // DELETE data-bs-toggle="offcanvas" href="#offcanvasCart"
            document.getElementById(id).removeAttribute('data-bs-toggle');
            document.getElementById(id).removeAttribute('href');
        }
    }
} 

/**
 * ----------------------------------------
 * Función para obtener el parametro pasado en URL y usarlo para crear
 * un cardDeck filtrado.
 * ----------------------------------------
 */

const getFilterValueByUrlParameter = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const filterValue = urlParams.get('filterValue');   
    return filterValue;
}


/**
 * ----------------------------------------
 * Función para Crear los CARDDECK de manera dinamica.
 *  
 * ----------------------------------------
 */

const makeCardDeck = (filterValue) => {
    if ( filterValue != null ) { // Filtering value was entered

        let cardContent = ``;
        let filteredCatalog;

        let kinds = getKindsFromCatalogue();
              
        if ( kinds.find( k => k === filterValue) ){  // FilterValue belongs to kinds
            filterValue !== 'all' ? filteredCatalog = catalogue.filter(prod => prod.kind === filterValue) : filteredCatalog = catalogue;
        } else { // FilterValue does not belong to kinds, it must be a product id.
            filterValue !== 'all' ? filteredCatalog = catalogue.filter(prod => prod.id === filterValue) : filteredCatalog = catalogue;
        }

        // Template generated in template.js
        cardContent = makeCardContentTemplate(filteredCatalog);
        document.getElementById('cards').innerHTML = cardContent;

        filteredCatalog.forEach((prod) => {
            updateProdQty(prod.id);
            setStockCounter(prod.id);
            setAutoOpenCart(prod.id);
        });

    }
}


/**
 * ----------------------------------------
 * Función para crear el contenido del carrito de manera dinamica.
 *  
 * ----------------------------------------
 */


const makeCartContent = () => {
    let cartContent = ``;
    const myShoopingList = cart.shoopingList;

    document.getElementById('total').innerHTML = "TOTAL $"+ cart.total;
    document.getElementById('subtotal').innerHTML = "Subtotal: $" + cart.subtotal;
    document.getElementById('envio').innerHTML = "Envio   : $" + cart.shipping;

    cartContent = makeCartContentTemplate( catalogue, myShoopingList);
   
    document.getElementById('cartContent').innerHTML = cartContent;

    catalogue.forEach((prod) => {
        setAddButtonCardVisibility(prod.id); 
    });
}

window.makeCartContent = () => makeCartContent();
window.makeCardDeck = (filterValue) => makeCardDeck(filterValue);


/**
 * ----------------------------------------
 * FormSearch  - Se agrega evento submit para realizar la busqueda.
 * ----------------------------------------
 */

let formSearch = document.getElementById('formSearch');
formSearch.addEventListener('submit', search);

function search(e){
    e.preventDefault();
    let searchValue = e.target.children[0].value;
    searchValue !== ''? makeCardDeck(e.target.children[0].value): makeCardDeck();
}



/**
 * ----------------------------------------
 * Evento para autohide del navbar
 * ----------------------------------------
 */

document.addEventListener("DOMContentLoaded", function(){
		
    let e = document.querySelector('.autohide');

    let navbar_height = document.querySelector('.navbar').offsetHeight;
    document.body.style.paddingTop = navbar_height + 'px';

    if(e){
        let last_scroll_top = 0;
        window.addEventListener('scroll', function() {
               let scroll_top = window.scrollY;
           if(scroll_top < last_scroll_top) {
                e.classList.remove('scrolled-down');
                e.classList.add('scrolled-up');
            }
            else {
                e.classList.remove('scrolled-up');
                e.classList.add('scrolled-down');
            }
            last_scroll_top = scroll_top;
        }); 
    }
}); 

/**
 * ----------------------------------------
 * Función Main - Realizar compra.
 * ----------------------------------------
 */

const main = () => {
    makeDropDownList();
    createNavLink('page2', 'Ayuda');
    createCarouselHomeItems('./assets/img/banner', 2, 'homeCarouselInner');
    createCarouselCatagoriesItems('./assets/img/categories', getKindsFromCatalogue(), 'categoriesCarouselInner');
    initCart();
    makeCardDeck( getFilterValueByUrlParameter() );
    makeCartContent();
}

main();
