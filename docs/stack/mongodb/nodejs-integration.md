---
title: Node.js + MongoDB
description: Mongoose schema definition, validators, virtuals, middleware hooks, populate, complex aggregation, transactions, change streams, and connection management.
---

# Node.js + MongoDB

Mongoose is the dominant MongoDB ODM for Node.js. It adds schema validation, TypeScript types, middleware hooks, virtuals, and relationship population on top of the MongoDB driver. For teams that want raw driver access without Mongoose's abstraction, the official `mongodb` package works equally well.

---

## Setup

```bash
npm install mongoose
npm install --save-dev @types/mongoose  # if not using Mongoose's built-in types
```

```typescript
import mongoose from 'mongoose';

export async function connectDatabase() {
  mongoose.set('strictQuery', true);

  await mongoose.connect(process.env.MONGODB_URI!, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
  });

  mongoose.connection.on('error', err =>
    console.error('MongoDB connection error:', err));

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected, attempting reconnect...');
  });
}
```

---

## Schema Definition

```typescript
import { Schema, model, Document, Types } from 'mongoose';

// Sub-document schema (no model, embedded)
const orderItemSchema = new Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  quantity:  { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 }
}, { _id: false });  // no auto _id for embedded docs

const addressSchema = new Schema({
  street: { type: String, required: true },
  city:   { type: String, required: true },
  zip:    { type: String, required: true, match: /^\d{5}$/ }
}, { _id: false });

// Main document schema
const orderSchema = new Schema({
  customerId: { type: String, required: true, index: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
    index: true
  },
  items:           { type: [orderItemSchema], required: true, validate: {
    validator: (items: any[]) => items.length > 0,
    message: 'Order must have at least one item'
  }},
  shippingAddress: { type: addressSchema },
  total:           { type: Number, required: true, min: 0 }
}, {
  timestamps: true,  // adds createdAt and updatedAt
  toJSON: { virtuals: true }
});

// Virtual field — computed, not stored in DB
orderSchema.virtual('itemCount').get(function() {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Compound index
orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 },
                  { partialFilterExpression: { status: 'pending' } });

export interface IOrder extends Document {
  customerId: string;
  status: string;
  items: IOrderItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
  itemCount: number; // virtual
}

export const Order = model<IOrder>('Order', orderSchema);
```

---

## Middleware Hooks

```typescript
// Pre-save: compute total from items
orderSchema.pre('save', function(next) {
  if (this.isModified('items')) {
    this.total = this.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice, 0
    );
  }
  next();
});

// Post-save: publish event
orderSchema.post('save', async function(doc) {
  await eventBus.publish('order.saved', {
    orderId: doc.id,
    status: doc.status
  });
});

// Pre-find: always exclude cancelled orders
orderSchema.pre(/^find/, function(this: mongoose.Query<any, any>, next) {
  if (!this.getFilter().includeCancelled) {
    this.where({ status: { $ne: 'cancelled' } });
  }
  next();
});
```

---

## Queries

```typescript
// Basic find
const orders = await Order.find({ customerId: 'cust-123' })
  .sort({ createdAt: -1 })
  .limit(20)
  .lean();  // lean(): returns plain JS objects, ~2x faster (no Mongoose methods)

// Find with specific fields
const summaries = await Order.find({ status: 'confirmed' })
  .select('customerId status total createdAt -_id')
  .lean();

// Atomic update
const confirmed = await Order.findOneAndUpdate(
  { _id: orderId, status: 'pending' },
  { $set: { status: 'confirmed', confirmedAt: new Date() } },
  { new: true, runValidators: true }  // return updated doc, run schema validators
);

// Pagination cursor-based
const getPage = async (lastSeenDate?: Date) => {
  const filter = lastSeenDate
    ? { createdAt: { $lt: lastSeenDate } }
    : {};
  return Order.find(filter)
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();
};
```

---

## Populate — Resolve References

```typescript
const customerSchema = new Schema({
  email: String,
  name: String
});
export const Customer = model('Customer', customerSchema);

// Order with customer reference
const orderSchemaWithRef = new Schema({
  customer: { type: Types.ObjectId, ref: 'Customer' },
  // ...
});

// Populate resolves the reference with a second query
const order = await Order.findById(orderId)
  .populate('customer', 'email name')  // select only email and name
  .lean();
// order.customer is now { email: '...', name: '...' }
```

---

## Aggregation

```typescript
const stats = await Order.aggregate([
  { $match: { status: 'confirmed' } },
  { $group: {
    _id: '$customerId',
    orderCount:   { $sum: 1 },
    totalRevenue: { $sum: '$total' },
    avgOrder:     { $avg: '$total' }
  }},
  { $sort: { totalRevenue: -1 } },
  { $limit: 10 }
]);

// Type-safe with TypeScript
interface CustomerStats {
  _id: string;
  orderCount: number;
  totalRevenue: number;
  avgOrder: number;
}
const typedStats = await Order.aggregate<CustomerStats>([...]);
```

---

## Transactions

```typescript
const session = await mongoose.startSession();

try {
  await session.withTransaction(async () => {
    const product = await Product.findOneAndUpdate(
      { _id: productId, stock: { $gte: quantity } },
      { $inc: { stock: -quantity } },
      { session, new: true }
    );

    if (!product) throw new Error('Out of stock');

    await Order.create([{
      customerId,
      productId,
      quantity,
      status: 'confirmed'
    }], { session });
  });
} finally {
  session.endSession();
}
```

---

## Change Streams

```typescript
// Watch for changes on the orders collection
const changeStream = Order.watch(
  [{ $match: { 'fullDocument.status': { $in: ['confirmed', 'shipped'] } } }],
  { fullDocument: 'updateLookup' }
);

changeStream.on('change', async (event) => {
  if (event.operationType === 'update' && event.fullDocument) {
    await notificationService.notify(
      event.fullDocument.customerId,
      `Order status: ${event.fullDocument.status}`
    );
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await changeStream.close();
  await mongoose.disconnect();
});
```
