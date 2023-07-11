// CSVデータの取得
function csvToArray(path) {
  const csvData = [];
  const data = new XMLHttpRequest();
  data.open("GET", path, false);
  data.send(null);
  const LF = String.fromCharCode(10);
  const CR = String.fromCharCode(13);
  const lines = data.responseText.replace(/\n/g, '').split(CR);
  for (let i = 0; i < lines.length; ++i) {
    const cells = lines[i].split(",");
    if (cells.length !== 1) {
      csvData.push(cells);
    }
  }
  return csvData;
}

// シフトを検索し、結果を表示する関数
function searchShift() {
  const shiftInput = document.getElementById('shift-input');
  const shift = shiftInput.value;

  if (shift.trim() === '') {
    return; // シフトが空の場合は処理を終了
  }

  const chatMessages = document.getElementById('chat-messages');
  const data = csvToArray('https://docs.google.com/spreadsheets/d/e/2PACX-1vRd6SSkeoF4Q7GpqTp_5l9vg5_3fBAcmaPW55qq2Sg-VuVznkRXusKidnTxmbVGoHIKYuH5RHB9HTkN/pub?gid=213972052&single=true&output=csv');

  let matchingNames = []; // 該当する名前を格納する配列

  // シフトを検索
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const name = row[0];
    const shifts = row.slice(1);
    if (shifts.includes(shift)) {
      matchingNames.push(name);
    }
  }

  if (matchingNames.length > 0) {
    const assistantMessage = document.createElement('div');
    assistantMessage.classList.add('assistant-message');

    let messageHTML = `<p>Assistant: 「${shift}」のシフトがある人を表示します。</p>`;

    for (let i = 0; i < matchingNames.length; i++) {
      messageHTML += `<p>${matchingNames[i]}</p>`;
    }

    messageHTML += `<button onclick="copyToClipboard('${messageHTML}')">クリップボードにコピー</button>`;
    assistantMessage.innerHTML = messageHTML;
    chatMessages.appendChild(assistantMessage);
  } else {
    const assistantMessage = document.createElement('div');
    assistantMessage.classList.add('assistant-message');
    assistantMessage.innerHTML = '<p>Assistant: 該当する名前のシフトは見つかりませんでした。</p>';
    chatMessages.appendChild(assistantMessage);
  }

  shiftInput.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;
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

// Enterキーが押された場合に検索を実行
document.getElementById('shift-input').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    searchShift();
  }
});
