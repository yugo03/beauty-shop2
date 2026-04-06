"use client";

import { useState, useEffect } from 'react';

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const fetchItems = async () => {
    try {
      const res = await fetch('https://beauty-shop2-backend-production.up.railway.app/items');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) { setItems([]); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('item[name]', name);
    formData.append('item[price]', price);
    if (image) {
      formData.append('item[image]', image);
    }

    try {
      await fetch('https://beauty-shop2-backend-production.up.railway.app/items', {
        method: 'POST',
        body: formData,
      });
      setName(''); setPrice(''); setImage(null);
      fetchItems();
    } catch (error) { console.error("送信失敗", error); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("削除しますか？")) return;
    try {
     await fetch(`https://beauty-shop2-backend-production.up.railway.app/items/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (error) {}
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-800">
      <header className="mb-10 border-b border-slate-200 bg-white px-10 py-6 shadow-sm">
        <h1 className="text-center text-2xl font-light uppercase tracking-widest text-slate-900">
          BeautyShop <span className="font-bold text-rose-400">Admin</span>
        </h1>
      </header>

      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 md:flex-row">
        {/* 登録フォーム */}
        <section className="w-full md:w-1/3">
          <div className="sticky top-10 rounded-2xl border border-rose-50 bg-white p-6 shadow-lg">
            <h2 className="mb-6 border-l-4 border-rose-300 pl-3 text-lg font-semibold text-slate-700">新規商品登録</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input type="text" placeholder="商品名" value={name} onChange={(e) => setName(e.target.value)} 
                className="w-full rounded-lg border border-slate-200 p-3 text-black focus:ring-2 focus:ring-rose-200" required />
              <input type="number" placeholder="価格" value={price} onChange={(e) => setPrice(e.target.value)} 
                className="w-full rounded-lg border border-slate-200 p-3 text-black focus:ring-2 focus:ring-rose-200" required />
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Product Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-rose-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-rose-700 hover:file:bg-rose-100" />
              </div>
              <button type="submit" className="w-full rounded-lg bg-rose-400 p-3 font-bold text-white shadow-md transition-all hover:bg-rose-500">
                商品を保存する
              </button>
            </form>
          </div>
        </section>

        {/* 商品一覧 */}
        <section className="w-full md:w-2/3">
          <h2 className="mb-6 text-lg font-semibold text-slate-700">在庫リスト</h2>
          <div className="space-y-4">
            {items.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-rose-200">
                <div className="flex items-center gap-4">
                  {/* 画像表示エリア */}
                  <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100 shadow-inner">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[8px] text-slate-400">NO IMAGE</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">{item.name}</h3>
                    <p className="mt-1 text-xs uppercase tracking-tighter text-slate-400">ID: {item.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-mono text-xl font-bold text-rose-500">¥{Number(item.price).toLocaleString()}</span>
                  <button onClick={() => handleDelete(item.id)} className="text-slate-300 transition-colors hover:text-rose-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}