import React, { useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const AddOrderModal = ({ onClose, onSave }) => {
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [marbleType, setMarbleType] = useState("");       
  const [marbleCategory, setMarbleCategory] = useState(""); 

  const [marbleLength, setMarbleLength] = useState('');    
  const [marbleWidth, setMarbleWidth] = useState('');      

  const [unitPrice, setUnitPrice] = useState('');          
  const [totalAmount, setTotalAmount] = useState(0);      
  const [paidAmount, setPaidAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("FULL"); 

  // Calculate area & total price
  useEffect(() => {
    const area = (marbleLength * marbleWidth) / 144; // sq. ft.
    const total = area * unitPrice;
    setTotalAmount(Number(total.toFixed(2)));
  }, [marbleLength, marbleWidth, unitPrice]);

  // Calculate paid & remaining
  useEffect(() => {
    let paid = paymentStatus === "FULL" ? totalAmount : paidAmount;
    setRemainingAmount(totalAmount - paid);
  }, [totalAmount, paidAmount, paymentStatus]);

  const handleSubmit = () => {
    let paid = paymentStatus === "FULL" ? totalAmount : paidAmount;
    let remaining = totalAmount - paid;
    let status = paymentStatus === "FULL" ? "PAID" : "PARTIAL";

    onSave({
      customerName,
      customerAddress,
      marbleType,
      marbleCategory,
      marbleLength,
      marbleWidth,
      unitPrice,
      totalAmount,
      paidAmount: paid,
      remainingAmount: remaining,
      paymentStatus: status,});
    <ToastContainer position="top-right" autoClose={3000} />
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Add New Order</h2>
          <button                                                         
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
             <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="border w-full rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          </div>
         
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Address
            </label>
           <input
            type="text"
            placeholder="Customer Address"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            className="border w-full rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
         </div>

         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">
              Marble Type
            </label>
           <select
            value={marbleType}
            onChange={(e) => setMarbleType(e.target.value)}
            className="border w-full rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select type</option>
            <option value="Granite">Granite</option>
            <option value="Onyx">Onyx</option>
            <option value="Grey">Grey</option>
          </select>
         </div>
         
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">
              Marble Category
            </label>
           <select
            value={marbleCategory}
            onChange={(e) => setMarbleCategory(e.target.value)}
            className="border w-full rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Category</option>
            <option value="Slab">Slab</option>
            <option value="Tile">Tile</option>
          </select>
         </div>


         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">
              Length (ft) 
            </label>
            <input
            type="number"
            placeholder="Length (inches)"
            value={marbleLength}
            onChange={(e) => setMarbleLength(Number(e.target.value))}
            className="border w-full rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
         </div>
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">
              Width (ft)
            </label>
           <input
            type="number"
            placeholder="Width (inches)"
            value={marbleWidth}
            onChange={(e) => setMarbleWidth(Number(e.target.value))}
            className="border w-full rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          
        </div>
         
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit Price 
            </label>
          <input
            type="number"
            placeholder="Unit Price (per sq.ft)"
            value={unitPrice}
            onChange={(e) => setUnitPrice(Number(e.target.value))}
            className="border w-full rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
         </div>

          
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Status 
            </label>
             <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="border w-full rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="FULL">Full Payment</option>
            <option value="PARTIAL">Partial Payment</option>
          </select>

          </div>
         
          {paymentStatus === "PARTIAL" && (
            <div>
               <label className="block text-sm font-medium text-gray-700">
              Advance Paid 
            </label>
               <input
              type="number"
              placeholder="Advance Paid"
              value={paidAmount}
              onChange={(e) => setPaidAmount(Number(e.target.value))}
              className="border w-full rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            </div>
           
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-lg font-semibold text-gray-800">
              ${totalAmount}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Paid</p>
            <p className="text-lg font-semibold text-green-600">
              {paymentStatus === "FULL" ? totalAmount : paidAmount}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Remaining</p>
            <p className="text-lg font-semibold text-red-600">
              {remainingAmount}
            </p>
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
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            Save Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOrderModal;

// import React, { useEffect, useState } from 'react'

// const AddOrderModal = ({onClose, onSave}) => {
//   const [customerName, setCustomerName] = useState("");
// const [customerAddress, setCustomerAddress] = useState("");
// const [marbleType, setMarbleType] = useState("");       // e.g., "Granite", "Onyx"
// const [marbleCategory, setMarbleCategory] = useState(""); // e.g., "Standard", "Custom"

// // Raw dimensions
// const [marbleLength, setMarbleLength] = useState(0);    // inches
// const [marbleWidth, setMarbleWidth] = useState(0);      // inches
// // const [marbleThickness, setMarbleThickness] = useState(0); // optional

// // Pricing
// const [unitPrice, setUnitPrice] = useState(0);          // price per sq. ft
// const [totalArea, setTotalArea] = useState(0);          // auto-calculated
// const [totalAmount, setTotalAmount] = useState(0);      // auto-calculated
// const [paidAmount, setPaidAmount] = useState(0);
// const [remainingAmount, setRemainingAmount] = useState(0);

// // Payment
// const [paymentStatus, setPaymentStatus] = useState("FULL"); // "FULL", "PARTIAL", "PENDING"

// useEffect(() => {
//   const area = (marbleLength * marbleWidth) / 144;
//   const total = area * unitPrice;
//   setTotalAmount(Number(total.toFixed(2)));
// }, [marbleLength, marbleWidth, unitPrice]);

//   useEffect(() => {
//     let paid = paymentStatus === "FULL" ? totalAmount : paidAmount;
//   setRemainingAmount(totalAmount - paid);
//   },[totalAmount, paidAmount, paymentStatus])


//     const handleSubmit = () => {
//      let paid = paymentStatus === "FULL" ? totalAmount : paidAmount;
//   let remaining = totalAmount - paid;
//   let status = paymentStatus === "FULL" ? "Paid" : "Pending";

//       onSave({
//         customerName, 
//         customerAddress,
//         marbleType,
//         marbleCategory,
//         marbleLength,
//         marbleWidth,
//         unitPrice,
//         totalAmount,
//         paid,
//         remaining,
//         status
//       });
        
//         onClose();
//     }
//   return (

//     <>

//      <div className="modal">
//       <h2>Add Order</h2>
//       <input placeholder="Name" value={customerName} onChange={e=>setCustomerName(e.target.value)} />
//       <input placeholder="Address" value={customerAddress} onChange={e=>setCustomerAddress(e.target.value)} />
    
//        <select value={marbleType} onChange={e=>setMarbleType(e.target.value)}>
//         <option value="Granite">Granite</option>
//         <option value="Grey">Grey</option>
//       </select>
//       <select value={marbleCategory} onChange={e=>setMarbleCategory(e.target.value)}>
//         <option value="Slab">Slab</option>
//         <option value="Tile">Tile</option>
//       </select>
      
//       <input type="number" placeholder="Length" value={marbleLength} onChange={e=>setMarbleLength(Number(e.target.value))} />
//       <input type="number" placeholder="Width" value={marbleWidth} onChange={e=>setMarbleWidth(Number(e.target.value))} />
//       <input type="number" placeholder="Price" value={unitPrice} onChange={e=>setUnitPrice(e.target.value)} />
//       <input type="number" placeholder="Total" value={totalAmount} onChange={e=>setTotalAmount(e.target.value)} />
//        <input type="number" placeholder="Remaining Amount" value={remainingAmount} onChange={e=>setRemainingAmount(e.target.value)} />

//       <select value={paymentStatus} onChange={e=>setPaymentStatus(e.target.value)}>
//         <option value="FULL">Full Payment</option>
//         <option value="PARTIAL">Partial Payment</option>
//       </select>

//       {paymentStatus === "PARTIAL" && (
//         <input type="number" placeholder="Advance Paid" value={paidAmount} onChange={e=>setPaidAmount(Number(e.target.value))} />
//       )}

//       <h3>{totalAmount}</h3>
//       <h3>{paidAmount}</h3>
//       <h3>{remainingAmount}</h3>
//       <button onClick={handleSubmit}>Save Order</button>
//       <button onClick={onClose}>Cancel</button>
//     </div>
    
//       Order Modal
//     </>
//   )
// }

// export default AddOrderModal


// // const [customerName, setCustomerName] = useState("")
//   // const [customerAddress, setCustomerAddress] = useState("")
//   // const [marbleType, setMarbleType] = useState("")
//   // const [marbleLength, setMarbleLength] = useState(0)
//   // const [marbleWidth, setMarbleWidth] = useState(0)
//   // const [price, setPrice] = useState(0)
//   // const [totalAmount, setTotalAmount] = useState("")
//   // const [paidAmount, setPaidAmount] = useState("")
//   // const [remainingAmount, setRemainingAmount] = useState("")
//   // const [paymentStatus, setPaymentStatus] = useState("FULL")
