/* =========================================================
   1. DATA MENU (Database Simulasi)
   Menggunakan Array of Objects. Dalam proyek nyata, 
   data ini biasanya diambil dari server/database.
   ========================================================= */
const menuData = [
    {
        id: 1,
        nama: "Kopi Susu Gula Aren",
        kategori: "minuman",
        harga: 22000,
        deskripsi: "Espresso 100% Arabica dipadu susu segar dan gula aren.",
        gambar: "https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=300&q=80",
        waktuTunggu: 5, // dalam menit
        isBestSeller: true,
        tags: ["mood-booster", "kopi"]
    },
    {
        id: 2,
        nama: "Nasi Goreng Rempah",
        kategori: "makanan",
        harga: 35000,
        deskripsi: "Nasi goreng bumbu rempah rahasia dengan telur mata sapi dan ayam suwir.",
        gambar: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=300&q=80",
        waktuTunggu: 15,
        isBestSeller: true,
        tags: ["lapar-berat", "pedas"]
    },
    {
        id: 3,
        nama: "Matcha Latte (Vegan)",
        kategori: "minuman",
        harga: 28000,
        deskripsi: "Matcha premium Jepang dengan pilihan susu oat/almond.",
        gambar: "https://images.unsplash.com/photo-1515823662972-da6a296d06d8?auto=format&fit=crop&w=300&q=80",
        waktuTunggu: 5,
        isBestSeller: false,
        tags: ["diet", "vegan", "non-coffee"]
    },
    {
        id: 4,
        nama: "Croffle Choco Crunchy",
        kategori: "penutup",
        harga: 25000,
        deskripsi: "Croissant waffle renyah disiram lelehan cokelat premium.",
        gambar: "https://images.unsplash.com/photo-1627308595229-7830f5c90683?auto=format&fit=crop&w=300&q=80",
        waktuTunggu: 10,
        isBestSeller: true,
        tags: ["badmood-healer", "manis"]
    },
    {
        id: 5,
        nama: "Platter Berbagi",
        kategori: "makanan",
        harga: 45000,
        deskripsi: "Kombinasi sosis, kentang goreng, dan nugget untuk dimakan bareng.",
        gambar: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=300&q=80",
        waktuTunggu: 15,
        isBestSeller: false,
        tags: ["nongkrong-ramai"]
    }
];

/* =========================================================
   2. STATE (Penyimpanan Sementara Data Aplikasi)
   ========================================================= */
let keranjang = []; // Menyimpan item yang dipesan

/* =========================================================
   3. FUNGSI UTILITAS (Bantuan)
   ========================================================= */
// Format angka ke format Rupiah
const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
};

// Efek Getar HP (Haptic Feedback) - Hanya jalan di HP yang mendukung
const getar = () => {
    if (navigator.vibrate) {
        navigator.vibrate(50); // Getar selama 50 milidetik
    }
};

/* =========================================================
   4. RENDER TAMPILAN MENU KE HTML
   ========================================================= */
const menuGrid = document.getElementById("menu-grid");

const tampilkanMenu = (data) => {
    menuGrid.innerHTML = ""; // Bersihkan kontainer sebelum diisi ulang
    
    if (data.length === 0) {
        menuGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center;">Menu tidak ditemukan.</p>`;
        return;
    }

    data.forEach((item) => {
        // Cek apakah dia best seller untuk memunculkan badge
        const badgeHTML = item.isBestSeller ? `<span class="badge best-seller">🔥 Best Seller</span>` : "";

        // Buat elemen HTML menggunakan Template Literal (Backtick ` `)
        const htmlCard = `
            <article class="menu-card" data-category="${item.kategori}">
                ${badgeHTML}
                <div class="menu-media">
                    <img src="${item.gambar}" alt="${item.nama}">
                    <span class="wait-time">⏳ ~${item.waktuTunggu} Menit</span>
                </div>
                <div class="menu-info">
                    <h3 class="menu-title">${item.nama}</h3>
                    <p class="menu-desc">${item.deskripsi}</p>
                    <p class="menu-price">${formatRupiah(item.harga)}</p>
                </div>
                <div class="menu-actions">
                    <button class="btn-add-cart" onclick="tambahKeKeranjang(${item.id})">Tambah 🛒</button>
                </div>
            </article>
        `;
        menuGrid.innerHTML += htmlCard;
    });
};

