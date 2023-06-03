export type CarouselData = {
  image: string;
  title: string;
  count: number;
};

export type CarouselProps = {
  data: CarouselData[];
  onCardClick: (title: string) => void;
};
