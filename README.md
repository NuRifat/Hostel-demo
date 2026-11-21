# The Elite Nest — Student Residence & Hostel Management System

A modern, responsive web platform and administrative hostel management software for **The Elite Nest Student Residence** (*আগামীর নেতৃত্বের আপন ঠিকানা*).

## 🌟 Key Features

### 1. Main Website (`index.html`)
- **Luxury Theme**: Premium Black & Gold aesthetic matching the official residency branding.
- **Hero Section**: Full-screen split layout featuring an interactive image slideshow and Bengali tagline.
- **Facilities & Services**: Highlighting 24/7 security, high-speed Wi-Fi, quality meals, backup generator, dedicated study halls, and transport services.
- **Room Showcase**: Clear pricing and features for Single Deluxe, Double Sharing, and Triple/Quad rooms.
- **Filterable Gallery & Testimonials**: Responsive photo gallery with lightbox viewer and auto-sliding reviews.

### 2. Online Admission & Seat Booking Portal (`booking.html`)
- **Real-Time Seat Availability**: Interactive room and bed layout showing vacant vs. occupied beds.
- **Student Registration**: 4-step wizard collecting student, guardian, academic, and permanent address info.
- **Fee Breakdown & Payment Gateway Simulation**: Instant calculations for monthly rent, security deposit, and meal charges with simulated bKash, Nagad, Rocket, and Card payments.
- **Digital Admission Voucher**: Generates a verified digital admission pass with a unique Booking ID and check-in details.
- **Approval Queue**: New online bookings are automatically placed in the admin verification queue.

### 3. Administrator Hostel Management Software (`admin-panel.html`)
- **Clean White Theme**: Professional, clutter-free light software design tailored for hostel authorities.
- **Real-Time Notifications & Approval Engine**:
  - Live topbar notification bell for new admission requests.
  - One-click approval or rejection of new tenant applications.
- **Tenant Registry & Rent Tracking**:
  - Comprehensive list of all residents with parent/guardian phone numbers.
  - Tracking of monthly rent, total paid amount, and remaining overdue balances.
- **Automated SMS Reminder System (10th Deadline Rule)**:
  - Automatically identifies residents with unpaid dues past the 10th of the month.
  - Dispatches simultaneous reminder SMS to both the student and their parent/guardian.
- **Floor & Bed Matrix**: Visual floor plan (Floors 1–3) showing resident occupancy and vacant beds.

---

## 📁 Project Structure

```
Student_Hostel/
├── index.html           # Main Hostel Website
├── booking.html         # Online Seat Booking & Admission Flow
├── admin-panel.html     # Administrative Management Software (Admin Panel)
├── member-panel.html    # Legacy Redirect to Admin Panel
├── README.md            # Project Documentation
├── css/
│   ├── style.css        # Main Website Styles (Luxury Theme)
│   ├── booking.css      # Booking Portal Styles
│   ├── panel.css        # Admin Software Styles (Clean White Theme)
│   └── responsive.css   # Mobile & Tablet Adaptations
├── js/
│   ├── main.js          # Homepage Slider & Scroll Animations
│   ├── booking.js       # Stepper & Payment Simulation Engine
│   ├── panel.js         # Software Dashboard, Approval Engine & Auto-SMS
│   └── hostel-data.js   # LocalStorage Shared Database
└── images/
    └── namecard.jpg     # Hostel Branding Card
```

---

## 🚀 Getting Started

1. Clone or download the repository:
   ```bash
   git clone https://github.com/NuRifat/Hostel-demo.git
   ```
2. Open `index.html` in any modern web browser to view the homepage.
3. Click **"Book Now"** to test the admission flow.
4. Click **"Admin Panel"** to access the administrator software.

---

Designed with ❤️ for Future Leaders.
