# 🎨 FRONTEND TESTING GUIDE

Complete manual testing guide for the Next.js frontend application.

---

## 🚀 Quick Start

### Prerequisites
- Backend running on `http://localhost:5001`
- Frontend running on `http://localhost:3001`
- MongoDB Atlas/Local instance active
- Environment variables configured

### Launch Frontend
```bash
cd frontend
npm run dev
```

Access at: `http://localhost:3001`

---

## 📋 HOMEPAGE TESTS

### Layout & Navigation
- [ ] Navbar displays correctly
- [ ] Logo is clickable and returns to homepage
- [ ] Search bar is visible and functional
- [ ] Navigation menu shows all links
- [ ] Mobile menu (hamburger) works on small screens
- [ ] Footer displays with all sections

### Featured Products Section
- [ ] Featured products load within 3 seconds
- [ ] Product cards display image, name, price
- [ ] Hover effect works on product cards
- [ ] Quick view button works
- [ ] Add to cart button works
- [ ] Wishlist heart icon works

### Rental Section
- [ ] Rental products section visible
- [ ] At least 3 rentable products display
- [ ] Rental price per day shows
- [ ] Click product opens rental details

### Search Functionality
- [ ] Search input accepts text
- [ ] Search returns results
- [ ] No results message displays when empty
- [ ] Search highlights matching terms
- [ ] Recent searches appear (if implemented)

### Categories
- [ ] All categories display
- [ ] Click category filters products
- [ ] Category count shows correctly
- [ ] Active category is highlighted

### Performance
- [ ] Page loads in under 3 seconds
- [ ] Images are optimized
- [ ] No console errors displayed
- [ ] Network requests are efficient

---

## 🛍️ PRODUCT PAGE TESTS

### Product Details Display
- [ ] Product title displays
- [ ] Full product description shows
- [ ] Price displays clearly
- [ ] Stock status shows (In Stock/Out of Stock)
- [ ] Product rating displays with review count
- [ ] Product SKU/ID visible

### Image Gallery
- [ ] Main image displays
- [ ] Thumbnail images show below
- [ ] Click thumbnail changes main image
- [ ] Zoom functionality works (if implemented)
- [ ] All product images load
- [ ] Images are high quality

### Size & Color Selection
- [ ] Size selector displays all available sizes
- [ ] Color selector displays all colors
- [ ] Selected size is highlighted
- [ ] Selected color is highlighted
- [ ] Size/color can be changed
- [ ] Size chart link works

### Add to Cart
- [ ] Add to Cart button is visible
- [ ] Quantity selector works (increase/decrease)
- [ ] Selected size is added to cart
- [ ] Selected color is added to cart
- [ ] Toast notification shows confirmation
- [ ] Cart icon updates with count

### Add to Wishlist
- [ ] Heart icon is visible
- [ ] Click adds/removes from wishlist
- [ ] Heart color changes when added
- [ ] No errors on wishlist action
- [ ] Can access wishlist from anywhere

### Reviews Section
- [ ] Reviews section loads
- [ ] Review count displays
- [ ] Average rating shows
- [ ] Review cards display reviewer name, rating, text
- [ ] Star ratings visible
- [ ] Pros/cons lists display
- [ ] Sort options work (newest, helpful, rating)
- [ ] Filter by rating works

### Write Review Section
- [ ] Logged in users see "Write Review" button
- [ ] Review form shows when opened
- [ ] Star rating selector works
- [ ] Text input for review title accepts input
- [ ] Pros input allows multiple entries
- [ ] Cons input allows multiple entries
- [ ] Submit review works
- [ ] Non-logged-in users see login prompt

### Related Products
- [ ] Related products section displays
- [ ] Shows 4-6 related products
- [ ] Products are relevant to current product
- [ ] Click related product navigates correctly

---

## 🏠 RENTAL SYSTEM TESTS

### Rental Product Listing
- [ ] Rental filter/tab works
- [ ] Only rentable products display
- [ ] Rental price per day shows
- [ ] Deposit amount visible
- [ ] Product images display

