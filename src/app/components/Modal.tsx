import * as React from "react";
import HomeModalSignUpForm from "./HomeModalSignUpForm";
import HomeModalCodeForm from "./HomeModalCodeForm";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

type AlertModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed flex
        items-center justify-center
        top-0 left-0 z-10 w-full h-full"
    >
      <div
        className="bg-[#02001A] rounded-2xl
          shadow-lg p-6
          flex items-center justify-center
          w-[80%] md:w-[60%] lg:w-[35%] relative border-[1px] border-[#FFFFFF40]"
      >
        <button
          className="absolute top-6 right-6
             text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &#x2715;
        </button>
        {children}
      </div>
    </div>
  );
};

const AlertModal = ({ isOpen, onClose }: AlertModalProps) => {
  const [step, setStep] = React.useState(0);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {step == 0 && <HomeModalSignUpForm onSuccess={() => setStep(1)} />}

      {step == 1 && <HomeModalCodeForm onSuccess={() => onClose()} />}
    </Modal>
  );
};

export default AlertModal;
