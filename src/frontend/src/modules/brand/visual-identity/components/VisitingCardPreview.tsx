/**
 * Visiting Card / Business Card Preview Component
 *
 * Shows selected brand theme applied to front and back of a business card.
 */

'use client';

import React from 'react';
import { Phone, Mail, Globe, MapPin } from 'lucide-react';
import { IconStyle, ImageStyle } from './data';

interface VisitingCardPreviewProps {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  fonts: {
    heading: string;
    body: string;
    accent: string;
    mono: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  iconStyle: IconStyle;
  imageStyle: ImageStyle;
}

export function VisitingCardPreview({
  colors,
  fonts,
  borderRadius,
  iconStyle,
}: VisitingCardPreviewProps) {
  const getIconProps = (sizeOverride?: number) => {
    const baseSize = sizeOverride || iconStyle.defaultSize;
    return {
      size: baseSize,
      strokeWidth: iconStyle.strokeWidth,
      fill: iconStyle.style === 'filled' ? 'currentColor' : 'none',
    };
  };

  const CARD_WIDTH = 420;
  const CARD_HEIGHT = 240;

  return (
    <div className="flex flex-col gap-8 items-center">
      {/* FRONT SIDE */}
      <div>
        <p className="text-sm text-slate-500 mb-2 text-center">Front Side</p>
        <div
          style={{
            width: `${CARD_WIDTH}px`,
            height: `${CARD_HEIGHT}px`,
            backgroundColor: colors.surface,
            borderRadius: borderRadius.lg,
            overflow: 'hidden',
            boxShadow: `0 10px 40px ${colors.primary}30`,
            fontFamily: fonts.body,
            position: 'relative',
          }}
        >
          {/* Decorative accent bar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '8px',
              height: '100%',
              backgroundColor: colors.primary,
            }}
          />

          {/* Main content */}
          <div
            style={{
              padding: '2rem',
              paddingLeft: '2.5rem',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Top section: Logo area */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: colors.primary,
                  borderRadius: borderRadius.md,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    color: colors.background,
                    fontFamily: fonts.heading,
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  B
                </span>
              </div>
              <div>
                <h2
                  style={{
                    fontFamily: fonts.heading,
                    color: colors.text,
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    lineHeight: 1.2,
                  }}
                >
                  Brand Name
                </h2>
                <p
                  style={{
                    color: colors.primary,
                    fontSize: '0.75rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  Your Tagline Here
                </p>
              </div>
            </div>

            {/* Bottom section: Name and title */}
            <div>
              <h1
                style={{
                  fontFamily: fonts.heading,
                  color: colors.text,
                  fontSize: '1.75rem',
                  fontWeight: 'bold',
                  marginBottom: '0.25rem',
                }}
              >
                John Doe
              </h1>
              <p
                style={{
                  color: colors.textMuted,
                  fontSize: '1rem',
                }}
              >
                Chief Executive Officer
              </p>
            </div>
          </div>

          {/* Decorative corner element */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '120px',
              height: '120px',
              backgroundColor: `${colors.primary}10`,
              borderTopLeftRadius: '100%',
            }}
          />
        </div>
      </div>

      {/* BACK SIDE */}
      <div>
        <p className="text-sm text-slate-500 mb-2 text-center">Back Side</p>
        <div
          style={{
            width: `${CARD_WIDTH}px`,
            height: `${CARD_HEIGHT}px`,
            backgroundColor: colors.primary,
            borderRadius: borderRadius.lg,
            overflow: 'hidden',
            boxShadow: `0 10px 40px ${colors.primary}30`,
            fontFamily: fonts.body,
            position: 'relative',
          }}
        >
          {/* Content */}
          <div
            style={{
              padding: '2rem',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            {/* Contact items */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: `${colors.background}20`,
                  borderRadius: borderRadius.sm,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Phone {...getIconProps(18)} style={{ color: colors.background }} />
              </div>
              <div>
                <p
                  style={{
                    color: colors.background,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  +1 (555) 123-4567
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: `${colors.background}20`,
                  borderRadius: borderRadius.sm,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Mail {...getIconProps(18)} style={{ color: colors.background }} />
              </div>
              <div>
                <p
                  style={{
                    color: colors.background,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  john.doe@brand.com
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: `${colors.background}20`,
                  borderRadius: borderRadius.sm,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Globe {...getIconProps(18)} style={{ color: colors.background }} />
              </div>
              <div>
                <p
                  style={{
                    color: colors.background,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  www.brand.com
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: `${colors.background}20`,
                  borderRadius: borderRadius.sm,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MapPin {...getIconProps(18)} style={{ color: colors.background }} />
              </div>
              <div>
                <p
                  style={{
                    color: colors.background,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  123 Business Street, City, ST 12345
                </p>
              </div>
            </div>
          </div>

          {/* QR Code placeholder */}
          <div
            style={{
              position: 'absolute',
              right: '2rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '80px',
              height: '80px',
              backgroundColor: colors.background,
              borderRadius: borderRadius.sm,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                border: `2px solid ${colors.primary}`,
                borderRadius: borderRadius.sm,
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '2px',
                padding: '4px',
              }}
            >
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: Math.random() > 0.5 ? colors.primary : 'transparent',
                    borderRadius: '1px',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
