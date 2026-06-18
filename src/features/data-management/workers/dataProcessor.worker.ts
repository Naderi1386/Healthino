import type { DailyLog, UserProfile } from '../../../core/db/types';

export interface WorkerInputPayload {
  dailyLogs: DailyLog[];
  userProfile: UserProfile;
}

export interface WorkerOutputPayload {
  htmlReport: string;
}

// Listen to message events from the main thread
self.addEventListener('message', (event: MessageEvent<WorkerInputPayload>) => {
  const { dailyLogs, userProfile } = event.data;

  // 1. Calculations & Metrics compilation
  const totalDays = dailyLogs.length;
  let totalWater = 0;
  let usefulCount = 0;
  let neutralCount = 0;
  let harmfulCount = 0;
  const tagFrequency: Record<string, number> = {};

  dailyLogs.forEach((log) => {
    totalWater += log.waterGlasses;
    if (log.tags) {
      log.tags.forEach((tag) => {
        // Frequency check
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;

        // Category categorization
        if (tag.startsWith('🟢')) {
          usefulCount++;
        } else if (tag.startsWith('🟡')) {
          neutralCount++;
        } else if (tag.startsWith('🔴')) {
          harmfulCount++;
        }
      });
    }
  });

  const avgWater = totalDays > 0 ? (totalWater / totalDays).toFixed(1) : '0.0';

  // Find top 3 frequent tags
  const sortedTags = Object.entries(tagFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Calculate BMI
  const heightInMeters = userProfile.height / 100;
  const bmi = heightInMeters > 0 ? (userProfile.weight / (heightInMeters * heightInMeters)).toFixed(1) : '0.0';

  // 2. Compile visual representation elements (SVG or styled divs)
  const totalTags = usefulCount + neutralCount + harmfulCount;
  const usefulPct = totalTags > 0 ? Math.round((usefulCount / totalTags) * 100) : 0;
  const neutralPct = totalTags > 0 ? Math.round((neutralCount / totalTags) * 100) : 0;
  const harmfulPct = totalTags > 0 ? Math.round((harmfulCount / totalTags) * 100) : 0;

  // 3. Assemble Premium HTML report layout conforming to brandguidelines
  const reportHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Healthino - Monthly Health Review</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        body {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          background-color: #F9F6F0;
          color: #1C2421;
          margin: 0;
          padding: 40px;
          line-height: 1.6;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          background-color: #FFFFFF;
          padding: 48px;
          border-radius: 24px;
          box-shadow: 0 4px 20px -4px rgba(28, 36, 33, 0.06);
          border: 1px solid rgba(28, 36, 33, 0.05);
        }

        header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid rgba(74, 107, 93, 0.1);
          padding-bottom: 24px;
          margin-bottom: 32px;
        }

        .logo-area h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 800;
          color: #4A6B5D;
          letter-spacing: -0.5px;
        }

        .logo-area p {
          margin: 4px 0 0 0;
          font-size: 14px;
          color: rgba(28, 36, 33, 0.6);
        }

        .date-badge {
          background-color: rgba(74, 107, 93, 0.08);
          color: #4A6B5D;
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .profile-card {
          background-color: rgba(28, 36, 33, 0.02);
          border: 1px solid rgba(28, 36, 33, 0.04);
          padding: 16px;
          border-radius: 16px;
          text-align: center;
        }

        .profile-card span {
          display: block;
          font-size: 11px;
          text-transform: uppercase;
          font-weight: 700;
          color: rgba(28, 36, 33, 0.4);
          letter-spacing: 0.5px;
        }

        .profile-card strong {
          display: block;
          font-size: 18px;
          margin-top: 4px;
          color: #1C2421;
        }

        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #1C2421;
          margin-top: 32px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        .metric-box {
          border: 1px solid rgba(28, 36, 33, 0.08);
          border-radius: 20px;
          padding: 24px;
          background-color: #FFFFFF;
        }

        .metric-val {
          font-size: 36px;
          font-weight: 800;
          color: #4A6B5D;
          margin: 8px 0;
        }

        .distribution-bar {
          display: flex;
          height: 24px;
          border-radius: 12px;
          overflow: hidden;
          margin: 16px 0;
        }

        .dist-segment {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          font-size: 11px;
          font-weight: 700;
        }

        .bg-useful { background-color: #4A6B5D; }
        .bg-neutral { background-color: #E5A93C; }
        .bg-harmful { background-color: #C95A49; }

        .legend {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 600;
          color: rgba(28, 36, 33, 0.7);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
        }

        th {
          text-align: left;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: rgba(28, 36, 33, 0.4);
          padding: 8px 16px;
          border-bottom: 2px solid rgba(28, 36, 33, 0.05);
        }

        td {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(28, 36, 33, 0.05);
          font-size: 14px;
        }

        .tag-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
        }

        .footer {
          margin-top: 48px;
          text-align: center;
          font-size: 11px;
          color: rgba(28, 36, 33, 0.4);
          border-top: 1px solid rgba(28, 36, 33, 0.05);
          padding-top: 24px;
        }

        @media print {
          body {
            background-color: #FFFFFF;
            padding: 0;
          }
          .container {
            box-shadow: none;
            border: none;
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <div class="logo-area">
            <h1>Healthino</h1>
            <p>Your local-first wellness companion</p>
          </div>
          <div class="date-badge">
            Report Compiled: ${new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        <div class="profile-grid">
          <div class="profile-card">
            <span>Goal</span>
            <strong>${userProfile.goal}</strong>
          </div>
          <div class="profile-card">
            <span>Weight / Height</span>
            <strong>${userProfile.weight}kg / ${userProfile.height}cm</strong>
          </div>
          <div class="profile-card">
            <span>Age / Gender</span>
            <strong>${userProfile.age} yrs / ${userProfile.gender}</strong>
          </div>
          <div class="profile-card">
            <span>Calculated BMI</span>
            <strong>${bmi}</strong>
          </div>
        </div>

        <div class="section-title">Metrics & Habit Portfolios</div>
        
        <div class="metrics-grid">
          <div class="metric-box">
            <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: rgba(28,36,33,0.5);">Hydration Average</span>
            <div class="metric-val">${avgWater} <span style="font-size: 16px; font-weight: 500; color: rgba(28,36,33,0.6);">glasses/day</span></div>
            <p style="margin: 0; font-size: 12px; color: rgba(28,36,33,0.6);">Total of ${totalWater} glasses consumed across ${totalDays} logged days.</p>
          </div>

          <div class="metric-box">
            <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: rgba(28,36,33,0.5);">Logged Wellness Actions</span>
            <div class="metric-val">${totalTags} <span style="font-size: 16px; font-weight: 500; color: rgba(28,36,33,0.6);">total logged</span></div>
            <p style="margin: 0; font-size: 12px; color: rgba(28,36,33,0.6);">Average of ${(totalDays > 0 ? totalTags / totalDays : 0).toFixed(1)} habits/day.</p>
          </div>
        </div>

        <div class="section-title">Habit Category Distribution</div>
        <div style="border: 1px solid rgba(28,36,33,0.08); border-radius: 20px; padding: 24px; margin-bottom: 32px;">
          <div class="distribution-bar">
            ${usefulPct > 0 ? `<div class="dist-segment bg-useful" style="width: ${usefulPct}%;">${usefulPct}%</div>` : ''}
            ${neutralPct > 0 ? `<div class="dist-segment bg-neutral" style="width: ${neutralPct}%;">${neutralPct}%</div>` : ''}
            ${harmfulPct > 0 ? `<div class="dist-segment bg-harmful" style="width: ${harmfulPct}%;">${harmfulPct}%</div>` : ''}
          </div>
          <div class="legend">
            <div class="legend-item">
              <span class="legend-dot bg-useful"></span>
              <span>🟢 Useful (${usefulCount})</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot bg-neutral"></span>
              <span>🟡 Neutral (${neutralCount})</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot bg-harmful"></span>
              <span>🔴 Harmful (${harmfulCount})</span>
            </div>
          </div>
        </div>

        <div class="section-title">Frequently Logged Habits</div>
        <div style="border: 1px solid rgba(28,36,33,0.08); border-radius: 20px; overflow: hidden; padding-bottom: 8px;">
          <table>
            <thead>
              <tr>
                <th>Wellness Habit Tag</th>
                <th style="text-align: right;">Occurrences</th>
              </tr>
            </thead>
            <tbody>
              ${
                sortedTags.length > 0
                  ? sortedTags
                      .map(
                        ([tag, count]) => `
                <tr>
                  <td>
                    <span class="tag-badge ${
                      tag.includes('🟢')
                        ? 'bg-useful'
                        : tag.includes('🟡')
                        ? 'bg-neutral'
                        : 'bg-harmful'
                    }" style="color: #FFFFFF;">
                      ${tag}
                    </span>
                  </td>
                  <td style="text-align: right; font-weight: 700;">${count} times</td>
                </tr>
              `
                      )
                      .join('')
                  : '<tr><td colspan="2" style="text-align: center; color: rgba(28,36,33,0.4);">No wellness tags logged in database yet.</td></tr>'
              }
            </tbody>
          </table>
        </div>

        <div class="footer">
          <p>Healthino is a local-first, zero-network health application. All metrics calculation and layout generation were completed purely in the background thread on this device.</p>
          <p>&copy; ${new Date().getFullYear()} Healthino. Data Autonomy and Privacy Assured.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Send the HTML report payload back to the main thread
  self.postMessage({ htmlReport: reportHtml });
});
