/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de colores personalizada para la boda
        'gray-sage': '#3F2512',      // Gris salvia - tono neutro y elegante
        'silver-mist': '#dddee3',    // Niebla plateada - tono claro y suave
        'cream-beige': '#e5e1d5',    // Beige crema - tono cálido y acogedor
        'warm-taupe': '#3F2512',     // Taupe cálido - marrón suave
        'dark-espresso': '#382f25',  // Espresso oscuro - marrón profundo
        'espresso-terracota': '#382f25',
      },
      fontFamily: {
  serif: ['"Lora"', 'serif'],
  sans: ['"Lora"', 'sans-serif'],
},
    
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}