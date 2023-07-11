// CSVファイル読み込み
function csvToArray(path) {
  var csvData = new Array();
  var data = new XMLHttpRequest();
  data.open("GET", path, false);
  data.send(null);
  var LF = String.fromCharCode(10);
  var CR = String.fromCharCode(13);
  var lines = data.responseText.replace(/\n/g, '').split(CR);
  for (var i = 0; i < lines.length; ++i) {
    var cells = lines[i].split(",");
    if (cells.length != 1) {
      csvData.push(cells);
    }
  }
  return csvData;
}

// 名前を検索し、結果を表示する関数
function searchName() {
  const nameInput = document.getElementById('name-input');
  const name = nameInput.value;

  if (name.trim() === '') {
    return; // 名前が空の場合は処理しない
  }

  const data = csvToArray('https://docs.google.com/spreadsheets/d/e/2PACX-1vRd6SSkeoF4Q7GpqTp_5l9vg5_3fBAcmaPW55qq2Sg-VuVznkRXusKidnTxmbVGoHIKYuH5RHB9HTkN/pub?gid=213972052&single=true&output=csv');

let matchingRow = -1; // 該当する行のインデックス（見つからなかった場合は-1）

// 名前を検索
for (let i = 0; i < data.length; i++) {
  const row = data[i];
  if (row[0].includes(name)) {
    matchingRow = i;
    break;
  }
}

  const currentDateTime = new Date();
  const currentTimeString = currentDateTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  const chatMessages = document.getElementById('chat-messages');
  const userMessage = document.createElement('div');
  userMessage.classList.add('user-message');
  userMessage.innerHTML = `<p>User: ${name}   現在時刻${currentTimeString}</p>`;
  chatMessages.appendChild(userMessage);

  if (matchingRow !== -1) {
    const matchingValues = data[matchingRow].slice(1); // 該当する行の2列目以降の値を取得

    const assistantMessage = document.createElement('div');
    assistantMessage.classList.add('assistant-message');

    let messageHTML = `<p>Assistant: ${name}さんのシフトを表示します。</p>`;

    for (let i = 0; i < matchingValues.length; i++) {
      const hour = Math.floor(i / 6) + 5; // 時間（5から始まる）
      const minute = (i % 6) * 10; // 分（0, 10, 20, 30, 40, 50）
      const hourString = hour.toString().padStart(2, '0'); // 時間を2桁にする
      const minuteString = minute.toString().padStart(2, '0'); // 分を2桁にする
      const timeString = `${hourString}:${minuteString}`;

      const value = matchingValues[i];
      messageHTML += `<p>${timeString} ${value}</p>`;
    }
    messageHTML += `<button onclick="copyToClipboard('${messageHTML}')">クリップボードにコピー</button>`;
    assistantMessage.innerHTML = messageHTML;
    chatMessages.appendChild(assistantMessage);

  } else {
    const assistantMessage = document.createElement('div');
    assistantMessage.classList.add('assistant-message');
    assistantMessage.innerHTML = `<p>Assistant: 該当する名前は見つかりませんでした。</p>`;
    chatMessages.appendChild(assistantMessage);
  }

  nameInput.value = '';
}

// クリップボードにテキストをコピーする関数
function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  alert("コピーしました！");
}

// Enterキーのイベントハンドラを追加
document.getElementById('name-input').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // Enterキーのデフォルトの挙動を無効化
    searchName(); // 名前の検索を実行
  }
});
