AOS.init();
let charts = {};
let map, markerGroup;

const database = {
    "2019": {
        upt: ["CIGONDEWAH", "PADASUKA", "CIBUNTU", "PASIRKALIKI", "GARUDA", "MARGAHAYU", "KOPO", "BABAKAN SARI", "IBRAHIM ADJIE", "BABATAN"],
        kasus: [543, 484, 476, 463, 310, 304, 276, 271, 254, 220],
        penduduk: [4500, 4200, 3900, 4100, 3500, 3200, 3100, 3300, 3000, 2800],
        gender: [5373, 4606],
        note: "2019: Tahun dengan lonjakan kasus tertinggi sebelum pandemi. Fokus di wilayah padat penduduk.",
        coords: [[-6.935, 107.575], [-6.903, 107.655], [-6.925, 107.585], [-6.915, 107.595], [-6.913, 107.579], [-6.945, 107.665], [-6.938, 107.595], [-6.918, 107.645], [-6.915, 107.635], [-6.912, 107.590]]
    },
    "2020": {
        upt: ["PADASUKA", "CIGONDEWAH", "PASIRKALIKI", "MARGAHAYU", "CIBUNTU", "GARUDA", "BABAKAN SARI", "KOPO", "IBRAHIM ADJIE", "KUJANG SARI"],
        kasus: [412, 395, 380, 350, 310, 290, 260, 245, 230, 210],
        penduduk: [4250, 4480, 4050, 3250, 3850, 3450, 3350, 3050, 2950, 2750],
        gender: [4100, 3400],
        note: "2020: Penurunan kasus karena pembatasan mobilitas selama pandemi COVID-19.",
        coords: [[-6.903, 107.655], [-6.935, 107.575], [-6.915, 107.595], [-6.945, 107.665], [-6.925, 107.585], [-6.913, 107.579], [-6.918, 107.645], [-6.938, 107.595], [-6.915, 107.635], [-6.938, 107.645]]
    },
    "2021": {
        upt: ["CIGONDEWAH", "PADASUKA", "MARGAHAYU", "PASIRKALIKI", "GARUDA", "CIBUNTU", "BABAKAN SARI", "KUJANG SARI", "IBRAHIM ADJIE", "KOPO"],
        kasus: [320, 305, 290, 270, 250, 240, 220, 210, 195, 180],
        penduduk: [4450, 4230, 3280, 4020, 3420, 3820, 3320, 2720, 2920, 3020],
        gender: [2800, 2330],
        note: "2021: Tren melandai didukung kesadaran PHBS yang meningkat di masyarakat.",
        coords: [[-6.935, 107.575], [-6.903, 107.655], [-6.945, 107.665], [-6.915, 107.595], [-6.913, 107.579], [-6.925, 107.585], [-6.918, 107.645], [-6.938, 107.645], [-6.915, 107.635], [-6.938, 107.595]]
    },
    "2022": {
        upt: ["PADASUKA", "CIGONDEWAH", "MARGAHAYU", "PASIRKALIKI", "ARCAMANIK", "GARUDA", "CIBUNTU", "KUJANG SARI", "BABAKAN SARI", "IBRAHIM ADJIE"],
        kasus: [290, 275, 250, 230, 210, 200, 185, 170, 160, 145],
        penduduk: [4210, 4420, 3300, 4000, 2800, 3400, 3800, 2700, 3300, 2900],
        gender: [2950, 2350],
        note: "2022: Kasus stabil. Muncul wilayah baru (Arcamanik) dalam 10 besar.",
        coords: [[-6.903, 107.655], [-6.935, 107.575], [-6.945, 107.665], [-6.915, 107.595], [-6.915, 107.675], [-6.913, 107.579], [-6.925, 107.585], [-6.938, 107.645], [-6.918, 107.645], [-6.915, 107.635]]
    },
    "2023": {
        upt: ["PADASUKA", "CIGONDEWAH", "MARGAHAYU", "ARCAMANIK", "KUJANG SARI", "BABAKAN SARI", "PASIRKALIKI", "GARUDA", "IBRAHIM ADJIE", "CIBUNTU"],
        kasus: [278, 260, 202, 196, 150, 148, 140, 135, 130, 95],
        penduduk: [4200, 4400, 3320, 2850, 2720, 3350, 3980, 3380, 2880, 3780],
        gender: [2780, 2350],
        note: "2023: Efektivitas vaksinasi PCV mulai menunjukkan dampak pada stabilitas angka kasus rendah.",
        coords: [[-6.903, 107.655], [-6.935, 107.575], [-6.945, 107.665], [-6.915, 107.675], [-6.938, 107.645], [-6.918, 107.645], [-6.915, 107.595], [-6.913, 107.579], [-6.915, 107.635], [-6.925, 107.585]]
    }
};

function unlockDashboard() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('sidebar').classList.remove('hidden');
    document.getElementById('main-area').classList.remove('hidden');
}

function showSection(id) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(id).classList.remove('hidden');
    document.getElementById('nav-' + id).classList.add('active');
    if (id === 'data') { setTimeout(() => { if(!map) initMap(); updateDashboard(); }, 300); }
}

function initMap() {
    map = L.map('map').setView([-6.9175, 107.6191], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    markerGroup = L.layerGroup().addTo(map);
}

function updateDashboard() {
    const yr = document.getElementById('yearFilter').value;
    const data = database[yr];
    document.getElementById('year-desc').innerHTML = `<b>Analisis Tahun ${yr}:</b> ${data.note}`;

    renderChart('genderChart', 'pie', {
        labels: ['Laki-laki', 'Perempuan'],
        datasets: [{ data: data.gender, backgroundColor: ['#3b82f6', '#f472b6'] }]
    });

    const barColors = data.kasus.map(v => v > 400 ? '#ef4444' : v > 250 ? '#f59e0b' : '#fbbf24');
    renderChart('rankingChart', 'bar', {
        labels: data.upt,
        datasets: [
            { label: 'Jumlah Kasus', data: data.kasus, backgroundColor: barColors },
            { label: 'Jumlah Balita', data: data.penduduk, backgroundColor: '#cbd5e1' }
        ]
    });

    renderChart('trendChart', 'line', {
        labels: ['2019', '2020', '2021', '2022', '2023'],
        datasets: [{ label: 'Total Kasus Kota', data: [9979, 7500, 5130, 5300, 5500], borderColor: '#00b4d8', tension: 0.3 }]
    });

    markerGroup.clearLayers();
    data.coords.forEach((c, i) => {
        L.marker(c).addTo(markerGroup).bindPopup(`<b>UPT ${data.upt[i]}</b><br>Kasus: ${data.kasus[i]}`);
    });
}

function renderChart(id, type, data, options = {}) {
    if (charts[id]) charts[id].destroy();
    charts[id] = new Chart(document.getElementById(id), { type, data, options: { ...options, maintainAspectRatio: false } });
}