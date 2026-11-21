// ========================================================
// THE ELITE NEST - Shared Demo Data Store (LocalStorage)
// ========================================================

const DEFAULT_HOSTEL_DATA = {
    stats: {
        totalBeds: 150,
        occupiedBeds: 132,
        availableBeds: 18,
        totalCollected: 1085000,
        totalRemaining: 145000
    },
    notifications: [
        {
            id: "NOTIF-101",
            title: "New Online Rent Admission",
            message: "Sabbir Ahmed applied for Room 103 (Bed 103-A) and paid ৳16,500 via bKash. Awaiting verification.",
            time: "5 minutes ago",
            studentId: "EN-2026-9042",
            isRead: false
        }
    ],
    students: [
        {
            id: "EN-2026-9042",
            name: "Sabbir Ahmed",
            father: "Mohammad Nurul Islam",
            mother: "Shirin Akhter",
            phone: "01712-345678",
            guardianPhone: "01819-223344",
            email: "sabbir.student@gmail.com",
            institute: "University of Dhaka (DU)",
            department: "Software Engineering",
            roll: "DU-SE-2026",
            bloodGroup: "B+",
            gender: "Male",
            permanentAddress: "House #12, Road #4, Shantinagar, Mymensingh",
            roomType: "single",
            roomTypeName: "Single Deluxe Room",
            roomNo: "Room 103",
            bedNo: "Bed 103-A",
            monthlyRent: 8000,
            mealCharge: 3500,
            paidAmount: 16500,
            remainingDue: 0,
            paymentStatus: "Paid",
            paymentMethod: "bKash",
            trxId: "BK892X78L1",
            bookingDate: "2026-11-21",
            approvalStatus: "Pending", // Pending Admin Approval
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80"
        },
        {
            id: "EN-2026-101",
            name: "Tanvir Ahmed",
            father: "Rafiqul Islam",
            mother: "Nasima Begum",
            phone: "01711-223344",
            guardianPhone: "01819-887766",
            email: "tanvir.du@gmail.com",
            institute: "University of Dhaka (DU)",
            department: "Computer Science & Engineering",
            roll: "DU-CSE-4421",
            bloodGroup: "B+",
            gender: "Male",
            permanentAddress: "House 14, Road 3, Sector 4, Uttara, Dhaka",
            roomType: "single",
            roomTypeName: "Single Deluxe Room",
            roomNo: "Room 101",
            bedNo: "Bed 101-A",
            monthlyRent: 8000,
            mealCharge: 3500,
            paidAmount: 16500,
            remainingDue: 0,
            paymentStatus: "Paid",
            paymentMethod: "bKash",
            trxId: "BK9X77A821",
            bookingDate: "2026-11-01",
            approvalStatus: "Approved",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80"
        },
        {
            id: "EN-2026-102",
            name: "Mahmudul Hasan",
            father: "Abdur Rashid",
            mother: "Salma Akhter",
            phone: "01822-334455",
            guardianPhone: "01712-998877",
            email: "hasan.buet@gmail.com",
            institute: "BUET",
            department: "Mechanical Engineering",
            roll: "2010045",
            bloodGroup: "O+",
            gender: "Male",
            permanentAddress: "Station Road, Kotwali, Rangpur",
            roomType: "double",
            roomTypeName: "Double Sharing",
            roomNo: "Room 201",
            bedNo: "Bed 201-A",
            monthlyRent: 5500,
            mealCharge: 3500,
            paidAmount: 9000,
            remainingDue: 5000,
            paymentStatus: "Due",
            paymentMethod: "Nagad",
            trxId: "NG882B4410",
            bookingDate: "2026-11-03",
            approvalStatus: "Approved",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
        },
        {
            id: "EN-2026-103",
            name: "Fahim Shahriar",
            father: "Nurul Huda",
            mother: "Rokeya Huda",
            phone: "01933-445566",
            guardianPhone: "01611-223344",
            email: "fahim.dmc@gmail.com",
            institute: "Dhaka Medical College (DMC)",
            department: "MBBS (3rd Year)",
            roll: "DMC-78",
            bloodGroup: "A+",
            gender: "Male",
            permanentAddress: "Chawkbazar, Chattragram",
            roomType: "single",
            roomTypeName: "Single Deluxe Room",
            roomNo: "Room 102",
            bedNo: "Bed 102-A",
            monthlyRent: 8000,
            mealCharge: 3500,
            paidAmount: 16500,
            remainingDue: 0,
            paymentStatus: "Paid",
            paymentMethod: "Bank Transfer",
            trxId: "EBL-TRX-9941",
            bookingDate: "2026-11-05",
            approvalStatus: "Approved",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80"
        },
        {
            id: "EN-2026-104",
            name: "Zubair Rahman",
            father: "Mizanur Rahman",
            mother: "Hosne Ara",
            phone: "01744-556677",
            guardianPhone: "01912-334455",
            email: "zubair.nsu@gmail.com",
            institute: "North South University (NSU)",
            department: "BBA (Finance)",
            roll: "2130541",
            bloodGroup: "AB+",
            gender: "Male",
            permanentAddress: "Zindabazar, Sylhet Sadar, Sylhet",
            roomType: "double",
            roomTypeName: "Double Sharing",
            roomNo: "Room 201",
            bedNo: "Bed 201-B",
            monthlyRent: 5500,
            mealCharge: 3500,
            paidAmount: 14000,
            remainingDue: 0,
            paymentStatus: "Paid",
            paymentMethod: "bKash",
            trxId: "BK773L9921",
            bookingDate: "2026-11-08",
            approvalStatus: "Approved",
            avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&q=80"
        },
        {
            id: "EN-2026-105",
            name: "Shakil Hossain",
            father: "Amzad Hossain",
            mother: "Parvin Sultana",
            phone: "01655-667788",
            guardianPhone: "01815-443322",
            email: "shakil.aiub@gmail.com",
            institute: "AIUB",
            department: "Software Engineering",
            roll: "22-47891-2",
            bloodGroup: "O-",
            gender: "Male",
            permanentAddress: "KDA Avenue, Khulna Sadar, Khulna",
            roomType: "triple",
            roomTypeName: "Triple / Quad Sharing",
            roomNo: "Room 301",
            bedNo: "Bed 301-A",
            monthlyRent: 4000,
            mealCharge: 3500,
            paidAmount: 7500,
            remainingDue: 5000,
            paymentStatus: "Due",
            paymentMethod: "Rocket",
            trxId: "RK22019842",
            bookingDate: "2026-11-10",
            approvalStatus: "Approved",
            avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&q=80"
        },
        {
            id: "EN-2026-106",
            name: "Nazmul Karim",
            father: "Karim Ullah",
            mother: "Fatema Karim",
            phone: "01788-990011",
            guardianPhone: "01511-778899",
            email: "nazmul.brac@gmail.com",
            institute: "BRAC University",
            department: "Electrical & Electronic Eng",
            roll: "21101908",
            bloodGroup: "B+",
            gender: "Male",
            permanentAddress: "Baghmara, Rajshahi",
            roomType: "triple",
            roomTypeName: "Triple / Quad Sharing",
            roomNo: "Room 301",
            bedNo: "Bed 301-B",
            monthlyRent: 4000,
            mealCharge: 3500,
            paidAmount: 12500,
            remainingDue: 0,
            paymentStatus: "Paid",
            paymentMethod: "bKash",
            trxId: "BK4820P812",
            bookingDate: "2026-11-12",
            approvalStatus: "Approved",
            avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=80"
        }
    ],
    rooms: [
        { id: "101", type: "single", name: "Single Deluxe Room", floor: 1, rent: 8000, beds: [{ bed: "Bed 101-A", status: "occupied", studentId: "EN-2026-101" }] },
        { id: "102", type: "single", name: "Single Deluxe Room", floor: 1, rent: 8000, beds: [{ bed: "Bed 102-A", status: "occupied", studentId: "EN-2026-103" }] },
        { id: "103", type: "single", name: "Single Deluxe Room", floor: 1, rent: 8000, beds: [{ bed: "Bed 103-A", status: "available", studentId: null }] },
        { id: "104", type: "single", name: "Single Deluxe Room", floor: 1, rent: 8000, beds: [{ bed: "Bed 104-A", status: "available", studentId: null }] },
        { id: "201", type: "double", name: "Double Sharing Room", floor: 2, rent: 5500, beds: [{ bed: "Bed 201-A", status: "occupied", studentId: "EN-2026-102" }, { bed: "Bed 201-B", status: "occupied", studentId: "EN-2026-104" }] },
        { id: "202", type: "double", name: "Double Sharing Room", floor: 2, rent: 5500, beds: [{ bed: "Bed 202-A", status: "available", studentId: null }, { bed: "Bed 202-B", status: "available", studentId: null }] },
        { id: "203", type: "double", name: "Double Sharing Room", floor: 2, rent: 5500, beds: [{ bed: "Bed 203-A", status: "occupied", studentId: "EN-2026-105" }, { bed: "Bed 203-B", status: "available", studentId: null }] },
        { id: "301", type: "triple", name: "Triple / Quad Room", floor: 3, rent: 4000, beds: [{ bed: "Bed 301-A", status: "occupied", studentId: "EN-2026-105" }, { bed: "Bed 301-B", status: "occupied", studentId: "EN-2026-106" }, { bed: "Bed 301-C", status: "available", studentId: null }, { bed: "Bed 301-D", status: "available", studentId: null }] },
        { id: "302", type: "triple", name: "Triple / Quad Room", floor: 3, rent: 4000, beds: [{ bed: "Bed 302-A", status: "available", studentId: null }, { bed: "Bed 302-B", status: "available", studentId: null }, { bed: "Bed 302-C", status: "available", studentId: null }, { bed: "Bed 302-D", status: "available", studentId: null }] }
    ]
};

