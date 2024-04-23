import { createAsset, dashboard, logout, payment, profile, withdraw } from '../assets';

export const navlinks = [
  {
    name: 'Dashboard',
    imgUrl: dashboard,
    link: '/',
  },
  {
    name: 'Create Asset',
    imgUrl: createAsset,
    link: '/create-asset',
  },
  {
    name: 'Bought',
    imgUrl: withdraw,
    link: '/bought-asset',
  },
  {
    name: 'Sold',
    imgUrl: profile,
    link: '/profile',
  },
  {
    name: 'Admin',
    imgUrl: payment,
    link: '/admin-page',
  },
];