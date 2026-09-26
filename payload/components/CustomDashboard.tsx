'use client';

import React from 'react';
import { useConfig } from '@payloadcms/ui';

export const CustomDashboard: React.FC = () => {
  const { config } = useConfig();

  const handleAiDraft = async () => {
    try {
      const response = await fetch('/api/cms/ai-draft', {
        method: 'POST',
      });
      if (response.ok) {
        alert('AI Draft generated successfully!');
      } else {
        alert('Failed to generate AI Draft.');
      }
    } catch (error) {
      console.error(error);
      alert('Error generating AI Draft.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        Counter-Shop CMS Command Center
      </h1>
      <p style={{ marginBottom: '20px' }}>
        Welcome to the editorial and content management dashboard.
      </p>

      <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>AI-Assisted Content Generation</h2>
        <p style={{ marginBottom: '10px' }}>
          Use this tool to generate draft market commentary or SEO content. The AI will output a draft article, which requires human review before publishing.
        </p>
        <button
          onClick={handleAiDraft}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Generate Draft Article
        </button>
      </div>

      <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Market Metrics (Read-only)</h2>
        <p>Market metrics will be fetched securely from the Next.js API route.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '10px' }}>
           <div style={{ background: '#fff', padding: '15px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
             <h3 style={{ fontSize: '14px', color: '#666' }}>Active Listings</h3>
             <p style={{ fontSize: '24px', fontWeight: 'bold' }}>--</p>
           </div>
           <div style={{ background: '#fff', padding: '15px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
             <h3 style={{ fontSize: '14px', color: '#666' }}>24h Volume</h3>
             <p style={{ fontSize: '24px', fontWeight: 'bold' }}>--</p>
           </div>
           <div style={{ background: '#fff', padding: '15px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
             <h3 style={{ fontSize: '14px', color: '#666' }}>Trades Processed</h3>
             <p style={{ fontSize: '24px', fontWeight: 'bold' }}>--</p>
           </div>
        </div>
      </div>
    </div>
  );
};