// Initialize LocalStorage if not exists
function getHostelData() {
    const data = localStorage.getItem("elitenest_hostel_db");
    if (!data) {
        localStorage.setItem("elitenest_hostel_db", JSON.stringify(DEFAULT_HOSTEL_DATA));
        return DEFAULT_HOSTEL_DATA;
    }
    try {
        const parsed = JSON.parse(data);
        if (!parsed.notifications) parsed.notifications = [];
        return parsed;
    } catch(e) {
        return DEFAULT_HOSTEL_DATA;
    }
}

function saveHostelData(data) {
    localStorage.setItem("elitenest_hostel_db", JSON.stringify(data));
}

// Add a new student booking (Pending Admin Approval)
function addNewStudentBooking(studentData) {
    const db = getHostelData();
    studentData.approvalStatus = "Pending"; // Sets as Pending Approval
    
    // Insert student
    db.students.unshift(studentData);

    // Create Notification for Admin
    if (!db.notifications) db.notifications = [];
    const notifObj = {
        id: "NOTIF-" + Date.now(),
        title: "New Online Rent Admission",
        message: `${studentData.name} applied for ${studentData.roomNo} (${studentData.bedNo}) and paid ৳${(studentData.paidAmount || 0).toLocaleString()} via ${studentData.paymentMethod || 'bKash'}.`,
        time: "Just now",
        studentId: studentData.id,
        isRead: false
    };
    db.notifications.unshift(notifObj);

    saveHostelData(db);
    return studentData;
}

