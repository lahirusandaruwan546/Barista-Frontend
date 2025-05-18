import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Plus, Minus, X, Check, PrinterCheck } from 'lucide-react';
import { RootState } from '../store/store';
import { fetchCustomers } from '../store/slice/CustomerSlice';
import { fetchItems, Item } from '../store/slice/itemSlice';
import { creatOrder, fetchOrders } from '../store/slice/orderSlice';
import { addToCart, clearCart, removeFromCart, setCustomerId, updateQuantity } from '../store/slice/cartSlice';
import Swal from 'sweetalert2';

const Orders: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customers } = useSelector((state: RootState) => state.customer);
  const { items } = useSelector((state: RootState) => state.items);
  const { orders } = useSelector((state: RootState) => state.orders);
  const { items: cartItems, customerId } = useSelector((state: RootState) => state.cart);

  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [searchItemTerm, setSearchItemTerm] = useState('');

  useEffect(() => {
    dispatch(fetchCustomers() as any);
    dispatch(fetchItems() as any);
    dispatch(fetchOrders() as any);
  }, [dispatch]);

  const filteredOrders = orders.filter((order) => {
    const customer = (order.customerId?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || '';
    const orderId = (order._id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || '';
    const date = (new Date(order.date).toLocaleDateString() || '').includes(searchTerm) || '';
    return customer || orderId || date;
  });

  const filteredItems = items.filter(
    (item) =>
      (item.name?.toLowerCase() || '').includes(searchItemTerm.toLowerCase()) ||
      (item.category?.toLowerCase() || '').includes(searchItemTerm.toLowerCase())
  );

  const handleAddToCart = (item: Item) => {
    dispatch(addToCart(item));
  };

  const handleRemoveFromCart = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(updateQuantity({ itemId, quantity }));
    }
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCustomer(e.target.value);
    dispatch(setCustomerId(e.target.value));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.item.price * item.quantity, 0);
  };

  const handleCreateOrder = async () => {
    if (!selectedCustomer || cartItems.length === 0) {
      alert('Please select a customer and add items to the cart');
      return;
    }

    try {
      const orderItem = cartItems.map((item) => ({
        itemId: item.item._id,
        quantity: item.quantity,
        price: item.item.price
      }))

      await dispatch(
        creatOrder({
          customerId: selectedCustomer, orderItems: orderItem, total: calculateTotal()
        }) as any
      )

      Swal.fire({
        title: 'Order Created!',
        text: 'The order has been successfully placed',
        icon: 'success',
        background: '#2a1a1f',
        color: '#c4a287',
        iconColor: '#a3c4a2',
        confirmButtonColor: '#6F4E37',
        confirmButtonText: 'Great!',
        customClass: {
          popup: 'rounded-xl border border-[#3e2d34] shadow-lg',
          title: 'text-2xl font-[Space_Grotesk]',
          confirmButton: 'px-6 py-2 rounded-lg font-medium'
        },
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      });
      dispatch(clearCart());
      setIsCartOpen(false);
      dispatch(fetchOrders() as any);
      navigate('/orders');

    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order');
    }
  };

  const handleStatusChange = async (orderId: string, status) => {
  };

  const handleViewOrderDetails = (orderId: string) => {
    navigate(`/order-details?id=${orderId}`);
  };

  return (
    <div className="space-y-6 bg-[#2a1a1f]/90 backdrop-blur-sm border border-[#3e2d34]/50 p-6 rounded-2xl shadow-lg shadow-[#3e2d34]/20">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#c4a287] flex items-center">
            <ShoppingCart className="w-6 h-6 mr-2" />
            Order Management
          </h1>
          <p className="text-sm text-[#7a6a5f]">{filteredOrders.length} orders found</p>
        </div>
        <button
          onClick={() => setIsCartOpen(true)}
          className="px-4 py-2 bg-[#6F4E37] hover:bg-[#8B6B4F] text-[#F5F5F5] font-medium rounded-lg flex items-center transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Order {cartItems.length > 0 && `(${cartItems.length})`}
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[#7a6a5f]" />
        </div>
        <input
          type="text"
          placeholder="Search orders..."
          className="pl-10 pr-4 py-2 bg-[#2a1a1f] border border-[#3e2d34] text-[#c4a287] rounded-lg w-full placeholder-[#7a6a5f] focus:outline-none focus:ring-1 focus:ring-[#c4a287]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border border-[#3e2d34] rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-[#3e2d34]">
          <thead className="bg-[#2a1a1f]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#c4a287] uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#c4a287] uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#c4a287] uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#c4a287] uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#c4a287] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-[#c4a287] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3e2d34]/50 bg-[#2a1a1f]/80">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-[#3e2d34]/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#c4a287]">{order._id.substring(0, 8)}...</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#c4a287]">{order.customerId?.name || 'Unknown'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#c4a287]">
                      {new Date(order.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-[#c4a287]">LKR {order.total.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`text-xs rounded-full px-3 py-1 font-medium ${order.status === 'completed' ? 'bg-[#3e2d34] text-[#c4a287] border border-[#6F4E37]' :
                          order.status === 'cancelled' ? 'bg-red-900/30 text-red-400' :
                            'bg-yellow-900/30 text-yellow-400'
                        }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleViewOrderDetails(order._id)}
                      className="text-sm text-[#c4a287] hover:text-[#F5F5F5] hover:underline cursor-pointer"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <div className="text-[#7a6a5f] flex flex-col items-center">
                    <Search className="w-8 h-8 mb-2" />
                    No orders found
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-[#1E130C]/30 backdrop-blur-[1px] z-40">
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[#2a1a1f]/95 border-l border-[#3e2d34] shadow-xl h-screen z-50 overflow-y-auto">
            <div className="flex flex-col bg-[#2a1a1f] border-l border-[#3e2d34] shadow-xl h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#3e2d34]">
                <h2 className="text-xl font-bold text-[#c4a287] flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  New Order
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-[#7a6a5f] hover:text-[#c4a287]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Customer Selection */}
              <div className="p-6 border-b border-[#3e2d34]">
                <label className="block text-sm font-medium text-[#c4a287] mb-2">
                  Select Customer
                </label>
                <select
                  value={selectedCustomer}
                  onChange={handleCustomerChange}
                  className="w-full bg-[#2a1a1f] border border-[#3e2d34] text-[#c4a287] rounded-lg p-2 focus:ring-1 focus:ring-[#c4a287]"
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Item Search */}
              <div className="p-6 border-b border-[#3e2d34]">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Search className="h-5 w-5 text-[#7a6a5f]" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search items..."
                    className="pl-10 w-full bg-[#2a1a1f] border border-[#3e2d34] text-[#c4a287] rounded-lg p-2 focus:ring-1 focus:ring-[#c4a287]"
                    value={searchItemTerm}
                    onChange={(e) => setSearchItemTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Item Grid */}
              <div className="p-6 border-b border-[#3e2d34] h-[40vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  {filteredItems.map((item) => (
                    <div
                      key={item._id}
                      className="border border-[#3e2d34] rounded-lg p-3 hover:bg-[#3e2d34]/30 transition-colors"
                    >
                      <div className="text-sm font-medium text-[#c4a287]">{item.name}</div>
                      <div className="text-xs text-[#7a6a5f]">{item.category}</div>
                      <div className="text-sm font-bold text-[#c4a287] mt-1">LKR {item.price.toFixed(2)}</div>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="mt-2 w-full bg-[#3e2d34] hover:bg-[#6F4E37] text-[#c4a287] text-xs py-1 rounded flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3 mr-1" /> Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Items */}
              <div className="p-6 h-[40vh] overflow-y-auto">
                <h3 className="text-lg font-medium text-[#c4a287] mb-4">Order Items</h3>
                {cartItems.length === 0 ? (
                  <p className="text-[#7a6a5f]">No items in cart</p>
                ) : (
                  <ul className="divide-y divide-[#3e2d34]">
                    {cartItems.map((cartItem) => (
                      <li key={cartItem.item._id} className="py-4">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-[#c4a287]">{cartItem.item.name}</h4>
                            <p className="text-xs text-[#7a6a5f]">{cartItem.item.category}</p>
                          </div>
                          <p className="text-sm font-bold text-[#c4a287]">
                            LKR {(cartItem.item.price * cartItem.quantity).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center border border-[#3e2d34] rounded-lg">
                            <button
                              onClick={() => handleUpdateQuantity(cartItem.item._id, cartItem.quantity - 1)}
                              className="px-2 py-1 text-[#c4a287] hover:bg-[#3e2d34]"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-sm text-[#c4a287]">{cartItem.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(cartItem.item._id, cartItem.quantity + 1)}
                              className="px-2 py-1 text-[#c4a287] hover:bg-[#3e2d34]"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveFromCart(cartItem.item._id)}
                            className="text-xs text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-[#3e2d34]">
                <div className="flex justify-between text-lg font-medium text-[#c4a287] mb-6">
                  <span>Total</span>
                  <span>LKR {calculateTotal().toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCreateOrder}
                  disabled={!selectedCustomer || cartItems.length === 0}
                  className={`w-full py-3 rounded-lg font-medium ${!selectedCustomer || cartItems.length === 0
                      ? 'bg-[#3e2d34] text-[#7a6a5f] cursor-not-allowed'
                      : 'bg-[#6F4E37] hover:bg-[#8B6B4F] text-[#F5F5F5]'
                    }`}
                >
                  <Check className="inline w-5 h-5 mr-2" />
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
