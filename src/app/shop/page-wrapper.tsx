import { Metadata } from 'next';
import ShopPageClient from './page';

export const metadata: Metadata = {
  title: 'Shop Our Collections - Eclipse',
  description: 'Browse the latest fashion deals and new arrivals.',
};

export default function Page() {
  return <ShopPageClient />;
}