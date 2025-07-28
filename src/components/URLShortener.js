import React, { useState } from 'react';

const URLShortener = ({ 
  urls, 
  onShortenUrl, 
  onCopyToClipboard, 
  onRedirect, 
  onError, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    currentUrl: '',
    customShortcode: '',
    validityPeriod: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateUrl = (url) => {
    if (!url) return 'URL is required';
    if (url.length > 2048) return 'URL is too long (maximum 2048 characters)';
    
    const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    if (!urlPattern.test(url)) return 'Please enter a valid URL (must start with http:// or https://)';
    
    const maliciousPatterns = ['javascript:', 'data:', 'file:', 'ftp://'];
    if (maliciousPatterns.some(pattern => url.toLowerCase().includes(pattern))) {
      return 'URL contains potentially unsafe protocol';
    }
    
    return '';
  };


  const validateShortcode = (shortcode) => {
    if (!shortcode) return '';
    
    if (shortcode.length < 3 || shortcode.length > 10) {
      return 'Custom shortcode must be 3-10 characters';
    }
    
    if (!/^[a-zA-Z0-9]+$/.test(shortcode)) {
      return 'Custom shortcode can only contain letters and numbers';
    }
    
    if (urls.some(url => url.shortcode === shortcode)) {
      return 'This shortcode is already in use';
    }
    
    return '';
  };

 
  const validateValidityPeriod = (period) => {
    if (!period) return '';
    
    const numPeriod = parseInt(period);
    if (isNaN(numPeriod) || numPeriod < 1 || numPeriod > 525600) {
      return 'Validity period must be between 1 and 525600 minutes';
    }
    
    return '';
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
   
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      currentUrl: validateUrl(formData.currentUrl),
      customShortcode: validateShortcode(formData.customShortcode),
      validityPeriod: validateValidityPeriod(formData.validityPeriod)
    };

    
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      onError('Please fix the validation errors before submitting.');
      return;
    }

    setLoading(true);

    try {
      await onShortenUrl(formData);
      
      
      setFormData({
        currentUrl: '',
        customShortcode: '',
        validityPeriod: ''
      });
      setErrors({});
      
      onSuccess('URL shortened successfully!');
    } catch (error) {
      onError('Failed to shorten URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '30px',
      marginBottom: '30px'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    },
    cardTitle: {
      fontSize: '1.5rem',
      marginBottom: '25px',
      color: '#333',
      fontWeight: '600'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      marginBottom: '8px',
      fontWeight: '500',
      color: '#333',
      fontSize: '0.95rem'
    },
    input: {
      padding: '14px 16px',
      border: '2px solid #e1e5e9',
      borderRadius: '12px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      background: 'white',
      boxSizing: 'border-box'
    },
    inputError: {
      padding: '14px 16px',
      border: '2px solid #f44336',
      borderRadius: '12px',
      fontSize: '1rem',
      background: 'white',
      boxSizing: 'border-box'
    },
    errorText: {
      color: '#f44336',
      fontSize: '0.875rem',
      marginTop: '6px',
      fontWeight: '500'
    },
    helperText: {
      color: '#666',
      fontSize: '0.875rem',
      marginTop: '6px'
    },
    button: {
      padding: '14px',
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1.1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontWeight: '600'
    },
    buttonDisabled: {
      padding: '14px',
      backgroundColor: '#ccc',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1.1rem',
      cursor: 'not-allowed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    spinner: {
      width: '20px',
      height: '20px',
      border: '2px solid #f3f3f3',
      borderTop: '2px solid #667eea',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    urlItem: {
      padding: '16px',
      borderBottom: '1px solid #eee',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    urlInfo: {
      flex: 1
    },
    shortUrl: {
      color: '#667eea',
      fontWeight: 'bold',
      marginBottom: '4px',
      fontSize: '1rem'
    },
    originalUrl: {
      color: '#666',
      fontSize: '0.9rem',
      marginBottom: '4px'
    },
    urlMeta: {
      color: '#999',
      fontSize: '0.8rem',
      marginBottom: '8px'
    },
    chip: {
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: '500',
      margin: '0 4px 0 0'
    },
    chipSuccess: {
      backgroundColor: '#e8f5e8',
      color: '#2e7d32'
    },
    chipDefault: {
      backgroundColor: '#f5f5f5',
      color: '#666'
    },
    chipError: {
      backgroundColor: '#ffebee',
      color: '#c62828'
    },
    iconButton: {
      padding: '8px',
      margin: '0 2px',
      backgroundColor: '#f5f5f5',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      fontSize: '1.2rem'
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#666'
    }
  };

  return (
    <div style={styles.grid}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .url-shortener input:focus {
            outline: none;
            border-color: #667eea !important;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }
          
          .url-shortener button:hover:not(:disabled) {
            background-color: #5a6fd8 !important;
            transform: translateY(-2px);
          }
          
          .url-shortener .icon-button:hover {
            background-color: #e0e0e0 !important;
          }
          
          .url-shortener .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          }
        `}
      </style>
      
      <div className="url-shortener">
        {/* URL Shortener Form */}
        <div style={styles.card} className="card">
          <h2 style={styles.cardTitle}>Shorten Your URL</h2>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Enter URL to shorten *</label>
              <input
                type="text"
                value={formData.currentUrl}
                onChange={(e) => handleInputChange('currentUrl', e.target.value)}
                style={errors.currentUrl ? styles.inputError : styles.input}
                placeholder="https://example.com/very-long-url"
                disabled={loading}
              />
              {errors.currentUrl && <div style={styles.errorText}>{errors.currentUrl}</div>}
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Custom Shortcode (Optional)</label>
              <input
                type="text"
                value={formData.customShortcode}
                onChange={(e) => handleInputChange('customShortcode', e.target.value)}
                style={errors.customShortcode ? styles.inputError : styles.input}
                placeholder="mylink"
                disabled={loading}
              />
              {errors.customShortcode && <div style={styles.errorText}>{errors.customShortcode}</div>}
              <div style={styles.helperText}>3-10 characters, letters and numbers only</div>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Validity Period (Minutes, Optional)</label>
              <input
                type="number"
                value={formData.validityPeriod}
                onChange={(e) => handleInputChange('validityPeriod', e.target.value)}
                style={errors.validityPeriod ? styles.inputError : styles.input}
                placeholder="1440"
                min="1"
                max="525600"
                disabled={loading}
              />
              {errors.validityPeriod && <div style={styles.errorText}>{errors.validityPeriod}</div>}
              <div style={styles.helperText}>Default: 30 days (43,200 minutes)</div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              style={loading ? styles.buttonDisabled : styles.button}
              className="icon-button"
            >
              {loading ? <div style={styles.spinner}></div> : '🚀'} 
              {loading ? 'Shortening...' : 'Shorten URL'}
            </button>
          </form>
        </div>

        {/* Recent URLs */}
        <div style={styles.card} className="card">
          <h2 style={styles.cardTitle}>Recent Short URLs</h2>
          
          {urls.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={{fontSize: '3rem', marginBottom: '16px'}}>🔗</div>
              <div style={{fontSize: '1.1rem', marginBottom: '8px'}}>No URLs shortened yet</div>
              <div style={{fontSize: '0.9rem'}}>Create your first short URL!</div>
            </div>
          ) : (
            <div>
              {urls.slice(0, 5).map((url, index) => (
                <div key={url.id} style={{
                  ...styles.urlItem,
                  borderBottom: index === Math.min(urls.length, 5) - 1 ? 'none' : styles.urlItem.borderBottom
                }}>
                  <div style={styles.urlInfo}>
                    <div style={styles.shortUrl}>{url.shortUrl}</div>
                    <div style={styles.originalUrl}>
                      {url.originalUrl.length > 50 
                        ? url.originalUrl.substring(0, 50) + '...' 
                        : url.originalUrl}
                    </div>
                    <div style={styles.urlMeta}>
                      Created: {url.createdAt.toLocaleDateString()} | 
                      Expires: {url.expiryDate.toLocaleDateString()}
                    </div>
                    <div>
                      <span style={{...styles.chip, ...(url.clickCount > 0 ? styles.chipSuccess : styles.chipDefault)}}>
                        {url.clickCount} clicks
                      </span>
                      {new Date() > new Date(url.expiryDate) && (
                        <span style={{...styles.chip, ...styles.chipError}}>
                          Expired
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <button 
                      onClick={() => onCopyToClipboard(url.shortUrl)}
                      style={styles.iconButton}
                      className="icon-button"
                      title="Copy Short URL"
                    >
                      📋
                    </button>
                    <button 
                      onClick={() => onRedirect(url)}
                      style={styles.iconButton}
                      className="icon-button"
                      title="Visit Original URL"
                    >
                      🔗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default URLShortener;
