/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0071e3', // Apple Blue
                secondary: '#1d1d1f', // Apple Dark
                dark: '#1d1d1f', // Apple Dark
                light: '#ffffff',
                grey: '#F5F5F7', // Apple Off-White
            },
            fontFamily: {
                sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                mono: ['"SF Mono"', '"Menlo"', 'monospace'],
                display: ['"Inter"', 'sans-serif'],
            },
            animation: {
                'spin-slow': 'spin 8s linear infinite',
                'marquee': 'marquee 25s linear infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        },
    },
    plugins: [],
}