// Tampilkan semua menu saat halaman pertama kali dibuka
tampilkanMenu(menuData);

/* =========================================================
   5. FITUR FILTER & PENCARIAN
   ========================================================= */
// Pencarian Teks
document.getElementById("search-input").addEventListener("input", (e) => {
    const kataKunci = e.target.value.toLowerCase();
    const hasilFilter = menuData.filter(item => item.nama.toLowerCase().includes(kataKunci));
    tampilkanMenu(hasilFilter);
});

// Filter Kategori (Semua, Makanan, Minuman, Penutup)
const tombolKategori = document.querySelectorAll(".btn-filter");
tombolKategori.forEach(tombol => {
    tombol.addEventListener("click", (e) => {
        // Ubah warna tombol yang aktif
        tombolKategori.forEach(btn => btn.classList.remove("active"));
        e.target.classList.add("active");

        const kategoriDipilih = e.target.getAttribute("data-category");
        if (kategoriDipilih === "semua") {
            tampilkanMenu(menuData);
        } else {
            const hasilFilter = menuData.filter(item => item.kategori === kategoriDipilih);
            tampilkanMenu(hasilFilter);
        }
        getar();
    });
});

// Filter Budget (Di Bawah Rp 30.000)
document.getElementById("btn-budget").addEventListener("click", () => {
    const budget = prompt("Masukkan maksimal harga (misal: 30000):", "30000");
    if (budget) {
        const hasilFilter = menuData.filter(item => item.harga <= parseInt(budget));
        tampilkanMenu(hasilFilter);
        getar();
    }
});

/* =========================================================
   6. FITUR KERANJANG BELANJA (Cart System)
   ========================================================= */
const cartPanel = document.getElementById("cart-panel");
const cartCount = document.getElementById("cart-count");
const cartItemsContainer = document.getElementById("cart-items");
const totalPriceEl = document.getElementById("total-price");
const totalWaitTimeEl = document.getElementById("total-wait-time");

// Fungsi menambah menu ke keranjang
window.tambahKeKeranjang = (idMenu) => {
    getar();
    const menu = menuData.find(item => item.id === idMenu);
    
    // Cek apakah item sudah ada di keranjang
    const itemAda = keranjang.find(item => item.id === idMenu);
    if (itemAda) {
        itemAda.qty += 1; // Tambah jumlahnya
    } else {
        keranjang.push({ ...menu, qty: 1 }); // Masukkan item baru dengan qty 1
    }
    
    perbaruiKeranjang();
    bukaKeranjang(); // Otomatis buka panel keranjang
};

