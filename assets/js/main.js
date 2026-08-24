const PRODUCTS = {
  deck: { name: "�X�`�[���f�b�L �Z�b�g�v����", code: "ST-001", price: 0, priceLabel: "�v���k" },
  "vintage-trunk": { name: "���B���e�[�W�g�����N", code: "PR-001", price: 0, priceLabel: "�v���ς���" },
  "patchwork-bench": { name: "�p�b�`���[�N�x���`", code: "PR-002", price: 0, priceLabel: "�v���ς���" },
  "orb-light": { name: "����LED���C�g ��380", code: "PR-003", price: 0, priceLabel: "�v���ς���" },
  "tote-bag": { name: "�u���E�� �g�[�g�o�b�O", code: "PR-004", price: 0, priceLabel: "�v���ς���" },
  "glasses-set": { name: "�ዾ�E�T���O���X�Z�b�g", code: "PR-005", price: 0, priceLabel: "�v���ς���" },
  "leather-attache": { name: "���U�[�A�^�b�V���P�[�X", code: "PR-006", price: 0, priceLabel: "�v���ς���" },
  "black-chair": { name: "�ؐ��֎q �u���b�N", code: "PR-007", price: 0, priceLabel: "�v���ς���" },
  "flat-cap": { name: "�w�����{�[�� �n���`���O", code: "PR-008", price: 0, priceLabel: "�v���ς���" },
  smartphones: { name: "�X�}�[�g�t�H�����b�N�Z�b�g", code: "PR-009", price: 0, priceLabel: "�v���ς���" },
  "prop-sword": { name: "����p�͑���", code: "PR-010", price: 0, priceLabel: "�v���ς���" },
  "deck-legs": { name: "�f�b�L��", code: "ST-002", price: 0, priceLabel: "�v���ς���" },
  "aluminum-truss": { name: "�A���~�g���X 300�p", code: "SS-001", price: 2500 },
  "circle-truss": { name: "�T�[�N���g���X 300�p", code: "SS-002", price: 50000 },
  "white-curtain-5": { name: "���� W5�ԁ~H28��", code: "CU-001", price: 0, priceLabel: "�v���ς���" },
  "white-curtain-10": { name: "���� W10�ԁ~H26��", code: "CU-002", price: 0, priceLabel: "�v���ς���" },
  "circle-screen": { name: "�T�[�N���g���X�p�X�N���[��", code: "CU-003", price: 30000 },
  scrim: { name: "�і�", code: "CU-004", price: 0, priceLabel: "�v���ς���" },
  "black-gauze": { name: "����� ��", code: "CU-006", price: 0, priceLabel: "�v���ς���" },
  "sky-drop": { name: "��h���b�v", code: "CU-007", price: 0, priceLabel: "�v���ς���" },
  "bamboo-system": { name: "�~��|�V�X�e��", code: "SS-003", price: 0, priceLabel: "�v���ς���" },
  "linoleum-gray-3": { name: "���m���E�� �O���[ 3��", code: "SS-004", price: 0, priceLabel: "�v���ς���" },
  "linoleum-black-3": { name: "���m���E�� �� 3��", code: "SS-005", price: 0, priceLabel: "�v���ς���" },
  "linoleum-gray-1ken": { name: "���m���E��1�ԃO���[", code: "SS-006", price: 0, priceLabel: "�v���ς���" },
  "antari-z1020": { name: "ANTARI Z1020 �t�H�O�}�V��", code: "SS-007", price: 0, priceLabel: "�v���ς���" }
};

const STORAGE_KEY = "stagebase-selection";
const getSelection = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
const saveSelection = (selection) => { localStorage.setItem(STORAGE_KEY, JSON.stringify(selection)); updateSelectionUI(); };
const yen = (value) => `\${value.toLocaleString("ja-JP")}`;

