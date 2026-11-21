// ========================================================
// THE ELITE NEST - Hostel Management Software (Panel JS)
// Clean White Theme, Auto-SMS & Live Approval Engine
// ========================================================

let hostelDb = null;
const smsSentMap = {};

document.addEventListener("DOMContentLoaded", () => {
    loadDatabase();
    initSidebarTabs();
    initNotifDropdown();
    refreshAllViews();
    checkNewApplicantToast();
});

function loadDatabase() {
    if (typeof getHostelData === "function") {
        hostelDb = getHostelData();
    } else {
        hostelDb = DEFAULT_HOSTEL_DATA;
    }
}

function refreshAllViews() {
    renderOverview();
    renderPendingApprovals();
    renderResidentsTable();
    renderPaymentLedger();
    renderAutoSmsTable();
    renderRoomMatrix();
    renderNotifications();
}

// Sidebar Navigation
function initSidebarTabs() {
    const links = document.querySelectorAll(".sidebar-link");
    const sidebar = document.getElementById("panelSidebar");

    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const tabKey = link.getAttribute("data-tab");
            switchSidebarTab(tabKey);

            // On mobile, close sidebar after clicking a tab
            if (window.innerWidth <= 800 && sidebar) {
                sidebar.classList.remove("mobile-open");
            }
        });
    });

    const toggle = document.getElementById("sidebarToggle");
    if (toggle && sidebar) {
        toggle.addEventListener("click", (e) => {
            e.stopPropagation();
            if (window.innerWidth <= 800) {
                sidebar.classList.toggle("mobile-open");
            } else {
                sidebar.classList.toggle("collapsed");
            }
        });
    }

    // Close mobile drawer on outside click
    document.addEventListener("click", (e) => {
        const fab = document.getElementById("mobileSidebarFab");
        if (sidebar && sidebar.classList.contains("mobile-open")) {
            if (!sidebar.contains(e.target) && (!fab || !fab.contains(e.target))) {
                sidebar.classList.remove("mobile-open");
            }
        }
    });
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById("panelSidebar");
    if (sidebar) {
        sidebar.classList.toggle("mobile-open");
    }
}

function switchSidebarTab(tabKey) {
    document.querySelectorAll(".sidebar-link").forEach(l => l.classList.remove("active"));
    const activeLink = document.querySelector(`.sidebar-link[data-tab="${tabKey}"]`);
    if (activeLink) activeLink.classList.add("active");

    document.querySelectorAll(".panel-tab-content").forEach(tab => {
        tab.classList.remove("active");
    });
    const targetTab = document.getElementById(`tab-${tabKey}`);
    if (targetTab) targetTab.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Notifications Dropdown
function initNotifDropdown() {
    document.addEventListener("click", (e) => {
        const notifWrapper = document.getElementById("notifWrapper");
        const notifDropdown = document.getElementById("notifDropdown");
        if (notifWrapper && notifDropdown && !notifWrapper.contains(e.target)) {
            notifDropdown.classList.remove("active");
        }
    });
}

function toggleNotifDropdown() {
    const dropdown = document.getElementById("notifDropdown");
    if (dropdown) dropdown.classList.toggle("active");
}

function renderNotifications() {
    const list = document.getElementById("notifList");
    const badge = document.getElementById("notifBadge");
    const countText = document.getElementById("notifCountText");
    if (!list) return;

    list.innerHTML = "";
    const notifications = hostelDb.notifications || [];
    const pendingStudents = hostelDb.students.filter(s => s.approvalStatus === "Pending");
    const unreadCount = pendingStudents.length;

    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? "flex" : "none";
    }
    if (countText) {
        countText.textContent = `${unreadCount} Action Pending`;
    }

    if (notifications.length === 0 && pendingStudents.length === 0) {
        list.innerHTML = `<div style="padding:20px; text-align:center; color:#94a3b8; font-size:12.5px;">No new alerts at this time.</div>`;
        return;
    }

    // List notifications
    notifications.forEach(n => {
        const item = document.createElement("div");
        item.className = `notif-item ${n.isRead ? '' : 'unread'}`;
        item.onclick = () => {
            switchSidebarTab("approvals");
            toggleNotifDropdown();
        };
        item.innerHTML = `
            <div class="notif-item-title"><i class="fas fa-bell text-primary"></i> ${n.title}</div>
            <p class="notif-item-msg">${n.message}</p>
            <span class="notif-item-time">${n.time}</span>
        `;
        list.appendChild(item);
    });
}

