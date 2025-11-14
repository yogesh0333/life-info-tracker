/**
 * Lifestyle Content Renderer
 * Custom renderer for lifestyle page matching YOGESH_LIFE_BLUEPRINT style
 */

const LifestyleRenderer = {
  /**
   * Render lifestyle content in the YOGESH_LIFE_BLUEPRINT style
   */
  renderContent(container, content) {
    if (!content) {
      container.innerHTML = '<div class="alert alert-warning">No content available</div>';
      return;
    }

    if (content.error) {
      container.innerHTML = `
        <div class="alert alert-danger">
          <h5>Error Generating Content</h5>
          <p>${content.error}</p>
          <button onclick="regenerateLifestyle()" class="btn btn-primary mt-2">
            <i class="fas fa-redo me-2"></i>Regenerate
          </button>
        </div>
      `;
      return;
    }

    let html = '';

    // Regenerate Button (Top Right)
    html += `
      <div class="text-end mb-4">
        <button onclick="regenerateLifestyle()" class="btn btn-outline-primary" id="regenerate-btn">
          <i class="fas fa-redo me-2"></i>Regenerate Lifestyle
        </button>
      </div>
    `;

    // Header Alert
    html += `
      <div class="alert alert-dark mx-auto mb-5" style="max-width: 900px;" data-aos="fade-up">
        <h5 class="fw-bold mb-2">🔥 Your Goal: Magnetic, Attractive, Unforgettable Presence</h5>
        <p class="mb-2"><strong>Budget:</strong> ₹2L/month (₹24 LPA) | <strong>Lifestyle Investment: ₹5k-10k/month</p>
        <p class="mb-0"><strong>Rule:</strong> Quality over quantity. Strategic purchases that work with your astrological energy!</p>
      </div>
    `;

    // Fragrance Types Explained
    html += this.renderFragranceTypes();

    // Render structured content
    if (content.fragrances) {
      html += this.renderFragrances(content.fragrances);
    }

    if (content.clothing) {
      html += this.renderClothing(content.clothing);
    }

    if (content.accessories) {
      html += this.renderAccessories(content.accessories);
    }

    if (content.colors) {
      html += this.renderColors(content.colors);
    }

    if (content.styleGuide) {
      html += this.renderStyleGuide(content.styleGuide);
    }

    // If content is raw text, format it
    if (content.raw) {
      html += this.formatMarkdown(content.raw);
    }

    container.innerHTML = html;
    AOS.init({ duration: 1000, once: true });
  },

  /**
   * Render Fragrance Types Section
   */
  renderFragranceTypes() {
    return `
      <h2 class="h2 fw-bold text-center mb-4 mt-5" data-aos="fade-up">👑 FRAGRANCE TYPES - EDP, EDT & ATTAR</h2>
      <p class="text-center text-muted mb-5" data-aos="fade-up">Understanding fragrance types for maximum impact</p>

      <div class="card shadow-lg border-0 rounded-4 mb-5 border-info" style="border-width: 3px !important;" data-aos="fade-up">
        <div class="card-header bg-info text-white py-3">
          <h3 class="h4 mb-0">📚 Fragrance Types Explained</h3>
        </div>
        <div class="card-body p-4">
          <div class="row g-4">
            <div class="col-md-4">
              <div class="card border-primary h-100">
                <div class="card-header bg-primary text-white">
                  <h5 class="mb-0">💧 EDP (Eau de Parfum)</h5>
                </div>
                <div class="card-body">
                  <ul class="small">
                    <li><strong>Concentration:</strong> 15-20% perfume oil</li>
                    <li><strong>Longevity:</strong> 6-8 hours</li>
                    <li><strong>Projection:</strong> Strong, noticeable</li>
                    <li><strong>Best For:</strong> Parties, events, special occasions</li>
                    <li><strong>Price Range:</strong> ₹500-2,500</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card border-success h-100">
                <div class="card-header bg-success text-white">
                  <h5 class="mb-0">💨 EDT (Eau de Toilette)</h5>
                </div>
                <div class="card-body">
                  <ul class="small">
                    <li><strong>Concentration:</strong> 5-15% perfume oil</li>
                    <li><strong>Longevity:</strong> 3-5 hours</li>
                    <li><strong>Projection:</strong> Moderate, fresh</li>
                    <li><strong>Best For:</strong> Office, daily wear, gym</li>
                    <li><strong>Price Range:</strong> ₹300-1,500</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card border-warning h-100">
                <div class="card-header bg-warning text-dark">
                  <h5 class="mb-0">🕉️ ATTAR (Traditional)</h5>
                </div>
                <div class="card-body">
                  <ul class="small">
                    <li><strong>Concentration:</strong> Pure, no alcohol</li>
                    <li><strong>Longevity:</strong> 8-24 hours (longest!)</li>
                    <li><strong>Projection:</strong> Subtle, intimate</li>
                    <li><strong>Best For:</strong> Spiritual, traditional events, daily</li>
                    <li><strong>Price Range:</strong> ₹500-3,000</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render Fragrances Section
   */
  renderFragrances(fragrances) {
    let html = '';

    // EDP Section
    if (fragrances.edp && fragrances.edp.length > 0) {
      html += `
        <h2 class="h2 fw-bold text-center mb-4 mt-5" data-aos="fade-up">💧 EDP (Eau de Parfum) - Quality Brands That Actually Work</h2>
        <p class="text-center text-muted mb-5" data-aos="fade-up">Real fragrances for a powerful identity - not chemical cocktails</p>

        <div class="card shadow-lg border-0 rounded-4 mb-5 border-primary" style="border-width: 3px !important;" data-aos="fade-up">
          <div class="card-header bg-primary text-white py-3">
            <h3 class="h4 mb-0">💧 Top EDP Brands (₹1,200-3,500) - Ground-Tested Quality</h3>
          </div>
          <div class="card-body p-4">
            <div class="row g-4">
      `;

      fragrances.edp.forEach((item, index) => {
        const score = item.score || item.rating || 'N/A';
        const badgeColor = score >= 9 ? 'danger' : score >= 7 ? 'primary' : 'success';
        
        html += `
          <div class="col-lg-6">
            <div class="card border-${badgeColor} h-100 brand-card">
              <div class="card-header bg-light">
                <h5 class="mb-0">${item.name || item.brand || 'Unknown'}</h5>
                <span class="badge bg-${badgeColor}">${score}/10 ⭐⭐⭐⭐⭐</span>
              </div>
              <div class="card-body">
                ${item.price ? `<p><strong>Price:</strong> ${item.price}</p>` : ''}
                ${item.type ? `<p><strong>Type:</strong> ${item.type}</p>` : ''}
                ${item.description ? `<p>${item.description}</p>` : ''}
                ${item.features ? this.renderList(item.features) : ''}
                ${item.astrology ? `<p><strong>Astro:</strong> ${item.astrology}</p>` : ''}
                ${item.numerology ? `<p><strong>Numerology:</strong> ${item.numerology}</p>` : ''}
                ${item.bestFor ? `<p><strong>Best For:</strong> ${item.bestFor}</p>` : ''}
                ${item.reason ? `<div class="alert alert-${badgeColor} mt-3 mb-0"><strong>Ground Truth:</strong> ${item.reason}</div>` : ''}
              </div>
            </div>
          </div>
        `;
      });

      html += `
            </div>
          </div>
        </div>
      `;
    }

    // EDT Section
    if (fragrances.edt && fragrances.edt.length > 0) {
      html += `
        <h2 class="h2 fw-bold text-center mb-4 mt-5" data-aos="fade-up">💨 EDT (Eau de Toilette) - Quality Brands That Actually Work</h2>
        <p class="text-center text-muted mb-5" data-aos="fade-up">Clean, trustworthy, sophisticated</p>

        <div class="card shadow-lg border-0 rounded-4 mb-5 border-success" style="border-width: 3px !important;" data-aos="fade-up">
          <div class="card-header bg-success text-white py-3">
            <h3 class="h4 mb-0">💨 Top EDT Brands (₹1,200-2,500) - Ground-Tested Quality</h3>
          </div>
          <div class="card-body p-4">
            <div class="row g-4">
      `;

      fragrances.edt.forEach((item) => {
        const score = item.score || item.rating || 'N/A';
        const badgeColor = score >= 9 ? 'primary' : 'success';
        
        html += `
          <div class="col-lg-6">
            <div class="card border-${badgeColor} h-100 brand-card">
              <div class="card-header bg-light">
                <h5 class="mb-0">${item.name || item.brand || 'Unknown'}</h5>
                <span class="badge bg-${badgeColor}">${score}/10 ⭐⭐⭐⭐⭐</span>
              </div>
              <div class="card-body">
                ${item.price ? `<p><strong>Price:</strong> ${item.price}</p>` : ''}
                ${item.type ? `<p><strong>Type:</strong> ${item.type}</p>` : ''}
                ${item.description ? `<p>${item.description}</p>` : ''}
                ${item.features ? this.renderList(item.features) : ''}
                ${item.astrology ? `<p><strong>Astro:</strong> ${item.astrology}</p>` : ''}
                ${item.bestFor ? `<p><strong>Best For:</strong> ${item.bestFor}</p>` : ''}
                ${item.reason ? `<div class="alert alert-${badgeColor} mt-3 mb-0"><strong>Ground Truth:</strong> ${item.reason}</div>` : ''}
              </div>
            </div>
          </div>
        `;
      });

      html += `
            </div>
          </div>
        </div>
      `;
    }

    // Attar Section
    if (fragrances.attar && fragrances.attar.length > 0) {
      html += `
        <h2 class="h2 fw-bold text-center mb-4 mt-5" data-aos="fade-up">🕉️ ATTAR (Traditional) - Pure, Long-Lasting Fragrances</h2>
        <p class="text-center text-muted mb-5" data-aos="fade-up">Spiritual, traditional, powerful</p>

        <div class="card shadow-lg border-0 rounded-4 mb-5 border-warning" style="border-width: 3px !important;" data-aos="fade-up">
          <div class="card-header bg-warning text-dark py-3">
            <h3 class="h4 mb-0">🕉️ Top Attar Brands (₹500-3,000) - Traditional Excellence</h3>
          </div>
          <div class="card-body p-4">
            <div class="row g-4">
      `;

      fragrances.attar.forEach((item) => {
        const score = item.score || item.rating || 'N/A';
        const badgeColor = 'warning';
        
        html += `
          <div class="col-lg-6">
            <div class="card border-${badgeColor} h-100 brand-card">
              <div class="card-header bg-light">
                <h5 class="mb-0">${item.name || item.brand || 'Unknown'}</h5>
                <span class="badge bg-${badgeColor} text-dark">${score}/10 ⭐⭐⭐⭐⭐</span>
              </div>
              <div class="card-body">
                ${item.price ? `<p><strong>Price:</strong> ${item.price}</p>` : ''}
                ${item.type ? `<p><strong>Type:</strong> ${item.type}</p>` : ''}
                ${item.description ? `<p>${item.description}</p>` : ''}
                ${item.features ? this.renderList(item.features) : ''}
                ${item.astrology ? `<p><strong>Astro:</strong> ${item.astrology}</p>` : ''}
                ${item.bestFor ? `<p><strong>Best For:</strong> ${item.bestFor}</p>` : ''}
                ${item.reason ? `<div class="alert alert-${badgeColor} mt-3 mb-0"><strong>Ground Truth:</strong> ${item.reason}</div>` : ''}
              </div>
            </div>
          </div>
        `;
      });

      html += `
            </div>
          </div>
        </div>
      `;
    }

    return html;
  },

  /**
   * Render Clothing Section
   */
  renderClothing(clothing) {
    if (!clothing || (Array.isArray(clothing) && clothing.length === 0)) return '';

    let html = `
      <h2 class="h2 fw-bold text-center mb-4 mt-5" data-aos="fade-up">👔 CLOTHING & STYLE</h2>
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-body p-4">
    `;

    if (Array.isArray(clothing)) {
      clothing.forEach((item) => {
        html += `
          <div class="card mb-3">
            <div class="card-body">
              <h5>${item.name || item.brand || 'Item'}</h5>
              ${item.description ? `<p>${item.description}</p>` : ''}
              ${item.price ? `<p><strong>Price:</strong> ${item.price}</p>` : ''}
              ${item.occasion ? `<p><strong>Best For:</strong> ${item.occasion}</p>` : ''}
            </div>
          </div>
        `;
      });
    } else {
      html += this.renderStructuredContent(clothing);
    }

    html += `
        </div>
      </div>
    `;

    return html;
  },

  /**
   * Render Accessories Section
   */
  renderAccessories(accessories) {
    if (!accessories) return '';

    let html = `
      <h2 class="h2 fw-bold text-center mb-4 mt-5" data-aos="fade-up">⌚ ACCESSORIES & WATCHES</h2>
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-body p-4">
    `;

    if (Array.isArray(accessories)) {
      html += '<div class="row g-4">';
      accessories.forEach((item) => {
        html += `
          <div class="col-md-6">
            <div class="card">
              <div class="card-body">
                <h5>${item.name || item.brand || 'Item'}</h5>
                ${item.description ? `<p>${item.description}</p>` : ''}
                ${item.price ? `<p><strong>Price:</strong> ${item.price}</p>` : ''}
              </div>
            </div>
          </div>
        `;
      });
      html += '</div>';
    } else {
      html += this.renderStructuredContent(accessories);
    }

    html += `
        </div>
      </div>
    `;

    return html;
  },

  /**
   * Render Colors Section
   */
  renderColors(colors) {
    if (!colors) return '';

    let html = `
      <h2 class="h2 fw-bold text-center mb-4 mt-5" data-aos="fade-up">🎨 COLOR PALETTE</h2>
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-body p-4">
    `;

    if (Array.isArray(colors)) {
      html += '<div class="row g-3">';
      colors.forEach((color) => {
        const colorName = typeof color === 'string' ? color : (color.name || color);
        html += `
          <div class="col-md-3">
            <div class="card text-center">
              <div class="card-body">
                <div class="mb-2" style="width: 100%; height: 60px; background-color: ${colorName.toLowerCase()}; border-radius: 5px;"></div>
                <strong>${colorName}</strong>
              </div>
            </div>
          </div>
        `;
      });
      html += '</div>';
    } else {
      html += this.renderStructuredContent(colors);
    }

    html += `
        </div>
      </div>
    `;

    return html;
  },

  /**
   * Render Style Guide Section
   */
  renderStyleGuide(styleGuide) {
    if (!styleGuide) return '';

    let html = `
      <h2 class="h2 fw-bold text-center mb-4 mt-5" data-aos="fade-up">📖 STYLE GUIDE</h2>
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-body p-4">
    `;

    html += this.renderStructuredContent(styleGuide);

    html += `
        </div>
      </div>
    `;

    return html;
  },

  /**
   * Render structured content recursively
   */
  renderStructuredContent(obj) {
    let html = '';
    for (const [key, value] of Object.entries(obj)) {
      const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      
      if (Array.isArray(value)) {
        html += `<h5 class="mt-3">${formattedKey}</h5>`;
        html += '<ul>';
        value.forEach(item => {
          if (typeof item === 'object') {
            html += '<li>' + this.renderStructuredContent(item) + '</li>';
          } else {
            html += `<li>${item}</li>`;
          }
        });
        html += '</ul>';
      } else if (typeof value === 'object' && value !== null) {
        html += `<h5 class="mt-3">${formattedKey}</h5>`;
        html += this.renderStructuredContent(value);
      } else {
        html += `<p><strong>${formattedKey}:</strong> ${value}</p>`;
      }
    }
    return html;
  },

  /**
   * Render list
   */
  renderList(items) {
    if (!Array.isArray(items)) return '';
    return '<ul class="small">' + items.map(item => `<li>${item}</li>`).join('') + '</ul>';
  },

  /**
   * Format markdown
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
        return `<p>${para.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')}</p>`;
      })
      .join('');
  }
};

// Global function for regenerate button
async function regenerateLifestyle() {
  const btn = document.getElementById('regenerate-btn');
  if (!btn) return;

  const originalHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Regenerating...';

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '../login.html';
      return;
    }

    const response = await fetch(`${API_URL}/blueprint/generate/lifestyle`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to regenerate');
    }

    const data = await response.json();
    
    // Reload the page content
    const contentContainer = document.getElementById('ai-lifestyle-content');
    if (contentContainer && data.content) {
      LifestyleRenderer.renderContent(contentContainer, data.content);
    }

    alert('Lifestyle content regenerated successfully!');
  } catch (error) {
    console.error('Regeneration error:', error);
    alert(`Failed to regenerate: ${error.message}`);
    btn.disabled = false;
    btn.innerHTML = originalHtml;
  }
}

