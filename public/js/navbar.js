console.log("WANDERLUST NAVBAR JS LOADED");

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // ELEMENT REFS
    // ==========================================

    const when         = document.getElementById("searchSegmentWhen");
    const datePopover  = document.getElementById("datePopover");
    const calendar1    = document.getElementById("calendarMonth1");
    const calendar2    = document.getElementById("calendarMonth2");
    const prevBtn      = document.getElementById("prevMonthBtn");
    const nextBtn      = document.getElementById("nextMonthBtn");
    const closeBtn     = document.getElementById("closeDatePopover");
    const clearBtn     = document.getElementById("clearDatesBtn");
    const applyBtn     = document.getElementById("applyDatesBtn");
    const selectedDateText = document.getElementById("selectedDateText");
    const summaryText  = document.getElementById("calSummaryText");

    if (!when || !datePopover || !calendar1 || !calendar2) {
        console.error("Wanderlust calendar: required elements not found", {
            when, datePopover, calendar1, calendar2
        });
        return;
    }

    // ==========================================
    // STATE
    // ==========================================

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    let checkIn  = null;
    let checkOut = null;

    const MONTHS   = ["January","February","March","April","May","June",
                      "July","August","September","October","November","December"];
    const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];


    // ==========================================
    // HELPERS
    // ==========================================

    function formatDate(date) {
        if (!date) return "";
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }

    function sameDate(a, b) {
        if (!a || !b) return false;
        return a.getFullYear() === b.getFullYear() &&
               a.getMonth()    === b.getMonth()    &&
               a.getDate()     === b.getDate();
    }

    function isBetween(date, start, end) {
        if (!start || !end) return false;
        return date > start && date < end;
    }


    // ==========================================
    // RENDER ONE MONTH
    // ==========================================

    function renderMonth(container, year, month) {
        container.innerHTML = "";

        // Title
        const title = document.createElement("div");
        title.className = "calendar-month-title";
        title.textContent = `${MONTHS[month]} ${year}`;
        container.appendChild(title);

        // Weekday headers
        const weekRow = document.createElement("div");
        weekRow.className = "calendar-weekdays";
        WEEKDAYS.forEach(d => {
            const el = document.createElement("div");
            el.className = "calendar-weekday";
            el.textContent = d;
            weekRow.appendChild(el);
        });
        container.appendChild(weekRow);

        // Day grid
        const grid = document.createElement("div");
        grid.className = "calendar-grid";

        const firstDay  = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();

        // Empty offset cells
        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement("div");
            empty.className = "calendar-empty";
            grid.appendChild(empty);
        }

        // Day buttons
        for (let day = 1; day <= totalDays; day++) {
            const date = new Date(year, month, day);
            date.setHours(0, 0, 0, 0);

            const btn = document.createElement("button");
            btn.type      = "button";
            btn.className = "calendar-day";
            btn.textContent = day;

            if (date < today) {
                btn.disabled = true;
                btn.classList.add("calendar-disabled");
            }

            if (sameDate(date, today))    btn.classList.add("calendar-today");
            if (sameDate(date, checkIn))  btn.classList.add("calendar-selected", "calendar-checkin");
            if (sameDate(date, checkOut)) btn.classList.add("calendar-selected", "calendar-checkout");
            if (isBetween(date, checkIn, checkOut)) btn.classList.add("calendar-range");

            btn.addEventListener("click", function () {
                if (!checkIn || checkOut) {
                    // First click — set check-in
                    checkIn  = new Date(date);
                    checkOut = null;
                } else {
                    // Second click — set check-out, swap if needed
                    if (date < checkIn) {
                        checkOut = new Date(checkIn);
                        checkIn  = new Date(date);
                    } else if (sameDate(date, checkIn)) {
                        // clicking same day resets
                        checkIn  = null;
                        checkOut = null;
                    } else {
                        checkOut = new Date(date);
                    }
                }
                updateSummary();
                renderCalendars();
            });

            grid.appendChild(btn);
        }

        container.appendChild(grid);
    }


    // ==========================================
    // RENDER BOTH MONTHS
    // ==========================================

    function renderCalendars() {
        const y1 = currentMonth.getFullYear();
        const m1 = currentMonth.getMonth();

        const next = new Date(y1, m1 + 1, 1);

        renderMonth(calendar1, y1, m1);
        renderMonth(calendar2, next.getFullYear(), next.getMonth());
    }


    // ==========================================
    // UPDATE FOOTER SUMMARY
    // ==========================================

    function updateSummary() {
        if (!summaryText) return;

        if (!checkIn) {
            summaryText.textContent = "Choose dates";
            return;
        }
        if (!checkOut) {
            summaryText.textContent = `${formatDate(checkIn)} – choose checkout`;
            return;
        }
        summaryText.textContent = `${formatDate(checkIn)} – ${formatDate(checkOut)}`;
    }


    // ==========================================
    // OPEN / CLOSE HELPERS
    // ==========================================

    function openDatePopover() {
        datePopover.classList.add("show");
        when.setAttribute("aria-expanded", "true");
        renderCalendars();
    }

    function closeDatePopover() {
        datePopover.classList.remove("show");
        when.setAttribute("aria-expanded", "false");
    }


    // ==========================================
    // WHEN SEGMENT CLICK — TOGGLE
    // ==========================================

    when.addEventListener("click", function (e) {
        e.stopPropagation();
        if (datePopover.classList.contains("show")) {
            closeDatePopover();
        } else {
            // Close guest popover if open
            const guestPopover = document.getElementById("guestPopover");
            if (guestPopover) guestPopover.classList.remove("show");
            openDatePopover();
        }
    });


    // ==========================================
    // CLOSE ON OUTSIDE CLICK
    // ==========================================

    document.addEventListener("click", function (e) {
        if (
            datePopover.classList.contains("show") &&
            !datePopover.contains(e.target) &&
            !when.contains(e.target)
        ) {
            closeDatePopover();
        }
    });

    // Prevent clicks inside the popover from bubbling to document
    datePopover.addEventListener("click", function (e) {
        e.stopPropagation();
    });


    // ==========================================
    // PREV / NEXT MONTH
    // ==========================================

    if (prevBtn) {
        prevBtn.addEventListener("click", function () {
            const prev    = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
            const minimum = new Date(today.getFullYear(), today.getMonth(), 1);
            if (prev >= minimum) {
                currentMonth = prev;
                renderCalendars();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", function () {
            currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
            renderCalendars();
        });
    }


    // ==========================================
    // CLOSE X BUTTON
    // ==========================================

    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            closeDatePopover();
        });
    }


    // ==========================================
    // CLEAR
    // ==========================================

    if (clearBtn) {
        clearBtn.addEventListener("click", function () {
            checkIn  = null;
            checkOut = null;
            if (selectedDateText) selectedDateText.textContent = "Add dates";
            updateSummary();
            renderCalendars();
        });
    }


    // ==========================================
    // APPLY
    // ==========================================

    if (applyBtn) {
        applyBtn.addEventListener("click", function () {
            if (!checkIn || !checkOut) {
                if (!checkIn) {
                    alert("Please select a check-in date.");
                } else {
                    alert("Please select a check-out date.");
                }
                return;
            }
            if (selectedDateText) {
                selectedDateText.textContent = `${formatDate(checkIn)} – ${formatDate(checkOut)}`;
                selectedDateText.classList.add("fw-semibold");
            }
            closeDatePopover();
        });
    }


    // ==========================================
    // INITIAL RENDER (so calendar is ready when popover opens)
    // ==========================================

    renderCalendars();
    updateSummary();
});