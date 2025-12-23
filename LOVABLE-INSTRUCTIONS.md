# EEVY GPS - Lovable Project Instructions

## ⚠️ IMPORTANT: READ THIS FIRST

This is the **frontend-only** repository for EEVY GPS fleet management platform.

**Backend is in a SEPARATE repository** managed by the backend team.

---

## 🚫 NEVER DO THESE THINGS

1. **NEVER create or modify database schemas**
2. **NEVER create Supabase migrations**
3. **NEVER create backend API endpoints**
4. **NEVER add server-side code**
5. **NEVER modify files in `/src/hooks/*`** (backend team manages these)
6. **NEVER modify files in `/src/lib/*`** (backend team manages these)
7. **NEVER modify `/src/integrations/*`** (backend team manages these)

---

## ✅ YOU CAN DO THESE THINGS

1. **Create and edit UI components** in `/src/components/*`
2. **Create and edit pages** in `/src/pages/*`
3. **Edit styles and CSS**
4. **Add new UI features and layouts**
5. **Improve user experience and animations**
6. **Add shadcn/ui components**

---

## 🗄️ Supabase Configuration

We use an **existing Supabase project**. Credentials:

- **URL:** `https://rsaqcywqvqqucvxjkxjd.supabase.co`
- **Publishable Key:** `sb_publishable_ODfPFl7se9UaX_qzKV27AQ_msFLVpxY`

**DO NOT:**
- Create new tables
- Modify schema
- Create migrations
- Generate types

**The backend team handles ALL database work.**

---

## 🌐 API Configuration

Backend API URLs (managed separately):

- **Staging:** `https://api-staging.eevy.uk`
- **Production:** `https://api.eevy.uk`

If you need new API endpoints, tell the user: *"This requires a backend API endpoint. Please coordinate with the backend team."*

---

## 📁 Project Structure

```
src/
├── components/        ← ✅ YOU EDIT (UI components)
│   ├── ui/           ← shadcn components
│   └── dashboard/    ← dashboard components
├── pages/            ← ✅ YOU EDIT (page layouts)
├── hooks/            ← 🚫 DON'T EDIT (backend team)
├── lib/              ← 🚫 DON'T EDIT (backend team)
└── integrations/     ← 🚫 DON'T EDIT (backend team)
```

---

## 🔄 When User Asks for Data Features

If user requests something that needs:
- New database table → Say: *"This needs a database change. Please ask the backend team to create the table, then I can build the UI."*
- New API endpoint → Say: *"This needs a backend API. Please ask the backend team to create the endpoint, then I can connect the UI."*
- Changes to hooks → Say: *"The hooks are managed by the backend team. Please coordinate with them for this change."*

---

## 🎨 Current Features (UI Only)

The app currently shows **mock data** for demonstration:
- Vehicle list with sample vehicles
- Map display (needs Mapbox token)
- Alerts panel
- Trip history
- Driver management
- Geofence management

All data is currently local/mock. Real data will come from backend API.

---

## 💡 Example Good Requests

✅ "Make the vehicle cards bigger"
✅ "Add a dark mode toggle"
✅ "Change the header color to blue"
✅ "Add a loading spinner to the vehicle list"
✅ "Create a new settings page layout"

## 💡 Example Requests That Need Backend

⚠️ "Save vehicle data to database" → Backend team
⚠️ "Add user authentication" → Backend team
⚠️ "Create a new trips table" → Backend team
⚠️ "Connect to GPS device API" → Backend team
