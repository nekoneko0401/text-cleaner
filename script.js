// 半角カタカナ -> 全角カタカナの変換マップ
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

const kanaRegExp = new RegExp(Object.keys(kanaMap).join('|'), 'g');

document.getElementById('cleanBtn').addEventListener('click', () => {
  let text = document.getElementById('inputText').value;

  // 0. 特殊な空白文字（NBSP等）を通常の半角スペースに統一
  text = text.replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, ' ');

  // 1. 各種ダッシュ・ハイフン表記を半角の「-」に統一
  text = text.replace(/[ー―—‐−‒–—―〜～]/g, '-');

  // 2. 英数字を半角に統一
  if (document.getElementById('optAlphaNum').checked) {
    text = text.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
  }

  // 3. 半角カタカナを全角に変換
  if (document.getElementById('optKana').checked) {
    text = text.replace(kanaRegExp, (match) => kanaMap[match]);
  }

  // 4. 文字間に挟まったバラバラのスペースを除去
  if (document.getElementById('optRemoveCharSpace') && document.getElementById('optRemoveCharSpace').checked) {
    text = text.replace(/([^\s])\s+([^\s])/g, '$1$2');
    text = text.replace(/([^\s])\s+([^\s])/g, '$1$2');
  }

  // 5. 郵便番号のハイフン自動挿入（独立した7桁の数字を 000-0000 に整形）
  if (document.getElementById('optZip').checked) {
    text = text.replace(/(^|[^\d])(\d{3})(\d{4})([^\d]|$)/g, '$1$2-$3$4');
  }

  // 6. 電話番号のハイフン除去
  if (document.getElementById('optPhoneHyphen').checked) {
    text = text.replace(/([\d]+)-+([\d]+)/g, '$1$2');
    text = text.replace(/([\d]+)-+([\d]+)/g, '$1$2');
  }

  // 7. 残った通常のスペース整理
  if (document.getElementById('optSpace').checked) {
    text = text.replace(/ +/g, ' ');
  }

  // 8. 各行の前後スペース除去
  if (document.getElementById('optTrim').checked) {
    text = text.split('\n').map(line => line.trim()).join('\n');
  }

  document.getElementById('outputText').value = text;
});

// クリップボードにコピー
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