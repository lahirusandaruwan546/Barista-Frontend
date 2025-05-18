import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';

import { Search, Plus, Edit, Trash2, X, Coffee, SearchIcon } from 'lucide-react';
import { addItem, deleteItem, fetchItems, Item, updateItem } from '../store/slice/itemSlice';
import Swal from 'sweetalert2';

const Items: React.FC = () => {
  const dispatch = useDispatch();
  const { items, categories } = useSelector((state: RootState) => state.items);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    name: '',
    category: categories[0],
    price: 0,
    image: '',
    remark: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchItems() as any)
  },
    [dispatch]);

  const filteredItems = items.filter(
    (item) =>
      (item.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (item?: Item) => {
    if (item) {
      setCurrentItem(item);
      setIsEditing(true)
    } else {
      setCurrentItem({
        name: '',
        category: categories[0],
        price: 0,
        image: '',
        remark: '',
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem({
      name: '',
      category: categories[0],
      price: 0,
      image: '',
      remark: '',
    })
    setIsEditing(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentItem((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentItem.name || !currentItem.category || currentItem.price === undefined) {
      alert("Please fill all the fields");
      return;
    }

    if (isEditing && currentItem._id) {
      await dispatch(updateItem(currentItem as Item) as any);
    } else {
      await dispatch(addItem(currentItem as Item) as any);
    }
    handleCloseModal();

    await dispatch(fetchItems() as any);
  };

  const handleDelete = async (_id: string) => {
    const result = await Swal.fire({
      title: 'Delete Item?',
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
        await dispatch(deleteItem(_id) as any);
        await dispatch(fetchItems() as any);

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
    <div className="space-y-6 bg-[#2a1a1f]/90 backdrop-blur-sm border border-[#3e2d34]/50 p-6 rounded-2xl shadow-lg shadow-[#3e2d34]/20">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#c4a287] flex items-center">
            <Coffee className="w-6 h-6 mr-2" />
            Menu Items
          </h1>
          <p className="text-sm text-[#7a6a5f]">{items.length} total items</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-[#6F4E37] hover:bg-[#8B6B4F] text-[#F5F5F5] font-medium rounded-lg flex items-center transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[#7a6a5f]" />
        </div>
        <input
          type="text"
          placeholder="Search items..."
          className="pl-10 pr-4 py-2 bg-[#2a1a1f] border border-[#3e2d34] text-[#c4a287] rounded-lg w-full placeholder-[#7a6a5f] focus:outline-none focus:ring-1 focus:ring-[#c4a287]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item._id} className="bg-[#2a1a1f] border border-[#3e2d34] rounded-xl overflow-hidden hover:shadow-lg hover:shadow-[#3e2d34]/20 transition-transform hover:-translate-y-1">
              <img
                src={item.image || `https://source.unsplash.com/random/300x200/?furniture,${item.category}`}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-medium text-[#c4a287]">{item.name}</h3>
                <p className="text-sm text-[#7a6a5f] uppercase">{item.category}</p>
                <p className="text-lg font-bold text-[#c4a287] mt-2">LKR {item.price?.toFixed(2)}</p>
                {item.remark && (
                  <p className="text-sm text-[#7a6a5f] mt-2 line-clamp-2">{item.remark}</p>)}
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="p-2 bg-[#3e2d34] rounded-md hover:bg-[#6F4E37] text-[#c4a287] transition-colors"
                    title='Edit'
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 bg-[#3e2d34] rounded-md hover:bg-red-900/50 text-red-400 transition-colors"
                    title='Delete'
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-[#7a6a5f] flex flex-col items-center">
            <SearchIcon className='w-8 h-8 mb-2' />
            No items found
          </div>
        )}
      </div>

      {/* Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1E130C]/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#2A1A1F] border-2 border-[#3E2D34] rounded-xl w-full max-w-md shadow-lg shadow-[#3E2D34]/30">
            <div className="flex justify-between items-center p-6 border-b border-[#3E2D34]">
              <h2 className="text-xl font-bold text-[#C4A287] flex items-center">
                <Coffee className="w-5 h-5 mr-2" />
                {isEditing ? 'Edit Item' : 'Add Item'}
              </h2>
              <button onClick={handleCloseModal} className="text-[#7A6A5F] hover:text-[#C4A287] transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='p-6'>
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#C4A287] mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={currentItem.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#2A1A1F] border border-[#3E2D34] text-[#F5F5F5] rounded-lg focus:ring-1 focus:ring-[#C4A287] focus:border-transparent placeholder-[#7A6A5F]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-[#C4A287] mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={currentItem.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#2A1A1F] border border-[#3E2D34] text-[#F5F5F5] rounded-lg focus:ring-1 focus:ring-[#C4A287] focus:border-transparent"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category} value={category} className="bg-[#2A1A1F]">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-[#C4A287] mb-1">
                    Price (LKR)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={currentItem.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 bg-[#2A1A1F] border border-[#3E2D34] text-[#F5F5F5] rounded-lg focus:ring-1 focus:ring-[#C4A287] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-[#C4A287] mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={currentItem.image}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#2A1A1F] border border-[#3E2D34] text-[#F5F5F5] rounded-lg focus:ring-1 focus:ring-[#C4A287] focus:border-transparent placeholder-[#7A6A5F]"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label htmlFor="remark" className="block text-sm font-medium text-[#C4A287] mb-1">
                    Description
                  </label>
                  <textarea
                    id="remark"
                    name="remark"
                    value={currentItem.remark}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-[#2A1A1F] border border-[#3E2D34] text-[#F5F5F5] rounded-lg focus:ring-1 focus:ring-[#C4A287] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#6F4E37] hover:bg-[#8B6B4F] text-[#F5F5F5] font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  {isEditing ? 'Update' : 'Add'} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Items;
