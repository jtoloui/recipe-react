type LayoutProps = {
  children: React.ReactNode;
};
export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="py-4 px-6 mx-auto bg-lightBg-500 min-h-screen min-w-screen">
      {children}
    </div>
  );
};
