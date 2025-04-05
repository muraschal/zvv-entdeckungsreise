import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'zvv': ['ZVVBrownNarrowWeb', 'sans-serif'],
        'zvv-small': ['ZVVBrownNarrowSWeb', 'sans-serif'],
      },
      colors: {
        'zvv-blue': '#003399',
        'zvv-red': '#FF0000',
      },
      backgroundImage: {
        'zvv-bg': "url('/images/zvv-background.jpg')",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  future: {
    hoverOnlyWhenSupported: true,
  },
};

export default config; 