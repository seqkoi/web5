const state = {
  filter: "all",
  lang: "en",
  step: 0,
  rating: 0,
  cart: [],
  notesLoaded: 0,
  lastSound: 0,
  userName: ""
};

const els = {
  greeting: document.getElementById("greeting"),
  nameForm: document.getElementById("nameForm"),
  nameInput: document.getElementById("nameInput"),
  timeBtn: document.getElementById("timeBtn"),
  timeOutput: document.getElementById("timeOutput"),
  langSelect: document.getElementById("langSelect"),
  themeToggle: document.getElementById("themeToggle"),
  filters: document.getElementById("filters"),
  grid: document.getElementById("productGrid"),
  resultCount: document.getElementById("resultCount"),
  cartBadge: document.getElementById("cartCount"),
  cartLink: document.querySelector(".cart"),
  stars: document.querySelectorAll(".star"),
  ratingMessage: document.getElementById("ratingMessage"),
  notesList: document.getElementById("notesList"),
  notesStatus: document.getElementById("notesStatus"),
  loadNotes: document.getElementById("loadNotes"),
  nav: document.getElementById("mainNav"),
  form: document.getElementById("orderForm"),
  steps: document.querySelectorAll(".step"),
  stepLabel: document.getElementById("stepLabel"),
  progressBar: document.getElementById("progressBar"),
  backBtn: document.getElementById("backBtn"),
  nextBtn: document.getElementById("nextBtn"),
  submitBtn: document.getElementById("submitBtn"),
  resetBtn: document.getElementById("resetBtn"),
  formError: document.getElementById("formError"),
  summary: document.getElementById("summary"),
  orderResult: document.getElementById("orderResult")
};

let audioContext = null;

function t(key, values = {}) {
  const dictionary = translations[state.lang];
  let text = dictionary[key] !== undefined ? dictionary[key] : translations.en[key];
  Object.keys(values).forEach(name => {
    text = text.replace("{" + name + "}", values[name]);
  });
  return text;
}

function playSound(type) {
  const now = performance.now();
  if (now - state.lastSound < 90) return;
  state.lastSound = now;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  audioContext = audioContext || new AudioCtx();
  let notes;
  switch (type) {
    case "add":
      notes = [660, 880];
      break;
    case "success":
      notes = [523, 659, 784];
      break;
    case "error":
      notes = [220];
      break;
    case "star":
      notes = [740];
      break;
    default:
      notes = [440];
  }
  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const start = audioContext.currentTime + index * 0.09;
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.15, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.2);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.22);
  });
}

function retrigger(element, className) {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}

function getPeriod() {
  const hour = new Date().getHours();
  switch (true) {
    case hour < 12:
      return "morning";
    case hour < 18:
      return "afternoon";
    default:
      return "evening";
  }
}

function updateGreeting() {
  const base = t(getPeriod());
  els.greeting.textContent = state.userName ? base + ", " + state.userName : base;
}

function applyLanguage() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll("[data-i18n]").forEach(element => {
    element.textContent = t(element.dataset.i18n);
  });
  els.themeToggle.textContent = document.body.classList.contains("night") ? t("day") : t("night");
  updateGreeting();
  renderProducts();
  updateRatingMessage();
  updateStepUI();
  if (state.step === els.steps.length - 1) renderSummary();
}

function applyTheme(isNight) {
  document.body.classList.toggle("night", isNight);
  els.themeToggle.setAttribute("aria-pressed", String(isNight));
  els.themeToggle.textContent = isNight ? t("day") : t("night");
  try {
    localStorage.setItem("theme", isNight ? "night" : "day");
  } catch (error) {
    return;
  }
}

function matchesFilter(product) {
  switch (state.filter) {
    case "hot":
    case "cold":
    case "bakery":
      return product.category === state.filter;
    case "budget":
      return product.price < 4;
    default:
      return true;
  }
}

function productCard(product, index) {
  const inCart = state.cart.filter(item => item.id === product.id).length;
  return `
    <article class="card" data-index="${index}">
      <div class="swatch" data-tone="${product.tone}">${product.emoji}</div>
      <h3>${product.name}</h3>
      <span class="price">$${product.price.toFixed(2)}</span>
      <button type="button" data-id="${product.id}">${t("add")}${inCart ? " (" + inCart + ")" : ""}</button>
    </article>`;
}

