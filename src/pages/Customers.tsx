import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Search, Plus, Edit, Trash2, X, Users, SearchIcon, UsersIcon } from 'lucide-react';
import { addCustomer, Customer, deleteCustomer, fetchCustomers, updateCustomer } from '../store/slice/CustomerSlice';
import Swal from 'sweetalert2';

const Customers: React.FC = () => {
  const dispatch = useDispatch();
  const { customers } = useSelector((state: RootState) => state.customer);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState({
    _id: '',
    name: '',
    email: '',
    telephone: '',
    createdAt: '',
    updatedAt: '',
    __v: 0,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchCustomers() as any)
  },
    [dispatch]);

  const filteredCustomers = customers.filter(
    (customer) =>
      (customer.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (customer.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (customer.telephone || '').includes(searchTerm)
  );

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setCurrentCustomer(customer);
      setIsEditing(true);
    } else {
      setCurrentCustomer({
        _id: '',
        name: '',
        email: '',
        telephone: '',
        createdAt: '',
        updatedAt: '',
        __v: 0,
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCustomer({
      _id: '',
      name: '',
      email: '',
      telephone: '',
      createdAt: '',
      updatedAt: '',
      __v: 0,
    })
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentCustomer.name || !currentCustomer.email || !currentCustomer.telephone) {
      alert('Please fill all fields');
      return;
    }

    if (isEditing && currentCustomer._id) {
      await dispatch(updateCustomer(currentCustomer as Customer) as any);
    } else {
      await dispatch(addCustomer(currentCustomer) as any);
    }

    handleCloseModal();

    await dispatch(fetchCustomers() as any);
  };

  const handleDelete = async (_id: string) => {
    const result = await Swal.fire({
      title: 'Delete Customer?',
      text: "This action cannot be undone!",
      icon: 'warning',
      background: '#2a1a1f',
      color: '#c4a287',
      iconColor: '#d4b59b',
      showCancelButton: true,
      confirmButtonColor: '#6F4E37',
      cancelButtonColor: '#3e2d34',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-xl border border-[#3e2d34]',
        confirmButton: 'px-4 py-2 font-medium',
        cancelButton: 'px-4 py-2 font-medium'
      }
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteCustomer(_id) as any);
        await dispatch(fetchCustomers() as any);

        Swal.fire({
          title: 'Deleted!',
          text: 'Customer has been deleted.',
          icon: 'success',
          background: '#2a1a1f',
          color: '#c4a287',
          iconColor: '#a3c4a2',
          confirmButtonColor: '#6F4E37',
          customClass: {
            popup: 'rounded-xl border border-[#3e2d34]'
          }
        });
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete customer',
          icon: 'error',
          background: '#2a1a1f',
          color: '#c4a287',
          iconColor: '#e8b4b4',
          confirmButtonColor: '#6F4E37'
        });
      }
    }
  };

  return (
    <div className="dashboard-container space-y-6 bg-[#2a1a1f]/90 backdrop-blur-sm border border-[#3e2d34]/50 p-6 rounded-2xl shadow-lg shadow-[#3e2d34]/20">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#c4a287] flex items-center">
            <Users className="w-6 h-6 mr-2" />
            Customer Management
          </h1>
          <p className="text-sm text-[#7a6a5f]">Total {customers.length} registered customers</p>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#7a6a5f]" />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 bg-[#2a1a1f] border border-[#3e2d34] text-[#c4a287] rounded-lg w-full placeholder-[#7a6a5f] focus:outline-none focus:ring-1 focus:ring-[#c4a287]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-[#6F4E37] hover:bg-[#8B6B4F] text-[#F5F5F5] font-medium rounded-lg flex items-center transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden md:inline">Add Customer</span>
          </button>
        </div>
      </div>

      <div className="border border-[#3e2d34] rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-[#3e2d34]">
          <thead className="bg-[#2a1a1f]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#c4a287] uppercase tracking-wider">NAME</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#c4a287] uppercase tracking-wider">EMAIL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#c4a287] uppercase tracking-wider">PHONE</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-[#c4a287] uppercase tracking-wider">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3e2d34]/50 bg-[#2a1a1f]/80">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer._id} className='hover:bg-[#3e2d34]/30 transition-colors'>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#c4a287]">{customer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#c4a287]">{customer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#c4a287]">{customer.telephone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                    <button
                      onClick={() => handleOpenModal(customer)}
                      className="p-1.5 bg-[#3e2d34] rounded-md hover:bg-[#6F4E37] text-[#c4a287] transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(customer._id)}
                      className="p-1.5 bg-[#3e2d34] rounded-md hover:bg-red-900/50 text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center">
                  <div className="text-[#7a6a5f] flex flex-col items-center">
                    <SearchIcon className="w-8 h-8 mb-2" />
                    No customers found
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1E130C]/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#2A1A1F] border-2 border-[#3E2D34] rounded-xl w-full max-w-md shadow-lg shadow-[#3E2D34]/30">
            <div className="flex justify-between items-center p-6 border-b border-[#3E2D34]">
              <h2 className="text-xl font-bold text-[#C4A287] flex items-center">
                <Users className="w-5 h-5 mr-2" />
                {isEditing ? 'Edit Customer' : 'Add Customer'}
              </h2>
              <button onClick={handleCloseModal} className="text-[#7A6A5F] hover:text-[#C4A287] transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='p-6'>
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#C4A287] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={currentCustomer.name}
                    onChange={(e) => setCurrentCustomer({ ...currentCustomer, name: e.target.value })}
                    className="w-full px-4 py-2 bg-[#2A1A1F] border border-[#3E2D34] text-[#F5F5F5] rounded-lg focus:ring-1 focus:ring-[#C4A287] focus:border-transparent placeholder-[#7A6A5F]"
                    placeholder='Jhon Doe'
                    required
                  />
                </div>
                {!isEditing && (
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#C4A287] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={currentCustomer.email}
                      onChange={(e) => setCurrentCustomer({ ...currentCustomer, email: e.target.value })}
                      className="w-full px-4 py-2 bg-[#2A1A1F] border border-[#3E2D34] text-[#F5F5F5] rounded-lg focus:ring-1 focus:ring-[#C4A287] focus:border-transparent placeholder-[#7A6A5F]"
                      placeholder='customer@example.com'
                      required
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="telephone" className="block text-sm font-medium text-[#C4A287] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={currentCustomer.telephone}
                    onChange={(e) => setCurrentCustomer({ ...currentCustomer, telephone: e.target.value })}
                    className="w-full px-4 py-2 bg-[#2A1A1F] border border-[#3E2D34] text-[#F5F5F5] rounded-lg focus:ring-1 focus:ring-[#C4A287] focus:border-transparent placeholder-[#7A6A5F]"
                    required
                  />
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#6F4E37] hover:bg-[#8B6B4F] text-[#F5F5F5] font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  {isEditing ? 'Update' : 'Add'} Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
