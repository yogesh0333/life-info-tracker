/**
 * Health Content Renderer
 * Beautiful renderer with progress tracking, meal plans, and exercise schedules
 */

const HealthRenderer = {
  /**
   * Render health content beautifully
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
          <button onclick="regenerateHealth()" class="btn btn-primary mt-2">
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
        <button onclick="regenerateHealth()" class="btn btn-outline-primary" id="regenerate-btn">
          <i class="fas fa-redo me-2"></i>Regenerate Health
        </button>
      </div>
    `;

    // Current Status
    if (content.currentStatus) {
      html += this.renderCurrentStatus(content.currentStatus);
    }

    // Weight Loss Timeline
    if (content.weightLossTimeline && Array.isArray(content.weightLossTimeline)) {
      html += this.renderWeightLossTimeline(content.weightLossTimeline);
    }

    // Meal Plan
    if (content.mealPlan) {
      html += this.renderMealPlan(content.mealPlan);
    }

    // Exercise Plan
    if (content.exercisePlan) {
      html += this.renderExercisePlan(content.exercisePlan);
    }

    // Foods to Avoid
    if (content.foodsToAvoid && Array.isArray(content.foodsToAvoid)) {
      html += this.renderFoodsToAvoid(content.foodsToAvoid);
    }

    // Supplements
    if (content.supplements && Array.isArray(content.supplements)) {
      html += this.renderSupplements(content.supplements);
    }

    // Health Predictions
    if (content.healthPredictions) {
      html += this.renderHealthPredictions(content.healthPredictions);
    }

    // Best Times
    if (content.bestTimes) {
      html += this.renderBestTimes(content.bestTimes);
    }

    // Action Plan
    if (content.actionPlan) {
      html += this.renderActionPlan(content.actionPlan);
    }

    container.innerHTML = html;
    
    // Initialize charts after HTML is rendered
    setTimeout(() => {
      if (content.weightLossTimeline && Array.isArray(content.weightLossTimeline)) {
        this.initWeightLossChart(content.weightLossTimeline);
      }
    }, 100);

    AOS.init({ duration: 1000, once: true });
  },

  /**
   * Render Current Status
   */
  renderCurrentStatus(status) {
    const bmi = status.bmi || 'N/A';
    const bmiColor = bmi < 18.5 ? 'info' : bmi < 25 ? 'success' : bmi < 30 ? 'warning' : 'danger';
    
    return `
      <div class="row mb-5" data-aos="fade-up">
        <div class="col-lg-10 mx-auto">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-header bg-success text-white py-3">
              <h3 class="h4 mb-0"><i class="fas fa-heartbeat me-2"></i>💪 Current Health Status</h3>
            </div>
            <div class="card-body p-4">
              <div class="row g-3">
                <div class="col-md-3 text-center">
                  <div class="p-3 bg-primary text-white rounded-3">
                    <div class="h4 fw-bold">${status.currentWeight || 'N/A'}</div>
                    <small>Current Weight</small>
                  </div>
                </div>
                <div class="col-md-3 text-center">
                  <div class="p-3 bg-info text-white rounded-3">
                    <div class="h4 fw-bold">${status.targetWeight || 'N/A'}</div>
                    <small>Target Weight</small>
                  </div>
                </div>
                <div class="col-md-3 text-center">
                  <div class="p-3 bg-${bmiColor} text-white rounded-3">
                    <div class="h4 fw-bold">${status.bmi || 'N/A'}</div>
                    <small>BMI</small>
                  </div>
                </div>
                <div class="col-md-3 text-center">
                  <div class="p-3 bg-warning text-dark rounded-3">
                    <div class="h4 fw-bold">${status.timeline || 'N/A'}</div>
                    <small>Timeline</small>
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
   * Render Weight Loss Timeline
   */
  renderWeightLossTimeline(timeline) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-primary text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-chart-line me-2"></i>📊 Weight Loss Timeline</h3>
        </div>
        <div class="card-body">
          <div class="chart-container" style="position: relative; height: 400px;">
            <canvas id="weightLossChart"></canvas>
          </div>
          <div class="table-responsive mt-4">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Weight</th>
                  <th>Loss</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${timeline.map(item => {
                  const statusColor = item.status === 'Obese' ? 'danger' : 
                                     item.status === 'Overweight' ? 'warning' : 'success';
                  return `
                    <tr>
                      <td><strong>${item.month || 'N/A'}</strong></td>
                      <td>${item.weight || 'N/A'}</td>
                      <td><span class="badge bg-${statusColor}">${item.loss || 'N/A'}</span></td>
                      <td><span class="badge bg-${statusColor}">${item.status || 'N/A'}</span></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Initialize Weight Loss Chart
   */
  initWeightLossChart(timeline) {
    const ctx = document.getElementById('weightLossChart');
    if (!ctx) return;

    const months = timeline.map(item => item.month || '');
    const weights = timeline.map(item => parseFloat(item.weight) || 0);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Weight (kg)',
          data: weights,
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
            text: 'Weight Loss Progress Over Time'
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            reverse: false,
            title: {
              display: true,
              text: 'Weight (kg)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Month'
            }
          }
        }
      }
    });
  },

  /**
   * Render Meal Plan
   */
  renderMealPlan(mealPlan) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-warning text-dark py-3">
          <h3 class="h4 mb-0"><i class="fas fa-utensils me-2"></i>🍽️ Daily Meal Plan (${mealPlan.dailyCalories || 'N/A'} kcal)</h3>
        </div>
        <div class="card-body">
          <div class="row g-4">
            ${mealPlan.breakfast ? `
              <div class="col-md-6">
                <div class="card border-primary h-100">
                  <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">🌅 Breakfast (${mealPlan.breakfast.time || 'N/A'}) - ${mealPlan.breakfast.calories || 'N/A'} kcal</h5>
                  </div>
                  <div class="card-body">
                    <ul class="list-group list-group-flush">
                      ${(mealPlan.breakfast.items || []).map(item => `<li class="list-group-item">${item}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            ` : ''}
            ${mealPlan.lunch ? `
              <div class="col-md-6">
                <div class="card border-success h-100">
                  <div class="card-header bg-success text-white">
                    <h5 class="mb-0">🍛 Lunch (${mealPlan.lunch.time || 'N/A'}) - ${mealPlan.lunch.calories || 'N/A'} kcal</h5>
                  </div>
                  <div class="card-body">
                    <ul class="list-group list-group-flush">
                      ${(mealPlan.lunch.items || []).map(item => `<li class="list-group-item">${item}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            ` : ''}
            ${mealPlan.dinner ? `
              <div class="col-md-6">
                <div class="card border-info h-100">
                  <div class="card-header bg-info text-white">
                    <h5 class="mb-0">🍲 Dinner (${mealPlan.dinner.time || 'N/A'}) - ${mealPlan.dinner.calories || 'N/A'} kcal</h5>
                  </div>
                  <div class="card-body">
                    <ul class="list-group list-group-flush">
                      ${(mealPlan.dinner.items || []).map(item => `<li class="list-group-item">${item}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            ` : ''}
            ${mealPlan.snacks && Array.isArray(mealPlan.snacks) ? `
              <div class="col-md-6">
                <div class="card border-secondary h-100">
                  <div class="card-header bg-secondary text-white">
                    <h5 class="mb-0">🍎 Snacks</h5>
                  </div>
                  <div class="card-body">
                    ${mealPlan.snacks.map(snack => `
                      <div class="mb-3">
                        <strong>${snack.time || 'N/A'}</strong> - ${snack.calories || 'N/A'} kcal
                        <ul class="mt-2">
                          ${(snack.items || []).map(item => `<li>${item}</li>`).join('')}
                        </ul>
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
   * Render Exercise Plan
   */
  renderExercisePlan(exercisePlan) {
    let html = `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-danger text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-dumbbell me-2"></i>💪 Exercise Plan</h3>
        </div>
        <div class="card-body">
    `;

    // Weekly Schedule
    if (exercisePlan.weeklySchedule && Array.isArray(exercisePlan.weeklySchedule)) {
      html += `
        <h5 class="mb-3">📅 Weekly Schedule</h5>
        <div class="table-responsive mb-4">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Day</th>
                <th>Morning</th>
                <th>Evening</th>
              </tr>
            </thead>
            <tbody>
              ${exercisePlan.weeklySchedule.map(item => `
                <tr>
                  <td><strong>${item.day || 'N/A'}</strong></td>
                  <td>${item.morning || '-'}</td>
                  <td>${item.evening || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    // Cardio
    if (exercisePlan.cardio) {
      html += `
        <div class="card border-primary mb-3">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">🏃 Cardio (${exercisePlan.cardio.duration || 'N/A'})</h5>
          </div>
          <div class="card-body">
            <ul>
              ${(exercisePlan.cardio.activities || []).map(activity => `<li>${activity}</li>`).join('')}
            </ul>
            ${exercisePlan.cardio.targetHeartRate ? `<p><strong>Target Heart Rate:</strong> ${exercisePlan.cardio.targetHeartRate}</p>` : ''}
          </div>
        </div>
      `;
    }

    // Strength
    if (exercisePlan.strength) {
      html += `
        <div class="card border-success mb-3">
          <div class="card-header bg-success text-white">
            <h5 class="mb-0">💪 Strength Training</h5>
          </div>
          <div class="card-body">
            ${exercisePlan.strength.upperBody ? `
              <h6>Upper Body:</h6>
              <ul>
                ${(exercisePlan.strength.upperBody || []).map(ex => `<li>${ex}</li>`).join('')}
              </ul>
            ` : ''}
            ${exercisePlan.strength.lowerBody ? `
              <h6>Lower Body:</h6>
              <ul>
                ${(exercisePlan.strength.lowerBody || []).map(ex => `<li>${ex}</li>`).join('')}
              </ul>
            ` : ''}
            ${exercisePlan.strength.fullBody ? `
              <h6>Full Body:</h6>
              <ul>
                ${(exercisePlan.strength.fullBody || []).map(ex => `<li>${ex}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        </div>
      `;
    }

    // Yoga
    if (exercisePlan.yoga) {
      html += `
        <div class="card border-info">
          <div class="card-header bg-info text-white">
            <h5 class="mb-0">🧘 Yoga (${exercisePlan.yoga.frequency || 'N/A'})</h5>
          </div>
          <div class="card-body">
            <ul>
              ${(exercisePlan.yoga.asanas || []).map(asana => `<li>${asana}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    }

    html += `
        </div>
      </div>
    `;

    return html;
  },

  /**
   * Render Foods to Avoid
   */
  renderFoodsToAvoid(foods) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5 border-danger" style="border-width: 3px !important;" data-aos="fade-up">
        <div class="card-header bg-danger text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-ban me-2"></i>🚫 Foods to Avoid</h3>
        </div>
        <div class="card-body">
          <div class="row g-3">
            ${foods.map(food => `
              <div class="col-md-4">
                <div class="card border-danger">
                  <div class="card-body text-center">
                    <i class="fas fa-times-circle text-danger fa-2x mb-2"></i>
                    <p class="mb-0">${food}</p>
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
   * Render Supplements
   */
  renderSupplements(supplements) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-info text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-pills me-2"></i>💊 Supplements</h3>
        </div>
        <div class="card-body">
          <div class="row g-3">
            ${supplements.map(supplement => `
              <div class="col-md-6">
                <div class="card border-info">
                  <div class="card-body">
                    <h5>${supplement.name || 'N/A'}</h5>
                    <p><strong>Dosage:</strong> ${supplement.dosage || 'N/A'}</p>
                    <p><strong>Timing:</strong> ${supplement.timing || 'N/A'}</p>
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
   * Render Health Predictions
   */
  renderHealthPredictions(predictions) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-warning text-dark py-3">
          <h3 class="h4 mb-0"><i class="fas fa-crystal-ball me-2"></i>🔮 Health Predictions</h3>
        </div>
        <div class="card-body">
          ${predictions.criticalPeriods ? `
            <div class="alert alert-warning">
              <h5>⚠️ Critical Periods</h5>
              <ul>
                ${(Array.isArray(predictions.criticalPeriods) ? predictions.criticalPeriods : []).map(period => `<li>${period}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          ${predictions.planetaryInfluences ? `
            <div class="alert alert-info">
              <h5>🪐 Planetary Influences</h5>
              <p>${predictions.planetaryInfluences}</p>
            </div>
          ` : ''}
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
          <h3 class="h4 mb-0"><i class="fas fa-clock me-2"></i>⏰ Best Times</h3>
        </div>
        <div class="card-body">
          <div class="row g-3">
            ${times.workout ? `
              <div class="col-md-6">
                <div class="card border-success">
                  <div class="card-body">
                    <h5>💪 Workout</h5>
                    <p class="mb-0">${times.workout}</p>
                  </div>
                </div>
              </div>
            ` : ''}
            ${times.meals ? `
              <div class="col-md-6">
                <div class="card border-primary">
                  <div class="card-body">
                    <h5>🍽️ Meals</h5>
                    <p class="mb-0">${times.meals}</p>
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
   * Render Action Plan
   */
  renderActionPlan(actionPlan) {
    return `
      <div class="card shadow-lg border-0 rounded-4 mb-5" data-aos="fade-up">
        <div class="card-header bg-primary text-white py-3">
          <h3 class="h4 mb-0"><i class="fas fa-tasks me-2"></i>✅ Action Plan</h3>
        </div>
        <div class="card-body">
          <div class="row g-4">
            ${Object.entries(actionPlan).map(([key, value]) => `
              <div class="col-md-4">
                <div class="card border-primary">
                  <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">${key.charAt(0).toUpperCase() + key.slice(1)}</h5>
                  </div>
                  <div class="card-body">
                    <ul>
                      ${(Array.isArray(value) ? value : []).map(item => `<li>${item}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
};

// Global function for regenerate button
async function regenerateHealth() {
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

    const response = await fetch(`${API_URL}/blueprint/generate/health`, {
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
    const contentContainer = document.getElementById('ai-health-content');
    if (contentContainer && data.content) {
      HealthRenderer.renderContent(contentContainer, data.content);
    }

    alert('Health content regenerated successfully!');
  } catch (error) {
    console.error('Regeneration error:', error);
    alert(`Failed to regenerate: ${error.message}`);
    btn.disabled = false;
    btn.innerHTML = originalHtml;
  }
}

