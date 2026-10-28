const products = [
  { id: 1, name: "Ember Espresso", category: "hot", price: 3, emoji: "☕", tone: 28 },
  { id: 2, name: "Cardamom Latte", category: "hot", price: 4.5, emoji: "🥛", tone: 42 },
  { id: 3, name: "Flat White", category: "hot", price: 4, emoji: "☕", tone: 20 },
  { id: 4, name: "Cold Brew", category: "cold", price: 4.2, emoji: "🧊", tone: 200 },
  { id: 5, name: "Orange Tonic", category: "cold", price: 3.8, emoji: "🍊", tone: 32 },
  { id: 6, name: "Almond Croissant", category: "bakery", price: 3.5, emoji: "🥐", tone: 38 },
  { id: 7, name: "Honey Cake", category: "bakery", price: 3.9, emoji: "🍰", tone: 46 },
  { id: 8, name: "Oat Cookie", category: "bakery", price: 2.5, emoji: "🍪", tone: 30 }
];

const brewNotes = [
  { title: "Why we roast at dawn", body: "Beans rest for a day before they reach the bar, so every shot tastes round, not sharp." },
  { title: "Water matters", body: "Our filter keeps minerals steady, which keeps the sweetness in the cup." },
  { title: "Grind by the weather", body: "On humid days we grind a touch coarser to keep extraction even." },
  { title: "The ten second rule", body: "Espresso is best within ten seconds of pulling. Drink it while the crema is thick." },
  { title: "Milk is half the drink", body: "We steam to 60 degrees. Any hotter and the natural sweetness fades." },
  { title: "Cold brew patience", body: "Eighteen hours in the cold gives a smooth, low-acid finish." }
];

