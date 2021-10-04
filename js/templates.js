"use strict";
import { catalogue, getKindsFromCatalogue } from "./product_mockup.js";

const makeCardContentTemplate = (filteredCatalog) => {
    
    let cardContent = ``;
    
    filteredCatalog.forEach((prod, i) => {

        if ((i % 4) == 0) { // INSERT CARDDECK INIT
            cardContent += `<div class="row justify-content-evenly row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-4 g-4">`;
        }
        cardContent += `
        <div class="col py-4 px-4 px-lg-2 py-lg-3">
            <div class="card h-100 mx-2">
                <div class="card-header text-center">
                    <h5 class="card-title">${prod.name}</h5>
                </div>
                <div class="row h-100 g-0 pt-3">
                    <div class="col-6">
                        <img id="img-${prod.id}" class="card-img-top" src="/assets/img/product/${prod.id}.jpg" alt="">
                    </div>
                    <div class="col-6">
                        <div class="card-body font-black">     
                            <p class="card-text">Precio por Kg</p>
                            <p class="fw-bold fs-4">$${prod.price}</p>
                        
                        </div>
                    </div>
                </div>
                <div class="row g-0">
                    <div class="card-footer text-center">
                        <p>
                            <button class="btn btn-light text-dark" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapse-${i}" aria-expanded="false" aria-controls="collapse-${i}">
                                Más información
                            </button>
                            <div class="collapse" id="collapse-${i}">
                                <div class="card-text px-4">${prod.description} </div>
                            </div>
                        </p>
                        
                        <div class="d-flex flex-row justify-content-around align-items-center">
                            <button id="takeoutButton-${prod.id}" type="button"
                                class="btn btn-outline-danger rounded-circle border-0 square-button"
                                onclick="takeOutOfCart('${prod.id}');return false;">
                                <i class="fas fa-minus"></i>
                            </button>
                            <div> <span id="prodQty-${prod.id}" class="badge bg-light text-success fs-5"></span> </div>
                            <button id="addButton-${prod.id}" type="button" 
                                class="btn btn-outline-success rounded-circle border-0 square-button"
                                onclick="addToCart('${prod.id}');return false;">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <span id="stock-${prod.id}"
                        class="d-flex align-items-center position-absolute top-0 start-100 translate-middle badge badge-size text-wrap rounded-circle bg-green border border-white border-3"> Stock${prod.stock}Kg</span>
                </div>
            
            </div>
        </div>
        `;
        if ((i % 4) == 3) { // INSERT CARDDECK CLOSE
            cardContent += `</div>`;
        }
    });

    return cardContent;
}


