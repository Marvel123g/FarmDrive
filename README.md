# FarmDrive

FarmDrive is a web platform that bridges the gap between farmers who need to transport fresh produce and drivers with available truck space. The platform helps reduce post-harvest waste by connecting farmers with drivers quickly and efficiently, ensuring produce reaches markets before spoilage.
This project also integrated AI for matching farmers with the best drivers available from the list.

### Enyata Alignment: Agriculture + Transport + Payment
This project is a natural fit for Enyata’s core pillars:
- Agriculture: enabling farmers to list produce, get matched, and track delivery in real-time, improving harvest value and farmer income.
- Transport: connecting drivers with underused capacity to urgent produce requests, accelerating logistics and reducing empty-truck miles.
- Payment: integrating INTERSWITCH to allow seamless upfront payments and secure settlement for both farmers and drivers.

### Agriculture Impact
- Lowers post-harvest losses by speeding up market delivery of perishables
- Increases rural farmer access to reliable transport and formal revenue channels
- Supports traceability and trust in the farm-to-market supply chain

### Market Value and Spoilage Reduction (Nigeria Context)
- Nigeria loses 20-40% of fresh produce post-harvest; even 10% less loss can represent ~₦400B annual value saved in vegetables/tubers market.
- Transport inefficiencies cost Nigerian agriculture up to 30% of margin; matching available trucks to farmers can improve delivery efficiency by 20-25%.
- Digital payment adoption in agri-logistics can grow addressable market to ~₦2T+ in the next 3 years with secure, instant settlement.
- City-region pilot (500 farmers + 200 drivers) could prevent 50+ tons of spoilage annually and deliver 70% faster fulfillment.

### Job Opportunity & Local Economy
- Creates farm-side and transport-side gig work by matching available drivers with producers.
- Increases demand for local drivers, warehouse handlers, and collection/last-mile staff.
- Expands digital agri-service roles (onboarding, operations, support, payment reconciliation).

- Farmers can post their produce requirements.
- Drivers can browse requests, accept deliveries, and update status.
- Tracking for delivery status is available for both farmers and drivers.
- Secure payments are handled through INTERSWITCH payment API.

---

##  User Experience (Farmer)
1. Create account
2. Post a farm produce
3. Wait for drivers to bid with their prices
4. Go to My Produce and click on View Drivers
5. View AI Note per driver and price bid
5. Select the driver that suits you best
6. Watch how your delivery is moving to it's destination through the map
7. Process Driver Payments successfully after confirming delivery photos (Yet to be Implemented)
8. Watch how Interswitch does the magic (Yet to be Implemented)

##  User Experience (Driver)
1. Create account
2. Submit KYC to be eligible for bidding
3. View Marketplace to bid with your price
4. Await farmer acceptance of your price
5. View Deliveries to see map both to farmer for pickup and to destination for drop-off
6. Request Payment and submit photos of delivered items
7. Watch how your payment is processed over Interswitch (Yet to be Implemented)


---

## 🛠️ Project Structure

Root directories:
- `backend/` - Flask backend (API, DB, socket events)
- `frontend/` - Vite + React frontend (farmer, driver, landing pages)

---

## 🚀 How to run locally

### Backend
```bash
cd backend
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
python main.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🚀 How to run for development
### Backend
Backend is running at `https://farmdrive.onrender.com`

### Frontend
Frontend is running at `https://farmdrive.vercel.app`

---

## 👥 Team Contributions
## Team Name: xpress

### Team Lead (Project Creator on Enyata)
- Role: Frontend Developer & UX/UI Designer
- Name: Olorunwa Marvelous
- Responsibilities:
  - Created team on Enyata and invited backend teammate
  - React UI components for farmer and driver marketplace
  - Form handling, routing, and auth flows
  - CSS/SCSS styling and responsive layout
  - UI/UX design and prototyping
  - Integrated payment flow with INTERSWITCH sandbox

### Backend Developer & Product Manager
- Role: Backend Developer & Product Manager
- Name: Goodluck Okechukwu
- Responsibilities:
  - Architecture design (backend + frontend flow)
  - Backend API endpoints (`/produce`, `/delivery`, `/payment`, `/price`, `/transit`, `/auth`)
  - Database schema and integration
  - Socket delivery status updates
  - Product planning, feature prioritization, and MVP alignment
  - Deployment pipeline and final submission readiness

---

## 📍 Features Implemented

- Farmer signup/login pipeline
- Driver signup/login pipeline
- Post produce request
- Browse available delivery requests
- Accept deliveries as driver
- Real-time status updates with sockets
- Payment checkout (INTERSWITCH)
- Delivery history and earnings summary

---

## ✅ Demo Checklist
- [ ] Live link works from browser
- [ ] Authentication for farmer and driver
- [ ] Posting produce and search by driver
- [ ] Delivery accept, pickup, transit, complete flows
- [ ] Payment initiated and confirmed
- [ ] Dashboard tracking status

---

## 🔐 Production Notes
- Use `backend/.env` to store API keys securely
- Confirm `INTERSWITCH` keys are set in env
- Run DB migrations before production start
- Future implementation is to integrate interswich api successfully

---

## 📬 Contact
- Team Lead: Olorunwa Marvelous
- Email: [marvellousolorunwa23@gmail.com]
- Project: FarmDrive (transport + agriculture logistics)
