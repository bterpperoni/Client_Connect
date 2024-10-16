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
    width: "50%",
    margin: "auto",
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 6px rgba(0, 0 , 0, 0.1)",
  },
};

export default function CustomModal({
  isOpen,
  onRequestClose,
  title,
  children,
}: CustomModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Add Task"
    >
      <div>
        <h2>{title}</h2>
        <button
          className="absolute top-8 cursor-pointer rounded-md bg-purple-800 px-4 py-2 text-2xl font-bold text-white hover:bg-purple-950"
          onClick={onRequestClose}
        >
          Close
        </button>
        <div>{children}</div>
      </div>
    </Modal>
  );
}
