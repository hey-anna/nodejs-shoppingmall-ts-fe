import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUIStore } from "../../stores/uiStore";

const ToastMessage = () => {
  const message = useUIStore((s) => s.message);
  const status = useUIStore((s) => s.status);
  const hide = useUIStore((s) => s.hide);

  useEffect(() => {
    if (!message || !status) return;

    // status가 ""일 수 있으니 가드가 중요
    toast[status](message, { theme: "colored" });

    // 한번 띄웠으면 초기화(중복 방지)
    hide();
  }, [message, status, hide]);

  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

export default ToastMessage;
