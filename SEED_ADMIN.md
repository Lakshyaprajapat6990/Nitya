# Admin User Seeding Guide

## 1. Backend must have env vars:
```
MONGO_URI=mongodb+srv://devyogam_user:EljeAI40nT55iGnY@cluster0.eyleqqb.mongodb.net/devyogam  
JWT_SECRET=your-super-secret-key-123
```

## 2. Create Admin (Postman/cURL):
```
POST https://your-backend.vercel.app/api/users/seed-admin
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123", 
  "phone": "+919999999999"
}
```

## 3. Login:
```
POST https://your-backend.vercel.app/api/users/admin/login
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Returns JWT token → Login works!**

