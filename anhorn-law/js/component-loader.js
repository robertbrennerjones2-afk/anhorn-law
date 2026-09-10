/**
 * Component Loader
 * Asynchronously fetches and injects HTML partials into designated DOM containers.
 * Usage: <div data-component="header"></div> or <div data-include="components/header.html"></div>
 */

(function () {
  'use strict';

  const COMPONENT_DIR = 'components';

  /**
   * Fetches an HTML fragment and injects it into a target DOM node.
   * @param {HTMLElement} element - Target container element
   * @param {string} filePath - Path to the HTML partial
   * @returns {Promise<HTMLElement>}
   */
  async function loadFragment(element, filePath) {
    try {
      const response = await fetch(filePath);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch ${filePath}`);
      }

      const html = await response.text();
      element.innerHTML = html;

      // Execute any nested <script> tags within the injected component
      const scripts = element.querySelectorAll('script');
      scripts.forEach((script) => {
        const newScript = document.createElement('script');
        Array.from(script.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.textContent = script.textContent;
        script.parentNode.replaceChild(newScript, script);
      });

      // Dispatch event notifying that this specific component is rendered
      const eventName = 'componentLoaded';
      const eventDetail = { element, path: filePath };
      element.dispatchEvent(new CustomEvent(eventName, { bubbles: true, detail: eventDetail }));

      return element;
    } catch (error) {
      console.error(`[ComponentLoader] Error loading component into:`, element, error);
      element.innerHTML = `<!-- Failed to load: ${filePath} -->`;
      throw error;
    }
  }

  /**
   * Scans the document for placeholder elements and resolves their content.
   */
  async function initComponentLoader() {
    // Select elements with data-component="filename" or data-include="path/file.html"
    const targets = document.querySelectorAll('[data-component], [data-include]');

    const loadPromises = Array.from(targets).map((element) => {
      const componentName = element.getAttribute('data-component');
      const customPath = element.getAttribute('data-include');

      const filePath = customPath
        ? customPath
        : `${COMPONENT_DIR}/${componentName}.html`;

      return loadFragment(element, filePath);
    });

    try {
      await Promise.allSettled(loadPromises);
      // Dispatch global ready event when all initial components are loaded
      document.dispatchEvent(new CustomEvent('allComponentsLoaded'));
    } catch (err) {
      console.error('[ComponentLoader] One or more components failed to initialize.', err);
    }
  }

  // Public API
  window.ComponentLoader = {
    load: loadFragment,
    init: initComponentLoader,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponentLoader);
  } else {
    initComponentLoader();
  }
})();