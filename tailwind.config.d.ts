import typography from '@tailwindcss/typography';
declare const _default: {
    content: string[];
    darkMode: "class";
    theme: {
        extend: {
            colors: {
                brand: string;
            };
            fontFamily: {
                sans: [string, string, string];
                mono: [string, string, string];
            };
            typography: (theme: (s: string) => string) => {
                DEFAULT: {
                    css: {
                        maxWidth: string;
                        color: string;
                        a: {
                            color: string;
                            textDecoration: string;
                            '&:hover': {
                                textDecoration: string;
                            };
                        };
                        'h1,h2,h3,h4': {
                            fontWeight: string;
                            letterSpacing: string;
                        };
                        code: {
                            fontFamily: string;
                            fontSize: string;
                            background: string;
                            padding: string;
                            borderRadius: string;
                            fontWeight: string;
                        };
                        'code::before': {
                            content: string;
                        };
                        'code::after': {
                            content: string;
                        };
                        pre: {
                            background: string;
                            padding: number;
                            margin: number;
                        };
                    };
                };
                invert: {
                    css: {
                        color: string;
                        a: {
                            color: string;
                        };
                        code: {
                            background: string;
                            color: string;
                        };
                    };
                };
            };
        };
    };
    plugins: (typeof typography)[];
};
export default _default;
