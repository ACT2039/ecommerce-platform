'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { get, post, delete: deleteApi, loading } = useApi();
  const [categories, setCategories] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await get('/categories');
    if (res?.data) {
      setCategories(res.data);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;

    const res = await post('/categories', { name: newCatName, description: newCatDesc });
    if (res) {
      setNewCatName('');
      setNewCatDesc('');
      fetchCategories();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure? Deleting a category might orphan its products.')) {
      const res = await deleteApi(`/categories/${id}`);
      if (res) fetchCategories();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:col-span-1 h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Category</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Name *</label>
              <input 
                type="text" 
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Electronics"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea 
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                rows={3}
                className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button 
              type="submit"
              disabled={loading || !newCatName}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Create
            </button>
          </form>
        </div>

        {/* List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden md:col-span-2">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {cat.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500 truncate max-w-[200px]">
                      {cat.description || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(cat.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
