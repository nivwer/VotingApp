import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useThemeInfo } from "../../../../../hooks/Theme";
import {
  useUserProfileUpdateMutation,
  useGetCountriesQuery,
} from "../../../../../api/accountsAPISlice";
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  InputGroup,
  Stack,
} from "@chakra-ui/react";
import { FaLink } from "react-icons/fa6";
import CustomTextInput from "../../../../../components/Form/CustomTextInput/CustomTextInput";
import CustomSelect from "../../../../../components/Form/CustomSelect/CustomSelect";
import CustomTextarea from "../../../../../components/Form/CustomTextarea/CustomTextarea";

function ProfileForm({ profile = false }) {
  const { ThemeColor } = useThemeInfo();
  const { csrftoken } = useSelector((state) => state.session);
  const { register, handleSubmit, watch, formState, setError, setValue } = useForm();
  const { errors } = formState;
  const { data: dataCountries } = useGetCountriesQuery();
  const [updateProfile, { isLoading }] = useUserProfileUpdateMutation();
  const [countries, setCountries] = useState(false);
  const selectedCountry = watch("country");
  const [country, setCountry] = useState(profile.country);
  const [filteredCities, setFilteredCities] = useState(false);
  const selectedPicture = watch("profile_picture");
  const isCities = countries && filteredCities && country !== "";
  const socialLinks = ["social_link_one", "social_link_two", "social_link_three"];

  // Submit.
  const onSubmit = handleSubmit(async (data) => {
    const dataMutation = { headers: { "X-CSRFToken": csrftoken }, body: data };
    try {
      const res = await updateProfile({ ...dataMutation });
      if (res.error) {
        for (const fieldName in res.error.data) {
          setError(fieldName, { message: res.error.data[fieldName][0] });
        }
      }
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    dataCountries ? setCountries(dataCountries.list) : setCountries(false);
  }, [dataCountries]);

  useEffect(() => {
    if (selectedCountry || selectedCountry === "") {
      setCountry(selectedCountry);
      if (selectedCountry !== country) setValue("city", "");
    }
  }, [selectedCountry]);

  useEffect(() => {
    countries && country
      ? setFilteredCities(countries.find((c) => c.name === country)?.cities)
      : setFilteredCities(false);
  }, [country, countries]);

  return (
    <Box py={1}>
      {profile && (
        <form onSubmit={onSubmit}>
          <Stack spacing={5}>
            {/* Name. */}
            <FormControl isInvalid={errors.name} isDisabled={isLoading}>
              <FormLabel children={"Name"} htmlFor="name" fontWeight={"bold"} />
              <CustomTextInput
                name={"name"}
                defaultValue={profile.name}
                placeholder="Enter your name."
                register={register}
                requirements={{ req: true, minL: 3, maxL: 32 }}
                borderRadius={"md"}
                size={"sm"}
              />
              {errors.name && <FormErrorMessage children={errors.name.message} />}
            </FormControl>

            {/* Bio. */}
            <FormControl isInvalid={errors.bio} isDisabled={isLoading}>
              <FormLabel children={"Biography"} htmlFor="bio" fontWeight={"bold"} />
              <CustomTextarea
                name={"bio"}
                defaultValue={profile.bio}
                placeholder="Enter your biography."
                register={register}
                requirements={{ maxL: 513 }}
                size={"sm"}
                borderRadius={"md"}
              />
              {errors.bio && <FormErrorMessage children={errors.bio.message} />}
            </FormControl>

            {/* Profile picture. */}
            <HStack flexDir={{ base: "column", sm: "row" }} spacing={{ base: 5, sm: 0 }}>
              <FormControl isInvalid={errors.profile_picture} isDisabled={isLoading}>
                <FormLabel children={"Picture"} htmlFor="profile_picture" fontWeight={"bold"} />
                <CustomTextInput
                  name={"profile_picture"}
                  defaultValue={profile.profile_picture}
                  placeholder="Enter your image URL."
                  register={register}
                  requirements={{ maxL: 200 }}
                  type="url"
                  size={"sm"}
                />
                {errors.profile_picture && (
                  <FormErrorMessage children={errors.profile_picture.message} />
                )}
              </FormControl>
              <Flex justifyContent={"center"} alignItems={"center"} pl={{ base: 0, sm: "30px" }}>
                <Avatar src={selectedPicture} size="xl" />
              </Flex>
            </HStack>

            {/* Pronouns. */}
            <FormControl isDisabled={isLoading}>
              <FormLabel children={"Pronouns"} htmlFor="pronouns" fontWeight={"bold"} />
              <CustomSelect
                name={"pronouns"}
                register={register}
                defaultValue={profile.pronouns}
                placeholder="Don't specify"
                borderRadius={"md"}
                size={"sm"}
              >
                <option children={"they/them"} value="they/them" />
                <option children={"she/her"} value="she/her" />
                <option children={"he/him"} value="he/him" />
              </CustomSelect>
            </FormControl>

            {/* Website link. */}
            <FormControl isInvalid={errors.website_link} isDisabled={isLoading}>
              <FormLabel children={"Website Link"} htmlFor="website_link" fontWeight={"bold"} />
              <InputGroup>
                <Flex alignItems="center" opacity={0.8} px="10px" fontSize="lg">
                  <FaLink />
                </Flex>
                <CustomTextInput
                  name={"website_link"}
                  defaultValue={profile.website_link}
                  placeholder="Enter your website URL."
                  register={register}
                  requirements={{ maxL: 200 }}
                  type="url"
                  size={"sm"}
                />
              </InputGroup>
              {errors.website_link && <FormErrorMessage children={errors.website_link.message} />}
            </FormControl>

            {/* Social Links. */}
            <FormControl>
              <FormLabel children={"Social Links"} fontWeight={"bold"} />
              <Stack>
                {socialLinks.map((link, i) => (
                  <FormControl key={i} isInvalid={errors[link]} isDisabled={isLoading}>
                    <InputGroup>
                      <Flex alignItems="center" opacity={0.8} px="10px" fontSize="lg">
                        <FaLink />
                      </Flex>
                      <CustomTextInput
                        name={link}
                        defaultValue={profile[link]}
                        placeholder={"Enter your social media URL."}
                        register={register}
                        requirements={{ maxL: 200 }}
                        type="url"
                        size={"sm"}
                      />
                    </InputGroup>
                    {errors[link] && <FormErrorMessage children={errors[link].message} />}
                  </FormControl>
                ))}
              </Stack>
            </FormControl>

            {/* Country. */}
            {countries && (
              <FormControl isInvalid={errors.country} isDisabled={isLoading}>
                <FormLabel children={"Country"} htmlFor="country" fontWeight={"bold"} />
                <CustomSelect
                  name={"country"}
                  defaultValue={profile.country}
                  placeholder="Don't specify"
                  register={register}
                  size="sm"
                  borderRadius={"md"}
                >
                  {countries.map((country, index) => (
                    <option children={country.name} key={index} value={country.name} />
                  ))}
                </CustomSelect>
                {errors.country && <FormErrorMessage children={errors.country.message} />}
              </FormControl>
            )}

            {/* City. */}
            {isCities && (
              <FormControl isInvalid={errors.city} isDisabled={isLoading}>
                <FormLabel children={"City"} htmlFor="city" fontWeight={"bold"} />
                <CustomSelect
                  name={"city"}
                  defaultValue={profile.city}
                  placeholder="Don't specify"
                  register={register}
                  size="sm"
                  borderRadius={"md"}
                >
                  {filteredCities.map((city, index) => (
                    <option children={city} key={index} value={city} />
                  ))}
                </CustomSelect>
                {errors.city && <FormErrorMessage children={errors.city.message} />}
              </FormControl>
            )}

            <Flex w={"100%"} justify={"center"}>
              <Button
                type="submit"
                isLoading={isLoading}
                loadingText="Save profile"
                colorScheme={ThemeColor}
                size={"sm"}
                children={"Save profile"}
                borderRadius={"3xl"}
                px={"28px"}
              />
            </Flex>
          </Stack>
        </form>
      )}
    </Box>
  );
}

export default ProfileForm;
