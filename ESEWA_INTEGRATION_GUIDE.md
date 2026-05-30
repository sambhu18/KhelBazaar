# eSewa Payment Gateway - Complete Integration Guide

## 📋 Overview
This guide provides step-by-step instructions to test the complete eSewa payment integration for Khel Bazaar.

---

## 🔐 eSewa Test Credentials

### Test Account Details
```
eSewa IDs:       9806800002, 9806800003, 9806800004, 9806800005
Password:        Nepal@123
MPIN:            1122
Token:           123456
```

### Merchant/Service Credentials
```
Merchant ID:     EPAYTEST
Secret Key:      8gBm/:&EnhH.1/q
Client ID:       JB0BBQ4aD0UqIThFJwAKBgAXEUkEGQUBBAwdOgABHD4DChwUAB0R
Client Secret:   BhwIWQQADhIYSxILExMcAgFXFhcOBwAKBgAXEQ==
Test Base URL:   https://rc-epay.esewa.com.np
```

---

## 🚀 Quick Start - 5 Minutes to Payment Testing

### Step 1: Verify Backend Configuration
```bash
# Test if eSewa integration is ready
curl https://khelbazaar-backend-1.onrender.com/api/esewa/test
```

Expected Response:
```json
{
  "status": "✅ eSewa Integration Ready",
  "testPayment": { ... },
  "credentials": { ... },
  "testCredentials": { ... }
}
```

### Step 2: Start Both Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 3: Test Payment Flow

#### **Flow 1: Add Product to Cart**
1. Visit `http://localhost:3000`
2. Click on any product
3. Select size/color
4. Click "ADD TO CART"
5. See confirmation message

#### **Flow 2: Proceed to Checkout**
1. Click shopping cart icon
2. Review items
3. Click "PROCEED TO CHECKOUT"
4. Fill shipping details:
   - Full Name: Test User
   - Email: test@example.com
   - Phone: 9806800002
   - Address: Kathmandu
   - City: Kathmandu
   - Postal Code: 44600

#### **Flow 3: Select Payment Method**
1. Choose **eSewa** radio button
2. Check green highlight appears
3. Click **PLACE ORDER** button

---

## 💳 eSewa Payment Simulation

### Step 1: eSewa Payment Form Loads
After clicking "PLACE ORDER":
- Form auto-submits to: `https://rc-epay.esewa.com.np/api/epay/main/v2/form`
- eSewa payment page loads
- You see eSewa test payment interface

### Step 2: Enter eSewa Credentials
When prompted by eSewa:
```
eSewa ID:    9806800002 (or use 9806800003/4/5)
Password:    Nepal@123
MPIN:        1122
Token:       123456
```

### Step 3: Confirm Payment
- Click "Pay Now" or equivalent button
- eSewa processes the payment
- You are redirected to one of these:
  - **Success:** `http://localhost:3000/payment-success?data=<encoded>`
  - **Failure:** `http://localhost:3000/payment-failure`

---

## ✅ Payment Success Flow

### What Happens on Success Page:
1. **Verifying Payment** spinner appears
2. Backend calls `/api/esewa/verify`
3. Backend verifies HMAC-SHA256 signature
4. Backend queries eSewa status API
5. Order status changes to "confirmed"
6. Loyalty points awarded (1 point per 10 NPR)
7. **Success message** displays with order details:
   - Order Number
   - Amount Paid
   - Transaction ID
   - Payment Method (eSewa)

### View Confirmed Order
1. Click "View Orders" button
2. Go to "My Orders" page
3. See order with status "confirmed"
4. Check loyalty points in profile

---

## ❌ Payment Failure Flow

### What Happens on Failure Page:
1. **Cancellation message** displays
2. Cart items are **preserved**
3. **Troubleshooting tips** shown:
   - No money was deducted
   - Your cart is still saved
   - You can retry safely
   - Or use Cash On Delivery instead

### Retry Options:
1. Click "Back to Cart" → Returns to checkout with items intact
2. Click "Try Again" → Restart payment process
3. Select "Cash On Delivery" → No eSewa needed

---

## 🧪 Test Scenarios

### Scenario 1: Successful eSewa Payment
**Expected Outcome:** Order confirmed, payment verified, loyalty points awarded

Steps:
1. Add items to cart
2. Select eSewa payment
3. Complete eSewa payment
4. See success page with order confirmation

**Verification:**
```bash
# Check order in database
curl -H "Authorization: Bearer <token>" \
 https://khelbazaar-backend-1.onrender.com/api/orders
```

---

### Scenario 2: Payment Cancellation
**Expected Outcome:** Cart preserved, no payment processed, can retry

