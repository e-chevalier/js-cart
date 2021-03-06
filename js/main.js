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
    createCarouselCatagoriesItems,
    makeCheckoutItemsTemplate } from './templates.js';

import { makeCheckOut } from './mercadopago.js';
import jwtDecode from '../js/jwt-decode.js';

let cart = null;
let user = {
    'ID':'',
    'FullName': '',
    'GivenName': '',
    'FamilyName': '',
    'ImageURL': '',
    'Email': ''};

/**
 * ----------------------------------------
 * Función renderizar contenido del tad con ID "loginContainer"
 * - No usuario --> Se muestra boton de login en google.
 * - Usuario --> Muestra nombre y foto del mismo.
 * ----------------------------------------
 */

const setloginContainer = () => {

    if (user.ID === ''){
        google.accounts.id.initialize({
            client_id: "221295695663-k26dc2qet8vg6eslb328i20l84dltn5b.apps.googleusercontent.com",
            auto_select: "true",
            callback: handleCredentialResponse
        });
        google.accounts.id.renderButton(
            document.getElementById("loginContainer"),
            { theme: "outline", size: "large" }  // customization attributes
        );
        
    } else {
        document.getElementById('loginContainer').innerHTML = `<img src="${user.ImageURL}" class="square-button mx-3" alt=""><span>${user.FullName}</span>
        <button id="signout_button" type="button" class="btn btn-outline-dark g_id_signout">Sign Out</button>`;
        const button = document.getElementById('signout_button');
        button.addEventListener('click', signOut);
    }
}

/**
 * ----------------------------------------
 * Callback a la llamada de iniciación de sesion de google.
 * ----------------------------------------
 */

function handleCredentialResponse(response) {

    const responsePayload = jwtDecode(response.credential);

    user = {
        'ID':responsePayload.sub,
        'FullName':  responsePayload.name,
        'GivenName': responsePayload.given_name,
        'FamilyName': responsePayload.family_name,
        'ImageURL': responsePayload.picture,
        'Email': responsePayload.email
    }

    // SER USER ON LOCALSTORAGE
    localStorage.setItem('user', JSON.stringify(user));
    location.reload();

}

/**
 * ----------------------------------------
 * Función para deslogueo de la cuenta de google.
 * ----------------------------------------
 */

const signOut = () => {
    google.accounts.id.disableAutoSelect();
    localStorage.removeItem('user');
    user = {'ID':'', 'FullName': '', 'GivenName': '', 'FamilyName': '', 'ImageURL': '', 'Email': ''};
    location.reload();
}


/**
 * ----------------------------------------
 * Función que cargar el user desde el locastorage y llama al seteo del tag de login.
 * ----------------------------------------
 */
const login = () => {

    // SET USER IF EXIST ON LOCALSTORAGE
    if ( localStorage.getItem('user') ) { //USER EXIST ON LOCALSTORAGE
        let user_localStorage = JSON.parse(localStorage.getItem('user'));
        user = user_localStorage;
        initCart();
        makeCardDeck( getFilterValueByUrlParameter() );
    }
    
    setloginContainer(); // SHOW BUTTON 
    
}




/**
 * ----------------------------------------
 * Función para ver contendido del carro en la consola.
 * ----------------------------------------
 */

