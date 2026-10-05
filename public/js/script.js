(() => {
  'use strict';

  // Bootstrap form validation
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });

  // Category navigation interactions & active states
  document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const activeCategory = urlParams.get('category');
    const categoryLinks = document.querySelectorAll('.category-item');
    const categoryContainer = document.getElementById('categoryFilters');
    const scrollLeftBtn = document.getElementById('scrollLeftBtn');
    const scrollRightBtn = document.getElementById('scrollRightBtn');
    const taxSwitch = document.getElementById('taxSwitch');
    const listingsGrid = document.querySelector('.listings-grid');

    // Set active category tab
    if (categoryLinks.length > 0) {
      categoryLinks.forEach(link => {
        const cat = link.getAttribute('data-category');
        if (activeCategory) {
          if (cat && cat.toLowerCase() === activeCategory.toLowerCase()) {
            link.classList.add('active');
            // Scroll active item into view
            link.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          } else {
            link.classList.remove('active');
          }
        } else if (cat === 'all') {
          link.classList.add('active');
        }
      });
    }

    // Category horizontal scrolling buttons
    if (categoryContainer && scrollLeftBtn && scrollRightBtn) {
      scrollLeftBtn.addEventListener('click', () => {
        categoryContainer.scrollBy({ left: -240, behavior: 'smooth' });
      });

      scrollRightBtn.addEventListener('click', () => {
        categoryContainer.scrollBy({ left: 240, behavior: 'smooth' });
      });
    }

    // Taxes display toggle
    if (taxSwitch && listingsGrid) {
      taxSwitch.addEventListener('change', () => {
        if (taxSwitch.checked) {
          listingsGrid.classList.add('show-tax');
        } else {
          listingsGrid.classList.remove('show-tax');
        }
      });
    }

    // Persistent Favorite Heart Button
    const savedFavorites = JSON.parse(localStorage.getItem('wanderlust_favorites') || '[]');

    // Initialize saved favorites
    document.querySelectorAll('.favorite-btn').forEach(btn => {
      const listingId = btn.getAttribute('data-id');
      if (listingId && savedFavorites.includes(listingId)) {
        btn.classList.add('active');
      }

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        btn.classList.toggle('active');
        
        if (listingId) {
          let currentFavorites = JSON.parse(localStorage.getItem('wanderlust_favorites') || '[]');
          if (btn.classList.contains('active')) {
            if (!currentFavorites.includes(listingId)) {
              currentFavorites.push(listingId);
            }
          } else {
            currentFavorites = currentFavorites.filter(id => id !== listingId);
          }
          localStorage.setItem('wanderlust_favorites', JSON.stringify(currentFavorites));
        }
      });
    });

    // 3-Section Search Bar Popovers — Guest (Who) only
    // NOTE: Date (When) popover is fully handled by /js/navbar.js
    const segmentWho = document.getElementById('searchSegmentWho');
    const datePopover = document.getElementById('datePopover');
    const guestPopover = document.getElementById('guestPopover');
    const closeGuestBtn = document.getElementById('closeGuestPopover');
    const applyGuestsBtn = document.getElementById('applyGuestsBtn');
    const selectedGuestText = document.getElementById('selectedGuestText');

    // Guest counter elements
    const adultMinus = document.getElementById('adultMinus');
    const adultPlus = document.getElementById('adultPlus');
    const adultCountSpan = document.getElementById('adultCount');
    const childMinus = document.getElementById('childMinus');
    const childPlus = document.getElementById('childPlus');
    const childCountSpan = document.getElementById('childCount');

    let adultCount = 1;
    let childCount = 0;

    // Toggle Guest Popover
    if (segmentWho && guestPopover) {
      segmentWho.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = guestPopover.classList.contains('show');
        if (datePopover) datePopover.classList.remove('show');
        guestPopover.classList.toggle('show', !isOpen);
      });
    }

    // Close guest popover button
    if (closeGuestBtn && guestPopover) {
      closeGuestBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        guestPopover.classList.remove('show');
      });
    }

    // Close when clicking outside — only handle guest popover here
    document.addEventListener('click', (e) => {
      if (guestPopover && segmentWho &&
          !guestPopover.contains(e.target) &&
          !segmentWho.contains(e.target)) {
        guestPopover.classList.remove('show');
      }
    });

    // Guest Counter Logic
    if (adultPlus && adultMinus && adultCountSpan) {
      adultPlus.addEventListener('click', (e) => {
        e.stopPropagation();
        adultCount++;
        adultCountSpan.textContent = adultCount;
        adultMinus.disabled = adultCount <= 1;
      });

      adultMinus.addEventListener('click', (e) => {
        e.stopPropagation();
        if (adultCount > 1) {
          adultCount--;
          adultCountSpan.textContent = adultCount;
          adultMinus.disabled = adultCount <= 1;
        }
      });
    }

    if (childPlus && childMinus && childCountSpan) {
      childPlus.addEventListener('click', (e) => {
        e.stopPropagation();
        childCount++;
        childCountSpan.textContent = childCount;
        childMinus.disabled = childCount <= 0;
      });

      childMinus.addEventListener('click', (e) => {
        e.stopPropagation();
        if (childCount > 0) {
          childCount--;
          childCountSpan.textContent = childCount;
          childMinus.disabled = childCount <= 0;
        }
      });
    }

    // Apply Guests
    if (applyGuestsBtn && selectedGuestText) {
      applyGuestsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const total = adultCount + childCount;
        selectedGuestText.textContent = total === 1 ? '1 guest' : `${total} guests`;
        selectedGuestText.classList.add('fw-semibold', 'text-dark');
        guestPopover.classList.remove('show');
      });
    }

    // Prevent guest popover clicks from bubbling to document
    if (guestPopover) {
      guestPopover.addEventListener('click', (e) => e.stopPropagation());
    }

  });
})();

