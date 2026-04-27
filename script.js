AOS.init();
let charts = {};
let map, markerGroup;

// Data Utama Kota Bandung
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

// Data Perbandingan Jawa Barat (Fitur Baru)
const jabarData = {
    "2023": {
        labels: ["KAB. BANDUNG", "KAB. CIANJUR", "KAB. CIREBON", "KAB. SUMEDANG", "KOTA BEKASI", "KOTA BANDUNG", "KAB. BOGOR", "KAB. BEKASI", "KAB. KARAWANG", "KOTA CIMAHI"],
        values: [8378, 7934, 7531, 7047, 5845, 5713, 5632, 5421, 5100, 4994],
        analysis: "Tahun 2023: Kabupaten Bandung mencatat angka tertinggi di Jawa Barat. Kota Bandung berada di posisi 6 besar provinsi."
    },
    "2022": {
        labels: ["KAB. BEKASI", "KOTA BEKASI", "KAB. BOGOR", "KAB. BANDUNG", "KAB. CIANJUR", "KAB. CIREBON", "KAB. KARAWANG", "KOTA BANDUNG", "KAB. SUKABUMI", "KAB. GARUT"],
        values: [18234, 15400, 12300, 9100, 8500, 7800, 7200, 6900, 6500, 6100],
        analysis: "Tahun 2022: Terjadi lonjakan signifikan di wilayah industri (Bekasi & Bogor). Kota Bandung menempati peringkat 8."
    },
    "2021": {
        labels: ["KAB. BOGOR", "KAB. BEKASI", "KAB. BANDUNG", "KOTA BEKASI", "KAB. CIREBON", "KAB. GARUT", "KAB. KARAWANG", "KAB. SUKABUMI", "KOTA BANDUNG", "KAB. CIANJUR"],
        values: [10200, 9800, 7500, 7200, 6800, 6100, 5800, 5500, 5130, 4900],
        analysis: "Tahun 2021: Angka relatif melandai di seluruh Jabar. Kota Bandung berada di peringkat 9."
    },
    "2020": {
        labels: ["KAB. BEKASI", "KAB. BOGOR", "KOTA BEKASI", "KAB. CIREBON", "KAB. BANDUNG", "KAB. KARAWANG", "KOTA BANDUNG", "KAB. GARUT", "KAB. SUKABUMI", "KAB. CIANJUR"],
        values: [12500, 11800, 10200, 9500, 8200, 7800, 7500, 6900, 6200, 5800],
        analysis: "Tahun 2020: Periode awal pandemi, pelaporan kasus didominasi wilayah penyangga Jakarta."
    },
    "2019": {
        labels: ["KAB. CIREBON", "KAB. BOGOR", "KAB. GARUT", "KAB. BANDUNG", "KAB. INDRAMAYU", "KAB. BEKASI", "KAB. KARAWANG", "KOTA BEKASI", "KOTA BANDUNG", "KAB. CIANJUR"],
        values: [10818, 9325, 8374, 8349, 7800, 7500, 7200, 6800, 5430, 4290],
        analysis: "Tahun 2019: Sebelum pandemi, Kab. Cirebon dan Bogor mencatat kasus tertinggi di Jawa Barat."
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
    const jabar = jabarData[yr];

    // Deskripsi Analisis
    document.getElementById('year-desc').innerHTML = `<b>Analisis Kota Bandung Tahun ${yr}:</b> ${data.note}`;
    document.getElementById('jabar-analysis').innerHTML = `<b>Analisis Jawa Barat:</b> ${jabar.analysis}`;

    // Chart 1: Gender
    renderChart('genderChart', 'pie', {
        labels: ['Laki-laki', 'Perempuan'],
        datasets: [{ data: data.gender, backgroundColor: ['#3b82f6', '#f472b6'] }]
    });

    // Chart 2: Ranking UPT (Vertical)
    const barColors = data.kasus.map(v => v > 400 ? '#ef4444' : v > 250 ? '#f59e0b' : '#fbbf24');
    renderChart('rankingChart', 'bar', {
        labels: data.upt,
        datasets: [
            { label: 'Jumlah Kasus', data: data.kasus, backgroundColor: barColors },
            { label: 'Jumlah Balita', data: data.penduduk, backgroundColor: '#cbd5e1' }
        ]
    });

    // Chart 3: Trend Garis
    renderChart('trendChart', 'line', {
        labels: ['2019', '2020', '2021', '2022', '2023'],
        datasets: [{ label: 'Total Kasus Kota', data: [9979, 7500, 5130, 5300, 5500], borderColor: '#00b4d8', tension: 0.3 }]
    });

    // Chart 4: Perbandingan Jawa Barat (Horizontal Bar) - FITUR BARU
    renderChart('jabarChart', 'bar', {
        labels: jabar.labels,
        datasets: [{
            label: 'Kasus Se-Jawa Barat',
            data: jabar.values,
            backgroundColor: '#10b981',
            borderRadius: 5
        }]
    }, {
        indexAxis: 'y', // Membuat bar menjadi horizontal
    });

    // Map Markers
    markerGroup.clearLayers();
    data.coords.forEach((c, i) => {
        L.marker(c).addTo(markerGroup).bindPopup(`<b>UPT ${data.upt[i]}</b><br>Kasus: ${data.kasus[i]}`);
    });
}

function renderChart(id, type, data, options = {}) {
    if (charts[id]) charts[id].destroy();
    charts[id] = new Chart(document.getElementById(id), { 
        type, 
        data, 
        options: { 
            ...options, 
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: { display: (type === 'pie') }
            }
        } 
    });
}
