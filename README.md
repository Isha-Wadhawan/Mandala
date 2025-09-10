MandalaByJigyasa

A web application for Mandala art sales with UPI payments and admin panel.

Project Structure
MandalaByJigyasa-master/
├── admin/        # Admin panel 
├── backend/      # Node.js + Express backend
├── frontend/     # React frontend

Setup Instructions

1. Clone the Repository
git clone (https://github.com/Isha-Wadhawan/Mandala.git)
cd MandalaByJigyasa-master

2. Backend Setup
cd backend
npm install


Create a .env file in the backend/ folder:

MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret_key>
PORT=5000


Replace <your_mongodb_connection_string> with the MongoDB Atlas URI you provide.

Start the backend server:

node server.js


The backend will run at: http://localhost:5000

3. Frontend Setup
cd ../frontend
npm install
npm run dev


The frontend will run at: http://localhost:5173

4. Admin Panel (if applicable)
cd ../admin
npm install
npm run dev


Check admin panel instructions----------->

Usage Notes

Orders are processed via UPI. Payment verification is manual.

Admin can update order status and payment status.

Add products via the admin interface.

Make sure .env files contain correct credentials and are not shared publicly.

Folder Details

backend/ – Node.js API with MongoDB integration.

frontend/ – React client for users to browse and order products.

admin/ – Admin panel for managing orders, products, and payments.

Dependencies

Node.js >= 18

npm >= 9

MongoDB Atlas