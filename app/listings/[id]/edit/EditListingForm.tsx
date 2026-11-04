'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Trash2, AlertCircle } from 'lucide-react';
import { CATEGORIES, CONDITIONS, CITIES } from '@/lib/utils';

export default function EditListingForm({ listing }: { listing: any }) {
  const router = useRouter();

  const [title, setTitle] = useState(listing.title);
  const [category, setCategory] = useState(listing.category);
  const [condition, setCondition] = useState(listing.condition);
  const [askingPrice, setAskingPrice] = useState(String(listing.askingPrice));
  const [originalPrice, setOriginalPrice] = useState(String(listing.originalPrice));
  const [quantity, setQuantity] = useState(String(listing.quantity));
  const [minLotSize, setMinLotSize] = useState(String(listing.minLotSize));
  const [locationCity, setLocationCity] = useState(listing.locationCity);
  const [status, setStatus] = useState(listing.status);
  const [description, setDescription] = useState(listing.description);

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/listings/${listing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          condition,
          askingPrice,
          originalPrice,
          quantity,
          minLotSize,
          locationCity,
          status,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');

      router.push(`/listings/${listing.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this listing?')) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/listings/${listing.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6 shadow-xs">
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded-xl text-sm font-semibold"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Condition</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
          >
            {CONDITIONS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Listing Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-bold"
          >
            <option value="ACTIVE">ACTIVE (Available for bids)</option>
            <option value="RESERVED">RESERVED (Under negotiation)</option>
            <option value="SOLD">SOLD (Handover completed)</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Asking Price (₹)</label>
          <input
            type="number"
            value={askingPrice}
            onChange={(e) => setAskingPrice(e.target.value)}
            className="w-full px-3 py-2 border rounded-xl text-sm font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Original Price (₹)</label>
          <input
            type="number"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            className="w-full px-3 py-2 border rounded-xl text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-3 py-2 border rounded-xl text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Min Lot Size</label>
          <input
            type="number"
            value={minLotSize}
            onChange={(e) => setMinLotSize(e.target.value)}
            className="w-full px-3 py-2 border rounded-xl text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Description</label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-xl text-xs"
        />
      </div>

      <div className="pt-4 border-t flex items-center justify-between">
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="px-4 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl flex items-center gap-1.5"
        >
          <Trash2 className="w-4 h-4" />
          <span>{deleting ? 'Deleting...' : 'Delete Listing'}</span>
        </button>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-xs font-bold text-slate-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
