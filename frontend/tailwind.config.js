/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        arena: {
          bg: '#050507',
          card: '#0D0D12',
          cardElevated: '#12121A',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 255, 255, 0.18)',
          violet: '#7C3AED',
          violetLight: '#8B5CF6',
          indigo: '#6366F1',
          cyan: '#22D3EE',
          blue: '#38BDF8',
          textPrimary: '#F5F5F7',
          textSecondary: '#A1A1AA',
          textMuted: '#71717A',
        },
        chamber: {
          bg: 'var(--chamber-bg, #11141A)',
          surface: 'var(--chamber-surface, #1C2129)',
          surfaceAlt: 'var(--chamber-surface-alt, #161B22)',
          border: 'var(--chamber-border, #28303B)',
          muted: 'var(--chamber-muted, #94A3B8)',
          text: 'var(--chamber-text, #F3F4F6)',
          amber: 'var(--chamber-amber, #F59E0B)',
          amberDark: 'var(--chamber-amber-dark, #B45309)',
          user: 'var(--chamber-user, #38BDF8)',
          userBg: 'var(--chamber-user-bg, #13283B)',
          userBorder: 'var(--chamber-user-border, #1E4768)',
          ai: 'var(--chamber-ai, #FB923C)',
          aiBg: 'var(--chamber-ai-bg, #351B12)',
          aiBorder: 'var(--chamber-ai-border, #642E1B)',
        }
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      keyframes: {
        messageSlide: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.08)' }
        },
        shimmerText: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' }
        }
      },
      animation: {
        'message-in': 'messageSlide 0.25s ease-out forwards',
        'pulse-glow': 'pulseGlow 6s ease-in-out infinite',
        'shimmer-fast': 'shimmerText 3s linear infinite',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        chamber: {
          "primary": "#F59E0B",
          "primary-content": "#11141A",
          "secondary": "#38BDF8",
          "secondary-content": "#11141A",
          "accent": "#FB923C",
          "accent-content": "#11141A",
          "neutral": "#1C2129",
          "neutral-content": "#F3F4F6",
          "base-100": "#11141A",
          "base-200": "#161B22",
          "base-300": "#1C2129",
          "base-content": "#F3F4F6",
          "info": "#38BDF8",
          "success": "#10B981",
          "warning": "#F59E0B",
          "error": "#EF4444",
        },
        "chamber-light": {
          "primary": "#6D4AFF",
          "primary-content": "#FFFFFF",
          "secondary": "#18B8D4",
          "secondary-content": "#111318",
          "accent": "#8B6CFF",
          "accent-content": "#FFFFFF",
          "neutral": "#F2F2EF",
          "neutral-content": "#111318",
          "base-100": "#F7F7F5",
          "base-200": "#F2F2EF",
          "base-300": "#E4E6EA",
          "base-content": "#111318",
          "info": "#18B8D4",
          "success": "#059669",
          "warning": "#D97706",
          "error": "#DC2626",
        }
      }
    ]
  }
};
