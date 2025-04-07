import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, PartyPopper } from "lucide-react";
import { motion } from "framer-motion";

export const SuccessModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-[90%] md:max-w-md mx-auto p-4 md:p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AlertDialogHeader className="space-y-3 md:space-y-4">
            <div className="mx-auto flex h-16 w-16 md:h-24 md:w-24 items-center justify-center rounded-full bg-green-100">
              <PartyPopper className="h-8 w-8 md:h-12 md:w-12 text-green-600" />
            </div>
            <AlertDialogTitle className="text-center text-xl md:text-2xl font-semibold text-green-700">
              Order Placed Successfully! 🎉
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm md:text-base text-gray-600">
              Thank you for your custom order! We'll review your requirements
              and contact you soon with more details.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 md:mt-8 flex-col space-y-2">
            <Button
              onClick={() => navigate("/custom-order-history")}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-sm md:text-base py-2 md:py-3"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              View Order History
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full text-sm md:text-base py-2 md:py-3"
            >
              Close
            </Button>
          </AlertDialogFooter>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SuccessModal;
