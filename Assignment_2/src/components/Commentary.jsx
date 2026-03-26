import React, { useEffect, useState } from 'react';
import './Commentary.css';

export default function Commentary({ text, outcome, key: commentaryKey }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!text) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 3200);
    return () => clearTimeout(t);
  }, [text, commentaryKey]);

  if (!text || !visible) return <div className="commentary-placeholder" />;

  const isGood = outcome === '4' || outcome === '6';
  const isBad  = outcome === 'W';

  return (
    <div className={`commentary-box ${isGood ? 'good' : isBad ? 'bad' : 'neutral'}`}>
      <span className="commentary-mic">🎙</span>
      <span className="commentary-text">{text}</span>
    </div>
  );
}
