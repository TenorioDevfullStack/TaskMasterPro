module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        foreground: 'var(--foreground)',
        background: 'var(--background)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        destructive: 'var(--destructive)',
        ring: 'var(--ring)',
        surface: 'var(--surface)',
        glass: 'var(--glass-bg)',
      },
    },
  },
  plugins: [],
};