const infoCart = () => {

    let myShoopingList = cart.shoopingList;
  
    myShoopingList.forEach( art => {
        console.log(`+ ${art.name} - ${art.qty}Kg -- $${art.qty * art.price} -`);
        console.log(`Stock actual: ` + art.stock);
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

const getCartFromLocalStorage = (cart_id) => {
    let localStorageCart = JSON.parse(localStorage.getItem(cart_id));
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
        let res = cart.shoopingList.filter(elem => elem.id === prod.id);

        if ( res.length > 0) { // Prod present on the cart
            catalogue[index].reduceStock(res[0].qty);
        }

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
 * Función para realizar animación sobre botones + y - de los cards.
 * @param {*} id 
 */
 const elementWithAnimation = (id, visibility) => {
    
    if ( visibility == 'visible' ) {
        $('#addButton-'+id).animate({ fontSize: '1rem' },500, 'linear', () => { $('#addButton-'+id).css('visibility', visibility).toggleClass('rotate-90')} )
                 .animate({ opacity: 1 }, 500, 'linear', () => {$('#addButton-'+id).toggleClass('rotate-90')});
        $('#img-'+id).css('filter', 'grayscale(0)');  
                
    } else {
        $('#addButton-'+id).toggleClass('rotate-90')
            .animate({ opacity: 0 }, 500, 'linear', () => {$('#addButton-'+id).css('visibility', visibility).toggleClass('rotate-90')})
            .animate({ fontSize: '0rem' },500, 'linear', () => {} );
        $('#img-'+id).css('filter', 'grayscale(1)');

    }
    
}

/**
 * ----------------------------------------
 * Función para modificar el contador del stock
 * ----------------------------------------
 */
const setStockCounter = (prodId) => {
    
    let id = 'stock-'+prodId;
    let actualStock = catalogue.find(prod => prod.id == prodId).stock;
    if( document.getElementById(id) ) {  // DOM ELEMENT IS PRESENT
        document.getElementById(id).innerHTML = 'Stock ' + actualStock + ' Kg';
    
        // stock badge is red and stock > 0
        if (actualStock > 0 && document.getElementById(id).classList.contains('bg-red')) {
            document.getElementById(id).classList.replace('bg-red', 'bg-green');
            document.getElementById('addButton-'+prodId).style.visibility = "visible";
            $('#img-'+prodId).css('filter', 'grayscale(0)');
            //elementWithAnimation( prodId, 'visible');                 
        }

        // stock is 0 and badge is gray 
        if (actualStock == 0 && document.getElementById(id).classList.contains('bg-green')) {
            document.getElementById(id).classList.replace('bg-green', 'bg-red');
            document.getElementById('addButton-'+prodId).style.visibility = "hidden";
            $('#img-'+prodId).css('filter', 'grayscale(1)');
            //elementWithAnimation( prodId, 'hidden');
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
 * Función para realizar el checkout por MercadoPago.
 * ----------------------------------------
 */

function makeCheckOutMP() {

    if (cart.isEnable()) {
        makeCheckOut(cart.shoopingList);
    } else {
        document.getElementById('checkoutButton').classList.add('disabled');
        alert("No se cumple con la compra mínima.");
        location.reload();
    }
}

/**
 * ----------------------------------------
 * Inicializado del carro.
 * ----------------------------------------
 */

const initCart = () => {

    if (!(localStorage.getItem('cart')) && user.ID === '' && !(localStorage.getItem('user')) ) { // NOT GENERIC CART AND USER NEVER LOGGED IN YET
        cart = new Cart({});
        localStorage.setItem('cart', JSON.stringify(cart.stringify()));
    }

    if (localStorage.getItem('cart') && user.ID === '' && !(localStorage.getItem('user')) ) {  // GENERIC CART AND USER NEVER LOGGED IN YET
        cart = getCartFromLocalStorage('cart'); // SET GLOBAL CART
        updateRemainingStock();
    }

    if (localStorage.getItem('cart') && localStorage.getItem('user')  ) {  // GENERIC CART AND USER LOGGED IN
        
        let userID  = JSON.parse(localStorage.getItem('user')).ID;

        if(localStorage.getItem('cart'+userID)) {  // USER HAVE CART
            
            if(cart) { emptyCart();}; // EMPTY GENERIC CART
            localStorage.removeItem('cart');
            cart = getCartFromLocalStorage('cart'+userID); // SET USER CART AS GLOBAL CART
            updateRemainingStock();

        } else { // USER HAVE NOT CART
            
            if (cart == null ) {
                cart = getCartFromLocalStorage('cart'); // SET GLOBAL CART
                updateRemainingStock();
            }
            localStorage.removeItem('cart');
            localStorage.setItem('cart'+userID, JSON.stringify(cart.stringify())); //CREATE COPY FORM GENERIC
        }
    }

    if (!(localStorage.getItem('cart')) && localStorage.getItem('user') &&  cart == null ) {  // NOT GENERIC CART AND USER LOGGED IN
        let userID  = JSON.parse(localStorage.getItem('user')).ID;
        cart = getCartFromLocalStorage('cart'+userID); // SET USER CART AS GLOBAL CART
        updateRemainingStock();
    }

    setCartCounter();

    // AGREGAMOS EL EVENTO CLICK PARA IR A REALIZAR EL CHECKOUT 
    document.getElementById('checkoutCart').addEventListener('click', () => location.href='/checkout.html' );
}

/**
 * ----------------------------------------
 * Función para agregar Producto al Carrito
 * ----------------------------------------
 */

window.addToCart = function addToCart(prodId) {

    if( cart.addItem(prodId) ) { // there is stock
        localStorage.setItem('cart'+user.ID, JSON.stringify(cart.stringify()));
        setCartCounter();
        setStockCounter(prodId);
        updateProdQty(prodId);
        setAutoOpenCart(prodId);
        makeCartContent();
        //infoCart();
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
    localStorage.setItem('cart'+user.ID, JSON.stringify(cart.stringify()));
    setCartCounter();
    setStockCounter(prodId);
    updateProdQty(prodId);
    setAutoOpenCart(prodId);
    makeCartContent();
    //infoCart();
}

/**
 * ----------------------------------------
 * Función para vaciar el carrito
 * ----------------------------------------
 */

window.emptyCart = function emptyCart() {
    cart.empty();
    localStorage.setItem('cart'+user.ID, JSON.stringify(cart.stringify()));
    setCartCounter();
    catalogue.forEach(prod => {
        setStockCounter(prod.id); 
        updateProdQty(prod.id);
        setAutoOpenCart(prod.id);
    });
    makeCartContent();
    //infoCart();
    
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
        const res = cart.shoopingList.filter(prod => prod.id === prodId);
        
        if (res.length > 0) {
            document.getElementById(id).innerHTML = res[0].qty + 'Kg';
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
    let myShoopingList = cart.shoopingList;

    document.getElementById('total').textContent = "TOTAL : $"+ cart.total;
    document.getElementById('envio').textContent = "ENVIO : $" + cart.shipping;

    let warning = cart.isEnable()? '': ` (Compra minima $${cart.minPurchase})`;
    document.getElementById('subtotal').innerHTML = `SUBTOTAL: $${cart.subtotal} <small class="text-white">${warning}</small>`;


    cart.isEnable() ? document.getElementById('checkoutCart').disabled = false : document.getElementById('checkoutCart').disabled = true;

    cartContent = makeCartContentTemplate(myShoopingList);
   
    document.getElementById('cartContent').innerHTML = cartContent;

    catalogue.forEach((prod) => {
        setAddButtonCardVisibility(prod.id); 
    });
}

window.makeCartContent = () => makeCartContent();


/**
 * ----------------------------------------
 * Función para agregar el Evento para autohide del navbar
 * ----------------------------------------
 */

const autoHideNavBar = () => {

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
}


 

/**
 * ----------------------------------------
 * Evento para cambiar el tamaño del carousel de categorias en relación
 * al tamaño de la pantalla.
 * Screen >= a 1024px el carousel tiene 3 elementos por carousel-item.
 * Screen < a 1024px el carousel tiene 2 elementos por carousel-item
 * Screen < a 768px el carousel tiene 1 elementos por carousel-item
 * ----------------------------------------
 */

const handleCarouselCategories = () => {
    createCarouselCatagoriesItems('./assets/img/categories', getKindsFromCatalogue(), 'categoriesCarouselInner');
}

const mediaQuery1440 = window.matchMedia('(min-width: 1440px)');
const mediaQuery1024 = window.matchMedia('(min-width: 1024px)');
const mediaQuery768 = window.matchMedia('(min-width: 768px)');

mediaQuery1440.addEventListener('change', handleCarouselCategories);
mediaQuery1024.addEventListener('change', handleCarouselCategories);
mediaQuery768.addEventListener('change', handleCarouselCategories);



/**
 * ----------------------------------------
 * Función para crear el contenido del checkout de manera dinámica.
 *  
 * ----------------------------------------
 */

const makeCheckOutItems = () => {
    let checkOutContent = ``;
    let myShoopingList = cart.shoopingList;

    let node = document.getElementById('checkOutItems');
    if (node) {
        checkOutContent = makeCheckoutItemsTemplate(myShoopingList);
        node.innerHTML = checkOutContent;
        document.getElementById('checkOutTotal').innerHTML = "$"+ cart.total;
        document.getElementById('checkOutSubtotal').innerHTML = "$" + cart.subtotal;
        document.getElementById('checkOutEnvio').innerHTML = "$" + cart.shipping;
        document.getElementById('checkoutButton').addEventListener('click', makeCheckOutMP);
        cart.isEnable() ? document.getElementById('checkoutButton').classList.remove('disabled'): document.getElementById('checkoutButton').classList.add('disabled');
    }
}

/**
 * ----------------------------------------
 * Función Main - Realizar compra.
 * ----------------------------------------
 */

const main = () => {
    makeDropDownList();
    createNavLink('contact', 'Contacto');
    createCarouselHomeItems('./assets/img/banner', 5, 'homeCarouselInner');
    createCarouselCatagoriesItems('./assets/img/categories', getKindsFromCatalogue(), 'categoriesCarouselInner');
    initCart();
    makeCardDeck( getFilterValueByUrlParameter() );
    makeCartContent();
    makeCheckOutItems();
    autoHideNavBar();
    login();
}

main();
