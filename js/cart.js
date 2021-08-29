"use strict";
import { catalogue } from './product_mockup.js';

/**
 * ----------------------------------------
 * Class Cart
 * ----------------------------------------
 */

class Cart {

    #_shoopingList;
    #_subtotal;
    #_shipping;
    #_total;
    #_minPurchase;
    #_enable;

    constructor(data){
        this.#_shoopingList = data.shoopingList || [],
        this.#_subtotal = data.subtotal || 0.00,
        this.#_shipping = data.shipping || 300.00,
        this.#_total = data.total || 0.00,
        this.#_minPurchase = data.minPurchase || 500,
        this.#_enable = data.enable || false 
    }

    get total(){
        return this.#_total;
    }

    get subtotal(){
        return this.#_subtotal;
    }

    get enable(){
        return this.#_enable;
    }

    get shoopingList() {
        return this.#_shoopingList;
    }

    cartSize(){
        return this.#_shoopingList.length;
    }

    addItem(id){
        let status = false;
        let prod = this.#findProdById(id, catalogue);
        if(prod.stock > 0) { // there is stock
            catalogue.find(prod => prod.id === id).stockMinusOne(); // reduces stock by one unit
            this.#_shoopingList.push(prod);
            this.#_subtotal += prod.price;
            if( this.#_shoopingList.length == 1){
                this.#_total += this.#_shipping;
            }
            this.#_total += prod.price 
            this.isEnable();
            status = true;
        } else {
            console.log(`No queda stock de ${prod.name}.`);
        }
        return status;
    }

    dropItem(id){
        let idx = this.#_shoopingList.findIndex(prod => prod.id === id);
        if( idx >= 0) { // prod found
            catalogue.find(prod => prod.id === id).stockPlusOne(); // Increase stock by one unit
            const removed = this.#_shoopingList.splice(idx, 1)[0];
            this.#_subtotal -= removed.price;
            if( this.#_shoopingList.length == 0){
                this.#_total -= this.#_shipping;
            }
            this.#_total -= removed.price 
            this.isEnable();
        } else { // prod not found
            console.log("No se puede sacar el producto. El producto no esta en el carro.");
        }
    }

    #findProdById(id, cataloguue){
        return catalogue.find(prod => prod.id === id);
    }


    isEnable(){
        this.#_subtotal >= this.#_minPurchase ? this.#_enable = true : this.#_enable = false;
        return this.#_enable;
    }
    

    empty(){

        this.shoopingList.forEach( item => {
            catalogue.find(prod => prod.id === item.id).stockPlusOne();
        })

        this.#_shoopingList.length = 0;
        this.#_subtotal = 0.00;
        this.#_shipping = 300.00;
        this.#_total = 0.00;
        this.#_enable = false;
    }

    stringify(){

        let myShoppingList  = [];
        this.#_shoopingList.forEach(prod => myShoppingList.push(prod.toJsonString()) );

        let mycart = {
            shoopingList: myShoppingList,
            subtotal: this.#_subtotal,
            shipping: this.#_shipping,
            total: this.#_total,
            minPurchase: this.#_minPurchase,
            enable: this.#_enable
        }
        return mycart;
    }
}

export { Cart };