"use strict";

import { catalogue, getKindsFromCatalogue } from "./product_mockup.js";

const makeCardContentTemplate = (filteredCatalog) => {
    
    let cardContent = ``;
    
    filteredCatalog.forEach((prod, i) => {

        if ((i % 4) == 0) { // INSERT CARDDECK INIT
            cardContent += `<div class="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-4 g-4">`;
        }
        cardContent += `
        <div class="col py-4 px-4">
            <div class="card h-100 mx-2">
                <div class="card-header text-center">
                    <h5 class="card-title">${prod.name}</h5>
                </div>
                <div class="row h-100 g-0 pt-3">
                    <div class="col-6">
                        <img class="card-img-top" src="/assets/img/product/${prod.id}.jpg" alt="">
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
                                class="btn btn-outline-danger rounded-circle border-0"
                                onclick="takeOutOfCart('${prod.id}');return false;">
                                <i class="fas fa-minus fa-2x"></i>
                            </button>
                            <div> <span id="prodQty-${prod.id}" class="badge bg-light text-success fs-5"></span> </div>
                            <button id="addButton-${prod.id}" type="button" 
                                class="btn btn-outline-success rounded-circle border-0"
                                onclick="addToCart('${prod.id}');return false;">
                                <i class="fas fa-plus fa-2x"></i>
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


const makeCartContentTemplate = (catalogue, myShoopingList) => {
    let cartContent = ``;

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
                            <button id="takeoutButtonCart-${prod.id}" type="button" class="btn btn-outline-danger rounded-circle border-0" onclick="takeOutOfCart('${prod.id}');return false;">
                                <i class="fas fa-minus fa-2x"></i>
                            </button>
                            <div> <span class="badge bg-light text-success fs-6">Stock ${prod.stock} Kg</span>
                            </div>
                            <button id="addButtonCart-${prod.id}" type="button" class="btn btn-outline-success rounded-circle border-0" onclick="addToCart('${prod.id}');return false;">
                                <i class="fas fa-plus fa-2x"></i>
                            </button>
                        </div>
                        </p>
                    </div>
                </div>
            `;
        }
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
                    <li><a class="dropdown-item" href="./home.html?filterValue=${kind}">Todas</a></li>`;
        if (members != []){
            dropDownTemplate += `<li><hr class="dropdown-divider"></li>`;
            members.forEach( m => {
                dropDownTemplate += `<li><a class="dropdown-item" href="./home.html?filterValue=${m.id}">${m.name}</a></li>`
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
 * Función para crear los items de carousel de manera dinámica.
 * ----------------------------------------
 */

const createCarouselItems = (urlImg, qty, carouselInnerId) => {

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

export { makeCardContentTemplate, makeCartContentTemplate, makeDropDownList, createNavLink, createCarouselItems };
