type LayoutProps = {
  children: React.ReactNode;
};
export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="py-4 px-6 mx-aut min-h-screen min-w-screen pt-24">
      {children}
    </div>
  );
};
