"use strict";
/**
 * ----------------------------------------
 * Class Product
 * ----------------------------------------
 */

class Product {
   
    constructor(prod){
        this._id = prod.id || 999999;
        this._name = prod.name || 'newproduct';
        this._price = prod.price || 0;
        this._description = prod.description || 'empty';
        this._weight = prod.weight || 1; 
        this._discount = prod.discount || 0;
        this._kind = prod.kind || 'wrongkind'
        this._stock = prod.stock || 0;
        this._qty = prod.qty || 0;
    }

    /**  Getters for private attributes **/
    
    get id(){
        return this._id;
    }

    get name(){
        return this._name;
    }

    get discount() {
        return this._discount;
    }

    get price(){
        return this._price;
    }

    get description(){
        return this._description;
    }

    get weight(){
        return this._weight;
    }

    get discount(){
        return this._discount;
    }

    get stock(){
        return this._stock;
    }

    get kind(){
        return this._kind;
    }

    get qty(){
        return this._qty;
    }

    /**  Setters for private attributes **/

    /*** Set the stock in qty units ***/
    reduceStock(qty){
        this._stock -= qty;
    }

    stockPlusOne(){
        this._stock +=1;
    }

    stockMinusOne(){
        this._stock >= 1 ? this._stock -= 1 : console.log(`Stock de ${this._name}: ${this._stock}, menor a 1.`);
    }

    qtyPlusOne(){
        this._qty += 1;
    }

    qtyMinusOne(){
        this._qty >= 1 ? this._qty -= 1 : console.log(`QTY de ${this._name}: ${this._qty}, menor a 1.`);
    }

    /* Consulta si el producto tiene descuento en el precio.
       Retorna un booleano */
    isItDiscounted() {
        this.discount > 0 ? true: false;    
    }

    toJsonString() {
        let json = {
            id: this._id,
            name: this._name,
            price: this._price,
            description: this._description,
            weight: this._weight, 
            discount: this._discount,
            kind: this._kind,
            stock: this._stock,
            qty: this._qty
        };
        return json;
    }
 

}

export { Product };

