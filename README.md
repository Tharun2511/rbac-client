# 🚀 **Internal Workflow & Ticket Management Platform**

A full-stack, production-grade internal workflow application supporting **multi-role access control**, **ticket lifecycle automation**, and **clean, scalable architecture**.

Built with **Next.js (App Router)**, **Node.js (Express)**, **TypeScript**, **PostgreSQL**, and **MUI**, the platform enables teams to manage issue reporting, assignment, resolution, and verification efficiently.

---

# 🧩 **Features**

### 🔐 **Role-Based Access Control (RBAC)**

Supports 4 system roles:

* **User** – Creates tickets & verifies resolutions
* **Manager** – Assigns tickets & closes completed ones
* **Resolver** – Works on assigned tickets & marks them as resolved
* **Admin** – Manages user accounts & roles

### 🎯 **Complete Ticket Lifecycle**

```
OPEN (Ticket created by user) → ASSIGNED (Manager assigns the ticket to a resolver)  → RESOLVED_BY_RESOLVER (Resolver finds a resolution and fixes it) → VERIFIED_BY_USER (The resolution later verified by user and marks resolved) → CLOSED (Manager then checks the tickets and closes it)
```

### 🛠️ Core Functionalities

* Create, assign, resolve, verify, and close tickets
* Full workflow validation enforced at backend
* Scalable UI architecture using reusable components & custom hooks
* Secure JWT authentication system
* PostgreSQL relational queries with user JSON mapping
* Modular backend (Controller → Service → Repository pattern)
* Clean MUI interface for dashboards, lists, and dialogs

---

# 🏗️ **Tech Stack**

### **Frontend**

* Next.js (App Router)
* React + TypeScript
* MUI (Material UI)

### **Backend**

* Node.js (Express)
* TypeScript
* JWT Authentication
* Controller–Service–Repository architecture

### **Database**

* PostgreSQL
* Raw SQL + optimized JOIN queries
* JSON aggregation for resolver & creator details

### **Deployment**

* Frontend → Vercel
* Backend → Render
* Managed PostgreSQL DB

---

# 🔑 **Dummy Credentials (for Testing)**

Use these accounts to explore each role:

### 👤 **Admin**

```
Email: admin@admin.com
Password: admin@123
```

### 🧑‍💼 **Manager**

```
Email: manager@manager.com
Password: manager@123
```

### 🧑‍🔧 **Resolver**

```
Email: resolver@resolver.com
Password: resolver@123
```

### 🙋‍♂️ **User**

```
Email: user@user.com
Password: user@123
```

> These accounts are created automatically in dev mode or can be seeded manually.

---

# 💻 **Local Development Setup**

### **1. Clone the repo**

```bash
git clone https://github.com/your-username/workflow-platform.git
cd workflow-platform
```

### **2. Install frontend & backend dependencies**

```bash
cd frontend
npm install

cd ../backend
npm install
```

### **3. Set up environment variables**

#### **Frontend → `.env.local`**

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### **Backend → `.env`**

```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/workflowdb
JWT_SECRET=secretkey
```

### **4. Run the backend**

```bash
cd backend
npm run dev
```

### **5. Run the frontend**

```bash
cd frontend
npm run dev
```

---

<!-- # 📸 **Screenshots (Add Later)**

```
📌 Dashboard
📌 Ticket List
📌 Ticket Details
📌 Admin User Management
```

Add images here after UI polish.

---
-->

# 📦 **Project Structure (Simplified)**

```
frontend/
  components/
  hooks/
  app/
  lib/
backend/
  src/
    controllers/
    services/
    repositories/
    routes/
    utils/
```

---

# 🌟 **Key Highlights**

* Enterprise-style workflow automation
* Clean modular frontend architecture
* Typed backend with Express + PostgreSQL
* Professional RBAC + Auth
* Scalable and easily extensible design

