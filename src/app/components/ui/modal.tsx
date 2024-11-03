"use client";

import Modal from "react-modal";

interface CustomModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  title: string;
  children: React.ReactNode;
}

const customStyles = {
  content: {
    width: "80%",
    margin: "auto",
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
    zIndex: "1000",
  },
};

export default function CustomModal({
  isOpen,
  onRequestClose,
  title,
  children,
}: CustomModalProps) {
  Modal.setAppElement("#app");

  return (
    <div id="app" className="flex justify-end">
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={customStyles}
        contentLabel="Add Task"
      >
        <div>
          <h2>{title}</h2>
          <div className="flex flex-col justify-center">
            <div>{children}</div>
            <div className="w-full flex flex-row justify-center">
              <button
                className="relative text-center w-[25%] mt-2 cursor-pointer rounded-md bg-red-800 px-4 py-2 md:text-md text-sm font-bold text-white hover:bg-white hover:text-red-800 hover:border-red-800 border-2"
                onClick={onRequestClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
