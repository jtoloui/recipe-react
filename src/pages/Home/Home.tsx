import { Carousel } from '@/components/Carousel';

const data = [
  {
    image: 'https://source.unsplash.com/random/800x800?sig=1',
    title: 'Image 1',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=2',
    title: 'Image 2',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=3',
    title: 'Image 3',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=4',
    title: 'Image 4',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=5',
    title: 'Image 5',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=6',
    title: 'Image 6',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=7',
    title: 'Image 7',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=8',
    title: 'Image 8',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=9',
    title: 'Image 9',
  },
  {
    image: 'https://source.unsplash.com/random/800x800?sig=10',
    title: 'Image 10',
  },
];

export const Home = () => {
  return (
    <div className="py-4 px-6 mx-auto bg-lightBg h-screen">
      <h1 className="text-2xl font-bold text-black">Welcome</h1>
      <Carousel data={data} />
    </div>
  );
};
