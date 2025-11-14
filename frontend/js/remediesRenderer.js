/**
 * Remedies Content Renderer
 * Custom renderer for remedies page with beautiful formatting
 */

const RemediesRenderer = {
  /**
   * Render remedies content beautifully
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
          <button onclick="regenerateRemedies()" class="btn btn-primary mt-2">
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
        <button onclick="regenerateRemedies()" class="btn btn-outline-primary" id="regenerate-btn">
          <i class="fas fa-redo me-2"></i>Regenerate Remedies
        </button>
      </div>
    `;

    // Introduction Alert
    html += `
      <div class="alert alert-info mx-auto mb-5" style="max-width: 900px;" data-aos="fade-up">
        <h5 class="fw-bold mb-2">🙏 Your Personalized Remedies & Daan System</h5>
        <p class="mb-2"><strong>Purpose:</strong> These remedies are specifically aligned with your astrological profile to balance planetary energies and enhance positive outcomes.</p>
        <p class="mb-0"><strong>Practice:</strong> Follow these remedies consistently for maximum benefit. Timing and sincerity are key!</p>
      </div>
    `;

    // Dasha Remedies Section
    if (content.dashaRemedies) {
      html += this.renderDashaRemedies(content.dashaRemedies);
    }

    // Life Area Remedies Section
    if (content.lifeAreaRemedies) {
      html += this.renderLifeAreaRemedies(content.lifeAreaRemedies);
    }

    // Gift/Daan Recommendations
    if (content.gifts || content.daan) {
      html += this.renderGiftsDaan(content.gifts || content.daan);
    }

    // Daily Practices
    if (content.dailyPractices) {
      html += this.renderDailyPractices(content.dailyPractices);
    }

    // Weekly Practices
    if (content.weeklyPractices) {
      html += this.renderWeeklyPractices(content.weeklyPractices);
    }

    // Mantras Section
    if (content.mantras) {
      html += this.renderMantras(content.mantras);
    }

    // Gemstones Section
    if (content.gemstones) {
      html += this.renderGemstones(content.gemstones);
    }

    // Yantras Section
    if (content.yantras) {
      html += this.renderYantras(content.yantras);
    }

    // If content is raw text, format it
    if (content.raw) {
      html += this.formatMarkdown(content.raw);
    }

    container.innerHTML = html;
    AOS.init({ duration: 1000, once: true });
  },

  /**
   * Render Dasha Remedies Section
   */
  renderDashaRemedies(dashaRemedies) {
    let html = `
      <h2 class="h2 fw-bold text-center mb-4 mt-5" data-aos="fade-up">🕉️ DASHA REMEDIES</h2>
      <p class="text-center text-muted mb-5" data-aos="fade-up">Remedies specific to your current and upcoming planetary periods</p>
    `;

    for (const [dashaName, remedies] of Object.entries(dashaRemedies)) {
      const planetEmoji = this.getPlanetEmoji(dashaName);
      const planetColor = this.getPlanetColor(dashaName);

      html += `
        <div class="card shadow-lg border-0 rounded-4 mb-4 border-${planetColor}" style="border-width: 3px !important;" data-aos="fade-up">
          <div class="card-header bg-${planetColor} text-white py-3">
            <h3 class="h4 mb-0">${planetEmoji} ${dashaName}</h3>
          </div>
          <div class="card-body p-4">
            <div class="dasha-timeline">
      `;

      if (Array.isArray(remedies)) {
        remedies.forEach((remedy, index) => {
          html += `
            <div class="dasha-item">
              <div class="card border-${planetColor} mb-3 remedy-card">
                <div class="card-body">
                  <div class="d-flex align-items-start">
                    <span class="badge bg-${planetColor} me-3" style="font-size: 1.1rem; padding: 8px 12px;">${index + 1}</span>
                    <div class="flex-grow-1">
                      <p class="mb-0" style="font-size: 1.05rem; line-height: 1.6;">${this.formatMantra(remedy)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
        });
      }

      html += `
            </div>
          </div>
        </div>
      `;
    }

    return html;
  },

  /**
   * Render Life Area Remedies Section
   */
  renderLifeAreaRemedies(lifeAreaRemedies) {
    let html = `
      <h2 class="h2 fw-bold text-center mb-4 mt-5" data-aos="fade-up">💎 LIFE AREA REMEDIES</h2>
      <p class="text-center text-muted mb-5" data-aos="fade-up">Targeted remedies for specific life areas</p>
    `;

    const areaIcons = {
      'Money': '💰',
      'Wealth': '💰',
      'Finance': '💰',
      'Career': '💼',
      'Job': '💼',
      'Health': '💚',
      'Love': '❤️',
      'Marriage': '💑',
      'Relationships': '👥',
      'Family': '👨‍👩‍👧‍👦',
      'Children': '👶',
      'Education': '📚',
      'Success': '🎯',
      'Peace': '🕊️',
      'Happiness': '😊',
      'Spiritual': '🕉️',
      'Protection': '🛡️'
    };

    for (const [areaName, remedies] of Object.entries(lifeAreaRemedies)) {
      const icon = areaIcons[areaName] || '✨';
      const areaColor = this.getAreaColor(areaName);

      html += `
        <div class="card shadow-lg border-0 rounded-4 mb-4 border-${areaColor}" style="border-width: 3px !important;" data-aos="fade-up">
          <div class="card-header bg-${areaColor} text-white py-3">
            <h3 class="h4 mb-0">${icon} ${areaName}</h3>
          </div>
          <div class="card-body p-4">
            <div class="row g-3">
      `;

      if (Array.isArray(remedies)) {
        remedies.forEach((remedy, index) => {
          html += `
            <div class="col-md-6">
              <div class="card border-${areaColor} h-100 remedy-card">
                <div class="card-body">
                  <div class="d-flex align-items-start">
                    <span class="badge bg-${areaColor} me-2">${index + 1}</span>
                    <p class="mb-0 flex-grow-1" style="font-size: 1rem; line-height: 1.6;">${this.formatMantra(remedy)}</p>
                  </div>
                </div>
              </div>
            </div>
          `;
        });
      }

      html += `
            </div>
          </div>
        </div>
      `;
    }

    return html;
  },

  /**
   * Render Gifts/Daan Section
   */
  renderGiftsDaan(gifts) {
    let html = `
      <h2 class="h2 fw-bold text-center mb-4 mt-5" data-aos="fade-up">🎁 GIFTS & DAAN (CHARITY)</h2>
      <p class="text-center text-muted mb-5" data-aos="fade-up">Recommended items for donation to balance planetary energies</p>
      <div class="card shadow-lg border-0 rounded-4 mb-5 border-warning" style="border-width: 3px !important;" data-aos="fade-up">
        <div class="card-header bg-warning text-dark py-3">
          <h3 class="h4 mb-0">🎁 Recommended Items for Daan</h3>
        </div>
        <div class="card-body p-4">
    `;

    if (Array.isArray(gifts)) {
      html += '<div class="row g-3">';
      gifts.forEach((gift, index) => {
        html += `
          <div class="col-md-6">
            <div class="card border-warning h-100">
              <div class="card-body">
                <div class="d-flex align-items-start">
                  <span class="badge bg-warning text-dark me-2">${index + 1}</span>
                  <p class="mb-0 flex-grow-1">${typeof gift === 'string' ? gift : (gift.name || gift.item || JSON.stringify(gift))}</p>
                </div>
              </div>
            </div>
          </div>
        `;
      });
      html += '</div>';
    } else if (typeof gifts === 'object') {
      html += this.renderStructuredContent(gifts);
    }

    html += `
        </div>
      </div>
    `;

    return html;
  },

  /**
   * Render Daily Practices
   */
  renderDailyPractices(practices) {
    let html = `
      <h2 class="h2 fw-bold text-center mb-4 mt-5" data-aos="fade-up">🌅 DAILY PRACTICES</h2>
      <div class="card shadow-lg border-0 rounded-4 mb-5 border-success" style="border-width: 3px !important;" data-aos="fade-up">
        <div class="card-header bg-success text-white py-3">
          <h3 class="h4 mb-0">🌅 Daily Spiritual Practices</h3>
        </div>
        <div class="card-body p-4">
    `;

    if (Array.isArray(practices)) {
      practices.forEach((practice, index) => {
        html += `
          <div class="card border-success mb-3">
            <div class="card-body">
              <div class="d-flex align-items-start">
                <span class="badge bg-success me-3" style="font-size: 1.1rem; padding: 8px 12px;">${index + 1}</span>
                <p class="mb-0 flex-grow-1" style="font-size: 1.05rem; line-height: 1.6;">${this.formatMantra(practice)}</p>
              </div>
            </div>
          </div>
        `;
      });
    } else {
      html += this.renderStructuredContent(practices);
    }

    html += `
        </div>
      </div>
    `;

    return html;
  },

  /**
   * Render Weekly Practices
   */
  renderWeeklyPractices(practices) {
    let html = `
      <h2 class="h2 fw-bold text-center mb-4 mt-5" data-aos="fade-up">📅 WEEKLY PRACTICES</h2>
      <div class="card shadow-lg border-0 rounded-4 mb-5 border-info" style="border-width: 3px !important;" data-aos="fade-up">
        <div class="card-header bg-info text-white py-3">
          <h3 class="h4 mb-0">📅 Weekly Spiritual Practices</h3>
        </div>
        <div class="card-body p-4">
    `;

    if (Array.isArray(practices)) {
      practices.forEach((practice, index) => {
        html += `
          <div class="card border-info mb-3">
            <div class="card-body">
              <div class="d-flex align-items-start">
                <span class="badge bg-info me-3" style="font-size: 1.1rem; padding: 8px 12px;">${index + 1}</span>
                <p class="mb-0 flex-grow-1" style="font-size: 1.05rem; line-height: 1.6;">${this.formatMantra(practice)}</p>
              </div>
            </div>
          </div>
        `;
      });
    } else {
      html += this.renderStructuredContent(practices);
    }

    html += `
        </div>
      </div>
    `;

    return html;
  },

  /**
   * Render Mantras Section
   */
  renderMantras(mantras) {
    let html = `
      <h2 class="h2 fw-bold text-center mb-4 mt-5" data-aos="fade-up">🕉️ MANTRA SECTION</h2>
      <div class="card shadow-lg border-0 rounded-4 mb-5 border-primary" style="border-width: 3px !important;" data-aos="fade-up">
        <div class="card-header bg-primary text-white py-3">
          <h3 class="h4 mb-0">🕉️ Powerful Mantras for Your Astrological Profile</h3>
        </div>
        <div class="card-body p-4">
    `;

    if (Array.isArray(mantras)) {
      mantras.forEach((mantra, index) => {
        html += `
          <div class="card border-primary mb-3">
            <div class="card-body">
              <div class="d-flex align-items-start">
                <span class="badge bg-primary me-3" style="font-size: 1.1rem; padding: 8px 12px;">${index + 1}</span>
                <div class="flex-grow-1">
                  <p class="mb-0" style="font-size: 1.1rem; line-height: 1.8; font-family: 'Times New Roman', serif;">${this.formatMantra(mantra)}</p>
                </div>
              </div>
            </div>
          </div>
        `;
      });
    } else {
      html += this.renderStructuredContent(mantras);
    }

    html += `
        </div>
      </div>
    `;

    return html;
  },

  /**
   * Render Gemstones Section
   */
  renderGemstones(gemstones) {
    let html = `
      <h2 class="h2 fw-bold text-center mb-4 mt-5" data-aos="fade-up">💎 GEMSTONE RECOMMENDATIONS</h2>
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-dark text-white py-3">
          <h3 class="h4 mb-0">💎 Recommended Gemstones</h3>
        </div>
        <div class="card-body p-4">
          <div class="row g-4">
    `;

    if (Array.isArray(gemstones)) {
      gemstones.forEach((gemstone) => {
        const name = typeof gemstone === 'string' ? gemstone : (gemstone.name || gemstone);
        html += `
          <div class="col-md-6">
            <div class="card border-dark h-100">
              <div class="card-body">
                <h5>${name}</h5>
                ${typeof gemstone === 'object' && gemstone.description ? `<p>${gemstone.description}</p>` : ''}
                ${typeof gemstone === 'object' && gemstone.finger ? `<p><strong>Wear on:</strong> ${gemstone.finger}</p>` : ''}
                ${typeof gemstone === 'object' && gemstone.day ? `<p><strong>Best day:</strong> ${gemstone.day}</p>` : ''}
              </div>
            </div>
          </div>
        `;
      });
    } else {
      html += this.renderStructuredContent(gemstones);
    }

    html += `
          </div>
        </div>
      </div>
    `;

    return html;
  },

  /**
   * Render Yantras Section
   */
  renderYantras(yantras) {
    let html = `
      <h2 class="h2 fw-bold text-center mb-4 mt-5" data-aos="fade-up">🔯 YANTRA RECOMMENDATIONS</h2>
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-secondary text-white py-3">
          <h3 class="h4 mb-0">🔯 Recommended Yantras</h3>
        </div>
        <div class="card-body p-4">
          <div class="row g-4">
    `;

    if (Array.isArray(yantras)) {
      yantras.forEach((yantra) => {
        const name = typeof yantra === 'string' ? yantra : (yantra.name || yantra);
        html += `
          <div class="col-md-6">
            <div class="card border-secondary h-100">
              <div class="card-body">
                <h5>${name}</h5>
                ${typeof yantra === 'object' && yantra.description ? `<p>${yantra.description}</p>` : ''}
                ${typeof yantra === 'object' && yantra.direction ? `<p><strong>Place in:</strong> ${yantra.direction}</p>` : ''}
                ${typeof yantra === 'object' && yantra.puja ? `<p><strong>Puja:</strong> ${yantra.puja}</p>` : ''}
              </div>
            </div>
          </div>
        `;
      });
    } else {
      html += this.renderStructuredContent(yantras);
    }

    html += `
          </div>
        </div>
      </div>
    `;

    return html;
  },

  /**
   * Format mantra text (preserve Sanskrit/Devanagari)
   */
  formatMantra(text) {
    if (!text) return '';
    // Preserve the text as-is, just escape HTML
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  },

  /**
   * Get planet emoji
   */
  getPlanetEmoji(dashaName) {
    const planetMap = {
      'Sun': '☀️',
      'Moon': '🌙',
      'Mars': '♂️',
      'Mercury': '☿️',
      'Jupiter': '♃',
      'Venus': '♀️',
      'Saturn': '🪐',
      'Rahu': '☊',
      'Ketu': '☋'
    };

    for (const [planet, emoji] of Object.entries(planetMap)) {
      if (dashaName.includes(planet)) {
        return emoji;
      }
    }
    return '🕉️';
  },

  /**
   * Get planet color
   */
  getPlanetColor(dashaName) {
    if (dashaName.includes('Sun')) return 'warning';
    if (dashaName.includes('Moon')) return 'info';
    if (dashaName.includes('Mars')) return 'danger';
    if (dashaName.includes('Mercury')) return 'success';
    if (dashaName.includes('Jupiter')) return 'primary';
    if (dashaName.includes('Venus')) return 'primary';
    if (dashaName.includes('Saturn')) return 'dark';
    if (dashaName.includes('Rahu')) return 'secondary';
    if (dashaName.includes('Ketu')) return 'secondary';
    return 'primary';
  },

  /**
   * Get area color
   */
  getAreaColor(areaName) {
    if (areaName.includes('Money') || areaName.includes('Wealth') || areaName.includes('Finance')) return 'warning';
    if (areaName.includes('Career') || areaName.includes('Job')) return 'primary';
    if (areaName.includes('Health')) return 'success';
    if (areaName.includes('Love') || areaName.includes('Marriage') || areaName.includes('Relationships')) return 'danger';
    if (areaName.includes('Family') || areaName.includes('Children')) return 'info';
    if (areaName.includes('Education')) return 'primary';
    if (areaName.includes('Spiritual')) return 'secondary';
    return 'primary';
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
            html += `<li>${this.formatMantra(item)}</li>`;
          }
        });
        html += '</ul>';
      } else if (typeof value === 'object' && value !== null) {
        html += `<h5 class="mt-3">${formattedKey}</h5>`;
        html += this.renderStructuredContent(value);
      } else {
        html += `<p><strong>${formattedKey}:</strong> ${this.formatMantra(value)}</p>`;
      }
    }
    return html;
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
          return '<ul>' + items.map(item => `<li>${this.formatMantra(item.replace(/^[-*]\s*/, ''))}</li>`).join('') + '</ul>';
        }
        return `<p>${this.formatMantra(para.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>'))}</p>`;
      })
      .join('');
  }
};

// Global function for regenerate button
async function regenerateRemedies() {
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

    const response = await fetch(`${API_URL}/blueprint/generate/remedies`, {
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
    const contentContainer = document.getElementById('ai-remedies-content');
    if (contentContainer && data.content) {
      RemediesRenderer.renderContent(contentContainer, data.content);
    }

    alert('Remedies content regenerated successfully!');
  } catch (error) {
    console.error('Regeneration error:', error);
    alert(`Failed to regenerate: ${error.message}`);
    btn.disabled = false;
    btn.innerHTML = originalHtml;
  }
}

