/* □□□□□□□□□□□□□□□□□□□□□□□□□□□□ MODAL CART □□□□□□□□□□□□□□□□□□□□□□□□□□□□ */
let openCart = document.getElementById('open_cart')
let modalCart = document.getElementById('modal')
let closeModal = document.getElementById('close')

//Open modal
openCart.onclick = function(){
    modalCart.style.visibility = "visible";
}

//Close modal 
closeModal.onclick = function(){
    modalCart.style.visibility = "hidden";
}

/* □□□□□□□□□□□□□□□□□□□□□□□□□□□□ CART □□□□□□□□□□□□□□□□□□□□□□□□□□□□ */
let carrito = [];
let stockProductos = [];

const carritoContador = document.querySelector('#cart_counter')
const container = document.querySelector('#products-container')
const vaciarCarrito = document.querySelector('#vaciarCarrito ')
const precioTotal = document.querySelector('#precioTotal')


document.addEventListener('DOMContentLoaded', () => {
    carrito = JSON.parse(localStorage.getItem('carrito')) || []
    mostrarCarrito()
})

fetch("../js/stock.json")
    .then(response => response.json())
    .then(data => {
        stockProductos = data;
        cargarProductos(stockProductos);

    })

const cargarProductos = () => {
    stockProductos.forEach((prod) => {
        const {id, nombre, precio, desc, img, cantidad} = prod
        container.innerHTML += `
            <div class="card_products">
                <img class="cart_product-img" src="${img}" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">${nombre}</h5>
                    <p class="card-text">Precio: ${precio}</p>
                    <p class="card-text">Descripcion: ${desc}</p>
                    <p class="card-text">Cantidad: ${cantidad}</p>
                    <button class="btn" onclick="agregarProducto(${id})">Comprar Producto</button>
                </div>
            </div>
        ` 
    })

}

vaciarCarrito.addEventListener('click', () => {
    carrito.length = []  
    mostrarCarrito()
})

function agregarProducto(id){

    const existe = carrito.some(prod => prod.id === id)
    if(existe){
        const prod = carrito.map(prod => {
            if(prod.id === id){
                prod.cantidad++
            }
        })
    } else{
        const item = stockProductos.find((prod) => prod.id === id)
        carrito.push(item)
    }
    mostrarCarrito()
}

const mostrarCarrito = () => {
    const modalBody = document.querySelector('.modal-container .modal-body')
    
    modalBody.innerHTML = ''
    carrito.forEach((prod) =>{
        const {id, nombre, img, desc, cantidad, precio} = prod
        modalBody.innerHTML += `
        <div class="activeCart__modal-container">
            <div>
                <img class="img-cart" src="${img}"/>
            </div>
            <div>
                <p>Producto: ${nombre}</p>
                <p>Precio: ${precio}</p>
                <p>Cantidad :${cantidad}</p>
                <button class="close"  onclick="eliminarProducto(${id})">Eliminar producto</button>
            </div>
        </div>
        `
    })

    if(carrito.length === 0){
        modalBody.innerHTML = `
        <p class="message_empty"> ¡Aun no agregaste nada!
        `
    } else {
        console.log('hay algo')
    }


    carritoContador.textContent = carrito.length

    precioTotal.innerText= carrito.reduce((acc, prod) => acc + prod.cantidad * prod.precio, 0)

    guardarStorage()
}

function eliminarProducto(id){
    const juegoId = id
    carrito = carrito.filter((juego) => juego.id !== juegoId)
    mostrarCarrito()
}

function guardarStorage(){
    localStorage.setItem("carrito", JSON.stringify(carrito))
}
