"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

// Telegram Invitation Modal Component
export function TelegramInviteModal({
  isOpen,
  onClose,
  telegramLink = "https://t.me/your_group_name",
}: {
  isOpen: boolean;
  onClose: () => void;
  telegramLink?: string;
}) {
  const handleJoinTelegram = () => {
    window.open(telegramLink, "_blank");
  };

  return (
    <Modal
      isOpen={isOpen}
      placement="center"
      onOpenChange={onClose}
      backdrop="blur"
    >
      <ModalContent>
        {(onCloseModal: () => void) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 3.767-1.362 5.002-.168.523-.5.697-.82.715-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.248-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.788.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.121.098.155.231.171.325.016.094.037.308.021.475z" />
                </svg>
                <span className="text-xl font-semibold">
                  Join Our Telegram Group
                </span>
              </div>
            </ModalHeader>

            <ModalBody>
              <div className="flex flex-col gap-3">
                <p className="text-base">
                  Connect with our community on Telegram! Get instant updates,
                  exclusive content, and engage with fellow members.
                </p>
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm">What you’ll get:</h4>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Real-time updates and announcements</li>
                    <li>• Direct communication with the team</li>
                    <li>• Exclusive resources and content</li>
                    <li>• Connect with community members</li>
                  </ul>
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button color="default" variant="light" onPress={onCloseModal}>
                Maybe Later
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  handleJoinTelegram();
                  onCloseModal();
                }}
                className="bg-blue-500"
              >
                Join on Telegram
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

// Example usage in App component
export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex px-10 min-h-screen justify-center items-center">
      <Button className="max-w-fit" color="primary" size="lg" onPress={openModal}>
        Join Our Community
      </Button>

      <TelegramInviteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        telegramLink="https://t.me/your_group_name"
      />
    </div>
  );
}
