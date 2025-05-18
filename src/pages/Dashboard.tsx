import React, { useEffect, useState } from 'react';
import { Users, ShoppingBag, ClipboardList, TrendingUp, Coffee } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { fetchItems } from '../store/slice/itemSlice';
import { fetchCustomers } from '../store/slice/CustomerSlice';
import { fetchOrders } from '../store/slice/orderSlice';


const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { customers } = useSelector((state: RootState) => state.customer);
  const { items } = useSelector((state: RootState) => state.items);
  const { orders } = useSelector((state: RootState) => state.orders);
  const [categoryItems, setCategoryItems] = useState<Record<string, number>>({});

  useEffect(() => {
    dispatch(fetchItems() as any);
    dispatch(fetchCustomers() as any);
    dispatch(fetchOrders() as any);
    
  }, [dispatch]);

  useEffect(() => {
    const categoryCounts: Record<string, number> = {};
    items.forEach((item) => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    })
    setCategoryItems(categoryCounts);
  }, [items]);

  const stats = [
    { name: 'Total Customers', value: customers.length, icon: <Users className="h-6 w-6 text-blue-500" /> },
    { name: 'Total Items', value: items.length, icon: <ShoppingBag className="h-6 w-6 text-green-500" /> },
    { name: 'Total Orders', value: orders.length, icon: <ClipboardList className="h-6 w-6 text-purple-500" /> },
    {
      name: 'Revenue',
      value: `LKR ${orders.reduce((sum , order) => sum + order.total, 0)}`,
      icon: <TrendingUp className="h-6 w-6 text-yellow-500" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-[#3e2d34] pb-6">
        <h1 className="text-2xl font-bold text-[#c4a287] flex items-center">
          <Coffee className='w-6 h-6 mr-2' /> Barista Dashboard</h1>
        <p className="mt-1 text-sm text-[#7a6a5f]">Welcome to  Admin Panel</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-[#2a1a1f] border border-[#3e2d34] rounded-xl hover:shadow-lg hover:shadow-[#3e2d34]/20 transition">
            <div className="p-5">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-[#3e2d34] text-[#c4a287]">{React.cloneElement(stat.icon, { className: "h-6 w-6"})}</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#7a6a5f]">{stat.name}</p>
                  <p className="text-xl font-semibold text-[#c4a287]">{stat.value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Items by Category */}
      <div className="bg-[#2a1a1f] border border-[#3e2d34] rounded-xl p-6">
        <h2 className="text-lg font-medium text-[#c4a287] mb-4 flex items-center">
          <ShoppingBag className="w-5 h-5 mr-2" />Items by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(categoryItems).map(([category, count]) => (
            <div key={category} className="border border-[#3e2d34] rounded-lg p-3 flex justify-between items-center bg-[#2a1a1f] hover:bg-[#3e2d34]/30 transition">
              <span className="font-medium text-[#c4a287]">{category}</span>
              <span className="bg-[#3e2d34] text-[#c4a287] py-1 px-3 rounded-full text-xs font-bold">
                {count} {count === 1 ? 'item' : 'items'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Items */}
      <div className="bg-[#2a1a1f] border border-[#3e2d34] rounded-xl p-6">
        <h2 className="text-lg font-medium text-[#c4a287] mb-4 flex items-center">
          <ClipboardList className="w-5 h-5 mr-2" />Recent Items</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.slice(0, 8).map((item) => (
            <div key={item._id} className="border border-[#3e2d34] rounded-xl overflow-hidden bg-[#2a1a1f] hover:translate-y-[-4px] transition-transform">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-3">
                <h3 className="font-semibold text-[#c4a287] truncate">{item.name}</h3>
                <p className="text-xs text-[#7a6a5f] uppercase">{item.category}</p>
                <p className="mt-1 font-bold text-[#c4a287]">LKR {item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