function renderProducts() {
  const visible = products.filter(matchesFilter);
  els.grid.innerHTML = visible.map(productCard).join("");
  els.grid.querySelectorAll(".card").forEach(card => {
    card.style.animationDelay = Number(card.dataset.index) * 50 + "ms";
  });
  els.grid.querySelectorAll(".swatch").forEach(swatch => {
    const tone = swatch.dataset.tone;
    swatch.style.backgroundColor = "hsl(" + tone + ", 70%, 82%)";
  });
  els.resultCount.textContent = t("found", { n: visible.length });
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;
  state.cart.push(product);
  els.cartBadge.textContent = state.cart.length;
  retrigger(els.cartLink, "bump");
  playSound("add");
}

function setFilter(value) {
  state.filter = value;
  els.filters.querySelectorAll(".chip").forEach(chip => {
    chip.classList.toggle("active", chip.dataset.filter === value);
  });
  renderProducts();
}

function updateRatingMessage() {
  els.ratingMessage.textContent = state.rating ? t("rate_done", { n: state.rating }) : t("rate_none");
}

function setRating(value) {
  state.rating = value;
  els.stars.forEach(star => {
    const active = Number(star.dataset.value) <= value;
    star.classList.toggle("active", active);
    star.setAttribute("aria-pressed", String(active));
  });
  retrigger(els.stars[value - 1], "pop");
  updateRatingMessage();
  playSound("star");
}

function createNote(note) {
  const article = document.createElement("article");
  const title = document.createElement("h3");
  const body = document.createElement("p");
  article.className = "note";
  title.textContent = note.title;
  body.textContent = note.body;
  article.append(title, body);
  return article;
}

function appendNotes(list) {
  list.forEach(note => els.notesList.appendChild(createNote(note)));
  state.notesLoaded += list.length;
}

function loadMoreNotes() {
  const batch = 2;
  const remaining = brewNotes.length - state.notesLoaded;
  if (remaining <= 0) {
    els.notesStatus.textContent = t("notes_empty");
    els.loadNotes.disabled = true;
    return;
  }
  const next = brewNotes.slice(state.notesLoaded, state.notesLoaded + batch);
  appendNotes(next);
  playSound("click");
  if (state.notesLoaded >= brewNotes.length) {
    els.notesStatus.textContent = t("notes_empty");
    els.loadNotes.disabled = true;
  }
}

function handleNavKeys(event) {
  const links = Array.from(els.nav.querySelectorAll("a"));
  const index = links.indexOf(document.activeElement);
  if (index === -1) return;
  let target = null;
  switch (event.key) {
    case "ArrowRight":
    case "ArrowDown":
      target = links[(index + 1) % links.length];
      break;
    case "ArrowLeft":
    case "ArrowUp":
      target = links[(index - 1 + links.length) % links.length];
      break;
    case "Home":
      target = links[0];
      break;
    case "End":
      target = links[links.length - 1];
      break;
    default:
      return;
  }
  event.preventDefault();
  target.focus();
}

function updateStepUI() {
  const total = els.steps.length;
  els.steps.forEach((step, index) => step.classList.toggle("current", index === state.step));
  els.stepLabel.textContent = t("step_of", { n: state.step + 1, t: total });
  els.progressBar.style.width = ((state.step + 1) / total) * 100 + "%";
  els.backBtn.classList.toggle("hidden", state.step === 0);
  els.nextBtn.classList.toggle("hidden", state.step === total - 1);
  els.submitBtn.classList.toggle("hidden", state.step !== total - 1);
}

function showStep(index) {
  state.step = index;
  updateStepUI();
  if (index === els.steps.length - 1) renderSummary();
}

function validateStep(index) {
  const name = els.form.elements.name.value.trim();
  const phone = els.form.elements.phone.value.trim();
  const pickup = els.form.elements.pickup.value;
  switch (index) {
    case 0:
      return name && phone ? "" : t("err_details");
    case 1:
      return pickup ? "" : t("err_pickup");
    default:
      return state.cart.length ? "" : t("err_cart");
  }
}

function goToStep(direction, callback) {
  els.formError.textContent = "";
  if (direction > 0) {
    const problem = validateStep(state.step);
    if (problem) {
      els.formError.textContent = problem;
      playSound("error");
      return;
    }
  }
  const target = Math.min(Math.max(state.step + direction, 0), els.steps.length - 1);
  callback(target);
  playSound("click");
}

