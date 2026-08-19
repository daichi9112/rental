const PRODUCTS = {
  deck: { name: "スチールデッキ セットプラン", code: "ST-001", price: 0, priceLabel: "要相談" },
  speaker: { name: "パワードスピーカー 12inch", code: "AU-012", price: 8800 },
  mixer: { name: "デジタルミキサー 16ch", code: "AU-021", price: 12000 },
  microphone: { name: "ワイヤレスマイクセット", code: "AU-031", price: 6600 },
  parlight: { name: "LED PARライト", code: "LI-014", price: 3300 },
  projector: { name: "レーザープロジェクター", code: "VI-008", price: 16500 },
  "deck-legs": { name: "デッキ足", code: "ST-002", price: 0, priceLabel: "要見積もり" },
  "aluminum-truss": { name: "アルミトラス 300角", code: "SS-001", price: 2500 },
  "circle-truss": { name: "サークルトラス 300角", code: "SS-002", price: 50000 },
  "white-curtain-5": { name: "白幕 W5間×H28尺", code: "CU-001", price: 0, priceLabel: "要見積もり" },
  "white-curtain-10": { name: "白幕 W10間×H26尺", code: "CU-002", price: 0, priceLabel: "要見積もり" },
  "circle-screen": { name: "サークルトラス用スクリーン", code: "CU-003", price: 30000 },
  scrim: { name: "紗幕", code: "CU-004", price: 0, priceLabel: "要見積もり" },
  "scrim-valance": { name: "紗幕ふんどし", code: "CU-005", price: 0, priceLabel: "要見積もり" },
  "black-gauze": { name: "寒冷紗 黒", code: "CU-006", price: 0, priceLabel: "要見積もり" },
  "sky-drop": { name: "青空ドロップ", code: "CU-007", price: 0, priceLabel: "要見積もり" },
  "bamboo-system": { name: "降り竹システム", code: "SS-003", price: 0, priceLabel: "要見積もり" },
  "linoleum-gray-3": { name: "リノリウム グレー 3尺", code: "SS-004", price: 0, priceLabel: "要見積もり" },
  "linoleum-black-3": { name: "リノリウム 黒 3尺", code: "SS-005", price: 0, priceLabel: "要見積もり" },
  "linoleum-gray-1ken": { name: "リノリウム1間グレー", code: "SS-006", price: 0, priceLabel: "要見積もり" }
};

const STORAGE_KEY = "stagebase-selection";
const getSelection = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
const saveSelection = (selection) => { localStorage.setItem(STORAGE_KEY, JSON.stringify(selection)); updateSelectionUI(); };
const yen = (value) => `¥${value.toLocaleString("ja-JP")}`;

function updateSelectionUI() {
  const selection = getSelection();
  const count = Object.values(selection).reduce((sum, qty) => sum + qty, 0);
  document.querySelectorAll(".selection-count").forEach((el) => { el.textContent = count; });
  document.querySelectorAll(".selection-bar").forEach((el) => el.classList.toggle("visible", count > 0));
  document.querySelectorAll(".add-button").forEach((button) => {
    const selected = selection[button.dataset.product] > 0;
    button.classList.toggle("selected", selected);
    button.innerHTML = selected ? `追加済 <span>✓</span>` : `追加 <span>＋</span>`;
  });
}

