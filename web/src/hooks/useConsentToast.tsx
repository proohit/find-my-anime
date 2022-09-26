import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  CloseButton,
  HStack,
  ToastId,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRef } from "react";

type UseConsentToastOptions = {
  onOptOut: () => void;
  onClose?: () => void;
};

export const useConsentToast = (options: UseConsentToastOptions) => {
  const toast = useToast();
  const toastIdRef = useRef<ToastId | null>(null);
  const { onOptOut, onClose } = options;

  const showConsentToast = () => {
    if (toastIdRef.current) {
      return;
    }
    const newToastId = toast({
      position: "bottom",
      duration: 999999,
      render: () => (
        <Alert status="info" variant="solid">
          <AlertIcon />
          <HStack>
            <VStack alignItems="flex-start">
              <AlertTitle>Usage data collection</AlertTitle>
              <AlertDescription>
                The app collects usage data of the api. All data is completely
                anonymous and cannot be traced back to you. If you want to opt
                out, please click the following button.
              </AlertDescription>
            </VStack>
            <Button onClick={onOptOut} w="50%">
              Opt out
            </Button>
          </HStack>
          <CloseButton
            alignSelf="flex-start"
            position="relative"
            right={-1}
            top={-1}
            onClick={handleClose}
          />
        </Alert>
      ),
    });
    toastIdRef.current = newToastId;
  };

  const closeConsentToast = () => {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
      toastIdRef.current = null;
    }
  };

  const handleClose = () => {
    closeConsentToast();
    onClose?.();
  };

  return { showConsentToast, closeConsentToast };
};
