import React, { useState, useEffect } from 'react';
import type { MonthTheme } from '../data/monthThemes';

interface HeroPanelProps {
  theme: MonthTheme;
  year: number;
  isFlipping: boolean;
  flipDirection: 'next' | 'prev' | null;
}

const HeroPanel: React.FC<HeroPanelProps> = ({ theme, year, isFlipping, flipDirection }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(theme.heroImage);

  useEffect(() => {
    setImageLoaded(false);
    setCurrentSrc(theme.heroImage);
  }, [theme.heroImage]);

  return (
    <div
      className={`hero-panel ${isFlipping ? `flip-${flipDirection}` : ''}`}
      style={{ '--accent': theme.accent, '--accent-glow': theme.accentGlow } as React.CSSProperties}
    >
      {/* Punch hole decoration */}
      <div className="punch-holes">
        <div className="hole" />
        <div className="hole" />
        <div className="hole" />
      </div>

      {/* Hero Image */}
      <div className="hero-image-container">
        {!imageLoaded && <div className="hero-skeleton" />}
        <img
          src={currentSrc}
          alt={`${theme.name} wallpaper`}
          className={`hero-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            // Fallback gradient
            setImageLoaded(true);
          }}
        />
        <div className="hero-overlay" style={{ background: theme.bgGradient.replace('135deg', '180deg') }} />
      </div>

      {/* Month tag */}
      <div className="month-meta">
        <div className="month-pill">
          <span className="month-short">{theme.shortName}</span>
          <span className="month-year">{year}</span>
        </div>
      </div>

      {/* Month name big */}
      <div className="hero-content">
        <h1 className="hero-month-name" style={{ color: theme.textColor }}>
          {theme.name}
        </h1>
        <div className="quote-block">
          <div className="quote-line" style={{ background: theme.accent }} />
          <blockquote className="hero-quote" style={{ color: theme.textColor }}>
            "{theme.quote}"
          </blockquote>
          <cite className="quote-author" style={{ color: theme.accent }}>
            — {theme.quoteAuthor}
          </cite>
        </div>
      </div>

      {/* Decorative dots pattern */}
      <div className="dot-grid" />
    </div>
  );
};

export default HeroPanel;
