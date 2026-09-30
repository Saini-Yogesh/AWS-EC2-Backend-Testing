// ============================================================
// Dummy In-Memory Data Store (No Database Needed)
// ============================================================

let users = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "admin", age: 28, active: true, createdAt: "2024-01-15T10:00:00Z" },
  { id: 2, name: "Bob Smith",     email: "bob@example.com",   role: "user",  age: 35, active: true, createdAt: "2024-02-20T08:30:00Z" },
  { id: 3, name: "Carol White",   email: "carol@example.com", role: "user",  age: 22, active: false, createdAt: "2024-03-10T14:15:00Z" },
  { id: 4, name: "David Brown",   email: "david@example.com", role: "mod",   age: 31, active: true, createdAt: "2024-04-05T09:45:00Z" },
  { id: 5, name: "Eva Green",     email: "eva@example.com",   role: "user",  age: 26, active: true, createdAt: "2024-05-18T11:00:00Z" },
];

let products = [
  { id: 1, name: "Laptop Pro X",       price: 1299.99, category: "Electronics", stock: 50,  rating: 4.8, inStock: true },
  { id: 2, name: "Wireless Headphones",price: 199.99,  category: "Electronics", stock: 120, rating: 4.5, inStock: true },
  { id: 3, name: "Mechanical Keyboard",price: 89.99,   category: "Accessories", stock: 0,   rating: 4.7, inStock: false },
  { id: 4, name: "USB-C Hub 7-Port",   price: 49.99,   category: "Accessories", stock: 200, rating: 4.3, inStock: true },
  { id: 5, name: "4K Monitor 27\"",    price: 599.99,  category: "Electronics", stock: 30,  rating: 4.6, inStock: true },
  { id: 6, name: "Ergonomic Mouse",    price: 59.99,   category: "Accessories", stock: 85,  rating: 4.4, inStock: true },
];

let orders = [
  { id: 1, userId: 1, productId: 2, quantity: 2, status: "delivered", totalPrice: 399.98, orderedAt: "2024-06-01T10:00:00Z" },
  { id: 2, userId: 2, productId: 1, quantity: 1, status: "shipped",   totalPrice: 1299.99, orderedAt: "2024-06-10T14:30:00Z" },
  { id: 3, userId: 3, productId: 4, quantity: 3, status: "pending",   totalPrice: 149.97, orderedAt: "2024-06-15T09:00:00Z" },
  { id: 4, userId: 1, productId: 5, quantity: 1, status: "processing",totalPrice: 599.99, orderedAt: "2024-06-20T16:00:00Z" },
  { id: 5, userId: 4, productId: 6, quantity: 2, status: "cancelled", totalPrice: 119.98, orderedAt: "2024-06-22T11:45:00Z" },
];

let posts = [
  { id: 1, userId: 1, title: "Getting Started with AWS EC2", body: "AWS EC2 is a web service that provides resizable compute capacity in the cloud.", tags: ["aws", "cloud", "ec2"], likes: 42, createdAt: "2024-05-01T08:00:00Z" },
  { id: 2, userId: 2, title: "Node.js Best Practices",       body: "In this post, we explore the best practices for building scalable Node.js apps.", tags: ["nodejs", "javascript", "backend"], likes: 87, createdAt: "2024-05-10T10:30:00Z" },
  { id: 3, userId: 1, title: "Docker for Beginners",         body: "Docker simplifies deployment by containerizing applications and their dependencies.", tags: ["docker", "devops"], likes: 63, createdAt: "2024-05-20T14:00:00Z" },
  { id: 4, userId: 3, title: "REST API Design Guide",        body: "A well-designed REST API is the backbone of modern web applications.", tags: ["api", "rest", "design"], likes: 115, createdAt: "2024-06-01T09:15:00Z" },
];

let nextId = { users: 6, products: 7, orders: 6, posts: 5 };

module.exports = { users, products, orders, posts, nextId };