// Admin Approves the booking
function approveStudentBooking(studentId) {
    const db = getHostelData();
    const student = db.students.find(s => s.id === studentId);
    if (!student) return false;

    student.approvalStatus = "Approved";

    // Allocate the bed in rooms matrix
    if (student.roomNo && student.bedNo) {
        const roomNum = student.roomNo.replace(/\D/g, '');
        const targetRoom = db.rooms.find(r => r.id === roomNum);
        if (targetRoom) {
            const bedObj = targetRoom.beds.find(b => b.bed === student.bedNo || b.status === "available");
            if (bedObj) {
                bedObj.status = "occupied";
                bedObj.studentId = student.id;
            }
        }
    }

    // Update stats
    db.stats.occupiedBeds += 1;
    db.stats.availableBeds = Math.max(0, db.stats.totalBeds - db.stats.occupiedBeds);
    db.stats.totalCollected += (student.paidAmount || 0);
    db.stats.totalRemaining += (student.remainingDue || 0);

    saveHostelData(db);
    return true;
}

// Admin Rejects the booking
function rejectStudentBooking(studentId, reason) {
    const db = getHostelData();
    const studentIndex = db.students.findIndex(s => s.id === studentId);
    if (studentIndex !== -1) {
        db.students[studentIndex].approvalStatus = "Rejected";
        db.students[studentIndex].rejectReason = reason || "Application rejected by authority.";
        saveHostelData(db);
        return true;
    }
    return false;
}
