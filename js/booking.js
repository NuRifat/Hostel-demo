// ========================================================
// THE ELITE NEST - Booking Flow Engine
// ========================================================

let currentStep = 1;

let bookingState = {
    roomType: "single",
    roomTypeName: "Single Deluxe Room",
    roomNo: "Room 103",
    bedNo: "Bed 103-A",
    rent: 8000,
    deposit: 5000,
    mealFee: 3500,
    includeMeal: true,
    totalPayable: 16500,
    student: {
        name: "",
        gender: "Male",
        phone: "",
        email: "",
        bloodGroup: "B+",
        dob: "",
        father: "",
        mother: "",
        guardianPhone: "",
        guardianRelation: "Father",
        institute: "",
        department: "",
        roll: "",
        academicYear: "",
        permanentAddress: ""
    },
    payment: {
        method: "bKash",
        walletNum: "",
        trxId: ""
    },
    bookingId: ""
};

document.addEventListener("DOMContentLoaded", () => {
    // Read URL query parameter ?room=single/double/triple
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get("room");
    if (roomParam) {
        selectRoomTypeByParam(roomParam);
    }

    initRoomSelectionHandlers();
    initPaymentTabs();
    calculateTotalPayable();
});

// Stepper navigation
function goToStep(stepNum) {
    if (stepNum < 1 || stepNum > 4) return;

    // Validation for Step 2
    if (stepNum === 3 && currentStep === 2) {
        const form = document.getElementById("studentRegistrationForm");
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        collectStudentFormData();
        updateInvoiceSummary();
    }

    // Update Step panels
    document.querySelectorAll(".booking-step").forEach(step => {
        step.classList.remove("active");
    });
    const targetStep = document.getElementById(`step-${stepNum}`);
    if (targetStep) targetStep.classList.add("active");

    // Update Stepper item states
    document.querySelectorAll(".stepper-item").forEach(item => {
        const itemStep = parseInt(item.getAttribute("data-step"));
        item.classList.remove("active", "completed");
        if (itemStep === stepNum) {
            item.classList.add("active");
        } else if (itemStep < stepNum) {
            item.classList.add("completed");
        }
    });

    currentStep = stepNum;
    window.scrollTo({ top: 120, behavior: "smooth" });
}

// Room Selection Logic
function initRoomSelectionHandlers() {
    // Room card click
    document.querySelectorAll(".room-select-card").forEach(card => {
        card.addEventListener("click", (e) => {
            if (e.target.closest(".bed-chip")) return; // handled by chip

            document.querySelectorAll(".room-select-card").forEach(c => c.classList.remove("active"));
            card.classList.add("active");

            bookingState.roomType = card.getAttribute("data-type");
            bookingState.roomTypeName = card.getAttribute("data-name");
            bookingState.rent = parseInt(card.getAttribute("data-rent"));

            // Pick first available bed in this card
            const firstFreeChip = card.querySelector(".bed-chip:not(.occupied)");
            if (firstFreeChip) {
                document.querySelectorAll(".bed-chip").forEach(b => b.classList.remove("selected"));
                firstFreeChip.classList.add("selected");
                bookingState.roomNo = firstFreeChip.getAttribute("data-room");
                bookingState.bedNo = firstFreeChip.getAttribute("data-bed");
            }

            updateSelectedSummary();
            calculateTotalPayable();
        });
    });

    // Bed chip click
    document.querySelectorAll(".bed-chip:not(.occupied)").forEach(chip => {
        chip.addEventListener("click", (e) => {
            e.stopPropagation();
            document.querySelectorAll(".bed-chip").forEach(b => b.classList.remove("selected"));
            chip.classList.add("selected");

            const parentCard = chip.closest(".room-select-card");
            if (parentCard) {
                document.querySelectorAll(".room-select-card").forEach(c => c.classList.remove("active"));
                parentCard.classList.add("active");

                bookingState.roomType = parentCard.getAttribute("data-type");
                bookingState.roomTypeName = parentCard.getAttribute("data-name");
                bookingState.rent = parseInt(parentCard.getAttribute("data-rent"));
            }

            bookingState.roomNo = chip.getAttribute("data-room");
            bookingState.bedNo = chip.getAttribute("data-bed");

            updateSelectedSummary();
            calculateTotalPayable();
        });
    });
}

function selectRoomTypeByParam(type) {
    const card = document.querySelector(`.room-select-card[data-type="${type}"]`);
    if (card) {
        card.click();
    }
}

function updateSelectedSummary() {
    const sumEl = document.getElementById("selectedBedSummary");
    const rentEl = document.getElementById("selectedRentSummary");

    if (sumEl) sumEl.textContent = `${bookingState.roomTypeName} — ${bookingState.roomNo} (${bookingState.bedNo})`;
    if (rentEl) rentEl.textContent = `৳${bookingState.rent.toLocaleString()} / month`;
}

// Student form collection
function collectStudentFormData() {
    bookingState.student.name = document.getElementById("studentName").value.trim() || "Student";
    bookingState.student.gender = document.getElementById("studentGender").value;
    bookingState.student.phone = document.getElementById("studentPhone").value.trim();
    bookingState.student.email = document.getElementById("studentEmail").value.trim();
    bookingState.student.bloodGroup = document.getElementById("studentBlood").value;
    bookingState.student.dob = document.getElementById("studentDob").value;
    bookingState.student.father = document.getElementById("fatherName").value.trim();
    bookingState.student.mother = document.getElementById("motherName").value.trim();
    bookingState.student.guardianPhone = document.getElementById("guardianPhone").value.trim();
    bookingState.student.guardianRelation = document.getElementById("guardianRelation").value.trim() || "Guardian";
    bookingState.student.institute = document.getElementById("instituteName").value.trim() || "University";
    bookingState.student.department = document.getElementById("deptName").value.trim() || "Department";
    bookingState.student.roll = document.getElementById("studentRoll").value.trim() || "ID-Pending";
    bookingState.student.academicYear = document.getElementById("academicYear").value.trim() || "Current";
    bookingState.student.permanentAddress = document.getElementById("permanentAddress").value.trim();
}

