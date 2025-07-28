import React from 'react';

const Statistics = ({ urls, clickAnalytics, statistics }) => {
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      padding: '30px',
      marginBottom: '30px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      transition: 'transform 0.3s ease'
    },
    title: {
      fontSize: '1.8rem',
      marginBottom: '25px',
      color: '#333',
      fontWeight: '600',
      textAlign: 'center'
    },
    sectionTitle: {
      fontSize: '1.3rem',
      marginBottom: '20px',
      color: '#333',
      fontWeight: '600'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '10px'
    },
    statCard: {
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      borderRadius: '15px',
      padding: '25px 20px',
      textAlign: 'center',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    statIcon: {
      fontSize: '2rem',
      opacity: 0.8
    },
    statContent: {
      flex: 1,
      textAlign: 'left'
    },
    statNumber: {
      fontSize: '2.2rem',
      fontWeight: 'bold',
      marginBottom: '5px',
      lineHeight: 1
    },
    statLabel: {
      color: '#666',
      fontSize: '0.9rem',
      fontWeight: '500'
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '30px'
    },
    tableContainer: {
      overflowX: 'auto',
      borderRadius: '12px',
      border: '1px solid #e1e5e9'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      background: 'white'
    },
    th: {
      padding: '16px 12px',
      textAlign: 'left',
      background: '#f8f9fa',
      fontWeight: '600',
      color: '#333',
      borderBottom: '2px solid #e1e5e9',
      fontSize: '0.9rem'
    },
    td: {
      padding: '16px 12px',
      borderBottom: '1px solid #f1f3f4'
    },
    urlInfo: {
      display: 'flex',
      flexDirection: 'column'
    },
    shortcode: {
      fontWeight: 'bold',
      marginBottom: '4px'
    },
    originalUrl: {
      fontSize: '0.8rem',
      color: '#666'
    },
    clickCount: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    clickIcon: {
      fontSize: '1rem'
    },
    dateInfo: {
      display: 'flex',
      flexDirection: 'column'
    },
    time: {
      fontSize: '0.8rem',
      color: '#666'
    },
    statusChip: {
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: '500'
    },
    statusActive: {
      backgroundColor: '#e8f5e8',
      color: '#2e7d32'
    },
    statusExpired: {
      backgroundColor: '#ffebee',
      color: '#c62828'
    },
    analyticsList: {
      maxHeight: '400px',
      overflowY: 'auto'
    },
    analyticsItem: {
      padding: '16px',
      borderBottom: '1px solid #eee',
      transition: 'background-color 0.3s ease'
    },
    analyticsContent: {
      display: 'flex',
      flexDirection: 'column'
    },
    analyticsShortcode: {
      fontWeight: 'bold',
      marginBottom: '8px',
      color: '#667eea'
    },
    analyticsDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    analyticsLocation: {
      fontSize: '0.9rem',
      color: '#666'
    },
    analyticsSource: {
      fontSize: '0.9rem',
      color: '#666'
    },
    analyticsTime: {
      fontSize: '0.8rem',
      color: '#999'
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px',
      color: '#666'
    },
    emptyIcon: {
      fontSize: '3rem',
      marginBottom: '16px'
    },
    emptyText: {
      fontSize: '1.1rem',
      marginBottom: '8px',
      fontWeight: '500'
    },
    emptySubtext: {
      fontSize: '0.9rem'
    }
  };

  const StatCard = ({ title, value, color, icon }) => (
    <div style={{...styles.statCard}} className="stat-card">
      <div style={{...styles.statIcon, color}}>
        {icon}
      </div>
      <div style={styles.statContent}>
        <div style={{...styles.statNumber, color}}>
          {value}
        </div>
        <div style={styles.statLabel}>
          {title}
        </div>
      </div>
    </div>
  );

  const URLTable = ({ urls }) => (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Short URL</th>
            <th style={styles.th}>Clicks</th>
            <th style={styles.th}>Created</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <tr key={url.id} className="table-row">
              <td style={styles.td}>
                <div style={styles.urlInfo}>
                  <div style={styles.shortcode}>{url.shortcode}</div>
                  <div style={styles.originalUrl}>
                    {url.originalUrl.length > 30 
                      ? url.originalUrl.substring(0, 30) + '...' 
                      : url.originalUrl}
                  </div>
                </div>
              </td>
              <td style={styles.td}>
                <div style={styles.clickCount}>
                  <span style={styles.clickIcon}>👁️</span>
                  {url.clickCount}
                </div>
              </td>
              <td style={styles.td}>
                <div style={styles.dateInfo}>
                  <div>{url.createdAt.toLocaleDateString()}</div>
                  <div style={styles.time}>
                    {url.createdAt.toLocaleTimeString()}
                  </div>
                </div>
              </td>
              <td style={styles.td}>
                <span style={{
                  ...styles.statusChip,
                  ...(new Date() > new Date(url.expiryDate) ? styles.statusExpired : styles.statusActive)
                }}>
                  {new Date() > new Date(url.expiryDate) ? 'Expired' : 'Active'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const ClickAnalyticsList = ({ analytics }) => (
    <div style={styles.analyticsList}>
      {analytics.slice(0, 10).map((click) => (
        <div key={click.id} style={styles.analyticsItem} className="analytics-item">
          <div style={styles.analyticsContent}>
            <div style={styles.analyticsShortcode}>/{click.shortcode}</div>
            <div style={styles.analyticsDetails}>
              <div style={styles.analyticsLocation}>
                📍 {click.geographicLocation}
              </div>
              <div style={styles.analyticsSource}>
                🔗 {click.source}
              </div>
              <div style={styles.analyticsTime}>
                {click.timestamp.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={styles.container}>
      <style>
        {`
          .statistics .stat-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }
          
          .statistics .table-row:hover {
            background-color: #f8f9fa;
          }
          
          .statistics .analytics-item:hover {
            background-color: #f8f9fa;
          }
          
          .statistics .card:hover {
            transform: translateY(-2px);
          }
          
          @media (max-width: 768px) {
            .statistics .main-grid {
              grid-template-columns: 1fr;
            }
            
            .statistics .stats-grid {
              grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            }
            
            .statistics .stat-card {
              flex-direction: column;
              text-align: center;
              gap: 10px;
            }
            
            .statistics .stat-content {
              text-align: center;
            }
            
            .statistics .table-container {
              font-size: 0.8rem;
            }
          }
        `}
      </style>
      
      <div className="statistics">
        {/* Statistics Overview */}
        <div style={styles.card} className="card">
          <h2 style={styles.title}>
            📈 Statistics Overview
          </h2>
          
          <div style={styles.statsGrid}>
            <StatCard
              title="Total URLs"
              value={statistics.totalUrls}
              color="#1976d2"
              icon="🔗"
            />
            <StatCard
              title="Total Clicks"
              value={statistics.totalClicks}
              color="#2e7d32"
              icon="👆"
            />
            <StatCard
              title="Active URLs"
              value={statistics.activeUrls}
              color="#1565c0"
              icon="✅"
            />
            <StatCard
              title="Avg Clicks/URL"
              value={statistics.averageClicksPerUrl}
              color="#f57c00"
              icon="📊"
            />
          </div>
        </div>

        <div style={styles.mainGrid} className="main-grid">
          {/* Detailed URL Statistics */}
          <div style={styles.card} className="card">
            <h3 style={styles.sectionTitle}>URL Performance Details</h3>
            
            {urls.length > 0 ? (
              <URLTable urls={urls} />
            ) : (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📊</div>
                <div style={styles.emptyText}>No URL data available yet.</div>
                <div style={styles.emptySubtext}>
                  Start shortening URLs to see performance metrics here.
                </div>
              </div>
            )}
          </div>

          {/* Click Analytics */}
          <div style={styles.card} className="card">
            <h3 style={styles.sectionTitle}>
              📍 Recent Click Analytics
            </h3>
            
            {clickAnalytics.length > 0 ? (
              <ClickAnalyticsList analytics={clickAnalytics} />
            ) : (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📍</div>
                <div style={styles.emptyText}>No click data yet.</div>
                <div style={styles.emptySubtext}>
                  Share your short URLs to see analytics!
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;