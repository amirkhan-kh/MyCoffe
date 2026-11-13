import type { Category, CategoryIcon, I18n, MenuDoc, MenuItem } from "./types";

const t = (uz: string, ru: string, en: string): I18n => ({ uz, ru, en });

const cat = (id: string, icon: CategoryIcon, name: I18n): Category => ({ id, icon, name });

type ItemInput = {
  name: I18n;
  description?: I18n;
  price: number;
  priceMax?: number;
  seasonal?: boolean;
  addon?: boolean;
};

function items(categoryId: string, list: ItemInput[]): MenuItem[] {
  return list.map((it, i) => ({
    id: `${categoryId}-${i + 1}`,
    categoryId,
    name: it.name,
    description: it.description ?? t("", "", ""),
    price: it.price,
    priceMax: it.priceMax ?? null,
    seasonal: it.seasonal ?? false,
    addon: it.addon ?? false,
    available: true,
  }));
}

const categories: Category[] = [
  cat("coffee", "coffee", t("Qahva", "Кофе", "Coffee")),
  cat("iced", "iced", t("Muzli qahva", "Айс кофе", "Iced coffee")),
  cat("noncoffee", "noncoffee", t("Qahvasiz", "Не кофе", "Non-coffee")),
  cat("tea", "tea", t("Choy", "Чай", "Tea")),
  cat("lemonades", "lemonade", t("Limonadlar", "Лимонады", "Lemonades")),
  cat("mojito", "mojito", t("Mojito", "Мохито", "Mojito")),
  cat("milkshakes", "milkshake", t("Sutli kokteyllar", "Молочные коктейли", "Milkshakes")),
  cat("smoothies", "smoothie", t("Smuzi", "Смузи", "Smoothies")),
  cat("juices", "juice", t("Fresh sharbatlar", "Свежевыжатые соки", "Fresh juices")),
  cat("croissants", "croissant", t("Kruassan sendvichlar", "Сэндвичи из круассанов", "Croissant sandwiches")),
  cat("toasts", "toast", t("Tosterlar", "Тостеры", "Toasties")),
];

