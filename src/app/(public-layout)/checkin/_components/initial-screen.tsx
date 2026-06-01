'use client';

import Image from 'next/image';
import { UserPlus, UserCheck } from 'lucide-react';

interface Props {
  onNewClient: () => void;
  onReturningClient: () => void;
}

const InitialScreen = ({ onNewClient, onReturningClient }: Props) => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0F4F7' }}>
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        {/* Card: 800×540, white, 16px radius */}
        <div
          className="bg-white flex flex-col items-center"
          style={{ width: '100%', maxWidth: 800, minHeight: 540, borderRadius: 16, paddingTop: 64, paddingBottom: 64 }}
        >
          {/* Logo: 157×48 */}
          <div className="flex justify-center" style={{ marginBottom: 48 }}>
            <Image src="/success-logo.png" alt="Success logo" height={48} width={157} unoptimized />
          </div>

          {/* Headline: column, center, gap 6px */}
          <div className="flex flex-col items-center" style={{ gap: 6, marginBottom: 52 }}>
            <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 32, color: '#1C1C1C', lineHeight: '1.25em', margin: 0 }}>
              Client Check-In
            </h1>
            <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 18, color: '#484848', lineHeight: '1.44em', textAlign: 'center', margin: 0 }}>
              Please select an option that describes you
            </p>
          </div>

          {/* Option cards: row, gap 20px */}
          <div className="flex flex-row" style={{ gap: 20 }}>
            {/* New Client: 262×188, border #E3E3E3 1px, radius 16, px 48, gap 16 */}
            <button
              onClick={onNewClient}
              className="flex flex-col items-center justify-center group transition-colors"
              style={{ width: 262, height: 188, gap: 16, padding: '0 48px', backgroundColor: '#FFFFFF', border: '1px solid #E3E3E3', borderRadius: 16, cursor: 'pointer' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#93C5FD'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#E3E3E3'; }}
            >
              {/* Icon circle: 64×64, bg #EFF6FB */}
              <div
                className="flex items-center justify-center rounded-full group-hover:bg-blue-100 transition-colors"
                style={{ width: 64, height: 64, backgroundColor: '#EFF6FB', flexShrink: 0 }}
              >
                <UserPlus style={{ width: 28, height: 28, color: '#484848' }} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col items-center" style={{ gap: 2 }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 18, color: '#1C1C1C', textAlign: 'center', lineHeight: '1.44em' }}>
                  New Client
                </span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 14, color: '#484848', textAlign: 'center', lineHeight: '1.43em' }}>
                  First time visiting us
                </span>
              </div>
            </button>

            {/* Returning Client */}
            <button
              onClick={onReturningClient}
              className="flex flex-col items-center justify-center group transition-colors"
              style={{ width: 262, height: 188, gap: 16, padding: '0 48px', backgroundColor: '#FFFFFF', border: '1px solid #E3E3E3', borderRadius: 16, cursor: 'pointer' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#93C5FD'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#E3E3E3'; }}
            >
              <div
                className="flex items-center justify-center rounded-full group-hover:bg-blue-100 transition-colors"
                style={{ width: 64, height: 64, backgroundColor: '#EFF6FB', flexShrink: 0 }}
              >
                <UserCheck style={{ width: 28, height: 28, color: '#484848' }} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col items-center" style={{ gap: 2 }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 18, color: '#1C1C1C', textAlign: 'center', lineHeight: '1.44em' }}>
                  Returning Client
                </span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 14, color: '#484848', textAlign: 'center', lineHeight: '1.43em' }}>
                  Find your existing record
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer: 12px #484848 */}
      <footer className="text-center py-4" style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#484848' }}>
        ©2026 Success Education and Visa Services
      </footer>
    </div>
  );
};

export default InitialScreen;
