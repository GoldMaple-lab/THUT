/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // ตั้งชื่อว่า 'thai' เรียกใช้ด้วย class="font-thai"
        thai: ['Sarabun', 'sans-serif'],
      },
    },
  },
  plugins: [],
}