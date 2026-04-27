AOS.init();
let charts = {};
let map, markerGroup;

// --- 1. DATA KOTA BANDUNG (TOP 10 UPT) ---
const database = {
    "2023": {
        upt: ["PADASUKA", "CIGONDEWAH", "MARGAHAYU", "ARCAMANIK", "KUJANG SARI", "PASIRKALIKI", "CIBUNTU", "GARUDA", "PUTER", "BABAKAN SARI"],
        kasus: [278, 260, 202, 196, 150, 145, 132, 120, 115, 110],
        gender: [2780, 2350],
        note: "Data 2023: Fokus pada 10 wilayah dengan tingkat pelaporan pneumonia tertinggi di Bandung.",
        coords: [[-6.903, 107.655], [-6.935, 107.575], [-6.945, 107.665], [-6.915, 107.675], [-6.938, 107.645], [-6.915, 107.595], [-6.925, 107.585], [-6.913, 107.579], [-6.901, 107.610], [-6.920, 107.650]]
    },
    "2022": {
        upt: ["PADASUKA", "CIGONDEWAH", "MARGAHAYU", "PASIRKALIKI", "ARCAMANIK", "CIBUNTU", "GARUDA", "PUTER", "KUJANG SARI", "BABAKAN SARI"],
        kasus: [290, 275, 250, 230, 210, 190, 175, 160, 140, 130],
        gender: [2950, 2350],
        note: "Data 2022: Terjadi normalisasi pelaporan kasus pasca-pandemi di seluruh UPT.",
        coords: [[-6.903, 107.655], [-6.935, 107.575], [-6.945, 107.665], [-6.915, 107.595], [-6.915, 107.675], [-6.925, 107.585], [-6.913, 107.579], [-6.901, 107.610], [-6.938, 107.645], [-6.920, 107.650]]
    },
    "2021": {
        upt: ["CIGONDEWAH", "PADASUKA", "MARGAHAYU", "PASIRKALIKI", "GARUDA", "CIBUNTU", "ARCAMANIK", "PUTER", "KUJANG SARI", "BABAKAN SARI"],
        kasus: [320, 305, 290, 270, 250, 240, 230, 210, 200, 190],
        gender: [2800, 2330],
        note: "Data 2021: Kebijakan masker dan prokes ketat berkontribusi pada rendahnya infeksi saluran pernapasan.",
        coords: [[-6.935, 107.575], [-6.903, 107.655], [-6.945, 107.665], [-6.915, 107.595], [-6.913, 107.579], [-6.925, 107.585], [-6.915, 107.675], [-6.901, 107.610], [-6.938, 107.645], [-6.920, 107.650]]
    },
    "2020": {
        upt: ["PADASUKA", "CIGONDEWAH", "PASIRKALIKI", "MARGAHAYU", "CIBUNTU", "GARUDA", "ARCAMANIK", "PUTER", "KUJANG SARI", "BABAKAN SARI"],
        kasus: [412, 395, 380, 350, 310, 290, 270, 250, 240, 230],
        gender: [4100, 3400],
        note: "Data 2020: Tantangan pelaporan selama puncak pandemi COVID-19.",
        coords: [[-6.903, 107.655], [-6.935, 107.575], [-6.915, 107.595], [-6.945, 107.665], [-6.925, 107.585], [-6.913, 107.579], [-6.915, 107.675], [-6.901, 107.610], [-6.938, 107.645], [-6.920, 107.650]]
    },
    "2019": {
        upt: ["CIGONDEWAH", "PADASUKA", "CIBUNTU", "PASIRKALIKI", "GARUDA", "MARGAHAYU", "ARCAMANIK", "PUTER", "KUJANG SARI", "BABAKAN SARI"],
        kasus: [543, 484, 476, 463, 310, 290, 280, 270, 260, 250],
        gender: [5373, 4606],
        note: "Data 2019: Tren kasus pneumonia sebelum munculnya pandemi.",
        coords: [[-6.935, 107.575], [-6.903, 107.655], [-6.925, 107.585], [-6.915, 107.595], [-6.913, 107.579], [-6.945, 107.665], [-6.915, 107.675], [-6.901, 107.610], [-6.938, 107.645], [-6.920, 107.650]]
    }
};

