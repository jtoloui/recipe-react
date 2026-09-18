type LayoutProps = {
  children: React.ReactNode;
};
export const Layout = ({ children }: LayoutProps) => {
  return (
    // pt-20 clears the fixed nav (≈72px) on all screens; px scales up on wider viewports.
    <div className="py-4 px-5 md:px-8 mx-auto max-w-screen-xl min-h-dvh min-w-screen pt-20">
      {children}
    </div>
  );
};
