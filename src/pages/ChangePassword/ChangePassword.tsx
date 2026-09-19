import { faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Layout } from '@/components/Layout';
import { useChangePassword } from '@/queries/useChangePassword';

const inputClass =
  'w-full rounded-lg border border-gray2-500 bg-white-500 px-3 py-2.5 text-sm text-black-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white-500';
const labelClass =
  'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brownishGrey-700 dark:text-white-700';

export const ChangePassword = () => {
  const navigate = useNavigate();
  const { mutate, isPending, isSuccess, error } = useChangePassword();

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (next.length < 8) {
      setLocalError('New password must be at least 8 characters.');
      return;
    }
    if (next !== confirm) {
      setLocalError('New password and confirmation do not match.');
      return;
    }
    mutate(
      { previousPassword: current, proposedPassword: next },
      {
        onSuccess: () => {
          setCurrent('');
          setNext('');
          setConfirm('');
        },
      }
    );
  };

  const shownError = localError ?? (error instanceof Error ? error.message : null);

  return (
    <Layout>
      <button
        type="button"
        onClick={() => navigate('/settings')}
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-brownishGrey-600 transition-colors hover:text-green-600 dark:text-white-600"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        Back to settings
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-black-500 dark:text-white-500 md:text-3xl">
          Change password
        </h1>
        <p className="mt-1 text-sm text-brownishGrey-600 dark:text-white-600">
          Enter your current password and choose a new one.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="max-w-md rounded-2xl border border-gray2-400 bg-white-500 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-700"
      >
        {isSuccess ? (
          <div className="flex items-center gap-3 rounded-lg bg-subtleAccent p-4 text-sm font-semibold text-green-600 dark:bg-slate-600 dark:text-white-500">
            <FontAwesomeIcon icon={faCheck} />
            Password changed successfully.
          </div>
        ) : null}

        <div className="mt-1">
          <label htmlFor="current" className={labelClass}>
            Current password
          </label>
          <input
            id="current"
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div className="mt-4">
          <label htmlFor="next" className={labelClass}>
            New password
          </label>
          <input
            id="next"
            type="password"
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div className="mt-4">
          <label htmlFor="confirm" className={labelClass}>
            Confirm new password
          </label>
          <input
            id="confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        {shownError && (
          <p className="mt-3 text-sm font-medium text-red-500">{shownError}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-green-500 px-5 py-2 text-sm font-bold text-white-500 shadow-sm transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? 'Saving…' : 'Update password'}
        </button>
      </form>
    </Layout>
  );
};

export default ChangePassword;