function cartTotal() {
  return state.cart.reduce((sum, item) => sum + item.price, 0);
}

function renderSummary() {
  const lines = state.cart.map(item => `<li>${item.name} — $${item.price.toFixed(2)}</li>`).join("");
  const name = els.form.elements.name.value.trim();
  const pickup = els.form.elements.pickup.value;
  els.summary.innerHTML = `
    <strong></strong>
    <ul>${lines || "<li>" + t("empty") + "</li>"}</ul>
    <p><strong>${t("total")}: $${cartTotal().toFixed(2)}</strong></p>`;
  els.summary.querySelector("strong").textContent = name + " · " + pickup;
}

function submitOrder(onSuccess, onFailure) {
  const payload = {
    name: els.form.elements.name.value.trim(),
    phone: els.form.elements.phone.value.trim(),
    pickup: els.form.elements.pickup.value,
    note: els.form.elements.note.value.trim(),
    items: state.cart.map(item => item.name),
    total: cartTotal()
  };
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (!response.ok) throw new Error("Request failed");
      return response.json();
    })
    .then(onSuccess)
    .catch(onFailure);
}

function resetForm() {
  els.form.querySelectorAll("input").forEach(input => {
    input.value = "";
  });
  els.form.querySelectorAll("select").forEach(select => {
    select.selectedIndex = 0;
  });
  els.formError.textContent = "";
  els.orderResult.textContent = "";
  showStep(0);
}

els.nameForm.addEventListener("submit", event => {
  event.preventDefault();
  state.userName = els.nameInput.value.trim();
  updateGreeting();
  retrigger(els.greeting, "bump");
  playSound("click");
});

els.timeBtn.addEventListener("click", () => {
  els.timeOutput.textContent = new Date().toLocaleTimeString();
  retrigger(els.timeOutput, "tick");
  playSound("click");
});

els.langSelect.addEventListener("change", event => {
  state.lang = event.target.value;
  applyLanguage();
  playSound("click");
});

els.themeToggle.addEventListener("click", () => {
  applyTheme(!document.body.classList.contains("night"));
  playSound("click");
});

els.filters.addEventListener("click", event => {
  const chip = event.target.closest(".chip");
  if (!chip) return;
  setFilter(chip.dataset.filter);
  playSound("click");
});

els.grid.addEventListener("click", event => {
  const button = event.target.closest("button[data-id]");
  if (!button) return;
  addToCart(Number(button.dataset.id));
  const label = button.textContent;
  button.textContent = t("added");
  button.classList.add("done");
  setTimeout(() => {
    button.textContent = label;
    button.classList.remove("done");
    renderProducts();
  }, 700);
});

els.stars.forEach(star => {
  star.addEventListener("click", () => setRating(Number(star.dataset.value)));
});

els.loadNotes.addEventListener("click", loadMoreNotes);
els.nav.addEventListener("keydown", handleNavKeys);

document.addEventListener("keydown", event => {
  const tag = event.target.tagName;
  if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
  switch (event.key.toLowerCase()) {
    case "t":
      applyTheme(!document.body.classList.contains("night"));
      break;
    default:
      break;
  }
});

els.nextBtn.addEventListener("click", () => goToStep(1, showStep));
els.backBtn.addEventListener("click", () => goToStep(-1, showStep));
els.resetBtn.addEventListener("click", resetForm);

els.form.addEventListener("submit", event => {
  event.preventDefault();
  const problem = validateStep(state.step);
  if (problem) {
    els.formError.textContent = problem;
    playSound("error");
    return;
  }
  els.submitBtn.disabled = true;
  submitOrder(
    () => {
      els.orderResult.textContent = t("ok_order", { t: els.form.elements.pickup.value });
      state.cart = [];
      els.cartBadge.textContent = 0;
      renderProducts();
      resetFormAfterSuccess();
      playSound("success");
    },
    () => {
      els.formError.textContent = t("err_net");
      els.submitBtn.disabled = false;
      playSound("error");
    }
  );
});

function resetFormAfterSuccess() {
  const message = els.orderResult.textContent;
  resetForm();
  els.orderResult.textContent = message;
  els.submitBtn.disabled = false;
}

function init() {
  let saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch (error) {
    saved = null;
  }
  const prefersNight = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved ? saved === "night" : prefersNight);
  appendNotes(brewNotes.slice(0, 2));
  applyLanguage();
  showStep(0);
}

init();
