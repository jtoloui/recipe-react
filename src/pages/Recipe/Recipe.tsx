import { useLoaderData, useParams } from 'react-router-dom';

export const Recipe = () => {
  const albums = useLoaderData();
  console.log(albums);
  const param = useParams();

  return (
    <div>
      <h1>Recipe </h1>
    </div>
  );
};