function updateSelectionUI() {
  const selection = getSelection();
  const count = Object.values(selection).reduce((sum, qty) => sum + qty, 0);
  document.querySelectorAll(".selection-count").forEach((el) => { el.textContent = count; });
  document.querySelectorAll(".selection-bar").forEach((el) => el.classList.toggle("visible", count > 0));
  document.querySelectorAll(".add-button").forEach((button) => {
    const selected = selection[button.dataset.product] > 0;
    button.classList.toggle("selected", selected);
    button.innerHTML = selected ? `�ǉ��� <span>?</span>` : `�ǉ� <span>�{</span>`;
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
    empty.innerHTML = `<strong>�@�ނ͂܂��I������Ă��܂���</strong><p>�@�ވꗗ����ǉ����邩�A���̂܂܂����k���e�������͂��������B</p><a href="index.html#equipment">�@�ވꗗ������</a>`;
    wrap.appendChild(empty);
  }
  ids.forEach((id) => {
    const item = PRODUCTS[id];
    const row = document.createElement("div"); row.className = "selected-item";
    const deckConfig = id === "deck" ? localStorage.getItem("stagebase-deck-config") : "";
    row.innerHTML = `<div><small>${item.code}</small><strong>${item.name}</strong><span>${item.priceLabel || `${yen(item.price)} / ��{����`}${deckConfig ? `<br>${deckConfig}` : ""}</span></div><div class="qty-control"><button type="button" data-action="minus" data-id="${id}" aria-label="${item.name}��1���炷">?</button><b>${selection[id]}</b><button type="button" data-action="plus" data-id="${id}" aria-label="${item.name}��1���₷">�{</button></div><button class="remove-item" type="button" data-action="remove" data-id="${id}" aria-label="${item.name}���폜">�~</button>`;
    wrap.appendChild(row);
  });
  const total = ids.reduce((sum, id) => sum + PRODUCTS[id].price * selection[id], 0);
  const includesQuote = ids.some((id) => PRODUCTS[id].priceLabel);
  const totalEl = document.getElementById("estimate-total"); if (totalEl) totalEl.textContent = includesQuote ? "�v���ς���" : yen(total);
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
      localStorage.setItem("stagebase-deck-config", `${size} / �r ${height} / ${sets}�Z�b�g`);
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
      if (status) { status.className = "form-status error"; status.textContent = "�K�{���ڂ����m�F���������B"; }
      return;
    }

    const selection = getSelection();
    const selectedIds = Object.keys(selection).filter((id) => PRODUCTS[id] && selection[id] > 0);
    const equipmentSummary = selectedIds.length
      ? selectedIds.map((id) => {
          const config = id === "deck" ? localStorage.getItem("stagebase-deck-config") : "";
          return `${PRODUCTS[id].code} ${PRODUCTS[id].name} �~ ${selection[id]}${config ? `�i${config}�j` : ""}`;
        }).join("\n")
      : "�I���Ȃ��i���k�����]�j";
    const estimatedTotal = selectedIds.reduce((sum, id) => sum + PRODUCTS[id].price * selection[id], 0);
    document.getElementById("selected-equipment-field").value = equipmentSummary;
    const includesQuote = selectedIds.some((id) => PRODUCTS[id].priceLabel);
    document.getElementById("estimated-total-field").value = includesQuote ? `�v���ς���i��z�i�Q�l���v ${yen(estimatedTotal)}�j` : yen(estimatedTotal);

    if (status) { status.className = "form-status"; status.textContent = "���M���Ă��܂��c"; }
    if (submitButton) { submitButton.disabled = true; submitButton.classList.add("submitting"); submitButton.innerHTML = "���M���Ă��܂��c"; }

    try {
      const formData = new FormData(form);
      formData.append("���M�y�[�W", window.location.href);
      const response = await fetch(form.action, { method: "POST", body: formData, headers: { Accept: "application/json" } });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        const message = Array.isArray(result.errors) ? result.errors.map((error) => error.message).join(" ") : "���M�ł��܂���ł����B���Ԃ������čēx���������������B";
        throw new Error(message);
      }
      form.reset();
      localStorage.removeItem(STORAGE_KEY);
      updateSelectionUI();
      renderSelectedItems();
      if (status) { status.className = "form-status success"; status.textContent = "���₢���킹�𑗐M���܂����B���e���m�F�̂����A�S���҂�育�A�����܂��B"; }
    } catch (error) {
      if (status) { status.className = "form-status error"; status.textContent = error.message || "���M���ɖ�肪�������܂����B"; }
    } finally {
      if (submitButton) { submitButton.disabled = false; submitButton.classList.remove("submitting"); submitButton.innerHTML = `���͓��e�𑗐M���� <span>��</span>`; }
      status?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  const deliveryMethod = document.getElementById("delivery-method");
  const pickupGuide = document.getElementById("pickup-form-guide");
  const updatePickupGuide = () => { if (pickupGuide) pickupGuide.hidden = deliveryMethod?.value !== "�����q�ɂň������"; };
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
    availability.setAttribute("aria-labelledby", "availability-title");
    availability.innerHTML = `<div><p class="eyebrow">AVAILABILITY</p><h3 id="availability-title">��]������󂫏󋵂�₢���킹��</h3><p>�����͂��₢���킹��ʂֈ����p����A�S���҂��݌ɂ��m�F���܂��B</p></div><div class="availability-fields"><label>�����J�n��<input id="availability-start" type="date"></label><span>?</span><label>�����I����<input id="availability-end" type="date"></label><button type="button" id="availability-submit">���̓����Ŋm�F���� <b>��</b></button></div><p id="availability-message" class="availability-message" role="status" aria-live="polite"></p>`;
    equipmentSection.insertBefore(availability, filterRow);

    const toolsBar = document.createElement("div");
    toolsBar.className = "catalog-tools";
    toolsBar.innerHTML = `<label class="catalog-search"><span>���i������</span><input id="catalog-search" type="search" placeholder="���i���E���i�ԍ��Ō���" autocomplete="off"></label><label class="catalog-sort"><span>���בւ�</span><select id="catalog-sort"><option value="recommended">�������ߏ�</option><option value="code">���i�ԍ���</option><option value="name">���i����</option><option value="price">���i��������</option></select></label><p id="catalog-count" aria-live="polite"></p>`;
    filterRow.insertAdjacentElement("afterend", toolsBar);
    const empty = document.createElement("p");
    empty.className = "catalog-empty";
    empty.hidden = true;
    empty.textContent = "�����Ɉ�v����@�ނ�����܂���B�������J�e�S���[��ύX���Ă��������B";
    productGrid.insertAdjacentElement("afterend", empty);

    const applyCatalog = () => {
      const query = (document.getElementById("catalog-search")?.value || "").normalize("NFKC").toLocaleLowerCase("ja").trim();
      const category = filterRow.querySelector(".filter.active")?.dataset.filter || "all";
      const sort = document.getElementById("catalog-sort")?.value || "recommended";
      const visible = [];
      cards.forEach((card) => {
        const match = (category === "all" || card.dataset.category === category) && (!query || card.textContent.normalize("NFKC").toLocaleLowerCase("ja").includes(query));
        card.hidden = !match;
        if (match) visible.push(card);
      });
      const ordered = [...cards].sort((a, b) => {
        if (sort === "code") return (a.querySelector(".product-code")?.textContent || "").localeCompare(b.querySelector(".product-code")?.textContent || "", "ja", { numeric: true });
        if (sort === "name") return (a.querySelector("h3")?.textContent || "").localeCompare(b.querySelector("h3")?.textContent || "", "ja");
        if (sort === "price") {
          const x = PRODUCTS[a.querySelector(".add-button")?.dataset.product] || {};
          const y = PRODUCTS[b.querySelector(".add-button")?.dataset.product] || {};
          if (Boolean(x.priceLabel) !== Boolean(y.priceLabel)) return x.priceLabel ? 1 : -1;
          return (x.price || 0) - (y.price || 0) || Number(a.dataset.originalOrder) - Number(b.dataset.originalOrder);
        }
        const categoryOrder = { stage: 0, "stage-supplies": 1, curtains: 2, props: 3 };
        return (categoryOrder[a.dataset.category] ?? 99) - (categoryOrder[b.dataset.category] ?? 99)
          || Number(a.dataset.originalOrder) - Number(b.dataset.originalOrder);
      });
      ordered.forEach((card) => productGrid.appendChild(card));
      document.getElementById("catalog-count").textContent = `${visible.length}����\��`;
      empty.hidden = visible.length !== 0;
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
      if (!availabilityStart.value || !availabilityEnd.value) {
        message.textContent = "�J�n���ƏI��������͂��Ă��������B";
        message.className = "availability-message error";
        return;
      }
      if (availabilityEnd.value < availabilityStart.value) {
        message.textContent = "�I�����͊J�n���ȍ~�̓��t��I�����Ă��������B";
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

