---
title: CRUD & Queries
description: Insert, find, update, and delete operations with all major query and update operators, projection, sorting, and cursor methods.
---

# CRUD & Queries

MongoDB's query language uses JSON-like filter objects rather than SQL strings. Every operation — finding, updating, deleting — takes a filter document that specifies which records to target.

---

## Insert

```javascript
// Insert one document
await db.collection('orders').insertOne({
  customerId: 'cust-123',
  status: 'pending',
  total: NumberDecimal('149.99'),
  items: [
    { productId: 'prod-1', quantity: 2, unitPrice: NumberDecimal('74.99') }
  ],
  createdAt: new Date()
});
// Returns: { acknowledged: true, insertedId: ObjectId('...') }

// Insert many
await db.collection('products').insertMany([
  { name: 'Widget A', price: NumberDecimal('9.99'), stock: 100 },
  { name: 'Widget B', price: NumberDecimal('14.99'), stock: 50 }
]);
```

---

## Find and Query Operators

```javascript
// All confirmed orders
db.collection('orders').find({ status: 'confirmed' })

// Comparison operators
db.collection('orders').find({
  total: { $gt: 100, $lte: 500 },  // 100 < total <= 500
  status: { $in: ['confirmed', 'shipped'] },
  customerId: { $ne: 'banned-customer' }
})

// Logical operators
db.collection('orders').find({
  $or: [
    { status: 'pending' },
    { total: { $gt: 1000 } }
  ]
})

// Nested document query (dot notation)
db.collection('orders').find({
  'shippingAddress.city': 'New York'
})

// Array operators
db.collection('orders').find({
  // At least one item matches ALL conditions
  items: { $elemMatch: { quantity: { $gte: 2 }, unitPrice: { $lt: 50 } } }
})

// Exists and type checks
db.collection('customers').find({
  phone: { $exists: true, $ne: null },
  email: { $type: 'string' }
})

// Regex
db.collection('products').find({
  name: { $regex: /wireless/i }
})
```

### Projection — select specific fields

```javascript
// Include only specified fields (1 = include, 0 = exclude)
db.collection('orders').find(
  { customerId: 'cust-123' },
  { projection: { id: 1, status: 1, total: 1, _id: 0 } }  // _id excluded
)
```

### Sort, limit, skip

```javascript
await db.collection('orders')
  .find({ status: 'confirmed' })
  .sort({ createdAt: -1, total: -1 })  // newest first, then by highest total
  .skip(20)                             // page 2 (0-indexed)
  .limit(20)
  .toArray();

// Cursor-based pagination (better for large offsets)
await db.collection('orders')
  .find({ createdAt: { $lt: lastSeenDate } })
  .sort({ createdAt: -1 })
  .limit(20)
  .toArray();
```

---

## Update Operations

```javascript
// Update operators
await db.collection('orders').updateOne(
  { _id: orderId },
  {
    $set:   { status: 'confirmed', confirmedAt: new Date() },
    $unset: { tempHoldExpiry: '' },          // remove field
    $inc:   { retryCount: 1 },               // increment
    $push:  { events: { type: 'confirmed', at: new Date() } }  // append to array
  }
);

// Pull from array
await db.collection('orders').updateOne(
  { _id: orderId },
  { $pull: { items: { productId: 'prod-to-remove' } } }
);

// addToSet: add to array only if not already present
await db.collection('products').updateOne(
  { _id: productId },
  { $addToSet: { tags: 'bestseller' } }
);

// Update many
await db.collection('orders').updateMany(
  { status: 'pending', createdAt: { $lt: expiredDate } },
  { $set: { status: 'expired' } }
);

// findOneAndUpdate — atomic read-modify-write, returns document
const updated = await db.collection('orders').findOneAndUpdate(
  { _id: orderId, status: 'pending' },
  { $set: { status: 'confirmed' } },
  { returnDocument: 'after' }  // return new value
);

// Upsert — insert if not found
await db.collection('carts').updateOne(
  { userId: 'user-123' },
  { $set: { updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
  { upsert: true }
);
```

---

## Delete

```javascript
// Delete one
await db.collection('orders').deleteOne({ _id: orderId });

// Delete many
await db.collection('sessions').deleteMany({
  expiresAt: { $lt: new Date() }
});

// findOneAndDelete — atomic delete + return
const deleted = await db.collection('jobs').findOneAndDelete(
  { status: 'pending' },
  { sort: { priority: -1, createdAt: 1 } }
);
```

---

## Counting and Distinct

```javascript
// Count matching documents
const count = await db.collection('orders')
  .countDocuments({ status: 'pending' });

// Estimated count (fast, uses metadata)
const approxCount = await db.collection('orders').estimatedDocumentCount();

// Distinct values
const statuses = await db.collection('orders').distinct('status');
const citiesInNY = await db.collection('customers')
  .distinct('address.city', { 'address.state': 'NY' });
```
