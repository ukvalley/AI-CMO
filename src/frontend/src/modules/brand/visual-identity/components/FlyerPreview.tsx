/**
 * Sample Flyer Preview Component
 *
 * Shows selected brand theme applied to a promotional flyer.
 */

'use client';

import React from 'react';
import { Phone, Mail, MapPin, Globe, Check } from 'lucide-react';
import { IconStyle, ImageStyle } from './data';

interface FlyerPreviewProps {
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

export function FlyerPreview({
  colors,
  fonts,
  borderRadius,
  iconStyle,
}: FlyerPreviewProps) {
  const getIconProps = (sizeOverride?: number) => {
    const baseSize = sizeOverride || iconStyle.defaultSize;
    return {
      size: baseSize,
      strokeWidth: iconStyle.strokeWidth,
      fill: iconStyle.style === 'filled' ? 'currentColor' : 'none',
    };
  };

  const features = [
    'Premium Quality Products',
    '24/7 Customer Support',
    'Fast & Reliable Delivery',
    'Satisfaction Guaranteed',
  ];

  return (
    <div
      style={{
        width: '600px',
        minHeight: '800px',
        backgroundColor: colors.background,
        fontFamily: fonts.body,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        boxShadow: `0 20px 50px ${colors.primary}20`,
      }}
    >
      {/* Header Section */}
      <div
        style={{
          backgroundColor: colors.primary,
          padding: '3rem',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontFamily: fonts.heading,
            color: colors.background,
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
          }}
        >
          SPECIAL OFFER
        </h1>
        <p
          style={{
            fontFamily: fonts.accent,
            color: colors.background,
            fontSize: '1.5rem',
            opacity: 0.9,
          }}
        >
          Limited Time Only
        </p>
      </div>

      {/* Hero Section */}
      <div
        style={{
          backgroundColor: colors.surface,
          padding: '3rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '200px',
            height: '200px',
            backgroundColor: `${colors.primary}20`,
            borderRadius: '50%',
            margin: '0 auto 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `4px solid ${colors.primary}`,
          }}
        >
          <span
            style={{
              fontFamily: fonts.heading,
              fontSize: '4rem',
              fontWeight: 'bold',
              color: colors.primary,
            }}
          >
            50%
          </span>
        </div>
        <h2
          style={{
            fontFamily: fonts.heading,
            color: colors.text,
            fontSize: '2rem',
            marginBottom: '1rem',
          }}
        >
          OFF YOUR FIRST PURCHASE
        </h2>
        <p
          style={{
            color: colors.textMuted,
            fontSize: '1.125rem',
            maxWidth: '400px',
            margin: '0 auto',
          }}
        >
          Experience the best quality products at unbeatable prices.
          Join thousands of satisfied customers today!
        </p>
      </div>

      {/* Features Section */}
      <div
        style={{
          padding: '2rem 3rem',
          backgroundColor: colors.background,
        }}
      >
        <div style={{ display: 'grid', gap: '1rem' }}>
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: colors.surface,
                borderRadius: borderRadius.md,
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: colors.success,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Check {...getIconProps(18)} style={{ color: colors.background }} />
              </div>
              <span
                style={{
                  color: colors.text,
                  fontSize: '1.125rem',
                  fontWeight: 500,
                }}
              >
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div
        style={{
          padding: '2rem 3rem',
          textAlign: 'center',
          backgroundColor: colors.accent,
        }}
      >
        <h3
          style={{
            fontFamily: fonts.heading,
            color: colors.background,
            fontSize: '1.75rem',
            marginBottom: '1rem',
          }}
        >
          USE CODE: BRAND50
        </h3>
        <button
          style={{
            backgroundColor: colors.background,
            color: colors.accent,
            padding: '1rem 3rem',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            borderRadius: borderRadius.md,
            border: 'none',
            cursor: 'pointer',
            fontFamily: fonts.heading,
          }}
        >
          SHOP NOW
        </button>
      </div>

      {/* Contact Section */}
      <div
        style={{
          padding: '2rem 3rem',
          backgroundColor: colors.surface,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Phone {...getIconProps(18)} style={{ color: colors.primary }} />
            <span style={{ color: colors.textMuted, fontSize: '0.875rem' }}>
              +1 (555) 123-4567
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Mail {...getIconProps(18)} style={{ color: colors.primary }} />
            <span style={{ color: colors.textMuted, fontSize: '0.875rem' }}>
              hello@brand.com
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Globe {...getIconProps(18)} style={{ color: colors.primary }} />
            <span style={{ color: colors.textMuted, fontSize: '0.875rem' }}>
              www.brand.com
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MapPin {...getIconProps(18)} style={{ color: colors.primary }} />
            <span style={{ color: colors.textMuted, fontSize: '0.875rem' }}>
              123 Business St, City
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: colors.primary,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            color: colors.background,
            fontSize: '0.875rem',
            opacity: 0.8,
          }}
        >
          Offer valid until December 31, 2026. Terms and conditions apply.
        </p>
      </div>
    </div>
  );
}