// Payment & Invoice calculations
function calculateTotalPayable() {
    const mealCheck = document.getElementById("includeMealCheck");
    bookingState.includeMeal = mealCheck ? mealCheck.checked : true;
    const mealAmount = bookingState.includeMeal ? 3500 : 0;
    bookingState.mealFee = mealAmount;

    bookingState.totalPayable = bookingState.rent + bookingState.deposit + mealAmount;

    const invRentEl = document.getElementById("invRentAmount");
    const invMealEl = document.getElementById("invMealAmount");
    const invTotalEl = document.getElementById("invTotalAmount");
    const bkashAmountEl = document.getElementById("bkashPayAmount");

    if (invRentEl) invRentEl.textContent = `৳${bookingState.rent.toLocaleString()}`;
    if (invMealEl) invMealEl.textContent = `৳${mealAmount.toLocaleString()}`;
    if (invTotalEl) invTotalEl.textContent = `৳${bookingState.totalPayable.toLocaleString()}`;
    if (bkashAmountEl) bkashAmountEl.textContent = `৳${bookingState.totalPayable.toLocaleString()}`;
}

function updateInvoiceSummary() {
    const nameEl = document.getElementById("invStudentName");
    const instEl = document.getElementById("invInstitute");
    const roomSnip = document.getElementById("invRoomSnippet");
    const roomTitle = document.getElementById("invRoomTitle");

    if (nameEl) nameEl.textContent = bookingState.student.name;
    if (instEl) instEl.textContent = `${bookingState.student.institute} (${bookingState.student.department})`;
    if (roomSnip) roomSnip.innerHTML = `<i class="fas fa-bed"></i> ${bookingState.roomNo} (${bookingState.bedNo})`;
    if (roomTitle) roomTitle.textContent = bookingState.roomTypeName;

    calculateTotalPayable();
}

// Payment Tabs
function initPaymentTabs() {
    const tabs = document.querySelectorAll(".pay-tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            bookingState.payment.method = tab.getAttribute("data-method");
        });
    });
}

// Simulate Payment Process
function simulatePaymentProcess() {
    const btn = document.getElementById("btnPayConfirm");
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Verifying with Gateway...`;

    setTimeout(() => {
        btn.innerHTML = `<i class="fas fa-check"></i> Payment Approved! Generating Voucher...`;

        setTimeout(() => {
            finalizeBooking();
            btn.disabled = false;
            btn.innerHTML = originalText;
        }, 800);
    }, 1200);
}

// Finalize Booking & save to database
function finalizeBooking() {
    // Generate Random Booking ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    bookingState.bookingId = `EN-2026-${randomSuffix}`;

    bookingState.payment.walletNum = document.getElementById("bkashWalletNum") ? document.getElementById("bkashWalletNum").value : "01712345678";
    bookingState.payment.trxId = document.getElementById("bkashTrxId") ? document.getElementById("bkashTrxId").value : `TRX${Date.now()}`;

    // Student Database Object
    const newStudent = {
        id: bookingState.bookingId,
        name: bookingState.student.name,
        father: bookingState.student.father,
        mother: bookingState.student.mother,
        phone: bookingState.student.phone,
        guardianPhone: bookingState.student.guardianPhone,
        email: bookingState.student.email,
        institute: bookingState.student.institute,
        department: bookingState.student.department,
        roll: bookingState.student.roll,
        bloodGroup: bookingState.student.bloodGroup,
        gender: bookingState.student.gender,
        permanentAddress: bookingState.student.permanentAddress,
        roomType: bookingState.roomType,
        roomTypeName: bookingState.roomTypeName,
        roomNo: bookingState.roomNo,
        bedNo: bookingState.bedNo,
        monthlyRent: bookingState.rent,
        mealCharge: bookingState.mealFee,
        paidAmount: bookingState.totalPayable,
        remainingDue: 0,
        paymentStatus: "Paid",
        paymentMethod: bookingState.payment.method.toUpperCase(),
        trxId: bookingState.payment.trxId,
        bookingDate: new Date().toISOString().split("T")[0],
        avatar: bookingState.student.gender === "Female" 
            ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80"
            : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80"
    };

    // Save to LocalStorage Database using shared helper
    if (typeof addNewStudentBooking === "function") {
        addNewStudentBooking(newStudent);
    }

    // Populate Voucher Card in Step 4
    document.getElementById("confBookingId").textContent = bookingState.bookingId;
    document.getElementById("confStudentName").textContent = bookingState.student.name;
    document.getElementById("confAllocatedBed").textContent = `${bookingState.roomNo} — ${bookingState.bedNo} (${bookingState.roomTypeName})`;
    document.getElementById("confInstitute").textContent = `${bookingState.student.institute} - ${bookingState.student.department}`;
    document.getElementById("confPaidAmount").textContent = `৳${bookingState.totalPayable.toLocaleString()} (Paid & Cleared)`;
    document.getElementById("confTrxSnippet").textContent = `${bookingState.payment.method.toUpperCase()} (${bookingState.payment.trxId})`;

    // Transition to Step 4
    goToStep(4);
}