function renderSelectedItems() {
  const wrap = document.getElementById("selected-items");
  if (!wrap) return;
  const selection = getSelection();
  const ids = Object.keys(selection).filter((id) => PRODUCTS[id]);
  wrap.innerHTML = "";
  if (!ids.length) {
    const empty = document.createElement("div"); empty.className = "empty-selection";
    empty.innerHTML = `<strong>機材はまだ選択されていません</strong><p>機材一覧から追加するか、そのままご相談内容をご入力ください。</p><a href="index.html#equipment">機材一覧を見る</a>`;
    wrap.appendChild(empty);
  }
  ids.forEach((id) => {
    const item = PRODUCTS[id];
    const row = document.createElement("div"); row.className = "selected-item";
    const deckConfig = id === "deck" ? localStorage.getItem("stagebase-deck-config") : "";
    row.innerHTML = `<div><small>${item.code}</small><strong>${item.name}</strong><span>${item.priceLabel || `${yen(item.price)} / 基本期間`}${deckConfig ? `<br>${deckConfig}` : ""}</span></div><div class="qty-control"><button type="button" data-action="minus" data-id="${id}" aria-label="${item.name}を1つ減らす">−</button><b>${selection[id]}</b><button type="button" data-action="plus" data-id="${id}" aria-label="${item.name}を1つ増やす">＋</button></div><button class="remove-item" type="button" data-action="remove" data-id="${id}" aria-label="${item.name}を削除">×</button>`;
    wrap.appendChild(row);
  });
  const total = ids.reduce((sum, id) => sum + PRODUCTS[id].price * selection[id], 0);
  const includesQuote = ids.some((id) => PRODUCTS[id].priceLabel);
  const totalEl = document.getElementById("estimate-total"); if (totalEl) totalEl.textContent = includesQuote ? "要見積もり" : yen(total);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".current-year").forEach((el) => { el.textContent = new Date().getFullYear(); });
  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector(".global-nav");
  menuButton?.addEventListener("click", () => { const open = menuButton.getAttribute("aria-expanded") === "true"; menuButton.setAttribute("aria-expanded", String(!open)); nav?.classList.toggle("open", !open); });

  document.querySelectorAll(".add-button").forEach((button) => button.addEventListener("click", () => {
    const selection = getSelection(); const id = button.dataset.product;
    if (button.classList.contains("deck-config-add")) {
      const size = document.getElementById("deck-size")?.value;
      const height = document.getElementById("deck-leg-height")?.value;
      const sets = document.getElementById("deck-set-quantity")?.value || "1";
      localStorage.setItem("stagebase-deck-config", `${size} / 脚 ${height} / ${sets}セット`);
      selection[id] = Math.max(1, Number(sets));
      saveSelection(selection);
      return;
    }
    selection[id] = (selection[id] || 0) + 1; saveSelection(selection);
    button.animate([{ transform: "scale(1)" }, { transform: "scale(.94)" }, { transform: "scale(1)" }], { duration: 220 });
  }));

  document.querySelectorAll(".filter").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active")); button.classList.add("active");
    const filter = button.dataset.filter;
    document.querySelectorAll(".equipment-section .product-card").forEach((card) => { card.hidden = filter !== "all" && card.dataset.category !== filter; });
  }));

  document.getElementById("selected-items")?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]"); if (!button) return;
    const selection = getSelection(); const id = button.dataset.id;
    if (button.dataset.action === "plus") selection[id] += 1;
    if (button.dataset.action === "minus") selection[id] = Math.max(1, selection[id] - 1);
    if (button.dataset.action === "remove") delete selection[id];
    saveSelection(selection); renderSelectedItems();
  });

  document.getElementById("contact-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = document.getElementById("form-status");
    const submitButton = form.querySelector(".submit-button");
    if (!form.checkValidity()) {
      form.reportValidity();
      if (status) { status.className = "form-status error"; status.textContent = "必須項目をご確認ください。"; }
      return;
    }

    const selection = getSelection();
    const selectedIds = Object.keys(selection).filter((id) => PRODUCTS[id] && selection[id] > 0);
    const equipmentSummary = selectedIds.length
      ? selectedIds.map((id) => {
          const config = id === "deck" ? localStorage.getItem("stagebase-deck-config") : "";
          return `${PRODUCTS[id].code} ${PRODUCTS[id].name} × ${selection[id]}${config ? `（${config}）` : ""}`;
        }).join("\n")
      : "選択なし（相談から希望）";
    const estimatedTotal = selectedIds.reduce((sum, id) => sum + PRODUCTS[id].price * selection[id], 0);
    document.getElementById("selected-equipment-field").value = equipmentSummary;
    const includesQuote = selectedIds.some((id) => PRODUCTS[id].priceLabel);
    document.getElementById("estimated-total-field").value = includesQuote ? `要見積もり（定額品参考合計 ${yen(estimatedTotal)}）` : yen(estimatedTotal);

    if (status) { status.className = "form-status"; status.textContent = "送信しています…"; }
    if (submitButton) { submitButton.disabled = true; submitButton.classList.add("submitting"); submitButton.innerHTML = "送信しています…"; }

    try {
      const formData = new FormData(form);
      formData.append("送信ページ", window.location.href);
      const response = await fetch(form.action, { method: "POST", body: formData, headers: { Accept: "application/json" } });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        const message = Array.isArray(result.errors) ? result.errors.map((error) => error.message).join(" ") : "送信できませんでした。時間をおいて再度お試しください。";
        throw new Error(message);
      }
      form.reset();
      localStorage.removeItem(STORAGE_KEY);
      updateSelectionUI();
      renderSelectedItems();
      if (status) { status.className = "form-status success"; status.textContent = "お問い合わせを送信しました。内容を確認のうえ、担当者よりご連絡します。"; }
    } catch (error) {
      if (status) { status.className = "form-status error"; status.textContent = error.message || "送信中に問題が発生しました。"; }
    } finally {
      if (submitButton) { submitButton.disabled = false; submitButton.classList.remove("submitting"); submitButton.innerHTML = `入力内容を送信する <span>→</span>`; }
      status?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  const deliveryMethod = document.getElementById("delivery-method");
  const pickupGuide = document.getElementById("pickup-form-guide");
  const updatePickupGuide = () => { if (pickupGuide) pickupGuide.hidden = deliveryMethod?.value !== "勝島倉庫で引き取り"; };
  deliveryMethod?.addEventListener("change", updatePickupGuide);
  updatePickupGuide();

  const savedDates = JSON.parse(localStorage.getItem("stagebase-rental-dates") || "{}");
  const contactStart = document.querySelector('input[name="start-date"]');
  const contactEnd = document.querySelector('input[name="end-date"]');
  if (contactStart && savedDates.start) contactStart.value = savedDates.start;
  if (contactEnd && savedDates.end) contactEnd.value = savedDates.end;
  const saveDates = () => localStorage.setItem("stagebase-rental-dates", JSON.stringify({ start: contactStart?.value || "", end: contactEnd?.value || "" }));
  contactStart?.addEventListener("change", saveDates);
  contactEnd?.addEventListener("change", saveDates);

  const equipmentSection = document.querySelector(".equipment-section");
  const productGrid = equipmentSection?.querySelector(".product-grid");
  const filterRow = equipmentSection?.querySelector(".filter-row");
  if (equipmentSection && productGrid && filterRow) {
    const cards = [...productGrid.querySelectorAll(".product-card")];
    cards.forEach((card, index) => { card.dataset.originalOrder = String(index); });

    const availability = document.createElement("section");
    availability.className = "availability-check";
    availability.innerHTML = `<div><p class="eyebrow">AVAILABILITY</p><h3>希望日から空き状況を問い合わせる</h3><p>日程はお問い合わせ画面へ引き継がれ、担当者が在庫を確認します。</p></div><div class="availability-fields"><label>公演開始日<input id="availability-start" type="date"></label><span>〜</span><label>公演終了日<input id="availability-end" type="date"></label><button type="button" id="availability-submit">この日程で確認する <b>→</b></button></div><p id="availability-message" class="availability-message" role="status"></p>`;
    equipmentSection.insertBefore(availability, filterRow);

    const toolsBar = document.createElement("div");
    toolsBar.className = "catalog-tools";
    toolsBar.innerHTML = `<label><span>商品を検索</span><input id="catalog-search" type="search" placeholder="商品名・商品番号で検索"></label><label><span>並べ替え</span><select id="catalog-sort"><option value="recommended">おすすめ順</option><option value="code">商品番号順</option><option value="name">商品名順</option></select></label><p id="catalog-count" aria-live="polite"></p>`;
    filterRow.insertAdjacentElement("afterend", toolsBar);

    const applyCatalog = () => {
      const query = (document.getElementById("catalog-search")?.value || "").normalize("NFKC").toLocaleLowerCase("ja").trim();
      const category = filterRow.querySelector(".filter.active")?.dataset.filter || "all";
      const sort = document.getElementById("catalog-sort")?.value || "recommended";
      let visible = 0;
      cards.forEach((card) => {
        const match = (category === "all" || card.dataset.category === category) && (!query || card.textContent.normalize("NFKC").toLocaleLowerCase("ja").includes(query));
        card.hidden = !match;
        if (match) visible += 1;
      });
      const ordered = [...cards].sort((a, b) => {
        if (sort === "code") return (a.querySelector(".product-code")?.textContent || "").localeCompare(b.querySelector(".product-code")?.textContent || "", "ja", { numeric: true });
        if (sort === "name") return (a.querySelector("h3")?.textContent || "").localeCompare(b.querySelector("h3")?.textContent || "", "ja");
        return Number(a.dataset.originalOrder) - Number(b.dataset.originalOrder);
      });
      ordered.forEach((card) => productGrid.appendChild(card));
      document.getElementById("catalog-count").textContent = `${visible}件を表示`;
    };
    document.getElementById("catalog-search")?.addEventListener("input", applyCatalog);
    document.getElementById("catalog-sort")?.addEventListener("change", applyCatalog);
    filterRow.querySelectorAll(".filter").forEach((button) => button.addEventListener("click", applyCatalog));
    applyCatalog();

    const availabilityStart = document.getElementById("availability-start");
    const availabilityEnd = document.getElementById("availability-end");
    if (savedDates.start) availabilityStart.value = savedDates.start;
    if (savedDates.end) availabilityEnd.value = savedDates.end;
    document.getElementById("availability-submit")?.addEventListener("click", () => {
      const message = document.getElementById("availability-message");
      if (!availabilityStart.value || !availabilityEnd.value || availabilityEnd.value < availabilityStart.value) {
        message.textContent = "開始日と終了日を正しい順序で入力してください。";
        message.className = "availability-message error";
        return;
      }
      localStorage.setItem("stagebase-rental-dates", JSON.stringify({ start: availabilityStart.value, end: availabilityEnd.value }));
      window.location.href = "contact.html";
    });
  }

  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("shown"); }), { threshold: .12 });
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  updateSelectionUI(); renderSelectedItems();
});

