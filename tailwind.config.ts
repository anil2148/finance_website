import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.mdx'],
  theme: {
    extend: {
      colors: {
        brand: '#0A66C2'
      },
      boxShadow: {
        soft: '0 20px 35px -25px rgba(15, 23, 42, 0.3)'
      }
    }
  },
  plugins: []
};

export default config;