// --- 2. DATA JAWA BARAT (TOP 10 WILAYAH) ---
const jabarComparison = {
    "2023": {
        labels: ["KAB. BANDUNG", "KAB. CIANJUR", "KAB. CIREBON", "KAB. SUMEDANG", "KOTA BEKASI", "KOTA BANDUNG", "KAB. BOGOR", "KAB. BEKASI", "KAB. KARAWANG", "KOTA CIMAHI"],
        data: [8378, 7934, 7531, 7047, 5845, 5713, 5632, 5421, 5100, 4994],
        analisis: "Wilayah Kabupaten Bandung dan Cianjur mencatat angka tertinggi. Kota Bandung berada di posisi 6 besar Jawa Barat."
    },
    "2022": {
        labels: ["KAB. BEKASI", "KOTA BEKASI", "KAB. BOGOR", "KAB. BANDUNG", "KAB. CIANJUR", "KAB. CIREBON", "KAB. KARAWANG", "KOTA BANDUNG", "KAB. SUKABUMI", "KAB. GARUT"],
        data: [18234, 15400, 12300, 9100, 8500, 7800, 7200, 6900, 6500, 6100],
        analisis: "Lonjakan kasus signifikan terjadi di wilayah penyangga ibu kota seiring normalisasi aktivitas."
    },
    "2021": {
        labels: ["KAB. BOGOR", "KAB. BEKASI", "KAB. BANDUNG", "KOTA BEKASI", "KAB. CIREBON", "KAB. GARUT", "KAB. KARAWANG", "KAB. SUKABUMI", "KOTA BANDUNG", "KAB. CIANJUR"],
        data: [10200, 9800, 7500, 7200, 6800, 6100, 5800, 5500, 5130, 4900],
        analisis: "Tahun dengan pelaporan terendah, namun wilayah luas tetap mendominasi beban kasus."
    },
    "2020": {
        labels: ["KAB. BEKASI", "KAB. BOGOR", "KOTA BEKASI", "KAB. CIREBON", "KAB. BANDUNG", "KAB. KARAWANG", "KOTA BANDUNG", "KAB. GARUT", "KAB. SUKABUMI", "KAB. CIANJUR"],
        data: [12500, 11800, 10200, 9500, 8200, 7800, 7500, 6900, 6200, 5800],
        analisis: "Pneumonia tetap menjadi ancaman serius bagi balita di tengah krisis COVID-19."
    },
    "2019": {
        labels: ["KAB. CIREBON", "KAB. BOGOR", "KAB. GARUT", "KAB. BANDUNG", "KAB. INDRAMAYU", "KAB. BEKASI", "KAB. KARAWANG", "KOTA BEKASI", "KOTA BANDUNG", "KAB. CIANJUR"],
        data: [10818, 9325, 8374, 8349, 7800, 7500, 7200, 6800, 5430, 4290],
        analisis: "Sebelum pandemi, wilayah pesisir dan dataran luas menunjukkan angka laporan tertinggi."
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
    if (id === 'data') { 
        setTimeout(() => { if(!map) initMap(); updateDashboard(); }, 300); 
    }
}

function initMap() {
    map = L.map('map').setView([-6.9175, 107.6191], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    markerGroup = L.layerGroup().addTo(map);
}

function updateDashboard() {
    const yr = document.getElementById('yearFilter').value;
    const cityData = database[yr];
    const jabarData = jabarComparison[yr];

    document.getElementById('year-desc').innerHTML = `<b>Analisis Kota Bandung ${yr}:</b> ${cityData.note}`;

    // 1. Grafik Gender (Pie)
    renderChart('genderChart', 'pie', {
        labels: ['Laki-laki', 'Perempuan'],
        datasets: [{ data: cityData.gender, backgroundColor: ['#3b82f6', '#f472b6'] }]
    });

    // 2. Grafik 10 UPT Bandung (Bar Tegak)
    renderChart('rankingChart', 'bar', {
        labels: cityData.upt,
        datasets: [{
            label: 'Jumlah Kasus',
            data: cityData.kasus,
            backgroundColor: '#fbbf24',
            borderRadius: 5
        }]
    }, {
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
    });

    // 3. Grafik 10 Wilayah Jabar (Horizontal)
    renderChart('topRegionsChart', 'bar', {
        labels: jabarData.labels,
        datasets: [{
            label: 'Jumlah Kasus',
            data: jabarData.data,
            // Warna Gradasi (Merah Tua ke Merah Muda)
            backgroundColor: ['#db2777','#e11d48','#f43f5e','#fb7185','#fda4af','#fecdd3','#ffe4e6','#fecaca','#fee2e2','#fff1f2'],
            borderRadius: 5
        }]
    }, {
        indexAxis: 'y', // KUNCI GRAFIK HORIZONTAL
        maintainAspectRatio: false, // AGAR TIDAK TINI
        plugins: { legend: { display: false } }
    });

    // 4. Update Teks Analisis
    document.getElementById('comparison-analysis').innerHTML = `
        <h5 style="color: #db2777; margin-bottom: 5px;">🔍 Analisis Wilayah Jawa Barat (${yr})</h5>
        <p>Wilayah <strong>${jabarData.labels[0]}</strong> tertinggi dengan <strong>${jabarData.data[0].toLocaleString('id-ID')}</strong> kasus. ${jabarData.analisis}</p>
    `;

    // Map Markers
    markerGroup.clearLayers();
    cityData.coords.forEach((c, i) => {
        L.marker(c).addTo(markerGroup).bindPopup(`<b>UPT ${cityData.upt[i]}</b><br>Kasus: ${cityData.kasus[i]}`);
    });
}

function renderChart(id, type, data, options = {}) {
    if (charts[id]) charts[id].destroy();
    charts[id] = new Chart(document.getElementById(id), { 
        type, 
        data, 
        options: { ...options, maintainAspectRatio: false, responsive: true } 
    });
}
