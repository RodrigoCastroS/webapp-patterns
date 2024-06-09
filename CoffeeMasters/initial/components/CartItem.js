import { removeFromCart } from "../services/Order.js";

export default class CartItem extends HTMLElement {
    constructor() {
        super();    
    }   

    connectedCallback() {
        const item = JSON.parse(this.dataset.item);
        this.innerHTML = ""; // Clear the element

    
        // This fn can be extracted as helper so it can be used anywhere. It's a bit hacky,
        // but the purpose is to have easier dynamic data.

        function interpolate(str, params){
            const names = Object.keys(params); // qty, name, price
            const values = Object.values(params); // 1, 'hot coffee', '2,99'
            const body = `return \`${str}\`;`;
            return new Function(...names, `return \`${str}\`;`)(...values); // This fn is autoInvoqued when calling interpolated.
        }


        const template = document.getElementById("cart-item-template");
        this.innerHTML = interpolate(template.innerHTML, {
            qty: `${item.quantity}x`, 
            price: `$${item.product.price.toFixed(2)}`,
            name: item.product.name
        });

    
        this.querySelector("a.delete-button").addEventListener("click", event => {
            removeFromCart(item.product.id);
        })
      }
}

customElements.define("cart-item", CartItem);