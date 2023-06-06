import { Layout } from '@/components/Layout';
import { useProfile } from '@/queries';

export const Profile = () => {
  const { data } = useProfile();
  return (
    <Layout>
      <h1>Profile</h1>
      <pre>{JSON.stringify(data, undefined, 2)}</pre>
    </Layout>
  );
};
