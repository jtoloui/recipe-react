type LayoutProps = {
  children: React.ReactNode;
};
export const Layout = ({ children }: LayoutProps) => {
  return (
    // pt-28 clears the fixed nav (~72px) AND leaves comfortable breathing room
    // between the navbar and the page content; px scales up on wider viewports.
    <div className="py-4 px-5 md:px-8 mx-auto max-w-screen-xl min-h-dvh min-w-screen pt-28">
      {children}
    </div>
  );
};
