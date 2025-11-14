/**
 * AI Content Renderer
 * Renders AI-generated content into HTML pages
 */

const AIContentRenderer = {
  /**
   * Render AI content into a page
   */
  async renderPage(pageName, containerSelector = '#ai-content') {
    try {
      // Show loading state
      const container = document.querySelector(containerSelector);
      if (container) {
        container.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-3">Generating personalized content...</p></div>';
      }

      // Load AI-generated content
      const content = await PageContentLoader.loadPageContent(pageName);
      
      if (!content) {
        if (container) {
          container.innerHTML = '<div class="alert alert-warning">Content generation in progress. Please refresh in a moment.</div>';
        }
        return;
      }

      // Render content
      if (container) {
        this.renderContent(container, content);
      } else {
        // If no container, try to replace static content
        this.replaceStaticContent(pageName, content);
      }
    } catch (error) {
      console.error('Error rendering AI content:', error);
      const container = document.querySelector(containerSelector);
      if (container) {
        container.innerHTML = '<div class="alert alert-danger">Error loading content. Please try again.</div>';
      }
    }
  },

  /**
   * Render content into container
   */
  renderContent(container, content) {
    if (!content) return;

    // Handle different content types
    if (content.error) {
      container.innerHTML = `<div class="alert alert-warning">${content.error}</div>`;
      return;
    }

    if (content.raw) {
      // Raw text content
      container.innerHTML = this.formatMarkdown(content.raw);
      return;
    }

    if (typeof content === 'string') {
      // Plain string
      container.innerHTML = this.formatMarkdown(content);
      return;
    }

    // Structured JSON content
    container.innerHTML = this.renderStructuredContent(content);
  },

  /**
   * Format markdown-like text to HTML
   */
  formatMarkdown(text) {
    if (!text) return '';
    
    return text
      .split('\n\n')
      .map(para => {
        if (para.startsWith('#')) {
          const level = para.match(/^#+/)[0].length;
          const text = para.replace(/^#+\s*/, '');
          return `<h${level}>${text}</h${level}>`;
        }
        if (para.startsWith('- ') || para.startsWith('* ')) {
          const items = para.split('\n').filter(l => l.trim());
          return '<ul>' + items.map(item => `<li>${item.replace(/^[-*]\s*/, '')}</li>`).join('') + '</ul>';
        }
        if (/^\d+\.\s/.test(para)) {
          const items = para.split('\n').filter(l => l.trim());
          return '<ol>' + items.map(item => `<li>${item.replace(/^\d+\.\s*/, '')}</li>`).join('') + '</ol>';
        }
        return `<p>${para.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')}</p>`;
      })
      .join('');
  },

  /**
   * Render structured JSON content
   */
  renderStructuredContent(content) {
    let html = '';

    for (const [key, value] of Object.entries(content)) {
      const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      
      if (Array.isArray(value)) {
        html += `<div class="mb-4"><h4>${formattedKey}</h4><ul class="list-group">`;
        value.forEach(item => {
          if (typeof item === 'object') {
            html += '<li class="list-group-item">' + this.renderStructuredContent(item) + '</li>';
          } else {
            html += `<li class="list-group-item">${item}</li>`;
          }
        });
        html += '</ul></div>';
      } else if (typeof value === 'object' && value !== null) {
        html += `<div class="card mb-3"><div class="card-header"><h5>${formattedKey}</h5></div><div class="card-body">`;
        html += this.renderStructuredContent(value);
        html += '</div></div>';
      } else {
        html += `<p><strong>${formattedKey}:</strong> ${value}</p>`;
      }
    }

    return html;
  },

  /**
   * Replace static content with AI-generated content
   */
  replaceStaticContent(pageName, content) {
    // This will be called for pages that don't have a dedicated container
    // For now, we'll add containers to pages as needed
    console.log(`Content loaded for ${pageName}:`, content);
  }
};

