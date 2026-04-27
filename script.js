AOS.init();
let charts = {};
let map, markerGroup;

// 1. DATA DASAR (Kota Bandung)
const database = {
    "2023": {
        upt: ["PADASUKA", "CIGONDEWAH", "MARGAHAYU", "ARCAMANIK", "KUJANG SARI"],
        kasus: [278, 260, 202, 196, 150],
        penduduk: [4200, 4400, 3320, 2850, 2720],
        gender: [2780, 2350],
        note: "Tahun 2023: Efektivitas vaksinasi PCV mulai menjaga stabilitas angka kasus rendah di Kota Bandung.",
        coords: [[-6.903, 107.655], [-6.935, 107.575], [-6.945, 107.665], [-6.915, 107.675], [-6.938, 107.645]]
    },
    "2022": {
        upt: ["PADASUKA", "CIGONDEWAH", "MARGAHAYU", "PASIRKALIKI", "ARCAMANIK"],
        kasus: [290, 275, 250, 230, 210],
        penduduk: [4210, 4420, 3300, 4000, 2800],
        gender: [2950, 2350],
        note: "Tahun 2022: Kasus stabil namun ada tren kenaikan mobilitas pasca-pandemi.",
        coords: [[-6.903, 107.655], [-6.935, 107.575], [-6.945, 107.665], [-6.915, 107.595], [-6.915, 107.675]]
    },
    "2021": {
        upt: ["CIGONDEWAH", "PADASUKA", "MARGAHAYU", "PASIRKALIKI", "GARUDA"],
        kasus: [320, 305, 290, 270, 250],
        penduduk: [4450, 4230, 3280, 4020, 3420],
        gender: [2800, 2330],
        note: "Tahun 2021: Titik terendah berkat protokol kesehatan ketat selama pandemi.",
        coords: [[-6.935, 107.575], [-6.903, 107.655], [-6.945, 107.665], [-6.915, 107.595], [-6.913, 107.579]]
    },
    "2020": {
        upt: ["PADASUKA", "CIGONDEWAH", "PASIRKALIKI", "MARGAHAYU", "CIBUNTU"],
        kasus: [412, 395, 380, 350, 310],
        penduduk: [4250, 4480, 4050, 3250, 3850],
        gender: [4100, 3400],
        note: "Tahun 2020: Penurunan pelaporan karena fokus fasilitas kesehatan beralih ke COVID-19.",
        coords: [[-6.903, 107.655], [-6.935, 107.575], [-6.915, 107.595], [-6.945, 107.665], [-6.925, 107.585]]
    },
    "2019": {
        upt: ["CIGONDEWAH", "PADASUKA", "CIBUNTU", "PASIRKALIKI", "GARUDA"],
        kasus: [543, 484, 476, 463, 310],
        penduduk: [4500, 4200, 3900, 4100, 3500],
        gender: [5373, 4606],
        note: "Tahun 2019: Puncak kasus tertinggi sebelum pandemi di wilayah padat penduduk.",
        coords: [[-6.935, 107.575], [-6.903, 107.655], [-6.925, 107.585], [-6.915, 107.595], [-6.913, 107.579]]
    }
};

// 2. DATA PERBANDINGAN SE-JAWA BARAT (Top 5 & Total)
const jabarComparison = {
    "2023": {
        labels: ["KOTA BEKASI", "KAB. BEKASI", "KAB. BANDUNG", "KAB. CIANJUR", "KAB. CIREBON"],
        data: [16592, 14887, 8378, 7934, 7531],
        total: 139199,
        analisis: "Wilayah industri seperti Bekasi mendominasi karena kepadatan penduduk dan polusi udara yang memicu gangguan pernapasan."
    },
    "2022": {
        labels: ["KAB. BEKASI", "KOTA BEKASI", "KAB. BOGOR", "KAB. BANDUNG", "KAB. CIANJUR"],
        data: [18234, 15400, 12300, 9100, 8500],
        total: 153066,
        analisis: "Lonjakan tajam terjadi pasca-pelonggaran mobilitas masyarakat di wilayah penyangga ibu kota."
    },
    "2021": {
        labels: ["KAB. BOGOR", "KAB. BEKASI", "KAB. BANDUNG", "KOTA BEKASI", "KAB. CIREBON"],
        data: [10200, 9800, 7500, 7200, 6800],
        total: 91942,
        analisis: "Angka terendah berkat kesadaran PHBS (Perilaku Hidup Bersih Sehat) yang meningkat selama pandemi."
    },
    "2020": {
        labels: ["KAB. BEKASI", "KAB. BOGOR", "KOTA BEKASI", "KAB. CIREBON", "KAB. BANDUNG"],
        data: [12500, 11800, 10200, 9500, 8200],
        total: 112102,
        analisis: "Wilayah urban dengan aktivitas ekonomi esensial tetap menjadi titik konsentrasi kasus meskipun ada pembatasan."
    },
    "2019": {
        labels: ["KAB. CIREBON", "KAB. BOGOR", "KAB. GARUT", "KAB. BANDUNG", "KAB. INDRAMAYU"],
        data: [10818, 9325, 8374, 8349, 7800],
        total: 161883,
        analisis: "Wilayah kabupaten yang luas mencatat angka tertinggi karena tantangan cakupan imunisasi yang belum merata."
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
        setTimeout(() => { 
            if(!map) initMap(); 
            updateDashboard(); 
        }, 300); 
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

    // 2. Grafik Rangking UPT (Bar)
    renderChart('rankingChart', 'bar', {
        labels: cityData.upt,
        datasets: [
            { label: 'Kasus', data: cityData.kasus, backgroundColor: '#fbbf24' },
            { label: 'Balita', data: cityData.penduduk, backgroundColor: '#cbd5e1' }
        ]
    });

    // 3. GRAFIK HORIZONTAL TOP 5 JABAR (Fitur Baru)
    renderChart('topRegionsChart', 'bar', {
        labels: jabarData.labels,
        datasets: [{
            label: 'Jumlah Kasus',
            data: jabarData.data,
            // Merah tua (#db2777) untuk ranking 1, sisanya degradasi
            backgroundColor: ['#db2777', '#f43f5e', '#fb7185', '#fda4af', '#fecdd3'],
            borderRadius: 5
        }]
    }, {
        indexAxis: 'y', // Membuat horizontal
        plugins: { legend: { display: false } }
    });

    // 4. Update Teks Analisis Kontekstual
    document.getElementById('comparison-analysis').innerHTML = `
        <strong>🔍 Mengapa wilayah ini tertinggi di tahun ${yr}?</strong><br>
        Wilayah <b>${jabarData.labels[0]}</b> menempati urutan pertama dengan ${jabarData.data[0].toLocaleString('id-ID')} kasus. 
        <p style="margin-top:10px; font-style: italic;">${jabarData.analisis}</p>
        <small>Total Kasus Se-Jawa Barat: ${jabarData.total.toLocaleString('id-ID')} orang.</small>
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
        options: { ...options, maintainAspectRatio: false } 
    });
}
