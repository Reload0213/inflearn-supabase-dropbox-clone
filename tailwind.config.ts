import type { Config } from 'tailwindcss';
import withMT from '@material-tailwind/react/utils/withMT'; // material-tailwind 사용 조건

const config: Config = {
    content: [
        './utils/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {},
    plugins: [require('@tailwindcss/typography')],
};

export default withMT(config); // material-tailwind 사용 조건
