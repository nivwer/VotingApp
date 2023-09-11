// Components.
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
} from "@chakra-ui/react";

// Component.
function ProfileInputURL({
  register,
  defaultValue,
  placeholder,
  label,
  name,
  isLoading,
  errors,
  styles,
  icon,
}) {
  return (
    <FormControl isDisabled={isLoading} isInvalid={errors[name]}>
      {label && (
        <FormLabel  htmlFor="website_link" fontWeight={"bold"}>
          {label}
        </FormLabel>
      )}
      <InputGroup>
      <Flex alignItems={"center"} opacity={0.7} px={"10px"} fontSize={"lg"} >{icon && icon}</Flex>
        <Input
          {...register(name, {
            maxLength: {
              value: 200,
              message: "Maximum 200 characters allowed.",
            },
          })}
          type="url"
          defaultValue={defaultValue}
          placeholder={placeholder}
          focusBorderColor={styles.focusBorderColor}
        />
      </InputGroup>
      {/* Handle errors. */}
      {errors.name && (
        <FormErrorMessage>{errors.name.message}</FormErrorMessage>
      )}
    </FormControl>
  );
}

export default ProfileInputURL;
