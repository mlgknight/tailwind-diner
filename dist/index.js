import { menuArray } from "/dist/data.js";


// program based variables

let ordersArray = []
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
    } else if (e.target.dataset.payClose){
        handleFormClose()
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
    localStorage.setItem('ordersArray', JSON.stringify(ordersArray)); 
}

function loadOrdersFromLocalStorage() {
    const storedOrders = localStorage.getItem('ordersArray');
    if (storedOrders) {
        ordersArray = JSON.parse(storedOrders);
    }
}

loadOrdersFromLocalStorage();


// add and remove based functions

function handleAddClick(dataID) {
    const currentData = menuArray.filter(item => {
        return item.id === Number(dataID);
    })[0];

    const noDoubleItem = ordersArray.find(item => item.id === Number(dataID))

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
        ordersArray.push(itemObject)
        saveOrdersToLocalStorage()

    }




    totalPriceHtml()
    renderHtml(createCheckoutHtml(), "check-out-items");
}



function handleRemoveClick(dataID){
    const index = ordersArray.findIndex(item => item.id === Number(dataID));
    const elementToRemove = document.getElementById(`item-${dataID}`);

    const currentData = menuArray.filter(item => {
        return item.id === Number(dataID);
    })[0];

    const reduceItem = ordersArray.find(item => item.id === Number(dataID))

        changeForm.style.display = "none"

        
        if (reduceItem.quantity <= 1){

            if (elementToRemove){
                elementToRemove.remove
            }
            ordersArray.splice(index, 1)
    
        } else {reduceItem.quantity > 1
            reduceItem.quantity -- 
            reduceItem.price = reduceItem.price - currentData.price
            
            }
            saveOrdersToLocalStorage()
}


// checkout focused Functions

function handleFormClose(){
    changeForm.style.display = "none"
}

function handleTotalprice(){
    const totalPrice = ordersArray.reduce((total, currentItem) => {
        return total + currentItem.price;
    }, 0)

    localStorage.setItem('totalPriceVariable', JSON.stringify(totalPrice));
    const storedPriceTotal = localStorage.getItem('totalPriceVariable');
    return storedPriceTotal;
}

function payFunction(){

    if(ordersArray.length >= 1){
    changeForm.addEventListener('submit', function(event) { 
        event.preventDefault();
        orderDone()
})


    localStorage.removeItem("ordersArray")
    localStorage.removeItem("totalPriceVariable")
        changeForm.style.display = "flex"

    
    }
}

function orderDone(){
    const UserName = document.getElementById("user-name").value
    changeForm.style.display = "none"
    checkOutSection.innerHTML = `
                            <div class="flex flex-col items-center">
                                <p class="  max-w-72 finished-text ">Thank you, ${UserName}! Your order is on its way. We appreciate your business and hope you enjoy your purchase!</p>
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

    ordersArray.forEach(function(item){

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
