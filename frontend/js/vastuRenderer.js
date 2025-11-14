/**
 * Vastu Content Renderer
 * Beautiful renderer with Vastu mandala grid and direction-based recommendations
 */

const VastuRenderer = {
  /**
   * Render vastu content beautifully
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
          <button onclick="regenerateVastu()" class="btn btn-primary mt-2">
            <i class="fas fa-redo me-2"></i>Regenerate
          </button>
        </div>
      `;
      return;
    }

    let html = '';

    // Regenerate Button
    html += `
      <div class="text-end mb-4">
        <button onclick="regenerateVastu()" class="btn btn-outline-primary" id="regenerate-btn">
          <i class="fas fa-redo me-2"></i>Regenerate Vastu
        </button>
      </div>
    `;

    // Vastu Mandala
    if (content.vastuMandala) {
      html += this.renderVastuMandala(content.vastuMandala);
    }

    // Wealth Vastu
    if (content.wealthVastu) {
      html += this.renderWealthVastu(content.wealthVastu);
    }

    // Children Vastu
    if (content.childrenVastu) {
      html += this.renderChildrenVastu(content.childrenVastu);
    }

    // Peace Vastu
    if (content.peaceVastu) {
      html += this.renderPeaceVastu(content.peaceVastu);
    }

    // Vehicle Vastu
    if (content.vehicleVastu) {
      html += this.renderVehicleVastu(content.vehicleVastu);
    }

    // Home Checklist
    if (content.homeChecklist) {
      html += this.renderHomeChecklist(content.homeChecklist);
    }

    // Color Recommendations
    if (content.colorRecommendations) {
      html += this.renderColorRecommendations(content.colorRecommendations);
    }

    // Remedies
    if (content.remedies) {
      html += this.renderRemedies(content.remedies);
    }

    container.innerHTML = html;
    AOS.init({ duration: 1000, once: true });
  },

  /**
   * Render Vastu Mandala
   */
  renderVastuMandala(mandala) {
    const directions = [
      { key: 'northwest', label: 'NW', pos: 0 },
      { key: 'north', label: 'N', pos: 1 },
      { key: 'northeast', label: 'NE', pos: 2 },
      { key: 'west', label: 'W', pos: 3 },
      { key: 'center', label: 'CENTER', pos: 4 },
      { key: 'east', label: 'E', pos: 5 },
      { key: 'southwest', label: 'SW', pos: 6 },
      { key: 'south', label: 'S', pos: 7 },
      { key: 'southeast', label: 'SE', pos: 8 }
    ];

    const getDirectionData = (key) => {
      const data = mandala[key];
      if (!data) return null;
      return {
        element: data.element || '',
        planet: data.planet || '',
        purpose: data.purpose || '',
        color: this.getDirectionColor(key)
      };
    };

    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-primary text-white py-3">
          <h3 class="h4 mb-0 text-center"><i class="fas fa-compass me-2"></i>🔯 Vastu Purusha Mandala</h3>
        </div>
        <div class="card-body p-4">
          <div class="vastu-grid mx-auto mb-4" style="max-width: 500px;">
            ${directions.map(dir => {
              const data = getDirectionData(dir.key);
              if (!data) return '';
              return `
                <div class="vastu-cell bg-${data.color} text-white" style="grid-column: ${(dir.pos % 3) + 1}; grid-row: ${Math.floor(dir.pos / 3) + 1};">
                  <strong>${dir.label}</strong><br>
                  <small>${data.element}</small><br>
                  <small>${data.planet}</small>
                </div>
              `;
            }).join('')}
          </div>
          
          <div class="row g-3 mt-4">
            ${Object.entries(mandala).map(([key, data]) => `
              <div class="col-md-4">
                <div class="card border-${this.getDirectionColor(key)}">
                  <div class="card-header bg-${this.getDirectionColor(key)} text-white">
                    <h6 class="mb-0">${key.toUpperCase().replace(/([A-Z])/g, ' $1')}</h6>
                  </div>
                  <div class="card-body">
                    <p><strong>Element:</strong> ${data.element || 'N/A'}</p>
                    <p><strong>Planet:</strong> ${data.planet || 'N/A'}</p>
                    <p><strong>Purpose:</strong> ${data.purpose || 'N/A'}</p>
                    <ul class="small">
                      ${(data.recommendations || []).map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Get direction color
   */
  getDirectionColor(direction) {
    const colorMap = {
      'northeast': 'info',
      'north': 'primary',
      'east': 'danger',
      'southeast': 'warning',
      'south': 'dark',
      'southwest': 'secondary',
      'west': 'success',
      'northwest': 'light',
      'center': 'warning'
    };
    return colorMap[direction.toLowerCase()] || 'primary';
  },

  /**
   * Render Wealth Vastu
   */
  renderWealthVastu(wealth) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5 border-success" style="border-width: 3px !important;" data-aos="fade-up">
        <div class="card-header bg-success text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-sack-dollar me-2"></i>💰 Vastu for Wealth</h3>
        </div>
        <div class="card-body">
          <div class="row g-4">
            ${wealth.mainDoor ? `
              <div class="col-md-6">
                <div class="card border-success">
                  <div class="card-header bg-success text-white">
                    <h5 class="mb-0">🚪 Main Door</h5>
                  </div>
                  <div class="card-body">
                    <p><strong>Best Directions:</strong> ${(wealth.mainDoor.bestDirections || []).join(', ') || 'N/A'}</p>
                    <p><strong>Avoid:</strong> ${(wealth.mainDoor.avoid || []).join(', ') || 'N/A'}</p>
                    <ul>
                      ${(wealth.mainDoor.recommendations || []).map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            ` : ''}
            ${wealth.treasury ? `
              <div class="col-md-6">
                <div class="card border-warning">
                  <div class="card-header bg-warning text-dark">
                    <h5 class="mb-0">💎 Treasury</h5>
                  </div>
                  <div class="card-body">
                    <p><strong>Direction:</strong> ${wealth.treasury.direction || 'N/A'}</p>
                    <ul>
                      ${(wealth.treasury.recommendations || []).map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
          ${wealth.remedies && Array.isArray(wealth.remedies) ? `
            <div class="alert alert-success mt-3">
              <h5>🙏 Remedies</h5>
              <ul>
                ${wealth.remedies.map(remedy => `<li>${remedy}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  /**
   * Render Children Vastu
   */
  renderChildrenVastu(children) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5 border-info" style="border-width: 3px !important;" data-aos="fade-up">
        <div class="card-header bg-info text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-baby me-2"></i>👶 Vastu for Children</h3>
        </div>
        <div class="card-body">
          ${children.bedroom ? `
            <div class="card border-info mb-3">
              <div class="card-header bg-info text-white">
                <h5 class="mb-0">🛏️ Bedroom</h5>
              </div>
              <div class="card-body">
                <p><strong>Direction:</strong> ${children.bedroom.direction || 'N/A'}</p>
                <p><strong>Bed Position:</strong> ${children.bedroom.bedPosition || 'N/A'}</p>
                <p><strong>Colors:</strong> ${Array.isArray(children.bedroom.colors) ? children.bedroom.colors.join(', ') : children.bedroom.colors || 'N/A'}</p>
                <p><strong>Avoid:</strong> ${Array.isArray(children.bedroom.avoid) ? children.bedroom.avoid.join(', ') : children.bedroom.avoid || 'N/A'}</p>
              </div>
            </div>
          ` : ''}
          ${children.remedies && Array.isArray(children.remedies) ? `
            <div class="alert alert-info">
              <h5>🙏 Remedies</h5>
              <ul>
                ${children.remedies.map(remedy => `<li>${remedy}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  /**
   * Render Peace Vastu
   */
  renderPeaceVastu(peace) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5 border-primary" style="border-width: 3px !important;" data-aos="fade-up">
        <div class="card-header bg-primary text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-dove me-2"></i>🕊️ Vastu for Peace</h3>
        </div>
        <div class="card-body">
          <div class="row g-4">
            ${peace.livingRoom ? `
              <div class="col-md-6">
                <div class="card border-primary">
                  <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">🛋️ Living Room</h5>
                  </div>
                  <div class="card-body">
                    <p><strong>Direction:</strong> ${peace.livingRoom.direction || 'N/A'}</p>
                    <ul>
                      ${(peace.livingRoom.recommendations || []).map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            ` : ''}
            ${peace.pujaRoom ? `
              <div class="col-md-6">
                <div class="card border-warning">
                  <div class="card-header bg-warning text-dark">
                    <h5 class="mb-0">🕉️ Puja Room</h5>
                  </div>
                  <div class="card-body">
                    <p><strong>Direction:</strong> ${peace.pujaRoom.direction || 'N/A'}</p>
                    <ul>
                      ${(peace.pujaRoom.recommendations || []).map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
          ${peace.remedies && Array.isArray(peace.remedies) ? `
            <div class="alert alert-primary mt-3">
              <h5>🙏 Remedies</h5>
              <ul>
                ${peace.remedies.map(remedy => `<li>${remedy}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  /**
   * Render Vehicle Vastu
   */
  renderVehicleVastu(vehicle) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-dark text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-car me-2"></i>🚗 Vehicle Vastu</h3>
        </div>
        <div class="card-body">
          ${vehicle.parking ? `
            <div class="card border-dark mb-3">
              <div class="card-header bg-dark text-white">
                <h5 class="mb-0">🅿️ Parking</h5>
              </div>
              <div class="card-body">
                <p><strong>Direction:</strong> ${vehicle.parking.direction || 'N/A'}</p>
                <p><strong>Avoid:</strong> ${Array.isArray(vehicle.parking.avoid) ? vehicle.parking.avoid.join(', ') : vehicle.parking.avoid || 'N/A'}</p>
                <ul>
                  ${(vehicle.parking.recommendations || []).map(rec => `<li>${rec}</li>`).join('')}
                </ul>
              </div>
            </div>
          ` : ''}
          ${vehicle.remedies && Array.isArray(vehicle.remedies) ? `
            <div class="alert alert-dark">
              <h5>🙏 Remedies</h5>
              <ul>
                ${vehicle.remedies.map(remedy => `<li>${remedy}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  /**
   * Render Home Checklist
   */
  renderHomeChecklist(checklist) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-warning text-dark py-3">
          <h3 class="h4 mb-0"><i class="fas fa-clipboard-check me-2"></i>✅ Home Buying Checklist</h3>
        </div>
        <div class="card-body">
          <div class="row g-4">
            ${checklist.beforeBuying && Array.isArray(checklist.beforeBuying) ? `
              <div class="col-md-6">
                <div class="card border-warning">
                  <div class="card-header bg-warning text-dark">
                    <h5 class="mb-0">🔍 Before Buying</h5>
                  </div>
                  <div class="card-body">
                    <ul>
                      ${checklist.beforeBuying.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            ` : ''}
            ${checklist.bestDirections ? `
              <div class="col-md-6">
                <div class="card border-success">
                  <div class="card-header bg-success text-white">
                    <h5 class="mb-0">🧭 Best Directions</h5>
                  </div>
                  <div class="card-body">
                    ${Object.entries(checklist.bestDirections).map(([key, value]) => `
                      <p><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${Array.isArray(value) ? value.join(', ') : value}</p>
                    `).join('')}
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render Color Recommendations
   */
  renderColorRecommendations(colors) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-info text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-palette me-2"></i>🎨 Color Recommendations</h3>
        </div>
        <div class="card-body">
          <div class="row g-3">
            ${Object.entries(colors).map(([room, colorList]) => {
              const colorsArray = Array.isArray(colorList) ? colorList : [colorList];
              return `
                <div class="col-md-6">
                  <div class="card border-info">
                    <div class="card-header bg-info text-white">
                      <h5 class="mb-0">${room.charAt(0).toUpperCase() + room.slice(1)}</h5>
                    </div>
                    <div class="card-body">
                      <div class="d-flex flex-wrap gap-2">
                        ${colorsArray.map(color => `
                          <span class="badge" style="background-color: ${this.getColorHex(color)}; color: ${this.getTextColor(color)}; padding: 8px 12px; font-size: 0.9rem;">
                            ${color}
                          </span>
                        `).join('')}
                      </div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Get color hex
   */
  getColorHex(colorName) {
    const colorMap = {
      'pink': '#ffc0cb',
      'white': '#ffffff',
      'light blue': '#add8e6',
      'blue': '#0000ff',
      'yellow': '#ffff00',
      'green': '#008000',
      'orange': '#ffa500',
      'red': '#ff0000',
      'saffron': '#ff9933'
    };
    return colorMap[colorName.toLowerCase()] || '#cccccc';
  },

  /**
   * Get text color (black or white based on background)
   */
  getTextColor(colorName) {
    const lightColors = ['white', 'yellow', 'light blue'];
    return lightColors.includes(colorName.toLowerCase()) ? '#000000' : '#ffffff';
  },

  /**
   * Render Remedies
   */
  renderRemedies(remedies) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-secondary text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-hands-praying me-2"></i>🙏 Vastu Remedies</h3>
        </div>
        <div class="card-body">
          <div class="row g-4">
            ${remedies.forWealth && Array.isArray(remedies.forWealth) ? `
              <div class="col-md-4">
                <div class="card border-success">
                  <div class="card-header bg-success text-white">
                    <h5 class="mb-0">💰 For Wealth</h5>
                  </div>
                  <div class="card-body">
                    <ul>
                      ${remedies.forWealth.map(remedy => `<li>${remedy}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            ` : ''}
            ${remedies.forChildren && Array.isArray(remedies.forChildren) ? `
              <div class="col-md-4">
                <div class="card border-info">
                  <div class="card-header bg-info text-white">
                    <h5 class="mb-0">👶 For Children</h5>
                  </div>
                  <div class="card-body">
                    <ul>
                      ${remedies.forChildren.map(remedy => `<li>${remedy}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            ` : ''}
            ${remedies.forPeace && Array.isArray(remedies.forPeace) ? `
              <div class="col-md-4">
                <div class="card border-primary">
                  <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">🕊️ For Peace</h5>
                  </div>
                  <div class="card-body">
                    <ul>
                      ${remedies.forPeace.map(remedy => `<li>${remedy}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }
};

// Global function for regenerate button
async function regenerateVastu() {
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

    const response = await fetch(`${API_URL}/blueprint/generate/vastu`, {
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
    const contentContainer = document.getElementById('ai-vastu-content');
    if (contentContainer && data.content) {
      VastuRenderer.renderContent(contentContainer, data.content);
    }

    alert('Vastu content regenerated successfully!');
  } catch (error) {
    console.error('Regeneration error:', error);
    alert(`Failed to regenerate: ${error.message}`);
    btn.disabled = false;
    btn.innerHTML = originalHtml;
  }
}

