import React, { useState, useEffect, useMemo, useCallback } from 'react';
import URLShortener from './components/URLShortener';
import Statistics from './components/Statistics';
import './App.css';
import { Log } from './utils/logger'; // Import the middleware

function App() {
  const [urls, setUrls] = useState([]);
  const [activeTab, setActiveTab] = useState('shortener');
  const [clickAnalytics, setClickAnalytics] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const generateShortcode = useCallback(() => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    const timestamp = Date.now();
    for (let i = 0; i < 6; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    result += chars[timestamp % chars.length];
    return result;
  }, []);

  const getGeographicLocation = useCallback(() => {
    const locations = ['New York, USA', 'London, UK', 'Tokyo, Japan', 'Sydney, Australia', 'Berlin, Germany', 'Toronto, Canada', 'Mumbai, India', 'São Paulo, Brazil'];
    return locations[Math.floor(Math.random() * locations.length)];
  }, []);

  const handleShortenUrl = useCallback(async (formData) => {
    const { currentUrl, customShortcode, validityPeriod } = formData;
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const shortcode = customShortcode || generateShortcode();
      const currentTime = new Date();
      const expiryTime = validityPeriod 
        ? new Date(currentTime.getTime() + parseInt(validityPeriod) * 60000)
        : new Date(currentTime.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      const newUrl = {
        id: Date.now(),
        originalUrl: currentUrl,
        shortcode,
        shortUrl: `https://short.ly/${shortcode}`,
        createdAt: currentTime,
        expiryDate: expiryTime,
        clickCount: 0,
        isActive: true,
        customShortcode: !!customShortcode,
        validityMinutes: validityPeriod ? parseInt(validityPeriod) : 43200
      };

      setUrls(prevUrls => [newUrl, ...prevUrls]);

      await Log("frontend", "info", "shorten", `URL shortened successfully: ${currentUrl} -> ${shortcode}`);
      return newUrl;
    } catch (error) {
      await Log("frontend", "error", "shorten", `URL shortening failed: ${error.message}`);
      throw error;
    }
  }, [generateShortcode]);

  const handleRedirect = useCallback((urlData) => {
    const currentTime = new Date();
    if (currentTime > new Date(urlData.expiryDate)) {
      Log("frontend", "warn", "redirect", `Attempted to access expired URL: ${urlData.shortcode}`);
      alert('This short URL has expired and is no longer valid.');
      return;
    }

    const clickData = {
      id: Date.now() + Math.random(),
      urlId: urlData.id,
      shortcode: urlData.shortcode,
      timestamp: currentTime,
      source: document.referrer || 'Direct',
      userAgent: navigator.userAgent,
      geographicLocation: getGeographicLocation(),
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
      clickId: `click_${Date.now()}`
    };

    setClickAnalytics(prevAnalytics => [clickData, ...prevAnalytics]);

    setUrls(prevUrls => 
      prevUrls.map(url => 
        url.id === urlData.id 
          ? { ...url, clickCount: url.clickCount + 1 }
          : url
      )
    );

    Log("frontend", "info", "redirect", `Redirect tracked for ${urlData.shortcode}`);
    window.open(urlData.originalUrl, '_blank');
  }, [getGeographicLocation]);

  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess('Short URL copied to clipboard!');
      await Log("frontend", "info", "clipboard", `Copied to clipboard: ${text}`);
    } catch (error) {
      await Log("frontend", "error", "clipboard", `Clipboard copy failed: ${error.message}`);
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setSuccess('Short URL copied to clipboard!');
    }
  }, []);

  const statistics = useMemo(() => {
    const totalUrls = urls.length;
    const totalClicks = urls.reduce((sum, url) => sum + url.clickCount, 0);
    const activeUrls = urls.filter(url => new Date() <= new Date(url.expiryDate)).length;
    const expiredUrls = totalUrls - activeUrls;
    return {
      totalUrls,
      totalClicks,
      activeUrls,
      expiredUrls,
      averageClicksPerUrl: totalUrls > 0 ? (totalClicks / totalUrls).toFixed(2) : 0
    };
  }, [urls]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const showSuccess = (message) => setSuccess(message);
  const showError = (message) => setError(message);

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1 className="app-title">🔗 URL Shortener Pro</h1>
          <p className="app-subtitle">Shorten URLs with advanced analytics and custom options</p>
        </header>

        <div className="tab-container">
          <button className={`tab ${activeTab === 'shortener' ? 'active' : ''}`} onClick={() => setActiveTab('shortener')}>
            🔗 URL Shortener
          </button>
          <button className={`tab ${activeTab === 'statistics' ? 'active' : ''}`} onClick={() => setActiveTab('statistics')}>
            📊 Statistics & Analytics
          </button>
        </div>

        {success && (
          <div className="alert alert-success">
            ✅ {success}
            <button onClick={() => setSuccess('')} className="alert-close">✕</button>
          </div>
        )}
        {error && (
          <div className="alert alert-error">
            ❌ {error}
            <button onClick={() => setError('')} className="alert-close">✕</button>
          </div>
        )}

        {activeTab === 'shortener' && (
          <URLShortener
            urls={urls}
            onShortenUrl={handleShortenUrl}
            onCopyToClipboard={(url) => {
              copyToClipboard(url);
              showSuccess('Short URL copied to clipboard!');
            }}
            onRedirect={handleRedirect}
            onError={showError}
            onSuccess={showSuccess}
          />
        )}
        {activeTab === 'statistics' && (
          <Statistics
            urls={urls}
            clickAnalytics={clickAnalytics}
            statistics={statistics}
          />
        )}
      </div>
    </div>
  );
}
export default App;
