# MoneyWise Myanmar — Financial Literacy for Everyone

မြန်မာဘာသာ၊ လက်တွေ့ဘဝဥပမာနှင့် ရိုးရှင်းသောတွက်ချက်မှုများဖြင့် Financial Literacy ကို လူတိုင်းအလွယ်တကူလေ့လာနိုင်သော interactive static web application ဖြစ်ပါတယ်။

- **Live Preview / ChatGPT Site:** https://financial-literacy-workflow.fmgimuzuljb.chatgpt.site *(Note: ChatGPT Site link may require private/workspace authorization depending on session permissions)*
- **Cloudflare Pages Production URL (Placeholder):** `https://moneywise-myanmar.pages.dev` (or your custom domain)

## Main Learning Workflow

**ရ → စီမံ → သုံး → စု → ကာ → ဆပ် → ပွား → မျှ**

1. **ဝင်ငွေရှာ — Earn:** ကိုယ်ပိုင်ကျွမ်းကျင်မှုဖြင့် ရိုးသားစွာ ဝင်ငွေရှာဖွေခြင်း
2. **ငွေကိုစီမံ — Plan:** မသုံးစွဲမီ Budget ရည်ရွယ်ချက်ခွဲဝေခြင်း
3. **သတိရှိစွာသုံး — Spend:** Needs နှင့် Wants စိစစ်ခွဲခြားခြင်း
4. **အနာဂတ်အတွက်စု — Save:** ဝင်ငွေရသည်နှင့် စုငွေကို အရင်ဖယ်ထားခြင်း
5. **အန္တရာယ်မှကာကွယ် — Protect:** Emergency Fund နှင့် လုံခြုံရေးသတိပြုမှု တည်ဆောက်ခြင်း
6. **အကြွေးကိုစီမံ — Manage Debt:** အတိုးနှင့် စုစုပေါင်းကုန်ကျစရိတ် သိရှိစီမံခြင်း
7. **အကျိုးရှိစွာပွား — Grow:** နားလည်သော ရင်းနှီးမြှုပ်နှံမှုနှင့် စွမ်းရည်မြှင့်တင်ခြင်း
8. **တာဝန်ရှိစွာမျှဝေ — Share Responsibly:** တာဝန်မပျက်ဘဲ လူမှုအသိုင်းအဝိုင်းကို မျှတစွာ ကူညီခြင်း

## Key Features

- **Interactive Eight-Step Workflow:** အဆင့်လိုက် ရှင်းလင်းချက်နှင့် Reflection မေးခွန်းများ
- **Monthly Budget Calculator:** ကျန်ငွေ၊ စုငွေနှုန်း၊ Zero-based Budget နှင့် ပညာပေး Validation စနစ်
- **Emergency Fund Target:** မဖြစ်မနေအသုံးစရိတ်အပေါ် အခြေခံ၍ ၁ လ၊ ၃ လ၊ ၆ လစာ ရည်မှန်းချက် တွက်ချက်မှု
- **Real-World Decision Lab:** ဖုန်းအသစ်ဝယ်ယူမှု Scenario နှင့် ရေတို/ရေရှည် အကျိုးဆက် သုံးသပ်ချက်
- **Profit vs Cash Business Case:** စာရင်းအရ Profit နှင့် လက်ထဲကျန်ရှိသော Cash မတူညီပုံကို ရှင်းလင်းစွာ ခွဲခြားဖော်ပြခြင်း
- **AI Freelancer Financial Case Study:** ကိုအောင်၏ လက်တွေ့ ငွေကြေးခွဲဝေမှုနှင့် ၉ လတာ Emergency Fund စီမံကိန်း
- **Educator Toolkit:** သင်ကြားသူများအတွက် အသင့်သုံး ၆၀ မိနစ်စာ Class Flow အစီအစဉ်
- **Accessible & Responsive:** Screen reader အထောက်အကူပြု semantic HTML၊ မြန်မာစာ font rendering နှင့် mobile-friendly layout
- **No API Key / Zero Backend:** Browser ပေါ်တွင်သာ လုံးဝအလုပ်လုပ်ပြီး ကိုယ်ရေးအချက်အလက် မသိမ်းဆည်းပါ

## Local Development

Requirements: Node.js 22 or newer.

```bash
# 1. Install dependencies
npm install

# 2. Start local development server (runs on port 3000)
npm run dev
```

Open `http://localhost:3000` in your browser.

## Run Tests & Lint

```bash
# Run lightweight unit tests (financial logic & formatting)
npm test

# Run TypeScript type check
npm run lint
```

## Production Build & CI

For production or automated CI workflows, use `npm ci` with the included `package-lock.json`:

```bash
# Install exact dependencies
npm ci

# Build static production bundle
npm run build

# Preview production build locally
npm run preview
```

Static production files are compiled directly into the `dist/` directory.

## Deployment Options

See [DEPLOYMENT.md](DEPLOYMENT.md) for full deployment instructions covering:
- **Cloudflare Pages** (Recommended)
- **GitHub Pages** (Automated GitHub Actions workflow included in `.github/workflows/deploy-pages.yml`)
- **Vercel** (`vercel.json` included)
- **Netlify** (`netlify.toml` included)
- **Docker / Cloud Containers** (`Dockerfile` and `nginx.conf` included)
- **AWS S3 + CloudFront**

See [USER_GUIDE.md](USER_GUIDE.md) for the complete Myanmar user guide and educational manual.

## Privacy & Security

- All calculations happen entirely on the client side in browser memory.
- The website never requests, transmits, or stores bank account numbers, card numbers, passwords, PINs, or OTP codes.
- No external tracking scripts, server backends, or third-party API keys are used.

## Disclaimer

This application is created solely for financial literacy and educational purposes. It does not provide personalized investment, tax, legal, insurance, or loan advice.

## License

MIT License. See [LICENSE](LICENSE).
