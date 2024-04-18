import { createAsset, dashboard, logout, payment, profile, withdraw } from '../assets';

export const navlinks = [
  {
    name: 'dashboard',
    imgUrl: dashboard,
    link: '/',
  },
  {
    name: 'asset',
    imgUrl: createAsset,
    link: '/create-asset',
  },
  {
    name: 'withdraw',
    imgUrl: withdraw,
    link: '/bought-asset',
  },
  {
    name: 'profile',
    imgUrl: profile,
    link: '/profile',
  },
  {
    name: 'payment',
    imgUrl: payment,
    link: '/admin-page',
  },
];