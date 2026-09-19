import {
  faDesktop,
  faMoon,
  faRightFromBracket,
  faSun,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { Layout } from '@/components/Layout';
import { useTheme, type ThemeMode } from '@/hooks';
import { useProfile } from '@/queries';
import { apiUrl } from '@/utils';

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: typeof faSun }[] =
  [
    { value: 'light', label: 'Light', icon: faSun },
    { value: 'dark', label: 'Dark', icon: faMoon },
    { value: 'system', label: 'System', icon: faDesktop },
  ];

const Panel = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-2xl border border-gray2-400 bg-white-500 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-700">
    <h2 className="text-base font-bold text-black-500 dark:text-white-500">
      {title}
    </h2>
    {description && (
      <p className="mt-1 text-sm text-brownishGrey-600 dark:text-white-600">
        {description}
      </p>
    )}
    <div className="mt-4">{children}</div>
  </section>
);

export const Settings = () => {
  const { mode, setMode } = useTheme();
  const { data } = useProfile();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        apiUrl(`/api/auth/logout`),
        { withCredentials: true }
      );
      if (res.data?.url) {
        window.location.href = `https://${res.data.url}`;
        return;
      }
    } catch {
      // fall through to local redirect
    }
    navigate('/welcome');
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-black-500 dark:text-white-500 md:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-brownishGrey-600 dark:text-white-600">
          Manage your appearance and account.
        </p>
      </div>

      <div className="grid max-w-2xl grid-cols-1 gap-5">
        {/* Appearance */}
        <Panel
          title="Appearance"
          description="Choose how JustCooking looks on this device."
        >
          <div
            role="radiogroup"
            aria-label="Theme"
            className="grid grid-cols-3 gap-2"
          >
            {THEME_OPTIONS.map((opt) => {
              const active = mode === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setMode(opt.value)}
                  className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-sm font-semibold transition-colors ${
                    active
                      ? 'border-green-500 bg-green-500 text-white-500'
                      : 'border-gray2-500 bg-white-500 text-brownishGrey-700 hover:border-green-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white-600'
                  }`}
                >
                  <FontAwesomeIcon icon={opt.icon} className="text-lg" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </Panel>

        {/* Account */}
        <Panel title="Account" description="Your sign-in details.">
          <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-gray2-400 bg-gray2-400 sm:grid-cols-2 dark:border-slate-600 dark:bg-slate-600">
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
                {data?.userName || data?.nickname || '—'}
              </dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => navigate('/settings/change-password')}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray2-500 px-4 py-2 text-sm font-semibold text-brownishGrey-700 transition-colors hover:border-green-400 hover:text-green-600 dark:border-slate-600 dark:text-white-600"
          >
            Change password
          </button>
        </Panel>

        {/* Sign out */}
        <Panel title="Session" description="Sign out of your account.">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white-500 transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/30"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            Sign out
          </button>
        </Panel>
      </div>
    </Layout>
  );
};

export default Settings;
