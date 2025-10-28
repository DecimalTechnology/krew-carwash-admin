# Packages API Setup Guide

## 🔍 Debugging 404 Error

The 404 error means your backend route is not found. Here's how to fix it:

### 1. Check Backend Route Registration

Make sure your package routes are registered in your main Express app:

```javascript
// In your main server file (e.g., server.js, app.js, index.js)
const adminRoutes = require('./routes/admin'); // or wherever your routes are

// Make sure this line exists and comes BEFORE the 404 handler
app.use('/api/v1/admin', adminRoutes);

// OR if you have it like this:
app.use('/api/v1', adminRoutes);
```

### 2. Check Your Routes File Structure

Your routes file should look like this:

```javascript
// routes/admin.js or routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth'); // or wherever your auth middleware is
const { 
  getAllPackages, 
  createPackage, 
  updatePackage, 
  deletePackage 
} = require('../controllers/packageController'); // adjust path as needed

// Package routes
router.get('/packages', adminAuth, getAllPackages);
router.post('/packages', adminAuth, createPackage);
router.put('/packages/:packageId', adminAuth, updatePackage);
router.delete('/packages/:packageId', adminAuth, deletePackage);

module.exports = router;
```

### 3. Verify the Full URL Path

Based on your frontend configuration, the full URL should be:
```
http://localhost:5000/api/v1/admin/packages
```

Check if this is correct by:
1. Opening your browser's Network tab
2. Looking at the actual request URL
3. Comparing it with your backend route registration

### 4. Test Backend Route Directly

Use Postman or curl to test:

```bash
# Get all packages
curl -X GET http://localhost:5000/api/v1/admin/packages \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create package
curl -X POST http://localhost:5000/api/v1/admin/packages \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Package",
    "frequency": "1 Time",
    "description": "Test",
    "basePrices": [],
    "isActive": true
  }'
```

### 5. Common Issues & Solutions

#### Issue 1: Route Not Found
**Problem:** Routes are defined but not registered
**Solution:** Make sure you export and import the router correctly

```javascript
// In routes file
module.exports = router; // or export default router;

// In main app file
const adminRoutes = require('./routes/admin');
app.use('/api/v1/admin', adminRoutes);
```

#### Issue 2: Wrong Base Path
**Problem:** Frontend expects `/admin/packages` but backend has different base
**Solution:** Update frontend base URL in `src/api/baseUrl.ts`:

```typescript
export const BASE_URL = `http://localhost:5000/api/v1`; // Check this matches your backend
```

#### Issue 3: Middleware Blocking
**Problem:** Authentication middleware is blocking requests
**Solution:** Check if token is being sent:

```javascript
// In your auth middleware
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Token received:', token ? 'Yes' : 'No');
  // ... rest of auth logic
};
```

#### Issue 4: CORS Issues
**Problem:** CORS blocking requests
**Solution:** Add CORS middleware in backend:

```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
```

### 6. Backend Controller Example

Make sure you have the package controller:

```javascript
// controllers/packageController.js
const Package = require('../models/Package');

exports.getAllPackages = async (req, res) => {
  try {
    const { search, status, sortedBy, sortOrder, page = 1, limit = 10 } = req.query;
    
    let query = { isDeleted: false };
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }
    
    const packages = await Package.find(query)
      .populate('basePrices.vehicleType')
      .sort({ [sortedBy || 'createdAt']: sortOrder === 'asc' ? 1 : -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Package.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: packages,
      pagination: {
        totalPages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createPackage = async (req, res) => {
  try {
    const package = await Package.create(req.body);
    res.status(201).json({ success: true, data: package });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updatePackage = async (req, res) => {
  try {
    const package = await Package.findByIdAndUpdate(
      req.params.packageId,
      req.body,
      { new: true, runValidators: true }
    ).populate('basePrices.vehicleType');
    
    if (!package) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    
    res.status(200).json({ success: true, data: package });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deletePackage = async (req, res) => {
  try {
    const package = await Package.findByIdAndUpdate(
      req.params.packageId,
      { isDeleted: true },
      { new: true }
    );
    
    if (!package) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    
    res.status(200).json({ success: true, data: package });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
```

### 7. Quick Checklist

- [ ] Routes file created with package endpoints
- [ ] Routes exported from routes file
- [ ] Routes imported in main app file
- [ ] Routes registered with correct base path (`/api/v1/admin`)
- [ ] Controllers created with all CRUD functions
- [ ] Package model exists
- [ ] Auth middleware is working
- [ ] CORS is configured
- [ ] Backend server is running on port 5000
- [ ] Token is stored in localStorage as "adminToken"

### 8. Frontend Console Debugging

Check browser console for these logs:
- "Packages API Response:" - shows what backend returned
- "Packages API Error:" - shows error details including status code

If you see 404, the route doesn't exist on backend.
If you see 401, authentication is failing.
If you see 500, there's a server error.

### 9. Need More Help?

Check these files and share them:
1. Your backend routes file path and content
2. Your main server/app file where routes are registered
3. Browser Network tab screenshot showing the failed request
4. Backend console logs

