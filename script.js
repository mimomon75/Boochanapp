// --- 1. データを用意する ---

// 運勢のリスト
const fortunes = [
    { name: "✨ 大吉！ ✨", advice: "すごい！！大吉だぶ！！！今日一日、幸せなことがたくさん待ってそう！！ぼくもおうちからおうえんしてるだぶ！！" },
    { name: "💖 中吉 💖", advice: "今日は穏やかでハッピーな一日になりそうだぶ。美味しいご飯を食べて心と体をぽかぽかに！！" },
    { name: "🍀 吉 🍀", advice: "今日は小さな幸運がたくさんありそうだぶ！見逃さないように周りをよく見てみてね！ぼくのことも忘れずにみてほしいだぶ。。。" },
    { name: "☁️ 小吉 ☁️", advice: "きょうはのんびり過ごすのがいいだぶ。疲れていたら無理せず休憩をとろう！！ぼくは毎日休息ばっかりだけどね。" },
    { name: "🌈 大大吉！ 🌈", advice: "ミラクル発生の予感！遠慮しないで、やりたいことを全部やっちゃおう！ぼくが味方になるだぶ！わあ、頼もしい！！" }, // ← ここにもカンマを打つ！
    { name: "🐷 ブー吉 🐷", advice: "今日は豚カツ、豚まん、豚肉料理がラッキーアイテム！元気とスタミナが湧いてくるよ！美味しく食べてぼくとハッピーになるんだぶ！まって、ぼくはぶたじゃないだぶ！！" },
    
    { name: "😊 末吉 😊", advice: "少しずつ運気上昇中！焦らず、自分のペースで進もうね。ぶーぶペースだぶ！！" }
];


// 写真のリスト（自分でブーちゃんの写真ファイル名に変えてね！）
const photos = [];
// 1から51まで繰り返す
for (let i = 1; i <= 51; i++) {
    // テンプレートリテラル（バッククォート ``）を使って文字列を生成
    photos.push(`images/boochan_${i}.jpg`);
}

// --- 2. 運勢と写真を選ぶロジック (ローカルストレージ対応版) ---

// 運勢と写真を選ぶ（ただし、ランダムに）
function getRandomContent() {
    // 完全にランダムなインデックスを生成
    const fortuneIndex = Math.floor(Math.random() * fortunes.length); 
    const photoIndex = Math.floor(Math.random() * photos.length);

    const selectedFortune = fortunes[fortuneIndex];
    const selectedPhoto = photos[photoIndex];

    return {
        fortuneName: selectedFortune.name,
        adviceText: selectedFortune.advice,
        photoFile: selectedPhoto
    };
}

// 運勢を選ぶメイン関数（ローカルストレージをチェックする）
function selectDailyContent() {
    // 1. ローカルストレージから保存済みの結果を取得する
    const savedContentJson = localStorage.getItem('boochan_daily_content');
    
    // 2. もしメモ（保存データ）があれば、それを使う
    if (savedContentJson) {
        // JSON形式のテキストをJavaScriptのデータに戻して返す
        return JSON.parse(savedContentJson);
    } 
    
    // 3. メモがなければ、新しくランダムな結果を選び、メモ（ストレージ）に保存する
    else {
        const newContent = getRandomContent();
        
        // 選んだ結果をJSON形式のテキストに変換
        const newContentJson = JSON.stringify(newContent); 
        
        // ローカルストレージに保存する
        localStorage.setItem('boochan_daily_content', newContentJson); 
        
        return newContent;
    }
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