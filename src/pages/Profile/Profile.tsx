import { Layout } from '@/components/Layout';
import { useProfile } from '@/queries';

const initials = (name?: string) =>
  (name || '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('') || '?';

export const Profile = () => {
  const { data, isLoading } = useProfile();

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-black-500 dark:text-white-500">
          Profile
        </h1>
        <p className="mt-1 text-sm text-brownishGrey-600 dark:text-white-600">
          Your JustCooking account.
        </p>
      </div>

      <div className="max-w-2xl rounded-2xl border border-gray2-400 bg-white-500 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-700">
        {isLoading ? (
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 animate-pulse rounded-full bg-gray2-300 dark:bg-slate-600" />
            <div className="space-y-2">
              <div className="h-4 w-40 animate-pulse rounded bg-gray2-300 dark:bg-slate-600" />
              <div className="h-3 w-56 animate-pulse rounded bg-gray2-200 dark:bg-slate-600" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-green-500 text-xl font-extrabold text-white-500 shadow-sm">
                {initials(data?.name)}
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold text-black-500 dark:text-white-500">
                  {data?.name || 'Unnamed cook'}
                </h2>
                {data?.nickname && data.nickname !== data.name && (
                  <p className="truncate text-sm text-brownishGrey-600 dark:text-white-600">
                    @{data.nickname}
                  </p>
                )}
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-gray2-400 bg-gray2-400 sm:grid-cols-2 dark:border-slate-600 dark:bg-slate-600">
              <div className="bg-white-500 p-4 dark:bg-slate-700">
                <dt className="text-xs font-bold uppercase tracking-wider text-brownishGrey-600">
                  Email
                </dt>
                <dd className="mt-1 truncate text-sm font-medium text-black-500 dark:text-white-500">
                  {data?.email || '—'}
                </dd>
              </div>
              <div className="bg-white-500 p-4 dark:bg-slate-700">
                <dt className="text-xs font-bold uppercase tracking-wider text-brownishGrey-600">
                  Username
                </dt>
                <dd className="mt-1 truncate text-sm font-medium text-black-500 dark:text-white-500">
                  {data?.nickname || '—'}
                </dd>
              </div>
            </dl>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