// Fungsi menghitung dan memperbarui tampilan keranjang
const perbaruiKeranjang = () => {
    cartItemsContainer.innerHTML = "";
    let totalHarga = 0;
    let waktuMasakTerlama = 0;
    let totalItem = 0;

    keranjang.forEach((item, index) => {
        totalHarga += item.harga * item.qty;
        totalItem += item.qty;
        if (item.waktuTunggu > waktuMasakTerlama) waktuMasakTerlama = item.waktuTunggu;

        cartItemsContainer.innerHTML += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>${item.nama} (x${item.qty})</span>
                <span>${formatRupiah(item.harga * item.qty)}</span>
            </div>
        `;
    });

    cartCount.innerText = totalItem;
    totalPriceEl.innerText = formatRupiah(totalHarga);
    totalWaitTimeEl.innerText = keranjang.length > 0 ? `~${waktuMasakTerlama} Menit` : "-";

    // Hitung ulang split bill jika input pembagi berubah
    hitungSplitBill(); 
};

// Buka/Tutup Panel Keranjang
const bukaKeranjang = () => cartPanel.classList.remove("hidden");
const tutupKeranjang = () => cartPanel.classList.add("hidden");
document.getElementById("btn-close-cart").addEventListener("click", tutupKeranjang);

/* =========================================================
   7. FITUR SPLIT BILL (Hitung Patungan)
   ========================================================= */
const splitCountInput = document.getElementById("split-count");
const splitResultEl = document.getElementById("split-result");

const hitungSplitBill = () => {
    const jumlahOrang = parseInt(splitCountInput.value) || 1;
    const totalHarga = keranjang.reduce((total, item) => total + (item.harga * item.qty), 0);
    const hasilBagi = totalHarga / jumlahOrang;
    splitResultEl.innerText = formatRupiah(hasilBagi);
};
splitCountInput.addEventListener("input", hitungSplitBill);

/* =========================================================
   8. INTEGRASI WHATSAPP & PANGGIL PELAYAN
   ========================================================= */
// Kirim Pesanan via WhatsApp
document.getElementById("btn-send-wa").addEventListener("click", () => {
    if (keranjang.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    const nomorWA = "6281234567890"; // Ganti dengan nomor kafe asli
    const nomorMeja = prompt("Masukkan Nomor Meja Anda:", "01");
    if (!nomorMeja) return;

    let pesan = `Halo Kasir, saya ingin memesan untuk *Meja ${nomorMeja}*:\n\n`;
    keranjang.forEach(item => {
        pesan += `- ${item.nama} (x${item.qty}) :${formatRupiah(item.harga * item.qty)}\n`;
    });
    
    const totalHarga = keranjang.reduce((total, item) => total + (item.harga * item.qty), 0);
    pesan += `\n*Total Tagihan: ${formatRupiah(totalHarga)}*`;
    pesan += `\nMohon segera diproses. Terima kasih!`;

    // Encode teks agar aman untuk URL WhatsApp
    const urlWA = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;
    window.open(urlWA, "_blank"); // Buka tab baru
});

// Panggil Pelayan
document.getElementById("btn-call-waiter").addEventListener("click", () => {
    getar();
    const nomorWA = "628176938430";
    const nomorMeja = prompt("Nomor Meja Anda?");
    if (nomorMeja) {
        const pesan = `Halo, mohon bantuan pelayan ke *Meja ${nomorMeja}*.`;
        window.open(`https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`, "_blank");
    }
});

/* =========================================================
   9. FITUR INTERAKTIF LAINNYA
   ========================================================= */
// Fitur "Surprise Me!" (Pilih Menu Acak)
document.getElementById("btn-surprise").addEventListener("click", () => {
    getar();
    const indexAcak = Math.floor(Math.random() * menuData.length);
    const menuAcak = menuData[indexAcak];
    alert(`🎉 Coba tebak? Hari ini kamu cocok pesan: ${menuAcak.nama}!\nHarga cuma${formatRupiah(menuAcak.harga)}.`);
});

// Dark Mode Toggle
document.getElementById("theme-toggle").addEventListener("click", (e) => {
    getar();
    const htmlEl = document.documentElement;
    const temaSekarang = htmlEl.getAttribute("data-theme");
    
    if (temaSekarang === "light") {
        htmlEl.setAttribute("data-theme", "dark");
        e.target.innerText = "☀️ Mode Terang";
    } else {
        htmlEl.setAttribute("data-theme", "light");
        e.target.innerText = "🌙 Mode Gelap";
    }
});

// Modal QRIS
const modalQris = document.getElementById("modal-qris");
document.getElementById("btn-qris-modal").addEventListener("click", () => {
    modalQris.classList.remove("hidden");
});
document.getElementById("close-qris").addEventListener("click", () => {
    modalQris.classList.add("hidden");
});
