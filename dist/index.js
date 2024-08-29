import { menuArray } from "/dist/data.js";


// program based variables

let orderesArray = []
const changeForm = document.getElementById("checkout-form")
const checkOutSection = document.getElementById("replace-section")
// To render localstorage data
loadOrdersFromLocalStorage();
totalPriceHtml()
// theme control
themeController ()
// event Listener for the document

document.addEventListener("click", function(e){
    if(e.target.dataset.addOrder){
        handleAddClick(e.target.dataset.addOrder);
        handleTotalprice();
        saveOrdersToLocalStorage()
    } else if(e.target.dataset.removeOrder){
        handleRemoveClick(e.target.dataset.removeOrder);
        totalPriceHtml()
        renderHtml(createCheckoutHtml(), "check-out-items");
    } else if(e.target.dataset.placeOrder){
        payFunction()
    } else if (e.target.dataset.payDone){
        payFunction()
        localStorage.clear()
    }
});


// theme change function
function themeController (){
    const storedTheme = JSON.parse(localStorage.getItem('documentTheme'));
    const themeControl = document.getElementById("theme-control");
    const documentTheme = document.querySelector("html");
    let currentTheme = documentTheme.dataset.theme

    if(storedTheme){
        currentTheme = storedTheme
        documentTheme.dataset.theme = currentTheme
        themeControl.checked = currentTheme === "dark"
    }


    
    themeControl.addEventListener("change", function(){
        if(themeControl.checked){
            currentTheme = "dark";
            
        } else {
            currentTheme = "light";
        }
        localStorage.setItem('documentTheme', JSON.stringify(currentTheme));
        documentTheme.dataset.theme = currentTheme  
    })
}


// local storage functions

function saveOrdersToLocalStorage() {
    localStorage.setItem('orderesArray', JSON.stringify(orderesArray)); 
}

function loadOrdersFromLocalStorage() {
    const storedOrders = localStorage.getItem('orderesArray');
    if (storedOrders) {
        orderesArray = JSON.parse(storedOrders);
    }
}

loadOrdersFromLocalStorage();


// add and remove based functions

function handleAddClick(dataID) {
    const currentData = menuArray.filter(item => {
        return item.id === Number(dataID);
    })[0];

    const noDoubleItem = orderesArray.find(item => item.id === Number(dataID))

    if (noDoubleItem){
        noDoubleItem.quantity += 1
        noDoubleItem.price += currentData.price
    } else {
        const itemObject = {
            name: currentData.name,
            price: currentData.price,
            id: currentData.id,
            quantity: 1
            
        }
        orderesArray.push(itemObject)
        saveOrdersToLocalStorage()

    }




    totalPriceHtml()
    renderHtml(createCheckoutHtml(), "check-out-items");
}



function handleRemoveClick(dataID){
    const index = orderesArray.findIndex(item => item.id === Number(dataID));
    const elementToRemove = document.getElementById(`item-${dataID}`);

    const currentData = menuArray.filter(item => {
        return item.id === Number(dataID);
    })[0];

    const reduceItem = orderesArray.find(item => item.id === Number(dataID))

        changeForm.style.display = "none"

        
        if (reduceItem.quantity <= 1){

            if (elementToRemove){
                elementToRemove.remove
            }
            orderesArray.splice(index, 1)
    
        } else {reduceItem.quantity > 1
            reduceItem.quantity -- 
            reduceItem.price = reduceItem.price - currentData.price
            
            }
            saveOrdersToLocalStorage()
}


// checkout focused Functions

function handleTotalprice(){
    const totalPrice = orderesArray.reduce((total, currentItem) => {
        return total + currentItem.price;
    }, 0)

    localStorage.setItem('totalPriceVariable', JSON.stringify(totalPrice));
    const storedPriceTotal = localStorage.getItem('totalPriceVariable');
    console.log(storedPriceTotal);
    return storedPriceTotal;
}

function payFunction(){

    const form = document.querySelector('form');
    const input = document.querySelector('input');
    console.log(input)
    if(orderesArray.length >= 1){
    changeForm.addEventListener('submit', function(event) { 
        event.preventDefault();
        orderDone()
})


    localStorage.clear()
        changeForm.style.display = "flex"

    
    }
}

function orderDone(){
    changeForm.style.display = "none"
    checkOutSection.innerHTML = `
                            <div class="flex flex-col items-center">
                                <p class="finished-text "> Your Order Is on The Way!</p>
                                <button class=" button-sizing check-out btn btn-primary" onClick="window.location.reload();">New Order?</button>
                            </div>
                                `

}






// HTML creation functions


function totalPriceHtml(){
    const totalSection = document.getElementById("total-section");
    totalSection.innerText = `Your Total: $${handleTotalprice()}`


}

function createMenuHtml(){
    let htmlCreator = ``;

    menuArray.forEach(function(menu){
        const {image, name, ingredients, id, price} = menu;
    
        htmlCreator += `
            <div class="  card-compact lg:card-side card card-bordered img-size bg-base-100 shadow-xl">
                <figure>
                    <img src="${image}" alt="menu" />
                </figure>
                <div class=" gap card-body">
                    <h2 class="card-title">${name}</h2>
                    <p>${ingredients.join(", ")}</p>
                    <div class="card-actions">
                        <div class="item-m">
                        <p class="card-title">$${price}</p>
                        </div>
                        <button data-add-order="${id}" class=" w-20  button-cos btn btn-primary">Order Now</button>
                    </div>
                </div>
            </div>
        `;
    });

    return htmlCreator;
}

function createCheckoutHtml(){
    let htmlCreator = ``;

    orderesArray.forEach(function(item){

        const {name, price, id, quantity} = item

        htmlCreator += `
            
                    
                        <li class=" flex flex-1 flex-col" id="item">
                            <h2>${name}</h2>
                            <h2 class="price-cos">$${price}</h2>
                            <h2>${quantity}x</h2>
                            <button data-remove-order="${id}">Remove</button>
                        </li>
            
                    <hr class=" hr-color ">

        `;
    });

    return htmlCreator;
}

function renderHtml(html, selectElement){
    document.getElementById(selectElement).innerHTML = html;
}


renderHtml(createMenuHtml(), "menu-items");
renderHtml(createCheckoutHtml(), "check-out-items");
