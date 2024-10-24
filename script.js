const apiURL = 'https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json';

let items = []
// Fetch products from the API and display them in the cart
async function fetchProducts() {
  try {
    const response = await fetch(apiURL);
    const product = await response.json();
    items.push(product)

    displayCartItems(product.items[0], product.items[0].id);

  } catch (error) {
    console.error("Error fetching products:", error);
  }
}


function displayCartItems(product, index) {
  const cartTableBody = document.querySelector('tbody');
  cartTableBody.innerHTML = '';
  const row = `
        <tr>
            <td><img src="${product.image}" alt="${product.name}" width="50"></td>
            <td>${product.title}</td>
            <td>${product.price}</td>
            <td>
                <input type="number" value="${product.quantity}" min="1" class="quantity-input" 
                    data-index="${index}" onchange="updateQuantity(${index}, ${product.price})">
            </td>
            <td class="subtotal">${product.price * product.quantity}</td>
            <td><button class="remove-item delete-btn" onclick="deleteItem(${index})"><i class="fa-solid fa-trash"></i></button></td>
        </tr>`;
  cartTableBody.innerHTML += row;

  updateCartTotal();
}

// update the quantity when the user changes the input
function updateQuantity(index, price) {
  const quantityInputs = document.querySelector('.quantity-input');
  const quantity = quantityInputs.value;
  const newSubtotal = price * quantity;

  // Update the subtotal for that product row
  const subtotalCells = document.querySelectorAll('.subtotal');
  subtotalCells[0].textContent = newSubtotal;


  updateCartTotal(); // Recalculate total price after quantity update
}

// Function to delete a product from the cart
function deleteItem(index) {
  const cartTableBody = document.querySelector('tbody');
  const row = document.querySelector('tbody tr');

  // Remove the selected product row from the cart table
  cartTableBody.removeChild(row);

  updateCartTotal(); // Update total after deletion
}


//update the total cart value
function updateCartTotal() {
  const subtotal = document.querySelectorAll('.subtotal');
  let total = 0;

  // Sum all subtotals to calculate the cart total
  total += parseFloat(subtotal[0].textContent);

  if (!total) total = 0;

  // Update the total amount in the cart total section
  const cartTotals = document.querySelector('.cart-totals');
  cartTotals.innerHTML = `  
                  <h3>Cart Totals</h3>
                  <div class="totals">
                      <div class="subtotal">
                          <span>Subtotal</span>
                          <span>${items[0].currency} ${total}</span>
                      </div>
                      <div class="total">
                          <span>Total</span>
                          <span class="price">${items[0].currency} ${total}</span>
                      </div>
                  </div>
                  <button class="checkout-btn">Check Out</button>`
}

// Initialize cart by fetching products from API on page load
window.onload = fetchProducts;

