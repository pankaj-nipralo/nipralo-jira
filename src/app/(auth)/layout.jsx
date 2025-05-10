import Header from "@/components/common/Header";

const AuthLayout = ({ children }) => {
  return (
    <>
      <div className="flex justify-center items-center h-[80vh]">{children}</div>
    </>
  );
};

export default AuthLayout;
