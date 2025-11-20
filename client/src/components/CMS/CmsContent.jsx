import React from 'react';
import ProfileAdmin from './AdminDashboard';
import AddProduct from './AddProduct';
import ManageOrder from './ManageOrder';
import ManageUser from './ManageUser';
import { useParams } from 'react-router-dom'
import ProductList from './ProductList';
import AdminDashboard from './AdminDashboard'

function CmsContent() {
  const { content } = useParams();
  const contentStyle = "bg-white rounded-xl h-screen overflow-y-auto w-full p-6 rounded-xl mb-24 md:mb-0";

  switch (content) {
    case "dashboard":
      return <div className={contentStyle}><AdminDashboard /></div>;
    case "add-product":
      return <div className={contentStyle}><AddProduct /></div>;
    case "manage-orders":
      return <div className={contentStyle}><ManageOrder /></div>;
    case "user-list":
      return <div className={contentStyle}><ManageUser /></div>;
    case "product-list":
      return <div className={contentStyle}><ProductList /></div>;
    default:
      return <div className={contentStyle}><AdminDashboard/></div>;
  }

}

export default CmsContent