// 1. Render Overview
function renderOverview() {
    let totalCollected = 0;
    let totalRemaining = 0;
    let paidCount = 0;
    let dueCount = 0;

    // Only count approved residents in official stats
    const approvedList = hostelDb.students.filter(s => s.approvalStatus !== "Rejected");
    const pendingList = hostelDb.students.filter(s => s.approvalStatus === "Pending");

    approvedList.forEach(s => {
        totalCollected += (s.paidAmount || 0);
        totalRemaining += (s.remainingDue || 0);
        if ((s.remainingDue || 0) > 0) {
            dueCount++;
        } else {
            paidCount++;
        }
    });

    const totalResidents = approvedList.length;
    const availableBeds = Math.max(0, 150 - totalResidents);

    // KPI Numbers
    document.getElementById("kpiTotalStudents").textContent = totalResidents;
    document.getElementById("kpiAvailableBeds").textContent = availableBeds;
    document.getElementById("kpiTotalCollected").textContent = `৳${totalCollected.toLocaleString()}`;
    document.getElementById("kpiTotalRemaining").textContent = `৳${totalRemaining.toLocaleString()}`;

    // Progress Bar
    const grandTotal = totalCollected + totalRemaining;
    const pctCollected = grandTotal > 0 ? Math.round((totalCollected / grandTotal) * 100) : 100;
    const pctDue = 100 - pctCollected;

    document.getElementById("progCollectedText").textContent = `৳${totalCollected.toLocaleString()} (${pctCollected}%)`;
    document.getElementById("progBarCollected").style.width = `${pctCollected}%`;
    document.getElementById("progBarDue").style.width = `${pctDue}%`;

    document.getElementById("paidStudentsCount").textContent = `${paidCount} Tenants`;
    document.getElementById("dueStudentsCount").textContent = `${dueCount} Tenants Overdue`;
    if (document.getElementById("smsOverdueCount")) {
        document.getElementById("smsOverdueCount").textContent = dueCount;
    }

    // Pending Approvals Banner Logic
    const approvalBanner = document.getElementById("approvalNoticeBanner");
    const sidebarCount = document.getElementById("sidebarApprovalCount");
    const pendingTabBadge = document.getElementById("pendingTabCountBadge");

    if (sidebarCount) sidebarCount.textContent = pendingList.length;
    if (pendingTabBadge) pendingTabBadge.textContent = pendingList.length;

    if (pendingList.length > 0) {
        if (approvalBanner) approvalBanner.style.display = "flex";
        const firstP = pendingList[0];
        const snippetEl = document.getElementById("approvalBannerSnippet");
        if (snippetEl) {
            snippetEl.innerHTML = `<strong>${firstP.name}</strong> applied for <strong>${firstP.roomNo} (${firstP.bedNo})</strong> with ৳${(firstP.paidAmount || 0).toLocaleString()} paid via ${firstP.paymentMethod || 'bKash'}. Review documents & confirm allocation.`;
        }
    } else {
        if (approvalBanner) approvalBanner.style.display = "none";
    }

    // Recent Students in Overview
    const recentBody = document.getElementById("recentStudentsTableBody");
    if (recentBody) {
        recentBody.innerHTML = "";
        approvedList.slice(0, 6).forEach(st => {
            const hasDue = (st.remainingDue || 0) > 0;
            const isPending = st.approvalStatus === "Pending";
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <span class="tbl-name">${st.name}</span><br>
                    <span class="tbl-id">${st.id}</span>
                </td>
                <td><strong>${st.roomNo || 'Room 101'}</strong> (${st.bedNo || 'Bed A'})</td>
                <td>${st.phone || 'N/A'}</td>
                <td><strong class="text-primary">${st.guardianPhone || 'N/A'}</strong></td>
                <td>৳${(st.monthlyRent || 0).toLocaleString()}</td>
                <td class="text-green"><strong>৳${(st.paidAmount || 0).toLocaleString()}</strong></td>
                <td class="${hasDue ? 'text-red' : 'text-green'}"><strong>৳${(st.remainingDue || 0).toLocaleString()}</strong></td>
                <td>
                    ${isPending 
                        ? `<span class="badge-due">● Awaiting Approval</span>` 
                        : `<span class="status-badge ${hasDue ? 'due' : 'paid'}">${hasDue ? '● Unpaid (Past 10th)' : '✓ Fully Paid'}</span>`
                    }
                </td>
                <td>
                    <div style="display:flex; gap:6px;">
                        <button class="btn-tbl-action" onclick="viewStudentDetails('${st.id}')"><i class="fas fa-eye"></i> Details</button>
                        ${hasDue && !isPending ? `<button class="btn-tbl-action sms-btn" onclick="sendIndividualSms('${st.id}')"><i class="fas fa-sms"></i> SMS</button>` : ''}
                    </div>
                </td>
            `;
            recentBody.appendChild(tr);
        });
    }
}

// 2. Render Pending Approvals Table
function renderPendingApprovals() {
    const tbody = document.getElementById("pendingApprovalsTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    const pendingList = hostelDb.students.filter(s => s.approvalStatus === "Pending");

    if (pendingList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center; padding:35px 20px; color:#10b981;">
                    <i class="fas fa-check-circle" style="font-size:24px; margin-bottom:8px; display:block;"></i>
                    <strong>All Online Rent Bookings are Approved! No pending applications in queue.</strong>
                </td>
            </tr>
        `;
        return;
    }

    pendingList.forEach(st => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <span class="tbl-name">${st.name}</span><br>
                <span class="tbl-id">${st.id} • ${st.gender || 'Male'}</span>
            </td>
            <td>
                <span class="text-primary"><strong>${st.roomNo}</strong></span><br>
                <small>${st.bedNo} (${st.roomTypeName || st.roomType})</small>
            </td>
            <td>
                <strong>${st.institute || 'University'}</strong><br>
                <small class="text-muted">${st.department || ''}</small>
            </td>
            <td>
                <span>Student: ${st.phone}</span><br>
                <small class="text-muted">Parent: <strong>${st.guardianPhone}</strong></small>
            </td>
            <td>
                <strong class="text-green">৳${(st.paidAmount || 0).toLocaleString()}</strong><br>
                <small class="text-muted">${st.paymentMethod || 'bKash'} (${st.trxId || 'N/A'})</small>
            </td>
            <td>${st.bookingDate || 'Just now'}</td>
            <td>
                <span class="badge-due"><i class="fas fa-hourglass-half"></i> Awaiting Verification</span>
            </td>
            <td>
                <div style="display:flex; gap:6px; align-items:center;">
                    <button class="btn-approve" onclick="approveResident('${st.id}')" title="Approve and confirm bed allocation">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn-reject" onclick="rejectResident('${st.id}')" title="Decline application">
                        <i class="fas fa-times"></i> Reject
                    </button>
                    <button class="btn-tbl-action" onclick="viewStudentDetails('${st.id}')" title="View submitted form">
                        <i class="fas fa-file-alt"></i> Form
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Approve Resident Action
function approveResident(studentId) {
    const student = hostelDb.students.find(s => s.id === studentId);
    if (!student) return;

    if (confirm(`Approve admission for ${student.name} for ${student.roomNo} (${student.bedNo})?\nPayment of ৳${student.paidAmount.toLocaleString()} will be officially booked.`)) {
        if (typeof approveStudentBooking === "function") {
            approveStudentBooking(studentId);
        } else {
            student.approvalStatus = "Approved";
            saveHostelData(hostelDb);
        }

        loadDatabase();
        refreshAllViews();
        showToast("Tenant Admission Approved", `${student.name} is now an Active Resident in ${student.roomNo} (${student.bedNo}).`);
    }
}

// Reject Resident Action
function rejectResident(studentId) {
    const student = hostelDb.students.find(s => s.id === studentId);
    if (!student) return;

    const reason = prompt(`Enter reason for declining admission for ${student.name}:`, "Incomplete documentation or unverified transaction ID.");
    if (reason !== null) {
        if (typeof rejectStudentBooking === "function") {
            rejectStudentBooking(studentId, reason);
        } else {
            student.approvalStatus = "Rejected";
            saveHostelData(hostelDb);
        }

        loadDatabase();
        refreshAllViews();
        alert(`Application for ${student.name} has been declined.`);
    }
}

// 3. Render Residents & Rent Registry
function renderResidentsTable() {
    const tbody = document.getElementById("allStudentsTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    const approvedList = hostelDb.students.filter(s => s.approvalStatus !== "Rejected");

    approvedList.forEach(st => {
        const hasDue = (st.remainingDue || 0) > 0;
        const isPending = st.approvalStatus === "Pending";
        const tr = document.createElement("tr");
        tr.setAttribute("data-id", st.id);
        tr.setAttribute("data-name", (st.name || "").toLowerCase());
        tr.setAttribute("data-phone", st.phone || "");
        tr.setAttribute("data-guardian", st.guardianPhone || "");
        tr.setAttribute("data-room", (st.roomNo || "").toLowerCase());
        tr.setAttribute("data-roomtype", st.roomType || "single");
        tr.setAttribute("data-status", isPending ? "Pending" : (hasDue ? "Due" : "Paid"));

        tr.innerHTML = `
            <td>
                <span class="tbl-name">${st.name}</span><br>
                <span class="tbl-id">${st.id} • ${st.gender || 'Male'}</span>
            </td>
            <td>
                <span>F: ${st.father || 'N/A'}</span><br>
                <small class="text-muted">Parent: <strong>${st.guardianPhone || 'N/A'}</strong></small>
            </td>
            <td>
                <strong>${st.institute || 'University'}</strong><br>
                <small class="text-muted">${st.department || ''}</small>
            </td>
            <td>
                <strong>${st.roomNo}</strong><br>
                <small class="text-muted">${st.bedNo}</small>
            </td>
            <td>${st.phone}</td>
            <td>৳${(st.monthlyRent || 0).toLocaleString()}</td>
            <td class="text-green">৳${(st.paidAmount || 0).toLocaleString()}</td>
            <td class="${hasDue ? 'text-red' : 'text-green'}"><strong>৳${(st.remainingDue || 0).toLocaleString()}</strong></td>
            <td>
                ${isPending 
                    ? `<span class="badge-due">● Awaiting Approval</span>` 
                    : `<span class="status-badge ${hasDue ? 'due' : 'paid'}">${hasDue ? '● Overdue (Past 10th)' : '✓ Paid'}</span>`
                }
            </td>
            <td>
                <div style="display:flex; gap:6px;">
                    ${isPending 
                        ? `<button class="btn-approve" onclick="approveResident('${st.id}')"><i class="fas fa-check"></i> Approve</button>`
                        : `<button class="btn-tbl-action" onclick="viewStudentDetails('${st.id}')"><i class="fas fa-id-card"></i> Profile</button>
                           ${hasDue ? `<button class="btn-tbl-action sms-btn" onclick="sendIndividualSms('${st.id}')"><i class="fas fa-sms"></i> SMS</button>` : ''}
                           ${hasDue ? `<button class="btn-tbl-action collect-btn" onclick="collectRent('${st.id}')"><i class="fas fa-check"></i> Collect</button>` : ''}`
                    }
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterStudentsTable() {
    const query = (document.getElementById("studentSearchInput").value || "").toLowerCase().trim();
    const roomType = document.getElementById("filterRoomType").value;
    const payStatus = document.getElementById("filterPaymentStatus").value;

    const rows = document.querySelectorAll("#allStudentsTableBody tr");
    rows.forEach(row => {
        const name = row.getAttribute("data-name");
        const phone = row.getAttribute("data-phone");
        const guard = row.getAttribute("data-guardian");
        const room = row.getAttribute("data-room");
        const rType = row.getAttribute("data-roomtype");
        const pStat = row.getAttribute("data-status");

        const matchesQuery = !query || name.includes(query) || phone.includes(query) || guard.includes(query) || room.includes(query);
        const matchesRoom = roomType === "all" || rType === roomType;
        const matchesPay = payStatus === "all" || pStat === payStatus;

        row.style.display = (matchesQuery && matchesRoom && matchesPay) ? "" : "none";
    });
}

// 4. Render Payment Ledger
function renderPaymentLedger() {
    let totalPaid = 0;
    let totalDue = 0;

    const approvedList = hostelDb.students.filter(s => s.approvalStatus !== "Rejected");

    approvedList.forEach(s => {
        totalPaid += (s.paidAmount || 0);
        totalDue += (s.remainingDue || 0);
    });

    document.getElementById("ledgerCollected").textContent = `৳${totalPaid.toLocaleString()}`;
    document.getElementById("ledgerRemaining").textContent = `৳${totalDue.toLocaleString()}`;
    document.getElementById("ledgerInvoicesCount").textContent = approvedList.length;

    const tbody = document.getElementById("paymentLedgerTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    approvedList.forEach(st => {
        const hasDue = (st.remainingDue || 0) > 0;
        const tr = document.createElement("tr");
        tr.setAttribute("data-status", hasDue ? "due" : "paid");

        tr.innerHTML = `
            <td>
                <span class="tbl-name">${st.name}</span><br>
                <span class="tbl-id">${st.id}</span>
            </td>
            <td><strong>${st.roomNo}</strong> (${st.bedNo})</td>
            <td class="text-green"><strong>৳${(st.paidAmount || 0).toLocaleString()}</strong></td>
            <td class="${hasDue ? 'text-red' : 'text-green'}"><strong>৳${(st.remainingDue || 0).toLocaleString()}</strong></td>
            <td>${st.paymentMethod || 'bKash'} — <small class="text-muted">${st.trxId || 'N/A'}</small></td>
            <td>${st.bookingDate || '2026-11-01'}</td>
            <td>
                <span class="status-badge ${hasDue ? 'due' : 'paid'}">
                    ${hasDue ? 'Overdue Due' : 'Paid & Cleared'}
                </span>
            </td>
            <td>
                ${hasDue 
                    ? `<button class="btn-tbl-action sms-btn" onclick="sendIndividualSms('${st.id}')"><i class="fas fa-sms"></i> Alert Parent & Student</button>`
                    : `<button class="btn-tbl-action" onclick="alert('Viewing payment voucher for ${st.name}...')"><i class="fas fa-receipt"></i> Voucher</button>`
                }
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterPaymentLedger(filter) {
    document.querySelectorAll(".btn-group .filter-tab-btn").forEach(b => b.classList.remove("active"));
    event.target.classList.add("active");

    const rows = document.querySelectorAll("#paymentLedgerTableBody tr");
    rows.forEach(r => {
        const stat = r.getAttribute("data-status");
        if (filter === "all" || stat === filter) {
            r.style.display = "";
        } else {
            r.style.display = "none";
        }
    });
}

// 5. Render Auto-SMS Table
function renderAutoSmsTable() {
    const tbody = document.getElementById("smsDefaultersTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    const dueList = hostelDb.students.filter(s => (s.remainingDue || 0) > 0 && s.approvalStatus === "Approved");

    if (dueList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:#10b981;"><strong><i class="fas fa-check-circle"></i> Excellent! All tenants have cleared their rent. No overdue SMS required.</strong></td></tr>`;
        return;
    }

    dueList.forEach(st => {
        const isSent = smsSentMap[st.id] === true;
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <span class="tbl-name">${st.name}</span><br>
                <small class="text-muted">ID: ${st.id} • ${st.institute}</small>
            </td>
            <td><strong>${st.roomNo}</strong> (${st.bedNo})</td>
            <td class="text-red"><strong>৳${st.remainingDue.toLocaleString()}</strong></td>
            <td><i class="fas fa-mobile-alt text-muted"></i> ${st.phone}</td>
            <td><i class="fas fa-user-friends text-primary"></i> <strong>${st.guardianPhone}</strong> (${st.father})</td>
            <td>
                <span class="status-badge ${isSent ? 'sms-sent' : 'due'}" id="smsStatusBadge_${st.id}">
                    ${isSent ? '✓ Sent to Both' : '🚨 Overdue (Pending SMS)'}
                </span>
            </td>
            <td>
                <button class="btn-tbl-action sms-btn" onclick="sendIndividualSms('${st.id}')">
                    <i class="fas fa-paper-plane"></i> ${isSent ? 'Resend SMS' : 'Send Dual SMS'}
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function sendIndividualSms(studentId) {
    const st = hostelDb.students.find(s => s.id === studentId);
    if (!st) return;

    const modalBody = document.getElementById("smsModalBody");
    const studentSmsText = `[The Elite Nest Residence] Dear ${st.name}, your hostel rent of ৳${st.remainingDue.toLocaleString()} for this month was due on the 10th. Please clear your payment immediately to avoid late disciplinary action.`;
    const parentSmsText = `শ্রদ্ধেয় অভিভাবক, দ্য এলিট নেস্ট স্টুডেন্ট রেসিডেন্সে আপনার সন্তান ${st.name} (রুম: ${st.roomNo})-এর চলতি মাসের হোস্টেল ফি ৳${st.remainingDue.toLocaleString()} ১০ তারিখের মধ্যে পরিশোধের তারিখ পার হয়েছে। অনুগ্রহ করে বকেয়া পরিশোধ করার জন্য বিনীত অনুরোধ করা হলো। - কর্তৃপক্ষ`;

    modalBody.innerHTML = `
        <div class="sms-dispatch-view">
            <div style="background:#eff6ff; border:1px solid #bfdbfe; padding:12px 16px; border-radius:8px; font-size:13px; color:#1e40af;">
                <i class="fas fa-info-circle"></i> <strong>Automatic 10th Date Trigger:</strong> A dual SMS will be dispatched simultaneously to both the resident and their parent/guardian.
            </div>

            <!-- Recipient 1: Student -->
            <div class="sms-target-card student-sms">
                <div class="sms-target-header">
                    <strong>1. Student Recipient: ${st.name}</strong>
                    <span>Mobile: <strong>${st.phone}</strong></span>
                </div>
                <div class="sms-bubble-text">${studentSmsText}</div>
                <div class="sms-status-tag"><i class="fas fa-check-circle"></i> Ready to send via Gateway</div>
            </div>

            <!-- Recipient 2: Parent -->
            <div class="sms-target-card parent-sms">
                <div class="sms-target-header">
                    <strong>2. Parent/Guardian: ${st.father || 'Parent'}</strong>
                    <span>Mobile: <strong>${st.guardianPhone}</strong></span>
                </div>
                <div class="sms-bubble-text" style="font-family:'Noto Sans Bengali', sans-serif;">${parentSmsText}</div>
                <div class="sms-status-tag"><i class="fas fa-check-circle"></i> Ready to send via Gateway</div>
            </div>

            <button type="button" class="btn-sms-trigger full-width" id="btnDispatchConfirm" onclick="executeSmsSend('${st.id}')">
                <i class="fas fa-paper-plane"></i> Confirm & Send SMS to Both Now
            </button>
        </div>
    `;

    document.getElementById("smsDispatchModal").classList.add("active");
}

function executeSmsSend(studentId) {
    const btn = document.getElementById("btnDispatchConfirm");
    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Dispatching via SMS Gateway...`;

    setTimeout(() => {
        btn.innerHTML = `<i class="fas fa-check-double"></i> Delivered Successfully to Student & Guardian!`;
        btn.style.background = "#10b981";

        smsSentMap[studentId] = true;
        const badge = document.getElementById(`smsStatusBadge_${studentId}`);
        if (badge) {
            badge.className = "status-badge sms-sent";
            badge.textContent = "✓ Sent to Both";
        }

        setTimeout(() => {
            closeSmsModal();
            renderAutoSmsTable();
        }, 1000);
    }, 1200);
}

function triggerBatchAutoSMS() {
    const dueList = hostelDb.students.filter(s => (s.remainingDue || 0) > 0 && s.approvalStatus === "Approved");
    if (dueList.length === 0) {
        alert("All tenants have paid! There are no overdue bills past the 10th.");
        return;
    }

    if (confirm(`Send automated overdue SMS to all ${dueList.length} defaulters AND their ${dueList.length} parents? (Total ${dueList.length * 2} SMS)`)) {
        dueList.forEach(st => {
            smsSentMap[st.id] = true;
        });
        renderAutoSmsTable();
        alert(`✓ Success! Auto-SMS successfully dispatched to ${dueList.length} Students and ${dueList.length} Parents via SMS Gateway.`);
    }
}

function closeSmsModal() {
    document.getElementById("smsDispatchModal").classList.remove("active");
}

// 6. Render Room Matrix
function renderRoomMatrix() {
    const container = document.getElementById("roomFloorsContainer");
    if (!container) return;
    container.innerHTML = "";

    const floors = [
        { floor: 1, title: "1st Floor — Single Deluxe Residence" },
        { floor: 2, title: "2nd Floor — Double Sharing Residence" },
        { floor: 3, title: "3rd Floor — Triple & Quad Residence" }
    ];

    floors.forEach(fl => {
        const flRooms = hostelDb.rooms.filter(r => r.floor === fl.floor);
        const floorBox = document.createElement("div");
        floorBox.className = "floor-box";

        let roomsHtml = `<div class="floor-title"><i class="fas fa-building text-primary"></i> ${fl.title}</div><div class="rooms-matrix-grid">`;

        flRooms.forEach(rm => {
            roomsHtml += `
                <div class="matrix-room-card">
                    <div class="m-room-head">
                        <span>Room ${rm.id}</span>
                        <small class="text-primary">৳${rm.rent.toLocaleString()}/m</small>
                    </div>
                    <div class="m-bed-list">
            `;

            rm.beds.forEach(bd => {
                const isOccupied = bd.status === "occupied";
                let studentName = "Vacant (Available)";
                if (isOccupied && bd.studentId) {
                    const found = hostelDb.students.find(s => s.id === bd.studentId);
                    if (found) studentName = found.name;
                    else studentName = "Occupied";
                }

                roomsHtml += `
                    <div class="m-bed-item ${isOccupied ? 'occupied' : 'available'}" title="${isOccupied ? 'Occupied by ' + studentName : 'Available for Admission'}">
                        <span><i class="fas fa-bed"></i> ${bd.bed}</span>
                        <strong>${studentName}</strong>
                    </div>
                `;
            });

            roomsHtml += `</div></div>`;
        });

        roomsHtml += `</div>`;
        floorBox.innerHTML = roomsHtml;
        container.appendChild(floorBox);
    });
}

// 7. View Resident Profile Modal
function viewStudentDetails(studentId) {
    const student = hostelDb.students.find(s => s.id === studentId);
    if (!student) return;

    const modalBody = document.getElementById("modalStudentBody");
    const hasDue = (student.remainingDue || 0) > 0;
    const isPending = student.approvalStatus === "Pending";

    modalBody.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:14px; margin-bottom:16px;">
            <div>
                <h2 style="margin:0 0 4px; color:#0f172a; font-size:20px;">${student.name}</h2>
                <div style="color:#64748b; font-size:13px;">ID: <strong>${student.id}</strong> • ${student.institute} (${student.department})</div>
            </div>
            ${isPending 
                ? `<span class="badge-due">● Awaiting Admin Approval</span>` 
                : `<span class="status-badge ${hasDue ? 'due' : 'paid'}">${hasDue ? '● Overdue Past 10th' : '✓ Fully Paid'}</span>`
            }
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; font-size:13.5px;">
            <div><small style="color:#64748b; font-size:11px; text-transform:uppercase;">Allocated Room & Bed</small><br><strong>${student.roomNo} (${student.bedNo})</strong></div>
            <div><small style="color:#64748b; font-size:11px; text-transform:uppercase;">Room Type</small><br><strong>${student.roomTypeName || student.roomType}</strong></div>
            <div><small style="color:#64748b; font-size:11px; text-transform:uppercase;">Father's Name</small><br><strong>${student.father || 'N/A'}</strong></div>
            <div><small style="color:#64748b; font-size:11px; text-transform:uppercase;">Mother's Name</small><br><strong>${student.mother || 'N/A'}</strong></div>
            <div><small style="color:#64748b; font-size:11px; text-transform:uppercase;">Student Mobile</small><br><strong>${student.phone}</strong></div>
            <div><small style="color:#64748b; font-size:11px; text-transform:uppercase;">Parent / Guardian Mobile</small><br><strong class="text-primary">${student.guardianPhone}</strong></div>
            <div><small style="color:#64748b; font-size:11px; text-transform:uppercase;">Permanent Address</small><br><strong>${student.permanentAddress || 'N/A'}</strong></div>
            <div><small style="color:#64748b; font-size:11px; text-transform:uppercase;">Monthly Rent</small><br><strong>৳${(student.monthlyRent || 0).toLocaleString()}</strong></div>
            <div><small style="color:#64748b; font-size:11px; text-transform:uppercase;">Total Paid</small><br><strong class="text-green">৳${(student.paidAmount || 0).toLocaleString()}</strong></div>
            <div><small style="color:#64748b; font-size:11px; text-transform:uppercase;">Payment Method & TrxID</small><br><strong>${student.paymentMethod || 'bKash'} (${student.trxId || 'N/A'})</strong></div>
        </div>

        ${isPending ? `
            <div style="margin-top:20px; padding:12px; background:#eff6ff; border-radius:8px; display:flex; justify-content:flex-end; gap:10px;">
                <button class="btn-approve" onclick="approveResident('${student.id}'); closeStudentModal();"><i class="fas fa-check"></i> Approve Application</button>
                <button class="btn-reject" onclick="rejectResident('${student.id}'); closeStudentModal();"><i class="fas fa-times"></i> Reject</button>
            </div>
        ` : ''}
    `;

    document.getElementById("studentDetailModal").classList.add("active");
}

function closeStudentModal() {
    document.getElementById("studentDetailModal").classList.remove("active");
}

function collectRent(studentId) {
    const student = hostelDb.students.find(s => s.id === studentId);
    if (!student) return;

    if (confirm(`Confirm collection of remaining due ৳${student.remainingDue.toLocaleString()} from ${student.name}?`)) {
        student.paidAmount += student.remainingDue;
        student.remainingDue = 0;
        student.paymentStatus = "Paid";

        saveHostelData(hostelDb);
        loadDatabase();
        refreshAllViews();
        alert(`Payment of ৳${student.paidAmount.toLocaleString()} collected & cleared successfully!`);
    }
}

// Toast Notification
function showToast(title, message) {
    const toast = document.getElementById("panelToast");
    const tTitle = document.getElementById("toastTitle");
    const tMsg = document.getElementById("toastMessage");

    if (toast && tTitle && tMsg) {
        tTitle.textContent = title;
        tMsg.textContent = message;
        toast.classList.add("active");

        setTimeout(() => {
            closeToast();
        }, 6000);
    }
}

function closeToast() {
    const toast = document.getElementById("panelToast");
    if (toast) toast.classList.remove("active");
}

function checkNewApplicantToast() {
    const pendingList = hostelDb.students.filter(s => s.approvalStatus === "Pending");
    if (pendingList.length > 0) {
        setTimeout(() => {
            const first = pendingList[0];
            showToast("New Rent Booking Awaiting Approval", `${first.name} applied for ${first.roomNo} (${first.bedNo}) with ৳${(first.paidAmount || 0).toLocaleString()} paid.`);
        }, 800);
    }
}

function resetDemoData() {
    if (confirm("Reset demo database back to default initial state?")) {
        localStorage.removeItem("elitenest_hostel_db");
        location.reload();
    }
}
