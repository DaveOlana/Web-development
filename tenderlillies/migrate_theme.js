const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'pages');
const htmlFiles = fs.readdirSync(directory).filter(f => f.endsWith('.html') && f !== 'index.html');

const oldHeadRegex = /<script>\s*tailwind\.config[\s\S]*?<\/style>/;
const newHead = `<script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            primary: '#0A1F44',
                            accent: '#2563EB',
                            background: '#F9FAFB',
                            text: '#111827'
                        }
                    },
                    fontFamily: {
                        sans: ['Inter', 'system-ui', 'sans-serif'],
                        heading: ['Playfair Display', 'Georgia', 'serif']
                    }
                }
            }
        }
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,500&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        h1, h2, h3, h4, .font-heading { font-family: 'Playfair Display', serif; }
        html { scroll-behavior: smooth; }
    </style>`;

htmlFiles.forEach(file => {
    const filePath = path.join(directory, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Update Tailwind Config & Fonts
    content = content.replace(oldHeadRegex, newHead);

    // Update Body Tag
    content = content.replace(/<body class="[^"]*">/, '<body class="bg-brand-background text-brand-text antialiased overflow-x-hidden flex flex-col min-h-screen selection:bg-brand-accent selection:text-white">');

    // Semantic Color Replacements
    content = content.replace(/brand-black/g, 'brand-primary');
    content = content.replace(/brand-blue/g, 'brand-accent');
    content = content.replace(/brand-white/g, 'brand-background');
    content = content.replace(/text-gray-800/g, 'text-brand-text');
    content = content.replace(/text-gray-900/g, 'text-brand-text');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Migrated ${file} to Elite Design System`);
});
