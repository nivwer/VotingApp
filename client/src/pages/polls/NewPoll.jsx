// Hooks.
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreatePollMutation } from "../../api/pollApiSlice";

// Page.
function NewPoll() {
  const navigate = useNavigate();
  const session = useSelector((state) => state.session);
  const [createPoll, { isLoading, isError }] = useCreatePollMutation();
  // Options list.
  const [optionList, setOptionList] = useState([]);
  // React hook form.
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  // Send user data.
  const onSubmit = handleSubmit(async (data) => {
    try {
      const pollData = {
        title: data.title,
        description: data.description,
        privacy: data.privacy,
        category: data.category,
        options: optionList,
      };

      await createPoll({
        poll: pollData,
        token: session.token,
      });
      navigate("/user/polls");
    } catch (error) {
      console.error(error);
    }
  });

  // Remove the options.
  const handleDeleteOption = (indexToDelete) => {
    const updatedOptions = optionList.filter(
      (_, index) => index !== indexToDelete
    );
    setOptionList(updatedOptions);
  };

  return (
    <>
      {/* Create poll form. */}
      <form onSubmit={onSubmit}>
        {/* Title. */}
        <label htmlFor="title">Title</label>
        <input
          {...register("title", {
            required: {
              value: true,
              message: "Title is required",
            },
            maxLength: {
              value: 113,
              message: "Max 113 digits",
            },
          })}
          type="text"
        />
        {/* Handle errors. */}
        {errors.title && <span>{errors.title.message}</span>}

        {/* Title. */}
        <label htmlFor="description">Description</label>
        <input
          {...register("description", {
            required: false,
            maxLength: {
              value: 513,
              message: "Max 513 digits",
            },
          })}
          type="text"
        />
        {/* Handle errors. */}
        {errors.description && <span>{errors.description.message}</span>}

        {/* Privacy. */}
        <label htmlFor="privacy">Privacy</label>
        <select {...register("privacy")}>
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="friends_only">Friends</option>
        </select>

        {/* Category. */}
        <label htmlFor="category">Category</label>
        <input
          {...register("category", {
            required: false,
            maxLength: {
              value: 24,
              message: "Max 24 digits",
            },
          })}
          type="text"
        />
        {/* Handle errors. */}
        {errors.category && <span>{errors.category.message}</span>}

        {/* Options. */}

        {/* Options */}
        <label htmlFor="options">Options</label>
        <input {...register("options")} type="text" />

        <button
          type="button"
          onClick={() => {
            const optionValue = watch("options").trim();
            if (optionValue.length >= 1) {
              setOptionList([...optionList, optionValue]);
              reset({ options: "" }); // Clear the input field
            }
          }}
        >
          Add Option
        </button>

        <ul>
          {optionList.map((option, index) => (
            <li key={index}>
              {option}
              <button type="button" onClick={() => handleDeleteOption(index)}>
                Delete
              </button>
            </li>
          ))}
        </ul>

        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default NewPoll;
