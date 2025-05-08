import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";

const WorkspaceLayout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="flex justify-center pt-20">{children}</div>
      <Footer />
    </>
  );
};

export default WorkspaceLayout;
