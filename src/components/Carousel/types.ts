export type CarouselData = {
  image: string;
  title: string;
  count: number;
};

export type CarouselProps = {
  data: CarouselData[];
  defaultIndex?: number;
  onCardClick: (title: string) => void;
};
