// 半角カタカナ <-> 全角カタカナ 変換マップ
const kanaMap = {
  'ｶﾞ': 'ガ', 'ｷﾞ': 'ギ', 'ｸﾞ': 'グ', 'ｹﾞ': 'ゲ', 'ｺﾞ': 'ゴ',
  'ｻﾞ': 'ザ', 'ｼﾞ': 'ジ', 'ｽﾞ': 'ズ', 'ｾﾞ': 'ゼ', 'ｿﾞ': 'ゾ',
  'ﾀﾞ': 'ダ', 'ﾁﾞ': 'ヂ', 'ﾂﾞ': 'ヅ', 'ﾃﾞ': 'デ', 'ﾄﾞ': 'ド',
  'ﾊﾞ': 'バ', 'ﾋﾞ': 'ビ', 'ﾌﾞ': 'ブ', 'ﾍﾞ': 'ベ', 'ﾎﾞ': 'ボ',
  'ﾊﾟ': 'パ', 'ﾋﾟ': 'ピ', 'ﾌﾟ': 'プ', 'ﾍﾟ': 'ペ', 'ﾎﾟ': 'ポ',
  'ｳﾞ': 'ヴ', 'ﾜﾞ': 'ヷ', 'ｦﾞ': 'ヺ',
  'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
  'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
  'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
  'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
  'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
  'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
  'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
  'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
  'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
  'ﾜ': 'ワ', 'ｦ': 'ヲ', 'ﾝ': 'ン',
  'ｧ': 'ァ', 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ',
  'ｯ': 'ッ', 'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ',
  'ｱｰ': 'アー', 'ｰ': 'ー', '･': '・', '｢': '「', '｣': '」'
};

// 逆マップ（全角 -> 半角）の自動作成
const reverseKanaMap = {};
Object.keys(kanaMap).forEach(key => {
  reverseKanaMap[kanaMap[key]] = key;
});

const halfKanaRegExp = new RegExp(Object.keys(kanaMap).join('|'), 'g');
const fullKanaRegExp = new RegExp(Object.keys(reverseKanaMap).join('|'), 'g');

// テキスト整形メイン関数
function cleanText(text) {
  // 特殊空白を通常の半角スペースに統一
  text = text.replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, ' ');

  // 各種ダッシュ・ハイフン記号を「-」に統一
  if (document.getElementById('optAddressDash').checked) {
    text = text.replace(/[ー―—‐−‒–—―〜～]/g, '-');
  }

  // 英数字を半角に統一
  if (document.getElementById('optAlphaNum').checked) {
    text = text.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
  }

  // カタカナ変換（切り替え）
  const kanaMode = document.querySelector('input[name="optKanaMode"]:checked').value;
  if (kanaMode === 'toFull') {
    text = text.replace(halfKanaRegExp, (m) => kanaMap[m]);
  } else if (kanaMode === 'toHalf') {
    text = text.replace(fullKanaRegExp, (m) => reverseKanaMap[m]);
  }

  // 文字間のスペース除去（改行を含まない半角・全角スペースのみ除去する修正版）
  //if (document.getElementById('optRemoveCharSpace').checked) {
  //  text = text.replace(/([^\s\r\n])[ \t\u3000]+([^\s\r\n])/g, '$1$2');
  //}

  // 文字間の無駄なスペース除去（半角・全角問わず、改行以外のスペースをすべて削除）
  if (document.getElementById('optRemoveCharSpace').checked) {
    text = text.replace(/[ \t\u3000]+/g, '');
  }

  // 郵便番号ハイフン自動挿入
  if (document.getElementById('optZip').checked) {
    text = text.replace(/(^|[^\d])(\d{3})(\d{4})([^\d]|$)/g, '$1$2-$3$4');
  }

  // 電話番号ハイフン除去
  if (document.getElementById('optPhoneHyphen').checked) {
    text = text.replace(/([\d]+)-+([\d]+)/g, '$1$2');
    text = text.replace(/([\d]+)-+([\d]+)/g, '$1$2');
  }

  // 連続スペースの縮小
  if (document.getElementById('optSpace').checked) {
    text = text.replace(/ +/g, ' ');
  }

  // 各行の前後空白除去 (安全な修正版)
  if (document.getElementById('optTrim').checked) {
    // 改行コード（\nまたは\r\n）より前の空白だけを消す
    text = text.replace(/^[ \t\u3000]+/gm, ''); // 行頭
    text = text.replace(/[ \t\u3000]+$/gm, ''); // 行末
  }

  // 改行を全削除して1行に連結
  if (document.getElementById('optRemoveLineBreaks').checked) {
    text = text.replace(/\r?\n/g, '');
  }

  return text;
}

// ボタンイベント：「整形する」
document.getElementById('cleanBtn').addEventListener('click', () => {
  const input = document.getElementById('inputText').value;
  document.getElementById('outputText').value = cleanText(input);
});

// ボタンイベント：「コピー」
document.getElementById('copyBtn').addEventListener('click', () => {
  const output = document.getElementById('outputText');
  if (!output.value) return;

  output.select();
  navigator.clipboard.writeText(output.value);

  const originalBtnText = document.getElementById('copyBtn').innerText;
  document.getElementById('copyBtn').innerText = 'コピーしました！';
  setTimeout(() => {
    document.getElementById('copyBtn').innerText = originalBtnText;
  }, 1500);
});

// ボタンイベント：「クリア」
document.getElementById('clearBtn').addEventListener('click', () => {
  document.getElementById('inputText').value = '';
  document.getElementById('outputText').value = '';
  document.getElementById('csvFileInput').value = '';
  document.getElementById('downloadCsvBtn').disabled = true;
});

// --- CSV取り込み & ダウンロード機能（文字化け対策版） ---
let processedCsvData = '';
let originalFileName = 'cleaned_data.csv';

document.getElementById('csvFileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  originalFileName = file.name.replace(/\.[^/.]+$/, "") + '_cleaned.csv';

  // まずArrayBufferとしてバイナリ読み込み
  const reader = new FileReader();

  reader.onload = (event) => {
    const arrayBuffer = event.target.result;

    // UTF-8かShift_JISかを判定してテキスト化
    let text = '';
    const utf8Decoder = new TextDecoder('utf-8', { fatal: true });

    try {
      // まずUTF-8で試す
      text = utf8Decoder.decode(arrayBuffer);
    } catch (err) {
      // UTF-8でエラー（文字化け検知）が出た場合はShift_JIS(ANSI)で読み込む
      const sjisDecoder = new TextDecoder('shift-jis');
      text = sjisDecoder.decode(arrayBuffer);
    }

    document.getElementById('inputText').value = text;

    // 全体整形実行
    processedCsvData = cleanText(text);
    document.getElementById('outputText').value = processedCsvData;

    // ダウンロードボタン有効化
    document.getElementById('downloadCsvBtn').disabled = false;
  };

  reader.readAsArrayBuffer(file);
});

// CSVダウンロード実行（Excelで開いても文字化けしないUTF-8 BOM付き）
document.getElementById('downloadCsvBtn').addEventListener('click', () => {
  if (!processedCsvData) return;

  // BOMを追加してExcel文字化けを防ぐ（UTF-8 with BOM）
  const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
  const blob = new Blob([bom, processedCsvData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = originalFileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});