// Store booking data
let bookingData = {
    from: '',
    to: '',
    date: '',
    quota: '',
    selectedTrain: null,
    passengers: [],
    class: '',
    quantity: 0
};

// Sample train data
const trains = [
    {
        id: 1,
        name: 'Rajdhani Express',
        number: '12951',
        type: 'Rajdhani',
        from: 'NDLS',
        to: 'BCT',
        departure: '16:25',
        arrival: '08:15',
        duration: '15h 50m',
        price: {
            '1A': 4500,
            '2A': 2700,
            '3A': 1900,
            'SL': 800
        },
        availability: {
            '1A': 'AVAILABLE-0012',
            '2A': 'AVAILABLE-0042',
            '3A': 'AVAILABLE-0089',
            'SL': 'AVAILABLE-0156'
        }
    },
    {
        id: 2,
        name: 'Shatabdi Express',
        number: '12009',
        type: 'Shatabdi',
        from: 'BCT',
        to: 'NDLS',
        departure: '06:10',
        arrival: '14:00',
        duration: '7h 50m',
        price: {
            'CC': 1500,
            'EC': 2800
        },
        availability: {
            'CC': 'AVAILABLE-0067',
            'EC': 'AVAILABLE-0028'
        }
    }
];

// Handle search form submission
const searchForm = document.getElementById('searchForm');
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        bookingData.from = document.getElementById('from').value;
        bookingData.to = document.getElementById('to').value;
        bookingData.date = document.getElementById('date').value;
        bookingData.quota = document.getElementById('quota').value;
        localStorage.setItem('bookingData', JSON.stringify(bookingData));
        window.location.href = '/trains.html';
    });
}

// Display available trains
const trainList = document.getElementById('trainList');
if (trainList) {
    const storedData = JSON.parse(localStorage.getItem('bookingData'));
    const availableTrains = trains.filter(train => 
        train.from === storedData.from && train.to === storedData.to
    );

    if (availableTrains.length === 0) {
        trainList.innerHTML = `
            <div class="no-trains">
                <h3>No trains available for the selected route</h3>
                <p>Please try a different date or route</p>
            </div>
        `;
    } else {
        availableTrains.forEach(train => {
            const trainCard = document.createElement('div');
            trainCard.className = 'train-card';
            trainCard.innerHTML = `
                <h3>${train.name} (${train.number})</h3>
                <div class="train-info">
                    <div class="train-detail">
                        <strong>Departure:</strong> ${train.departure}
                    </div>
                    <div class="train-detail">
                        <strong>Arrival:</strong> ${train.arrival}
                    </div>
                    <div class="train-detail">
                        <strong>Duration:</strong> ${train.duration}
                    </div>
                    <div class="train-detail">
                        <strong>Type:</strong> ${train.type}
                    </div>
                </div>
                <div class="availability-info">
                    ${Object.entries(train.availability).map(([cls, avl]) => `
                        <div class="class-availability">
                            <span>${cls}</span>
                            <span>${avl}</span>
                            <span>₹${train.price[cls]}</span>
                        </div>
                    `).join('')}
                </div>
                <button onclick="selectTrain(${train.id})" class="btn-primary">Book Now</button>
            `;
            trainList.appendChild(trainCard);
        });
    }
}

// Handle train selection
function selectTrain(trainId) {
    bookingData.selectedTrain = trains.find(t => t.id === trainId);
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    window.location.href = '/booking.html';
}

// Handle booking form
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    const storedData = JSON.parse(localStorage.getItem('bookingData'));
    const selectedTrain = document.getElementById('selectedTrain');
    if (selectedTrain && storedData.selectedTrain) {
        selectedTrain.innerHTML = `
            <div class="train-header">
                <h2>${storedData.selectedTrain.name} (${storedData.selectedTrain.number})</h2>
                <div class="train-route">
                    <span>${storedData.from} → ${storedData.to}</span>
                    <span>Date: ${new Date(storedData.date).toLocaleDateString()}</span>
                </div>
            </div>
        `;
    }

    const quantity = document.getElementById('quantity');
    if (quantity) {
        quantity.addEventListener('change', (e) => {
            const count = parseInt(e.target.value);
            const container = document.getElementById('passengerDetails');
            container.innerHTML = '';
            
            for (let i = 0; i < count; i++) {
                container.innerHTML += `
                    <div class="passenger-form">
                        <h3>Passenger ${i + 1}</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Name</label>
                                <input type="text" name="name${i}" required>
                            </div>
                            <div class="form-group">
                                <label>Age</label>
                                <input type="number" name="age${i}" min="1" max="120" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Gender</label>
                                <select name="gender${i}" required>
                                    <option value="">Select gender</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                    <option value="O">Other</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Berth Preference</label>
                                <select name="berth${i}">
                                    <option value="NO">No Preference</option>
                                    <option value="LB">Lower Berth</option>
                                    <option value="MB">Middle Berth</option>
                                    <option value="UB">Upper Berth</option>
                                    <option value="SL">Side Lower</option>
                                    <option value="SU">Side Upper</option>
                                </select>
                            </div>
                        </div>
                    </div>
                `;
            }
        });
    }

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        bookingData.class = document.getElementById('class').value;
        bookingData.quantity = document.getElementById('quantity').value;
        localStorage.setItem('bookingData', JSON.stringify(bookingData));
        window.location.href = '/payment.html';
    });
}

// Handle payment form
const paymentForm = document.getElementById('paymentForm');
if (paymentForm) {
    const storedData = JSON.parse(localStorage.getItem('bookingData'));
    const summary = document.getElementById('bookingSummary');
    if (summary && storedData.selectedTrain) {
        const totalPrice = storedData.selectedTrain.price[storedData.class] * storedData.quantity;
        summary.innerHTML = `
            <h2>Booking Summary</h2>
            <div class="summary-details">
                <div class="summary-row">
                    <span>Train:</span>
                    <span>${storedData.selectedTrain.name} (${storedData.selectedTrain.number})</span>
                </div>
                <div class="summary-row">
                    <span>Route:</span>
                    <span>${storedData.from} → ${storedData.to}</span>
                </div>
                <div class="summary-row">
                    <span>Date:</span>
                    <span>${new Date(storedData.date).toLocaleDateString()}</span>
                </div>
                <div class="summary-row">
                    <span>Class:</span>
                    <span>${storedData.class}</span>
                </div>
                <div class="summary-row">
                    <span>Passengers:</span>
                    <span>${storedData.quantity}</span>
                </div>
                <div class="summary-row total">
                    <span>Total Amount:</span>
                    <span>₹${totalPrice}</span>
                </div>
            </div>
        `;
    }

    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', (e) => {
            document.getElementById('upiDetails').style.display = 
                e.target.value === 'upi' ? 'block' : 'none';
            document.getElementById('cardDetails').style.display = 
                e.target.value === 'card' ? 'block' : 'none';
        });
    });

    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Booking confirmed! Your PNR will be sent via SMS and email.');
        localStorage.removeItem('bookingData');
        window.location.href = '/';
    });
}