const translations = {
  en: {
    nav_menu: "Menu", nav_rate: "Rate us", nav_notes: "Barista notes", nav_order: "Order",
    hero_sub: "Small-batch coffee, roasted every morning. Pick a cup, rate your visit, and order ahead.",
    btn_greet: "Greet me", clock_label: "Is the roaster still warm?", btn_time: "Show current time",
    menu_title: "Today's menu", f_all: "All", f_hot: "Hot", f_cold: "Cold", f_bakery: "Bakery", f_budget: "Under $4",
    rate_title: "How was your last cup?", rate_none: "Tap a star to rate.", rate_done: "You rated us {n} of 5. Thank you!",
    notes_title: "Barista notes", btn_more: "Load more notes", notes_empty: "No more notes today.",
    order_title: "Order ahead", step1: "Your details", step2: "Pickup", step3: "Confirm",
    lbl_name: "Name", lbl_phone: "Phone", lbl_time: "Pickup time", lbl_note: "Note for the barista",
    btn_back: "Back", btn_next: "Next", btn_submit: "Place order", btn_reset: "Reset",
    step_of: "Step {n} of {t}", add: "Add to cart", added: "Added", found: "{n} items",
    morning: "Good morning", afternoon: "Good afternoon", evening: "Good evening",
    err_details: "Enter your name and phone to continue.", err_pickup: "Choose a pickup time to continue.",
    err_cart: "Your cart is empty. Add something from the menu first.", ok_order: "Order placed. See you in {t}!",
    err_net: "Could not send the order. Check your connection and try again.",
    total: "Total", empty: "Nothing here yet.", hint_keys: "Shortcuts: arrow keys in the menu bar, T for theme",
    night: "Night", day: "Day"
  },
  ru: {
    nav_menu: "Меню", nav_rate: "Оценить", nav_notes: "Заметки бариста", nav_order: "Заказ",
    hero_sub: "Кофе малыми партиями, обжарка каждое утро. Выберите чашку, оцените визит и закажите заранее.",
    btn_greet: "Поприветствуй", clock_label: "Обжарочная ещё тёплая?", btn_time: "Показать время",
    menu_title: "Меню на сегодня", f_all: "Все", f_hot: "Горячее", f_cold: "Холодное", f_bakery: "Выпечка", f_budget: "До $4",
    rate_title: "Как вам последняя чашка?", rate_none: "Нажмите на звезду.", rate_done: "Ваша оценка: {n} из 5. Спасибо!",
    notes_title: "Заметки бариста", btn_more: "Ещё заметки", notes_empty: "На сегодня заметок больше нет.",
    order_title: "Заказ заранее", step1: "Ваши данные", step2: "Самовывоз", step3: "Подтверждение",
    lbl_name: "Имя", lbl_phone: "Телефон", lbl_time: "Время самовывоза", lbl_note: "Комментарий бариста",
    btn_back: "Назад", btn_next: "Далее", btn_submit: "Оформить заказ", btn_reset: "Сбросить",
    step_of: "Шаг {n} из {t}", add: "В корзину", added: "Добавлено", found: "Позиций: {n}",
    morning: "Доброе утро", afternoon: "Добрый день", evening: "Добрый вечер",
    err_details: "Введите имя и телефон, чтобы продолжить.", err_pickup: "Выберите время самовывоза.",
    err_cart: "Корзина пуста. Сначала добавьте что-нибудь из меню.", ok_order: "Заказ принят. Ждём вас через {t}!",
    err_net: "Не удалось отправить заказ. Проверьте соединение и повторите.",
    total: "Итого", empty: "Пока пусто.", hint_keys: "Подсказка: стрелки в меню, клавиша T для темы",
    night: "Ночь", day: "День"
  },
  kk: {
    nav_menu: "Мәзір", nav_rate: "Бағалау", nav_notes: "Бариста жазбалары", nav_order: "Тапсырыс",
    hero_sub: "Шағын партиялы кофе, күн сайын таңертең қуырылады. Кесе таңдаңыз, бағалаңыз және алдын ала тапсырыс беріңіз.",
    btn_greet: "Сәлемдес", clock_label: "Қуырғыш әлі жылы ма?", btn_time: "Уақытты көрсету",
    menu_title: "Бүгінгі мәзір", f_all: "Барлығы", f_hot: "Ыстық", f_cold: "Суық", f_bakery: "Тоқаш", f_budget: "$4-ке дейін",
    rate_title: "Соңғы кесе қалай болды?", rate_none: "Жұлдызшаны басыңыз.", rate_done: "Бағаңыз: 5-тен {n}. Рақмет!",
    notes_title: "Бариста жазбалары", btn_more: "Тағы жазбалар", notes_empty: "Бүгінге жазба қалмады.",
    order_title: "Алдын ала тапсырыс", step1: "Деректеріңіз", step2: "Алып кету", step3: "Растау",
    lbl_name: "Аты", lbl_phone: "Телефон", lbl_time: "Алып кету уақыты", lbl_note: "Баристаға ескертпе",
    btn_back: "Артқа", btn_next: "Келесі", btn_submit: "Тапсырыс беру", btn_reset: "Тазалау",
    step_of: "{t} қадамның {n}-і", add: "Себетке", added: "Қосылды", found: "Тармақ: {n}",
    morning: "Қайырлы таң", afternoon: "Қайырлы күн", evening: "Қайырлы кеш",
    err_details: "Жалғастыру үшін аты мен телефонды енгізіңіз.", err_pickup: "Алып кету уақытын таңдаңыз.",
    err_cart: "Себет бос. Алдымен мәзірден бірдеңе қосыңыз.", ok_order: "Тапсырыс қабылданды. {t} кейін күтеміз!",
    err_net: "Тапсырысты жіберу мүмкін болмады. Байланысты тексеріп, қайталаңыз.",
    total: "Барлығы", empty: "Әзірге бос.", hint_keys: "Кеңес: мәзірде көрсеткі пернелер, тақырып үшін T",
    night: "Түн", day: "Күн"
  }
};
