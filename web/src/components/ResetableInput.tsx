import {
  CloseButton,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
} from "@chakra-ui/react";
import { FC } from "react";

type Props = InputProps & {
  onReset: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
};

const ResetableInput: FC<Props> = ({ onReset, inputRef, ...props }) => {
  return (
    <InputGroup>
      <Input {...props} ref={inputRef} />
      {props.value && (
        <InputRightElement>
          <CloseButton onClick={onReset} />
        </InputRightElement>
      )}
    </InputGroup>
  );
};

export default ResetableInput;
