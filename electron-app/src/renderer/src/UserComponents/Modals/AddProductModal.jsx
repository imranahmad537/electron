import React, { useState } from "react";

const AddProductModal = ({ onClose, onSave }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(""); // Marble, Granite, Onyx
  const [unitType, setUnitType] = useState(""); // Slab, sq.ft, sq.meter, piece
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [thickness, setThickness] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    onSave({
      name,
      category,
      unit_type: unitType,
      price_per_unit: Number(pricePerUnit),
      length: length ? Number(length) : null,
      width: width ? Number(width) : null,
      thickness: thickness ? Number(thickness) : null,
      stock_quantity: stock ? Number(stock) : 0,
      description,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Add New Product</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              placeholder="e.g. Black Marquina"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border w-full rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border w-full rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Select Category</option>
              <option value="Marble">Marble</option>
              <option value="Granite">Granite</option>
              <option value="Onyx">Onyx</option>
            </select>
          </div>

          {/* Unit Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit Type
            </label>
            <select
              value={unitType}
              onChange={(e) => setUnitType(e.target.value)}
              className="border w-full rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Select Unit</option>
              <option value="slab">Slab</option>
              <option value="sq_ft">Sq. Ft.</option>
              <option value="sq_meter">Sq. Meter</option>
              <option value="piece">Piece</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price per Unit
            </label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={pricePerUnit}
              onChange={(e) => setPricePerUnit(e.target.value)}
              className="border w-full rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Dimensions (only if unit = slab/piece) */}
          {unitType === "slab" || unitType === "piece" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Length (ft)
                </label>
                <input
                  type="number"
                  placeholder="Length"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="border w-full rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width (ft)
                </label>
                <input
                  type="number"
                  placeholder="Width"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="border w-full rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thickness (mm)
                </label>
                <input
                  type="number"
                  placeholder="Thickness"
                  value={thickness}
                  onChange={(e) => setThickness(e.target.value)}
                  className="border w-full rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </>
          ) : null}

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity
            </label>
            <input
              type="number"
              placeholder="e.g. 50"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="border w-full rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Optional details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border w-full rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
