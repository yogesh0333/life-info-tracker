/**
 * Family Content Renderer
 * Beautiful renderer with timeline visualization and family planning
 */

const FamilyRenderer = {
  /**
   * Render family content beautifully
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
          <button onclick="regenerateFamily()" class="btn btn-primary mt-2">
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
        <button onclick="regenerateFamily()" class="btn btn-outline-primary" id="regenerate-btn">
          <i class="fas fa-redo me-2"></i>Regenerate Family
        </button>
      </div>
    `;

    // Marriage Status
    if (content.marriageStatus) {
      html += this.renderMarriageStatus(content.marriageStatus, content.marriageTiming);
    }

    // Conception Plan
    if (content.conceptionPlan) {
      html += this.renderConceptionPlan(content.conceptionPlan);
    }

    // Children Plan Timeline
    if (content.childrenPlan && content.childrenPlan.timeline) {
      html += this.renderChildrenTimeline(content.childrenPlan);
    }

    // Family Gifts
    if (content.familyGifts) {
      html += this.renderFamilyGifts(content.familyGifts);
    }

    // Family Harmony
    if (content.familyHarmony) {
      html += this.renderFamilyHarmony(content.familyHarmony);
    }

    // Vastu Recommendations
    if (content.vastuRecommendations) {
      html += this.renderVastuRecommendations(content.vastuRecommendations);
    }

    // Spiritual Practices
    if (content.spiritualPractices) {
      html += this.renderSpiritualPractices(content.spiritualPractices);
    }

    container.innerHTML = html;
    
    // Initialize timeline chart
    setTimeout(() => {
      if (content.childrenPlan && content.childrenPlan.timeline) {
        this.initChildrenTimelineChart(content.childrenPlan.timeline);
      }
    }, 100);

    AOS.init({ duration: 1000, once: true });
  },

  /**
   * Render Marriage Status
   */
  renderMarriageStatus(status, timing) {
    const statusColor = status === 'Married' ? 'success' : 'warning';
    const statusIcon = status === 'Married' ? '💍' : '💑';
    
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5 border-${statusColor}" style="border-width: 3px !important;" data-aos="fade-up">
        <div class="card-header bg-${statusColor} text-white py-3">
          <h3 class="h4 mb-0">${statusIcon} Marriage Status: ${status}</h3>
        </div>
        <div class="card-body">
          ${timing ? `
            <div class="row g-3">
              <div class="col-md-6">
                <div class="card border-primary">
                  <div class="card-body">
                    <h5>📅 Best Period</h5>
                    <p class="h4 text-primary">${timing.bestPeriod || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card border-success">
                  <div class="card-body">
                    <h5>🌟 Best Months</h5>
                    <ul>
                      ${(timing.bestMonths || []).map(month => `<li>${month}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            ${timing.astrologicalReasons ? `
              <div class="alert alert-info mt-3">
                <strong>Astrological Reasons:</strong> ${timing.astrologicalReasons}
              </div>
            ` : ''}
          ` : ''}
        </div>
      </div>
    `;
  },

  /**
   * Render Conception Plan
   */
  renderConceptionPlan(plan) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-primary text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-baby me-2"></i>👶 Conception Plan</h3>
        </div>
        <div class="card-body">
          ${plan.bestTimes && Array.isArray(plan.bestTimes) ? `
            <h5 class="mb-3">⏰ Best Times for Conception</h5>
            <div class="row g-3 mb-4">
              ${plan.bestTimes.map((time, index) => `
                <div class="col-md-4">
                  <div class="card border-primary">
                    <div class="card-body">
                      <h6>Year ${time.year || 'N/A'}</h6>
                      <ul>
                        ${(time.months || []).map(month => `<li>${month}</li>`).join('')}
                      </ul>
                      <small class="text-muted">${time.astrologicalReasons || ''}</small>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${plan.remedies && Array.isArray(plan.remedies) ? `
            <h5 class="mb-3">🙏 Remedies</h5>
            <div class="row g-3">
              ${plan.remedies.map((remedy, index) => `
                <div class="col-md-6">
                  <div class="card border-success">
                    <div class="card-body">
                      <div class="d-flex align-items-start">
                        <span class="badge bg-success me-2">${index + 1}</span>
                        <p class="mb-0 flex-grow-1">${remedy}</p>
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${plan.vastuRecommendations ? `
            <h5 class="mb-3 mt-4">🏠 Vastu Recommendations</h5>
            <div class="card border-info">
              <div class="card-body">
                <p><strong>Bedroom Direction:</strong> ${plan.vastuRecommendations.bedroomDirection || 'N/A'}</p>
                <p><strong>Bed Position:</strong> ${plan.vastuRecommendations.bedPosition || 'N/A'}</p>
                <p><strong>Colors:</strong> ${plan.vastuRecommendations.colors || 'N/A'}</p>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  /**
   * Render Children Timeline
   */
  renderChildrenTimeline(childrenPlan) {
    if (!childrenPlan.timeline || !Array.isArray(childrenPlan.timeline)) return '';

    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-success text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-baby me-2"></i>👶 Children Planning Timeline</h3>
        </div>
        <div class="card-body">
          <div class="chart-container" style="position: relative; height: 300px;">
            <canvas id="childrenTimelineChart"></canvas>
          </div>
          <div class="timeline mt-4">
            ${childrenPlan.timeline.map((child, index) => `
              <div class="timeline-item mb-4" data-aos="fade-right" data-aos-delay="${index * 100}">
                <div class="card border-success">
                  <div class="card-header bg-success text-white">
                    <h5 class="mb-0">👶 Child ${child.childNumber || index + 1}</h5>
                  </div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-3">
                        <strong>Conception:</strong><br>
                        <span class="text-primary">${child.conceptionYear || 'N/A'}</span>
                      </div>
                      <div class="col-md-3">
                        <strong>Birth:</strong><br>
                        <span class="text-success">${child.birthYear || 'N/A'}</span>
                      </div>
                      <div class="col-md-3">
                        <strong>Your Age:</strong><br>
                        <span class="text-info">${child.ageWhenBorn || 'N/A'}</span>
                      </div>
                      <div class="col-md-3">
                        <strong>Best Months:</strong><br>
                        ${(child.bestMonths || []).map(month => `<span class="badge bg-primary me-1">${month}</span>`).join('')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          ${childrenPlan.remediesForHealthyChildren && Array.isArray(childrenPlan.remediesForHealthyChildren) ? `
            <div class="alert alert-success mt-4">
              <h5>🙏 Remedies for Healthy Children</h5>
              <ul>
                ${childrenPlan.remediesForHealthyChildren.map(remedy => `<li>${remedy}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  /**
   * Initialize Children Timeline Chart
   */
  initChildrenTimelineChart(timeline) {
    const ctx = document.getElementById('childrenTimelineChart');
    if (!ctx) return;

    const labels = timeline.map(child => `Child ${child.childNumber || 'N/A'}`);
    const conceptionYears = timeline.map(child => child.conceptionYear || 0);
    const birthYears = timeline.map(child => child.birthYear || 0);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Conception Year',
            data: conceptionYears,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 2
          },
          {
            label: 'Birth Year',
            data: birthYears,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Children Planning Timeline'
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Year'
            }
          }
        }
      }
    });
  },

  /**
   * Render Family Gifts
   */
  renderFamilyGifts(gifts) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-warning text-dark py-3">
          <h3 class="h4 mb-0"><i class="fas fa-gift me-2"></i>🎁 Astrological Gifts for Family</h3>
        </div>
        <div class="card-body">
          <div class="row g-4">
            ${gifts.forWife && Array.isArray(gifts.forWife) ? `
              <div class="col-md-4">
                <div class="card border-danger h-100">
                  <div class="card-header bg-danger text-white">
                    <h5 class="mb-0">💍 For Wife</h5>
                  </div>
                  <div class="card-body">
                    ${gifts.forWife.map((gift, index) => `
                      <div class="mb-3">
                        <h6>${gift.item || 'N/A'}</h6>
                        <p class="small text-muted">${gift.astrologicalReason || ''}</p>
                        <small><strong>Best Time:</strong> ${gift.bestTime || 'N/A'}</small>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            ` : ''}
            ${gifts.forChildren && Array.isArray(gifts.forChildren) ? `
              <div class="col-md-4">
                <div class="card border-info h-100">
                  <div class="card-header bg-info text-white">
                    <h5 class="mb-0">👶 For Children</h5>
                  </div>
                  <div class="card-body">
                    ${gifts.forChildren.map((gift, index) => `
                      <div class="mb-3">
                        <h6>${gift.item || 'N/A'}</h6>
                        <p class="small text-muted">${gift.astrologicalReason || ''}</p>
                        <small><strong>Best Time:</strong> ${gift.bestTime || 'N/A'}</small>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            ` : ''}
            ${gifts.forParents && Array.isArray(gifts.forParents) ? `
              <div class="col-md-4">
                <div class="card border-success h-100">
                  <div class="card-header bg-success text-white">
                    <h5 class="mb-0">👨‍👩‍👧‍👦 For Parents</h5>
                  </div>
                  <div class="card-body">
                    ${gifts.forParents.map((gift, index) => `
                      <div class="mb-3">
                        <h6>${gift.item || 'N/A'}</h6>
                        <p class="small text-muted">${gift.astrologicalReason || ''}</p>
                        <small><strong>Best Time:</strong> ${gift.bestTime || 'N/A'}</small>
                      </div>
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
   * Render Family Harmony
   */
  renderFamilyHarmony(harmony) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-primary text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-heart me-2"></i>❤️ Family Harmony</h3>
        </div>
        <div class="card-body">
          <div class="row g-4">
            ${harmony.recommendations && Array.isArray(harmony.recommendations) ? `
              <div class="col-md-6">
                <div class="card border-primary">
                  <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">💡 Recommendations</h5>
                  </div>
                  <div class="card-body">
                    <ul>
                      ${harmony.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            ` : ''}
            ${harmony.remedies && Array.isArray(harmony.remedies) ? `
              <div class="col-md-6">
                <div class="card border-success">
                  <div class="card-header bg-success text-white">
                    <h5 class="mb-0">🙏 Remedies</h5>
                  </div>
                  <div class="card-body">
                    <ul>
                      ${harmony.remedies.map(remedy => `<li>${remedy}</li>`).join('')}
                    </ul>
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
   * Render Vastu Recommendations
   */
  renderVastuRecommendations(vastu) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-info text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-home me-2"></i>🏠 Vastu Recommendations</h3>
        </div>
        <div class="card-body">
          <div class="row g-4">
            ${vastu.bedroom ? `
              <div class="col-md-6">
                <div class="card border-info">
                  <div class="card-header bg-info text-white">
                    <h5 class="mb-0">🛏️ Bedroom</h5>
                  </div>
                  <div class="card-body">
                    <p><strong>Direction:</strong> ${vastu.bedroom.direction || 'N/A'}</p>
                    <p><strong>Colors:</strong> ${vastu.bedroom.colors || 'N/A'}</p>
                    <p><strong>Items:</strong> ${vastu.bedroom.items || 'N/A'}</p>
                  </div>
                </div>
              </div>
            ` : ''}
            ${vastu.pujaRoom ? `
              <div class="col-md-6">
                <div class="card border-warning">
                  <div class="card-header bg-warning text-dark">
                    <h5 class="mb-0">🕉️ Puja Room</h5>
                  </div>
                  <div class="card-body">
                    <p><strong>Direction:</strong> ${vastu.pujaRoom.direction || 'N/A'}</p>
                    <p><strong>Deities:</strong> ${vastu.pujaRoom.deities || 'N/A'}</p>
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
   * Render Spiritual Practices
   */
  renderSpiritualPractices(practices) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-secondary text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-om me-2"></i>🕉️ Spiritual Practices</h3>
        </div>
        <div class="card-body">
          <div class="row g-4">
            ${practices.daily && Array.isArray(practices.daily) ? `
              <div class="col-md-6">
                <div class="card border-primary">
                  <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">🌅 Daily</h5>
                  </div>
                  <div class="card-body">
                    <ul>
                      ${practices.daily.map(practice => `<li>${practice}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            ` : ''}
            ${practices.weekly && Array.isArray(practices.weekly) ? `
              <div class="col-md-6">
                <div class="card border-success">
                  <div class="card-header bg-success text-white">
                    <h5 class="mb-0">📅 Weekly</h5>
                  </div>
                  <div class="card-body">
                    <ul>
                      ${practices.weekly.map(practice => `<li>${practice}</li>`).join('')}
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
async function regenerateFamily() {
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

    const response = await fetch(`${API_URL}/blueprint/generate/family`, {
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
    const contentContainer = document.getElementById('ai-family-content');
    if (contentContainer && data.content) {
      FamilyRenderer.renderContent(contentContainer, data.content);
    }

    alert('Family content regenerated successfully!');
  } catch (error) {
    console.error('Regeneration error:', error);
    alert(`Failed to regenerate: ${error.message}`);
    btn.disabled = false;
    btn.innerHTML = originalHtml;
  }
}

