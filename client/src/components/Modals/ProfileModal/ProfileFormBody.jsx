// Hooks.
import { useEffect, useState } from "react";
import { useThemeInfo } from "../../../hooks/Theme";
// Components.
import ProfileInputURL from "./ProfileInputURL";
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Textarea,
  useRadio,
} from "@chakra-ui/react";
// Icons.
import { FaMars, FaVenus } from "react-icons/fa6";
// Countries
import countriesData from "../../../../public/countries.json";

// Component.
function ProfileFormBody({
  profile,
  register,
  errors,
  gender,
  watch,
  setGender,
  styles,
  isLoading,
}) {
  const { ThemeColor, isDark } = useThemeInfo();

  const [countries, setCountries] = useState(false);

  useEffect(() => {
    setCountries(countriesData["countries"]);
  }, []);

  const selectedCountry = watch("country");
  const isCountry =
    selectedCountry || selectedCountry === ""
      ? selectedCountry
      : profile.country;

  const filteredCities =
    countries &&
    isCountry &&
    countries.find((country) => country.name === isCountry)?.cities;

  const socialLinks = [
    {
      label: "Website Link",
      name: "website_link",
      placeholder: "Enter your website URL.",
      default_value: profile.website_link,
    },
    {
      label: "Social Links",
      name: "social_link_one",
      placeholder: "Enter your social media URL.",
      default_value: profile.social_link_one,
    },
    {
      name: "social_link_two",
      placeholder: "Enter your social media URL.",
      default_value: profile.social_link_two,
    },
    {
      name: "social_link_three",
      placeholder: "Enter your social media URL.",
      default_value: profile.social_link_two,
    },
  ];

  return (
    <>
      <Stack textAlign="start" spacing={3}>
        <Flex w={"100%"} justifyContent={"space-between"}>
          <Box pr={"20px"}>
            <Avatar
              size="3xl"
              name="Christian Nwamba"
              src="https://bit.ly/code-beast"
            />
          </Box>
          <Stack spacing={4} w={"100%"}>
            {/* Title. */}
            <FormControl isDisabled={isLoading} isInvalid={errors.profile_name}>
              <FormLabel htmlFor="profile_name" fontWeight={"bold"}>
                Name
              </FormLabel>
              <Input
                {...register("profile_name", {
                  required: {
                    value: true,
                    message: "This field is required.",
                  },
                  minLength: {
                    value: 3,
                    message: "Minimum 3 characters allowed.",
                  },
                  maxLength: {
                    value: 32,
                    message: "Maximum 32 characters allowed.",
                  },
                })}
                type="text"
                defaultValue={profile.profile_name}
                placeholder="Enter your name."
                focusBorderColor={styles.focusBorderColor}
              />
              {/* Handle errors. */}
              {errors.profile_name && (
                <FormErrorMessage>
                  {errors.profile_name.message}
                </FormErrorMessage>
              )}
            </FormControl>
            <HStack>
              {/* Birthdate. */}
              <FormControl isDisabled={isLoading} isInvalid={errors.birthdate}>
                <FormLabel htmlFor="birthdate" fontWeight={"bold"}>
                  Birthdate
                </FormLabel>
                <Input
                  {...register("birthdate")}
                  type="date"
                  defaultValue={profile.birthdate}
                  placeholder="Select your birthdate."
                  focusBorderColor={styles.focusBorderColor}
                />
                {/* Handle errors. */}
                {errors.birthdate && (
                  <FormErrorMessage>
                    {errors.birthdate.message}
                  </FormErrorMessage>
                )}
              </FormControl>
              {/* Gender. */}
              <FormControl isDisabled={isLoading} isInvalid={errors.gender}>
                <FormLabel htmlFor="gender" fontWeight={"bold"}>
                  Gender
                </FormLabel>
                <RadioGroup
                  onChange={(value) => {
                    setGender(value);
                  }}
                  value={gender}
                >
                  <Stack direction="row">
                    <Radio value="male" colorScheme={ThemeColor}>
                      Male
                    </Radio>
                    <Radio value="female" colorScheme={ThemeColor}>
                      Female
                    </Radio>
                    <Radio value="other" colorScheme={ThemeColor}>
                      Other
                    </Radio>
                    <Box as={Radio} value="other"  >
                      <Button  colorScheme={ThemeColor}>
                        <FaMars />
                      </Button>
                    </Box>
                  </Stack>
                </RadioGroup>
                {/* Handle errors. */}
                {errors.gender && (
                  <FormErrorMessage>{errors.gender.message}</FormErrorMessage>
                )}
              </FormControl>
            </HStack>
          </Stack>
        </Flex>
        {/* Profile picture. */}
        <ProfileInputURL
          register={register}
          label="Profile Picture"
          name="profile_picture"
          placeholder="Enter your image URL."
          defaultValue={profile.profile_picture}
          isLoading={isLoading}
          errors={errors}
          styles={styles}
        />

        {/* Bio. */}
        <FormControl isDisabled={isLoading} isInvalid={errors.bio}>
          <FormLabel htmlFor="bio" fontWeight={"bold"}>
            Biography
          </FormLabel>
          <Textarea
            {...register("bio", {
              maxLength: {
                value: 513,
                message: "Maximum 513 characters allowed.",
              },
            })}
            type="text"
            defaultValue={profile.bio}
            placeholder="Enter your biography."
            focusBorderColor={styles.focusBorderColor}
            resize={"none"}
          />
          {/* Handle errors. */}
          {errors.bio && (
            <FormErrorMessage>{errors.bio.message}</FormErrorMessage>
          )}
        </FormControl>

        {socialLinks.map((link, index) => (
          <ProfileInputURL
            key={index}
            register={register}
            label={link.label}
            name={link.name}
            placeholder={link.placeholder}
            defaultValue={link.default_value}
            isLoading={isLoading}
            errors={errors}
            styles={styles}
          />
        ))}

        {/* Country. */}
        {countries && (
          <FormControl isDisabled={isLoading} isInvalid={errors.country}>
            <FormLabel htmlFor="country" fontWeight={"bold"}>
              Country
            </FormLabel>
            <Select
              {...register("country")}
              defaultValue={profile.country}
              placeholder="Select your country"
              focusBorderColor={styles.focusBorderColor}
            >
              {countries.map((country, index) => (
                <option key={index} value={country.name}>
                  {country.name}
                </option>
              ))}
            </Select>
            {/* Handle errors. */}
            {errors.country && (
              <FormErrorMessage>{errors.country.message}</FormErrorMessage>
            )}
          </FormControl>
        )}

        {/* City. */}
        {countries && isCountry && (
          <FormControl isDisabled={isLoading} isInvalid={errors.city}>
            <FormLabel htmlFor="city" fontWeight={"bold"}>
              City
            </FormLabel>
            <Select
              {...register("city")}
              defaultValue={profile.city}
              placeholder="Select your city"
              focusBorderColor={styles.focusBorderColor}
            >
              {filteredCities &&
                filteredCities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
            </Select>
            {/* Handle errors. */}
            {errors.city && (
              <FormErrorMessage>{errors.city.message}</FormErrorMessage>
            )}
          </FormControl>
        )}
      </Stack>
    </>
  );
}

export default ProfileFormBody;
