/**
 * SANGI - Interactive Booking Fee & Service Estimator
 * Uses official SANGI parameters: Base Booking Fee = ₹30
 */

document.addEventListener('DOMContentLoaded', () => {
  initBookingEstimator();
});

function initBookingEstimator() {
  const serviceSelect = document.getElementById('calcServiceSelect');
  const urgencySelect = document.getElementById('calcUrgencySelect');
  const serviceEstimateLine = document.getElementById('calcServiceFee');
  const baseFeeLine = document.getElementById('calcBaseFee');
  const totalAmountLine = document.getElementById('calcTotalAmount');
  const summaryServiceLabel = document.getElementById('calcSummaryService');
  const bookEstimateBtn = document.getElementById('calcBookNowBtn');

  // Official ₹30 base platform fee from SANGI AppConstants
  const SANGI_BASE_FEE = 30;

  // Realistic average estimated labor and inspection rates
  const serviceRates = {
    'ac_repair': { label: 'AC Repair & Servicing', rate: 449 },
    'appliance_repair': { label: 'Appliance Repair', rate: 299 },
    'beauty_makeup': { label: 'Beauty & Salon at Home', rate: 499 },
    'caretaker': { label: 'Caretaker & Assistance', rate: 599 },
    'carpenter': { label: 'Carpentry & Woodwork', rate: 249 },
    'cctv': { label: 'CCTV Installation & Setup', rate: 499 },
    'cleaning': { label: 'Full Home Deep Cleaning', rate: 499 },
    'electrician': { label: 'Electrician Services', rate: 199 },
    'gardening': { label: 'Gardening & Plant Care', rate: 299 },
    'household': { label: 'General Household Chores', rate: 249 },
    'laundry': { label: 'Laundry & Ironing', rate: 149 },
    'moving': { label: 'Packers & Movers Logistics', rate: 999 },
    'painting': { label: 'House Painting & Touchup', rate: 699 },
    'party_decoration': { label: 'Party & Balloon Decoration', rate: 799 },
    'pest_control': { label: 'Pest & Bug Control', rate: 499 },
    'plumber': { label: 'Plumbing & Pipe Fixing', rate: 199 },
    'water_purifier': { label: 'Water Purifier RO Service', rate: 299 }
  };

  function updateEstimate() {
    const selectedKey = serviceSelect ? serviceSelect.value : 'electrician';
    const urgency = urgencySelect ? urgencySelect.value : 'normal';

    const info = serviceRates[selectedKey] || { label: 'Service', rate: 199 };
    let serviceCost = info.rate;

    // Small multiplier for immediate 60-min express dispatch
    if (urgency === 'express') {
      serviceCost = Math.round(serviceCost * 1.25);
    }

    const total = SANGI_BASE_FEE + serviceCost;

    if (summaryServiceLabel) summaryServiceLabel.textContent = info.label;
    if (serviceEstimateLine) serviceEstimateLine.textContent = `₹${serviceCost}`;
    if (baseFeeLine) baseFeeLine.textContent = `₹${SANGI_BASE_FEE}`;
    if (totalAmountLine) totalAmountLine.textContent = `₹${total}`;

    // Update book now button data
    if (bookEstimateBtn) {
      bookEstimateBtn.setAttribute('data-preset-service', selectedKey);
    }
  }

  if (serviceSelect) {
    serviceSelect.addEventListener('change', updateEstimate);
  }
  if (urgencySelect) {
    urgencySelect.addEventListener('change', updateEstimate);
  }

  // Initial calculation
  updateEstimate();

  if (bookEstimateBtn) {
    bookEstimateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = document.getElementById('bookingModal');
      const selectedService = serviceSelect ? serviceSelect.value : 'electrician';
      const modalServiceSelect = document.getElementById('bookingModalService');

      if (modalServiceSelect) {
        modalServiceSelect.value = selectedService;
      }

      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  }
}