Steps:
1. Add items to cart
2. Select eSewa payment
3. Cancel on eSewa page (don't complete payment)
4. Redirected to failure page
5. Cart items still there
6. Click "Back to Cart"
7. Verify items intact

---

### Scenario 3: Cash On Delivery Alternative
**Expected Outcome:** Order confirmed without payment, delivery on receipt

Steps:
1. Add items to cart
2. Select "Cash On Delivery" payment
3. Click "PLACE ORDER"
4. See success page
5. Order status: "confirmed"
6. Payment status: "pending"
7. Payment note: "To be collected at delivery"

---

### Scenario 4: Email Verification Before Payment
**Expected Outcome:** Unverified users can't access checkout

Steps:
1. Register new account
2. Don't verify email yet
3. Try to access checkout
4. Should be redirected or see message
5. Verify email first
6. Then proceed to checkout

---

## 🔍 Debugging & Troubleshooting

### Check Backend Logs
Watch terminal where backend is running:
```
✅ Payment Initiated for Order: ...
💾 Updating order status...
🎁 Awarding loyalty points...
✅ Signature verified successfully
```

### If Payment Form Doesn't Load (404 Error)

**Cause:** eSewa endpoint might be temporarily down

**Solution:**
```bash
# Check if eSewa server is responding
curl -I https://rc-epay.esewa.com.np/

# If 404: Try Cash On Delivery for now
# If 200: Check your backend logs for errors
```

### If Signature Verification Fails
```bash
# Check backend logs for:
# "Expected:" vs "Received:" signatures
# If they don't match:
# 1. Verify ESEWA_SECRET_KEY in .env is correct
# 2. Verify transaction_uuid format
# 3. Check total_amount is integer (no decimals)
```

### If "Order Not Found"
```bash
# Check order was created:
curl -H "Authorization: Bearer <token>" \
  https://khelbazaar-backend-1.onrender.com/api/orders

# If order exists:
# 1. Verify orderNumber matches transaction_uuid
# 2. Check MongoDB connection
# 3. Check Order model has correct fields
```

---

## 📊 Expected Database Changes

### After Successful Payment:

**Order Collection:**
```javascript
{
  _id: ObjectId("..."),
  orderNumber: "ORD-2024-001",
  paymentStatus: "completed",        // ← Changed from "pending"
  status: "confirmed",               // ← Changed from "pending"
  transactionId: "unique-code",
  esewaTransactionCode: "CODE123",
  esewaSignature: "base64...",
  updatedAt: ISODate("2024-05-26T...")
}
```

**Loyalty Collection:**
```javascript
{
  userId: ObjectId("..."),
  totalPoints: 450,                  // ← Added/updated
  transactions: [
    {
      type: "earned",
      points: 450,
      orderId: ObjectId("..."),
      description: "Earned from eSewa payment for order ORD-2024-001"
    }
  ]
}
```

---

## 🎯 Complete Test Checklist

- [ ] Backend server running on localhost:5001
- [ ] Frontend server running on localhost:3000
- [ ] Can access `/api/esewa/test` endpoint
- [ ] Email verification working (test email sent)
- [ ] User registration and login working
- [ ] Add to cart functionality working
- [ ] Checkout form validates properly
- [ ] eSewa payment form loads (no 404)
- [ ] Can enter eSewa test credentials
- [ ] Payment success page loads with order confirmation
- [ ] Order marked as "confirmed" in database
- [ ] Loyalty points awarded correctly
- [ ] Payment failure handled gracefully
- [ ] Cart preserved after failed payment
- [ ] Cash On Delivery alternative works
- [ ] Can view confirmed orders in "My Orders"

---

## 📞 API Endpoints Reference

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/esewa/initiate` | POST | Generate payment form data | ✅ Required |
| `/api/esewa/verify` | POST | Verify payment after eSewa redirect | ❌ Not required |
| `/api/esewa/status` | POST | Check payment status | ✅ Required |
| `/api/esewa/test` | GET | Test integration | ❌ Not required |

---

## 🚀 Production Migration Checklist

When moving to production:

1. **Update Base URL:**
   ```env
   ESEWA_BASE_URL=https://epay.esewa.com.np
   ```

2. **Get Production Credentials:**
   - Contact eSewa for live credentials
   - Update ESEWA_MERCHANT_CODE
   - Update ESEWA_SECRET_KEY
   - Update ESEWA_CLIENT_ID and ESEWA_CLIENT_SECRET

3. **Update Frontend URLs:**
   ```env
   NEXT_PUBLIC_BASEURL=https://your-production-api.com
   ```

4. **SSL Certificate:**
   - Ensure HTTPS is enabled
   - Update redirect URLs

5. **Email Configuration:**
   - Update to production email account
   - Test email sending

6. **Testing:**
   - Perform test transactions
   - Verify all payment flows
   - Check payment notifications

---

## 📝 Notes

- eSewa test accounts (9806800002-5) are shared for development
- All test payments are simulated; no real money changes hands
- Test server might be down during maintenance (contact eSewa support)
- HMAC-SHA256 signature must match exactly for verification
- Transaction UUID must be unique for each order
- Keep SECRET_KEY secure; never commit to public repos

---

## ✅ Integration Status

✅ **Payment Form Submission** - COMPLETE
✅ **HMAC-SHA256 Signature Generation** - COMPLETE
✅ **Payment Verification** - COMPLETE
✅ **Loyalty Points Award** - COMPLETE
✅ **Error Handling** - COMPLETE
✅ **Status Check** - COMPLETE
✅ **Email Notifications** - COMPLETE
✅ **Order Management** - COMPLETE

---

## 🎉 Success!

Your eSewa integration is complete and ready for testing. Follow the "Quick Start" section above to begin testing payments immediately.

For support or issues, check the troubleshooting section or contact eSewa support at: https://esewa.com.np
