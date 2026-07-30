const Container = ({ children }: React.PropsWithChildren) => {
  return <div className="mx-auto w-full max-w-5xl flex-1 px-4 md:px-6">{children}</div>;
};

export default Container;
