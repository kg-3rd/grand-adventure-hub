import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			spacing: {
				18: '4.5rem',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				festival: {
					DEFAULT: 'hsl(var(--festival))',
					foreground: 'hsl(var(--festival-foreground))'
				},
				earth: {
					DEFAULT: 'hsl(var(--earth))',
					foreground: 'hsl(var(--earth-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			backgroundImage: {
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-cinematic': 'var(--gradient-cinematic)',
				'gradient-golden': 'var(--gradient-golden)',
				'gradient-overlay': 'var(--gradient-overlay)'
			},
			boxShadow: {
				'adventure': 'var(--shadow-adventure)',
				'festival': 'var(--shadow-festival)',
				'cinematic': 'var(--shadow-cinematic)',
				'golden': 'var(--shadow-golden)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'adventure-pulse': {
					'0%, 100%': {
						boxShadow: '0 0 0 0 hsl(var(--primary) / 0.7)'
					},
					'50%': {
						boxShadow: '0 0 0 10px hsl(var(--primary) / 0)'
					}
				},
				'festival-glow': {
					'0%, 100%': {
						textShadow: '0 0 5px hsl(var(--festival) / 0.5)'
					},
					'50%': {
						textShadow: '0 0 20px hsl(var(--festival) / 0.8), 0 0 30px hsl(var(--festival) / 0.4)'
					}
				},
				'parallax': {
					'0%': { transform: 'translateY(0px)' },
					'100%': { transform: 'translateY(-20px)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'blur-in': {
					'0%': { filter: 'blur(10px)', opacity: '0' },
					'100%': { filter: 'blur(0px)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.8s ease-out',
				'slide-up': 'slide-up 1s ease-out',
				'adventure-pulse': 'adventure-pulse 2s infinite',
				'festival-glow': 'festival-glow 3s ease-in-out infinite',
				'parallax': 'parallax 20s ease-in-out infinite',
				'float': 'float 6s ease-in-out infinite',
				'blur-in': 'blur-in 1s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
