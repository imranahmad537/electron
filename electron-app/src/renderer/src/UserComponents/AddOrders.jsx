import { useState, useEffect } from 'react'
import AddOrderModal from './Modals/AddOrderModal'

const AddOrders = () => {
  const [orders, setOrders] = useState([])
  const [showModal, setShowModal] = useState(false)

 
  const handleOrder = async (order) => {
    // get the orders, save the orders ( add, get)
    await window.api.addOrder(order)
  }
 useEffect(() => {
      window.api.getOrders().then((data) => {
      setOrders(data)
    })
  }, [handleOrder])
  return (
    <div className="py-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Orders</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 transition"
        >
          + Add Order
        </button>
        {showModal && <AddOrderModal onClose={() => setShowModal(false)} onSave={handleOrder} />}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-800 text-sm uppercase">
              <tr>
              
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Marble</th>
                <th className="px-4 py-3 ">Dimensions (ft²)</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Remaining</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((ord) => (
                  <tr key={ord.order_id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 ">{ord.order_id}</td>
                    <td className="px-4 ">{ord.customer_name}</td>
                    <td className="px-4">{ord.marble_type} ({ord.marble_category})</td>
                    <td className="px-4">{ord.marble_length * ord.marble_width} (ft²)</td>
                    <td className="px-4 font-medium">{ord.total_amount.toFixed(2)}</td>
                    <td className="px-4  text-green-600">{ord.paid_amount.toFixed(2)}</td>
                    <td className="px-4 text-red-600">{ord.remaining_amount.toFixed(2)}</td>
                    <td className="px-4 text-red-600">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          ord.payment_status === 'PAID'
                            ? 'bg-green-100 text-green-700'
                            : ord.payment_status === 'PARTIAL'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'text-red-600'
                        }`}
                      >
                        {ord.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{ord.created_at}</td>
                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
export default AddOrders
