# 💊 MediMate: Generic Medicine Finder

### 🚀 Find Affordable Generic Alternatives to Branded Medicines

Medicines are often **very costly in India**, and yet they are a **necessity** for millions of people. One of the major reasons for this high cost is that branded medicines often include **extra commissions and marketing expenses**, making them unaffordable for common people.

To help overcome this problem, I created **MediMate** — a web application that helps users find **generic alternatives** for branded medicines prescribed by doctors. Generic medicines have the **same composition and effect**, but are **much cheaper**, as they are not promoted through brand-based commissions.

---

## 🩺 About the Project

**MediMate** allows users to:
- Enter the **brand name** of a medicine prescribed by their doctor 
- Instantly get its **generic name** (the affordable alternative) 
- View a **direct search link** for the generic version on **Tata 1mg** - Track their **search history**, so users can revisit previous searches easily 

---

## 🛠️ Tech Stack

| Feature | Technology Used |
|----------|----------------|
| **Frontend** | React + TypeScript + Tailwind CSS |
| **Backend Services** | [Supabase](https://supabase.com) |
| **Authentication** | Supabase Auth (Email/Password) |
| **Database** | Supabase PostgreSQL |
| **API Used** | [RxNav API](https://rxnav.nlm.nih.gov/) (by U.S. National Library of Medicine) |
| **Deployment** | **Vercel** (for frontend hosting) |

---

## ⚙️ How It Works

1. User signs up or logs in (handled by **Supabase Auth**) 
2. User searches for a branded medicine (e.g., *Tylenol*) 
3. The app calls **RxNav API** to:
    - Get the **RxNorm ID** of the medicine 
    - Fetch the **generic equivalent** using that ID 
4. The generic name is used to construct a **Tata 1mg buying link**, which is displayed
5. The user's search term is stored in **Supabase Database** for future history 

---

## 🧪 Example Medicines for Testing

You can test the app using the following medicine names:

| Branded Medicine | Generic Equivalent (Expected) |
|------------------|-------------------------------|
| Tylenol | Acetaminophen |
| Advil | Ibuprofen |
| Lipitor | Atorvastatin |
| Nexium | Esomeprazole |
| Zyrtec | Cetirizine |
| Prozac | Fluoxetine |
| Glucophage | Metformin |
| Singulair | Montelukast |
| Norvasc | Amlodipine |
| Prilosec | Omeprazole |

*(You can try these names in the MediMate search box.)*

---

## 💾 Features Overview

✅ User Authentication (Signup & Login via Supabase) 
✅ Medicine Search using RxNav API 
✅ Generic Name & Tata 1mg Buying Link Display 
✅ User Search History (stored in Supabase) 
✅ Beautiful UI built with React + Tailwind 
✅ Fully Responsive Design 
✅ Hosted on Vercel (Production Ready)

---

## 🚀 Deployment

The project is live and publicly available here: 
👉 **[Find Generic Medicines with MediMate](https://medi-mate-phi.vercel.app/)** ---

## 📚 Future Improvements

- Adding price comparison across online pharmacies 
- Providing doctor recommendations for generic medicines 
- Adding multilingual support (Hindi, English, etc.) 
- Implementing AI-based suggestions for cheaper treatment alternatives 

---

> “Affordable healthcare should not be a privilege — it should be accessible to everyone.”
