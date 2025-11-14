/**
 * Career Content Renderer
 * Beautiful renderer with career paths comparison and skill development
 */

const CareerRenderer = {
  /**
   * Render career content beautifully
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
          <button onclick="regenerateCareer()" class="btn btn-primary mt-2">
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
        <button onclick="regenerateCareer()" class="btn btn-outline-primary" id="regenerate-btn">
          <i class="fas fa-redo me-2"></i>Regenerate Career
        </button>
      </div>
    `;

    // Current Status
    if (content.currentStatus) {
      html += this.renderCurrentStatus(content.currentStatus);
    }

    // Career Paths
    if (content.careerPaths && Array.isArray(content.careerPaths)) {
      html += this.renderCareerPaths(content.careerPaths);
    }

    // Recommended Path
    if (content.recommendedPath) {
      html += this.renderRecommendedPath(content.recommendedPath);
    }

    // Skill Development
    if (content.skillDevelopment) {
      html += this.renderSkillDevelopment(content.skillDevelopment);
    }

    // Financial Projections
    if (content.financialProjections && Array.isArray(content.financialProjections)) {
      html += this.renderFinancialProjections(content.financialProjections);
    }

    // Sacrifices
    if (content.sacrifices && Array.isArray(content.sacrifices)) {
      html += this.renderSacrifices(content.sacrifices);
    }

    // Success Metrics
    if (content.successMetrics) {
      html += this.renderSuccessMetrics(content.successMetrics);
    }

    // Immediate Actions
    if (content.immediateActions && Array.isArray(content.immediateActions)) {
      html += this.renderImmediateActions(content.immediateActions);
    }

    // Astrological Alignment
    if (content.astrologicalAlignment) {
      html += this.renderAstrologicalAlignment(content.astrologicalAlignment);
    }

    container.innerHTML = html;
    
    // Initialize charts
    setTimeout(() => {
      if (content.financialProjections && Array.isArray(content.financialProjections)) {
        this.initFinancialProjectionsChart(content.financialProjections);
      }
    }, 100);

    AOS.init({ duration: 1000, once: true });
  },

  /**
   * Render Current Status
   */
  renderCurrentStatus(status) {
    return `
      <div class="row mb-5" data-aos="fade-up">
        <div class="col-lg-10 mx-auto">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-header bg-primary text-white py-3">
              <h3 class="h4 mb-0"><i class="fas fa-briefcase me-2"></i>💼 Current Career Status</h3>
            </div>
            <div class="card-body p-4">
              <div class="row g-3">
                <div class="col-md-3 text-center">
                  <div class="p-3 bg-primary text-white rounded-3">
                    <div class="h5 fw-bold">${status.currentRole || 'N/A'}</div>
                    <small>Current Role</small>
                  </div>
                </div>
                <div class="col-md-3 text-center">
                  <div class="p-3 bg-success text-white rounded-3">
                    <div class="h5 fw-bold">${status.currentSalary || 'N/A'}</div>
                    <small>Current Salary</small>
                  </div>
                </div>
                <div class="col-md-3 text-center">
                  <div class="p-3 bg-info text-white rounded-3">
                    <div class="h5 fw-bold">${status.experience || 'N/A'}</div>
                    <small>Experience</small>
                  </div>
                </div>
                <div class="col-md-3 text-center">
                  <div class="p-3 bg-warning text-dark rounded-3">
                    <div class="h5 fw-bold">${status.currentCompany || 'N/A'}</div>
                    <small>Company</small>
                  </div>
                </div>
              </div>
              ${status.skills && Array.isArray(status.skills) ? `
                <div class="mt-3">
                  <strong>Skills:</strong>
                  ${status.skills.map(skill => `<span class="badge bg-secondary me-1">${skill}</span>`).join('')}
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render Career Paths
   */
  renderCareerPaths(paths) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-success text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-route me-2"></i>🚀 Career Paths</h3>
        </div>
        <div class="card-body">
          <div class="row g-4">
            ${paths.map((path, index) => {
              const colors = ['primary', 'success', 'warning'];
              const color = colors[index % colors.length];
              return `
                <div class="col-md-4">
                  <div class="card border-${color} h-100" style="border-width: 3px !important;">
                    <div class="card-header bg-${color} text-white">
                      <h5 class="mb-0">${path.pathName || 'N/A'}</h5>
                    </div>
                    <div class="card-body">
                      <p class="h5 text-${color} mb-3">${path.targetSalary || path.targetIncome || 'N/A'}</p>
                      <p class="text-muted"><strong>Timeline:</strong> ${path.timeline || 'N/A'}</p>
                      
                      <h6 class="mt-3">✅ Pros:</h6>
                      <ul class="small">
                        ${(path.pros || []).map(pro => `<li>${pro}</li>`).join('')}
                      </ul>
                      
                      <h6 class="mt-3">❌ Cons:</h6>
                      <ul class="small">
                        ${(path.cons || []).map(con => `<li>${con}</li>`).join('')}
                      </ul>
                      
                      <h6 class="mt-3">📚 Required Skills:</h6>
                      <div class="mb-2">
                        ${(path.requiredSkills || []).map(skill => `<span class="badge bg-${color} me-1">${skill}</span>`).join('')}
                      </div>
                      
                      ${path.companies && Array.isArray(path.companies) ? `
                        <h6 class="mt-3">🏢 Companies:</h6>
                        <ul class="small">
                          ${path.companies.map(company => `<li>${company}</li>`).join('')}
                        </ul>
                      ` : ''}
                      
                      ${path.astrologicalAlignment ? `
                        <div class="alert alert-info mt-3 mb-0">
                          <small><strong>Astro:</strong> ${path.astrologicalAlignment}</small>
                        </div>
                      ` : ''}
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
   * Render Recommended Path
   */
  renderRecommendedPath(path) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5 border-warning" style="border-width: 3px !important;" data-aos="fade-up">
        <div class="card-header bg-warning text-dark py-3">
          <h3 class="h4 mb-0"><i class="fas fa-star me-2"></i>⭐ Recommended Path</h3>
        </div>
        <div class="card-body">
          <h4 class="text-warning mb-3">${path.path || 'N/A'}</h4>
          <p class="lead">${path.reason || 'N/A'}</p>
          <div class="alert alert-warning">
            <strong>Strategy:</strong> ${path.strategy || 'N/A'}
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render Skill Development
   */
  renderSkillDevelopment(development) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-info text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-graduation-cap me-2"></i>📚 Skill Development</h3>
        </div>
        <div class="card-body">
          <div class="row g-4">
            ${development.dailySchedule ? `
              <div class="col-md-6">
                <div class="card border-primary">
                  <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">🌅 Daily Schedule</h5>
                  </div>
                  <div class="card-body">
                    <p><strong>Morning:</strong> ${development.dailySchedule.morning || 'N/A'}</p>
                    <p><strong>Evening:</strong> ${development.dailySchedule.evening || 'N/A'}</p>
                  </div>
                </div>
              </div>
            ` : ''}
            ${development.weeklySchedule ? `
              <div class="col-md-6">
                <div class="card border-success">
                  <div class="card-header bg-success text-white">
                    <h5 class="mb-0">📅 Weekly Schedule</h5>
                  </div>
                  <div class="card-body">
                    <p><strong>Weekdays:</strong> ${development.weeklySchedule.weekdays || 'N/A'}</p>
                    <p><strong>Weekends:</strong> ${development.weeklySchedule.weekends || 'N/A'}</p>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
          
          ${development.skillsToLearn && Array.isArray(development.skillsToLearn) ? `
            <h5 class="mt-4 mb-3">🎯 Skills to Learn</h5>
            <div class="row g-3">
              ${development.skillsToLearn.map((skill, index) => {
                const priorityColor = skill.priority === 'High' ? 'danger' : skill.priority === 'Medium' ? 'warning' : 'info';
                return `
                  <div class="col-md-6">
                    <div class="card border-${priorityColor}">
                      <div class="card-header bg-${priorityColor} text-white">
                        <h6 class="mb-0">${skill.skill || 'N/A'}</h6>
                      </div>
                      <div class="card-body">
                        <p><strong>Priority:</strong> <span class="badge bg-${priorityColor}">${skill.priority || 'N/A'}</span></p>
                        <p><strong>Timeline:</strong> ${skill.timeline || 'N/A'}</p>
                        <p><strong>Resources:</strong> ${(skill.resources || []).join(', ') || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  /**
   * Render Financial Projections
   */
  renderFinancialProjections(projections) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-primary text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-chart-line me-2"></i>📈 Financial Projections</h3>
        </div>
        <div class="card-body">
          <div class="chart-container" style="position: relative; height: 400px;">
            <canvas id="financialProjectionsChart"></canvas>
          </div>
          <div class="table-responsive mt-4">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Age</th>
                  <th>Year</th>
                  <th>Salary</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                ${projections.map(item => `
                  <tr>
                    <td>${item.age || 'N/A'}</td>
                    <td>${item.year || 'N/A'}</td>
                    <td><strong class="text-success">${item.salary || 'N/A'}</strong></td>
                    <td>${item.role || 'N/A'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Initialize Financial Projections Chart
   */
  initFinancialProjectionsChart(projections) {
    const ctx = document.getElementById('financialProjectionsChart');
    if (!ctx) return;

    const ages = projections.map(item => item.age || item.year);
    const salaries = projections.map(item => {
      const salaryStr = item.salary || '0';
      return this.parseAmount(salaryStr);
    });

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ages,
        datasets: [{
          label: 'Salary (₹)',
          data: salaries,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          title: {
            display: true,
            text: 'Career Salary Growth'
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: function(value) {
                return '₹' + (value / 100000) + 'L';
              }
            }
          }
        }
      }
    });
  },

  /**
   * Render Sacrifices
   */
  renderSacrifices(sacrifices) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5 border-warning" style="border-width: 3px !important;" data-aos="fade-up">
        <div class="card-header bg-warning text-dark py-3">
          <h3 class="h4 mb-0"><i class="fas fa-exclamation-triangle me-2"></i>⚠️ Sacrifices Needed</h3>
        </div>
        <div class="card-body">
          <div class="row g-3">
            ${sacrifices.map(sacrifice => `
              <div class="col-md-4">
                <div class="card border-warning">
                  <div class="card-body text-center">
                    <i class="fas fa-times-circle text-warning fa-2x mb-2"></i>
                    <p class="mb-0">${sacrifice}</p>
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
   * Render Success Metrics
   */
  renderSuccessMetrics(metrics) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-success text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-bullseye me-2"></i>🎯 Success Metrics</h3>
        </div>
        <div class="card-body">
          <div class="row g-4">
            ${metrics.shortTerm && Array.isArray(metrics.shortTerm) ? `
              <div class="col-md-6">
                <div class="card border-primary">
                  <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">📅 Short Term</h5>
                  </div>
                  <div class="card-body">
                    <ul>
                      ${metrics.shortTerm.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            ` : ''}
            ${metrics.longTerm && Array.isArray(metrics.longTerm) ? `
              <div class="col-md-6">
                <div class="card border-success">
                  <div class="card-header bg-success text-white">
                    <h5 class="mb-0">🚀 Long Term</h5>
                  </div>
                  <div class="card-body">
                    <ul>
                      ${metrics.longTerm.map(item => `<li>${item}</li>`).join('')}
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
   * Render Immediate Actions
   */
  renderImmediateActions(actions) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-danger text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-bolt me-2"></i>⚡ Immediate Actions</h3>
        </div>
        <div class="card-body">
          <div class="list-group">
            ${actions.map((action, index) => `
              <div class="list-group-item">
                <div class="d-flex align-items-start">
                  <span class="badge bg-danger me-3" style="font-size: 1.1rem; padding: 8px 12px;">${index + 1}</span>
                  <p class="mb-0 flex-grow-1" style="font-size: 1.05rem;">${action}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render Astrological Alignment
   */
  renderAstrologicalAlignment(alignment) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-secondary text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-star-and-crescent me-2"></i>🔮 Astrological Alignment</h3>
        </div>
        <div class="card-body">
          <div class="row g-3">
            ${alignment.bestPeriod ? `
              <div class="col-md-4">
                <div class="card border-primary">
                  <div class="card-body">
                    <h5>⏰ Best Period</h5>
                    <p class="h4 text-primary">${alignment.bestPeriod}</p>
                  </div>
                </div>
              </div>
            ` : ''}
            ${alignment.favorablePlanets ? `
              <div class="col-md-4">
                <div class="card border-success">
                  <div class="card-body">
                    <h5>🪐 Favorable Planets</h5>
                    <p class="h4 text-success">${alignment.favorablePlanets}</p>
                  </div>
                </div>
              </div>
            ` : ''}
            ${alignment.remedies && Array.isArray(alignment.remedies) ? `
              <div class="col-md-4">
                <div class="card border-warning">
                  <div class="card-header bg-warning text-dark">
                    <h5 class="mb-0">🙏 Remedies</h5>
                  </div>
                  <div class="card-body">
                    <ul>
                      ${alignment.remedies.map(remedy => `<li>${remedy}</li>`).join('')}
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
   * Parse amount string to number
   */
  parseAmount(amountStr) {
    if (!amountStr) return 0;
    const str = amountStr.toString().replace(/[₹,\s]/g, '');
    if (str.includes('Cr') || str.includes('Crore')) {
      return parseFloat(str) * 10000000;
    } else if (str.includes('L') || str.includes('Lakh')) {
      return parseFloat(str) * 100000;
    } else {
      return parseFloat(str) || 0;
    }
  }
};

// Global function for regenerate button
async function regenerateCareer() {
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

    const response = await fetch(`${API_URL}/blueprint/generate/career`, {
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
    const contentContainer = document.getElementById('ai-career-content');
    if (contentContainer && data.content) {
      CareerRenderer.renderContent(contentContainer, data.content);
    }

    alert('Career content regenerated successfully!');
  } catch (error) {
    console.error('Regeneration error:', error);
    alert(`Failed to regenerate: ${error.message}`);
    btn.disabled = false;
    btn.innerHTML = originalHtml;
  }
}

