#!/usr/bin/env node

console.log('🔍 Post-Dost Diagnostic Tool\n');

// Check Node.js version
const nodeVersion = process.version;
console.log(`📋 Node.js version: ${nodeVersion}`);

const majorVersion = parseInt(nodeVersion.split('.')[0].slice(1));
if (majorVersion < 18) {
    console.log('❌ Warning: Node.js 18+ is recommended');
} else {
    console.log('✅ Node.js version is compatible');
}

// Check if dependencies exist
const fs = require('fs');
const path = require('path');

console.log('\n📦 Checking dependencies...');

const nodeModulesPath = path.join(process.cwd(), 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
    console.log('✅ node_modules exists');
    
    // Check key dependencies
    const keyDeps = ['next', 'react', 'leaflet', 'react-leaflet'];
    keyDeps.forEach(dep => {
        const depPath = path.join(nodeModulesPath, dep);
        if (fs.existsSync(depPath)) {
            console.log(`✅ ${dep} installed`);
        } else {
            console.log(`❌ ${dep} missing`);
        }
    });
} else {
    console.log('❌ node_modules not found. Run: npm install --legacy-peer-deps');
}

// Check environment file
console.log('\n🔧 Checking environment setup...');
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    console.log('✅ .env.local exists');
} else {
    console.log('❌ .env.local missing. Run: cp .env.example .env.local');
}

// Check important files
console.log('\n📁 Checking project structure...');
const importantFiles = [
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'src/app/maps/page.tsx',
    'src/components/navbar.tsx',
    'package.json'
];

importantFiles.forEach(file => {
    if (fs.existsSync(path.join(process.cwd(), file))) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} missing`);
    }
});

console.log('\n🎯 Next steps:');
console.log('1. Run: npm install --legacy-peer-deps');
console.log('2. Run: npm run dev');
console.log('3. Open: http://localhost:3000');
console.log('\nIf issues persist, check the browser console for errors.');