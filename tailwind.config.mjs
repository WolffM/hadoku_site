/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        'primary-light': 'var(--color-primary-light)',
        'primary-bg': 'var(--color-primary-bg)',
        'primary-hover': 'var(--color-primary-hover)',
        
        // Success/Danger
        success: 'var(--color-success)',
        'success-dark': 'var(--color-success-dark)',
        'success-text': 'var(--color-success-text)',
        danger: 'var(--color-danger)',
        'danger-dark': 'var(--color-danger-dark)',
        'danger-darker': 'var(--color-danger-darker)',
        'danger-light': 'var(--color-danger-light)',
        'danger-text': 'var(--color-danger-text)',
        
        // Neutral
        neutral: 'var(--color-neutral)',
        'neutral-light': 'var(--color-neutral-light)',
        'neutral-lighter': 'var(--color-neutral-lighter)',
        
        // Text colors
        text: 'var(--color-text)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
        'text-muted': 'var(--color-text-muted)',
        
        // Borders
        border: 'var(--color-border)',
        'border-light': 'var(--color-border-light)',
        
        // Backgrounds
        bg: 'var(--color-bg)',
        'bg-card': 'var(--color-bg-card)',
        'bg-alt': 'var(--color-bg-alt)',
        'bg-overlay': 'var(--color-bg-overlay)',
      },
      spacing: {
        'xs': 'var(--spacing-xs)',
        'sm': 'var(--spacing-sm)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
        'xl': 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)',
        '4xl': 'var(--spacing-4xl)',
        '5xl': 'var(--spacing-5xl)',
      },
      borderRadius: {
        'sm': 'var(--border-radius-sm)',
        DEFAULT: 'var(--border-radius)',
        'lg': 'var(--border-radius-lg)',
      },
      fontFamily: {
        sans: 'var(--font-family)',
      },
      fontSize: {
        'xs': 'var(--font-size-xs)',
        'sm': 'var(--font-size-sm)',
        'md': 'var(--font-size-md)',
        'base': 'var(--font-size-base)',
        'lg': 'var(--font-size-lg)',
      },
      fontWeight: {
        normal: 'var(--font-weight-normal)',
        semibold: 'var(--font-weight-semibold)',
        bold: 'var(--font-weight-bold)',
      },
      lineHeight: {
        normal: 'var(--line-height-normal)',
        relaxed: 'var(--line-height-relaxed)',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        'modal': 'var(--shadow-modal)',
        'focus': 'var(--shadow-focus)',
        'focus-sm': 'var(--shadow-focus-sm)',
        'focus-alt': 'var(--shadow-focus-alt)',
      },
      transitionDuration: {
        'fast': 'var(--transition-fast)',
        'smooth': 'var(--transition-smooth)',
      },
    },
  },
  plugins: [],
}