const makeCartContentTemplate = (myShoopingList) => {
    let cartContent = ``;

    const copyMyShoopingList = [...myShoopingList];
    copyMyShoopingList.reverse();

    copyMyShoopingList.forEach((prod, i) => {

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
                                <p>Cantidad solicitada: <span class="fw-bold">${prod.qty} kg</span></p>
                                <p><span class="fw-bold">Subtotal : $${prod.qty * prod.price}</span></p>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="row g-0">
                    <p class="card-text">
                    <div class="d-flex flex-row justify-content-around align-items-center">
                        <button id="takeoutButtonCart-${prod.id}" type="button" class="btn btn-outline-danger rounded-circle border-0 square-button" 
                        onclick="takeOutOfCart('${prod.id}');return false;">
                            <i class="fas fa-minus"></i>
                        </button>
                        <div> <span class="badge bg-light text-success fs-6">Stock ${prod.stock} Kg</span>
                        </div>
                        <button id="addButtonCart-${prod.id}" type="button" class="btn btn-outline-success rounded-circle border-0 square-button" 
                        onclick="addToCart('${prod.id}');return false;">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    </p>
                </div>
            </div>
        `;
        
    });

    return cartContent;

}


const makeDropDownTemplate = () => {

    let dropDownTemplate = ``;

    let kinds = getKindsFromCatalogue();

    kinds.forEach( kind => {
        
        let members = catalogue.filter(prod => prod.kind === kind);

        dropDownTemplate +=
            `<li class="nav-item dropdown">
				<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown-${kind}" role="button" data-bs-toggle="dropdown" aria-expanded="false">
			        ${kind}
				</a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown-${kind}">
                    <li><a class="dropdown-item" href="./home.html?filterValue=${kind}#cards">Todas</a></li>`;
        if (members != []){
            dropDownTemplate += `<li><hr class="dropdown-divider"></li>`;
            members.forEach( m => {
                dropDownTemplate += `<li><a class="dropdown-item" href="./home.html?filterValue=${m.id}#cards">${m.name}</a></li>`
            });
        }
        dropDownTemplate += `</ul></li>`;
    });

    return dropDownTemplate;

}


/**
 * ----------------------------------------
 * Función para general los enlaces del navbar de manera dinámica.
 * ----------------------------------------
 */

 const makeDropDownList = () => {
    let dropDownTemplate = ``;
    dropDownTemplate = makeDropDownTemplate();
    document.getElementById('navbarNavContent').innerHTML = dropDownTemplate;
}


/**
 * ----------------------------------------
 * Función para agregar un nav-link en el navbar
 * ----------------------------------------
 */

const createNavLink = (pageName, textContent) => {
    let li = document.createElement('li');
    li.classList.add('nav-item');

    let a = document.createElement('a');
    a.classList.add('nav-link');
    a.setAttribute('href', `./${pageName}.html`);
    a.textContent = textContent;

    li.appendChild(a);
    
    if( document.getElementById('navbarNavContent') ) {
        document.getElementById('navbarNavContent').appendChild(li);
    }
}


/**
 * ----------------------------------------
 * Función para crear los items de carousel Home de manera dinámica.
 * ----------------------------------------
 */

const createCarouselHomeItems = (urlImg, qty, carouselInnerId) => {

    let carousel = document.getElementById(carouselInnerId);

    if( carousel ) {

        for (let i = 1; i <= qty; i++){
            
            let div = document.createElement('div');
            div.classList.add('carousel-item');
            if (i == 1 ) { div.classList.add('active') }; 
            
            let img = document.createElement('img');
            img.classList.add(['d-block', 'w-100']);
            img.setAttribute('src', `${urlImg}/${i}_1920.jpg`);    
            img.setAttribute('alt', `${i}_large.jpg`);
            img.setAttribute('srcset',`${urlImg}/${i}_1920.jpg 1920w,
								${urlImg}/${i}_1366.jpg 1366w,
								${urlImg}/${i}_1024.jpg 1024w,
								${urlImg}/${i}_768.jpg 768w,
								${urlImg}/${i}_375.jpg 375w`);

            div.appendChild(img);
            carousel.appendChild(div);
        }
    }
   
}


/**
 * ----------------------------------------
 * Función para crear los items de carousel de Categorias de manera dinámica.
 * ----------------------------------------
 */

const createCarouselCatagoriesItems = (urlImg, categNames, carouselCategInnerId) => {

    let carousel = document.getElementById(carouselCategInnerId);
    let carouselContent = ``;

    if( carousel ) {

        let mod = 1; // SCREEN SIZE < 768px sm and xs

        if( window.matchMedia('(min-width: 1440px)').matches ) { // SCREEN SIZE >= 1440px xxl
            mod = 4;
        } else if( window.matchMedia('(min-width: 1024px)').matches ) { // SCREEN SIZE >= 1024px lg
            mod = 3;
        } else if ( window.matchMedia('(min-width: 768px)').matches ) { // SCREEN SIZE >= 768px md
            mod = 2;
        }

        for(let i = 0; i < categNames.length; i++){
            
            if (i == 0 || (i % mod) == 0) { // INIT CAROUSEL ITEM AND SET ITEM ACTIVE
                i == 0 ? carouselContent += `<div class="carousel-item active">`: carouselContent += `<div class="carousel-item">`;
                carouselContent += `<div id="categories${i+1}" class="container py-3 my-3">
                                        <div class="row justify-content-center row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 g-3">`;
            }
                
            carouselContent += `<div class="col d-flex flex-column align-items-center">
                                    <div class="card overflow-hidden justify-content-center" style="width: 18rem;  min-width: 12rem;">
                                        <img src="${urlImg}/${categNames[i]}_600x400.jpg" class="card-img-bottom" alt="${categNames[i]}_600x400.jpg">
                                        <a href="./home.html?filterValue=${categNames[i]}#cards" class="btn btn-light text-black stretched-link">${categNames[i]}</a>
                                    </div>
                                </div>`;
            if((i%mod) == (mod-1) ){
                carouselContent += `</div></div></div>`;
            }
        }

        if((categNames.length)%mod !== 0){ // The carousel-item is open
            carouselContent += `</div></div></div>`;
        }
    
        carousel.innerHTML = carouselContent;

    }
}


/**
 * ----------------------------------------
 * Función para crear los items de checkout de manera dinámica.
 * ----------------------------------------
 */

const makeCheckoutItemsTemplate = (myShoopingList) => {

    let checkoutContent = ``;
    const copyMyShoopingList = [...myShoopingList];
    copyMyShoopingList.reverse();

    checkoutContent += `
        <ul class="list-group list-group-flush my-5 py-2 d-flex ">
            <li class="list-group-item">
                <div class="row g-0 mb-3">
                    <div class="col-6 text-center h6"> Producto </div>
                    <div class="col-2 h6"> Precio </div>
                    <div class="col-2 h6"> Cant. </div>
                    <div class="col-2 h6"> Total </div>
                </div>
            </li>`;

    copyMyShoopingList.forEach((prod, i) => {

        checkoutContent += `
            <li class="list-group-item">
                <div class="row g-0 mb-3 align-items-center">
                    <div class="col-6 d-flex flex-column flex-md-row align-items-center justify-content-center">
                        <img src="./assets/img/product/${prod.id}_100px.png" class="" alt="${prod.name}">
                        <div>${prod.name}</div>
                    </div>
                                
                    <div class="col-2"> $${prod.price}</div>
                    <div class="col-2"> ${prod.qty} Kg</div>
                    <div class="col-2"> $${prod.qty * prod.price}</div>
                </div>
            </li>`;
    });

    checkoutContent += `
        <li class="list-group-item">
            <div class="row g-0">
                <div class="col-6 text-center h6"></div>
                <div class="col-2 h6"></div>
                <div class="col-2 h6"> Sub Total</div>
                <div id="checkOutSubtotal" class="col-2 h6"> $12000</div>
            </div>
            <div class="row g-0">
                <div class="col-6 text-center h6"></div>
                <div class="col-2 h6"></div>
                <div class="col-2 h6"> Envio</div>
                <div id="checkOutEnvio" class="col-2 h6"> $300</div>
            </div>
            <div class="row g-0">
                <div class="col-6 text-center h6"></div>
                <div class="col-2 h6"></div>
                <div class="col-2 h5"> TOTAL</div>
                <div id="checkOutTotal" class="col-2 h5"> $12300</div>
            </div>
        </li>
        <button id="checkoutButton" class="list-group-item list-group-item-action list-group-item-success disabled text-center h4" type="button">
            INICIAR PAGO
        </button>
    </ul>`;

    return checkoutContent;
}


export { makeCardContentTemplate, makeCartContentTemplate, makeDropDownList, createNavLink, createCarouselHomeItems, createCarouselCatagoriesItems, makeCheckoutItemsTemplate};
