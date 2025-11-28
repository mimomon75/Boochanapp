// --- 1. データを用意する ---

// 運勢のリスト
const fortunes = [
    { name: "✨ 大吉！ ✨", advice: "すごい！！大吉だぶ！！！今日一日、幸せなことがたくさん待ってそう！！ぼくもおうちからおうえんしてるだぶ！！" },
    { name: "💖 中吉 💖", advice: "今日は穏やかでハッピーな一日になりそうだぶ。美味しいご飯を食べて心と体をぽかぽかに！！" },
    { name: "🍀 吉 🍀", advice: "今日は小さな幸運がたくさんありそうだぶ！見逃さないように周りをよく見てみてね！ぼくのことも忘れずにみてほしいだぶ。。。" },
    { name: "☁️ 小吉 ☁️", advice: "きょうはのんびり過ごすのがいいだぶ。疲れていたら無理せず休憩をとろう！！ぼくは毎日休息ばっかりだけどね。" },
    { name: "🌈 大大吉！ 🌈", advice: "ミラクル発生の予感！遠慮しないで、やりたいことを全部やっちゃおう！ぼくが味方になるだぶ！わあ、頼もしい！！" }, // ← ここにもカンマを打つ！
    { name: "🐶 ブー吉 🐶", advice: "今日は豚カツ、豚まん、豚肉料理がラッキーアイテム！元気とスタミナが湧いてくるよ！美味しく食べてぼくとハッピーになるんだぶ！まって、ぼくはぶたじゃないだぶ！！" },
    
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

// --- 5. ToDoリスト機能のロジック ---

const taskText = document.getElementById('task-text');
const taskDate = document.getElementById('task-date');
const addTaskBtn = document.getElementById('add-task-btn');
const todoList = document.getElementById('todo-list');

// ローカルストレージからタスクを取得する
function getTasks() {
    const tasksJson = localStorage.getItem('boochan_tasks');
    return tasksJson ? JSON.parse(tasksJson) : [];
}

// ローカルストレージにタスクを保存する
function saveTasks(tasks) {
    localStorage.setItem('boochan_tasks', JSON.stringify(tasks));
}

// タスクをリストとしてHTMLに描画する
function renderTasks() {
    const tasks = getTasks();
    todoList.innerHTML = ''; // リストを一旦クリア

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        
        // 期限日のフォーマット (YYYY-MM-DD -> YYYY/MM/DD)
        const formattedDate = task.date.replace(/-/g, '/'); 
        
        li.innerHTML = `
            <span class="task-info">
                <span class="task-date">[${formattedDate} まで]</span> 
                <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            </span>
            <div class="task-actions">
                <button class="complete-btn" data-index="${index}">完了</button>
                <button class="delete-btn" data-index="${index}">削除</button>
            </div>
        `;
        todoList.appendChild(li);
    });
}

// タスク追加ボタンのイベントリスナー
addTaskBtn.addEventListener('click', () => {
    const text = taskText.value.trim();
    const date = taskDate.value;

    if (text !== '' && date !== '') {
        const tasks = getTasks();
        const newTask = {
            text: text,
            date: date, // YYYY-MM-DD 形式
            completed: false
        };
        tasks.push(newTask);
        saveTasks(tasks);
        renderTasks();

        // フォームをリセット
        taskText.value = '';
        taskDate.value = '';
    }
});

// 完了/削除ボタンのイベントリスナー
todoList.addEventListener('click', (event) => {
    const index = event.target.dataset.index;
    if (index === undefined) return;

    const tasks = getTasks();
    const taskIndex = parseInt(index);

    if (event.target.classList.contains('complete-btn')) {
        // 完了状態を切り替える
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks(tasks);
        renderTasks();
    } else if (event.target.classList.contains('delete-btn')) {
        // タスクを削除する
        tasks.splice(taskIndex, 1);
        saveTasks(tasks);
        renderTasks();
    }
});

// アプリ起動時にタスクを描画
renderTasks();
// --- 6. バージョン表示ロジック ---

function displayVersion() {
    const scripts = document.getElementsByTagName('script');
    let scriptSrc = '';
    
    // 実行中の script.js の src を探す
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src.includes('script.js')) {
            scriptSrc = scripts[i].src;
            break;
        }
    }

    const versionElement = document.getElementById('version-display');
    if (!versionElement) return;

    if (scriptSrc) {
        try {
            // URLオブジェクトを使ってクエリパラメータ 'v' を取得
            const url = new URL(scriptSrc);
            const versionParam = url.searchParams.get('v'); 
            
            if (versionParam) {
                // 例: versionParamが'1'なら 'v1' と表示
                versionElement.textContent = `v${versionParam}`;
            }
        } catch (e) {
            // エラー処理
            console.error("Failed to parse script URL for version:", e);
        }
    }
}

// アプリ起動時にバージョンを表示
displayVersion();