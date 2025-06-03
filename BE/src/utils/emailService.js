const nodemailer = require('nodemailer');

const SENDER_EMAIL = "nguyentrungasdasd@gmail.com";
const EMAIL_PASSWORD = "tpfu lovn vzar ntqw";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SENDER_EMAIL,
    pass: EMAIL_PASSWORD
  }
});

/**
 * Format currency to VND
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

/**
 * Generate HTML content for the bill
 */
const generateBillHTML = (booking, customerEmail) => {
  const checkInDate = new Date(booking.rooms[0].checkIn).toLocaleDateString('vi-VN');
  const checkOutDate = new Date(booking.rooms[0].checkOut).toLocaleDateString('vi-VN');

  let roomsHtml = booking.rooms.map(room => {
    const nights = Math.ceil(
      (new Date(room.checkOut) - new Date(room.checkIn)) / (1000 * 60 * 60 * 24)
    );
    const roomPrice = room.roomId.roomTypeId.pricePerNight;
    const totalRoomPrice = roomPrice * nights;

    return `
      <tr>
        <td>${room.roomId.name}</td>
        <td>${room.roomId.roomTypeId.name}</td>
        <td>${formatCurrency(roomPrice)}</td>
        <td>${nights}</td>
        <td>${formatCurrency(totalRoomPrice)}</td>
      </tr>
    `;
  }).join('');

  let servicesHtml = '';
  if (booking.services && booking.services.length > 0) {
    servicesHtml = booking.services.map(service => {
      const totalServicePrice = service.serviceId.price * service.quantity;
      return `
        <tr>
          <td>${service.serviceId.name}</td>
          <td>${formatCurrency(service.serviceId.price)}</td>
          <td>${service.quantity}</td>
          <td>${formatCurrency(totalServicePrice)}</td>
        </tr>
      `;
    }).join('');
  }

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .bill-info { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .total { font-weight: bold; text-align: right; }
          .hotel-info { text-align: center; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Hotel Bill</h1>
          </div>

          <div class="hotel-info">
            <h2>Luxury Hotel</h2>
            <p>123 Hotel Street, City</p>
            <p>Phone: (123) 456-7890</p>
          </div>
          
          <div class="bill-info">
            <p><strong>Booking ID:</strong> ${booking._id}</p>
            <p><strong>Customer Name:</strong> ${booking.customerId.name}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Check-in Date:</strong> ${checkInDate}</p>
            <p><strong>Check-out Date:</strong> ${checkOutDate}</p>
          </div>

          <h3>Room Charges</h3>
          <table>
            <thead>
              <tr>
                <th>Room</th>
                <th>Type</th>
                <th>Price per Night</th>
                <th>Nights</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${roomsHtml}
            </tbody>
          </table>

          ${booking.services && booking.services.length > 0 ? `
            <h3>Services</h3>
            <table>
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${servicesHtml}
              </tbody>
            </table>
          ` : ''}

          <div class="total">
            <p>Total Amount: ${formatCurrency(booking.totalAmount)}</p>
          </div>

          <div style="margin-top: 40px; text-align: center;">
            <p>Thank you for choosing our hotel!</p>
            <p>We hope to see you again soon.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

/**
 * Send bill via email
 */
exports.sendBillEmail = async (booking, customerEmail) => {
  if (!customerEmail) {
    throw new Error('Customer email is required');
  }

  const mailOptions = {
    from: SENDER_EMAIL,
    to: customerEmail,
    subject: `Hotel Bill - Booking #${booking._id}`,
    html: generateBillHTML(booking, customerEmail)
  };

  return await transporter.sendMail(mailOptions);
}; 