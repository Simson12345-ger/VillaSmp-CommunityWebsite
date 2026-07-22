const nameData = {
    stylish: { prefixes: ['Shadow', 'Crystal', 'Royal', 'Golden', 'Silver'], suffixes: ['Sky', 'Moon', 'Star', 'Aura', 'Glow'] },
    pvp: { prefixes: ['Toxic', 'Rapid', 'Lethal', 'Venom', 'Fatal'], suffixes: ['PvP', 'Kills', 'Strike', 'Slayer', 'Domination'] },
    dark: { prefixes: ['Void', 'Blood', 'Night', 'Death', 'Abyss'], suffixes: ['Knight', 'Walker', 'Soul', 'Reaper', 'Shadow'] },
    fantasy: { prefixes: ['Elven', 'Dwarven', 'Arcane', 'Mystic', 'Ancient'], suffixes: ['Wizard', 'Keeper', 'Guard', 'Blade', 'Quest'] },
    funny: { prefixes: ['Crazy', 'Derpy', 'Silly', 'Meme', 'Llama'], suffixes: ['Face', 'Guy', 'Player', 'Boi', 'Lover'] },
    short: { prefixes: ['i', 'x', 'o', 'v', 'z'], suffixes: ['Q', 'X', 'Z', 'Y', 'U'] },
    professional: { prefixes: ['Pro', 'Elite', 'Master', 'Prime', 'True'], suffixes: ['Craft', 'Build', 'Mine', 'Block', 'Play'] },
    smp: { prefixes: ['Smp', 'Survival', 'Vanilla', 'Town', 'Clan'], suffixes: ['Builder', 'Miner', 'Farmer', 'Hunter', 'King'] }
};

const settings = {
    numbers: 'yes',
    symbols: 'yes'
};

document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const group = btn.dataset.toggle;
        const value = btn.dataset.value;
        settings[group] = value;
        document.querySelectorAll(`.toggle-btn[data-toggle="${group}"]`).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

document.getElementById('generate-name-btn').addEventListener('click', () => {
    const style = document.getElementById('name-style').value;
    const maxLength = parseInt(document.getElementById('max-length').value);
    const startLetter = document.getElementById('starting-letter').value.toLowerCase();
    
    const results = [];
    for (let i = 0; i < 6; i++) {
        results.push(generateSingleName(style, maxLength, startLetter));
    }
    
    const container = document.getElementById('name-results');
    container.innerHTML = '';
    results.forEach(name => {
        const card = document.createElement('div');
        card.className = 'name-card';
        card.innerHTML = `<span>${name}</span><button class="copy-btn">Copy</button>`;
        card.querySelector('.copy-btn').addEventListener('click', () => {
            navigator.clipboard.writeText(name);
            alert(`Copied: ${name}`);
        });
        container.appendChild(card);
    });
});

function generateSingleName(style, maxLength, startLetter) {
    const { prefixes, suffixes } = nameData[style];
    let prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    let suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    let name = prefix + suffix;
    
    if (startLetter) {
        // Overwrite prefix start to match starting letter
        name = startLetter.toUpperCase() + name.slice(1);
    }
    
    if (settings.numbers === 'yes') {
        name += Math.floor(Math.random() * 99);
    }
    
    if (settings.symbols === 'yes') {
        const symbols = ['_', 'x', 'z', '_'];
        name = name + symbols[Math.floor(Math.random() * symbols.length)];
    }
    
    // Truncate if exceeds max length
    if (name.length > maxLength) {
        name = name.substring(0, maxLength);
    }
    
    return name;
}
