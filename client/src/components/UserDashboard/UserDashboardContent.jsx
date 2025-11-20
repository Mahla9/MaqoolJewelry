import React from 'react';
import { useParams } from 'react-router-dom';
import UserProfile from './UserProfile';
import UserOrders from './UserOrders';
import Wishlist from './Wishlist';
import UserShipping from './UserShipping'


function UserDashboardContent() {
    const {content} = useParams();
    const style = 'h-full w-full p-6 overflow-y-auto border border-slate-300 rounded-xl'
    switch(content) {
        case 'profile':
            return <div className={style}><UserProfile /></div>;
        case 'user-orders':
            return <div className={style}><UserOrders /></div>;
        case 'user-shipping':
            return <div className={style}><UserShipping /></div>;
        case 'wishlist':
            return <div className={style}><Wishlist /></div>;
        default:
            return <UserProfile />;
      }

}

export default UserDashboardContent
