type LayoutProps = {
  children: React.ReactNode;
};
export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="py-4 px-6 mx-auto max-w-screen-xl min-h-dvh min-w-screen pt-24">
      {children}
    </div>
  );
};