const menuItems: MenuItem[] = [
  ...items("coffee", [
    {
      name: t("Espresso", "Эспрессо", "Espresso"),
      price: 20000,
      description: t(
        "Yangi yanchilgan qahva donlaridan tayyorlangan kuchli va to‘yingan ichimlik. Yorqin aromat, chuqur ta’m va nafis oltinrang ko‘pik — qahva shinavandalari uchun haqiqiy klassika.",
        "Крепкий и насыщенный кофейный напиток из свежемолотых кофейных зёрен. Яркий аромат, глубокий вкус и нежная золотистая пенка — настоящая классика для ценителей кофе.",
        "A strong, rich coffee made from freshly ground beans. Bright aroma, deep flavour and a delicate golden crema — a true classic for coffee lovers.",
      ),
    },
    {
      name: t("Amerikano", "Американо", "Americano"),
      price: 25000,
      description: t(
        "Espresso asosida issiq suv qo‘shib tayyorlanadigan klassik qora qahva. Yumshoq ta’m, to‘yingan qahva aromati va yengil yoqimli achchiqlik. Haqiqiy qahva ixlosmandlari uchun ideal tanlov.",
        "Классический чёрный кофе на основе эспрессо с добавлением горячей воды. Обладает мягким вкусом, насыщенным кофейным ароматом и лёгкой приятной горчинкой. Идеальный выбор для любителей настоящего кофе.",
        "Classic black coffee made with espresso and hot water. Smooth taste, rich coffee aroma and a light, pleasant bitterness. The ideal choice for true coffee lovers.",
      ),
    },
    {
      name: t("Kapuchino", "Капучино", "Cappuccino"),
      price: 30000,
      description: t(
        "Xushbo‘y espresso, issiq sut va nozik sut ko‘pigining uyg‘un birikmasi. Yumshoq ta’m, yoqimli quvvat va haqiqiy qahva lazzati.",
        "Гармоничное сочетание ароматного эспрессо, горячего молока и нежной молочной пенки. Мягкий вкус, приятная крепость и настоящее кофейное удовольствие.",
        "A harmonious blend of aromatic espresso, hot milk and delicate milk foam. Smooth taste, pleasant strength and true coffee pleasure.",
      ),
    },
    {
      name: t("Latte", "Латте", "Latte"),
      price: 30000,
      description: t(
        "Espresso asosida issiq sut va havodor sut ko‘pigi qo‘shilgan nozik qahva ichimligi. Har bir chashkada yumshoq qaymoqli ta’m va qahvaning nozik aromati.",
        "Нежный кофейный напиток на основе эспрессо с добавлением горячего молока и воздушной молочной пенки. Мягкий сливочный вкус и тонкий аромат кофе в каждой чашке.",
        "A gentle espresso-based drink with hot milk and airy milk foam. A soft, creamy taste and a subtle coffee aroma in every cup.",
      ),
    },
    {
      name: t("Flet uayt", "Флэт уайт", "Flat white"),
      price: 35000,
      description: t(
        "Nozik sut va yupqa mikroko‘pik qo‘shilgan qo‘sh espresso. To‘yingan qahva ta’mi, yumshoq tekstura va quvvatning mukammal muvozanati.",
        "Двойной эспрессо с добавлением нежного молока и тонкого слоя микропены. Насыщенный кофейный вкус, мягкая текстура и идеальный баланс крепости.",
        "Double espresso with silky milk and a thin layer of microfoam. Rich coffee flavour, smooth texture and a perfect balance of strength.",
      ),
    },
    {
      name: t("Raf", "Раф", "Raf"),
      price: 40000,
      description: t(
        "Espresso, qaymoq va vanil shakari asosidagi nozik qahva ichimligi. Baxmaldek tekstura, yumshoq qaymoqli ta’m va yoqimli aromat.",
        "Нежный кофейный напиток на основе эспрессо, сливок и ванильного сахара. Обладает бархатистой текстурой, мягким сливочным вкусом и приятным ароматом.",
        "A delicate drink of espresso, cream and vanilla sugar. Velvety texture, a soft creamy taste and a lovely aroma.",
      ),
    },
    {
      name: t("Mokko", "Мокко", "Mocha"),
      price: 40000,
      description: t(
        "Xushbo‘y espresso, nozik sut va to‘yingan shokoladning mukammal uyg‘unligi. Har bir chashkada yumshoq qaymoqli ta’m va yoqimli shokolad notalari.",
        "Идеальное сочетание ароматного эспрессо, нежного молока и насыщенного шоколада. Мягкий сливочный вкус с приятными шоколадными нотками в каждой чашке.",
        "The perfect combination of aromatic espresso, gentle milk and rich chocolate. A soft creamy taste with pleasant chocolate notes in every cup.",
      ),
    },
    {
      name: t("Ispancha latte", "Спениш латте", "Spanish latte"),
      price: 30000,
      description: t(
        "Sut va shirin quyultirilgan sut bilan uyg‘unlashgan nozik espresso. Baxmaldek tekstura, yumshoq qahva aromati va yoqimli qaymoqli shirinlik.",
        "Нежный эспрессо в сочетании с молоком и сладким сгущённым молоком. Бархатистая текстура, мягкий кофейный аромат и приятная сливочная сладость.",
        "Smooth espresso with milk and sweet condensed milk. Velvety texture, a soft coffee aroma and a pleasant creamy sweetness.",
      ),
    },
    {
      name: t("Popkorn latte", "Латте попкорн", "Popcorn latte"),
      price: 35000,
      seasonal: true,
      description: t(
        "Xushbo‘y karamel siropi va ustiga qarsildoq popkorn sepilgan nozik latte. Shirin ta’m va yorqin kayfiyat uchun g‘ayrioddiy taqdimot!",
        "Нежный латте с ароматным карамельным сиропом и хрустящим попкорном сверху. Сладкий вкус и необычная подача для яркого настроения!",
        "A gentle latte with fragrant caramel syrup and crunchy popcorn on top. A sweet taste and an unusual presentation for a bright mood!",
      ),
    },
  ]),

  ...items("iced", [
    {
      name: t("Ays amerikano", "Айс американо", "Iced americano"),
      price: 30000,
      description: t(
        "Kuchli espresso, sovutilgan suv va muz. To‘yingan qahva aromati, yumshoq achchiqlik va tetiklantiruvchi ta’m.",
        "Крепкий эспрессо, охлаждённая вода и лёд. Насыщенный кофейный аромат, мягкая горчинка и освежающий вкус.",
        "Strong espresso, chilled water and ice. Rich coffee aroma, gentle bitterness and a refreshing taste.",
      ),
    },
    {
      name: t("Ays latte", "Айс латте", "Iced latte"),
      price: 35000,
      description: t(
        "Nozik espresso, sovutilgan sut va muz. Yoqimli qahva notalari bilan yumshoq qaymoqli ta’m.",
        "Нежный эспрессо, охлаждённое молоко и лёд. Мягкий сливочный вкус с приятными кофейными нотками.",
        "Smooth espresso, chilled milk and ice. A soft creamy taste with pleasant coffee notes.",
      ),
    },
    {
      name: t("Bambl", "Бамбл", "Bumble"),
      price: 45000,
      description: t(
        "Espresso va apelsin sharbati asosidagi muzli tetiklantiruvchi qahva ichimligi. Qahva to‘yinganligi va sitrus tetikligining yorqin uyg‘unligi.",
        "Освежающий кофейный напиток на основе эспрессо и апельсинового сока со льдом. Яркое сочетание кофейной насыщенности и цитрусовой свежести.",
        "A refreshing iced coffee drink of espresso and orange juice. A bright combination of coffee richness and citrus freshness.",
      ),
    },
    {
      name: t("Ays ispancha latte", "Айс спениш", "Iced Spanish latte"),
      price: 35000,
      description: t(
        "To‘yingan espresso, sovutilgan sut va shirin quyultirilgan sut. Yoqimli qahva notasi bilan nozik qaymoqli ta’m.",
        "Насыщенный эспрессо, охлаждённое молоко и сладкое сгущённое молоко. Нежный сливочный вкус с приятной кофейной ноткой.",
        "Rich espresso, chilled milk and sweet condensed milk. A delicate creamy taste with a pleasant coffee note.",
      ),
    },
    {
      name: t("Ays mokko", "Айс мокко", "Iced mocha"),
      price: 45000,
      description: t(
        "To‘yingan espresso, sovutilgan sut va shokolad. Qahva quvvati, nozik qaymoqlilik va shirin shokolad ta’mining mukammal uyg‘unligi.",
        "Насыщенный эспрессо, охлаждённое молоко и шоколад. Идеальное сочетание кофейной крепости, нежной сливочности и сладкого шоколадного вкуса.",
        "Rich espresso, chilled milk and chocolate. The perfect blend of coffee strength, gentle creaminess and sweet chocolate.",
      ),
    },
    {
      name: t("Frappe", "Фраппе", "Frappe"),
      price: 40000,
      description: t(
        "Nozik havodor ko‘pikli tetiklantiruvchi sovuq qahva ichimligi. Har bir qultumda to‘yingan qahva ta’mi va yoqimli salqinlik.",
        "Освежающий холодный кофейный напиток с нежной воздушной пенкой. Насыщенный кофейный вкус и приятная прохлада в каждом глотке.",
        "A refreshing cold coffee drink with a light, airy foam. Rich coffee flavour and pleasant coolness in every sip.",
      ),
    },
    { name: t("Qo‘shimcha espresso", "Эспрессо", "Espresso shot"), price: 10000, addon: true },
    { name: t("Sirop", "Сироп", "Syrup"), price: 5000, addon: true },
    { name: t("Shakar o‘rnini bosuvchi", "Сахарозаменитель", "Sweetener"), price: 5000, addon: true },
  ]),

  ...items("noncoffee", [
    {
      name: t("Matcha latte", "Матча латте", "Matcha latte"),
      price: 35000,
      description: t(
        "Yapon matcha yashil choyi asosidagi nozik sutli ichimlik. Yumshoq qaymoqli ta’m, yengil tabiiy achchiqlik va yoqimli o‘tli aromat.",
        "Нежный молочный напиток на основе японского зелёного чая матча. Обладает мягким сливочным вкусом, лёгкой природной горчинкой и приятным травянистым ароматом.",
        "A delicate milk drink made with Japanese matcha green tea. A soft creamy taste, light natural bitterness and a pleasant herbal aroma.",
      ),
    },
    {
      name: t("Kakao", "Какао", "Cocoa"),
      price: 30000,
      description: t(
        "To‘yingan shokolad ta’mi va yumshoq teksturali nozik issiq kakao. Ustiga havodor zefirchalar qo‘yilgan — ular yoqimli shirinlik va shinamlik bag‘ishlaydi.",
        "Нежный горячий какао с насыщенным шоколадным вкусом и мягкой текстурой. Сверху украшен воздушными зефирками, которые добавляют приятную сладость и уют.",
        "A gentle hot cocoa with a rich chocolate taste and soft texture, topped with airy marshmallows for sweetness and comfort.",
      ),
    },
    {
      name: t("Issiq shokolad", "Горячий шоколад", "Hot chocolate"),
      price: 35000,
      description: t(
        "Baxmaldek tekstura va chuqur shokolad ta’mli quyuq, to‘yingan issiq shokolad. Shokolad ixlosmandlari uchun haqiqiy rohat.",
        "Густой и насыщенный горячий шоколад с бархатистой текстурой и глубоким шоколадным вкусом. Настоящее удовольствие для любителей шоколада.",
        "Thick, rich hot chocolate with a velvety texture and deep chocolate flavour. A real treat for chocolate lovers.",
      ),
    },
    {
      name: t("Bebichino", "Бейбичино", "Babyccino"),
      price: 20000,
      description: t(
        "Tabiiy asal qo‘shilgan nozik iliq sut. Har bir chashkada yumshoq shirin ta’m va shinamlik. Qahvaxonamizning kichkina mehmonlari uchun maxsus taklif.",
        "Нежное тёплое молоко с натуральным мёдом. Мягкий сладкий вкус и уют в каждой чашке. Особенное угощение для маленьких гостей нашей кофейни.",
        "Gentle warm milk with natural honey. A soft, sweet taste and comfort in every cup. A special treat for our youngest guests.",
      ),
    },
  ]),

  ...items("tea", [
    {
      name: t("Ko‘k choy", "Зелёный чай", "Green tea"),
      price: 10000,
      priceMax: 15000,
      description: t(
        "Nozik o‘tli ta’m va yoqimli tetiklikka ega yengil, xushbo‘y ko‘k choy. Xotirjam hordiq va yoqimli lahzalar uchun ideal ichimlik.",
        "Лёгкий и ароматный зелёный чай с нежным травянистым вкусом и приятной свежестью. Идеальный напиток для спокойного отдыха и приятных моментов.",
        "Light and fragrant green tea with a delicate herbal taste and pleasant freshness. The ideal drink for calm rest and pleasant moments.",
      ),
    },
    {
      name: t("Qora choy", "Чёрный чай", "Black tea"),
      price: 10000,
      priceMax: 15000,
      description: t(
        "To‘yingan ta’m, chuqur aromat va yoqimli taxirlikka ega klassik qora choy. Iliq uchrashuvlar va shinam lahzalar uchun ideal ichimlik.",
        "Классический чёрный чай с насыщенным вкусом, глубоким ароматом и приятной терпкостью. Идеальный напиток для тёплых встреч и уютных моментов.",
        "Classic black tea with a rich taste, deep aroma and pleasant astringency. The ideal drink for warm get-togethers and cosy moments.",
      ),
    },
    {
      name: t("Limonli choy", "Лимонный чай", "Lemon tea"),
      price: 18000,
      priceMax: 28000,
      description: t(
        "Limon va yangi yalpiz qo‘shilgan xushbo‘y choy. Yoqimli sitrus nordonligi va tetiklantiruvchi yalpiz aromati uyg‘un va yengil ta’m yaratadi.",
        "Ароматный чай с добавлением лимона и свежей мяты. Приятная цитрусовая кислинка и освежающий мятный аромат создают гармоничный и лёгкий вкус.",
        "Fragrant tea with lemon and fresh mint. A pleasant citrus tang and refreshing mint aroma create a harmonious, light taste.",
      ),
    },
    {
      name: t("Malinali choy", "Малиновый чай", "Raspberry tea"),
      price: 20000,
      priceMax: 38000,
      description: t(
        "To‘yingan malina ta’mi va yoqimli rezavor nordonligiga ega xushbo‘y choy. Nozik shirinlik va yorqin aromat har bir chashkada shinam kayfiyat yaratadi.",
        "Ароматный чай с насыщенным малиновым вкусом и приятной ягодной кислинкой. Нежная сладость и яркий аромат создают уютное настроение в каждой чашке.",
        "Fragrant tea with a rich raspberry flavour and a pleasant berry tang. Gentle sweetness and a bright aroma create a cosy mood in every cup.",
      ),
    },
    {
      name: t("Rezavorli choy", "Ягодный чай", "Berry tea"),
      price: 25000,
      priceMax: 40000,
      description: t(
        "Shirali rezavorlarning to‘yingan ta’miga ega xushbo‘y choy. Yoqimli shirinlik, yengil nordonlik va yorqin rezavor aromati — har bir chashkada mukammal uyg‘unlik.",
        "Ароматный чай с насыщенным вкусом сочных ягод. Приятная сладость, лёгкая кислинка и яркий ягодный аромат создают идеальное сочетание в каждой чашке.",
        "Fragrant tea with the rich taste of juicy berries. Pleasant sweetness, a light tang and a bright berry aroma — a perfect combination in every cup.",
      ),
    },
    {
      name: t("Kivili choy", "Киви чай", "Kiwi tea"),
      price: 25000,
      priceMax: 40000,
      description: t(
        "Ziravorli dolchin va xushbo‘y badyan bilan to‘ldirilgan yorqin kivi ta’mli choy. Yoqimli meva nordonligi va isituvchi ziravorlar g‘ayrioddiy uyg‘unlik yaratadi.",
        "Ароматный чай с ярким вкусом киви, дополненный пряной корицей и ароматным бадьяном. Приятная фруктовая кислинка и согревающие специи создают необычное сочетание.",
        "Fragrant tea with a bright kiwi flavour, complemented by spicy cinnamon and aromatic star anise. A pleasant fruity tang and warming spices make an unusual combination.",
      ),
    },
    {
      name: t("Apelsinli choy", "Апельсиновый чай", "Orange tea"),
      price: 25000,
      priceMax: 40000,
      description: t(
        "Ziravorli dolchin va xushbo‘y badyan bilan to‘ldirilgan shirali apelsinli choy. Ziravorlarning iliq notalari bilan yorqin sitrus ta’mi alohida shinamlik muhitini yaratadi.",
        "Ароматный чай с сочным апельсином, дополненный пряной корицей и душистым бадьяном. Яркий цитрусовый вкус с тёплыми нотками специй создаёт особую атмосферу уюта.",
        "Fragrant tea with juicy orange, complemented by spicy cinnamon and fragrant star anise. A bright citrus taste with warm spice notes creates a special cosy atmosphere.",
      ),
    },
    {
      name: t("Zanjabilli choy", "Чай с имбирём", "Ginger tea"),
      price: 20000,
      priceMax: 35000,
      description: t(
        "Yangi zanjabil, limon va tabiiy asal qo‘shilgan xushbo‘y choy. Yengil sitrus nordonligi, yoqimli asal shirinligi va zanjabilning yorqin achchiqligi uyg‘un ta’m yaratadi.",
        "Ароматный чай с добавлением свежего имбиря, лимона и натурального мёда. Лёгкая цитрусовая кислинка, приятная медовая сладость и яркая пряность имбиря создают гармоничный вкус.",
        "Fragrant tea with fresh ginger, lemon and natural honey. A light citrus tang, pleasant honey sweetness and the bright spice of ginger create a harmonious taste.",
      ),
    },
    {
      name: t("Karak choy", "Карак чай", "Karak tea"),
      price: 20000,
      priceMax: 40000,
      description: t(
        "Qora choy, nozik sut va xushbo‘y ziravorlarning to‘yingan ta’miga ega an’anaviy ziravorli choy. Har bir chashkada baxmaldek tekstura, yoqimli shirinlik va isituvchi aromat.",
        "Традиционный пряный чай с насыщенным вкусом чёрного чая, нежного молока и ароматных специй. Бархатистая текстура, приятная сладость и согревающий аромат в каждой чашке.",
        "Traditional spiced tea with the rich taste of black tea, gentle milk and aromatic spices. Velvety texture, pleasant sweetness and a warming aroma in every cup.",
      ),
    },
    {
      name: t("Mango-marakuyali choy", "Чай манго-маракуйя", "Mango & passion fruit tea"),
      price: 25000,
      priceMax: 50000,
      seasonal: true,
      description: t(
        "Shirin mango va yorqin marakuyaning tropik uyg‘unligidagi xushbo‘y choy. Nozik meva shirinligi va yoqimli nordonlik tetiklantiruvchi va to‘yingan ta’m yaratadi.",
        "Ароматный чай с тропическим сочетанием сладкого манго и яркой маракуйи. Нежная фруктовая сладость и приятная кислинка создают освежающий и насыщенный вкус.",
        "Fragrant tea with a tropical blend of sweet mango and bright passion fruit. Gentle fruity sweetness and a pleasant tang create a refreshing, rich taste.",
      ),
    },
    {
      name: t("Golubika shabadasi", "Голубичный бриз", "Blueberry breeze"),
      price: 25000,
      priceMax: 50000,
      seasonal: true,
      description: t(
        "Nozik golubika pyuresi, zanjabilning yengil achchiqligi va yalpizning tetiklantiruvchi notalari qo‘shilgan xushbo‘y choy. Rezavor shirinligi va yoqimli tetiklik uyg‘un ta’m yaratadi.",
        "Ароматный чай с нежным пюре из голубики, лёгкой пряностью имбиря и освежающими нотками мяты. Ягодная сладость и приятная свежесть создают гармоничный вкус.",
        "Fragrant tea with delicate blueberry purée, a hint of ginger spice and refreshing notes of mint. Berry sweetness and pleasant freshness create a harmonious taste.",
      ),
    },
  ]),

  ...items("lemonades", [
    {
      name: t("Klassik", "Классический", "Classic"),
      price: 30000,
      description: t(
        "Tabiiy limon ta’mli tetiklantiruvchi limonad. Sitrus nordonligi va yengil shirinlikning yoqimli uyg‘unligi.",
        "Освежающий лимонад с натуральным лимонным вкусом. Приятное сочетание цитрусовой кислинки и лёгкой сладости.",
        "A refreshing lemonade with natural lemon flavour. A pleasant balance of citrus tang and light sweetness.",
      ),
    },
    {
      name: t("Malinali", "Малиновый", "Raspberry"),
      price: 30000,
      description: t(
        "Xushbo‘y malina va yorqin sitrus notali tetiklantiruvchi limonad. Yengil limon nordonligi bilan yoqimli rezavor shirinligi.",
        "Освежающий лимонад с ароматной малиной и яркой цитрусовой ноткой. Приятная ягодная сладость с лёгкой лимонной кислинкой.",
        "A refreshing lemonade with fragrant raspberry and a bright citrus note. Pleasant berry sweetness with a light lemon tang.",
      ),
    },
    {
      name: t("Qulupnayli", "Клубничный", "Strawberry"),
      price: 30000,
      description: t(
        "Shirali qulupnay va yorqin sitrus notali tetiklantiruvchi limonad. Nozik rezavor shirinligi va yoqimli limon nordonligi.",
        "Освежающий лимонад с сочной клубникой и яркой цитрусовой ноткой. Нежная ягодная сладость и приятная лимонная кислинка.",
        "A refreshing lemonade with juicy strawberry and a bright citrus note. Delicate berry sweetness and a pleasant lemon tang.",
      ),
    },
    {
      name: t("Apelsinli", "Апельсиновый", "Orange"),
      price: 45000,
      description: t(
        "Shirali apelsin va yorqin sitrus ta’mli tetiklantiruvchi limonad. Har bir qultumda yoqimli shirinlik va yengil nordonlik.",
        "Освежающий лимонад с сочным апельсином и ярким цитрусовым вкусом. Приятная сладость и лёгкая кислинка в каждом глотке.",
        "A refreshing lemonade with juicy orange and a bright citrus flavour. Pleasant sweetness and a light tang in every sip.",
      ),
    },
    {
      name: t("Kivili", "Киви", "Kiwi"),
      price: 30000,
      description: t(
        "Shirali kivi va sitrus notali tetiklantiruvchi limonad. Har bir qultumda yoqimli meva nordonligi va yengil shirinlik.",
        "Освежающий лимонад с сочным киви и цитрусовой ноткой. Приятная фруктовая кислинка и лёгкая сладость в каждом глотке.",
        "A refreshing lemonade with juicy kiwi and a citrus note. A pleasant fruity tang and light sweetness in every sip.",
      ),
    },
    {
      name: t("Mango-marakuya", "Манго-маракуйя", "Mango & passion fruit"),
      price: 45000,
      description: t(
        "Shirali mango va xushbo‘y marakuyali tetiklantiruvchi limonad. Tropik mevalar shirinligi yoqimli nordonlik bilan uyg‘un qo‘shiladi.",
        "Освежающий лимонад с сочным манго и ароматной маракуйей. Сладость тропических фруктов гармонично сочетается с приятной кислинкой.",
        "A refreshing lemonade with juicy mango and fragrant passion fruit. The sweetness of tropical fruit blends harmoniously with a pleasant tang.",
      ),
    },
    {
      name: t("Shaftolili", "Персик", "Peach"),
      price: 30000,
      description: t(
        "Shirali shaftoli, nozik shirinlik va tetiklantiruvchi nordonlik — har bir qultumda yoz ta’mi.",
        "Сочный персик, нежная сладость и освежающая кислинка — вкус лета в каждом глотке.",
        "Juicy peach, gentle sweetness and a refreshing tang — the taste of summer in every sip.",
      ),
    },
  ]),

  ...items("mojito", [
    {
      name: t("Klassik", "Классический", "Classic"),
      price: 30000,
      description: t(
        "Laym, yangi yalpiz va yengil gazli notali tetiklantiruvchi ichimlik. Sitrus nordonligi va salqinlikning ideal uyg‘unligi.",
        "Освежающий напиток с лаймом, свежей мятой и лёгкой газированной ноткой. Идеальное сочетание цитрусовой кислинки и прохлады.",
        "A refreshing drink with lime, fresh mint and a light fizz. The perfect combination of citrus tang and coolness.",
      ),
    },
    {
      name: t("Qulupnayli", "Клубничный", "Strawberry"),
      price: 35000,
      description: t(
        "Shirali qulupnay, yangi yalpiz va laymli tetiklantiruvchi ichimlik. Yoqimli sitrus nordonligi bilan nozik rezavor shirinligi.",
        "Освежающий напиток с сочной клубникой, свежей мятой и лаймом. Нежная ягодная сладость с приятной цитрусовой кислинкой.",
        "A refreshing drink with juicy strawberry, fresh mint and lime. Delicate berry sweetness with a pleasant citrus tang.",
      ),
    },
    {
      name: t("Rezavorli", "Ягодный", "Berry"),
      price: 35000,
      description: t(
        "Shirali rezavorlar aralashmasi, yangi yalpiz va laymli tetiklantiruvchi ichimlik. Yoqimli sitrus nordonligi bilan yorqin rezavor ta’mi.",
        "Освежающий напиток с миксом сочных ягод, свежей мятой и лаймом. Яркий ягодный вкус с приятной цитрусовой кислинкой.",
        "A refreshing drink with a mix of juicy berries, fresh mint and lime. A bright berry taste with a pleasant citrus tang.",
      ),
    },
    {
      name: t("Apelsinli", "Апельсиновый", "Orange"),
      price: 35000,
      description: t(
        "Shirali apelsin, yangi yalpiz va laymli tetiklantiruvchi ichimlik. Yoqimli shirinlik va yengil nordonlikka ega yorqin sitrus ta’mi.",
        "Освежающий напиток с сочным апельсином, свежей мятой и лаймом. Яркий цитрусовый вкус с приятной сладостью и лёгкой кислинкой.",
        "A refreshing drink with juicy orange, fresh mint and lime. A bright citrus taste with pleasant sweetness and a light tang.",
      ),
    },
    {
      name: t("Kivili", "Киви", "Kiwi"),
      price: 35000,
      description: t(
        "Shirali kivi, yangi yalpiz va laymli tetiklantiruvchi ichimlik. Har bir qultumda yoqimli meva nordonligi va yengil shirinlik.",
        "Освежающий напиток с сочным киви, свежей мятой и лаймом. Приятная фруктовая кислинка и лёгкая сладость в каждом глотке.",
        "A refreshing drink with juicy kiwi, fresh mint and lime. A pleasant fruity tang and light sweetness in every sip.",
      ),
    },
    {
      name: t("Moviy laguna", "Голубая лагуна", "Blue lagoon"),
      price: 35000,
      description: t(
        "Nozik sitrus ta’mi va chiroyli moviy tusga ega yorqin tetiklantiruvchi ichimlik. Har bir qultumda yengil shirinlik va salqinlik.",
        "Яркий освежающий напиток с нежным цитрусовым вкусом и красивым голубым оттенком. Лёгкая сладость и прохлада в каждом глотке.",
        "A bright, refreshing drink with a delicate citrus taste and a beautiful blue hue. Light sweetness and coolness in every sip.",
      ),
    },
  ]),

  ...items("milkshakes", [
    {
      name: t("Vanilli", "Ванильный", "Vanilla"),
      price: 30000,
      description: t(
        "Tabiiy vanil aromatiga ega nozik sutli kokteyl. Quyuq, havodor tekstura va yumshoq qaymoqli ta’m har bir qultumda haqiqiy rohat bag‘ishlaydi.",
        "Нежный молочный коктейль с приятным ароматом натуральной ванили. Густая, воздушная текстура и мягкий сливочный вкус создают настоящее удовольствие в каждом глотке.",
        "A gentle milkshake with the aroma of natural vanilla. A thick, airy texture and soft creamy taste make every sip a true pleasure.",
      ),
    },
    {
      name: t("Bananli", "Банановый", "Banana"),
      price: 35000,
      description: t(
        "Pishgan bananli nozik sutli kokteyl. Har bir qultumda tabiiy meva shirinligi, quyuq tekstura va yumshoq qaymoqli ta’m.",
        "Нежный молочный коктейль со спелым бананом. Натуральная фруктовая сладость, густая текстура и мягкий сливочный вкус в каждом глотке.",
        "A gentle milkshake with ripe banana. Natural fruity sweetness, a thick texture and a soft creamy taste in every sip.",
      ),
    },
    {
      name: t("Qulupnayli", "Клубничный", "Strawberry"),
      price: 40000,
      seasonal: true,
      description: t(
        "Shirin qulupnayli nozik sutli kokteyl. Yorqin rezavor ta’mi, yumshoq qaymoqli tekstura va haqiqiy yozgi kayfiyat.",
        "Нежный молочный коктейль со сладкой клубникой. Яркий ягодный вкус, мягкая сливочная текстура и настоящее летнее настроение.",
        "A gentle milkshake with sweet strawberries. A bright berry taste, soft creamy texture and a true summer mood.",
      ),
    },
    {
      name: t("Rezavorli", "Ягодный", "Berry"),
      price: 40000,
      seasonal: true,
      description: t(
        "Pishgan rezavorlarning to‘yingan ta’miga ega nozik sutli kokteyl. Har bir qultumda shirin rezavor aromati va yumshoq qaymoqli tekstura.",
        "Нежный молочный коктейль с насыщенным вкусом спелых ягод. Сладкий ягодный аромат и мягкая сливочная текстура в каждом глотке.",
        "A gentle milkshake with the rich taste of ripe berries. Sweet berry aroma and a soft creamy texture in every sip.",
      ),
    },
    {
      name: t("Malinali", "Малиновый", "Raspberry"),
      price: 35000,
      description: t(
        "Xushbo‘y malinali nozik sutli kokteyl. Har bir qultumda yoqimli rezavor shirinligi va yumshoq qaymoqli tekstura.",
        "Нежный молочный коктейль с ароматной малиной. Приятная ягодная сладость и мягкая сливочная текстура в каждом глотке.",
        "A gentle milkshake with fragrant raspberry. Pleasant berry sweetness and a soft creamy texture in every sip.",
      ),
    },
    {
      name: t("Mangoli", "Манговый", "Mango"),
      price: 40000,
      seasonal: true,
      description: t(
        "Shirali pishgan mangoli nozik sutli kokteyl. Har bir qultumda tropik shirinlik va yumshoq qaymoqli tekstura.",
        "Нежный молочный коктейль с сочным спелым манго. Тропическая сладость и мягкая сливочная текстура в каждом глотке.",
        "A gentle milkshake with juicy ripe mango. Tropical sweetness and a soft creamy texture in every sip.",
      ),
    },
    {
      name: t("Oreo", "Орео", "Oreo"),
      price: 40000,
      description: t(
        "Oreo pecheniyesi bo‘lakchalari qo‘shilgan nozik sutli kokteyl. Sevimli shokoladli pecheniye, qaymoqli ta’m va yoqimli quyuq tekstura.",
        "Нежный молочный коктейль с кусочками печенья Oreo. Любимое шоколадное печенье, сливочный вкус и приятная густая текстура.",
        "A gentle milkshake with pieces of Oreo cookies. The beloved chocolate cookie, a creamy taste and a pleasant thick texture.",
      ),
    },
  ]),

  ...items("smoothies", [
    {
      name: t("Apelsin", "Апельсин", "Orange"),
      price: 35000,
      description: t(
        "Yorqin sitrus ta’mi va yoqimli tetiklantiruvchi notali nozik apelsinli smuzi.",
        "Нежный апельсиновый смузи с ярким цитрусовым вкусом и приятной освежающей ноткой.",
        "A gentle orange smoothie with a bright citrus taste and a pleasant refreshing note.",
      ),
    },
    {
      name: t("Tarvuz", "Арбуз", "Watermelon"),
      price: 30000,
      seasonal: true,
      description: t(
        "Pishgan tarvuzning shirali ta’mi va yengil meva shirinligiga ega tetiklantiruvchi smuzi.",
        "Освежающий смузи с сочным вкусом спелого арбуза и лёгкой фруктовой сладостью.",
        "A refreshing smoothie with the juicy taste of ripe watermelon and a light fruity sweetness.",
      ),
    },
    {
      name: t("Mango", "Манго", "Mango"),
      price: 40000,
      seasonal: true,
      description: t(
        "Pishgan mangoning to‘yingan ta’mi va yoqimli tropik shirinlikka ega nozik smuzi.",
        "Нежный смузи с насыщенным вкусом спелого манго и приятной тропической сладостью.",
        "A gentle smoothie with the rich taste of ripe mango and a pleasant tropical sweetness.",
      ),
    },
    {
      name: t("Qulupnay", "Клубника", "Strawberry"),
      price: 35000,
      seasonal: true,
      description: t(
        "Pishgan qulupnayning yorqin ta’mi va yoqimli meva shirinligiga ega nozik smuzi.",
        "Нежный смузи с ярким вкусом спелой клубники и приятной фруктовой сладостью.",
        "A gentle smoothie with the bright taste of ripe strawberries and a pleasant fruity sweetness.",
      ),
    },
    {
      name: t("Rezavorli", "Ягодный", "Berry"),
      price: 50000,
      seasonal: true,
      description: t(
        "Pishgan rezavorlarning to‘yingan ta’mi va yoqimli tabiiy shirinlikka ega nozik smuzi.",
        "Нежный смузи с насыщенным вкусом спелых ягод и приятной натуральной сладостью.",
        "A gentle smoothie with the rich taste of ripe berries and a pleasant natural sweetness.",
      ),
    },
    {
      name: t("Olmali", "Яблочный", "Apple"),
      price: 30000,
      description: t(
        "Shirali olmaning nozik ta’mi va yengil meva shirinligiga ega tetiklantiruvchi smuzi.",
        "Освежающий смузи с нежным вкусом сочного яблока и лёгкой фруктовой сладостью.",
        "A refreshing smoothie with the gentle taste of juicy apple and a light fruity sweetness.",
      ),
    },
    {
      name: t("Apelsin × kivi", "Апельсин × киви", "Orange × kiwi"),
      price: 50000,
      description: t(
        "Shirali apelsin va yorqin kivining tetiklantiruvchi dueti — shirinlik va nordonlikning yoqimli muvozanati.",
        "Освежающий дуэт сочного апельсина и яркого киви с приятным балансом сладости и кислинки.",
        "A refreshing duo of juicy orange and bright kiwi with a pleasant balance of sweetness and tang.",
      ),
    },
  ]),

  ...items("juices", [
    {
      name: t("Apelsinli", "Апельсиновый", "Orange"),
      price: 60000,
      description: t(
        "Yorqin sitrus ta’mi va yoqimli shirinlikka ega yangi apelsinlardan tabiiy sharbat.",
        "Натуральный сок из свежих апельсинов с ярким цитрусовым вкусом и приятной сладостью.",
        "Natural juice from fresh oranges with a bright citrus taste and pleasant sweetness.",
      ),
    },
    {
      name: t("Olmali", "Яблочный", "Apple"),
      price: 40000,
      description: t(
        "Yumshoq meva ta’mi va yoqimli shirinlikka ega yangi olmalardan tabiiy sharbat.",
        "Натуральный сок из свежих яблок с мягким фруктовым вкусом и приятной сладостью.",
        "Natural juice from fresh apples with a soft fruity taste and pleasant sweetness.",
      ),
    },
    {
      name: t("Sabzili", "Морковный", "Carrot"),
      price: 30000,
      description: t(
        "Yumshoq ta’m va yoqimli tabiiy shirinlikka ega yangi sabzidan tabiiy sharbat.",
        "Натуральный сок из свежей моркови с мягким вкусом и приятной естественной сладостью.",
        "Natural juice from fresh carrots with a soft taste and pleasant natural sweetness.",
      ),
    },
    {
      name: t("Olma × apelsin", "Яблоко × апельсин", "Apple × orange"),
      price: 60000,
      description: t(
        "Shirinlik va sitrus nordonligining uyg‘un birikmasiga ega yangi olma va shirali apelsinlarning tabiiy aralashmasi.",
        "Натуральный микс свежих яблок и сочных апельсинов с гармоничным сочетанием сладости и цитрусовой кислинки.",
        "A natural blend of fresh apples and juicy oranges with a harmonious balance of sweetness and citrus tang.",
      ),
    },
    {
      name: t("Olma × sabzi", "Яблоко × морковь", "Apple × carrot"),
      price: 35000,
      description: t(
        "Yumshoq ta’m va yoqimli tabiiy shirinlikka ega shirali olma va yangi sabzining tabiiy aralashmasi.",
        "Натуральный микс сочных яблок и свежей моркови с мягким вкусом и приятной природной сладостью.",
        "A natural blend of juicy apples and fresh carrots with a soft taste and pleasant natural sweetness.",
      ),
    },
    {
      name: t("Detoks miks", "Детокс микс", "Detox mix"),
      price: 45000,
      description: t(
        "Yangi lavlagi, sabzi va olmaning yorqin uyg‘unligi. Har bir qultumda tabiiy ta’m, yoqimli shirinlik va to‘yingan rang.",
        "Яркое сочетание свежей свёклы, моркови и яблока. Натуральный вкус, приятная сладость и насыщенный цвет в каждом глотке.",
        "A vivid blend of fresh beetroot, carrot and apple. Natural taste, pleasant sweetness and rich colour in every sip.",
      ),
    },
  ]),

  ...items("croissants", [
    {
      name: t("Tovuqli kruassan", "Круассан с курицей", "Chicken croissant"),
      price: 55000,
      description: t(
        "Qaynatilgan tovuq go‘shti, qaymoqli krem-chiz, yangi bodring, pomidor, salat barglari va maxsus sous qo‘shilgan nozik kruassan.",
        "Нежный круассан с отварной курочкой, сливочным крем-чизом, свежими огурцами, помидорами, листьями салата и фирменным соусом.",
        "A tender croissant with boiled chicken, creamy cream cheese, fresh cucumber, tomato, lettuce and our signature sauce.",
      ),
    },
    {
      name: t("Lososli kruassan", "Круассан с лососем", "Salmon croissant"),
      price: 85000,
      description: t(
        "Nozik losos, qaymoqli krem-chiz, yangi salat barglari, avokado va maxsus sous qo‘shilgan qarsildoq kruassan.",
        "Хрустящий круассан с нежным лососем, сливочным крем-чизом, свежими листьями салата, авокадо и фирменным соусом.",
        "A crisp croissant with tender salmon, creamy cream cheese, fresh lettuce, avocado and our signature sauce.",
      ),
    },
    {
      name: t("Tunetsli kruassan", "Круассан с тунцом", "Tuna croissant"),
      price: 60000,
      description: t(
        "Nozik tunets, mo‘l qaymoqli krem-chiz, pishgan avokado, yangi bodring va salat barglari qo‘shilgan qarsildoq kruassan.",
        "Хрустящий круассан с нежным тунцом, щедрой порцией сливочного крем-чиза, спелым авокадо, свежим огурцом и листьями салата.",
        "A crisp croissant with tender tuna, a generous layer of cream cheese, ripe avocado, fresh cucumber and lettuce.",
      ),
    },
    {
      name: t("Avokadoli kruassan", "Круассан с авокадо", "Avocado croissant"),
      price: 60000,
      description: t(
        "Butun pishgan avokado, mo‘l qaymoqli krem-chiz, yangi salat barglari va maxsus sous qo‘shilgan qarsildoq kruassan.",
        "Хрустящий круассан с целым спелым авокадо, щедрой порцией сливочного крем-чиза, свежими листьями салата и фирменным соусом.",
        "A crisp croissant with a whole ripe avocado, a generous layer of cream cheese, fresh lettuce and our signature sauce.",
      ),
    },
  ]),

  ...items("toasts", [
    {
      name: t("Klassik", "Классический", "Classic toastie"),
      price: 20000,
      description: t(
        "Nozik pishloq va shirali yangi pomidor bo‘lakchalari bilan qarsildoq qovurilgan non. Har kun uchun oddiy va mazali uyg‘unlik.",
        "Хрустящий поджаренный хлеб с нежным сыром и сочными ломтиками свежего помидора. Простое и вкусное сочетание на каждый день.",
        "Crispy toasted bread with soft cheese and juicy slices of fresh tomato. A simple, tasty combination for every day.",
      ),
    },
    {
      name: t("Tovuqli", "Куриный", "Chicken toastie"),
      price: 30000,
      description: t(
        "Nozik tovuq go‘shti va ishtahaochar to‘ldirmali qarsildoq qovurilgan non. Kunning istalgan lahzasi uchun to‘yimli va mazali tamaddi.",
        "Хрустящий поджаренный хлеб с нежной курочкой и аппетитной начинкой. Сытный и вкусный перекус на любой момент дня.",
        "Crispy toasted bread with tender chicken and an appetising filling. A hearty, tasty snack for any time of day.",
      ),
    },
    {
      name: t("Tunetsli", "С тунцом", "Tuna toastie"),
      price: 40000,
      description: t(
        "Nozik tunets va ishtahaochar to‘ldirmali qarsildoq qovurilgan non. To‘yingan ta’mli yengil va to‘yimli tamaddi.",
        "Хрустящий поджаренный хлеб с нежным тунцом и аппетитной начинкой. Лёгкий и сытный перекус с насыщенным вкусом.",
        "Crispy toasted bread with tender tuna and an appetising filling. A light yet hearty snack with a rich taste.",
      ),
    },
  ]),
];

export function createSeedDoc(): MenuDoc {
  return {
    version: 1,
    categories,
    items: menuItems,
    settings: {
      phone: "+998 88 973 20 27",
      instagram: "https://www.instagram.com/mycoffee_bydilim/",
      hours: {
        weekdays: { open: "08:00", close: "00:00" },
        sunday: { open: "10:00", close: "23:00" },
      },
      seasonMode: "auto",
      weatherEffects: true,
    },
    updatedAt: new Date(0).toISOString(),
  };
}
