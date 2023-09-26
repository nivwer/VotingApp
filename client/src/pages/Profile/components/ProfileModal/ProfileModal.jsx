// Hooks.
import { useEffect, useState } from "react";
import { useThemeInfo } from "../../../../hooks/Theme";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  useReadProfileQuery,
  useUpdateProfileMutation,
} from "../../../../api/profileApiSlice";
// Actions.
import { updateProfileAction } from "../../../../features/auth/sessionSlice";
// Components.
import CustomProgress from "../../../../components/Progress/CustomProgress";
import ProfileFormBody from "./ProfileFormBody";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

// Component.
function ProfileModal({ profile = false, buttonStyles }) {
  const dispatch = useDispatch();
  const { ThemeColor, isDark } = useThemeInfo();
  const session = useSelector((state) => state.session);
  const { username } = useParams();
  const [data, setData] = useState(false);

  // Modal.
  const { isOpen, onOpen, onClose } = useDisclosure();

  // React hook form.
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setError,
    setValue,
  } = useForm();

  // Query to update the profile data in the global state.
  const [skip, setSkip] = useState(true);
  const { data: dataProfile } = useReadProfileQuery(data, { skip });

  // Request to update profile.
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  // Submit.
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateProfile({
        profile: data,
        headers: {
          Authorization: `Token ${session.token}`,
        },
      });

      if (res.data) {
        onClose();
        setSkip(false);
      }

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

  // Update data to fetchs.
  useEffect(() => {
    if (session.token) {
      setData({
        headers: { Authorization: `Token ${session.token}` },
        username: username,
      });
    } else {
      setData({ username: username });
    }
  }, [username, session.token]);

  // Update Profile.
  useEffect(() => {
    if (dataProfile && username === session.user.username) {
      dispatch(updateProfileAction({ profile: dataProfile.profile }));
      setSkip(true);
    }
  }, [dataProfile]);

  return (
    <>
      {/* Button to open the Modal. */}
      <Button onClick={onOpen} {...buttonStyles}>
        Edit profile
      </Button>

      {/* Modal. */}
      <Modal size={"2xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          bg={isDark ? "black" : "white"}
          color={isDark ? "whiteAlpha.900" : "blackAlpha.900"}
          outline={"2px solid"}
          outlineColor={isDark ? "whiteAlpha.300" : "blackAlpha.200"}
          borderRadius="14px"
          p={"5px"}
        >
          {isLoading && <CustomProgress />}
          {/* Header. */}
          <ModalHeader>Edit profile</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={onSubmit}>
            {/* Body. */}
            <ModalBody pb={6}>
              <ProfileFormBody
                profile={profile}
                register={register}
                errors={errors}
                watch={watch}
                reset={reset}
                setValue={setValue}
                isLoading={isLoading}
              />
            </ModalBody>

            {/* Footer. */}
            <ModalFooter>
              <Button
                isDisabled={isLoading}
                type="submit"
                colorScheme={ThemeColor}
                mr={3}
              >
                Save
              </Button>
              <Button
                isDisabled={isLoading}
                onClick={onClose}
                variant={"ghost"}
                colorScheme={"default"}
              >
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfileModal;
