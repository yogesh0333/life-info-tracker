/**
 * Finance Content Renderer
 * Beautiful renderer with charts, graphs, and interactive elements
 */

const FinanceRenderer = {
  /**
   * Render finance content beautifully
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
          <button onclick="regenerateFinance()" class="btn btn-primary mt-2">
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
        <button onclick="regenerateFinance()" class="btn btn-outline-primary" id="regenerate-btn">
          <i class="fas fa-redo me-2"></i>Regenerate Finance
        </button>
      </div>
    `;

    // Current Status Cards
    if (content.currentStatus) {
      html += this.renderCurrentStatus(content.currentStatus);
    }

    // Income Trajectory Chart
    if (content.incomeTrajectory && Array.isArray(content.incomeTrajectory)) {
      html += this.renderIncomeTrajectory(content.incomeTrajectory);
    }

    // Investment Strategy
    if (content.investmentStrategy) {
      html += this.renderInvestmentStrategy(content.investmentStrategy);
    }

    // Net Worth Milestones
    if (content.netWorthMilestones && Array.isArray(content.netWorthMilestones)) {
      html += this.renderMilestones(content.netWorthMilestones);
    }

    // Budget Plan
    if (content.budgetPlan) {
      html += this.renderBudgetPlan(content.budgetPlan);
    }

    // Financial Remedies
    if (content.financialRemedies) {
      html += this.renderFinancialRemedies(content.financialRemedies);
    }

    // Best Times
    if (content.bestTimes) {
      html += this.renderBestTimes(content.bestTimes);
    }

    // Target Net Worth
    if (content.targetNetWorth) {
      html += this.renderTargetNetWorth(content.targetNetWorth);
    }

    container.innerHTML = html;
    
    // Initialize charts after HTML is rendered
    setTimeout(() => {
      if (content.incomeTrajectory && Array.isArray(content.incomeTrajectory)) {
        this.initIncomeChart(content.incomeTrajectory);
      }
      if (content.budgetPlan) {
        this.initBudgetChart(content.budgetPlan);
      }
      if (content.investmentStrategy) {
        this.initInvestmentChart(content.investmentStrategy);
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
              <h3 class="h4 mb-0"><i class="fas fa-chart-line me-2"></i>💰 Current Financial Status</h3>
            </div>
            <div class="card-body p-4">
              <div class="row g-3">
                <div class="col-md-3 text-center">
                  <div class="p-3 bg-primary text-white rounded-3">
                    <div class="h4 fw-bold">${status.currentSalary || 'N/A'}</div>
                    <small>Current Salary</small>
                  </div>
                </div>
                <div class="col-md-3 text-center">
                  <div class="p-3 bg-success text-white rounded-3">
                    <div class="h4 fw-bold">${status.monthlyIncome || 'N/A'}</div>
                    <small>Monthly Income</small>
                  </div>
                </div>
                <div class="col-md-3 text-center">
                  <div class="p-3 bg-warning text-dark rounded-3">
                    <div class="h4 fw-bold">${status.currentSavings || 'N/A'}</div>
                    <small>Monthly Savings</small>
                  </div>
                </div>
                <div class="col-md-3 text-center">
                  <div class="p-3 bg-info text-white rounded-3">
                    <div class="h4 fw-bold">${status.currentNetWorth || 'N/A'}</div>
                    <small>Current Net Worth</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render Income Trajectory
   */
  renderIncomeTrajectory(trajectory) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-success text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-chart-area me-2"></i>📈 Income Trajectory (2025-2056)</h3>
        </div>
        <div class="card-body">
          <div class="chart-container" style="position: relative; height: 400px;">
            <canvas id="incomeTrajectoryChart"></canvas>
          </div>
          <div class="table-responsive mt-4">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Age</th>
                  <th>Year</th>
                  <th>Job Income</th>
                  <th>Business</th>
                  <th>Investments</th>
                  <th>Total Income</th>
                  <th>Net Worth</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                ${trajectory.map(item => `
                  <tr>
                    <td>${item.age || 'N/A'}</td>
                    <td>${item.year || 'N/A'}</td>
                    <td>${item.jobIncome || '-'}</td>
                    <td>${item.businessIncome || '-'}</td>
                    <td>${item.investmentIncome || '-'}</td>
                    <td><strong>${item.totalIncome || 'N/A'}</strong></td>
                    <td><strong class="text-success">${item.netWorth || 'N/A'}</strong></td>
                    <td>${item.role || 'N/A'} ${item.milestone ? '🏆' : ''}</td>
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
   * Initialize Income Chart
   */
  initIncomeChart(trajectory) {
    const ctx = document.getElementById('incomeTrajectoryChart');
    if (!ctx) return;

    const years = trajectory.map(item => item.year || item.age);
    const jobIncome = trajectory.map(item => this.parseAmount(item.jobIncome) || 0);
    const businessIncome = trajectory.map(item => this.parseAmount(item.businessIncome) || 0);
    const totalIncome = trajectory.map(item => this.parseAmount(item.totalIncome) || 0);
    const netWorth = trajectory.map(item => this.parseAmount(item.netWorth) || 0);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Job Income',
            data: jobIncome,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1
          },
          {
            label: 'Business Income',
            data: businessIncome,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.1
          },
          {
            label: 'Total Income',
            data: totalIncome,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.1,
            borderWidth: 3
          },
          {
            label: 'Net Worth',
            data: netWorth,
            borderColor: 'rgb(255, 206, 86)',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            tension: 0.1,
            borderWidth: 2,
            borderDash: [5, 5]
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
            text: 'Financial Growth Over Time'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
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
   * Render Investment Strategy
   */
  renderInvestmentStrategy(strategy) {
    let html = `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-info text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-piggy-bank me-2"></i>💎 Investment Strategy</h3>
        </div>
        <div class="card-body">
          <div class="row mb-4">
            <div class="col-md-6">
              <div class="chart-container" style="position: relative; height: 300px;">
                <canvas id="investmentAllocationChart"></canvas>
              </div>
            </div>
            <div class="col-md-6">
    `;

    // Stocks
    if (strategy.stocks) {
      html += `
        <div class="card border-primary mb-3">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">📊 Stocks (${strategy.stocks.allocation || 'N/A'})</h5>
          </div>
          <div class="card-body">
            <p><strong>Monthly Investment:</strong> ${strategy.stocks.monthlyInvestment || 'N/A'}</p>
            <p><strong>Target:</strong> ${strategy.stocks.target || 'N/A'}</p>
            <ul>
              ${(strategy.stocks.recommendations || []).map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    }

    // Mutual Funds
    if (strategy.mutualFunds) {
      html += `
        <div class="card border-success mb-3">
          <div class="card-header bg-success text-white">
            <h5 class="mb-0">📈 Mutual Funds (${strategy.mutualFunds.allocation || 'N/A'})</h5>
          </div>
          <div class="card-body">
            <p><strong>Monthly Investment:</strong> ${strategy.mutualFunds.monthlyInvestment || 'N/A'}</p>
            <ul>
              ${(strategy.mutualFunds.recommendations || []).map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    }

    // Real Estate
    if (strategy.realEstate) {
      html += `
        <div class="card border-warning mb-3">
          <div class="card-header bg-warning text-dark">
            <h5 class="mb-0">🏠 Real Estate (${strategy.realEstate.allocation || 'N/A'})</h5>
          </div>
          <div class="card-body">
            <p><strong>Target Year:</strong> ${strategy.realEstate.targetYear || 'N/A'}</p>
            <ul>
              ${(strategy.realEstate.recommendations || []).map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    }

    // Gold
    if (strategy.gold) {
      html += `
        <div class="card border-warning mb-3">
          <div class="card-header bg-warning text-dark">
            <h5 class="mb-0">🥇 Gold (${strategy.gold.allocation || 'N/A'})</h5>
          </div>
          <div class="card-body">
            <p><strong>Monthly Investment:</strong> ${strategy.gold.monthlyInvestment || 'N/A'}</p>
          </div>
        </div>
      `;
    }

    html += `
            </div>
          </div>
        </div>
      </div>
    `;

    return html;
  },

  /**
   * Initialize Investment Chart
   */
  initInvestmentChart(strategy) {
    const ctx = document.getElementById('investmentAllocationChart');
    if (!ctx) return;

    const labels = [];
    const data = [];
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

    if (strategy.stocks) {
      labels.push('Stocks');
      data.push(parseFloat(strategy.stocks.allocation) || 0);
    }
    if (strategy.mutualFunds) {
      labels.push('Mutual Funds');
      data.push(parseFloat(strategy.mutualFunds.allocation) || 0);
    }
    if (strategy.realEstate) {
      labels.push('Real Estate');
      data.push(parseFloat(strategy.realEstate.allocation) || 0);
    }
    if (strategy.gold) {
      labels.push('Gold');
      data.push(parseFloat(strategy.gold.allocation) || 0);
    }

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Investment Allocation'
          }
        }
      }
    });
  },

  /**
   * Render Budget Plan
   */
  renderBudgetPlan(budget) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-warning text-dark py-3">
          <h3 class="h4 mb-0"><i class="fas fa-wallet me-2"></i>💵 Monthly Budget Plan</h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <div class="chart-container" style="position: relative; height: 300px;">
                <canvas id="budgetChart"></canvas>
              </div>
            </div>
            <div class="col-md-6">
              <h5>Monthly Income: <strong class="text-success">${budget.monthlyIncome || 'N/A'}</strong></h5>
              <h5>Savings Target: <strong class="text-primary">${budget.savingsTarget || 'N/A'}</strong></h5>
              <div class="mt-4">
                ${budget.expenses ? Object.entries(budget.expenses).map(([key, value]) => `
                  <div class="d-flex justify-content-between mb-2">
                    <span><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong></span>
                    <span class="text-primary">${value}</span>
                  </div>
                `).join('') : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Initialize Budget Chart
   */
  initBudgetChart(budget) {
    const ctx = document.getElementById('budgetChart');
    if (!ctx || !budget.expenses) return;

    const labels = Object.keys(budget.expenses);
    const data = Object.values(budget.expenses).map(v => this.parseAmount(v) || 0);
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Monthly Expenses Breakdown'
          }
        }
      }
    });
  },

  /**
   * Render Milestones
   */
  renderMilestones(milestones) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-dark text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-flag-checkered me-2"></i>🎯 Net Worth Milestones</h3>
        </div>
        <div class="card-body">
          <div class="row g-4">
            ${milestones.map((milestone, index) => `
              <div class="col-md-4">
                <div class="card border-primary h-100">
                  <div class="card-body text-center">
                    <div class="h2 mb-3">${index + 1}</div>
                    <h5>Age ${milestone.age || 'N/A'}</h5>
                    <p class="text-muted">${milestone.year || 'N/A'}</p>
                    <div class="h4 text-primary fw-bold">${milestone.target || 'N/A'}</div>
                    <small class="text-muted">${milestone.milestone || ''}</small>
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
   * Render Financial Remedies
   */
  renderFinancialRemedies(remedies) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-secondary text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-hands-praying me-2"></i>🙏 Financial Remedies</h3>
        </div>
        <div class="card-body">
          <div class="row g-4">
            ${remedies.daan ? `
              <div class="col-md-4">
                <div class="card border-warning">
                  <div class="card-header bg-warning text-dark">
                    <h5 class="mb-0">🎁 Daan (Charity)</h5>
                  </div>
                  <div class="card-body">
                    <ul>
                      ${(Array.isArray(remedies.daan) ? remedies.daan : []).map(item => `<li>${item}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            ` : ''}
            ${remedies.puja ? `
              <div class="col-md-4">
                <div class="card border-primary">
                  <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">🕉️ Puja</h5>
                  </div>
                  <div class="card-body">
                    <ul>
                      ${(Array.isArray(remedies.puja) ? remedies.puja : []).map(item => `<li>${item}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            ` : ''}
            ${remedies.gemstones ? `
              <div class="col-md-4">
                <div class="card border-info">
                  <div class="card-header bg-info text-white">
                    <h5 class="mb-0">💎 Gemstones</h5>
                  </div>
                  <div class="card-body">
                    <ul>
                      ${(Array.isArray(remedies.gemstones) ? remedies.gemstones : []).map(item => `<li>${item}</li>`).join('')}
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
   * Render Best Times
   */
  renderBestTimes(times) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-success text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-calendar-alt me-2"></i>📅 Best Times for Financial Decisions</h3>
        </div>
        <div class="card-body">
          <div class="row g-3">
            ${times.majorInvestments ? `
              <div class="col-md-6">
                <div class="card border-success">
                  <div class="card-body">
                    <h5>💰 Major Investments</h5>
                    <p>${times.majorInvestments}</p>
                  </div>
                </div>
              </div>
            ` : ''}
            ${times.propertyPurchase ? `
              <div class="col-md-6">
                <div class="card border-warning">
                  <div class="card-body">
                    <h5>🏠 Property Purchase</h5>
                    <p>${times.propertyPurchase}</p>
                  </div>
                </div>
              </div>
            ` : ''}
            ${times.businessStart ? `
              <div class="col-md-6">
                <div class="card border-primary">
                  <div class="card-body">
                    <h5>🚀 Business Start</h5>
                    <p>${times.businessStart}</p>
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
   * Render Target Net Worth
   */
  renderTargetNetWorth(targets) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-primary text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-bullseye me-2"></i>🎯 Target Net Worth</h3>
        </div>
        <div class="card-body">
          <div class="row g-4">
            ${targets.age40 ? `
              <div class="col-md-4">
                <div class="card border-info text-center">
                  <div class="card-body">
                    <h5>Age 40</h5>
                    <div class="h3 text-info fw-bold">${targets.age40}</div>
                  </div>
                </div>
              </div>
            ` : ''}
            ${targets.age50 ? `
              <div class="col-md-4">
                <div class="card border-warning text-center">
                  <div class="card-body">
                    <h5>Age 50</h5>
                    <div class="h3 text-warning fw-bold">${targets.age50}</div>
                  </div>
                </div>
              </div>
            ` : ''}
            ${targets.age60 ? `
              <div class="col-md-4">
                <div class="card border-success text-center">
                  <div class="card-body">
                    <h5>Age 60</h5>
                    <div class="h3 text-success fw-bold">${targets.age60}</div>
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
async function regenerateFinance() {
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

    const response = await fetch(`${API_URL}/blueprint/generate/finance`, {
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
    const contentContainer = document.getElementById('ai-finance-content');
    if (contentContainer && data.content) {
      FinanceRenderer.renderContent(contentContainer, data.content);
    }

    alert('Finance content regenerated successfully!');
  } catch (error) {
    console.error('Regeneration error:', error);
    alert(`Failed to regenerate: ${error.message}`);
    btn.disabled = false;
    btn.innerHTML = originalHtml;
  }
}

