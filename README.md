# Restaurant Ordering System Backend

Node.js backend for a restaurant ordering system. It supports user authentication, menu and product management, real-time order tracking with WebSocket, and a restaurant table map feature.

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- Socket.IO
- JWT for authentication
- CORS and Body-Parser middleware

## Features

### Authentication
- `POST /auth/signup` – register a restaurant
- `POST /auth/login` – log in and receive a JWT token

### Menu Management
- Create, update, and delete menus
- Add categories and products
- Fetch full menu with nested categories and products

### Product Management
- Add, update, and delete products within categories
- Products are linked to menu categories

### Map and Table Management
- Create a map with tables for a restaurant
- Fetch and edit maps with tables
- Tables can be assigned to orders

### Ordering System
- `POST /order/:tableId` – place or update an order for a table
- `POST /order/accept` – accept items from the order
- Orders are tied to tables and update their status color

### Real-Time Updates
- WebSocket support via Socket.IO
- Table status and order updates are broadcasted to all connected clients
