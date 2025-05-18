import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, PackageIcon } from 'lucide-react';
import { RootState } from '../store/store';
import { fetchOrderById } from '../store/slice/orderSlice';
import Select from 'react-select';

const OrderDetails: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedOrder } = useSelector((state: RootState) => state.orders);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const parms = new URLSearchParams(location.search);
    const id = parms.get('id');
    setOrderId(id);

    if (id) {
      dispatch(fetchOrderById(id) as any);
    }
  }, [dispatch, orderId]);

  const handleStatusChange = async (status) => {

  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Package className="h-6 w-6 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  };

  if (!selectedOrder) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-[#2a1a1f]/90 border border-[#3e2d34]/50 rounded-2xl shadow-lg shadow-[#3e2d34]/20">
        <Package className="h-16 w-16 text-[#7a6a5f] mb-4 animate-bounce" />
        <h3 className="text-xl font-medium text-[#c4a287] mb-2">Order Not Found</h3>
        <p className="text-[#7a6a5f] max-w-md text-center px-4">
          No order was selected or the order doesn't exist. Please check the order ID or go back to the orders list.
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 px-6 py-2 bg-[#3e2d34] hover:bg-[#6F4E37] text-[#c4a287] rounded-lg flex items-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-[#2a1a1f]/90 backdrop-blur-sm border border-[#3e2d34]/50 p-6 rounded-2xl shadow-lg shadow-[#3e2d34]/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => window.history.back()}
            className="mr-4 text-[#c4a287] hover:text-[#d4b59b] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-[#c4a287]">Order Details</h1>
        </div>
        <div className={`px-4 py-2 rounded-full ${getStatusClass(selectedOrder.status)} flex items-center border border-[#3e2d34]`}>
          {getStatusIcon(selectedOrder.status)}
          <span className="ml-2 text-sm font-medium capitalize">{selectedOrder.status}</span>
        </div>
      </div>

      <div className="bg-[#2a1a1f] border border-[#3e2d34] rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[#3e2d34]">
          <h3 className="text-lg font-medium text-[#c4a287] flex items-center">
            <PackageIcon className="h-5 w-5 mr-2" />
            Order Information
          </h3>
        </div>
        <div className="px-6 py-4">
          <dl className="divide-y divide-[#3e2d34]">
            <div className="py-4 grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-[#7a6a5f]">Order ID</dt>
              <dd className="text-sm font-bold text-[#c4a287] col-span-2">{selectedOrder._id}</dd>
            </div>
            <div className="py-4 grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-[#7a6a5f]">Date</dt>
              <dd className="text-sm font-bold text-[#c4a287] col-span-2">
                {new Date(selectedOrder.date).toLocaleString()}
              </dd>
            </div>
            <div className="py-4 grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-[#7a6a5f]">Customer</dt>
              <dd className="text-sm font-bold text-[#c4a287] col-span-2">
                {selectedOrder.customerId?.name || 'Unknown'}
              </dd>
            </div>
            <div className="py-4 grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-[#7a6a5f]">Email</dt>
              <dd className="text-sm font-bold text-[#c4a287] col-span-2">
                {selectedOrder.customerId?.email || 'N/A'}
              </dd>
            </div>
            <div className="py-4 grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-[#7a6a5f]">Telephone</dt>
              <dd className="text-sm font-bold text-[#c4a287] col-span-2">
                {selectedOrder.customerId?.telephone || 'N/A'}
              </dd>
            </div>
            <div className="py-4 grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-[#7a6a5f]">Total Amount</dt>
              <dd className="text-sm font-bold text-[#c4a287] col-span-2">
                ${selectedOrder.total.toFixed(2)}
              </dd>
            </div>
            <div className="py-4 grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-[#7a6a5f]">Status</dt>
              <dd className="col-span-2">
                <Select
                  options={[
                    { value: 'pending', label: 'Pending' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'cancelled', label: 'Cancelled' }
                  ]}
                  value={{ value: selectedOrder.status, label: selectedOrder.status }}
                  onChange={(option) => handleStatusChange(option.value)}
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: '#2a1a1f',
                      borderColor: '#3e2d34',
                      color: '#c4a287'
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: '#2a1a1f',
                      borderColor: '#3e2d34'
                    }),
                    option: (base, { isFocused }) => ({
                      ...base,
                      backgroundColor: isFocused ? '#3e2d34' : '#2a1a1f',
                      color: '#c4a287'
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: '#c4a287'
                    })
                  }}
                />
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-[#2a1a1f] border border-[#3e2d34] rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[#3e2d34]">
          <h3 className="text-lg font-medium text-[#c4a287] flex items-center">
            <Truck className="h-5 w-5 mr-2" />
            Order Items
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#3e2d34]">
            <thead className="bg-[#2a1a1f]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#c4a287] uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#c4a287] uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#c4a287] uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#c4a287] uppercase tracking-wider">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3e2d34]/50 bg-[#2a1a1f]/80">
              {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 ? (
                selectedOrder.orderItems.map((orderItem) => (
                  <tr key={orderItem._id} className="hover:bg-[#3e2d34]/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover border border-[#3e2d34]"
                            src={
                              orderItem.itemId?.image ||
                              `https://source.unsplash.com/random/100x100/?coffee`
                            }
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-[#c4a287]">
                            {orderItem.itemId?.name || 'Unknown Item'}
                          </div>
                          <div className="text-sm text-[#7a6a5f]">
                            {orderItem.itemId?.category || 'Unknown Category'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#c4a287]">
                      LKR {orderItem.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#c4a287]">
                      {orderItem.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#c4a287]">
                      LKR {(orderItem.price * orderItem.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-[#7a6a5f]">
                    No items in this order
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-[#2a1a1f] border-t border-[#3e2d34]">
              <tr>
                <th colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-[#c4a287]">
                  Total:
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-[#c4a287]">
                  LKR {selectedOrder.total.toFixed(2)}
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
