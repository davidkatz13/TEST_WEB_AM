import { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { BASE_URL } from "../apiService";

const AssetOverview = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setEditModal] = useState(false);
  const [assetName, setAssetName] = useState("");
  const [assetCategory, setAssetCategory] = useState("");
  const [assetPrice, setAssetPrice] = useState("");
  const [allAssets, setAllAssets] = useState([]);
  const [rowId, setRowId] = useState();
  const [searchValue, setSearchValue] = useState("");

  console.log("name", assetName);
  console.log("category", assetCategory);
  console.log("price", assetPrice);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleEditModal = () => {
    setEditModal(!showEditModal);
  };

  const fetchAssetData = () => {
    let headers = new Headers();
    headers.append("accept", "application/json");
    headers.append("Content-Type", "application/json");

    fetch(`${BASE_URL}/assets/`, {
      method: "GET",
      headers: headers,
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          setAllAssets(data);
        });
      }
    });
  };

  useEffect(() => {
    fetchAssetData();
  }, []);

  const onSaveAsset = (event) => {
    event.preventDefault();
    let headers = new Headers();
    headers.append("accept", "application/json");
    headers.append("Content-Type", "application/json");

    let requestBody = {
      name: assetName,
      category: assetCategory,
      price: assetPrice,
    };

    fetch(`${BASE_URL}/assets/`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
    }).then((response) => {
      if (response.status === 200) {
        setShowModal(false);
        // refetch data
        fetchAssetData();
        setAssetName();
        setAssetCategory();
        setAssetPrice();
      } else {
        throw new Error("Could not create asset");
      }
    });
  };

  const disabilityCheck = () => {
    if (assetCategory !== "" && assetName !== "" && assetPrice !== "") {
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    disabilityCheck();
  }, [assetName, assetCategory, assetPrice]);

  const onEditAsset = (event) => {
    event.preventDefault();
    let headers = new Headers();
    headers.append("accept", "application/json");
    headers.append("Content-Type", "application/json");

    let requestBody = {
      name: assetName,
      category: assetCategory,
      price: assetPrice,
    };

    fetch(`${BASE_URL}/assets/${rowId}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(requestBody),
    }).then((response) => {
      if (response.status === 200) {
        fetchAssetData();
        toggleEditModal();
        setAssetName();
        setAssetCategory();
        setAssetPrice();
      } else {
        throw new Error("Assets were not updated");
      }
    });
  };

  const onDelete = (assetId) => {
    let headers = new Headers();
    headers.append("accept", "application/json");
    headers.append("Content-Type", "application/json");

    fetch(`${BASE_URL}/assets/${assetId}`, {
      method: "DELETE",
      headers: headers,
    }).then((response) => {
      if (response.status === 200) {
        fetchAssetData();
      }
    });
  };

  const onSearchAsset = (value) => {
    console.log("VALUE", value);
    let headers = new Headers();
    headers.append("accept", "application/json");
    headers.append("Content-Type", "application/json");
    fetch(`${BASE_URL}/assets/category/${value}`, {
      method: "GET",
      headers: headers,
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => setAllAssets(data));
      }
    });
  };

  useEffect(() => {
    if (searchValue.length > 0) {
      onSearchAsset(searchValue);
    } else {
      fetchAssetData();
    }
  }, [searchValue]);

  return (
    <div className={`min-h-screen bg-gray-900 p-8`}>
      <div className="max-w-6xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-white mb-6 text-center">
          Asset List
        </h2>
        <div className="flex items-left justify-self-start mb-2">
          <input
            type="text"
            placeholder="Search by category..."
            className="border border-gray-300 rounded-lg py-2 px-4 w-64 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <table className="w-full text-left text-gray-400">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3">Asset Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allAssets.map((data) => (
              <tr className="border-b border-gray-600">
                <td className="p-3">{data.name}</td>
                <td className="p-3">{data.category}</td>
                <td className="p-3">{`${data.price}`}</td>
                <td className="p-3 text-right">
                  <button
                    className="text-yellow-400 hover:text-yellow-300 mr-3"
                    onClick={() => {
                      toggleEditModal();
                      setRowId(data.id);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-400"
                    onClick={() => onDelete(data.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-6">
          <button
            className="bg-violet-500 hover:bg-violet-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
            onClick={toggleModal}
          >
            Add New Item
          </button>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
          <div className="bg-gray-800 p-8 rounded-lg shadow-md max-w-lg w-full">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              Add New Asset
            </h2>
            <form>
              <div className="space-y-6">
                <div>
                  <label
                    className="block text-white font-medium mb-2"
                    htmlFor="itemName"
                  >
                    Asset Name
                  </label>
                  <input
                    type="text"
                    id="itemName"
                    placeholder="Enter item name"
                    className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    onChange={(e) => setAssetName(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    className="block text-white font-medium mb-2"
                    htmlFor="assetCategory"
                  >
                    Asset Category
                  </label>
                  <input
                    id="assetCategory"
                    placeholder="Enter item description"
                    className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    onChange={(e) => setAssetCategory(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    className="block text-white font-medium mb-2"
                    htmlFor="itemPrice"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    id="itemPrice"
                    placeholder="Enter item price"
                    className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    onChange={(e) => setAssetPrice(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6 space-x-4">
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
                  onClick={toggleModal}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className={`bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded-lg ${
                    disabilityCheck() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  type="submit"
                  onClick={(e) => onSaveAsset(e)}
                  disabled={disabilityCheck()}
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
          <div className="bg-gray-800 p-8 rounded-lg shadow-md max-w-lg w-full">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              Edit Asset
            </h2>
            <form>
              <div className="space-y-6">
                <div>
                  <label
                    className="block text-white font-medium mb-2"
                    htmlFor="itemName"
                  >
                    Asset Name
                  </label>
                  <input
                    type="text"
                    id="itemName"
                    placeholder="Enter item name"
                    className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    onChange={(e) => setAssetName(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    className="block text-white font-medium mb-2"
                    htmlFor="assetCategory"
                  >
                    Asset Category
                  </label>
                  <input
                    id="assetCategory"
                    placeholder="Enter item description"
                    className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    onChange={(e) => setAssetCategory(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    className="block text-white font-medium mb-2"
                    htmlFor="itemPrice"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    id="itemPrice"
                    placeholder="Enter item price"
                    className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    onChange={(e) => setAssetPrice(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6 space-x-4">
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
                  onClick={toggleEditModal}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className={`bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded-lg ${
                    disabilityCheck() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  type="submit"
                  onClick={(e) => onEditAsset(e)}
                  disabled={disabilityCheck()}
                >
                  Update Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetOverview;
