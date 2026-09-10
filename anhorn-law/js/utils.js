/**
 * Utility Library
 * Reusable helper functions for UI operations, DOM manipulation, and performance.
 */

(function () {
  'use strict';

  /**
   * Limits the execution frequency of a function to optimize rapid events (resize, scroll).
   * @param {Function} func - Function to execute
   * @param {number} wait - Debounce delay in milliseconds
   * @param {boolean} [immediate=false] - Trigger on the leading edge instead of trailing
   * @returns {Function}
   */
  function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const context = this;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  /**
   * Ensures a function runs at most once in a specified time frame (scroll events).
   * @param {Function} func - Function to execute
   * @param {number} limit - Throttle limit in milliseconds
   * @returns {Function}
   */
  function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  /**
   * Selects a single DOM element.
   * @param {string} selector - CSS selector
   * @param {Element|Document} [scope=document] - Parent element scope
   * @returns {Element|null}
   */
  function $(selector, scope = document) {
    return scope.querySelector(selector);
  }

  /**
   * Selects all matching DOM elements as a clean Array.
   * @param {string} selector - CSS selector
   * @param {Element|Document} [scope=document] - Parent element scope
   * @returns {Element[]}
   */
  function $$(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
  }

  /**
   * Attaches an event listener to an element or delegates to matching children.
   * @param {Element|Document} target - Element or parent to listen on
   * @param {string} eventType - Event name (e.g., 'click')
   * @param {string|Function} selectorOrHandler - Delegated child selector or direct event handler
   * @param {Function} [handler] - Handler if selector delegation is used
   */
  function on(target, eventType, selectorOrHandler, handler) {
    if (typeof selectorOrHandler === 'function') {
      target.addEventListener(eventType, selectorOrHandler);
    } else {
      target.addEventListener(eventType, function (event) {
        const delegateTarget = event.target.closest(selectorOrHandler);
        if (delegateTarget && target.contains(delegateTarget)) {
          handler.call(delegateTarget, event, delegateTarget);
        }
      });
    }
  }

  /**
   * Formats a raw string into standard US Phone Number layout: (XXX) XXX-XXXX.
   * @param {string} input - Raw numeric or mixed text string
   * @returns {string} Formatted phone number
   */
  function formatPhoneNumber(input) {
    const cleaned = ('' + input).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return input;
  }

  /**
   * Standardized application console logger.
   */
  const Logger = {
    info: (msg, ...data) => console.log(`%c[INFO]%c ${msg}`, 'color: #2C4B6B; font-weight: bold;', '', ...data),
    warn: (msg, ...data) => console.warn(`%c[WARN]%c ${msg}`, 'color: #C5A880; font-weight: bold;', '', ...data),
    error: (msg, ...data) => console.error(`%c[ERROR]%c ${msg}`, 'color: #D9534F; font-weight: bold;', '', ...data)
  };

  // Public API
  window.Utils = {
    debounce,
    throttle,
    $,
    $$,
    on,
    formatPhoneNumber,
    Logger
  };
})();