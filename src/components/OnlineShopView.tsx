import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Search, 
  Layers, 
  Warehouse, 
  Truck, 
  RotateCcw, 
  Users, 
  Plus, 
  Edit, 
  Package, 
  CheckCircle, 
  CheckCircle2, 
  DollarSign,
  Briefcase
} from 'lucide-react';
import { Product, ShopOrder } from '../types';

interface ShopProps {
  products: Product[];
  orders: ShopOrder[];
  onUpdateInventory: (id: string, quantity: number) => void;
  onUpdateOrderStatus: (id: string, status: ShopOrder['status']) => void;
  onAddProduct: (newProduct: Omit<Product, 'id' | 'status'>) => void;
}

export default function OnlineShopView({ 
  products, 
  orders, 
  onUpdateInventory, 
  onUpdateOrderStatus,
  onAddProduct
}: ShopProps) {
  const [subTab, setSubTab] = useState<'Products' | 'Orders' | 'Inventory' | 'Vendors'>('Products');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Plumbing' | 'Electricals' | 'Supplies'>('All');
  const [showProductForm, setShowProductForm] = useState(false);

  // New Product state variables
  const [name, setName] = useState('');
  const [price, setPrice] = useState(300);
  const [quantity, setQuantity] = useState(50);
  const [productCategory, setProductCategory] = useState('Plumbing');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1563453392212-326f5e854473?w=150');
  const [vendor, setVendor] = useState('Asian Pipes & Adhesives');

  // Filtered Products
  const filteredProducts = products.filter(p => {
    if (categoryFilter === 'All') return true;
    return p.category === categoryFilter;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    onAddProduct({
      name,
      category: productCategory,
      price: Number(price),
      quantity: Number(quantity),
      vendor,
      imageUrl
    });

    setName('');
    setShowProductForm(false);
  };

  const shopVendors = [
    { id: 'VND-302', name: 'Asian Pipes & Adhesives', contact: 'Animesh Sen (+91 98822 11223)', catalogSize: 45, itemsSupplied: 1240, status: 'Active' },
    { id: 'VND-105', name: 'Havells Electricals Ltd', contact: 'Ravi Verma (+91 77711 99911)', catalogSize: 110, itemsSupplied: 680, status: 'Active' },
    { id: 'VND-912', name: 'Anchor Coatings Co.', contact: 'Sunita Das (+880 1912-887755)', catalogSize: 25, itemsSupplied: 3410, status: 'Active' }
  ];

  return (
    <div className="space-y-6" id="shop-view-main">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5" id="shop-header">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">
            Online Shop Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Audit inventory assets, catalog listings, parts restocking, & customer order fulfillment
          </p>
        </div>
      </div>

      {/* Grid Subnav tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/60 pb-3" id="shop-segments">
        {[
          { id: 'Products', label: 'Products & Categories', icon: ShoppingBag },
          { id: 'Inventory', label: 'Inventory & Alerts', icon: Warehouse },
          { id: 'Orders', label: 'Orders & Returns Log', icon: Truck },
          { id: 'Vendors', label: 'Vendor Catalogs', icon: Briefcase }
        ].map((tab) => {
          const IconComp = tab.icon;
          return (
            <button
              id={`shop-tab-select-${tab.id}`}
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                subTab === tab.id 
                  ? 'bg-cyan-600 text-slate-950 font-extrabold' 
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <IconComp className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: PRODUCTS & CATEGORIES */}
      {subTab === 'Products' && (
        <div className="space-y-6" id="shop-products-panel">
          <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center gap-2" id="category-filters">
              <span className="text-xs text-slate-400 font-medium font-sans">Filter Category:</span>
              {(['All', 'Plumbing', 'Electricals', 'Supplies'] as const).map(cat => (
                <button
                  id={`cat-filter-btn-${cat}`}
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                    categoryFilter === cat 
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' 
                      : 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              id="btn-toggle-product-creator"
              onClick={() => setShowProductForm(!showProductForm)}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Add Spare Product
            </button>
          </div>

          {showProductForm && (
            <motion.div
              id="product-creator-drawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5"
            >
              <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="product-create-form">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Product Name</label>
                  <input
                    id="prod-input-name"
                    type="text"
                    required
                    placeholder="e.g., PVC Pipe Connector 1/2 inch"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Store Category</label>
                  <select
                    id="prod-input-category"
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 text-xs focus:outline-none"
                  >
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electricals">Electricals</option>
                    <option value="Supplies">Supplies</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Price (₹)</label>
                  <input
                    id="prod-input-price"
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Initial Stock Amount</label>
                  <input
                    id="prod-input-qty"
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Partner Vendor Partner</label>
                  <select
                    id="prod-input-vendor"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 text-xs focus:outline-none"
                  >
                    <option value="Asian Pipes & Adhesives">Asian Pipes & Adhesives</option>
                    <option value="Havells Electricals Ltd">Havells Electricals Ltd</option>
                    <option value="Anchor Coatings Co.">Anchor Coatings Co.</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Image thumbnail URL</label>
                  <input
                    id="prod-input-image"
                    type="text"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs font-mono focus:outline-none"
                  />
                </div>

                <div className="col-span-1 md:col-span-2 lg:col-span-3 pt-2">
                  <button
                    id="btn-product-submit"
                    type="submit"
                    className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs cursor-pointer transition-colors"
                  >
                    Publish Product to Shop Catalog
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="products-catalog-grid">
            {filteredProducts.map(p => (
              <div
                id={`product-card-${p.id}`}
                key={p.id}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-40 bg-slate-950">
                  <img 
                    src={p.imageUrl} 
                    alt={p.name} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                  <span className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[9px] font-bold shadow-md ${
                    p.status === 'In Stock' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : p.status === 'Low Stock' 
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {p.status}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">{p.id} • {p.category}</span>
                  </div>
                  <h4 className="font-semibold text-white text-sm line-clamp-1">{p.name}</h4>
                  <p className="text-[11px] text-slate-500 font-sans truncate">Sourced from: {p.vendor}</p>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-800/60 mt-3">
                    <p className="text-emerald-400 font-black font-mono text-base">₹{p.price}</p>
                    <p className="text-xs text-slate-400 font-mono">{p.quantity} pieces in-bin</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: INVENTORY LOGS */}
      {subTab === 'Inventory' && (
        <div className="space-y-4" id="shop-inventory-panel">
          {/* Low Stock scan & auto-reorder controller */}
          {(() => {
            const lowStockItems = products.filter(p => p.quantity < 15);
            if (lowStockItems.length > 0) {
              return (
                <div className="bg-amber-950/40 border border-amber-500/30 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-slide-in">
                  <div className="flex items-start gap-2 text-xs">
                    <span className="text-xl shrink-0">⚠️</span>
                    <div>
                      <p className="font-bold text-amber-400 uppercase tracking-wider font-mono text-[10px]">Low stock alert warnings / কম স্টক অ্যালার্ট</p>
                      <p className="text-slate-300 mt-1 col-span-none">
                        The trailing spare items are below safe buffer thresholds (15 units): <strong className="text-white">{lowStockItems.map(i => i.name).join(', ')}</strong>.
                      </p>
                    </div>
                  </div>
                  <button
                    id="btn-auto-reorder-trigger"
                    onClick={() => {
                      lowStockItems.forEach(item => {
                        onUpdateInventory(item.id, item.quantity + 50);
                      });
                      alert(`AUTOMATED DISPATCH: Reorder request emails successfully fired to vendors: ${Array.from(new Set(lowStockItems.map(i => i.vendor))).join(', ')}! Assigned quantity bulk refilled (+50 units each).`);
                    }}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-955 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap"
                  >
                    ⚡ Trigger Auto-Reorder Requests
                  </button>
                </div>
              );
            }
            return (
              <div className="bg-emerald-950/20 border border-emerald-500/10 p-3 rounded-xl text-emerald-450 text-[11px] font-sans flex items-center gap-2">
                <span>✓</span> All spare parts catalogs are fully stocked above safety thresholds. No reorders needed!
              </div>
            );
          })()}

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Warehouse className="h-4.5 w-4.5 text-cyan-400" /> Stock Level Matrices & replenishment alerts
              </h3>
            </div>
          <table className="w-full text-left" id="inventory-data-table">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-500 text-xs font-mono">
                <th className="py-3 px-5">Spare Part Name</th>
                <th className="py-3 px-5">Partner Supplier</th>
                <th className="py-3 px-5">Inventory Qty</th>
                <th className="py-3 px-5">Supply Status</th>
                <th className="py-3 px-5 text-right font-semibold">Adjust Stock Level</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-800/60 text-slate-300">
              {products.map((p) => (
                <tr id={`inventory-row-${p.id}`} key={p.id} className="hover:bg-slate-800/10">
                  <td className="py-3.5 px-5 font-semibold text-slate-200 flex items-center gap-2">
                    <Package className="h-4 w-4 text-cyan-400 shrink-0" />
                    <div>
                      <p>{p.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{p.id} • {p.category}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 font-sans text-slate-400">{p.vendor}</td>
                  <td className="py-3.5 px-5 font-bold font-mono text-slate-200">{p.quantity} items</td>
                  <td className="py-3.5 px-5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.status === 'In Stock' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : p.status === 'Low Stock' 
                          ? 'bg-amber-500/10 text-amber-500' 
                          : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right font-sans">
                    <div className="flex gap-1 justify-end">
                      <button
                        id={`btn-stock-down-${p.id}`}
                        onClick={() => onUpdateInventory(p.id, Math.max(0, p.quantity - 5))}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded text-[11px] font-mono cursor-pointer transition-colors"
                        title="Reduce 5 units"
                      >
                        -5
                      </button>
                      <button
                        id={`btn-stock-up-${p.id}`}
                        onClick={() => onUpdateInventory(p.id, p.quantity + 10)}
                        className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded text-[11px] font-bold font-mono cursor-pointer transition-colors"
                        title="Restock 10 units"
                      >
                        +10
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}

      {/* SUB-TAB 3: ORDERS & RETURNS LOG */}
      {subTab === 'Orders' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm animate-fade-in" id="shop-orders-panel">
          <div className="p-4 bg-slate-950/40 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Truck className="h-4.5 w-4.5 text-cyan-400" /> Direct dispatch logs, packing orders, & return requests
            </h3>
          </div>
          <table className="w-full text-left" id="orders-data-table">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-500 text-xs font-mono">
                <th className="py-3 px-5">Order ID / Date</th>
                <th className="py-3 px-5">Client Buyer</th>
                <th className="py-3 px-5">Spare Item</th>
                <th className="py-3 px-5">Qty</th>
                <th className="py-3 px-5">Gross Bill</th>
                <th className="py-3 px-5">Status flag</th>
                <th className="py-3 px-5 text-right font-semibold">Toggle Logistics</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-800/60 text-slate-300">
              {orders.map((o) => (
                <tr id={`order-row-${o.id}`} key={o.id} className="hover:bg-slate-800/10">
                  <td className="py-3.5 px-5 font-mono text-slate-300">
                    <p className="font-bold text-white">{o.id}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{o.date}</p>
                  </td>
                  <td className="py-3.5 px-5 font-medium">{o.customerName}</td>
                  <td className="py-3.5 px-5 text-slate-200 truncate max-w-[150px]">{o.productName}</td>
                  <td className="py-3.5 px-5 font-mono text-slate-400">{o.quantity} units</td>
                  <td className="py-3.5 px-5 font-black text-emerald-400 font-mono">₹{o.totalCost}</td>
                  <td className="py-3.5 px-5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      o.status === 'Delivered' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : o.status === 'Shipped' 
                          ? 'bg-cyan-500/10 text-cyan-400' 
                          : o.status === 'Processing' 
                            ? 'bg-amber-500/10 text-amber-500 animate-pulse' 
                            : 'bg-stone-500/10 text-stone-400'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right font-sans">
                    {o.status === 'Processing' && (
                      <button
                        id={`btn-ship-order-${o.id}`}
                        onClick={() => onUpdateOrderStatus(o.id, 'Shipped')}
                        className="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded text-[10px] cursor-pointer"
                      >
                        Mark Shipped
                      </button>
                    )}
                    {o.status === 'Shipped' && (
                      <button
                        id={`btn-deliver-order-${o.id}`}
                        onClick={() => onUpdateOrderStatus(o.id, 'Delivered')}
                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded text-[10px] cursor-pointer"
                      >
                        Mark Delivered
                      </button>
                    )}
                    {o.status === 'Delivered' && (
                      <button
                        id={`btn-return-order-${o.id}`}
                        onClick={() => onUpdateOrderStatus(o.id, 'Returned')}
                        className="px-2 py-1 bg-slate-850 hover:bg-slate-800 text-rose-400 rounded text-[10px] cursor-pointer border border-slate-800"
                      >
                        Flag Return
                      </button>
                    )}
                    {o.status === 'Returned' && (
                      <span className="text-[10px] text-slate-500 font-mono font-semibold">Inventory Restocked</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SUB-TAB 4: VENDOR CATALOGS */}
      {subTab === 'Vendors' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="shop-vendors-panel">
          {shopVendors.map(vnd => (
            <div key={vnd.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-mono text-slate-500 font-black tracking-widest uppercase">{vnd.id}</span>
                <h4 className="font-bold text-white text-base mt-1">{vnd.name}</h4>
                <p className="text-xs text-slate-400 mt-2 font-mono flex items-center gap-1.5">
                  Contact: <span className="text-slate-300 font-semibold">{vnd.contact}</span>
                </p>
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800/80 text-xs">
                  <div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase font-mono">Catalog Skus</p>
                    <p className="font-extrabold text-white mt-0.5">{vnd.catalogSize} products</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase font-mono">Units Shipped</p>
                    <p className="font-extrabold text-white mt-0.5">{vnd.itemsSupplied.toLocaleString()} parts</p>
                  </div>
                </div>
              </div>

              <button
                id={`btn-vendor-chat-${vnd.id}`}
                onClick={() => alert(`Initiating direct supply ledger chat channel with ${vnd.name}`)}
                className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white font-bold rounded-lg cursor-pointer transition-all"
              >
                Open Vendor Dispatch Ledgers
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
