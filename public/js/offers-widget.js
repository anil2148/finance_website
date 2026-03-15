/**
 * Dynamic Offers Widget
 * ---------------------
 * Fetches real-time bank offers from /offers.json, filters by category,
 * sorts by rating (highest first), and renders offer cards into a container.
 *
 * Usage:
 * 1) Add a container to your page:
 *    <div id="offers-container" data-offer-category="credit card"></div>
 *
 * 2) Include this script at the end of the page body (or with defer):
 *    <script src="/js/offers-widget.js" defer></script>
 */
(function () {
  'use strict';

  // Selector for the HTML element where offers should be rendered.
  var CONTAINER_SELECTOR = '#offers-container';
  // Endpoint that returns offer data. Can be changed if needed.
  var OFFERS_ENDPOINT = '/offers.json';

  /**
   * Safely escapes HTML to prevent accidental HTML/script injection.
   * @param {string} value
   * @returns {string}
   */
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Normalizes category labels so filtering is resilient to capitalization/spacing.
   * @param {string} category
   * @returns {string}
   */
  function normalizeCategory(category) {
    return String(category || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
  }

  /**
   * Renders a status message (loading, error, empty state) inside container.
   * @param {HTMLElement} container
   * @param {string} message
   * @param {'info'|'error'} type
   */
  function renderMessage(container, message, type) {
    var className = type === 'error' ? 'offers-message offers-message--error' : 'offers-message';
    container.innerHTML = '<p class="' + className + '">' + escapeHtml(message) + '</p>';
  }

  /**
   * Creates the HTML markup for one offer card.
   * @param {object} offer
   * @returns {string}
   */
  function createOfferCardMarkup(offer) {
    var prosText = Array.isArray(offer.pros) ? offer.pros.map(escapeHtml).join(', ') : 'N/A';
    var consText = Array.isArray(offer.cons) ? offer.cons.map(escapeHtml).join(', ') : 'N/A';

    return [
      '<article class="offer-card">',
      '  <div class="offer-card__header">',
      '    <h3 class="offer-card__bank">' + escapeHtml(offer.bank || 'Unknown Bank') + '</h3>',
      '    <span class="offer-card__rating">⭐ ' + escapeHtml(offer.rating != null ? offer.rating : 'N/A') + '</span>',
      '  </div>',
      '  <h4 class="offer-card__name">' + escapeHtml(offer.name || 'Unnamed Product') + '</h4>',
      '  <p class="offer-card__apr"><strong>APR/APY:</strong> ' + escapeHtml(offer.apr_apy || 'N/A') + '</p>',
      '  <p class="offer-card__pros"><strong>Pros:</strong> ' + prosText + '</p>',
      '  <p class="offer-card__cons"><strong>Cons:</strong> ' + consText + '</p>',
      '  <a class="offer-card__button" href="' + escapeHtml(offer.affiliate_url || '#') + '" target="_blank" rel="noopener noreferrer sponsored">View Offer</a>',
      '</article>'
    ].join('\n');
  }

  /**
   * Main function: fetch, filter, sort, render.
   */
  async function loadOffers() {
    var container = document.querySelector(CONTAINER_SELECTOR);

    // Stop early if the page does not include the expected container.
    if (!container) {
      return;
    }

    // Read page category from the container attribute, e.g. "credit card".
    var pageCategory = normalizeCategory(container.getAttribute('data-offer-category'));

    if (!pageCategory) {
      renderMessage(container, 'Missing data-offer-category on offers container.', 'error');
      return;
    }

    renderMessage(container, 'Loading offers...', 'info');

    try {
      var response = await fetch(OFFERS_ENDPOINT, { cache: 'no-store' });

      if (!response.ok) {
        throw new Error('HTTP ' + response.status + ' while fetching offers.');
      }

      var data = await response.json();
      // Supports either an array payload or { offers: [...] } shape.
      var allOffers = Array.isArray(data) ? data : (Array.isArray(data.offers) ? data.offers : []);

      var matchingOffers = allOffers
        .filter(function (offer) {
          return normalizeCategory(offer.category) === pageCategory;
        })
        .sort(function (a, b) {
          var ratingA = Number(a.rating) || 0;
          var ratingB = Number(b.rating) || 0;
          return ratingB - ratingA;
        });

      if (matchingOffers.length === 0) {
        renderMessage(container, 'No offers found for this category right now.', 'info');
        return;
      }

      container.innerHTML = matchingOffers.map(createOfferCardMarkup).join('\n');
    } catch (error) {
      console.error('Failed to load offers:', error);
      renderMessage(container, 'Unable to load offers at the moment. Please try again later.', 'error');
    }
  }

  // Run when DOM is ready.
  document.addEventListener('DOMContentLoaded', loadOffers);
})();
