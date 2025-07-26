function showMenu(menuType) {
    const sections = ['veg', 'nonveg', 'drinks', 'dessert'];
    sections.forEach(section => {
        const sectionElement = document.getElementById(section);
        if (section === menuType) {
            sectionElement.style.display = 'block';
        } else {
            sectionElement.style.display = 'none';
        }
    });
}

// Prevent users from selecting past dates in the reservation form
document.addEventListener("DOMContentLoaded", () => {
    const reservationDate = document.getElementById("reservationDate");
    if (reservationDate) {
        reservationDate.min = new Date().toISOString().slice(0, 16);
    }
});

document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const resultText = document.getElementById("selectedItem");
const categorySelect = document.getElementById("categorySelect");

const foodCategories = {
    veg: ["Tandoori Paneer Tacos", "Biryani Paella", "Malai Kofta Ravioli", "Truffle Butter Paneer Risotto", "Avocado toast", "pasta primavera"],
    nonveg: ["Butter Chicken Bao", "Malabar Butter Lobster", "Chicken Shawarma Taco", "Spicy Prawn Tempura Roll", "duck confit", "grilled beef steak"],
    desserts: ["Gulab Jamun Cheesecake", "Chai Tiramisu", "Rasmalai Tres Leches", "Chocolate Samosa", "carrot cake", "pistachio kulfi"],
    drinks: ["Turmeric Latte Martini", "Masala Whiskey Sour", "Mango Lassi Mojito", "Rose Cardamom Cold Brew", "mimosa", "berry smoothie"]
};
const itemPrices = {
    "Tandoori Paneer Tacos": 250,
    "Biryani Paella": 300,
    "Malai Kofta Ravioli": 350,
    "Truffle Butter Paneer Risotto": 400,
    "Avocado toast": 180,
    "pasta primavera": 320,
    "Butter Chicken Bao": 350,
    "Malabar Butter Lobster": 450,
    "Chicken Shawarma Taco": 300,
    "Spicy Prawn Tempura Roll": 350,
    "duck confit": 600,
    "grilled beef steak": 500,
    "Gulab Jamun Cheesecake": 180,
    "Chai Tiramisu": 200,
    "Rasmalai Tres Leches": 220,
    "Chocolate Samosa": 150,
    "carrot cake": 180,
    "pistachio kulfi": 240,
    "Turmeric Latte Martini": 250,
    "Masala Whiskey Sour": 300,
    "Mango Lassi Mojito": 200,
    "Rose Cardamom Cold Brew": 180,
    "mimosa": 250,
    "berry smoothie": 200
};

let selectedCategory = "veg";
let foodItems = foodCategories[selectedCategory];
let numSegments = foodItems.length;
let arc = (2 * Math.PI) / numSegments;
let startAngle = 0;
let spinAngle = 0;
let spinning = false;

canvas.width = 500;
canvas.height = 500;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = centerX - 40;

function drawPointer() {
    // Adjust the pointer size based on the canvas size
    const pointerHeight = canvas.height / 15; // Make pointer height relative to canvas size
    const pointerWidth = pointerHeight / 2; // Adjust width proportionally

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(centerX - pointerWidth, 10); // Left side of pointer
    ctx.lineTo(centerX + pointerWidth, 10); // Right side of pointer
    ctx.lineTo(centerX, pointerHeight); // Pointed bottom of pointer
    ctx.fill();
}
function spinWheel() {
    if (spinning) return;
    spinning = true;
    let totalSpin = (Math.random() * 5 + 5) * 2 * Math.PI;
    let duration = 3000;
    let startTime = null;
    
    function animateWheel(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = timestamp - startTime;
        let easing = easeOut(progress / duration) * totalSpin;
        spinAngle = easing;
        drawWheelWithRotation();
        if (progress < duration) {
            requestAnimationFrame(animateWheel);
        } else {
            spinning = false;
            selectWinner();
        }
    }
    requestAnimationFrame(animateWheel);
}

function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
}

function drawWheelWithRotation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(spinAngle);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    drawWheel();
    ctx.restore();
    drawPointer();
}

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < foodItems.length; i++) {
        const angle = startAngle + i * arc;
        ctx.fillStyle = i % 2 === 0 ? "#FF9800" : "#FFB74D";
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, angle + arc, false);
        ctx.lineTo(centerX, centerY);
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.stroke();
        ctx.closePath();
        
        ctx.save();
        ctx.translate(
            centerX + Math.cos(angle + arc / 2) * (radius - 40),
            centerY + Math.sin(angle + arc / 2) * (radius - 40)
        );
        ctx.rotate(angle + arc / 2);

        let text = foodItems[i];
        let fontSize = text.length > 15 ? "12px" : "14px";
        ctx.font = `bold ${fontSize} Arial`;
        ctx.textAlign = "center";
        ctx.fillStyle = "black";

        let words = text.split(" ");
        let lineHeight = 14;
        let y = -5;
        words.forEach((word, index) => {
            ctx.fillText(word, 0, y + index * lineHeight);
        });

        ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.stroke();
}

function selectWinner() {
    let adjustedAngle = (spinAngle + Math.PI / 2) % (2 * Math.PI);
    let winningIndex = Math.floor((numSegments - (adjustedAngle / arc)) % numSegments);
    let selectedItem = foodItems[winningIndex];
    resultText.textContent = `You got: ${selectedItem}`;
    
    let addToOrder = confirm(`You got: ${selectedItem}. Do you want to add this to your online order?`);

    if (addToOrder) {
        let quantity = prompt(`How many ${selectedItem}s would you like to order?`, "1");
        if (quantity && !isNaN(quantity) && parseInt(quantity) > 0) {
            quantity = parseInt(quantity);
            let price = itemPrices[selectedItem]; 
            addToPlate(selectedItem, price, quantity);
        } else {
            alert("Please enter a valid quantity.");
        }
    }
}