### Rental Booking Page
- [ ] Product details display
- [ ] Start date picker works
- [ ] End date picker works
- [ ] Can't select past dates
- [ ] Date range validation works
- [ ] Duration calculates correctly
- [ ] Price updates based on dates

### Price Calculation
- [ ] Daily rate shows
- [ ] Total days calculates
- [ ] Rental cost calculates (days × rate)
- [ ] Deposit shows separately
- [ ] Total with deposit shows
- [ ] Any additional fees show
- [ ] All calculations are accurate

### Booking Process
- [ ] Book button available when dates selected
- [ ] Booking form shows
- [ ] Delivery method options display
- [ ] Contact info fields populate
- [ ] Address fields populate
- [ ] Submit booking works
- [ ] Confirmation message shows

### Rental Dashboard
- [ ] Active rentals section displays
- [ ] Rental status shows (Active, Pending, Completed)
- [ ] Rental period shows
- [ ] Rental details accessible
- [ ] Cancel rental button available for pending
- [ ] Return rental button available for active
- [ ] Return form works
- [ ] Return condition options show
- [ ] Return photos can be uploaded

---

## 👕 JERSEY CUSTOMIZATION TESTS

### Customization Interface
- [ ] Customization page loads
- [ ] Product image displays
- [ ] Name input field present
- [ ] Number input field present
- [ ] Live preview area shows

### Name Input
- [ ] Accepts alphabetic characters
- [ ] Limits to reasonable length
- [ ] Updates preview in real-time
- [ ] Shows on jersey preview

### Number Input
- [ ] Accepts only digits (0-99)
- [ ] Limits to 2 digits maximum
- [ ] Updates preview in real-time
- [ ] Shows on jersey preview

### Live Preview
- [ ] Jersey preview updates as you type
- [ ] Name displays on jersey
- [ ] Number displays on jersey
- [ ] Style matches actual product
- [ ] Colors update correctly

### Pricing
- [ ] Base price shows
- [ ] Customization fee shows
- [ ] Total price calculates
- [ ] Price updates when name/number changes
- [ ] Price is accurate

### Add to Cart
- [ ] Customized order adds to cart
- [ ] Cart shows customization details
- [ ] Quantity selector works
- [ ] Can add multiple customized items

---

## 🛒 CART & CHECKOUT TESTS

### Shopping Cart Page
- [ ] Cart items display
- [ ] Product image displays
- [ ] Product name displays
- [ ] Selected size shows
- [ ] Selected color shows
- [ ] Unit price shows
- [ ] Quantity shows
- [ ] Total price for item shows (qty × price)

### Cart Operations
- [ ] Increase quantity works
- [ ] Decrease quantity works (down to 1)
- [ ] Remove item button works
- [ ] Cart updates after removal
- [ ] Can apply coupon (if available)
- [ ] Discount applies correctly

### Cart Summary
- [ ] Subtotal calculates correctly
- [ ] Tax calculates correctly
- [ ] Shipping cost shows
- [ ] All discounts deducted
- [ ] Grand total calculates correctly
- [ ] Numbers are accurate

### Checkout Flow
- [ ] Proceed to checkout button works
- [ ] Checkout form displays
- [ ] Address fields pre-populate (if logged in)
- [ ] Can select saved address
- [ ] Can add new address
- [ ] Payment method options show
- [ ] Can select eSewa payment
- [ ] Terms & conditions checkbox present
- [ ] Must accept T&C to proceed

### Address Selection
- [ ] Saved addresses display
- [ ] Can select address
- [ ] Can add new address form
- [ ] Address validation works
- [ ] Default address highlighted

### Payment Page
- [ ] Payment info displays
- [ ] eSewa logo/info shows
- [ ] Payment amount correct
- [ ] Pay Now button visible
- [ ] Redirects to eSewa when clicked

---

## 👤 USER ACCOUNT TESTS

