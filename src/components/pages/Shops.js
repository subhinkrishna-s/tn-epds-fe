import React, { useContext, useEffect, useState } from 'react';
import { DContext } from '../../context/Datacontext';

function Shops() {
  const { BeURL } = useContext(DContext);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch shops from API
  const fetchShops = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BeURL}/fetch-shops`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setShops(data.shops);
      } else {
        alert(data.message || "Failed to fetch shops");
      }
    } catch (err) {
      console.error("Error in fetching shops:", err);
      alert("Trouble connecting to the server, please try again later.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchShops();
  }, [BeURL]);

  // Filter shops by search text - checking all fields (shopId, shopName, address, etc)
  const filteredShops = shops.filter((shop) => {
    const searchLower = search.toLowerCase();
    return (
      shop.shopId.toLowerCase().includes(searchLower) ||
      shop.shopName.toLowerCase().includes(searchLower) ||
      (shop.address && shop.address.toLowerCase().includes(searchLower))
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredShops.length / itemsPerPage);
  const paginatedShops = filteredShops.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers for pagination
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Dummy action handlers; replace with proper navigation/logic as needed.
  const handleView = (shopId) => {
    window.location.href = `/shop/${shopId}`;
  };

  const handleEdit = (shopId) => {
    window.location.href = `/update-shop/${shopId}`;
  };

  const handleDelete = async (shopId) => {
    if (window.confirm("Are you sure you want to delete this shop?")) {
      try {
        const res = await fetch(`${BeURL}/delete-shop/${shopId}`, {
          method: 'DELETE',
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          alert("Shop deleted successfully.");
          fetchShops();
        } else {
          alert(data.message || "Failed to delete shop");
        }
      } catch (err) {
        console.error("Error in deleting shop:", err);
        alert("Trouble connecting to the server, please try again later.");
      }
    }
  };

  return (
    <div className="py-2 container">
      <div className="d-flex gap-2 justify-content-between align-items-center p-3">
        <h2>Shops</h2>
        <button className="btn btn-primary" onClick={() => window.location.href="/create-shop"}>Create Shop</button>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-3 row">
        <div className="col-md-4">
          <input
            type="search"
            className="form-control"
            placeholder="Search shops..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Shops Table */}
      {loading ? (
        <div className="text-center">Loading shops...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>S. No.</th>
                <th>Shop ID</th>
                <th className='lg-col'>Shop Name</th>
                <th>Address</th>
                <th className='lg-col'>Items Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedShops.length > 0 ? (
                paginatedShops.map((shop, i) => (
                  <tr key={shop._id}>
                    <td>{i+1}</td>
                    <td>{shop.shopId}</td>
                    <td className='lg-col'>{shop.shopName}</td>
                    <td>{shop.address}</td>
                    <td className='lg-col'>{shop.items ? shop.items.length : 0}</td>
                    <td className='d-flex justify-content-start align-items-center flex-wrap gap-1'>
                        <i className="bi bi-eye fs-5 text-" role='button' onClick={() => handleView(shop.shopId)} title="View"></i>
                        <i className="bi bi-pencil fs-5 text-warning" role='button' onClick={() => handleEdit(shop.shopId)} title="Edit"></i>
                        <i className="bi bi-trash fs-5 text-danger" role='button' onClick={() => handleDelete(shop.shopId)} title="Delete"></i>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No shops found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => goToPage(currentPage - 1)}>Previous</button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                <button className="page-link" onClick={() => goToPage(page)}>{page}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => goToPage(currentPage + 1)}>Next</button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export default Shops;
