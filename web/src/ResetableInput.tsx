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
};

const ResetableInput: FC<Props> = ({ onReset, ...props }) => {
  return (
    <InputGroup>
      <Input {...props} />
      {props.value && (
        <InputRightElement>
          <CloseButton onClick={onReset} />
        </InputRightElement>
      )}
    </InputGroup>
  );
};

export default ResetableInput;
