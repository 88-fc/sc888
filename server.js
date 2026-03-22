const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 确保数据目录存在
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
const dbPath = path.join(dataDir, 'db.json');

// 默认数据（包含所有可配置项）
const defaultData = {
    products: [],
    heroSlides: [
        {
            img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=2000",
            mainTitle: { "zh-CN": "紫薇文创三清观", "zh-TW": "紫薇文創三清觀", "en": "Ziwei Taoist Sanctuary", "ja": "紫薇文創三清観" },
            subtitle: { "zh-CN": "仙道贵生 · 无量度人", "zh-TW": "仙道貴生 · 無量度人", "en": "Taoism · Infinite Blessings", "ja": "仙道貴生 · 無量度人" },
            showTaiji: true
        },
        {
            img: "https://images.pexels.com/photos/6994592/pexels-photo-6994592.jpeg",
            mainTitle: { "zh-CN": "雷击枣木 · 天师敕令", "zh-TW": "雷擊棗木 · 天師敕令", "en": "Thunderstruck Wood · Talisman", "ja": "雷撃棗木 · 天師敕令" },
            subtitle: { "zh-CN": "桃木剑｜五雷号令｜七星剑", "zh-TW": "桃木劍｜五雷號令｜七星劍", "en": "Sword | Thunder Seal | Seven-Star Sword", "ja": "桃木剣｜五雷号令｜七星剣" },
            showTaiji: false
        }
    ],
    pageTexts: {
        "zh-CN": { navTitle: "紫薇文创三清观", aboutTitle: "紫薇文创三清观 · 正一派玄门", aboutDesc: "秉承正一龙虎宗法脉，法器经择日、洒净、敕笔、入神、开光、结煞六重秘法。" },
        "zh-TW": { navTitle: "紫薇文創三清觀", aboutTitle: "紫薇文創三清觀 · 正一派玄門", aboutDesc: "秉承正一龍虎宗法脈，法器經擇日、灑淨、敕筆、入神、開光、結煞六重秘法。" },
        "en": { navTitle: "Ziwei Taoist Sanctuary", aboutTitle: "Ziwei Sanqing Temple · Orthodox Taoism", aboutDesc: "Following the Zhengyi Longhu Mountain lineage, each artifact undergoes six rituals..." },
        "ja": { navTitle: "紫薇文創三清観", aboutTitle: "紫薇文創三清観 · 正一派道教", aboutDesc: "正一龍虎宗の法脈に従い、法器は六重の秘法を経て開光されます。" }
    },
    config: {
        siteName: {
            "zh-CN": "紫薇文创三清观",
            "zh-TW": "紫薇文創三清觀",
            "en": "Ziwei Taoist Sanctuary",
            "ja": "紫薇文創三清観"
        },
        logo: "",
        theme: {
            primaryColor: "#b87c2e",
            backgroundColor: "#fef9ef",
            fontFamily: "'Noto Serif SC', 'Times New Roman', serif",
            baseFontSize: "16px",
            cardBgColor: "rgba(255, 252, 240, 0.92)",
            textColor: "#2e241f"
        },
        contacts: {
            whatsapp: "8613739258367",
            line: "2ww_EzbN3D",
            email: "service@ziwei.com"
        },
        categories: [
            { key: "护身符", name: { "zh-CN": "护身符", "zh-TW": "護身符", "en": "Talisman", "ja": "護符" } },
            { key: "手串 / 水晶", name: { "zh-CN": "手串 / 水晶", "zh-TW": "手串 / 水晶", "en": "Bracelet / Crystal", "ja": "ブレスレット / 水晶" } },
            { key: "风水摆件", name: { "zh-CN": "风水摆件", "zh-TW": "風水擺件", "en": "Feng Shui Ornament", "ja": "風水置物" } },
            { key: "法事 / 开光", name: { "zh-CN": "法事 / 开光", "zh-TW": "法事 / 開光", "en": "Ritual / Consecration", "ja": "法要 / 開光" } }
        ],
        footer: {
            "zh-CN": "© 2026 紫薇文創三清觀 — 道炁長存 福生無量天尊",
            "zh-TW": "© 2026 紫薇文創三清觀 — 道炁長存 福生無量天尊",
            "en": "© 2026 Ziwei Taoist Sanctuary — Taoism Everlasting",
            "ja": "© 2026 紫薇文創三清観 — 道炁長存 福生無量天尊"
        },
        ritualSection: {
            title: {
                "zh-CN": "高功法师 · 先天奏斗科仪",
                "zh-TW": "高功法師 · 先天奏斗科儀",
                "en": "Senior Taoist Ritual Service",
                "ja": "高功道士 · 法事予約"
            },
            description: {
                "zh-CN": "禳灾解厄 · 补财库 · 还阴债 · 超度 · 文昌祈愿 · 由龙虎山嗣汉天师府授箓法师亲自主坛，附疏文影像。",
                "zh-TW": "禳災解厄 · 補財庫 · 還陰債 · 超度 · 文昌祈願 · 由龍虎山嗣漢天師府授籙法師親自主壇，附疏文影像。",
                "en": "Rituals for wealth, karma cleansing, blessing. Performed by certified masters.",
                "ja": "厄除け、財運向上、先祖供養などの法要を承ります。"
            }
        }
    }
};

function loadData() {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
        return defaultData;
    }
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function saveData(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

let db = loadData();

// 图片上传配置
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'public/uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, unique + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

// API 路由
app.get('/api/data', (req, res) => {
    res.json(db);
});

app.post('/api/data', (req, res) => {
    db = req.body;
    saveData(db);
    res.json({ success: true });
});

// 商品 CRUD
app.get('/api/products', (req, res) => {
    res.json(db.products);
});

app.post('/api/products', (req, res) => {
    const newProduct = req.body;
    newProduct.id = Date.now();
    db.products.push(newProduct);
    saveData(db);
    res.json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = db.products.findIndex(p => p.id === id);
    if (index !== -1) {
        db.products[index] = { ...db.products[index], ...req.body, id };
        saveData(db);
        res.json(db.products[index]);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    db.products = db.products.filter(p => p.id !== id);
    saveData(db);
    res.json({ success: true });
});

app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
});

app.listen(PORT, () => {
    console.log(`✅ 服务器启动成功！`);
    console.log(`🌐 前台商城: http://localhost:${PORT}/index.html`);
    console.log(`🛠️  后台管理: http://localhost:${PORT}/admin.html`);
});