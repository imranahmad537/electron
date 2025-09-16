import { useState, useEffect } from "react";
import AddProductModal from "./Modals/AddProductModal";

const AddProduct = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Save product
  const handleSaveProduct = async (product) => {
    await window.api.addProduct(product);
    const updated = await window.api.getProducts();
    setProducts(updated);
  };

  // Load products on mount
  useEffect(() => {
    window.api.getProducts().then((data) => {
      setProducts(data);
    });
  }, []);

  return (
    <div className="py-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Products</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2 rounded-xl bg-green-600 text-white font-medium shadow-md hover:bg-green-700 transition"
        >
          + Add Product
        </button>
        {showModal && (
          <AddProductModal
            onClose={() => setShowModal(false)}
            onSave={handleSaveProduct}
          />
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-800 text-sm uppercase">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Unit Type</th>
                <th className="px-4 py-3">Price/Unit</th>
                <th className="px-4 py-3">Dimensions</th>
                <th className="px-4 py-3">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((prod) => (
                  <tr
                    key={prod.product_id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4">{prod.product_id}</td>
                    <td className="px-4">{prod.name}</td>
                    <td className="px-4">{prod.category}</td>
                    <td className="px-4">{prod.unit_type}</td>
                    <td className="px-4 font-medium">
                      {prod.price_per_unit.toFixed(2)}
                    </td>
                    <td className="px-4">
                      {prod.length && prod.width
                        ? `${prod.length} × ${prod.width} × ${prod.thickness || "—"}`
                        : "—"}
                    </td>
                    <td className="px-4">{prod.stock_quantity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
