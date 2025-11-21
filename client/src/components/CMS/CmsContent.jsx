// components/CMS/CmsContent.jsx
import { Spin } from 'antd';
import { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';

const AdminDashboard = lazy(() => import('./AdminDashboard'));
const AddProduct = lazy(() => import('./AddProduct'));
const ManageOrder = lazy(() => import('./ManageOrder'));
const ManageUser = lazy(() => import('./ManageUser'));
const ProductList = lazy(() => import('./ProductList'));

function CmsContent() {
  const { content } = useParams();
  const contentStyle = "bg-white rounded-xl h-screen overflow-y-auto w-full p-6 mb-24 md:mb-0";

  const renderContent = () => {
    switch (content) {
      case "dashboard":
        return <AdminDashboard />;
      case "add-product":
        return <AddProduct />;
      case "manage-orders":
        return <ManageOrder />;
      case "user-list":
        return <ManageUser />;
      case "product-list":
        return <ProductList />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className={contentStyle}>
      <Suspense fallback={<Spin fullscreen size='large' />}>
        {renderContent()}
      </Suspense>
    </div>
  );
}

export default CmsContent;