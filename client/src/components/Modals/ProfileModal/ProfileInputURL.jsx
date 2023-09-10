// Components.
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
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
}) {
  return (
    <FormControl isDisabled={isLoading} isInvalid={errors[name]}>
      {label && (
        <FormLabel htmlFor="website_link" fontWeight={"bold"}>
          {label}
        </FormLabel>
      )}
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
      {/* Handle errors. */}
      {errors.name && (
        <FormErrorMessage>{errors.name.message}</FormErrorMessage>
      )}
    </FormControl>
  );
}

export default ProfileInputURL;
