// --- 1. データを用意する ---

// 運勢のリスト
const fortunes = [
    { name: "✨ 大吉！ ✨", advice: "今日は最高の運気！新しいことに挑戦すると、ブーちゃんが応援してくれるよ！" },
    { name: "💖 中吉 💖", advice: "穏やかでハッピーな一日。美味しいご飯を食べて心と体を満たそう！" },
    { name: "🍀 吉 🍀", advice: "小さな幸運がたくさん！見逃さないように周りをよく見てみてね！" },
    { name: "☁️ 小吉 ☁️", advice: "のんびり過ごすのが吉。疲れていたら無理せず休憩を。ブーちゃんが癒やすよ。" },
    { name: "😊 末吉 😊", advice: "少しずつ運気上昇中！焦らず、自分のペースで進もうね。" }
];

// 写真のリスト（自分でブーちゃんの写真ファイル名に変えてね！）
const photos = [];
// 1から51まで繰り返す
for (let i = 1; i <= 51; i++) {
    // テンプレートリテラル（バッククォート ``）を使って文字列を生成
    photos.push(`images/boochan_${i}.jpg`);
}

// --- 2. 運勢と写真を選ぶロジック ---

// 今日という日付に基づいて、毎回同じ結果になるように乱数シードを生成する関数
// （リロードするたびに結果が変わると困るので、日替わりにするための工夫！）
function getDailySeed() {
    const today = new Date();
    // YYYYMMDD の形で日付を取得 (例: 20251126)
    return parseInt(`${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}`);
}

// シードに基づいて乱数を生成する関数 (Xorshift)
function xorshift(seed) {
    let x = seed;
    x ^= (x << 13);
    x ^= (x >> 17);
    x ^= (x << 5);
    // 0から1の間の浮動小数点数を返す
    return Math.abs((x % 1000) / 1000); 
}

// 今日の運勢と写真を選ぶ
function selectDailyContent() {
    const seed = getDailySeed();
    
    // 運勢と写真を選ぶためのランダムなインデックスを計算
    // Math.floor(乱数 * 配列の長さ)
    const fortuneIndex = Math.floor(xorshift(seed + 1) * fortunes.length); 
    const photoIndex = Math.floor(xorshift(seed + 2) * photos.length); // 運勢とは違う乱数を使う

    const selectedFortune = fortunes[fortuneIndex];
    const selectedPhoto = photos[photoIndex];

    // 選んだ運勢と写真を返す
    return {
        fortuneName: selectedFortune.name,
        adviceText: selectedFortune.advice,
        photoFile: selectedPhoto
    };
}


// --- 3. 画面に表示する ---

document.addEventListener('DOMContentLoaded', () => {
    // 運勢と写真を選ぶ
    const dailyContent = selectDailyContent();

    // 運勢の名前を表示
    document.getElementById('today-fortune').textContent = dailyContent.fortuneName;
    
    // アドバイスを表示
    document.getElementById('healing-advice').textContent = dailyContent.adviceText;
    
    // 写真を表示
    const photoElement = document.getElementById('boochan-photo');
    photoElement.src = dailyContent.photoFile;
    // もし写真が見つからなかった時のために、エラーハンドリング
    photoElement.onerror = () => {
        photoElement.alt = "ブーちゃんの写真が見つかりません😭";
        photoElement.src = "https://via.placeholder.com/300x300?text=Boochan+Photo+Missing"; // 代替画像
    };
});