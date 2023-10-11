// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useUpdateProfileMutation } from "../../../api/profileApiSlice";
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
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Stack,
  Textarea,
} from "@chakra-ui/react";
// Icons.
import { FaImage, FaLink } from "react-icons/fa6";
// Countries
import countriesData from "../../../assets/countries.json";
import { useSelector } from "react-redux";

// Component.
function ProfileForm({ profile = false }) {
  const { isDark, ThemeColor } = useThemeInfo();
  const session = useSelector((state) => state.session);

  // React hook form.
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    setValue,
  } = useForm();

  // Request to update profile.
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  // Submit.
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateProfile({
        profile: data,
        headers: { Authorization: `Token ${session.token}` },
      });

      // If server error.
      if (res.error) {
        for (const fieldName in res.error.data) {
          setError(fieldName, {
            message: res.error.data[fieldName][0],
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  });

  // Countries.
  const [countries, setCountries] = useState(false);

  useEffect(() => {
    setCountries(countriesData["countries"]);
  }, []);

  // Country.
  const selectedCountry = watch("country");
  const [country, setCountry] = useState(profile.country);

  useEffect(() => {
    if (selectedCountry || selectedCountry === "") {
      setCountry(selectedCountry);
      if (selectedCountry !== country) {
        setValue("city", "");
      }
    }
  }, [selectedCountry]);

  // City.
  const [filteredCities, setFilteredCities] = useState(false);

  useEffect(() => {
    if (countries && country) {
      setFilteredCities(countries.find((c) => c.name === country)?.cities);
    } else {
      setFilteredCities(false);
    }
  }, [country, countries]);

  const isCities = countries && filteredCities && country !== "";

  // Profile Picture.
  const selectedPicture = watch("profile_picture");

  const profilePicture =
    selectedPicture || selectedPicture === ""
      ? selectedPicture
      : profile.profile_picture;

  // Social Links.
  const socialLinks = [
    {
      label: "Social Links",
      name: "social_link_one",
      default_value: profile.social_link_one,
    },
    {
      name: "social_link_two",
      default_value: profile.social_link_two,
    },
    {
      name: "social_link_three",
      default_value: profile.social_link_two,
    },
  ];

  const focusBorderColor = isDark ? "whiteAlpha.600" : "blackAlpha.700";

  return (
    <Box py={1} px={2}>
      {profile && (
        <form onSubmit={onSubmit}>
          <Stack spacing={6}>
            <Stack textAlign="start" spacing={4}>
              <Flex w={"100%"} justifyContent={"space-between"} flexDir={"row"}>
                <Flex
                  justifyContent={"center"}
                  alignItems={"center"}
                  pr={"30px"}
                >
                  <Avatar
                    w={"150px"}
                    h={"150px"}
                    bg={"gray.400"}
                    size="xl"
                    src={profilePicture}
                  />
                </Flex>
                <Stack spacing={4} w={"100%"}>
                  <HStack justifyContent={"center"}>
                    {/* Name. */}
                    <FormControl
                      isDisabled={isLoading}
                      isInvalid={errors.profile_name}
                    >
                      <FormLabel htmlFor="profile_name" fontWeight={"bold"}>
                        Name
                      </FormLabel>
                      <InputGroup size="sm">
                        <Input
                          {...register("profile_name", {
                            required: "This field is required.",
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
                          borderRadius={"md"}
                          size={"sm"}
                          fontWeight={"medium"}
                          focusBorderColor={focusBorderColor}
                        />
                        <InputRightElement width="auto" mx={"4px"}>
                          <FormControl>
                            <Select
                              size={"xs"}
                              opacity={isDark ? 0.9 : 0.7}
                              fontWeight={"semibold"}
                              variant={"filled"}
                              borderRadius={"md"}
                              {...register("pronouns")}
                              defaultValue={profile.pronouns}
                              placeholder="Don't specify"
                            >
                              <option value="they/them">they/them</option>
                              <option value="she/her">she/her</option>
                              <option value="he/him">he/him</option>
                            </Select>
                          </FormControl>
                        </InputRightElement>
                      </InputGroup>
                      {/* Handle errors. */}
                      {errors.profile_name && (
                        <FormErrorMessage>
                          {errors.profile_name.message}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </HStack>

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
                      size={"sm"}
                      fontWeight={"medium"}
                      borderRadius={"md"}
                      focusBorderColor={focusBorderColor}
                      resize={"none"}
                    />
                    {/* Handle errors. */}
                    {errors.bio && (
                      <FormErrorMessage>{errors.bio.message}</FormErrorMessage>
                    )}
                  </FormControl>
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
                focusBorderColor={focusBorderColor}
                icon={<FaImage />}
              />

              {/* Website link. */}
              <ProfileInputURL
                register={register}
                label={"Website Link"}
                name={"website_link"}
                placeholder={"Enter your website URL."}
                defaultValue={profile.website_link}
                isLoading={isLoading}
                errors={errors}
                focusBorderColor={focusBorderColor}
                icon={<FaLink />}
              />

              {/* Social links. */}
              <Stack>
                {socialLinks.map((link, index) => (
                  <ProfileInputURL
                    key={index}
                    register={register}
                    label={link.label}
                    name={link.name}
                    placeholder={"Enter your social media URL."}
                    defaultValue={link.default_value}
                    isLoading={isLoading}
                    errors={errors}
                    focusBorderColor={focusBorderColor}
                    icon={<FaLink />}
                  />
                ))}
              </Stack>

              {/* Country. */}
              {countries && (
                <FormControl isDisabled={isLoading} isInvalid={errors.country}>
                  <FormLabel htmlFor="country" fontWeight={"bold"}>
                    Country
                  </FormLabel>
                  <Select
                    {...register("country")}
                    defaultValue={profile.country}
                    placeholder="Don't specify"
                    variant={"filled"}
                    size="sm"
                    opacity={isDark ? 0.9 : 0.7}
                    fontWeight={"semibold"}
                    borderRadius={"lg"}
                    focusBorderColor={focusBorderColor}
                  >
                    {countries.map((country, index) => (
                      <option key={index} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </Select>
                  {/* Handle errors. */}
                  {errors.country && (
                    <FormErrorMessage>
                      {errors.country.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              )}

              {/* City. */}
              {isCities && (
                <FormControl isDisabled={isLoading} isInvalid={errors.city}>
                  <FormLabel htmlFor="city" fontWeight={"bold"}>
                    City
                  </FormLabel>

                  <Select
                    {...register("city")}
                    defaultValue={profile.city}
                    placeholder="Don't specify"
                    variant={"filled"}
                    size="sm"
                    opacity={isDark ? 0.9 : 0.7}
                    fontWeight={"semibold"}
                    borderRadius={"lg"}
                    focusBorderColor={focusBorderColor}
                  >
                    {filteredCities.map((city, index) => (
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
            <Box>
              <Button
                isLoading={isLoading}
                loadingText="Save profile"
                size={"sm"}
                type="submit"
                colorScheme={ThemeColor}
              >
                Save profile
              </Button>
            </Box>
          </Stack>
        </form>
      )}
    </Box>
  );
}

export default ProfileForm;
