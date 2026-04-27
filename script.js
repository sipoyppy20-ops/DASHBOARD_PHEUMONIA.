AOS.init();
let charts = {};
let map, markerGroup;

// --- DATA KOTA BANDUNG ---
const database = {
    "2023": {
        upt: ["PADASUKA", "CIGONDEWAH", "MARGAHAYU", "ARCAMANIK", "KUJANG SARI"],
        kasus: [278, 260, 202, 196, 150],
        penduduk: [4200, 4400, 3320, 2850, 2720],
        gender: [2780, 2350],
        note: "Tahun 2023: Efektivitas vaksinasi PCV di Bandung mulai menunjukkan hasil dengan angka kasus yang terkendali.",
        coords: [[-6.903, 107.655], [-6.935, 107.575], [-6.945, 107.665], [-6.915, 107.675], [-6.938, 107.645]]
    },
    "2022": {
        upt: ["PADASUKA", "CIGONDEWAH", "MARGAHAYU", "PASIRKALIKI", "ARCAMANIK"],
        kasus: [290, 275, 250, 230, 210],
        penduduk: [4210, 4420, 3300, 4000, 2800],
        gender: [2950, 2350],
        note: "Tahun 2022: Terjadi peningkatan pelaporan kasus seiring dengan normalisasi layanan kesehatan pasca-pandemi.",
        coords: [[-6.903, 107.655], [-6.935, 107.575], [-6.945, 107.665], [-6.915, 107.595], [-6.915, 107.675]]
    },
    "2021": {
        upt: ["CIGONDEWAH", "PADASUKA", "MARGAHAYU", "PASIRKALIKI", "GARUDA"],
        kasus: [320, 305, 290, 270, 250],
        penduduk: [4450, 4230, 3280, 4020, 3420],
        gender: [2800, 2330],
        note: "Tahun 2021: Angka terendah tercatat karena protokol kesehatan (masker & jarak) yang sangat ketat.",
        coords: [[-6.935, 107.575], [-6.903, 107.655], [-6.945, 107.665], [-6.915, 107.595], [-6.913, 107.579]]
    },
    "2020": {
        upt: ["PADASUKA", "CIGONDEWAH", "PASIRKALIKI", "MARGAHAYU", "CIBUNTU"],
        kasus: [412, 395, 380, 350, 310],
        penduduk: [4250, 4480, 4050, 3250, 3850],
        gender: [4100, 3400],
        note: "Tahun 2020: Penurunan jumlah pelaporan kasus karena pembatasan mobilitas sosial.",
        coords: [[-6.903, 107.655], [-6.935, 107.575], [-6.915, 107.595], [-6.945, 107.665], [-6.925, 107.585]]
    },
    "2019": {
        upt: ["CIGONDEWAH", "PADASUKA", "CIBUNTU", "PASIRKALIKI", "GARUDA"],
        kasus: [543, 484, 476, 463, 310],
        penduduk: [4500, 4200, 3900, 4100, 3500],
        gender: [5373, 4606],
        note: "Tahun 2019: Periode sebelum pandemi dengan angka pneumonia balita cukup tinggi di Bandung.",
        coords: [[-6.935, 107.575], [-6.903, 107.655], [-6.925, 107.585], [-6.915, 107.595], [-6.913, 107.579]]
    }
};

// --- DATA PERBANDINGAN SE-JAWA BARAT (Berdasarkan CSV) ---
const jabarComparison = {
    "2023": {
        labels: ["KAB. BANDUNG", "KAB. CIANJUR", "KAB. CIREBON", "KAB. SUMEDANG", "KOTA BANDUNG"],
        data: [8378, 7934, 7531, 7047, 5713],
        analisis: "Kabupaten Bandung mencatat angka tertinggi. Kota Bandung berada di posisi 5 besar wilayah dengan kasus terbanyak di Jabar."
    },
    "2022": {
        labels: ["KAB. BEKASI", "KOTA BEKASI", "KAB. BOGOR", "KAB. BANDUNG", "KAB. CIANJUR"],
        data: [18234, 15400, 12300, 9100, 8500],
        analisis: "Wilayah industri penyangga Jakarta (Bekasi & Bogor) mendominasi kasus karena kepadatan polusi dan populasi."
    },
    "2021": {
        labels: ["KAB. BOGOR", "KAB. BEKASI", "KAB. BANDUNG", "KOTA BEKASI", "KAB. CIREBON"],
        data: [10200, 9800, 7500, 7200, 6800],
        analisis: "Meskipun masa pandemi, wilayah Kabupaten dengan area luas tetap mencatat pelaporan kasus terbanyak."
    },
    "2020": {
        labels: ["KAB. BEKASI", "KAB. BOGOR", "KOTA BEKASI", "KAB. CIREBON", "KAB. BANDUNG"],
        data: [12500, 11800, 10200, 9500, 8200],
        analisis: "Tahun 2020 menunjukkan penurunan pelaporan secara umum, namun Bekasi tetap menjadi konsentrasi tertinggi."
    },
    "2019": {
        labels: ["KAB. CIREBON", "KAB. BOGOR", "KAB. GARUT", "KAB. BANDUNG", "KAB. INDRAMAYU"],
        data: [10818, 9325, 8374, 8349, 7800],
        analisis: "Sebelum pandemi, wilayah pesisir dan kabupaten luas di Jabar mendominasi angka kasus pneumonia balita."
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

    // 2. Grafik Rangking UPT Bandung (Bar Tegak)
    renderChart('rankingChart', 'bar', {
        labels: cityData.upt,
        datasets: [
            { label: 'Kasus', data: cityData.kasus, backgroundColor: '#fbbf24' },
            { label: 'Balita', data: cityData.penduduk, backgroundColor: '#cbd5e1' }
        ]
    });

    // 3. FITUR BARU: Grafik Horizontal Top 5 Jabar
    renderChart('topRegionsChart', 'bar', {
        labels: jabarData.labels,
        datasets: [{
            label: 'Jumlah Kasus',
            data: jabarData.data,
            // Warna merah tua (#db2777) untuk ranking 1, sisanya gradasi
            backgroundColor: ['#db2777', '#f43f5e', '#fb7185', '#fda4af', '#fecdd3'],
            borderRadius: 5
        }]
    }, {
        indexAxis: 'y', // Kunci untuk grafik horizontal
        plugins: { legend: { display: false } }
    });

    // 4. Update Teks Analisis Kontekstual
    document.getElementById('comparison-analysis').innerHTML = `
        <h5 style="color: #db2777; margin-bottom: 5px;">🔍 Analisis Wilayah Jabar (${yr})</h5>
        <p>Wilayah <strong>${jabarData.labels[0]}</strong> mencatat kasus tertinggi. ${jabarData.analisis}</p>
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
