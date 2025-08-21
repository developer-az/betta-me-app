# Supabase Setup Checklist

## 🔧 **Step 1: Database Schema Setup**

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard/project/apesehqjztvperbrywax

2. **Run the SQL Schema:**
   - Click "SQL Editor" in the left sidebar
   - Copy the entire contents of `supabase-schema.sql`
   - Paste and click "Run"

3. **Verify Tables Created:**
   - Go to "Table Editor" in the left sidebar
   - You should see: `profiles`, `tanks`, `fish`, `water_readings`

## 🔐 **Step 2: Authentication Settings**

1. **Check Auth Settings:**
   - Go to "Authentication" > "Settings"
   - Ensure "Enable email confirmations" is ON
   - Set "Site URL" to: `http://localhost:3000`
   - Add to "Redirect URLs": `http://localhost:3000/**`

2. **Check Email Templates:**
   - Go to "Authentication" > "Email Templates"
   - Verify "Confirm signup" template exists

## 🧪 **Step 3: Test the Setup**

1. **Check the Test Component:**
   - Go to `http://localhost:3000`
   - Look at the "Supabase Connection Test" component
   - It should show "✅ Supabase connection successful!" and "Tables exist"

2. **Test Signup:**
   - Click "Test Sign Up" button
   - Should show "✅ Signup successful! Check email for confirmation."

3. **Create Real Account:**
   - Go to `http://localhost:3000/signup`
   - Use your real email address
   - Check email for confirmation link
   - Click the link to confirm

## 🚨 **Common Issues & Solutions**

### Issue: "relation 'profiles' does not exist"
**Solution:** Run the SQL schema in Supabase SQL Editor

### Issue: "Invalid login credentials" (400 error)
**Solution:** 
- Check if email confirmation is required
- Verify the user confirmed their email
- Check if the user exists in the database

### Issue: "Site URL not allowed"
**Solution:** Add `http://localhost:3000` to Site URL in Auth Settings

### Issue: "Redirect URL not allowed"
**Solution:** Add `http://localhost:3000/**` to Redirect URLs in Auth Settings

## 📊 **Expected Database Structure**

After running the schema, you should have:

```sql
-- Tables
profiles (id, email, created_at, updated_at)
tanks (id, user_id, size, heater, filter, created_at, updated_at)
fish (id, user_id, tank_id, name, color, appetite, activity, fin_condition, color_condition, gill_condition, body_condition, behavior, created_at, updated_at)
water_readings (id, user_id, tank_id, temperature, ph, ammonia, nitrite, nitrate, created_at)

-- RLS Policies (Row Level Security)
-- All tables should have policies that restrict access to user_id = auth.uid()

-- Triggers
-- Automatic profile creation when user signs up
-- Automatic updated_at timestamp updates
```

## ✅ **Success Indicators**

- ✅ Test component shows "Tables exist"
- ✅ Signup works without errors
- ✅ Email confirmation received
- ✅ Can sign in after email confirmation
- ✅ Can access protected routes (tank, fish, water, dashboard)
