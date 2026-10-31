(() => {
  'use strict';

  const cards = window.TAROT_CARDS;
  const byId = new Map(cards.map(card => [card.number, card]));
  const supportiveIds = new Set([21, 23, 25, 26, 29, 30]);
  const judgmentSteps = [
    ['先停一下', '問自己：現在能聽完不同意見、看完資料嗎？如果還很激動或疲累，可以先休息，晚點再判斷。'],
    ['再收集資料', '挑一項在意的議題，找原始出處、日期與完整脈絡，對照不同來源；分清事實、評論與猜測，未知的先留白。'],
    ['最後自己比較', '用相同標準比較各個選項，寫下理由、疑問，以及什麼新證據會讓你改變看法；不用急著表態或轉傳。']
  ];
  const encouragements = {
    1: '不用把所有擔心都藏在笑容後面。承認在意，是照顧自己的開始。',
    2: '別讓太多未知佔滿此刻。回到眼前能做的一件事，你可以一步步面對未來。',
    3: '你可以堅持自己的價值，也可以先聽懂別人在守護什麼。理解不等於同意。',
    4: '你的選擇屬於你。溫柔而清楚地說出界線，不會讓你的想法變得自私。',
    5: '你可以聽取意見，也值得信任自己整理過的理由。留一點時間，讓決定回到你手上。',
    6: '先讓爭論停下來，給自己一個呼吸的空間。等能安穩說話時，再決定要不要回應。',
    7: '發現錯誤並願意修正，本身就是負責任的行動。下一次，先停一拍確認來源。',
    8: '你渴望被理解，也可以讓親人保有自己的選擇。關係不必由同一張選票證明。',
    9: '期待美好未來很珍貴。把期待落在一個具體議題上，理想就更有方向。',
    10: '一句後悔的話不必定義你。修正它、好好道歉，也讓自己有重新表達的機會。',
    11: '認真看待選擇已經很不容易。不必一次弄懂所有事，先從最重要的議題開始。',
    12: '失望說明你曾有期待。允許自己調整看法，下一步仍可以從小處開始。',
    13: '現在不想樂觀也沒關係。找回一件你能掌握的小事，改變不必一次發生。',
    14: '你的煩悶值得被聽見。說出來之後，也留一點空間聽對方的心情。',
    15: '立場不同不等於背叛。你可以說出受傷，也給彼此一個談清楚的機會。',
    16: '過去的失落是真的，但這次不必完全重演。帶著經驗，重新看眼前的選擇。',
    17: '開始不需要很有力氣。十分鐘、一個議題，就足以讓你往前一點。',
    18: '等待很難，但你不必一直守著每個數字。把注意力暫時交還給生活。',
    19: '不必懂所有政治，才能談你熟悉的生活。你的經驗也值得被聽見。',
    20: '保留自己的選擇，是你的權利。不公開立場，也能認真參與。',
    21: '說不出原因的低落也值得被照顧。先休息；若持續難受，找信任的人陪你。',
    22: '關心公共事務不需要犧牲自己。休息一下，仍是認真參與的一部分。',
    23: '你可以暫時離開選情，讓身體和心休息。有力氣時，再回來也不遲。',
    24: '一個結果從來不由你一個人承擔。用當時掌握的資訊，溫柔看待那時的自己。',
    25: '擔心讓你想把每一步都顧好。做完能做的安排，也允許自己等一個平安訊息。',
    26: '被突發衝突嚇到並不丟臉。先去安全的地方，讓可信任的人陪你慢慢安定。',
    27: '審慎很珍貴，但你不必做出完美判斷。依照此刻的資訊選擇，未來仍能修正看法。',
    28: '猶豫不代表你沒有主見。寫下重視的標準，再用同一把尺看每個選項。',
    29: '突來的消息需要時間消化。你不必立刻整理好心情，可以找個人陪你。',
    30: '現在最重要的是先停下讓你受傷的爭論。讓可信任的人陪伴你，不必一個人撐。',
    31: '你的熱情很可貴，也不必由所有人同意來證明。把力氣留給願意對話的人。',
    32: '分享研究和理由已經足夠。每個人能自己選，關係也能留下更多尊重。',
    33: '重新想過不是搖擺。只要知道自己為何改變，別人的看法就不必替你決定。',
    34: '安靜思考有你的節奏。當你準備好時，找一個信任的人從生活聊起。',
    35: '那場對話可以先停在今天。把念頭寫下，讓自己有一段不必繼續辯論的夜晚。',
    36: '投票之外還有很多小路。從你在意的議題出發，試一件做得到的事。',
    37: '現在的麻木也許是在提醒你累了。先不用勉強熱情，看看還有哪件小事牽動你。',
    38: '不甘心值得被承認。照顧好眼前的自己，再把力氣放回你能影響的事情。'
  };
  function shuffledDeck() {
    const ids = cards.map(card => card.number);
    for (let index = ids.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [ids[index], ids[other]] = [ids[other], ids[index]];
    }
    return ids;
  }
  const app = document.getElementById('app');
  const zoomDialog = document.getElementById('zoomDialog');
  const zoomImage = document.getElementById('zoomImage');
  const state = {
    stage: 0, deckOrder: shuffledDeck(), drawPage: 0, revealed: new Set(), selectedId: null,
    anxiety: '', actionChoice: null, customAction: ''
  };

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }
  function cardPath(card) { return `cards/${encodeURIComponent(card.file)}`; }
  function selectedCard() { return byId.get(state.selectedId) || byId.get(5); }
  function currentTrio() {
    const ids = state.deckOrder;
    const start = (state.drawPage * 3) % ids.length;
    return Array.from({ length: 3 }, (_, index) => byId.get(ids[(start + index) % ids.length]));
  }
  function fullAdvice(card) { return `${card.advice1}${card.advice2}`; }
  function nextStep(card) { return card.nextStep; }
  function judgmentGuide() {
    return `<section class="judgment-guide" aria-labelledby="judgmentTitle"><h2 id="judgmentTitle">準備好時，再慢慢判斷</h2><ol>${judgmentSteps.map(([title, text], index) => `<li><strong>${esc(title)}</strong><p>${esc(text)}</p>${index === 1 ? candidateGuide() : ''}</li>`).join('')}</ol><p class="helper">這是給自己的提醒，不是冷靜程度或判斷能力的測驗。現在先休息也可以。</p></section>`;
  }
  function candidateGuide() {
    return `<div class="candidate-guide">
      <h3>看見形象，也回看候選人的紀錄</h3>
      <p class="candidate-intro">選舉形象可以被塑造；理解一個人的本質，需要回看長期的言行、實際選擇與做事方式。</p>
      <dl>
        <dt>回顧理念：他重視什麼？</dt><dd>找候選人過去與現在的完整說法，看看核心價值是否一致；若立場改變，是否清楚交代理由？</dd>
        <dt>檢視政見：準備怎麼做？</dt><dd>閱讀選舉公報、政見全文與完整政見發表或辯論。除了口號，也看做法、預算、時程、職權與取捨，想想承諾是否可行。</dd>
        <dt>回看經歷：以前怎麼做？</dt><dd>查證學經歷、過往工作與公共服務紀錄；曾任公職者，可再看施政、提案、表決與承諾落實情形。遇到爭議，也一起看原始資料、當事人回應與後續處理。</dd>
        <dt>參考網路討論：哪些值得查證？</dt><dd>聽聽不同立場的提問，但不把聲量、按讚數或剪輯片段當成結論。追查出處、日期與完整脈絡，區分事實、評論與傳聞，再對照可信的獨立來源。</dd>
      </dl>
    </div>`;
  }
  function innerVoice(card) { return `${card.note1}${card.note2}`; }
  function resolvedAction() {
    const card = selectedCard();
    if (state.actionChoice === 'card') return nextStep(card);
    if (state.actionChoice === 'pause') return supportiveIds.has(card.number) ? '先到安全、能休息的地方，必要時找信任的人陪伴。' : '先停一會兒，稍後再決定要不要回應。';
    if (state.actionChoice === 'custom' && state.customAction.trim()) return state.customAction.trim();
    return '今天先記住這個感受。';
  }
  function corners() { return '<span class="corner tl" aria-hidden="true">❧</span><span class="corner tr" aria-hidden="true">❧</span><span class="corner bl" aria-hidden="true">❧</span><span class="corner br" aria-hidden="true">❧</span>'; }
  function progress() {
    const steps = ['翻牌', '寫下不安', '選一個行動', '帶走'];
    const current = Math.min(state.stage, 4);
    return `<nav class="progress" aria-label="探索進度">${steps.map((label, index) => {
      const number = index + 1;
      return `${index ? '<span class="progress-line" aria-hidden="true"></span>' : ''}<span class="progress-step ${number === current ? 'active' : number < current ? 'done' : ''}" ${number === current ? 'aria-current="step"' : ''}><b>${number < current ? '✓' : number}</b>${label}</span>`;
    }).join('')}</nav>`;
  }
  function panel(content) { return `<section class="paper-panel">${corners()}<div class="panel-inner">${content}</div></section>`; }
  function flow(content) { return `<div class="screen flow">${progress()}${panel(content)}</div>`; }
  function heading(eyebrow, title, description) {
    return `<div class="stage-heading"><p class="eyebrow">${eyebrow}</p><h1 tabindex="-1" id="stageTitle">${title}</h1>${description ? `<p>${description}</p>` : ''}</div>`;
  }
  function intro() {
    return `<section class="screen intro">
      <div class="intro-copy">
        <div class="seal-line">A MOMENT BEFORE THE VOTE</div>
        <h1 tabindex="-1" id="stageTitle">選舉聲音很多，<br><em>你的心怎麼說？</em></h1>
        <p class="lead">聽過那麼多聲音，你最在意什麼？</p>
        <div class="button-row"><button class="primary-button" type="button" data-action="start">${state.revealed.size ? '繼續這次探索' : '開始翻牌'} <span aria-hidden="true">✦</span></button></div>
      </div>
      <div class="intro-visual" aria-hidden="true"><div class="hero-card-back"></div><img width="958" height="1642" fetchpriority="high" class="hero-card" src="cards/05-cerato.webp" alt=""><div class="sticky top">我這樣選，<br>真的對嗎？</div><div class="sticky bottom">先停一拍，<br>再聽自己的聲音。</div></div>
    </section>`;
  }
  function drawScreen() {
    const trio = currentTrio();
    const allRevealed = trio.every(card => state.revealed.has(card.number));
    return flow(`${heading('CHAPTER 01 · THREE CARDS', '此刻最像你的，是哪一張？', '輕觸任一張牌，三張一起翻開。它們只是可能的鏡子，最後由你自己選。')}
      <div class="draw-grid">${trio.map((card, index) => {
        const revealed = state.revealed.has(card.number);
        return `<div class="draw-slot"><button type="button" class="tarot-button" data-action="${revealed ? 'zoom' : 'reveal'}" data-id="${card.number}" aria-label="${revealed ? `放大${esc(card.zh)}牌卡` : `點第 ${index + 1} 張牌，一起翻開三張牌`}">${revealed ? `<img width="958" height="1642" decoding="async" src="${cardPath(card)}" alt="${esc(card.zh)}選民情緒塔羅牌">` : `<span class="card-back"><span class="back-flower" aria-hidden="true">✦</span><span class="back-title">選民情緒塔羅</span></span>`}</button><p class="slot-number">CARD ${String(index + 1).padStart(2, '0')}</p>${revealed ? `<h2 class="slot-title">${esc(card.zh)}</h2><p class="slot-theme">${esc(card.theme)}</p>${allRevealed ? `<button type="button" class="choose-button ${state.selectedId === card.number ? 'chosen' : ''}" data-action="choose-card" data-id="${card.number}" aria-pressed="${state.selectedId === card.number}">${state.selectedId === card.number ? '✓ 已選這張' : '這張有感'}</button>` : ''}` : `<p class="slot-theme">輕觸，三張一起翻開</p>`}</div>`;
      }).join('')}</div>
      <p class="helper">牌卡不會替你定義情緒。沒有一張有感，可以換一組。翻開後再次點牌面可放大閱讀。</p>
      <div class="flow-actions between"><button class="ghost-button" type="button" data-action="back">← 返回首頁</button><div class="button-row"><button class="secondary-button" type="button" data-action="next-trio">換一組</button><button class="primary-button" type="button" data-action="to-reflection" ${!state.selectedId ? 'disabled' : ''}>下一步 <span aria-hidden="true">→</span></button></div></div>`);
  }
  function reflectionScreen() {
    const card = selectedCard();
    return flow(`${heading('CHAPTER 02 · TURN THE CARD', '這張牌，照到了什麼？', '')}
      <div class="reflection-layout"><div class="side-card"><img width="958" height="1642" decoding="async" src="${cardPath(card)}" alt="${esc(card.zh)}牌面"><button type="button" class="text-button" data-action="zoom" data-id="${card.number}">放大牌面 ↗</button></div>
      <div class="reflection-body"><h2>${esc(card.zh)} · ${esc(card.theme)}</h2><p class="quote">「${esc(innerVoice(card))}」</p>
        <label class="anxiety-field" for="anxietyInput">我對什麼不安？<textarea id="anxietyInput" maxlength="180" placeholder="想到「${esc(card.theme)}」，我擔心的是……">${esc(state.anxiety)}</textarea></label>
        <p class="helper">這些文字只留在本次瀏覽器操作中，除非你主動下載回顧卡。</p>
      </div></div>
      <div class="flow-actions between"><button class="ghost-button" type="button" data-action="back">← 返回選牌</button><button class="primary-button" type="button" data-action="to-action">下一步 <span aria-hidden="true">→</span></button></div>`);
  }
  function actionScreen() {
    const card = selectedCard();
    const pause = supportiveIds.has(card.number) ? '先照顧安全與休息，需要時找信任的人陪伴。' : '先停一會兒，稍後再決定要不要回應。';
    return flow(`${heading('CHAPTER 03 · ONE SMALL STEP', '接下來，你願意做哪件小事？', '不需要證明自己已經改變。選一件當下做得到的事，就夠了。')}
      <div class="action-layout"><div class="side-card"><img width="958" height="1642" decoding="async" src="${cardPath(card)}" alt="${esc(card.zh)}牌面"></div><div class="action-body"><h2>給 ${esc(card.zh)} 的下一步</h2><p class="quote">「${esc(innerVoice(card))}」</p>
        <p class="helper">下面是給這個情緒的具體練習。選一項適合你的，也可以先休息。</p>
        <div class="action-choices"><button type="button" class="action-choice ${state.actionChoice === 'card' ? 'selected' : ''}" data-action="choose-action" data-value="card" aria-pressed="${state.actionChoice === 'card'}"><span>✦</span><span><strong>試試適合這個情緒的建議</strong><small>${esc(nextStep(card))}</small></span></button><button type="button" class="action-choice ${state.actionChoice === 'pause' ? 'selected' : ''}" data-action="choose-action" data-value="pause" aria-pressed="${state.actionChoice === 'pause'}"><span>◌</span><span><strong>今天先停一拍</strong><small>${pause}</small></span></button><button type="button" class="action-choice ${state.actionChoice === 'custom' ? 'selected' : ''}" data-action="choose-action" data-value="custom" aria-pressed="${state.actionChoice === 'custom'}"><span>✎</span><span><strong>自己寫一件小事</strong><small>只給自己看，不用說給任何人聽。</small></span></button></div>
        <div class="custom-wrap" ${state.actionChoice !== 'custom' ? 'hidden' : ''}><label for="customAction">我願意……</label><textarea id="customAction" class="custom-action" maxlength="180" placeholder="例如：轉傳前，先看來源和日期。">${esc(state.customAction)}</textarea></div>
      </div></div>
      <div class="flow-actions between"><button class="ghost-button" type="button" data-action="back">← 返回翻面</button><div class="button-row"><button class="ghost-button" type="button" data-action="skip-action">今天先記住感受</button><button class="primary-button" type="button" data-action="to-result">完成這次探索 <span aria-hidden="true">→</span></button></div></div>`);
  }
  function resultLine(label, value) { return value.trim() ? `<div class="result-line"><b>${label}</b>${esc(value.trim())}</div>` : ''; }
  function resultScreen() {
    const card = selectedCard();
    const reflection = state.anxiety.trim();
    return flow(`<div class="result-heading"><p class="eyebrow">YOUR MOMENT CARD</p><h1 tabindex="-1" id="stageTitle">謝謝你，為自己的反應停了一拍。</h1><p>不用評分，也不必逼自己立刻平靜。這是一張只屬於此刻的回顧卡。</p></div>
      <div class="result-card" id="resultCard"><img width="958" height="1642" decoding="async" src="${cardPath(card)}" alt="${esc(card.zh)}牌面"><div class="result-copy"><p class="eyebrow">選民情緒塔羅 · CARD ${String(card.number).padStart(2, '0')}</p><h2>${esc(card.zh)}</h2><blockquote>${esc(encouragements[card.number])}</blockquote>${resultLine('我對什麼不安', reflection)}${resultLine('給這個情緒的建議', nextStep(card))}${resultLine('我選的小行動', state.actionChoice === 'card' ? '試試上面給這個情緒的建議。' : resolvedAction())}<p class="tagline">選對的人，做對的事 ✦</p></div></div>
      ${judgmentGuide()}
      <div class="flow-actions result-actions"><button type="button" class="ghost-button" data-action="back">← 返回選行動</button><button type="button" class="primary-button" data-action="download">下載回顧卡 PNG <span aria-hidden="true">↓</span></button><button type="button" class="secondary-button" data-action="restart">再走一次 ↺</button></div><p id="downloadStatus" class="helper" role="status">回顧卡只在你的裝置上產生，不會上傳反思文字。</p>`);
  }
  function render(options = {}) {
    const y = window.scrollY;
    const drawX = app.querySelector('.draw-grid')?.scrollLeft || 0;
    const screens = [intro, drawScreen, reflectionScreen, actionScreen, resultScreen];
    app.innerHTML = screens[state.stage]();
    if (options.keepScroll) {
      const drawGrid = app.querySelector('.draw-grid');
      if (drawGrid) drawGrid.scrollLeft = drawX;
      window.scrollTo(0, y);
    }
    else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      app.querySelector('#stageTitle')?.focus({ preventScroll: true });
    }
  }
  function go(stage) { state.stage = stage; render(); }
  function showZoom(id) {
    const card = byId.get(Number(id));
    if (!card) return;
    zoomImage.src = cardPath(card);
    zoomImage.alt = `${card.zh}：${card.theme}。${innerVoice(card)} 建議：${fullAdvice(card)}`;
    zoomDialog.showModal();
  }
  function reset() {
    state.stage = 0; state.deckOrder = shuffledDeck(); state.drawPage = 0; state.revealed = new Set(); state.selectedId = null;
    state.anxiety = ''; state.actionChoice = null; state.customAction = '';
    render();
  }
  function wrapLines(ctx, text, maxWidth) {
    const chars = [...String(text)];
    let line = '', lines = [];
    for (const char of chars) {
      if (char === '\n') { lines.push(line); line = ''; continue; }
      const next = line + char;
      if (ctx.measureText(next).width > maxWidth && line) { lines.push(line); line = char; } else line = next;
    }
    if (line) lines.push(line);
    return lines;
  }
  async function downloadResult() {
    const card = selectedCard();
    const reflection = state.anxiety.trim();
    const chosenAction = state.actionChoice;
    const actionText = resolvedAction();
    const status = document.getElementById('downloadStatus');
    status.textContent = '正在製作你的回顧卡……';
    try {
      const image = new Image();
      image.src = cardPath(card);
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = 1400;
      const ctx = canvas.getContext('2d');
      await document.fonts?.ready;
      const blocks = [
        { text: encouragements[card.number], font: '31px "Microsoft JhengHei", serif', color: '#b04742', height: 48 },
        ...(reflection ? [{ label: '我對什麼不安', text: reflection }] : []),
        { label: '給這個情緒的建議', text: nextStep(card) },
        ...(chosenAction !== 'card' ? [{ label: '我選的小行動', text: actionText }] : [{ label: '我選的小行動', text: '試試上面給這個情緒的建議。' }]),
        ...judgmentSteps.map(([label, text]) => ({ label, text }))
      ].map(block => {
        const font = block.font || '26px "Microsoft JhengHei", sans-serif';
        ctx.font = font;
        return { ...block, font, height: block.height || 39, lines: wrapLines(ctx, block.text, 775) };
      });
      canvas.height = Math.max(1020, 306 + blocks.reduce((total, block) => total + (block.label ? 42 : 0) + block.lines.length * block.height + 28, 0) + 100);
      ctx.fillStyle = '#c7e1ef'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#e4f1f7'; ctx.fillRect(18, 18, 1364, canvas.height - 36);
      ctx.strokeStyle = '#a3874c'; ctx.lineWidth = 5; ctx.strokeRect(24, 24, 1352, canvas.height - 48);
      ctx.lineWidth = 2; ctx.strokeRect(39, 39, 1322, canvas.height - 78);
      ctx.drawImage(image, 79, 84, 392, 672);
      ctx.fillStyle = '#7e6538'; ctx.font = 'bold 23px Georgia, serif'; ctx.fillText('VOTER EMOTION TAROT  ·  YOUR MOMENT CARD', 527, 139);
      ctx.fillStyle = '#17213b'; ctx.font = 'bold 55px "Microsoft JhengHei", serif'; ctx.fillText(card.zh, 525, 235);
      let y = 306;
      for (const block of blocks) {
        if (block.label) {
          ctx.fillStyle = '#7e6538'; ctx.font = 'bold 21px "Microsoft JhengHei", sans-serif'; ctx.fillText(block.label, 527, y); y += 42;
        }
        ctx.fillStyle = block.color || '#17213b'; ctx.font = block.font;
        for (const line of block.lines) { ctx.fillText(line, 525, y); y += block.height; }
        y += 28;
      }
      ctx.fillStyle = '#7e6538'; ctx.font = '22px "Microsoft JhengHei", serif'; ctx.fillText('選對的人，做對的事  ✦', 1014, canvas.height - 71);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('圖片無法匯出');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.download = `選民情緒塔羅-${String(card.number).padStart(2, '0')}-${card.en.toLowerCase().replaceAll(' ', '-')}.png`;
      document.body.append(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      status.textContent = '已送出下載，請查看瀏覽器的下載項目。';
    } catch (error) {
      status.textContent = '下載未完成，請稍後再試一次。';
      console.error(error);
    }
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'home') return go(0);
    if (action === 'restart') return reset();
    if (action === 'start') return go(1);
    if (action === 'close-zoom') return zoomDialog.close();
    if (action === 'reveal') { currentTrio().forEach(card => state.revealed.add(card.number)); return render({ keepScroll: true }); }
    if (action === 'zoom') return showZoom(button.dataset.id);
    if (action === 'choose-card') {
      const id = Number(button.dataset.id);
      if (state.selectedId !== id) { state.anxiety = ''; state.actionChoice = null; state.customAction = ''; }
      state.selectedId = id; return render({ keepScroll: true });
    }
    if (action === 'next-trio') { state.drawPage++; state.revealed.clear(); state.selectedId = null; state.anxiety = ''; state.actionChoice = null; state.customAction = ''; return render({ keepScroll: true }); }
    if (action === 'to-reflection') return state.selectedId && go(2);
    if (action === 'to-action') return go(3);
    if (action === 'choose-action') { state.actionChoice = button.dataset.value; render({ keepScroll: true }); if (state.actionChoice === 'custom') document.getElementById('customAction')?.focus(); return; }
    if (action === 'skip-action') { state.actionChoice = null; return go(4); }
    if (action === 'to-result') return go(4);
    if (action === 'download') return downloadResult();
    if (action === 'back') return go(Math.max(0, state.stage - 1));
  });
  document.addEventListener('input', event => {
    if (event.target.id === 'anxietyInput') state.anxiety = event.target.value;
    if (event.target.id === 'customAction') state.customAction = event.target.value;
  });
  zoomDialog.addEventListener('click', event => { if (event.target === zoomDialog) zoomDialog.close(); });
  function registerWebTools() {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const register = tool => {
      try { Promise.resolve(context.registerTool(tool)).catch(error => console.warn('WebMCP registration failed', error)); }
      catch (error) { console.warn('WebMCP registration failed', error); }
    };
    register({
      name: 'start_card_reading', title: '開始選民情緒翻牌',
      description: '開始一輪新的選民情緒塔羅翻牌，顯示三張未翻開的牌。',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (input && (typeof input !== 'object' || Object.keys(input).length)) throw new Error('此工具不接受參數。');
        reset(); go(1);
        return { stage: 'draw', cardCount: 3 };
      }
    });
    register({
      name: 'reveal_drawn_cards', title: '翻開三張牌',
      description: '翻開目前的三張牌，回傳牌名、情緒與編號供選擇。需先開始翻牌。',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (input && (typeof input !== 'object' || Object.keys(input).length)) throw new Error('此工具不接受參數。');
        if (state.stage !== 1) throw new Error('請先開始翻牌。');
        const trio = currentTrio();
        trio.forEach(card => state.revealed.add(card.number)); render({ keepScroll: true });
        return { cards: trio.map(card => ({ number: card.number, name: card.zh, emotion: card.theme })) };
      }
    });
    register({
      name: 'complete_card_reading', title: '完成選民情緒回顧卡',
      description: '從已翻開的三張牌中選一張，寫下不安並選擇小行動，顯示回顧卡。',
      inputSchema: { type: 'object', properties: {
        cardNumber: { type: 'integer', minimum: 1, maximum: 38 },
        anxiety: { type: 'string', maxLength: 180 },
        action: { type: 'string', enum: ['card', 'pause', 'custom', 'none'] },
        customAction: { type: 'string', maxLength: 180 }
      }, required: ['cardNumber', 'action'], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (state.stage !== 1 || !currentTrio().every(card => state.revealed.has(card.number))) throw new Error('請先翻開三張牌。');
        if (!input || !Number.isInteger(input.cardNumber) || !currentTrio().some(card => card.number === input.cardNumber)) throw new Error('請選擇目前三張牌中的一張。');
        if (input.anxiety !== undefined && (typeof input.anxiety !== 'string' || input.anxiety.length > 180)) throw new Error('不安文字需在 180 字以內。');
        if (!['card', 'pause', 'custom', 'none'].includes(input.action)) throw new Error('小行動選項無效。');
        if (input.action === 'custom' && (typeof input.customAction !== 'string' || !input.customAction.trim() || input.customAction.length > 180)) throw new Error('請提供 180 字以內的小行動。');
        state.selectedId = input.cardNumber;
        state.anxiety = input.anxiety || '';
        state.actionChoice = input.action === 'none' ? null : input.action;
        state.customAction = input.action === 'custom' ? input.customAction : '';
        go(4);
        const card = selectedCard();
        return { stage: 'result', cardNumber: card.number, name: card.zh, encouragement: encouragements[card.number], advice: nextStep(card), nextAction: resolvedAction(), judgmentSteps };
      }
    });
  }
  render();
  registerWebTools();
})();
