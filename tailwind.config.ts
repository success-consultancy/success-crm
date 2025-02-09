/* eslint-disable import/no-anonymous-default-export */
import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ['class'],
	content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			gridTemplateColumns: {
				'template-42-27-27': '42% 27.5% 27.5%',
			},

			boxShadow: {
				round: '0px 2px 2px 0px rgba(0, 0, 0, 0.10)',
				popup: '1rem 1rem 2rem 0 rgba(0, 0, 0, 0.24)',
				floating: '0px 4px 4px 0px #00000024',
			},
			fontFamily: {
				default: ['var(--font-inter)', 'sans-serif'],
				heading: ['var(--font-figtree)', 'sans-serif'],
			},
			spacing: {
				4.5: '1.125rem', //18px
				5.5: '1.375rem', //22px
				6.5: '1.625rem', //26px
				7.5: '1.875rem', //30px
				12.5: '3.125rem', //50px
				13: '3.25rem', //52px
				15: '3.75rem', //60px
				17: '4.25rem', //68px
				18: '4.5rem', //72px
				19: '4.75rem', //76px
				21: '5.25rem', //84px
				22: '5.5rem', //88px
				23: '5.75rem', //92px
				25: '6.25rem', //100px
				29: '7.25rem', //116px
				29.5: '7.375rem', //118px
				31: '7.75rem', //124px
				35.5: '8.875rem', //142px
				37: '9.25rem', //148px
				49: '12.25rem', //196px
				56: '14rem', // 224px
				'lg-gutter': '1.875rem', //30px
				'md-gutter': '1.25rem', //20px
				'sm-gutter': '1rem', //16px
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'var(--primary)',
					hovered: 'var(--primary-hovered)',
					faded: 'var(--primary-faded)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},

				//? text colors
				content: {
					heading: 'var(--text-heading)',
					subtitle: 'var(--text-subtitle)',
					body: 'var(--text-body)',
					placeholder: 'var(--text-placeholder)',
					disabled: 'var(--text-disabled)',
				},
				day: {
					body: 'rgba(34, 34, 55, 0.74)',
				},
				//? BG colors
				bg: {
					tooltip: 'var(--tooltip-bg)',
					dark: 'var(--dark)',
					white: 'var(--white)',
					disabled: 'var(--disabled)',
					light: {
						grey: 'var(--light-grey)',
						B: '#EBEFF7',
						A: '#F7F8FA',
					},
				},
				state: {
					success: {
						base: 'var(--state-success-base)',
						light: 'var(--state-success-light)',
						dark: 'var(--state-success-dark)',
					},
					error: {
						base: 'var(--state-error-base)',
						light: 'var(--state-error-light)',
						dark: 'var(--state-error-dark)',
					},
					info: {
						base: 'var(--state-info-base)',
						light: 'var(--state-info-light)',
						dark: 'var(--state-info-dark)',
					},
					warning: {
						base: 'var(--state-warning-base)',
						light: 'var(--state-warning-light)',
						dark: 'var(--state-warning-dark)',
					},
				},
				button: {
					50: 'var(--button-normal-50)',
					100: 'var(--button-normal-100)',
					600: 'var(--button-normal-600)',
					700: 'var(--button-normal-700)',
					800: 'var(--button-normal-800)',
				},
				//? Black shades
				black: {
					100: 'var(--black-100)',
					80: 'var(--black-80)',
					60: 'var(--black-60)',
					40: 'var(--black-40)',
					25: 'var(--black-25)',
					20: 'var(--black-20)',
					10: 'var(--black-10)',
					8: 'var(--black-8)',
					4: 'var(--black-4)',
				},
				//? White shades
				white: {
					100: 'var(--white-100)',
					80: 'var(--white-80)',
					60: 'var(--white-60)',
					40: 'var(--white-40)',
					20: 'var(--white-20)',
					10: 'var(--white-10)',
					8: 'var(--white-8)',
					4: 'var(--white-4)',
				},
				//? Stroke
				stroke: {
					DEFAULT: 'var(--stroke-default)',
					focus: 'var(--stroke-focus)',
					divider: 'var(--stroke-divider)',
				},
				// ? Icon colors
				icon: {
					default: 'var(--icon-default)',
					disabled: 'var(--icon-disabled)',
				},
				scrim: {
					overlay: 'var(--scrim-overlay)',
				},
			},
			borderRadius: {
				Md: 'var(--Radius-Md)',
				Sm: 'var(--Radius-Sm)',
			},
			fontSize: {
				// *=========== HEADINGS START ===========
				h1: [
					'2.625rem',
					{
						lineHeight: '1.2',
						letterSpacing: '-2',
						fontWeight: '700',
					},
				], //42px
				h2: [
					'2.188rem',
					{
						lineHeight: '1.2',
						fontWeight: '500',
						letterSpacing: '-2',
					},
				], //35px
				h3: [
					'1.813rem',
					{
						lineHeight: '1.2',
						fontWeight: '500',
						letterSpacing: '-2',
					},
				], //29px
				h4: [
					'1.5rem',
					{
						lineHeight: '1.2',
						fontWeight: '500',
					},
				], //24px
				h5: [
					'1.25rem',
					{
						lineHeight: '1.4',
						fontWeight: '500',
					},
				], //18px
				h6: [
					'1.125rem',
					{
						lineHeight: '1.4',
						fontWeight: '500',
					},
				], //17px
				b1: [
					'0.875rem',
					{
						lineHeight: '1.4',
						fontWeight: '400',
					},
				], //14px
				'b1-b': [
					'0.875rem',
					{
						lineHeight: '1.4',
						fontWeight: '600',
					},
				], //14px semibold
				b2: [
					'0.813rem',
					{
						lineHeight: '1.5',
						fontWeight: '400',
					},
				], //13px
				'b2-b': [
					'0.813rem',
					{
						lineHeight: '1.5',
						fontWeight: '600',
					},
				], //13px semibold
				b3: [
					'0.875rem',
					{
						lineHeight: '1.5',
						fontWeight: '400',
					},
				], //14px
				'b3-b': [
					'0.875rem',
					{
						lineHeight: '1.5',
						fontWeight: '600',
					},
				], //14px semibold
				c1: [
					'0.75rem',
					{
						lineHeight: '1.3',
						fontWeight: '400',
					},
				], //12px
				'c1-b': [
					'0.75rem',
					{
						lineHeight: '1.3',
						fontWeight: '600',
					},
				], //12px semibold
				c2: [
					'0.688rem',
					{
						lineHeight: '1.3',
						fontWeight: '400',
					},
				], //11px
				'c2-b': [
					'0.688rem',
					{
						lineHeight: '1.3',
						fontWeight: '600',
					},
				], //11px semibold
				s1: [
					'1.5rem',
					{
						lineHeight: '1.2',
						fontWeight: '400',
					},
				], //24px semibold

				s3: [
					'1.0625rem',
					{
						lineHeight: '1.2',
						fontWeight: '400',
					},
				], //24px semibold
				'bu-l': [
					'1rem',
					{
						lineHeight: '1',
						fontWeight: '600',
					},
				], //16px semibold
				'bu-m': [
					'0.875rem',
					{
						lineHeight: '1.4',
						fontWeight: '600',
					},
				], //14px semibold,
				'bu-s': [
					'0.875rem',
					{
						lineHeight: '1.4',
						fontWeight: '600',
					},
				], //14px semibold
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
			backgroundImage: {
				'auth-background': "url('/assets/bg-auth.png)",
			},
			screens: {
				'2.5xl': '1700px',
				'3xl': '1600px',
				'4xl': '1921px',
			},
		},
	},
	corePlugins: {
		aspectRatio: false,
		container: false,
	},
	plugins: [
		// eslint-disable-next-line
		require('tailwindcss-animate'),

		plugin(function ({ addUtilities }) {
			const newUtilities = {
				'.hide-number-arrows': {
					/* Hide the arrows in most modern browsers */
					'&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
						'-webkit-appearance': 'none',
						margin: '0',
					},
					/* Hide the arrows in Firefox */
					'&[type="number"]': {
						'-moz-appearance': 'textfield',
					},
				},
			};

			addUtilities(newUtilities);
		}),
	],
};
