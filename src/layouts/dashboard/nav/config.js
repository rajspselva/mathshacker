// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Additions',
    path: '/dashboard/additions',
    icon: icon('ic_lock'),
  },
  {
    title: 'Subtractions',
    path: '/dashboard/subtractions',
    icon: icon('ic_lock'),
  },
  {
    title: 'Multiplication',
    path: '/dashboard/multiplication',
    icon: icon('ic_lock'),
  },
  {
    title: 'Two Digit Additions',
    path: '/dashboard/two-digit-additions',
    icon: icon('ic_lock'),
  },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