### Login Page
- [ ] Email/username input accepts text
- [ ] Password input masks text
- [ ] "Remember me" checkbox works
- [ ] Forgot password link works
- [ ] Sign up link works
- [ ] Login button works
- [ ] Error message shows for invalid credentials
- [ ] Redirects to dashboard on success

### Registration Page
- [ ] Name input accepts text
- [ ] Email input validates
- [ ] Password requirements show
- [ ] Password input masks text
- [ ] Confirm password matches validation
- [ ] Phone number input(optional)
- [ ] Address input (optional)
- [ ] Submit button works
- [ ] Success message/redirect works
- [ ] Verification email sent

### User Dashboard
- [ ] Dashboard loads after login
- [ ] User name displays
- [ ] Navigation shows all sections
- [ ] Tabs: Orders, Rentals, Reviews, Wishlist, Addresses

### Profile Page
- [ ] Profile info displays
- [ ] Can edit name
- [ ] Can edit phone
- [ ] Can edit address
- [ ] Changes save successfully
- [ ] Success message shows
- [ ] Image upload works (if available)

### Order History
- [ ] Orders list displays
- [ ] Order ID visible
- [ ] Order date shown
- [ ] Order total shows
- [ ] Order status shows
- [ ] Can view order details
- [ ] Can track order (if status available)
- [ ] Can print invoice (if available)

### Rental History
- [ ] Active rentals display
- [ ] Rental details visible
- [ ] Can return rental
- [ ] Return form works
- [ ] Past rentals show separately
- [ ] Rental history is complete

### Reviews
- [ ] Reviews written display
- [ ] Can edit review
- [ ] Can delete review
- [ ] Average rating shows
- [ ] Edit form pre-fills data
- [ ] Delete confirmation shows

### Wishlist
- [ ] Wishlist items display
- [ ] Product image shows
- [ ] Product name shows
- [ ] Price shows
- [ ] Can move to cart
- [ ] Can remove from wishlist
- [ ] Empty wishlist message appears

### Addresses
- [ ] Saved addresses list displays
- [ ] Default address marked
- [ ] Can add new address
- [ ] Can edit address
- [ ] Can delete address
- [ ] Can set as default
- [ ] Validation works

### Loyalty Program
- [ ] Points balance displays
- [ ] Points history shows (if available)
- [ ] Can see how points are earned
- [ ] Can see redemption options
- [ ] Points update after purchases

### Logout
- [ ] Logout button visible
- [ ] Clicking logout clears session
- [ ] Redirects to login page
- [ ] Cart clears (if using session storage)
- [ ] Can't access dashboard after logout

---

## 👥 COMMUNITY TESTS

### Clubs Page
- [ ] All clubs display
- [ ] Club cards show image, name, description
- [ ] Member count shows
- [ ] Join button visible
- [ ] Search clubs works
- [ ] Click club opens detail page

### Club Details
- [ ] Club name displays
- [ ] Club description shows
- [ ] Club members count shows
- [ ] Member list displays (limited)
- [ ] Join/Leave button works
- [ ] Club posts display
- [ ] Create post button visible (if member)

### Creating Posts
- [ ] Post form displays
- [ ] Text input accepts content
- [ ] Image upload works
- [ ] Submit post works
- [ ] Post appears immediately
- [ ] Success message shows

### Viewing Posts
- [ ] Posts display in feed
- [ ] Post author shows
- [ ] Post timestamp shows
- [ ] Post images display
- [ ] Post content visible
- [ ] Like count shows
- [ ] Comment count shows

### Engaging with Posts
- [ ] Like button works
- [ ] Like count updates
- [ ] Like icon changes color
- [ ] Can unlike post
- [ ] Comment button works
- [ ] Comment form appears
- [ ] Can submit comment
- [ ] Comments display below post
- [ ] Can delete own comment

---

## 💝 DONATIONS TESTS

### Donation Page
- [ ] Donation cause displays
- [ ] Donation goal shows
- [ ] Progress bar shows correct percentage
- [ ] Donation options display (preset amounts)
- [ ] Custom amount field present

