import Header from "@/components/common/Header2";

const AuthLayout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="flex justify-center">{children}</div>
    </>
  );
};

export default AuthLayout;
