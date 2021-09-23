"use strict";
import { catalogue } from './product_mockup.js';

/**
 * ----------------------------------------
 * Class Cart
 * ----------------------------------------
 */

class Cart {

    constructor(data){
        this._shoopingList = data.shoopingList || [],
        this._subtotal = data.subtotal || 0.00,
        this._shipping = data.shipping || 300.00,
        this._total = data.total || 0.00,
        this._minPurchase = data.minPurchase || 500,
        this._enable = data.enable || false 
    }

    get total(){
        return this._total;
    }

    get subtotal(){
        return this._subtotal;
    }

    get enable(){
        return this._enable;
    }

    get shoopingList() {
        return this._shoopingList;
    }

    get shipping() {
        return this._shipping;
    }

    cartSize(){

        let count = 0;
        this._shoopingList.forEach(prod => count += prod.qty);

        return count;
    }

    addItem(id){
        let status = false;
        let prod = this.findProdById(id, catalogue);
        if(prod.stock > 0) { // there is stock
            catalogue.find(prod => prod.id === id).stockMinusOne(); // reduces stock by one unit
           
            let idx = this._shoopingList.findIndex(prod => prod.id === id);
            if( idx >= 0) { // Prod Found on Cart
                this._shoopingList[idx].qtyPlusOne();
            } else { // Prod not found on Cart
                prod.qtyPlusOne();
                this._shoopingList.push(prod);
            }

            this.updateTotals('addItem', id);
          
            status = true;

        } else { // STOCK 0
            console.log(`No queda stock de ${prod.name}.`);
        }
        return status;
    }

    dropItem(id){
        let idx = this._shoopingList.findIndex(prod => prod.id === id);
        if( idx >= 0) { // prod found
            catalogue.find(prod => prod.id === id).stockPlusOne(); // Increase stock by one unit

            if (this._shoopingList[idx].qty > 1) { // More than One
                this._shoopingList[idx].qtyMinusOne();
            } else {
                this._shoopingList[idx].qtyMinusOne();
                this._shoopingList.splice(idx, 1)[0];
            }

            this.updateTotals('dropItem', id);
         
        } else { // prod not found
            console.log("No se puede sacar el producto. El producto no esta en el carro.");
        }
    }

    updateTotals(command , prodId) {

        let prod = this.findProdById(prodId, catalogue);        
        
        switch (command) {
            case 'addItem':
                this._subtotal += prod.price;
                if( this.cartSize() == 1){ // Add the shipping cost only once 
                    this._total += this._shipping;
                }
                this._total += prod.price 
                this.isEnable(); //controls if the minimum purchase was reached 
                break;
            case 'dropItem':
                this._subtotal -= prod.price;
                if( this.cartSize() == 0){
                    this._total -= this._shipping;
                }
                this._total -= prod.price 
                this.isEnable();
                break;
            default:
                break;
        }

    }

    findProdById(id, catalogue){
        return catalogue.find(prod => prod.id === id);
    }

    /**
     * Function: Controls if the minimum purchase was reached 
     * @returns 
     */

    isEnable(){
        this._subtotal >= this._minPurchase ? this._enable = true : this._enable = false;
        return this._enable;
    }
    

    empty(){

        this.shoopingList.forEach( item => {
            catalogue.find(prod => prod.id === item.id).stockPlusOne();
        })

        this._shoopingList.length = 0;
        this._subtotal = 0.00;
        this._shipping = 300.00;
        this._total = 0.00;
        this._enable = false;
    }

    stringify(){

        let myShoppingList  = [];
        this._shoopingList.forEach(prod => myShoppingList.push(prod.toJsonString()) );

        let mycart = {
            shoopingList: myShoppingList,
            subtotal: this._subtotal,
            shipping: this._shipping,
            total: this._total,
            minPurchase: this._minPurchase,
            enable: this._enable
        }
        return mycart;
    }
}

export { Cart };