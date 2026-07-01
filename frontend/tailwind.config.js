export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6C47FF',
        'primary-hover': '#5535e0',
        bg: '#070B1A',
        card: '#12182B',
        'card-hover': '#1a2240',
        accent: '#8B5CF6',
        border: '#1e2a45',
        'text-muted': '#8892a4',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
