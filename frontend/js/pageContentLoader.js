/**
 * Page Content Loader
 * Loads AI-generated content for each page
 */

const PageContentLoader = {
  /**
   * Load AI-generated content for a specific page
   */
  async loadPageContent(pageName) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_URL}/blueprint/page/${pageName}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load page content');
      }

      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error(`Error loading ${pageName} content:`, error);
      return null;
    }
  },

  /**
   * Render AI-generated content into page
   */
  renderContent(containerId, content) {
    const container = document.getElementById(containerId);
    if (!container || !content) return;

    // If content is an object with raw text
    if (content.raw) {
      container.innerHTML = this.formatTextContent(content.raw);
      return;
    }

    // If content is structured JSON
    if (typeof content === 'object') {
      container.innerHTML = this.formatStructuredContent(content);
      return;
    }

    // If content is plain text
    container.innerHTML = this.formatTextContent(content);
  },

  /**
   * Format text content with markdown-like formatting
   */
  formatTextContent(text) {
    if (!text) return '';
    
    // Convert markdown-like formatting to HTML
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
  },

  /**
   * Format structured JSON content
   */
  formatStructuredContent(content) {
    let html = '';

    for (const [key, value] of Object.entries(content)) {
      if (typeof value === 'object' && value !== null) {
        html += `<div class="mb-4"><h4>${this.capitalize(key)}</h4>`;
        html += this.formatStructuredContent(value);
        html += '</div>';
      } else if (Array.isArray(value)) {
        html += `<div class="mb-3"><h5>${this.capitalize(key)}</h5><ul>`;
        value.forEach(item => {
          if (typeof item === 'object') {
            html += '<li>' + this.formatStructuredContent(item) + '</li>';
          } else {
            html += `<li>${item}</li>`;
          }
        });
        html += '</ul></div>';
      } else {
        html += `<p><strong>${this.capitalize(key)}:</strong> ${value}</p>`;
      }
    }

    return html;
  },

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, ' $1');
  }
};

