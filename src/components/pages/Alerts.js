import React, { useContext, useEffect, useState } from 'react';
import { DContext } from '../../context/Datacontext';
import LoadingPage from './Loading';

function Alerts() {
  const { BeURL } = useContext(DContext);
  const [logistics, setLogistics] = useState([]);
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);

  // Fetch shops from API
  const fetchShops = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BeURL}/fetch-all-logistics`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setLogistics(data.logistics);
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


  // Dummy action handlers; replace with proper navigation/logic as needed.
//   const handleView = (shopId) => {
//     window.location.href = `/shop/${shopId}`;
//   };


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this logistics?")) {
      try {
        const res = await fetch(`${BeURL}/delete-logistics/${id}`, {
          method: 'DELETE',
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          alert(data.message);
          fetchShops();
        } else {
          alert(data.message || "Failed to delete logistics");
        }
      } catch (err) {
        console.error("Error in deleting logistics:", err);
        alert("Trouble connecting to the server, please try again later.");
      }
    }
  };

  console.log("logistics:",alert)

  if(!logistics){
    return <LoadingPage/>
  }

  return (
    <div className="py-2 container">
      <div className="d-flex gap-2 justify-content-between align-items-center p-3">
        <h2>Alerts</h2>
      </div>
      
      {/* Search and Filter */}
      {/* <div className="mb-3 row">
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
      </div> */}

      {/* Shops Table */}
      {loading ? (
        <div className="text-center">Loading Alerts...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>S. No.</th>
                <th>Shop ID</th>
                <th className='lg-col'>Created At</th>
                <th className='lg-col'>Product</th>
                <th className='lg-col'>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {logistics.length > 0 ? (
                logistics.map((shop, i) => (
                  <tr key={shop._id}>
                    <td>{i+1}</td>
                    <td>{shop.shopId}</td>
                    <td className='lg-col'>{new Date(shop.createdAt).toLocaleString()}</td>
                    <td>{shop.product.toUpperCase()}</td>
                    <td className='lg-col'>{shop.status}</td>
                    <td className='d-flex justify-content-start align-items-center flex-wrap gap-1'>
                        <i className="bi bi-eye fs-5 text-" role='button' onClick={() => setAlert(shop)} data-bs-toggle="modal" data-bs-target="#exampleModal" title="View"></i>
                        <i className="bi bi-trash fs-5 text-danger" role='button' onClick={() => handleDelete(shop.id)} title="Delete"></i>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No Alerts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Alert Details</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    {
                        alert?(
                            <ul>
                                <li><b>Id:</b> {alert.id}</li>
                                <li><b>Created At:</b> {new Date(alert.createdAt).toLocaleString()}</li>
                                <li><b>Shop Id:</b> {alert.shopId}</li>
                                <li><b>Product:</b> {alert.product}</li>
                                <li><b>Quantity:</b> {alert.quantity}</li>
                                <li><b>Price:</b> {alert.price}</li>
                                <li><b>Acknowledgement status:</b> {alert.acknowledgement===true?"Confirmed":"Reported"}</li>
                                <li><b>Status:</b> {alert.status}</li>
                            </ul>
                        )
                        :
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    }
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
                    {/* <button type="button" class="btn btn-primary">Save changes</button> */}
                </div>
                </div>
            </div>
        </div>

    </div>
  );
}

export default Alerts;
