import { Card } from '@/components/Card';
import { Carousel } from '@/components/Carousel';
import { Layout } from '@/components/Layout';
import { NavLink } from 'react-router-dom';

const data = [
  {
    image: 'https://source.unsplash.com/random/800x800?sig=1',
    title: 'All (12)',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=2',
    title: 'Curry (3)',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=3',
    title: 'Rice (3)',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=4',
    title: 'Noodles (3)',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=5',
    title: 'Beverages (3)',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=6',
    title: 'Indian (3)',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=7',
    title: 'Below 400kcal (3)',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=8',
    title: 'Mexican (3)',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=9',
    title: 'Italian (3)',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=10',
    title: 'Japanese (3)',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=10',
    title: 'Japanese (3)',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=10',
    title: 'Japanese (3)',
  },
];

export const Home = () => {
  return (
    <Layout>
      <div>
        <div className="flex w-full">
          <h1 className="text-2xl font-bold text-black flex-1 ">Welcome</h1>
          <div className="flex justify-end items-center  flex-auto">
            <button className=" border-green  border-2 py-1 px-[0.625rem] rounded">
              <span className="text-green text-sm font-semibold">
                + Create Recipe
              </span>
            </button>
          </div>
        </div>
        <Carousel data={data} />
      </div>
      <div className="w-full rounded-lg bg-white p-5 flex gap-7 flex-wrap ">
        <Card />
        <Card />
        <Card />
      </div>
    </Layout>
  );
};
