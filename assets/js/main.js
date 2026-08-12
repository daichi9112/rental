const PRODUCTS = {
  deck: { name: "スチールデッキ 3×6", code: "ST-001", price: 6800 },
  speaker: { name: "パワードスピーカー 12inch", code: "AU-012", price: 8800 },
  mixer: { name: "デジタルミキサー 16ch", code: "AU-021", price: 12000 },
  microphone: { name: "ワイヤレスマイクセット", code: "AU-031", price: 6600 },
  parlight: { name: "LED PARライト", code: "LI-014", price: 3300 },
  projector: { name: "レーザープロジェクター", code: "VI-008", price: 16500 }
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
    row.innerHTML = `<div><small>${item.code}</small><strong>${item.name}</strong><span>${yen(item.price)} / 基本期間</span></div><div class="qty-control"><button type="button" data-action="minus" data-id="${id}" aria-label="${item.name}を1つ減らす">−</button><b>${selection[id]}</b><button type="button" data-action="plus" data-id="${id}" aria-label="${item.name}を1つ増やす">＋</button></div><button class="remove-item" type="button" data-action="remove" data-id="${id}" aria-label="${item.name}を削除">×</button>`;
    wrap.appendChild(row);
  });
  const total = ids.reduce((sum, id) => sum + PRODUCTS[id].price * selection[id], 0);
  const totalEl = document.getElementById("estimate-total"); if (totalEl) totalEl.textContent = yen(total);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".current-year").forEach((el) => { el.textContent = new Date().getFullYear(); });
  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector(".global-nav");
  menuButton?.addEventListener("click", () => { const open = menuButton.getAttribute("aria-expanded") === "true"; menuButton.setAttribute("aria-expanded", String(!open)); nav?.classList.toggle("open", !open); });

  document.querySelectorAll(".add-button").forEach((button) => button.addEventListener("click", () => {
    const selection = getSelection(); const id = button.dataset.product;
    selection[id] = (selection[id] || 0) + 1; saveSelection(selection);
    button.animate([{ transform: "scale(1)" }, { transform: "scale(.94)" }, { transform: "scale(1)" }], { duration: 220 });
  }));

  document.querySelectorAll(".filter").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active")); button.classList.add("active");
    const filter = button.dataset.filter;
    document.querySelectorAll(".product-card").forEach((card) => { card.hidden = filter !== "all" && card.dataset.category !== filter; });
  }));

  document.getElementById("selected-items")?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]"); if (!button) return;
    const selection = getSelection(); const id = button.dataset.id;
    if (button.dataset.action === "plus") selection[id] += 1;
    if (button.dataset.action === "minus") selection[id] = Math.max(1, selection[id] - 1);
    if (button.dataset.action === "remove") delete selection[id];
    saveSelection(selection); renderSelectedItems();
  });

  document.getElementById("contact-form")?.addEventListener("submit", (event) => {
    event.preventDefault(); const form = event.currentTarget; const status = document.getElementById("form-status");
    if (!form.checkValidity()) { form.reportValidity(); if (status) status.textContent = "必須項目をご確認ください。"; return; }
    if (status) { status.className = "form-status success"; status.textContent = "仮送信が完了しました。正式公開時に指定のメールアドレスへ届くよう設定します。"; }
    status?.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("shown"); }), { threshold: .12 });
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  updateSelectionUI(); renderSelectedItems();
});