function removeFromPlate(button) {
    button.parentElement.parentElement.remove();
    updateTotal();
}

function updateTotal() {
    let total = 0;
    document.querySelectorAll("#plateList li").forEach(item => {
        total += parseFloat(item.querySelector(".item-total-price").textContent.replace("₹", "").replace(",", ""));
    });
    // Ensure the total is shown with two decimal places
    document.getElementById("totalAmount").textContent = `₹${total.toFixed(2)}`;
    console.log(`Updated Total: ₹${total.toFixed(2)}`);
}

function addToPlate(itemName, price, qty) {
    // Ensure qty is a valid number, defaulting to 1 if invalid
    const validQty = isNaN(qty) || qty < 1 ? 1 : parseInt(qty);
    const plateList = document.getElementById("plateList");
    let existingItem = document.querySelector(`li[data-name="${itemName}"]`);
    
    if (existingItem) {
        let qtySpan = existingItem.querySelector(".item-qty");
        let totalPriceSpan = existingItem.querySelector(".item-total-price");

        let newQty = parseInt(qtySpan.textContent) + validQty;
        qtySpan.textContent = newQty;
        totalPriceSpan.textContent = `₹${(price * newQty).toFixed(2)}`;

        console.log(`Updated ${itemName}: Qty = ${newQty}, Total Price = ₹${price * newQty}`);
    } else {
        const li = document.createElement("li");
        li.dataset.name = itemName;
        li.innerHTML = `
            <div class="item-details">
                <strong>${itemName}</strong>
                <span class="price">₹${price}</span>
                <span class="item-qty">${validQty}</span>
                <span class="item-total-price">₹${price * validQty}</span>
                <button class="remove-item" onclick="removeFromPlate(this)">Remove</button>
            </div>
        `;
        plateList.appendChild(li);

        console.log(`Added ${itemName}: Qty = ${validQty}, Total Price = ₹${price * validQty}`);
    }

    updateTotal();
}

categorySelect.addEventListener("change", function () {
    selectedCategory = categorySelect.value;
    foodItems = foodCategories[selectedCategory];
    numSegments = foodItems.length;
    arc = (2 * Math.PI) / numSegments;
    drawWheel();
    drawPointer();
});

spinButton.addEventListener("click", spinWheel);

drawWheel();
drawPointer();

document.getElementById('guessButton').addEventListener('click', function() {
    const guess = parseInt(document.getElementById('guessInput').value);
    const randomNumber = Math.floor(Math.random() * 11);
    const resultText = document.getElementById('guessResult');
    const totalAmountElement = document.getElementById('totalAmount');

    if (guess === randomNumber) {
        resultText.textContent = "Congratulations! You guessed correctly! A 20% discount will be applied to your order.";

        // Apply 20% Discount logic here
        const totalAmountText = totalAmountElement.textContent;
        const currentTotal = parseFloat(totalAmountText.replace('₹', '')); // Remove '₹' and parse to float

        if (!isNaN(currentTotal) && currentTotal > 0) {
            const discountAmount = currentTotal * 0.20; // Calculate 20% discount
            const discountedTotal = currentTotal - discountAmount; // Apply discount
            totalAmountElement.textContent = `₹${discountedTotal.toFixed(2)}`; // Update total with discount
        } else {
            resultText.textContent += " However, there is nothing in your order to discount.";
        }

    } else {
        resultText.textContent = `Sorry, the correct number was ${randomNumber}. Better luck next time!`;
    }
});

document.getElementById("placeOrderBtn").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent form submission
    document.getElementById("popup").style.display = "block";
    document.getElementById("overlay").style.display = "block";
});

function closePopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    location.reload(); // Reload after closing the popup
}

document.getElementById('reservationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    document.getElementById("reservationPopup").style.display = "block";
    document.getElementById("reservationOverlay").style.display = "block";
    this.reset(); // Reset the form
});

function closeReservationPopup() {
    document.getElementById("reservationPopup").style.display = "none";
    document.getElementById("reservationOverlay").style.display = "none";
}
function updateText() {
    const heroText = document.getElementById("hero-text");
    const bgImage = getComputedStyle(document.querySelector(".showcase")).backgroundImage;
   
    heroText.classList.remove("show");
    setTimeout(() => {
        if (bgImage.includes("history.png")) {
            heroText.innerHTML = '<h1>The Story Behind Spice Route</h1><p>Inspired by the centuries-old spice trade, Spice Route was founded with a vision to bring the best of Indian spices to a global dining table. Our chefs craft each dish with creativity, passion, and innovation. Every ingredient tells a story, from hand-picked spices to the artful presentation of each dish, ensuring a unique culinary experience for every guest. We invite you to savor the legacy of flavors that have traveled across cultures and generations.</p>';
        } else if (bgImage.includes("rest.jpg")) {
            heroText.innerHTML = '<h1>The Ambiance of Spice Route</h1><p>Spice Route offers an ambiance that blends tradition with elegance. With dim lighting, earthy tones, and soft instrumental music, the atmosphere is perfect for an intimate dining experience. The aroma of freshly ground spices fills the air, enhancing every moment of your meal. Whether for a quiet dinner or a celebratory feast, the soothing environment ensures a memorable visit.</p>';
        } else {
            heroText.innerHTML = '<h1>Welcome to Spice Route</h1><p>Embark on a journey through the rich world of Indian spices fused with global flavors.</p>';
        }
        heroText.classList.add("show");
    }, 50);
}
// Ensure the welcome text is visible on page load
window.onload = function() {
document.getElementById("hero-text").classList.add("show");
};

setInterval(updateText, 8000);