### Making Donation
- [ ] Select donation amount
- [ ] Custom amount input works
- [ ] Donor name field (optional)
- [ ] Email field (optional)
- [ ] Message field (optional)
- [ ] Anonymous checkbox works
- [ ] Donate button works
- [ ] Redirects to payment

### Donation Confirmation
- [ ] Success message shows
- [ ] Order number displays
- [ ] Thank you message shows
- [ ] Can view donation receipt

---

## 🔔 NOTIFICATIONS & MODALS

### Toast Notifications
- [ ] Toast appears on add to cart
- [ ] Toast disappears after 3 seconds
- [ ] Multiple toasts stack
- [ ] Toast has close button
- [ ] Different toast types (success, error, info)

### Modal Dialogs
- [ ] Modal displays correctly
- [ ] Modal content is readable
- [ ] Close button works
- [ ] Can click outside to close (if applicable)
- [ ] Overlay clicks don't affect content

### Error Messages
- [ ] Error messages display clearly
- [ ] Error text is readable
- [ ] Can dismiss error
- [ ] Errors are specific and helpful

### Loading States
- [ ] Loading spinners appear during requests
- [ ] Buttons disable during submission
- [ ] "Loading..." text shows (if applicable)
- [ ] Loading states complete properly

---

## 🔒 SECURITY & VALIDATION

### Form Validation
- [ ] Email input validates format
- [ ] Password requires strength
- [ ] Required fields enforced
- [ ] Special characters handled
- [ ] Error messages guide user

### Authentication
- [ ] Redirects to login if not auth (for protected pages)
- [ ] Token stored securely
- [ ] Token doesn't appear in URLs
- [ ] Can't access other users' data
- [ ] Session expires properly

### Input Sanitization
- [ ] No XSS attacks possible
- [ ] HTML tags don't render in inputs
- [ ] Special characters handled safely
- [ ] Files are validated

---

## ⚡ PERFORMANCE

### Load Times
- [ ] Homepage loads in < 3 seconds
- [ ] Product page loads in < 2 seconds
- [ ] Checkout loads in < 3 seconds
- [ ] Search results in < 1 second

### Images
- [ ] Images load smoothly
- [ ] Lazy loading works
- [ ] Images resize responsively
- [ ] No stretched/distorted images

### Responsiveness
- [ ] Mobile layout works (< 768px)
- [ ] Tablet layout works (768px - 1024px)
- [ ] Desktop layout works (> 1024px)
- [ ] Touch interactions work on mobile
- [ ] No horizontal scroll on mobile

---

## 🚨 ERROR SCENARIOS

### Network Errors
- [ ] Shows "Connection Error" when offline
- [ ] Retry button appears
- [ ] App recovers when connection restored

### Server Errors
- [ ] 404 page appears for missing pages
- [ ] 500 error handled gracefully
- [ ] Error message guides user
- [ ] Retry option available

### Empty States
- [ ] Empty cart shows message and links
- [ ] Empty wishlist shows message
- [ ] Empty order history shows message
- [ ] Empty search results shows message

---

## 📱 MOBILE TESTS (if accessible on mobile)

### Touch Interactions
- [ ] Buttons have adequate touch targets
- [ ] Swipe gestures work (if implemented)
- [ ] Pinch to zoom works for images
- [ ] Long press shows options (if implemented)

### Orientation
- [ ] App works in portrait mode
- [ ] App works in landscape mode
- [ ] Layout adjusts on rotation
- [ ] Inputs don't break on rotation

---

## ✅ FINAL CHECKLIST

After completing all tests, verify:

- [ ] All critical features work
- [ ] No console errors logged
- [ ] No broken images
- [ ] No layout issues
- [ ] Performance is acceptable
- [ ] Mobile responsive
- [ ] Accessibility (if tested)
- [ ] Data persists across sessions
- [ ] Security measures in place
- [ ] All links work correctly

---

**Testing Date:** _______________
**Tester Name:** _______________
**Issues Found:** _______________
**Sign Off:** _______________

---

*Last Updated: April 15, 2026*
